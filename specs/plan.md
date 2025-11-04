# Implementation Plan: D&D 5e Character Creator

**Branch**: `001-dnd-character-creator` | **Date**: 2025-11-03 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-dnd-character-creator/spec.md`

## Summary

Build a full-stack D&D 5e character management web application with React frontend and Go backend. The system enables users to create, view, edit, and delete D&D 5e characters conforming to the character-schema.json specification. Frontend features include tile-based character browsing with filter/sort/preview, comprehensive character forms with real-time validation, and light/dark mode theming. Backend provides RESTful API with MongoDB persistence, comprehensive logging, Swagger documentation, and CORS support. Both frontend and backend will be containerized with Docker and follow TDD principles with complete test coverage.

## Technical Context

**Frontend**:
- **Language/Version**: JavaScript/TypeScript with React 18+
- **Primary Dependencies**: React, React Router, Axios, React Hook Form, Yup (JSON Schema validation), Tailwind CSS or Material-UI
- **Storage**: localStorage (theme preference)
- **Testing**: Jest, React Testing Library, Cypress (E2E), MSW (API mocking)
- **Build Tool**: Vite or Create React App
- **Containerization**: Docker with nginx

**Backend**:
- **Language/Version**: Go 1.21+
- **Primary Dependencies**: Gin or Fiber (HTTP framework), mongo-go-driver, go-swagger or swaggo, logrus or zap (logging), go-cors
- **Storage**: MongoDB 6.0+ at mongodb://localhost:27017/, database: pc_db, collection: characters
- **Testing**: Go testing package, testify, httptest, mongodb-memory-server equivalent
- **API Documentation**: Swagger/OpenAPI 3.0
- **Containerization**: Docker multi-stage build

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- Character list load: P50 < 1s, P99 < 2s (load all characters)
- Character create/update: P50 < 2s, P99 < 3s
- Form validation: P50 < 50ms per field (on blur)
- Support 100 concurrent users
- Efficiently handle user collections of any size

**Constraints**:
- All data must conform to character-schema.json
- Character names must be unique (enforced by database)
- All string fields max 500 characters
- Validation triggers on blur (field loses focus)
- No pagination - load all characters at once
- Filters and sort do not persist across sessions
- Automatic timestamps: createdAt and updatedAt for all characters
- Frontend and backend validation must be identical
- API URL must be configurable via environment variables
- CORS must support frontend origin
- All operations logged, all errors logged with context
- Docker containers must be production-ready

**Scale/Scope**:
- Initial target: Single user (authentication out of scope)
- Support unlimited characters per user
- Full character schema implementation (all properties)
- Comprehensive test coverage (>80% code coverage)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Specification First (SUPREME LAW)
- Specification exists: `specs/001-dnd-character-creator/spec.md`
- All features documented with acceptance criteria
- API contracts will be defined in Phase 1
- Data model documented in character-schema.json

### ✅ Test-Driven Development
- TDD cycle will be followed for all implementation
- Tests will be written before code for each component/service
- Unit tests, integration tests, and E2E tests planned
- Test coverage requirements: 80% minimum

### ✅ Code Quality Standards
- Go: Follow Effective Go, use gofmt, golangci-lint
- React: ESLint, Prettier, TypeScript strict mode
- Functions kept small, single responsibility
- Clear naming conventions

### ✅ Testing Standards
- **Frontend**:
  - Unit: React Testing Library for components
  - Integration: MSW for API integration tests
  - E2E: Cypress for user story validation
- **Backend**:
  - Unit: Go testing for services, validators
  - Integration: httptest for API endpoints with test MongoDB
  - Contract: Validate schema conformance

### ✅ User Experience Consistency
- RESTful API design
- Consistent error response format
- Standard HTTP status codes
- API versioning: /api/v1/

### ✅ Performance Requirements
- All performance targets documented in spec
- Database indexes planned (unique index on characterName)
- Connection pooling configured
- No pagination - load all characters (optimized query with projection)

### ✅ Simplicity and YAGNI
- No speculative features
- Standard libraries preferred
- Docker for deployment (industry standard)
- MongoDB chosen for JSON schema compatibility

**Constitution Compliance**: ✅ PASSED - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-dnd-character-creator/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file - Implementation plan
├── research.md          # Technology research and decisions
├── data-model.md        # Data model and MongoDB schema design
├── quickstart.md        # Developer setup and running guide
├── contracts/           # API contract specifications
│   ├── api-spec.yaml    # OpenAPI/Swagger specification
│   └── error-codes.md   # Standardized error codes
└── tasks.md             # Implementation task breakdown (Phase 2)
```

