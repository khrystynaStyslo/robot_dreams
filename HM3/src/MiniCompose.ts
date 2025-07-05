import { exec, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ServiceConfig {
  build?: string;
  image?: string;
  ports?: Record<string, string>;
  env?: Record<string, string>;
  volumes?: Record<string, string>;
  depends_on?: string[];
}

interface ComposeConfig {
  network?: string;
  services: Record<string, ServiceConfig>;
}

interface DockerCommands {
  buildCommand?: string;
  runCommand: string;
}

class MiniCompose {
  private readonly configPath: string;
  private config: ComposeConfig;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  private loadConfig(): ComposeConfig {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      const config = JSON.parse(configContent) as ComposeConfig;
      
      if (!config.services || Object.keys(config.services).length === 0) {
        throw new Error('Config must contain at least one service');
      }
      
      return config;
    } catch (error) {
      throw new Error(`Failed to load config: ${(error as Error).message}`);
    }
  }

  private async createNetwork(): Promise<void> {
    const networkName = this.config.network || 'mini_default';
    
    return new Promise((resolve, reject) => {
      exec(`docker network create ${networkName} --driver bridge`, (error, stdout, stderr) => {
        if (error && !stderr.includes('already exists')) {
          reject(error);
        } else {
          console.log(`Network ${networkName} created or already exists`);
          resolve();
        }
      });
    });
  }

  private buildDockerCommand(serviceName: string, serviceConfig: ServiceConfig): DockerCommands {
    let command = 'docker run -d';
    
    command += ` --name ${serviceName}`;
    
    const networkName = this.config.network || 'mini_default';
    command += ` --network ${networkName}`;
    
    command += ` --network-alias ${serviceName}`;
    
    if (serviceConfig.ports) {
      Object.entries(serviceConfig.ports).forEach(([host, container]) => {
        command += ` -p ${host}:${container}`;
      });
    }
    
    if (serviceConfig.env) {
      Object.entries(serviceConfig.env).forEach(([key, value]) => {
        command += ` -e ${key}="${value}"`;
      });
    }
    
    if (serviceConfig.volumes) {
      Object.entries(serviceConfig.volumes).forEach(([host, container]) => {
        const absoluteHost = path.resolve(host);
        command += ` -v ${absoluteHost}:${container}`;
      });
    }
    
    if (serviceConfig.image) {
      command += ` ${serviceConfig.image}`;
    } else if (serviceConfig.build) {
      const buildPath = path.resolve(serviceConfig.build);
      const imageName = `mini-compose-${serviceName}:latest`;
      return {
        buildCommand: `docker build -t ${imageName} ${buildPath}`,
        runCommand: command + ` ${imageName}`
      };
    } else {
      throw new Error(`Service ${serviceName} must have either 'image' or 'build' specified`);
    }
    
    return { runCommand: command };
  }

  private async executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Executing: ${command}`);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else {
          if (stdout) console.log(stdout);
          if (stderr) console.log(stderr);
          resolve();
        }
      });
    });
  }

  private async stopService(serviceName: string): Promise<void> {
    try {
      await this.executeCommand(`docker stop ${serviceName}`);
      await this.executeCommand(`docker rm ${serviceName}`);
    } catch (error) {
      console.log(`Service ${serviceName} was not running`);
    }
  }

  private async startService(serviceName: string, serviceConfig: ServiceConfig, startedServices: Set<string>): Promise<void> {
    if (serviceConfig.depends_on) {
      for (const dep of serviceConfig.depends_on) {
        if (!startedServices.has(dep)) {
          throw new Error(`Dependency ${dep} for service ${serviceName} not started`);
        }
      }
    }

    await this.stopService(serviceName);

    const commands = this.buildDockerCommand(serviceName, serviceConfig);
    
    if (commands.buildCommand) {
      await this.executeCommand(commands.buildCommand);
    }
    
    await this.executeCommand(commands.runCommand);
    
    console.log(`Service ${serviceName} started successfully`);
    startedServices.add(serviceName);
  }

  private async resolveStartOrder(): Promise<string[]> {
    const services = Object.keys(this.config.services);
    const resolved: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (serviceName: string): void => {
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected involving ${serviceName}`);
      }
      if (visited.has(serviceName)) {
        return;
      }

      visiting.add(serviceName);
      
      const service = this.config.services[serviceName];
      if (service.depends_on) {
        for (const dep of service.depends_on) {
          if (!this.config.services[dep]) {
            throw new Error(`Service ${serviceName} depends on ${dep} which doesn't exist`);
          }
          visit(dep);
        }
      }
      
      visiting.delete(serviceName);
      visited.add(serviceName);
      resolved.push(serviceName);
    };

    for (const serviceName of services) {
      visit(serviceName);
    }

    return resolved;
  }

  private async attachLogs(): Promise<void> {
    const services = Object.keys(this.config.services);
    const logProcesses: ChildProcess[] = [];
    
    console.log('\n=== Attaching to container logs (Ctrl+C to stop) ===\n');
    
    for (const serviceName of services) {
      const logProcess = exec(`docker logs -f ${serviceName}`);
      
      logProcess.stdout?.on('data', (data: Buffer) => {
        process.stdout.write(`[${serviceName}] ${data.toString()}`);
      });
      
      logProcess.stderr?.on('data', (data: Buffer) => {
        process.stderr.write(`[${serviceName}] ${data.toString()}`);
      });
      
      logProcesses.push(logProcess);
    }
    
    process.on('SIGINT', () => {
      console.log('\n\nStopping log streams...');
      logProcesses.forEach(proc => proc.kill());
      process.exit(0);
    });
    
    return new Promise(() => {});
  }

  async up(): Promise<void> {
    try {
      console.log('Creating network...');
      await this.createNetwork();
      
      console.log('Resolving service dependencies...');
      const startOrder = await this.resolveStartOrder();
      
      console.log('Starting services in order:', startOrder);
      const startedServices = new Set<string>();
      
      for (const serviceName of startOrder) {
        const serviceConfig = this.config.services[serviceName];
        await this.startService(serviceName, serviceConfig, startedServices);
      }
      
      console.log('All services started successfully!');
      
      await this.attachLogs();
      
    } catch (error) {
      console.error('Failed to start services:', (error as Error).message);
      process.exit(1);
    }
  }

  async down(): Promise<void> {
    try {
      const services = Object.keys(this.config.services);
      
      console.log('Stopping services...');
      for (const serviceName of services.reverse()) {
        await this.stopService(serviceName);
      }
      
      const networkName = this.config.network || 'mini_default';
      try {
        await this.executeCommand(`docker network rm ${networkName}`);
        console.log(`Network ${networkName} removed`);
      } catch (error) {
        console.log(`Network ${networkName} removal failed (may be in use)`);
      }
      
      console.log('All services stopped successfully!');
    } catch (error) {
      console.error('Failed to stop services:', (error as Error).message);
    }
  }
}

if (require.main === module) {
  const command = process.argv[2];
  const configFile = process.argv[3] || 'mini-compose.json';
  
  if (!command || !['up', 'down'].includes(command)) {
    console.log('Usage: node MiniCompose.js <up|down> [config-file]');
    process.exit(1);
  }
  
  const composer = new MiniCompose(configFile);
  
  if (command === 'up') {
    composer.up();
  } else if (command === 'down') {
    composer.down();
  }
}