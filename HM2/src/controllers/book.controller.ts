import type { CreateBookData, UpdateBookData } from '../types';
import * as BookService from '../services/book.service';

export const getAllBooks = async () => {
  return await BookService.getAllBooks();
};

export const getBookById = async (id: number) => {
  const book = await BookService.getBookById(id);

  if (!book) {
    throw new Error('Book not found');
  }

  return book;
};

export const createBook = async (bookData: CreateBookData) => {
  return await BookService.createBook(bookData);
};

export const updateBook = async (id: number, bookData: UpdateBookData) => {
  const updatedBook = await BookService.updateBook(id, bookData);

  if (!updatedBook) {
    throw new Error('Book not found');
  }

  return updatedBook;
};

export const deleteBook = async (id: number) => {
  const deleted = await BookService.deleteBook(id);

  if (!deleted) {
    throw new Error('Book not found');
  }

  return { message: 'Book deleted successfully' };
};