### Source Code (repository root)

```text
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go               # Configuration management
│   ├── models/
│   │   └── character.go            # Character model (from schema)
│   ├── repository/
│   │   ├── character_repository.go # MongoDB data access interface
│   │   └── mongo/
│   │       └── character_repo.go   # MongoDB implementation
│   ├── service/
│   │   ├── character_service.go    # Business logic interface
│   │   └── character_service_impl.go
│   ├── validator/
│   │   └── character_validator.go  # JSON schema validation
│   ├── handler/
│   │   └── character_handler.go    # HTTP handlers
│   ├── middleware/
│   │   ├── cors.go                 # CORS middleware
│   │   ├── logging.go              # Request logging
│   │   └── error.go                # Error handling
│   └── logger/
│       └── logger.go               # Structured logging setup
├── api/
│   └── swagger.yaml                # Swagger API documentation
├── tests/
│   ├── unit/
│   │   ├── service/                # Service unit tests
│   │   ├── validator/              # Validator unit tests
│   │   └── models/                 # Model unit tests
│   ├── integration/
│   │   ├── api/                    # API integration tests
│   │   └── repository/             # Repository integration tests
│   └── testdata/
│       ├── valid_characters.json   # Test fixtures
│       └── invalid_characters.json # Validation test cases
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Local development setup
├── go.mod                          # Go dependencies
├── go.sum
├── Makefile                        # Build and test commands
└── README.md                       # Backend documentation

frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── Layout.tsx
│   │   ├── characters/
│   │   │   ├── CharacterList.tsx       # Tile view with filter/sort
│   │   │   ├── CharacterTile.tsx       # Individual tile card
│   │   │   ├── CharacterPreview.tsx    # Preview modal
│   │   │   ├── CharacterForm.tsx       # Create/Edit form
│   │   │   ├── CharacterFilters.tsx    # Filter controls
│   │   │   └── EmptyState.tsx          # No characters state
│   │   └── character-form/
│   │       ├── BasicInfoSection.tsx    # Name, race, class, level
│   │       ├── AbilityScoresSection.tsx # 6 ability scores with modifiers
│   │       ├── SkillsSection.tsx       # 18 skills with proficiency
│   │       ├── CombatStatsSection.tsx  # HP, AC, initiative, speed
│   │       ├── InventorySection.tsx    # Weapons, armor, equipment
│   │       ├── SpellcastingSection.tsx # Spells, spell slots
│   │       ├── PersonalitySection.tsx  # Traits, ideals, bonds, flaws
│   │       └── AppearanceSection.tsx   # Physical description
│   ├── pages/
│   │   ├── CharactersPage.tsx          # Main character list page
│   │   ├── CreateCharacterPage.tsx     # Create character page
│   │   ├── EditCharacterPage.tsx       # Edit character page
│   │   └── NotFoundPage.tsx            # 404 page
│   ├── services/
│   │   ├── api.ts                      # Axios configuration
│   │   ├── characterService.ts         # API calls for characters
│   │   └── config.ts                   # Environment configuration
│   ├── hooks/
│   │   ├── useCharacters.ts            # Character CRUD operations
│   │   ├── useTheme.ts                 # Theme management
│   │   ├── useFilter.ts                # Filter/sort logic
│   │   └── useValidation.ts            # Form validation hook
│   ├── validation/
│   │   ├── characterSchema.ts          # JSON Schema validation (Yup)
│   │   └── validators.ts               # Custom validators
│   ├── types/
│   │   ├── character.ts                # TypeScript types from schema
│   │   └── api.ts                      # API response types
│   ├── utils/
│   │   ├── calculations.ts             # Ability modifier, proficiency bonus
│   │   ├── formatting.ts               # Display formatting
│   │   └── constants.ts                # D&D constants (classes, races, etc.)
│   ├── styles/
│   │   ├── global.css                  # Global styles
│   │   ├── themes.css                  # Light/dark theme variables
│   │   └── components/                 # Component-specific styles
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Application entry point
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   │   ├── components/                 # Component unit tests
│   │   ├── utils/                      # Utility function tests
│   │   └── validation/                 # Validation tests
│   ├── integration/
│   │   ├── api/                        # API integration tests (MSW)
│   │   └── flows/                      # Multi-component flow tests
│   └── e2e/
│       └── cypress/
│           ├── integration/
│           │   ├── character-list.spec.ts     # User Story 1 tests
│           │   ├── character-create.spec.ts   # User Story 2 tests
│           │   ├── character-edit.spec.ts     # User Story 3 tests
│           │   └── character-delete.spec.ts   # User Story 4 tests
│           └── fixtures/
│               └── characters.json             # Test data
├── Dockerfile                          # Multi-stage Docker build
├── nginx.conf                          # Nginx configuration
├── .env.example                        # Environment variable template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.js
├── cypress.config.ts
└── README.md                           # Frontend documentation

docker/
├── docker-compose.dev.yml              # Development environment
├── docker-compose.prod.yml             # Production environment
└── README.md                           # Docker setup guide

.github/
└── workflows/
    ├── backend-ci.yml                  # Backend CI/CD
    ├── frontend-ci.yml                 # Frontend CI/CD
    └── integration.yml                 # Full stack integration tests
```

