import type { Habit, HabitStats } from '../types';

export const formatHabitsTable = (habits: Habit[]): void => {
  if (habits.length === 0) {
    console.log('No habits found.');
    return;
  }

  console.log('');
  console.log('ID'.padEnd(15) + 'Name'.padEnd(30) + 'Frequency'.padEnd(15) + 'Last Done');
  console.log('-'.repeat(75));
  
  habits.forEach(habit => {
    const lastDone = habit.doneOn.length > 0 
      ? new Date(Math.max(...habit.doneOn.map(d => new Date(d).getTime()))).toDateString()
      : 'Never';
    
    console.log(
      habit.id.padEnd(15) + 
      habit.name.padEnd(30) + 
      habit.freq.padEnd(15) + 
      lastDone
    );
  });
  console.log('');
}


export const formatStats = (stats: HabitStats[], period: '7' | '30' = '30'): void => {
  if (stats.length === 0) {
    console.log('No habits found.');
    return;
  }

  console.log('');
  console.log(`Habit Statistics (Last ${period} days):`);
  console.log('='.repeat(50));

  stats.forEach(stat => {
    console.log(`${stat.habitName}:`);
    console.log(`  Last ${period} days: ${stat.completion}% (${stat.completed}/${stat.expected})`);
    console.log('');
  });
}

export const showSuccess = (message: string): void => {
  console.log(`✅ ${message}`);
}

export const showError = (message: string): void => {
  console.error(message);
}