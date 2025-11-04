# D&D 5e Character Creator - Quick Start Guide

## ✅ Implementation Status: MVP COMPLETE

All core user stories implemented:
- ✅ **US1: Browse Characters** - List, filter, search, sort, preview
- ✅ **US2: Create Characters** - Multi-step wizard with validation
- ✅ **US3: Edit Characters** - Update existing characters
- ✅ **US4: Delete Characters** - Confirmation modal

## 🚀 Quick Start

### Prerequisites
- Go 1.21+ installed
- Node.js 18+ installed
- MongoDB 6.0+ running on localhost:27017

### Option 1: Run with Docker (Recommended)

```powershell
# Start all services (MongoDB, Backend, Frontend)
cd docker
docker-compose -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# MongoDB: mongodb://localhost:27017
```

### Option 2: Run Locally

#### Terminal 1 - Start MongoDB
```powershell
# If MongoDB is not running, start it
mongod
```

#### Terminal 2 - Start Backend
```powershell
cd backend

# First time setup
go mod download

# Run the server
go run cmd/server/main.go

# Server will start on http://localhost:8080
# Health check: http://localhost:8080/health
```

#### Terminal 3 - Start Frontend
```powershell
cd frontend

# First time setup
npm install

# Run development server
npm run dev

# App will open on http://localhost:3000
```

## 📋 Features Implemented

### Backend (Go + Gin + MongoDB)
- **API Endpoints**:
  - `GET /api/v1/characters` - List all characters with filtering (search, class, race, sort)
  - `GET /api/v1/characters/:id` - Get single character
  - `POST /api/v1/characters` - Create new character
  - `PUT /api/v1/characters/:id` - Update character
  - `DELETE /api/v1/characters/:id` - Delete character
  - `GET /health` - Health check endpoint

- **Features**:
  - Complete D&D 5e character model (220+ fields)
  - Field validation (500 char limits, level 1-20, ability scores 1-30)
  - Automatic ability modifier calculations
  - Character name uniqueness validation
  - MongoDB indexes for optimized queries
  - Structured logging with Logrus
  - CORS middleware for frontend integration
  - Error handling middleware

### Frontend (React + TypeScript + Tailwind)
- **Pages**:
  - `/` - Home page
  - `/characters` - Browse all characters
  - `/characters/new` - Create new character
  - `/characters/:id/edit` - Edit existing character

- **Features**:
  - Multi-step character creation wizard
  - Real-time form validation
  - Ability score calculator with standard array preset
  - Character filtering (search, class, race, sort)
  - Character preview modal with full stats
  - Delete confirmation modal
  - Dark/light theme toggle
  - Responsive grid layout
  - Loading and error states

## 🎮 How to Use

### 1. Browse Characters
- Navigate to `/characters`
- Use filters to search by name, class, or race
- Sort by name, class, race, level, or last modified
- Click any character tile to view full details

### 2. Create a Character
- Click "Create Character" button on characters page
- **Step 1: Basic Info**
  - Enter character name (required)
  - Select race and class (required)
  - Set level 1-20 (required)
  - Optional: player name, subrace, subclass, background, alignment
- **Step 2: Ability Scores**
  - Set scores for STR, DEX, CON, INT, WIS, CHA
  - Use "Standard Array" button for quick setup (15, 14, 13, 12, 10, 8)
  - Modifiers calculated automatically
- Click "Create Character" to save

### 3. Edit a Character
- Open character preview modal
- Click "Edit Character" button
- Modify any fields in the wizard
- Click "Save Changes"

### 4. Delete a Character
- Open character preview modal
- Click "Delete" button
- Confirm deletion in the confirmation prompt
- Character is permanently removed

## 🏗️ Project Structure