**Structure Decision**: Web application structure selected due to separate frontend (React) and backend (Go) requirements. This allows independent development, testing, and deployment while maintaining clear separation of concerns. Docker Compose will orchestrate both services plus MongoDB for local development and production deployment.

## Phase 0: Research

### Technology Validation

#### Frontend Research
- **React 18**: Confirm hooks, context, and suspense support for modern patterns
- **Validation Library**: Compare Yup vs Zod for JSON Schema validation
- **UI Framework**: Evaluate Tailwind CSS vs Material-UI vs Chakra UI for theming
- **Form Management**: React Hook Form vs Formik for complex nested forms
- **State Management**: Determine if Context API sufficient or need Redux/Zustand
- **Testing Strategy**: Confirm Jest + RTL + Cypress stack covers all test types

#### Backend Research
- **Go HTTP Framework**: Compare Gin vs Fiber vs Chi for performance and features
- **MongoDB Driver**: Validate official mongo-go-driver supports all schema features
- **JSON Schema Validation**: Research Go libraries (gojsonschema, jsonschema)
- **Swagger Generation**: Compare go-swagger vs swaggo for API documentation
- **Logging**: Evaluate logrus vs zap vs zerolog for structured logging
- **CORS Middleware**: Validate go-cors or framework-native CORS support

#### Infrastructure Research
- **Docker Multi-Stage Builds**: Optimize for production image size
- **MongoDB Indexes**: Determine optimal indexes for character queries
- **Environment Configuration**: Best practices for Go and React config management
- **CI/CD**: GitHub Actions workflow for automated testing and deployment

### Deliverables
- `research.md`: Technology choices with justifications
- Proof-of-concept validation tests for critical components
- Performance benchmark baseline

## Phase 1: Design

### Data Model Design

#### MongoDB Schema
```json
{
  "_id": "ObjectId",
  "characterName": "string (unique indexed, max 500 chars)",
  "race": "string (indexed, max 500 chars)",
  "class": "string (indexed, max 500 chars)",
  "level": "integer",
  "abilityScores": { ... },
  "skills": { ... },
  "hitPoints": { ... },
  "inventory": { ... },
  "spellcasting": { ... },
  "personality": { ... },
  "appearance": { ... },
  "backstory": "string (max 500 chars)",
  "createdAt": "ISODate (auto-generated on create)",
  "updatedAt": "ISODate (auto-updated on every save)"
}
```

**String Constraints**: All string fields have a maximum length of 500 characters, enforced at both frontend and backend validation layers.

