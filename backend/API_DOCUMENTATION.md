# API Documentation - Library Management

## Base URL
```
http://localhost:6543/api
```

---

## 1. Authentication

### Register
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "librarian"
}
```

**Response (Success):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "librarian"
  }
}
```

**Response (Failed):**
```json
{
  "error": "Email already registered"
}
```

---

### Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "librarian"
  }
}
```

**Response (Failed):**
```json
{
  "error": "Invalid credentials"
}
```

**Header untuk endpoint selanjutnya:**
```
Authorization: Bearer {token}
```

---

## 2. Books Management

### List Books
**Endpoint:** `GET /books`

**Query Parameters:**
- `search` (optional): Cari berdasarkan title/author
- `category` (optional): Filter berdasarkan category

**Example:**
```
GET /books?search=python&category=programming
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Learn Python",
      "author": "John Doe",
      "isbn": "978-1234567890",
      "category": "programming",
      "copies_total": 5,
      "copies_available": 3
    },
    {
      "id": 2,
      "title": "Advanced Python",
      "author": "Jane Smith",
      "isbn": "978-0987654321",
      "category": "programming",
      "copies_total": 3,
      "copies_available": 1
    }
  ]
}
```

---

### Get Book Detail
**Endpoint:** `GET /books/{id}`

**Response:**
```json
{
  "id": 1,
  "title": "Learn Python",
  "author": "John Doe",
  "isbn": "978-1234567890",
  "category": "programming",
  "copies_total": 5,
  "copies_available": 3
}
```

---

### Create Book (Librarian Only)
**Endpoint:** `POST /books`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Learn Python",
  "author": "John Doe",
  "isbn": "978-1234567890",
  "category": "programming",
  "copies_total": 5
}
```

**Response (Success):**
```json
{
  "message": "Book created",
  "book": {
    "id": 1,
    "title": "Learn Python",
    "author": "John Doe",
    "isbn": "978-1234567890",
    "category": "programming",
    "copies_total": 5,
    "copies_available": 5
  }
}
```

**Response (Failed):**
```json
{
  "error": "Missing fields: title, isbn"
}
```

---

### Update Book (Librarian Only)
**Endpoint:** `PUT /books/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Learn Python (2nd Edition)",
  "copies_total": 10
}
```

**Response:**
```json
{
  "message": "Book updated",
  "book": {
    "id": 1,
    "title": "Learn Python (2nd Edition)",
    "author": "John Doe",
    "isbn": "978-1234567890",
    "category": "programming",
    "copies_total": 10,
    "copies_available": 8
  }
}
```

---

### Delete Book (Librarian Only)
**Endpoint:** `DELETE /books/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Book deleted"
}
```

---

## 3. Borrowing System

