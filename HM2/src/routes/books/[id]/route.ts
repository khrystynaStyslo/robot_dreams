import type { IncomingMessage, ServerResponse } from 'http';
import * as BookController from '../../../controllers/book.controller';
import { getRequestBody, parseJsonBody } from '../../../utils/request';
import { validateUpdateData, validateId } from '../../../utils/validation';
import { UpdateBookData } from '../../../types';

export async function GET(_req: IncomingMessage, res: ServerResponse, params: { id: string }) {
  try {
    const id = validateId(params.id);

    if (!id) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid book ID' }));

      return;
    }

    const book = await BookController.getBookById(id);
    res.writeHead(200);
    res.end(JSON.stringify(book));
  } catch (error: any) {
    if (error.message === 'Book not found') {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch book' }));
    }
  }
}

export async function PUT(req: IncomingMessage, res: ServerResponse, params: { id: string }) {
  try {
    const id = validateId(params.id);

    if (!id) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid book ID' }));

      return;
    }

    const body = await getRequestBody(req);

    const { data, error } = parseJsonBody(body);
    
    if (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error }));

      return;
    }

    const validationError = validateUpdateData(data);

    if (validationError) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: validationError }));
      return;
    }

    const updatedBook = await BookController.updateBook(id, data as UpdateBookData);
    res.writeHead(200);
    res.end(JSON.stringify(updatedBook));
  } catch (error: any) {
    if (error.message === 'Book not found') {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}

export async function DELETE(_req: IncomingMessage, res: ServerResponse, params: { id: string }) {
  try {
    const id = validateId(params.id);

    if (!id) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid book ID' }));
      return;
    }

    const result = await BookController.deleteBook(id);

    res.writeHead(200);
    res.end(JSON.stringify(result));
  } catch (error: any) {
    if (error.message === 'Book not found') {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Book not found' }));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to delete book' }));
    }
  }
}
