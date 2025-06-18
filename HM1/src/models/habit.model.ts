import { promises as fs } from 'fs';
import * as path from 'path';
import type { Database, Habit, CreateHabitData, UpdateHabitData } from '../types';

const DB_PATH = path.join(process.cwd(), 'database.json');

const readDatabase = async (): Promise<Database> => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { habits: [] };
  }
};

const writeDatabase = async (data: Database): Promise<void> => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

const findAll = async (): Promise<Habit[]> => {
  const db = await readDatabase();
  return db.habits;
};

const findById = async (id: string): Promise<Habit | null> => {
  const db = await readDatabase();
  return db.habits.find(h => h.id === id) || null;
};

const create = async (data: CreateHabitData): Promise<Habit> => {
  const db = await readDatabase();
  const habit: Habit = {
    id: Date.now().toString(),
    ...data,
    doneOn: []
  };
  
  db.habits.push(habit);
  await writeDatabase(db);
  return habit;
};

const update = async (id: string, data: UpdateHabitData): Promise<Habit | null> => {
  const habit = await findById(id);
  if (!habit) {
    return null;
  }
  
  const db = await readDatabase();
  const index = db.habits.findIndex(h => h.id === id);
  
  db.habits[index] = { ...db.habits[index], ...data };
  await writeDatabase(db);
  return db.habits[index];
};

const deleteHabit = async (id: string): Promise<Habit | null> => {
  const habit = await findById(id);
  if (!habit) {
    return null;
  }
  
  const db = await readDatabase();
  const index = db.habits.findIndex(h => h.id === id);
  
  const deleted = db.habits.splice(index, 1)[0];
  await writeDatabase(db);
  return deleted;
};

export {
  findAll,
  findById,
  create,
  update,
  deleteHabit,
};