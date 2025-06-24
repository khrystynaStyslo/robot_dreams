# Node.js REST API

## Installation

```bash
  cd HM2
  pnpm install
```

## Configuration

Create a `.env` file (optional - defaults provided):

```bash
  cp .env.example .env
```

## API Endpoints

### Books API

All endpoints are prefixed with `/api`

#### Get all books
```bash
  GET /api/books
```

**Response:**
```json
[
  {
    "id": 1703123456789,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925,
    "genre": "Fiction"
  }
]
```

#### Get book by ID
```bash
  GET /api/books/{id}
```

**Response:**
```json
{
  "id": 1703123456789,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925,
  "genre": "Fiction"
}
```

#### Create a new book
```bash
  POST /api/books
  Content-Type: application/json

  {
    "title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Dystopian Fiction"
  }
```

**Response:**
```json
{
  "id": 1703123456790,
  "title": "1984",
  "author": "George Orwell",
  "year": 1949,
  "genre": "Dystopian Fiction"
}
```

#### Update a book
```bash
  PUT /api/books/{id}
  Content-Type: application/json

  {
    "title": "Nineteen Eighty-Four",
    "year": 1948
  }
```

**Response:**
```json
{
  "id": 1703123456790,
  "title": "Nineteen Eighty-Four",
  "author": "George Orwell",
  "year": 1948,
  "genre": "Dystopian Fiction"
}
```

#### Delete a book
```bash
  DELETE /api/books/{id}
```

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

## Testing with curl

**Create a book:**
```bash
  curl -X POST http://localhost:3000/api/books \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Book", "author": "Test Author", "year": 2023, "genre": "Fiction"}'
```

**Get all books:**
```bash
  curl http://localhost:3000/api/books
```

**Get book by ID:**
```bash
  curl http://localhost:3000/api/books/1703123456789
```

**Update a book:**
```bash
  curl -X PUT http://localhost:3000/api/books/1703123456789 \
    -H "Content-Type: application/json" \
    -d '{"title": "Updated Title"}'
```

**Delete a book:**
```bash
  curl -X DELETE http://localhost:3000/api/books/1703123456789
```

**Error response format:**
```json
{
  "error": "Error message description"
}
```