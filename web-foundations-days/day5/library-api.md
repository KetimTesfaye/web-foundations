# Library REST API Design

A RESTful API specification for managing books within a library system.

## Base URL
`https://api.librarysystem.com/v1`

---

## Endpoints

### 1. List All Books
- **Method:** `GET`
- **Path:** `/books`
- **Description:** Retrieve a paginated list of all books in the library catalog. Optionally filter books by author using a query parameter.
- **Query Parameters:** `?author=J.K.+Rowling` (optional)
- **Success Status Code:** `200 OK`

### 2. List Books by Author (Query Filter variant)
- **Method:** `GET`
- **Path:** `/books?author={author_name}`
- **Description:** Retrieve books written by a specific author.
- **Success Status Code:** `200 OK`

### 3. Get a Single Book
- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Retrieve detailed information about a specific book by its unique ID.
- **Success Status Code:** `200 OK`

### 4. Create a Book
- **Method:** `POST`
- **Path:** `/books`
- **Description:** Add a new book to the library catalog.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "publishedYear": 2008
  }