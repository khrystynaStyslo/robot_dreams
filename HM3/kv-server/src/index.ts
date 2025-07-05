import express, { Request, Response } from 'express';

interface RedisResponse {
  value?: string | null;
  ok?: boolean;
  error?: string;
}

interface SetRequestBody {
  key: string;
  value: string;
}

interface KvResponse {
  value?: string | null;
  ok?: boolean;
  error?: string;
}

class RedisClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(key: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/get?key=${encodeURIComponent(key)}`);
      const data: RedisResponse = await response.json();

      return data.value || null;
    } catch (error) {
      console.error('Redis GET error:', error);
      throw error;
    }
  }

  async set(key: string, value: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });
      const data: RedisResponse = await response.json();

      return data.ok || false;
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const REDIS_URL = process.env.REDIS_URL || 'http://localhost:6379';

app.use(express.json());

const redisClient = new RedisClient(REDIS_URL);

app.get('/kv/:key', async (req: Request<{ key: string }>, res: Response<KvResponse>) => {
  try {
    const { key } = req.params;
    const value = await redisClient.get(key);

    res.json({ value });
  } catch (error) {
    console.error('GET /kv/:key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/kv', async (req: Request<{}, KvResponse, SetRequestBody>, res: Response<KvResponse>) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }
    
    const ok = await redisClient.set(key, value);

    res.json({ ok });
  } catch (error) {
    console.error('POST /kv error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KV Server listening on port ${PORT}`);
  console.log(`Using Redis URL: ${REDIS_URL}`);
});