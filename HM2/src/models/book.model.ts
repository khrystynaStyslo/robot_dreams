import * as fs from 'fs/promises';
import * as path from 'path';
import type { Book, CreateBookData, UpdateBookData, Database } from '../types';
import { config } from "../../config";

const DB_PATH = path.join(process.cwd(), config.databaseFile);

const readDatabase = async (): Promise<Database> => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { books: [] };
  }
};

const writeDatabase = async (data: Database): Promise<void> => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

export const getAll = async (): Promise<Book[]> => {
  const database = await readDatabase();

  return database.books;
};

export const getById = async (id: number): Promise<Book | undefined> => {
  const database = await readDatabase();

  return database.books.find(book => book.id === id);
};

export const create = async (bookData: CreateBookData): Promise<Book> => {
  const database = await readDatabase();

  const newBook: Book = {
    id: Date.now(),
    ...bookData
  };

  database.books.push(newBook);
  await writeDatabase(database);

  return newBook;
};

export const update = async (id: number, bookData: UpdateBookData): Promise<Book | null> => {
  const database = await readDatabase();

  const bookIndex = database.books.findIndex(book => book.id === id);

  if (bookIndex !== -1) {
    database.books[bookIndex] = { ...database.books[bookIndex], ...bookData };
    await writeDatabase(database);

    return database.books[bookIndex];
  }

  return null;
};

export const deleteBook = async (id: number): Promise<boolean> => {
  const database = await readDatabase();

  const bookIndex = database.books.findIndex(book => book.id === id);

  if (bookIndex !== -1) {
    database.books.splice(bookIndex, 1);
    await writeDatabase(database);

    return true;
  }

  return false;
};