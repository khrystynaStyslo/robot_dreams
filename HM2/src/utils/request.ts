import type { IncomingMessage } from 'http';

export const getRequestBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });
  });
}

export const parseJsonBody = (body: string): { data: unknown; error: string | null } => {
  if (!body) {
    return { data: null, error: 'Request body is required' };
  }

  try {
    const data = JSON.parse(body);
    return { data, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON format' };
  }
}