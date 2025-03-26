# Startise Bookclub

A modern book club application built with Next.js, MongoDB, and Tailwind CSS.

## Project Structure

```
startise-bookclub/
├── frontend/          # Next.js frontend application
├── backend/          # Node.js backend application
└── README.md         # Project documentation
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally)
- npm or yarn

## Environment Variables

### Backend

- `MONGODB_URI`: mongodb://localhost:27017/
- `JWT_SECRET`: xxxx
- `PORT`: 5000 (default)

### Frontend

- `NEXT_PUBLIC_API_URL`: http://localhost:5000

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Start the development servers

## Installation Steps

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- User authentication
- Book management
- Book club discussions
- Modern UI with Tailwind CSS
- Responsive design

## Tech Stack

- Frontend:

  - Next.js
  - Tailwind CSS
  - Shadcn UI
  - React Query
- Backend:

  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## API Documentation

The API documentation will be available at `http://localhost:5000/api-docs` when the backend server is running.

# Book Club Backend Documentation

This is the backend API for the Book Club application, built with Node.js, Express, and MongoDB. The API provides endpoints for user authentication, book management, and admin operations.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Create a .env file**
   Create a `.env` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. **Initialize the database**

   ```bash
   node src/scripts/seedData.js
   ```

   This will create an admin user with the following credentials:

   - Email: admin@example.com
   - Password: admin123
5. **Start the server**

   ```bash
   npm start
   ```

   The server will start on port 5000 (or the port specified in your .env file).

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

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Include the JWT token in the request header:

   ```
   x-auth-token: <your_jwt_token>
   ```
2. The token is obtained after successful login/registration

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware
- Admin-only access control
- CORS enabled
- Input validation

## Database Schema

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

## Development

To run the server in development mode with auto-reload:

```bash
npm run dev
```

## Testing

To run tests:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
