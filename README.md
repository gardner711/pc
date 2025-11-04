# D&D 5e Character Creator

A modern web application for creating and managing Dungeons & Dragons 5th Edition characters.

## 🎯 Project Overview

This is a full-stack web application that enables users to create, edit, view, and manage D&D 5e characters with a clean, modern interface supporting both light and dark themes.

### Features

- **Character Management**: Create, edit, view, and delete characters
- **Full D&D 5e Support**: Complete character sheet with all official rules
- **Auto-Calculations**: Ability modifiers, skill bonuses, proficiency bonus, spell save DC
- **Modern UI**: Clean interface with light/dark mode support
- **Validation**: Real-time form validation with helpful error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form + Yup for forms and validation
- Axios for API calls
- Vitest + Testing Library for unit tests
- Cypress for E2E tests

**Backend:**
- Go 1.21+
- Gin web framework
- MongoDB for data persistence
- Swagger/OpenAPI for API documentation
- Logrus for structured logging
- Testify for testing

**Infrastructure:**
- Docker & Docker Compose
- MongoDB 6.0+
- Nginx (for serving frontend)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Go 1.21+ (for local development)
- Node.js 20+ (for local development)
- MongoDB 6.0+ (or use Docker)

### Running with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd pc-svc

# Start all services
cd docker
docker-compose -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# API Docs: http://localhost:8080/swagger/index.html
```

### Local Development

**Backend:**

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
go mod download

# Run tests
make test

# Start server
make run
# Or: go run cmd/server/main.go
```

**Frontend:**

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Run tests
npm test

# Start dev server
npm run dev
```

## 📁 Project Structure

```
pc-svc/
├── backend/                 # Go backend application
│   ├── cmd/server/         # Application entry point
│   ├── internal/           # Private application code
│   │   ├── config/        # Configuration management
│   │   ├── handler/       # HTTP handlers
│   │   ├── middleware/    # HTTP middleware
│   │   ├── models/        # Data models
│   │   ├── repository/    # Database layer
│   │   ├── service/       # Business logic
│   │   └── validator/     # Input validation
│   ├── tests/             # Test files
│   └── Dockerfile         # Backend Docker image
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   ├── tests/             # Test files
│   └── Dockerfile         # Frontend Docker image
│
├── docker/                # Docker configuration
│   └── docker-compose.dev.yml
│
└── specs/                 # Specifications and documentation
    ├── 001-dnd-character-creator/
    │   ├── spec.md        # Feature specification
    │   ├── plan.md        # Implementation plan
    │   ├── tasks.md       # Task breakdown
    │   └── implementation.md  # Implementation guide
    └── reference/
        ├── character-schema.json
        └── sample-characters.json
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
make test

# Run unit tests only
make test-unit

# Run integration tests only
make test-int

# Run linter
make lint
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e

# Run E2E tests headless
npm run e2e:headless
```

## 📚 API Documentation

Once the backend is running, access the Swagger documentation at:
http://localhost:8080/swagger/index.html

### Main Endpoints

- `GET /api/v1/characters` - List all characters
- `GET /api/v1/characters/:id` - Get character by ID
- `POST /api/v1/characters` - Create new character
- `PUT /api/v1/characters/:id` - Update character
- `DELETE /api/v1/characters/:id` - Delete character
- `GET /health` - Health check

## 🔧 Development

### Code Quality

This project follows strict code quality standards:

- **Test-Driven Development**: All features require tests before implementation
- **Code Coverage**: Minimum 80% test coverage
- **Linting**: All code must pass linters (golangci-lint, ESLint)
- **Type Safety**: Full TypeScript strict mode on frontend

### Workflow

1. Read specification in `specs/001-dnd-character-creator/spec.md`
2. Follow task breakdown in `tasks.md`
3. Write tests first (TDD approach)
4. Implement feature
5. Run linters and tests
6. Commit changes

## 📝 Contributing

1. Follow the specification-driven development workflow
2. Write tests before implementation
3. Ensure all tests pass
4. Run linters and fix all errors
5. Update documentation as needed

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- D&D 5e System Reference Document (SRD)
- Wizards of the Coast for D&D 5e
