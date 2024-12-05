# Startise Book Club API Documentation

## Project Structure

```
Startise-Bookclub/
├── scripts/
│   ├── createUsers.js        # Script to create multiple users
│   └── recreateUser.js       # Script to recreate a single user
├── src/
│   ├── controllers/
│   │   ├── authController.js # Authentication related controllers
│   │   ├── bookController.js # Book management controllers
│   │   └── userController.js # User management controllers
│   ├── models/
│   │   ├── Admin.js         # Admin model schema
│   │   ├── Book.js          # Book model schema
│   │   └── User.js          # User model schema
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── bookRoutes.js    # Book management routes
│   │   └── userRoutes.js    # User management routes
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   └── index.js             # Main application file
├── .env                      # Environment variables
└── package.json             # Project dependencies
```

## Setup Instructions

1. **Clone the Repository**

```bash
git clone [repository-url]
cd Startise-Bookclub
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**
   Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

4. **Create Initial Users**

```bash
npm run create-users
```

5. **Start the Server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### User Login

```http
POST /api/users/login
Content-Type: application/json

Request Body:
{
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "success": true,
    "data": {
        "token": "jwt-token",
        "user": {
            "id": "user-id",
            "userId": "USR001",
            "name": "User Name",
            "email": "user@example.com"
        }
    }
}
```

### Books

#### Get All Books

```http
GET /api/books
Authorization: Bearer jwt-token

Response:
{
    "success": true,
    "count": 2,
    "data": [
        {
            "_id": "book-id",
            "title": "Book Title",
            "author": "Author Name",
            "isbn": "1234567890",
            "category": "Fiction",
            "status": "available"
        }
    ]
}
```

#### Create Book (Admin Only)

```http
POST /api/books
Authorization: Bearer admin-jwt-token
Content-Type: application/json

Request Body:
{
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "1234567890",
    "category": "Fiction"
}

Response:
{
    "success": true,
    "data": {
        "book details..."
    }
}
```

### Borrow Requests

#### Send Borrow Request

```http
POST /api/users/borrow-request
Authorization: Bearer jwt-token
Content-Type: application/json

Request Body:
{
    "bookId": "book-id",
    "duration": 7  // Allowed values: 7, 15, 20, 30, 45
}

Response:
{
    "success": true,
    "message": "Borrow request sent successfully",
    "data": {
        "bookId": "book-id",
        "duration": 7,
        "status": "pending"
    }
}
```

## Data Models

### User Model

```javascript
{
    userId: String,        // Unique identifier (e.g., USR001)
    name: String,          // User's full name
    email: String,         // Unique email address
    password: String,      // Hashed password
    borrowHistory: [{      // Array of borrow records
        book: ObjectId,    // Reference to Book model
        borrowDate: Date,
        returnDate: Date,
        status: String     // pending/approved/rejected/returned
    }]
}
```

### Book Model

```javascript
{
    title: String,
    author: String,
    isbn: String,         // Unique ISBN
    category: String,
    status: String,       // available/borrowed/maintenance
    currentBorrower: {
        userId: ObjectId,  // Reference to User model
        borrowDate: Date,
        expectedReturnDate: Date
    }
}
```

## Authentication

- JWT-based authentication
- Token expiration: 24 hours
- Include token in Authorization header: `Bearer <token>`

## Scripts

### Create Multiple Users

```bash
npm run create-users
```

Creates multiple test users with hashed passwords.

### Reset Database

```bash
npm run recreate-user
```

Resets a specific user's data.

## Error Handling

All endpoints follow the standard error response format:

```javascript
{
    "success": false,
    "message": "Error description"
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development Notes

1. Password Hashing

   - Passwords are automatically hashed using bcrypt
   - Salt rounds: 10
   - Comparison done via the User model's comparePassword method

2. Database Indices

   - Unique indices on User.email and Book.isbn
   - Regular indices on Book.status and Book.category

3. Input Validation

   - Required fields are validated at the model level
   - Additional validation in controllers for specific business rules

4. Environment Variables

   - Use .env.example as a template
   - Never commit actual .env files
   - Always use appropriate values for production

## Testing

Use Thunder Client or Postman for API testing:

1. Create a new environment
2. Set base URL variable
3. Store JWT token after login
4. Use stored token for authenticated requests
