import * as HabitModel from '../models/habit.model';
import type { CreateHabitData, UpdateHabitData, Habit } from '../types';

const getAllHabits = async (): Promise<Habit[]> => {
  return await HabitModel.findAll();
};

const getHabitById = async (id: string): Promise<Habit | null> => {
  return await HabitModel.findById(id);
};

const createHabit = async (habitData: CreateHabitData): Promise<Habit> => {
  return await HabitModel.create(habitData);
};

const updateHabit = async (id: string, habitData: UpdateHabitData): Promise<Habit | null> => {
  return await HabitModel.update(id, habitData);
};

const deleteHabit = async (id: string): Promise<Habit | null> => {
  return await HabitModel.deleteHabit(id);
};

export {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
};