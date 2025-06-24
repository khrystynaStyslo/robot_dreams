import fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import { config } from '../config';

class Router {
  private routes: Map<string, string> = new Map();
  private watchers: fsSync.FSWatcher[] = [];
  
  constructor(private routesDir: string) {}

  async initialize(): Promise<void> {
    await this.scanRoutes(this.routesDir, '/api');

    if (config.hotReload) {
      this.setupHotReload();
    }
  }

  private setupHotReload(): void {
    this.routes.forEach((filePath) => {
      const watcher = fsSync.watch(filePath, () => {
        console.log(`Route file changed: ${filePath}`);
      });

      this.watchers.push(watcher);
    });
  }

  destroy(): void {
    this.watchers.forEach(watcher => watcher.close());
    this.watchers = [];
  }

  private async scanRoutes(dir: string, urlPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      const routeFiles = entries.filter(entry => entry.name === 'route.ts');
      const directories = entries.filter(entry => entry.isDirectory());
      
      routeFiles.forEach(entry => {
        this.routes.set(urlPath, path.join(dir, entry.name));
      });
      
      await Promise.all(directories.map(entry => {
        const newPath = `${urlPath}/${entry.name}`;
        return this.scanRoutes(path.join(dir, entry.name), newPath);
      }));
    } catch (error) {
      console.error(`Failed to scan directory ${dir}:`, error);
    }
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const method = req.method || 'GET';
    const url = req.url || '';
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (this.routes.has(url)) {
      return await this.executeRoute(this.routes.get(url)!, method, req, res);
    }

    const dynamicRoutes = Array.from(this.routes.entries()).filter(([pattern]) => pattern.includes('['));
    const matchedRoute = dynamicRoutes.find(([pattern]) => this.matchDynamic(url, pattern));
    
    if (matchedRoute) {
      const [pattern, filePath] = matchedRoute;
      const params = this.extractParams(url, pattern);
      return await this.executeRoute(filePath, method, req, res, params);
    }

    return false;
  }

  private matchDynamic(url: string, pattern: string): boolean {
    const urlParts = url.split('/');
    const patternParts = pattern.split('/');
    
    if (urlParts.length !== patternParts.length) {
      return false;
    }
    
    return patternParts.every((part, i) => 
      part.startsWith('[') || part === urlParts[i]
    );
  }

  private extractParams(url: string, pattern: string): Record<string, string> {
    const urlParts = url.split('/');
    const patternParts = pattern.split('/');
    const params: Record<string, string> = {};
    
    patternParts.forEach((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const paramName = part.slice(1, -1);
        params[paramName] = urlParts[i];
      }
    });
    return params;
  }

  private async executeRoute(filePath: string, method: string, req: IncomingMessage, res: ServerResponse, params?: Record<string, string>): Promise<boolean> {
    try {
      const routeModule = await import(filePath);
      const handler = routeModule[method];
      
      if (handler) {
        await handler(req, res, params);

        return true;
      } else {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));

        return true;
      }
    } catch (error) {
      console.error('Route execution error:', error);

      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Server error' }));

      return true;
    }
  }
}

export { Router };