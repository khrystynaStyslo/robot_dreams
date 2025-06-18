import { type CLICommand } from '../types';

export const parseCliArgs = (args: string[]): CLICommand => {
  const command = args[0] || '';

  const flags = args.slice(1).reduce((acc, arg, index, arr) => {
    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      const nextArg = arr[index + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        acc[flagName] = nextArg;
      }
    }
    return acc;
  }, {});

  return { command, flags };
}

export const showUsage = (): void => {
  console.log('Available commands:');
  console.log('  add --name "<habit name>" --freq <daily|weekly|monthly>');
  console.log('  list');
  console.log('  done --id <habit_id>');
  console.log('  delete --id <habit_id>');
  console.log('  update --id <habit_id> [--name "<new_name>"] [--freq <frequency>]');
  console.log('  stats [--period <7|30>]');
}