export const validateAddCommand = (flags: Record<string, string>): void => {
    if (!flags.name || !flags.freq) {
        throw new Error('Usage: node index.js add --name "<habit name>" --freq <daily|weekly|monthly>');
    }

    if (!['daily', 'weekly', 'monthly'].includes(flags.freq)) {
        throw new Error('Frequency must be: daily, weekly, or monthly');
    }
}

export const validateDoneCommand = (flags: Record<string, string>): void => {
    if (!flags.id) {
        throw new Error('Usage: node index.js done --id <habit_id>');
    }
}

export const validateDeleteCommand = (flags: Record<string, string>): void => {
    if (!flags.id) {
        throw new Error('Usage: node index.js delete --id <habit_id>');
    }
}

export const validateUpdateCommand = (flags: Record<string, string>): void => {
    if (!flags.id) {
        throw new Error('Usage: node index.js update --id <habit_id> [--name "<new_name>"] [--freq <daily|weekly|monthly>]');
    }

    if (!flags.name && !flags.freq) {
        throw new Error('Please provide at least --name or --freq to update.');
    }

    if (flags.freq && !['daily', 'weekly', 'monthly'].includes(flags.freq)) {
        throw new Error('Frequency must be: daily, weekly, or monthly');
    }
}

export const validateStatsCommand = (flags: Record<string, string>): void => {
    if (flags.period && !['7', '30'].includes(flags.period)) {
        throw new Error('Period must be: 7 or 30');
    }
}