**Indexes**:
- `characterName`: **Unique** index for enforcing name uniqueness
- `class`: Single field index for filtering
- `race`: Single field index for filtering
- Compound index on `(class, level)` for common queries
- Index on `updatedAt` for future sort by recently modified

#### TypeScript Types
Generate TypeScript interfaces from character-schema.json for type safety across frontend.

### API Contract Design

#### RESTful Endpoints

**Base URL**: `http://localhost:8080/api/v1` (configurable)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/characters` | List all characters with optional query params | - | `{ characters: Character[] }` |
| GET | `/characters/:id` | Get single character by ID | - | `{ character: Character }` |
| POST | `/characters` | Create new character | `Character` | `{ character: Character }` |
| PUT | `/characters/:id` | Update existing character | `Character` | `{ character: Character }` |
| DELETE | `/characters/:id` | Delete character | - | `{ success: true }` |
| GET | `/health` | Health check endpoint | - | `{ status: "ok", mongodb: "connected" }` |

**Query Parameters** (GET `/characters`):
- `search`: Filter by character name (partial match, case-insensitive)
- `class`: Filter by exact class
- `race`: Filter by exact race
- `sort`: Sort field (default: characterName, options: characterName, createdAt, updatedAt, level)
- `order`: Sort order (asc/desc, default: asc)

**Note**: No pagination - all characters returned in single response. Frontend handles filtering and sorting display.

#### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "validation error details"
    }
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Invalid input data (400)
- `NOT_FOUND`: Character not found (404)
- `DUPLICATE_NAME`: Character name already exists (409)
- `DATABASE_ERROR`: Database operation failed (500)
- `INTERNAL_ERROR`: Unexpected server error (500)

### Component Architecture

#### Frontend Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   └── ThemeToggle
│   └── <Page Content>
└── Routes
    ├── CharactersPage
    │   ├── CharacterFilters
    │   ├── CharacterList
    │   │   ├── CharacterTile (multiple)
    │   │   └── EmptyState
    │   └── CharacterPreview (modal)
    ├── CreateCharacterPage
    │   └── CharacterForm
    │       ├── BasicInfoSection
    │       ├── AbilityScoresSection
    │       ├── SkillsSection
    │       ├── CombatStatsSection
    │       ├── InventorySection
    │       ├── SpellcastingSection
    │       ├── PersonalitySection
    │       └── AppearanceSection
    └── EditCharacterPage
        └── CharacterForm (reused)
```

#### Backend Package Architecture
```
cmd/server
  └── main.go (DI setup, server start)

internal/
├── config (environment variables)
├── logger (structured logging setup)
├── models (data structures)
├── validator (schema validation)
├── repository (data access interface + MongoDB impl)
├── service (business logic)
├── handler (HTTP controllers)
└── middleware (cross-cutting concerns)
```

### Deliverables
- `data-model.md`: Complete MongoDB schema design with indexes
- `contracts/api-spec.yaml`: OpenAPI 3.0 specification
- `contracts/error-codes.md`: Standardized error code definitions
- `quickstart.md`: Developer environment setup guide
- Architecture diagrams (component hierarchy, request flow)

## Phase 2: Task Breakdown

*Detailed task breakdown will be generated with `/speckit.tasks` command after Phase 0-1 completion.*

### High-Level Task Categories

1. **Setup & Infrastructure** (P1)
   - Initialize Go module and project structure
   - Initialize React project with Vite/CRA
   - Configure Docker and docker-compose
   - Setup CI/CD pipelines
   - Configure linters and formatters

2. **Backend Foundation** (P1)
   - Implement configuration management
   - Setup structured logging
   - Configure MongoDB connection with pooling
   - Implement health check endpoint
   - Setup CORS middleware
   - Generate Swagger documentation

3. **Character Data Layer** (P1)
   - Implement Character model from schema with 500 char string limits
   - Add createdAt and updatedAt timestamp fields
   - Implement JSON schema validator with uniqueness check for characterName
   - Implement MongoDB repository interface
   - Implement MongoDB repository (CRUD operations)
   - Create unique index on characterName in MongoDB
   - Write repository unit tests
   - Write repository integration tests

