import * as HabitService from '../services/habit.service';
import { formatHabitsTable, showSuccess, formatStats } from '../utils/output';
import { calculateHabitStats } from '../utils/stats';
import { getCurrentDate } from '../utils/date';
import { Frequency, UpdateHabitData } from '../types';

export const addHabit = async (name: string, freq: Frequency): Promise<void> => {
  const habit = await HabitService.createHabit({
    name,
    freq,
  });
  
  showSuccess(`Habit "${habit.name}" added successfully with ID: ${habit.id}`);
}

export const listHabits = async (): Promise<void> => {
  const habits = await HabitService.getAllHabits();
  formatHabitsTable(habits);
}

export const markHabitDone = async (id: string): Promise<void> => {
  const habit = await HabitService.getHabitById(id);
  if (!habit) {
    throw new Error(`Habit with ID ${id} not found.`);
  }

  const today = getCurrentDate();
  today.setHours(0, 0, 0, 0);
  
  const alreadyDone = habit.doneOn.some(date => {
    const doneDate = new Date(date);
    doneDate.setHours(0, 0, 0, 0);
    return doneDate.getTime() === today.getTime();
  });

  if (alreadyDone) {
    showSuccess(`Habit "${habit.name}" is already marked as done today.`);
  } else {
    const updatedDoneOn = [...habit.doneOn, today];
    await HabitService.updateHabit(id, { doneOn: updatedDoneOn });
    showSuccess(`Habit "${habit.name}" marked as done for today!`);
  }
}

export const deleteHabit = async (id: string): Promise<void> => {
  const deletedHabit = await HabitService.deleteHabit(id);
  if (!deletedHabit) {
    throw new Error(`Habit with ID ${id} not found.`);
  }

  showSuccess(`Habit "${deletedHabit.name}" deleted successfully.`);
}

export const updateHabit = async (id: string, name?: string, freq?: Frequency): Promise<void> => {
  const updateData: UpdateHabitData = {
    ...(name ? { name } : {}),
    ...(freq ? { freq } : {}),
  };

  const updatedHabit = await HabitService.updateHabit(id, updateData);
  if (!updatedHabit) {
    throw new Error(`Habit with ID ${id} not found.`);
  }

  showSuccess(`Habit updated successfully: "${updatedHabit.name}" (${updatedHabit.freq})`);
}

export const showStats = async (period: '7' | '30' = '30'): Promise<void> => {
  const habits = await HabitService.getAllHabits();
  const stats = calculateHabitStats(habits, period);
  formatStats(stats, period);
}