import type { Book, CreateBookData, UpdateBookData } from '../types';
import * as BookModel from '../models/book.model';

export const getAllBooks = async (): Promise<Book[]> => {
  return await BookModel.getAll();
};

export const getBookById = async (id: number): Promise<Book | undefined> => {
  return await BookModel.getById(id);
};

export const createBook = async (bookData: CreateBookData): Promise<Book> => {
  return await BookModel.create(bookData);
};

export const updateBook = async (id: number, bookData: UpdateBookData): Promise<Book | null> => {
  return await BookModel.update(id, bookData);
};

export const deleteBook = async (id: number): Promise<boolean> => {
  return await BookModel.deleteBook(id);
};