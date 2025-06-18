export enum Frequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export interface Habit {
    id: string;
    name: string;
    freq: Frequency;
    doneOn: Date[];
}

export interface CreateHabitData {
    name: string;
    freq: Frequency
}

export interface UpdateHabitData {
    name?: string;
    freq?: Frequency;
    doneOn?: Date[];
}

export interface Database {
    habits: Habit[];
}

export interface CLICommand {
    command: string;
    flags: Record<string, string>;
}

export interface HabitStats {
    habitName: string;
    completion: number;
    completed: number;
    expected: number;
}