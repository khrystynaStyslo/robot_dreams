import type { Habit, HabitStats } from '../types';
import { Frequency } from '../types';
import { getCurrentDate } from './date';

export const calculateHabitStats = (habits: Habit[], period: '7' | '30' = '30'): HabitStats[] => {
  const now = getCurrentDate();
  const periodDaysAgo = new Date(now.getTime() - parseInt(period) * 24 * 60 * 60 * 1000);

  return habits.map(habit => {
    const completedInPeriod = habit.doneOn.filter(date => new Date(date) >= periodDaysAgo).length;
    const expectedInPeriod = getExpectedCompletionsForPeriod(habit.freq, period);
    const completionPercentage = expectedInPeriod > 0 ? Math.round((completedInPeriod / expectedInPeriod) * 100) : 0;

    return {
      habitName: habit.name,
      completion: completionPercentage,
      completed: completedInPeriod,
      expected: expectedInPeriod
    };
  });
}

const getExpectedCompletionsForPeriod = (frequency: Frequency, period: '7' | '30'): number => {
  const days = parseInt(period);
  
  const frequencyCalculators: Record<string, () => number> = {
    [Frequency.DAILY]: () => days,
    [Frequency.WEEKLY]: () => Math.floor(days / 7),
    [Frequency.MONTHLY]: () => Math.floor(days / 30)
  };
  
  return frequencyCalculators[frequency]?.() || 0;
}