```
pc-svc/
├── backend/
│   ├── cmd/server/main.go          # Application entry point
│   ├── internal/
│   │   ├── config/                 # Configuration management
│   │   ├── logger/                 # Logging setup
│   │   ├── middleware/             # HTTP middleware (CORS, logging, errors)
│   │   ├── models/                 # Data models (Character)
│   │   ├── repository/             # Data access layer
│   │   │   ├── character_repository.go
│   │   │   └── mongo/              # MongoDB implementation
│   │   ├── service/                # Business logic
│   │   ├── handler/                # HTTP handlers
│   │   └── validator/              # Input validation
│   └── tests/                      # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── character/          # Character-specific components
│   │   │   │   ├── BasicInfoForm.tsx
│   │   │   │   ├── AbilityScoresForm.tsx
│   │   │   │   ├── CharacterFormWizard.tsx
│   │   │   │   ├── CharacterTile.tsx
│   │   │   │   ├── CharacterList.tsx
│   │   │   │   ├── CharacterFilters.tsx
│   │   │   │   └── CharacterPreview.tsx
│   │   │   ├── common/             # Reusable UI components
│   │   │   └── layout/             # Layout components
│   │   ├── pages/                  # Page components
│   │   │   ├── CharactersPage.tsx
│   │   │   ├── CreateCharacterPage.tsx
│   │   │   └── EditCharacterPage.tsx
│   │   ├── services/               # API clients
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # Helper functions
│   │   └── validation/             # Form validation
│   └── tests/                      # Component tests
└── docker/                         # Docker configuration
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=dnd_characters
CORS_ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=info
LOG_FORMAT=json
GIN_MODE=debug
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:8080
```

## 📊 API Examples

### Create Character
```bash
curl -X POST http://localhost:8080/api/v1/characters \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Thorin Oakenshield",
    "race": "Dwarf",
    "class": "Fighter",
    "level": 5,
    "abilityScores": {
      "strength": {"score": 16, "modifier": 3},
      "dexterity": {"score": 12, "modifier": 1},
      "constitution": {"score": 15, "modifier": 2},
      "intelligence": {"score": 10, "modifier": 0},
      "wisdom": {"score": 13, "modifier": 1},
      "charisma": {"score": 8, "modifier": -1}
    },
    "hitPoints": {"maximum": 47, "current": 47, "temporary": 0},
    "armorClass": 18,
    "proficiencyBonus": 3,
    "initiative": 1,
    "speed": {"walk": 25},
    "passivePerception": 11
  }'
```

### List Characters with Filters
```bash
# Get all fighters
curl http://localhost:8080/api/v1/characters?class=Fighter

# Search by name
curl http://localhost:8080/api/v1/characters?search=Thorin

# Sort by level descending
curl http://localhost:8080/api/v1/characters?sort=level&order=desc
```

## 🧪 Testing

### Backend Tests
```powershell
cd backend
go test ./...
```

### Frontend Tests
```powershell
cd frontend
npm test
```

### E2E Tests
```powershell
cd frontend
npm run test:e2e
```

## 📦 Building for Production

### Backend
```powershell
cd backend
go build -o dnd-api cmd/server/main.go
./dnd-api
```

### Frontend
```powershell
cd frontend
npm run build
# Serve the dist/ folder with your favorite web server
```

### Docker Production Build
```powershell
cd docker
docker-compose -f docker-compose.prod.yml up
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check firewall settings
- Verify MongoDB is accessible: `mongosh mongodb://localhost:27017`

### CORS Errors
- Ensure backend CORS_ALLOWED_ORIGINS includes http://localhost:3000
- Check that frontend VITE_API_URL matches backend URL

### Build Errors
- Backend: Run `go mod tidy` to fix dependencies
- Frontend: Delete `node_modules` and run `npm install`

## 📝 Next Steps (Optional Enhancements)

While the MVP is complete, here are potential enhancements:

1. **Expanded Character Creation**
   - Skills selection with proficiency
   - Equipment and inventory management
   - Spellcasting configuration
   - Multiclassing support

2. **Advanced Features**
   - Character sheet PDF export
   - Character import/export (JSON)
   - Character templates
   - Dice roller integration

3. **Testing**
   - Unit tests for all components
   - Integration tests for API flows
   - E2E tests for user workflows

4. **Deployment**
   - CI/CD pipeline
   - Production Docker configuration
   - Cloud deployment (AWS/Azure/GCP)
   - Database backups

## 📄 License

This project is for educational purposes.

## 👥 Contributing

This is a demonstration project. Feel free to fork and extend!

---

**Built with**: Go, Gin, MongoDB, React, TypeScript, Tailwind CSS, Vite
