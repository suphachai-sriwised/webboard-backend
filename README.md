# Webboard Backend API

A NestJS-based REST API for a webboard/forum application with MongoDB integration.

## Features

- **Posts Management**: Create, read, update, delete posts
- **Comments System**: Add, edit, delete comments on posts
- **Search Functionality**: Search posts by content
- **Authentication**: JWT-based authentication system
- **Community Support**: Organize posts by communities

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd webboard-backend
npm install
```

### 2. Start MongoDB with Docker

```bash
docker-compose up -d
```

This starts:
- MongoDB on port `27017`
- Mongo Express (admin UI) on port `8081`

### 3. Environment Setup

Create `.env` file (already configured):
```env
PORT=3001
```

### 4. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all posts | No |
| GET | `/posts/search?q=term` | Search posts | No |
| GET | `/posts/:id` | Get post by ID | No |
| POST | `/posts` | Create new post | Yes |
| PATCH | `/posts/:id` | Update post | Yes |
| DELETE | `/posts/:id` | Delete post | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/posts/:postId/comments` | Add comment | Yes |
| PATCH | `/posts/:postId/comments/:commentId` | Update comment | Yes |
| DELETE | `/posts/:postId/comments/:commentId` | Delete comment | Yes |

## Data Models

### Post
```json
{
  "topic": "string",
  "content": "string", 
  "community": "string",
  "username": "string",
  "createdAt": "Date",
  "comments": [Comment]
}
```

### Comment
```json
{
  "comment": "string",
  "username": "string", 
  "createdAt": "Date"
}
```

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe"}'
```

### Create Post
```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "topic": "Hello World",
    "content": "This is my first post",
    "community": "general",
    "username": "john_doe"
  }'
```

### Add Comment
```bash
curl -X POST http://localhost:3001/posts/:postId/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "comment": "Great post!",
    "username": "jane_doe"
  }'
```

## Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode

# Building
npm run build          # Build for production

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Project Structure

```
src/
├── auth/              # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── auth.module.ts
├── posts/             # Posts module
│   ├── dto/           # Data transfer objects
│   ├── entities/      # Entity definitions
│   ├── schemas/       # MongoDB schemas
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
├── users/             # Users module
└── main.ts            # Application entry point
```

## Database

### MongoDB Connection
- **Host**: localhost:27017
- **Database**: webboard
- **Auth**: root/example

### Admin Interface
Access Mongo Express at `http://localhost:8081` for database management.

## Testing

Run the test suite:
```bash
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
```

## CORS Configuration

CORS is enabled for all origins by default. Configure in `main.ts`:
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## License

UNLICENSED