4. **Character Service Layer** (P1)
   - Implement character service interface
   - Implement character service with validation (500 char limits, uniqueness)
   - Implement automatic timestamp management (createdAt, updatedAt)
   - Write service unit tests
   - Implement error handling and logging

5. **Character API Layer** (P1)
   - Implement character handlers
   - Implement request/response validation
   - Implement error response middleware
   - Write API integration tests
   - Test Swagger documentation accuracy

6. **Frontend Foundation** (P1)
   - Setup React project with TypeScript
   - Configure routing (React Router)
   - Implement theme provider (light/dark mode)
   - Setup Axios with configurable API URL
   - Implement error boundary
   - Create common UI components (Button, Input, Select, Modal)

7. **Character List Feature** (P1 - User Story 1)
   - Implement CharacterList component
   - Implement CharacterTile component
   - Implement CharacterFilters component
   - Implement CharacterPreview modal
   - Implement EmptyState component
   - Implement useCharacters hook
   - Implement useFilter hook
   - Write component unit tests
   - Write Cypress E2E tests for User Story 1

8. **Character Create Feature** (P1 - User Story 2)
   - Implement CharacterForm component
   - Implement all form sections (8 sections)
   - Implement validation schema (Yup/Zod) with 500 char max on all strings
   - Implement validation on blur (field loses focus)
   - Implement character name uniqueness check
   - Implement auto-calculations (modifiers, proficiency)
   - Implement useValidation hook
   - Write component unit tests
   - Write integration tests with MSW
   - Write Cypress E2E tests for User Story 2

9. **Character Edit Feature** (P2 - User Story 3)
   - Implement edit page with form pre-population
   - Implement unsaved changes warning
   - Implement update API integration
   - Write component unit tests
   - Write Cypress E2E tests for User Story 3

10. **Character Delete Feature** (P3 - User Story 4)
    - Implement delete confirmation modal
    - Implement delete API integration
    - Write component unit tests
    - Write Cypress E2E tests for User Story 4

11. **Testing & Quality Assurance**
    - Achieve 80%+ code coverage (backend)
    - Achieve 80%+ code coverage (frontend)
    - Run all E2E tests
    - Performance testing (load testing backend)
    - Accessibility testing (WCAG compliance)
    - Cross-browser testing

12. **Documentation & Deployment**
    - Complete API documentation
    - Complete README files
    - Create deployment guide
    - Build production Docker images
    - Deploy to staging environment
    - Final acceptance testing

## Testing Strategy

### Backend Testing

#### Unit Tests
- **Models**: Test JSON schema conformance, validation rules
- **Validators**: Test all validation rules, edge cases
- **Services**: Test business logic with mocked repositories
- **Utilities**: Test calculation functions (proficiency bonus, modifiers)

**Tools**: Go testing package, testify/assert, testify/mock  
**Coverage Target**: 85%+

#### Integration Tests
- **Repository**: Test MongoDB CRUD operations with test database
- **API Endpoints**: Test HTTP handlers with httptest and test MongoDB
- **Middleware**: Test CORS, logging, error handling

**Tools**: httptest, mongodb test container or in-memory alternative  
**Coverage Target**: 80%+

#### Contract Tests
- **Schema Validation**: Validate all endpoints conform to Swagger spec
- **Error Responses**: Validate error format consistency

### Frontend Testing

#### Unit Tests
- **Components**: Test rendering, user interactions, props
- **Hooks**: Test custom hooks in isolation
- **Utils**: Test calculation functions, formatters, validators
- **Validation**: Test schema validation rules

**Tools**: Jest, React Testing Library  
**Coverage Target**: 85%+

#### Integration Tests
- **API Integration**: Test service layer with MSW (Mock Service Worker)
- **Form Flows**: Test multi-step form interactions
- **State Management**: Test context providers and state updates

**Tools**: Jest, RTL, MSW  
**Coverage Target**: 80%+

#### E2E Tests
- **User Story 1**: Test character list, filter, sort, preview
- **User Story 2**: Test character creation flow with validation
- **User Story 3**: Test character edit flow
- **User Story 4**: Test character deletion with confirmation
- **Theme Toggle**: Test light/dark mode switching
- **Error Scenarios**: Test error handling and network failures

