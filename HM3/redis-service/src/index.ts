import * as http from 'http';
import * as url from 'url';

interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): boolean;
}

class RedisLikeStore implements KeyValueStore {
  private data: Map<string, string>;

  constructor() {
    this.data = new Map<string, string>();
  }

  get(key: string): string | null {
    return this.data.get(key) || null;
  }

  set(key: string, value: string): boolean {
    this.data.set(key, value);
    return true;
  }
}

interface SetRequestBody {
  key: string;
  value: string;
}

interface ApiResponse {
  value?: string | null;
  ok?: boolean;
  error?: string;
}

const store = new RedisLikeStore();
const PORT = parseInt(process.env.PORT || '4000', 10);

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const parsedUrl = url.parse(req.url || '', true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && pathname === '/get') {
    const key = parsedUrl.query.key as string;
    
    if (!key) {
      res.statusCode = 400;
      const response: ApiResponse = { error: 'Key parameter is required' };
      res.end(JSON.stringify(response));
      return;
    }

    const value = store.get(key);
    res.statusCode = 200;
    const response: ApiResponse = { value };
    res.end(JSON.stringify(response));
    
  } else if (method === 'POST' && pathname === '/set') {
    let body = '';
    
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { key, value }: SetRequestBody = JSON.parse(body);
        
        if (!key || value === undefined) {
          res.statusCode = 400;
          const response: ApiResponse = { error: 'Key and value are required' };
          res.end(JSON.stringify(response));
          return;
        }
        
        store.set(key, value);
        res.statusCode = 200;
        const response: ApiResponse = { ok: true };
        res.end(JSON.stringify(response));
        
      } catch (error) {
        res.statusCode = 400;
        const response: ApiResponse = { error: 'Invalid JSON' };
        res.end(JSON.stringify(response));
      }
    });
    
  } else {
    res.statusCode = 404;
    const response: ApiResponse = { error: 'Not found' };
    res.end(JSON.stringify(response));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Redis-like HTTP server listening on port ${PORT}`);
});

server.on('error', (err: Error) => {
  console.error('Server error:', err);
});