### Borrow Book (Member Only)
**Endpoint:** `POST /borrow/{book_id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success):**
```json
{
  "message": "Borrowed successfully",
  "borrowing": {
    "id": 1,
    "book": {
      "id": 1,
      "title": "Learn Python",
      "author": "John Doe"
    },
    "member_id": 2,
    "borrow_date": "2025-12-10",
    "due_date": "2025-12-24",
    "return_date": null,
    "fine": 0
  }
}
```

**Response (Failed):**
```json
{
  "error": "No copies available"
}
```

atau

```json
{
  "error": "Borrowing limit reached (3 active)"
}
```

---

## 4. Return System

### Return Book
**Endpoint:** `POST /return/{borrowing_id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (On Time):**
```json
{
  "message": "Return processed",
  "borrowing": {
    "id": 1,
    "book": {
      "id": 1,
      "title": "Learn Python",
      "author": "John Doe"
    },
    "member_id": 2,
    "borrow_date": "2025-12-10",
    "due_date": "2025-12-24",
    "return_date": "2025-12-22",
    "fine": 0
  }
}
```

**Response (Late - with Fine):**
```json
{
  "message": "Return processed",
  "borrowing": {
    "id": 1,
    "book": {
      "id": 1,
      "title": "Learn Python",
      "author": "John Doe"
    },
    "member_id": 2,
    "borrow_date": "2025-12-10",
    "due_date": "2025-12-24",
    "return_date": "2025-12-27",
    "fine": 15000
  }
}
```

**Note:** Denda dihitung sebagai 5000 per hari terlambat

---

## 5. Borrowing History

### List Current Borrowings
**Endpoint:** `GET /borrowings`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `active` (optional): `true` untuk tampilkan aktif saja (belum dikembalikan)
- `member_id` (optional - Librarian only): Filter by member

**Example:**
```
GET /borrowings?active=true
```

**Response (Member):**
```json
{
  "items": [
    {
      "id": 1,
      "book": {
        "id": 1,
        "title": "Learn Python",
        "author": "John Doe"
      },
      "member_id": 2,
      "borrow_date": "2025-12-10",
      "due_date": "2025-12-24",
      "return_date": null,
      "fine": 0
    }
  ]
}
```

---

### Get All History
**Endpoint:** `GET /history`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `member_id` (optional - Librarian only): Filter by member

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "book": {
        "id": 1,
        "title": "Learn Python",
        "author": "John Doe"
      },
      "member_id": 2,
      "borrow_date": "2025-12-10",
      "due_date": "2025-12-24",
      "return_date": "2025-12-22",
      "fine": 0
    },
    {
      "id": 2,
      "book": {
        "id": 2,
        "title": "Advanced Python",
        "author": "Jane Smith"
      },
      "member_id": 2,
      "borrow_date": "2025-12-01",
      "due_date": "2025-12-15",
      "return_date": "2025-12-18",
      "fine": 15000
    }
  ]
}
```

---

## Error Responses

### Unauthorized
**Status Code:** 401
```json
{
  "error": "Missing Authorization header"
}
```

### Forbidden (Insufficient Permissions)
**Status Code:** 403
```json
{
  "error": "Insufficient permissions"
}
```

### Not Found
**Status Code:** 404
```json
{
  "error": "Book not found"
}
```

### Bad Request
**Status Code:** 400
```json
{
  "error": "Invalid request"
}
```

### Conflict
**Status Code:** 409
```json
{
  "error": "Email already registered"
}
```

---

## Business Rules

| Rule | Detail |
|------|--------|
| **Borrow Limit** | Member hanya bisa pinjam max 3 buku aktif |
| **Loan Duration** | Durasi peminjaman adalah 14 hari |
| **Late Fee** | Denda 5000 per hari terlambat |
| **Role-Based Access** | Librarian: CRUD book; Member: browse & borrow |
| **Password Hashing** | PBKDF2-SHA256 dengan fallback untuk legacy hashes |

---

## Testing dengan cURL

### Register Admin
```bash
curl -X POST http://localhost:6543/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"librarian"}'
```

### Login
```bash
curl -X POST http://localhost:6543/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Create Book (ganti TOKEN dengan token dari login)
```bash
curl -X POST http://localhost:6543/api/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Python","author":"John Doe","isbn":"978-1234567890","category":"programming","copies_total":5}'
```

### List Books
```bash
curl http://localhost:6543/api/books
```

### Search Books
```bash
curl "http://localhost:6543/api/books?search=python&category=programming"
```

### Borrow Book
```bash
curl -X POST http://localhost:6543/api/borrow/1 \
  -H "Authorization: Bearer TOKEN"
```

### Return Book
```bash
curl -X POST http://localhost:6543/api/return/1 \
  -H "Authorization: Bearer TOKEN"
```

### List Current Borrowings
```bash
curl http://localhost:6543/api/borrowings?active=true \
  -H "Authorization: Bearer TOKEN"
```

### View History
```bash
curl http://localhost:6543/api/history \
  -H "Authorization: Bearer TOKEN"
```

---

## Notes
- Semua request body harus dalam format JSON
- Timestamp menggunakan format ISO 8601
- Date menggunakan format YYYY-MM-DD
- Token berlaku selama 24 jam
- Member dan Librarian memiliki akses berbeda ke endpoint tertentu