**Tools**: Cypress  
**Coverage Target**: All acceptance scenarios from spec

### Test Data
- Use sample-characters.json as baseline test data
- Create invalid character fixtures for validation testing
- Generate edge case test data (min/max values, empty arrays, etc.)

## Configuration Management

### Backend Environment Variables
```bash
# Server Configuration
PORT=8080
API_VERSION=v1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=pc_db
MONGODB_COLLECTION=characters
MONGODB_TIMEOUT=10s
MONGODB_POOL_SIZE=100

# Logging Configuration
LOG_LEVEL=info  # debug, info, warn, error
LOG_FORMAT=json  # json, text

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization

# Application Configuration
ENV=development  # development, staging, production
```

### Frontend Environment Variables
```bash
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Application Configuration
VITE_ENV=development  # development, staging, production
VITE_APP_NAME=D&D Character Creator
```

## Docker Configuration

### Backend Dockerfile
```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Production stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
COPY --from=builder /app/api ./api
EXPOSE 8080
CMD ["./server"]
```

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (Development)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: dnd-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: pc_db

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dnd-backend
    ports:
      - "8080:8080"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/
      MONGODB_DATABASE: pc_db
      MONGODB_COLLECTION: characters
      CORS_ALLOWED_ORIGINS: http://localhost:3000
      LOG_LEVEL: debug
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: dnd-frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://localhost:8080/api/v1
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Performance Considerations

### Backend Optimizations
- **Connection Pooling**: Configure MongoDB connection pool (size: 100)
- **Indexes**: Create unique index on characterName; indexes on class, race, updatedAt; compound index on (class, level)
- **No Pagination**: Return all characters in single query (optimized with projection for list view)
- **Query Optimization**: Use projection to return only needed fields (e.g., name, class, level, race for tile view)
- **String Length Validation**: Enforce 500 char max at API layer before database operations
- **Logging**: Use structured logging with configurable levels (reduce overhead in prod)
- **Error Handling**: Avoid expensive stack traces in production logs

### Frontend Optimizations
- **Code Splitting**: Lazy load routes and heavy components (spellcasting, inventory)
- **Memoization**: Use React.memo for tile components to prevent re-renders
- **Debouncing**: Debounce search/filter inputs (300ms)
- **Client-Side Filtering**: All filter/sort operations happen in-memory (no pagination)
- **Validation on Blur**: Validate fields only when losing focus (not on every keystroke)
- **Bundle Optimization**: Tree-shaking, minification, gzip compression
- **API Caching**: Cache character list with SWR or React Query

### Database Optimizations
- **Indexes**: Unique index on characterName; standard indexes on class, race, updatedAt; compound index on (class, level)
- **Document Size**: Monitor character document size (MongoDB 16MB limit); 500 char string limits prevent excessive growth
- **Batch Operations**: Use bulk operations for seed data or imports

## Security Considerations

### Input Validation
- **Backend**: Validate all inputs against JSON schema before processing
- **Frontend**: Client-side validation for UX (validates on blur), not security
- **String Length**: Enforce 500 character maximum on all string fields
- **Character Name Uniqueness**: Check uniqueness at both frontend (API call) and backend (database constraint)
- **Sanitization**: Sanitize all string inputs to prevent XSS (Go: html.EscapeString)
- **SQL Injection**: N/A (using MongoDB, but still validate query params)

### CORS Configuration
- **Allowed Origins**: Whitelist frontend origins (environment variable)
- **Credentials**: Enable credentials for future authentication
- **Methods**: Restrict to needed methods (GET, POST, PUT, DELETE)

### Error Handling
- **Error Messages**: Never expose internal details, stack traces, or database errors
- **Logging**: Log all errors server-side with context (request ID, user info)
- **Rate Limiting**: Consider implementing rate limiting for API endpoints (future)

### Data Privacy
- **No Authentication**: Out of scope for this phase
- **Data Encryption**: Use HTTPS in production (handled by reverse proxy/load balancer)
- **Sensitive Data**: No sensitive data in character schema (no passwords, emails)

