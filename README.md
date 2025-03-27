# Startise Bookclub

A modern backend API for managing a book club's library and member interactions.

## Features

- User Authentication

  - Register and login functionality
  - JWT-based authentication
  - Protected routes

- Book Management

  - Add, edit, and delete books
  - Book details including title, author, description, ISBN, and publication year
  - Book categories and cover images
  - Track book quantity and availability

- Borrowing System

  - Borrow and return books
  - Track borrowing history
  - Automatic due date calculation (2 weeks)
  - Limit of 1 active borrow per user
  - View currently borrowed books

- Reservation System

  - Reserve unavailable books
  - Automatic notification when book becomes available
  - Reservation expiration handling

## Tech Stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Express middleware for request handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mrx-arafat/startise-bookclub.git
cd startise-bookclub
```

2. Install dependencies:

```bash
cd backend
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory with the following variables:

```bash
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:5000

## API Documentation

For detailed API documentation, please refer to the Postman collection in the `backend/postman` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
