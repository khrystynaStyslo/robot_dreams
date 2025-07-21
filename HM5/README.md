# Tea API

A REST API for managing tea collections.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/tea`   | Get all teas (with pagination) | No |
| GET    | `/tea/:id` | Get tea by ID | Yes |
| POST   | `/tea`   | Create new tea | Yes |
| PUT    | `/tea/:id` | Update tea | Yes |
| DELETE | `/tea/:id` | Delete tea | Yes |

### Query Parameters

- `minRating` (optional): Filter by minimum rating (1-10)
- `page` (optional): Page number (default: 1)  
- `limit` (optional): Items per page (default: 10)

## Data Schema

```json
{
  "id": "string",
  "name": "string (3-40 chars)",
  "origin": "string (2-30 chars)", 
  "rating": "number (1-10, optional)",
  "brewTemp": "number (60-100°C, optional)",
  "notes": "string (max 150 chars, optional)"
}
```

### Access Swagger Documentation
```
http://localhost:3000/api
```

### Authentication
Most endpoints require an API key header:
```
X-API-Key: im_rd_student
```

### Example Requests

#### Create a tea
```bash
    curl -X POST http://localhost:3000/tea \
      -H "Content-Type: application/json" \
      -H "X-API-Key: your-api-key" \
      -d '{
        "name": "Earl Grey",
        "origin": "England", 
        "rating": 8,
        "brewTemp": 95,
        "notes": "Classic bergamot flavored black tea"
      }'
```

#### Get teas with filtering
```bash  
    curl "http://localhost:3000/tea?minRating=7&page=1&limit=5"
```
