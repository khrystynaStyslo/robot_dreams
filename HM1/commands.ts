import {
    validateAddCommand,
    validateDeleteCommand,
    validateDoneCommand,
    validateUpdateCommand,
    validateStatsCommand
} from './src/utils/validations';
import * as HabitController from './src/controllers/habit.controller';
import { type Frequency } from './src/types';

export const commands = {
    add: {
        validate: validateAddCommand,
        execute: async (flags: Record<string, string>): Promise<void> => await HabitController.addHabit(flags.name, flags.freq as Frequency)
    },
    list: {
        execute: async (): Promise<void> => await HabitController.listHabits()
    },
    done: {
        validate: validateDoneCommand,
        execute: async (flags: Record<string, string>): Promise<void> => await HabitController.markHabitDone(flags.id)
    },
    delete: {
        validate: validateDeleteCommand,
        execute: async (flags: Record<string, string>): Promise<void> => await HabitController.deleteHabit(flags.id)
    },
    update: {
        validate: validateUpdateCommand,
        execute: async (flags: Record<string, string>): Promise<void> => await HabitController.updateHabit(flags.id, flags.name, flags.freq as Frequency)
    },
    stats: {
        validate: validateStatsCommand,
        execute: async (flags: Record<string, string>): Promise<void> => await HabitController.showStats((flags.period as '7' | '30') || '30')
    }
};