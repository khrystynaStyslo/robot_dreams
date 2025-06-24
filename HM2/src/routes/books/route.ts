import type { IncomingMessage, ServerResponse } from 'http';
import * as BookController from '../../controllers/book.controller';
import { getRequestBody, parseJsonBody } from '../../utils/request';
import { validateBookData } from '../../utils/validation';
import { CreateBookData } from '../../types';

export async function GET(_req: IncomingMessage, res: ServerResponse) {
  try {
    const books = await BookController.getAllBooks();

    res.writeHead(200);
    res.end(JSON.stringify(books));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Failed to fetch books' }));
  }
}

export async function POST(req: IncomingMessage, res: ServerResponse) {
  try {
    const body = await getRequestBody(req);
    const { data, error } = parseJsonBody(body);
    
    if (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error }));

      return;
    }

    const validationError = validateBookData(data);

    if (validationError) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: validationError }));

      return;
    }

    const newBook = await BookController.createBook(data as CreateBookData);
    res.writeHead(201);
    res.end(JSON.stringify(newBook));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}