## Deployment Strategy

### Local Development
1. Run `docker-compose up` to start MongoDB, backend, and frontend
2. Backend available at `http://localhost:8080`
3. Frontend available at `http://localhost:3000`
4. MongoDB available at `mongodb://localhost:27017`

### CI/CD Pipeline (GitHub Actions)

**Backend Pipeline**:
1. Checkout code
2. Setup Go 1.21
3. Run `golangci-lint`
4. Run `go test ./...` with coverage
5. Build Docker image
6. Push to container registry (if main branch)

**Frontend Pipeline**:
1. Checkout code
2. Setup Node.js 18
3. Run `npm run lint`
4. Run `npm run test` with coverage
5. Run `npm run build`
6. Build Docker image
7. Push to container registry (if main branch)

**Integration Pipeline**:
1. Start all services with docker-compose
2. Run backend integration tests
3. Run frontend E2E tests (Cypress)
4. Generate coverage report

### Production Deployment
1. Use docker-compose.prod.yml with production configuration
2. Configure reverse proxy (nginx/traefik) for HTTPS
3. Setup monitoring and logging aggregation
4. Configure automated backups for MongoDB
5. Setup health checks and auto-restart policies

## Open Questions & Decisions Needed

1. **Authentication**: How will multi-user support be added in the future?
2. **Data Migration**: How will schema changes be handled for existing characters?
3. **Backup Strategy**: What is the backup frequency and retention policy for MongoDB?
4. **Monitoring**: What monitoring/alerting tools should be integrated (Prometheus, Datadog)?
5. **Image Storage**: If character portraits are added, where will images be stored?
6. **API Versioning**: How will breaking changes be handled (separate endpoints vs versioning)?
7. **Soft Delete**: Should characters be soft-deleted (flagged) or hard-deleted?

## Clarification Decisions (RESOLVED)

✅ **Character Name Uniqueness**: Enforce unique names - database constraint + validation  
✅ **Pagination**: No pagination - load all characters at once  
✅ **Modification Timestamps**: Track createdAt and updatedAt automatically  
✅ **Filter/Sort Persistence**: Do not persist - reset on page load  
✅ **Validation Timing**: Validate on blur (field loses focus)  
✅ **String Length Limits**: Maximum 500 characters for all string fields

## Success Criteria

### Functional Success
- ✅ All User Story acceptance scenarios pass
- ✅ All API endpoints functional and documented
- ✅ Character CRUD operations work correctly
- ✅ Character name uniqueness enforced
- ✅ Timestamps (createdAt, updatedAt) automatically managed
- ✅ Validation works identically on frontend and backend
- ✅ Validation triggers on blur for all string fields
- ✅ All string fields limited to 500 characters
- ✅ Light/dark mode theme switching works
- ✅ Filter, sort, and search work correctly (client-side, no persistence)
- ✅ All characters load without pagination
- ✅ All errors display user-friendly messages

### Technical Success
- ✅ Backend test coverage ≥ 80%
- ✅ Frontend test coverage ≥ 80%
- ✅ All E2E tests pass
- ✅ Performance targets met (listed in spec)
- ✅ Docker containers build and run successfully
- ✅ Swagger documentation accurate and complete
- ✅ All linters pass (golangci-lint, ESLint)
- ✅ No critical security vulnerabilities

### Quality Success
- ✅ Code follows constitution principles
- ✅ All code reviewed and approved
- ✅ Documentation complete and accurate
- ✅ Accessibility requirements met (WCAG AA)
- ✅ Cross-browser compatibility verified
- ✅ Mobile responsiveness verified

## Next Steps

1. **Review this plan** with stakeholders and get approval
2. **Execute Phase 0** (Research): Complete `research.md` with technology validation
3. **Execute Phase 1** (Design): Complete data model, API contracts, and quickstart guide
4. **Generate tasks** with `/speckit.tasks` command after Phase 1 completion
5. **Begin TDD implementation** following task breakdown
6. **Iterate and refine** based on learnings and feedback

---

**Plan Version**: 1.1  
**Last Updated**: 2025-11-03  
**Status**: Clarifications Resolved - Ready for Phase 0
