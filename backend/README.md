# Book Club Backend

A Node.js backend API for the Book Club application, built with Express and MongoDB.

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── scripts/       # Utility scripts
│   ├── utils/         # Helper functions
│   └── server.js      # Main application file
├── .env               # Environment variables
└── package.json       # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/bookclub
JWT_SECRET=arafat&startise
PORT=5000
```

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Initialize the database**

   ```bash
   node src/scripts/seedData.js
   ```

   This will create an admin user with the following credentials:

   - Email: admin@example.com
   - Password: admin123

3. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User

- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Description**: Authenticate user and get token
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Admin Login

- **POST** `/api/auth/admin/login`
- **Description**: Authenticate admin user and get token
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Books

#### Get All Books

- **GET** `/api/books`
- **Description**: Get all books
- **Access**: Private (Requires authentication)
- **Headers**: `x-auth-token: <jwt_token>`

#### Get Book by ID

- **GET** `/api/books/:id`
- **Description**: Get a specific book by ID
- **Access**: Private (Requires authentication)
- **Headers**: `x-auth-token: <jwt_token>`

#### Create Book

- **POST** `/api/books`
- **Description**: Create a new book
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "author": "string",
    "category": "string",
    "quantity": number,
    "description": "string"
  }
  ```

#### Update Book

- **PUT** `/api/books/:id`
- **Description**: Update a book
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "author": "string",
    "category": "string",
    "quantity": number,
    "description": "string"
  }
  ```

#### Delete Book

- **DELETE** `/api/books/:id`
- **Description**: Delete a book
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`

#### Borrow Book

- **POST** `/api/books/:id/borrow`
- **Description**: Borrow a book
- **Access**: Private (Requires authentication)
- **Headers**: `x-auth-token: <jwt_token>`

### Users (Admin Only)

#### Get All Users

- **GET** `/api/users`
- **Description**: Get all users
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`

#### Create User

- **POST** `/api/users`
- **Description**: Create a new user
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "isAdmin": boolean
  }
  ```

#### Delete User

- **DELETE** `/api/users/:id`
- **Description**: Delete a user
- **Access**: Private (Requires admin authentication)
- **Headers**: `x-auth-token: <jwt_token>`

## Database Models

### User Model

```javascript
{
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean
}
```

### Book Model

```javascript
{
  title: String,
  author: String,
  category: String,
  quantity: Number,
  description: String
}
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware
- Admin-only access control
- CORS enabled
- Input validation

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development

### Running Tests

```bash
npm test
```

### Code Style

The project uses ESLint for code linting. To run the linter:

```bash
npm run lint
```

### Database Seeding

To reset and seed the database:

```bash
node src/scripts/seedData.js
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- dotenv: Environment variables

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
