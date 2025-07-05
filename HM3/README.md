## Services

### 1. Redis-like Service (Port 4000)
- `GET /get?key=<key>` → `{"value": "..." | null}`
- `POST /set` with `{"key": "...", "value": "..."}` → `{"ok": true}`
- In-memory Map storage with full TypeScript typing

### 2. KV Server (Port 3000 → 8080)
- `GET /kv/:key` → `{"value": "..." | null}`
- `POST /kv` with `{"key": "...", "value": "..."}` → `{"ok": true}`
- Connects to Redis service via HTTP with type-safe interfaces

### Local Development
```bash
  # Install dependencies for each service
  cd redis-service && npm install
  cd ../kv-server && npm install
  cd .. && npm install

# Build TypeScript
  npm run build
  cd redis-service && npm run build
  cd ../kv-server && npm run build

# Run in development mode
  cd redis-service && npm run dev
  cd ../kv-server && npm run dev
```

## Usage

### Using Docker Compose
```bash
  docker-compose up --build
```

### Using MiniCompose (Custom TypeScript)
```bash
    # Build TypeScript first
    npm run build
    
    # Start services with log streaming
    node dist/MiniCompose.js up
    
    # Or use ts-node for development
    npm run dev up
    
    # Stop and remove all containers + network
    node dist/MiniCompose.js down
```

## Testing

```bash
    # Set a value
        curl -X POST http://localhost:8080/kv \
          -H "Content-Type: application/json" \
          -d '{"key": "test", "value": "hello"}'
    
    # Get a value
        curl http://localhost:8080/kv/test
```