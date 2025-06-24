export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
}

export interface CreateBookData {
  title: string;
  author: string;
  year: number;
  genre: string;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  year?: number;
  genre?: string;
}

export interface Database {
  books: Book[];
}