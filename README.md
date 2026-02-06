# Blog API

A feature-rich RESTful API for a blog platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **User Management** - Registration, login, password reset with OTP, profile management
- **Posts** - Create, read, update, delete with drafts, scheduling, and view tracking
- **Comments** - Nested comments with replies, likes, and editing
- **Likes** - Toggle likes on posts and comments
- **Follow System** - Follow/unfollow users, followers/following lists
- **Bookmarks** - Save and manage bookmarked posts
- **Notifications** - Real-time notifications for likes, comments, follows, and replies
- **Search** - Full-text search for posts and users
- **Image Upload** - Profile pictures and post images via ImageKit
- **Email Notifications** - Password reset and donation receipts via RabbitMQ workers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Image Storage**: ImageKit
- **Message Queue**: RabbitMQ (amqplib)
- **Email**: Nodemailer with Handlebars templates
- **Security**: helmet, cors, hpp, express-mongo-sanitize, express-xss-sanitizer

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB
- RabbitMQ
- ImageKit account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=blog_api
   JWT_SECRET=your_jwt_secret
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   
   # RabbitMQ
   RABBITMQ_URL=amqp://localhost
   
   # Email (SMTP)
   MAIL_HOST=smtp.example.com
   MAIL_PORT=587
   MAIL_USER=your_email@example.com
   MAIL_PASS=your_email_password
   ```

4. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   
   # With email worker
   npm run dev:all
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/Sign-Up` | Register a new user |
| POST | `/users/Login` | Login and get JWT token |
| POST | `/users/forgot-password` | Request password reset OTP |
| POST | `/users/verify-otp` | Verify OTP code |
| POST | `/users/reset-password` | Reset password with OTP |
| PATCH | `/users/change-password` | Change password (authenticated) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users (paginated) |
| GET | `/users/me` | Get current user profile |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/search?q=query` | Search users |
| PATCH | `/users/me` | Update own profile |
| PATCH | `/users/:id` | Update user (admin) |
| DELETE | `/users/me` | Delete own account |
| DELETE | `/users/:id` | Delete user (admin) |
| POST | `/users/me/profile-picture` | Upload profile picture |
| DELETE | `/users/me/profile-picture` | Delete profile picture |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a post |
| GET | `/posts` | Get all posts (paginated) |
| GET | `/posts/me` | Get current user's posts |
| GET | `/posts/drafts` | Get user's draft posts |
| GET | `/posts/search?q=query` | Search posts |
| GET | `/posts/:id` | Get post by ID |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |
| POST | `/posts/:id/publish` | Publish a draft |
| POST | `/posts/:id/schedule` | Schedule post publication |
| POST | `/posts/:id/view` | Increment view count |
| GET | `/posts/:id/views` | Get view count |
| POST | `/posts/:id/images` | Upload post images |
| DELETE | `/posts/:id/images/:imageId` | Delete post image |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts/:postId/comments` | Create comment on post |
| GET | `/posts/:postId/comments` | Get comments for post |
| POST | `/posts/:postId/comments/:parentCommentId` | Reply to comment |
| GET | `/comments` | Get all comments |
| GET | `/comments/:id` | Get comment by ID |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |
| GET | `/comments/:id/replies` | Get replies to comment |
| GET | `/comments/:id/stats` | Get comment statistics |

### Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/likes/:targetType/:targetId/toggle` | Toggle like (Post/Comment) |
| GET | `/likes/:targetType/:targetId/count` | Get like count |
| GET | `/likes/:targetType/:targetId/check` | Check if liked by user |
| GET | `/likes/:targetType/:targetId/likers` | Get users who liked |
| GET | `/likes/:targetType/:targetId/stats` | Get like statistics |
| GET | `/users/:userId/likes` | Get user's likes |

### Follow System

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/:userId/follow` | Follow a user |
| DELETE | `/users/:userId/follow` | Unfollow a user |
| GET | `/users/:userId/followers` | Get user's followers |
| GET | `/users/:userId/following` | Get users being followed |
| GET | `/users/:userId/follow-counts` | Get follower/following counts |

### Bookmarks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts/:postId/bookmark` | Bookmark a post |
| DELETE | `/posts/:postId/bookmark` | Remove bookmark |
| GET | `/users/bookmarks` | Get bookmarked posts |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get user's notifications |
| GET | `/notifications/unread-count` | Get unread count |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |

### Donations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/donations` | Create a donation |
| GET | `/donations` | Get all donations |
| GET | `/donations/:id` | Get donation by ID |

## Project Structure

```
Project/
├── Config/              # Configuration (RabbitMQ)
├── controllers/         # Route handlers
├── Errors/              # Custom error classes
├── middlewares/         # Express middlewares
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── schemas/             # Joi validation schemas
├── services/            # Business logic layer
├── Templetes/           # Handlebars email templates
├── Workers/             # RabbitMQ workers
├── index.js             # Application entry point
└── package.json
```

## Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- MongoDB injection prevention
- XSS protection
- HTTP Parameter Pollution (HPP) prevention
- Rate limiting on sensitive endpoints
- Security headers with Helmet
- CORS configuration

## Error Handling

The API uses custom error classes for consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```
