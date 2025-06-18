import { parseCliArgs, showUsage } from './src/utils/cli-parser';
import { showError } from './src/utils/output';
import { commands } from './commands';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, flags } = parseCliArgs(args);

  try {
    const commandConfig = commands[command];
    
    if (!commandConfig) {
      showUsage();
      return;
    }

    if (commandConfig.validate) {
      commandConfig.validate(flags);
    }

    await commandConfig.execute(flags);
  } catch (error) {
    showError('Error: ' + error.message);
    process.exit(1);
  }
}

main();