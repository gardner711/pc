# Tasks: D&D 5e Character Creator

**Input**: Design documents from `/specs/001-dnd-character-creator/`  
**Prerequisites**: plan.md ✅, spec.md ✅, clarifications.md ✅

**TDD Approach**: All tests MUST be written BEFORE implementation code. Tests must FAIL initially, then pass after implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (SETUP, US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with separate frontend and backend:
- **Backend**: `backend/` (Go)
- **Frontend**: `frontend/` (React/TypeScript)
- **Docker**: `docker/` (docker-compose files)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

### Backend Setup

- [ ] T001 [P] [SETUP] Initialize Go module in `backend/go.mod` with module name `github.com/yourusername/dnd-character-creator`
- [ ] T002 [P] [SETUP] Create backend directory structure: `cmd/server/`, `internal/{config,logger,models,repository,service,handler,middleware,validator}/`, `tests/{unit,integration,testdata}/`
- [ ] T003 [P] [SETUP] Install Go dependencies: `gin`, `mongo-go-driver`, `swaggo`, `logrus`, `cors`, `testify`
- [ ] T004 [P] [SETUP] Configure `golangci-lint` in `backend/.golangci.yml`
- [ ] T005 [P] [SETUP] Create `backend/Makefile` with targets: build, test, lint, run, docker-build

### Frontend Setup

- [ ] T006 [P] [SETUP] Initialize React project with Vite and TypeScript in `frontend/` directory
- [ ] T007 [P] [SETUP] Create frontend directory structure: `src/{components,pages,services,hooks,validation,types,utils,styles}/`, `tests/{unit,integration,e2e}/`
- [ ] T008 [P] [SETUP] Install frontend dependencies: `react-router-dom`, `axios`, `react-hook-form`, `yup`, `@testing-library/react`, `cypress`, `msw`
- [ ] T009 [P] [SETUP] Install Tailwind CSS and configure dark mode support in `tailwind.config.js`
- [ ] T010 [P] [SETUP] Configure ESLint and Prettier in `frontend/.eslintrc.js` and `.prettierrc`
- [ ] T011 [P] [SETUP] Configure Jest in `frontend/jest.config.js`
- [ ] T012 [P] [SETUP] Configure Cypress in `frontend/cypress.config.ts`

### Docker & Infrastructure Setup

- [ ] T013 [P] [SETUP] Create `backend/Dockerfile` with multi-stage build (builder + alpine)
- [ ] T014 [P] [SETUP] Create `frontend/Dockerfile` with multi-stage build (node builder + nginx)
- [ ] T015 [P] [SETUP] Create `frontend/nginx.conf` for serving React app
- [ ] T016 [P] [SETUP] Create `docker/docker-compose.dev.yml` with services: mongodb, backend, frontend
- [ ] T017 [P] [SETUP] Create `.env.example` files for both backend and frontend with all required variables
- [ ] T018 [P] [SETUP] Create root `README.md` with project overview and quick start guide

### CI/CD Setup

- [ ] T019 [P] [SETUP] Create `.github/workflows/backend-ci.yml` for Go testing and linting
- [ ] T020 [P] [SETUP] Create `.github/workflows/frontend-ci.yml` for React testing and linting
- [ ] T021 [P] [SETUP] Create `.github/workflows/integration.yml` for E2E tests with docker-compose

**Checkpoint**: Project structure ready - can begin foundational implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

#### Configuration & Logging

- [ ] T022 [P] [FOUNDATION] Write tests for config loading in `backend/tests/unit/config/config_test.go`
- [ ] T023 [FOUNDATION] Implement configuration management in `backend/internal/config/config.go` (load from env vars)
- [ ] T024 [P] [FOUNDATION] Write tests for logger in `backend/tests/unit/logger/logger_test.go`
- [ ] T025 [FOUNDATION] Setup structured logging in `backend/internal/logger/logger.go` (JSON format, configurable levels)

#### Database Connection

- [ ] T026 [P] [FOUNDATION] Write tests for MongoDB connection in `backend/tests/integration/repository/mongo_connection_test.go`
- [ ] T027 [FOUNDATION] Implement MongoDB connection with pooling in `backend/internal/repository/mongo/connection.go`
- [ ] T028 [FOUNDATION] Create database initialization script to create indexes in `backend/internal/repository/mongo/init.go`

#### Middleware

- [ ] T029 [P] [FOUNDATION] Write tests for CORS middleware in `backend/tests/unit/middleware/cors_test.go`
- [ ] T030 [FOUNDATION] Implement CORS middleware in `backend/internal/middleware/cors.go`
- [ ] T031 [P] [FOUNDATION] Write tests for logging middleware in `backend/tests/unit/middleware/logging_test.go`
- [ ] T032 [FOUNDATION] Implement request logging middleware in `backend/internal/middleware/logging.go`
- [ ] T033 [P] [FOUNDATION] Write tests for error handling middleware in `backend/tests/unit/middleware/error_test.go`
- [ ] T034 [FOUNDATION] Implement error handling middleware in `backend/internal/middleware/error.go`

#### Health Check

- [ ] T035 [P] [FOUNDATION] Write tests for health check endpoint in `backend/tests/integration/api/health_test.go`
- [ ] T036 [FOUNDATION] Implement health check handler in `backend/internal/handler/health_handler.go`

#### Main Application

- [ ] T037 [FOUNDATION] Implement main application entry point in `backend/cmd/server/main.go` (wire up DI, start server)
- [ ] T038 [FOUNDATION] Add Swagger documentation annotations to health endpoint

### Frontend Foundation

#### Routing & Layout

- [ ] T039 [P] [FOUNDATION] Write tests for App routing in `frontend/tests/unit/App.test.tsx`
- [ ] T040 [FOUNDATION] Implement App component with routes in `frontend/src/App.tsx`
- [ ] T041 [P] [FOUNDATION] Write tests for Layout component in `frontend/tests/unit/components/layout/Layout.test.tsx`
- [ ] T042 [FOUNDATION] Implement Layout component in `frontend/src/components/layout/Layout.tsx`
- [ ] T043 [P] [FOUNDATION] Write tests for Header component in `frontend/tests/unit/components/layout/Header.test.tsx`
- [ ] T044 [FOUNDATION] Implement Header component in `frontend/src/components/layout/Header.tsx`

#### Theme System

- [ ] T045 [P] [FOUNDATION] Write tests for theme context in `frontend/tests/unit/hooks/useTheme.test.ts`
- [ ] T046 [FOUNDATION] Implement theme context and useTheme hook in `frontend/src/hooks/useTheme.ts`
- [ ] T047 [P] [FOUNDATION] Write tests for ThemeToggle component in `frontend/tests/unit/components/layout/ThemeToggle.test.tsx`
- [ ] T048 [FOUNDATION] Implement ThemeToggle component in `frontend/src/components/layout/ThemeToggle.tsx`
- [ ] T049 [FOUNDATION] Define theme CSS variables in `frontend/src/styles/themes.css` (light and dark)

#### API Service Layer

- [ ] T050 [P] [FOUNDATION] Write tests for API config in `frontend/tests/unit/services/api.test.ts`
- [ ] T051 [FOUNDATION] Implement Axios configuration with base URL in `frontend/src/services/api.ts`
- [ ] T052 [P] [FOUNDATION] Write tests for environment config in `frontend/tests/unit/services/config.test.ts`
- [ ] T053 [FOUNDATION] Implement environment configuration in `frontend/src/services/config.ts`

#### Common Components

- [ ] T054 [P] [FOUNDATION] Write tests for Button component in `frontend/tests/unit/components/common/Button.test.tsx`
- [ ] T055 [FOUNDATION] Implement Button component in `frontend/src/components/common/Button.tsx`
- [ ] T056 [P] [FOUNDATION] Write tests for Input component in `frontend/tests/unit/components/common/Input.test.tsx`
- [ ] T057 [FOUNDATION] Implement Input component with validation display in `frontend/src/components/common/Input.tsx`
- [ ] T058 [P] [FOUNDATION] Write tests for Select component in `frontend/tests/unit/components/common/Select.test.tsx`
- [ ] T059 [FOUNDATION] Implement Select component in `frontend/src/components/common/Select.tsx`
- [ ] T060 [P] [FOUNDATION] Write tests for Modal component in `frontend/tests/unit/components/common/Modal.test.tsx`
- [ ] T061 [FOUNDATION] Implement Modal component in `frontend/src/components/common/Modal.tsx`
- [ ] T062 [P] [FOUNDATION] Write tests for ErrorMessage component in `frontend/tests/unit/components/common/ErrorMessage.test.tsx`
- [ ] T063 [FOUNDATION] Implement ErrorMessage component in `frontend/src/components/common/ErrorMessage.tsx`
- [ ] T064 [P] [FOUNDATION] Write tests for LoadingSpinner component in `frontend/tests/unit/components/common/LoadingSpinner.test.tsx`
- [ ] T065 [FOUNDATION] Implement LoadingSpinner component in `frontend/src/components/common/LoadingSpinner.tsx`

#### TypeScript Types

- [ ] T066 [P] [FOUNDATION] Generate TypeScript types from character-schema.json in `frontend/src/types/character.ts`
- [ ] T067 [P] [FOUNDATION] Define API response types in `frontend/src/types/api.ts`

#### Utility Functions

- [ ] T068 [P] [FOUNDATION] Write tests for calculation utils in `frontend/tests/unit/utils/calculations.test.ts`
- [ ] T069 [FOUNDATION] Implement calculation utils (ability modifier, proficiency bonus) in `frontend/src/utils/calculations.ts`
- [ ] T070 [P] [FOUNDATION] Write tests for formatting utils in `frontend/tests/unit/utils/formatting.test.ts`
- [ ] T071 [FOUNDATION] Implement formatting utils in `frontend/src/utils/formatting.ts`
- [ ] T072 [FOUNDATION] Define D&D constants (races, classes, alignments) in `frontend/src/utils/constants.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse and Find Characters (Priority: P1) 🎯 MVP

**Goal**: Users can view all their characters in a tile format, filter by name/class, sort alphabetically, and preview character details

**Independent Test**: Create sample characters via database seed, verify tile display, filtering, sorting, and preview modal work

### Backend - Character Model & Repository (US1)

- [ ] T073 [P] [US1] Write tests for Character model in `backend/tests/unit/models/character_test.go`
- [ ] T074 [US1] Implement Character model struct in `backend/internal/models/character.go` (all fields from schema, max 500 char strings, timestamps)
- [ ] T075 [P] [US1] Write tests for character validator in `backend/tests/unit/validator/character_validator_test.go`
- [ ] T076 [US1] Implement character validator in `backend/internal/validator/character_validator.go` (JSON schema validation, 500 char limit, uniqueness check)
- [ ] T077 [P] [US1] Write tests for character repository interface in `backend/tests/unit/repository/character_repository_test.go`
- [ ] T078 [US1] Define character repository interface in `backend/internal/repository/character_repository.go` (FindAll, FindByID, Create, Update, Delete)
- [ ] T079 [P] [US1] Write tests for MongoDB character repository in `backend/tests/integration/repository/mongo_character_repository_test.go`
- [ ] T080 [US1] Implement MongoDB character repository in `backend/internal/repository/mongo/character_repo.go`
- [ ] T081 [US1] Create unique index on characterName in `backend/internal/repository/mongo/init.go`
- [ ] T082 [US1] Create indexes on class, race, updatedAt in `backend/internal/repository/mongo/init.go`

### Backend - Character Service (US1)

- [ ] T083 [P] [US1] Write tests for character service in `backend/tests/unit/service/character_service_test.go`
- [ ] T084 [US1] Implement character service interface in `backend/internal/service/character_service.go`
- [ ] T085 [US1] Implement character service in `backend/internal/service/character_service_impl.go` (business logic, logging)
- [ ] T086 [US1] Add timestamp auto-generation (createdAt on create, updatedAt on update) in service layer

### Backend - GET /characters API (US1)

- [ ] T087 [P] [US1] Write tests for GET /characters endpoint in `backend/tests/integration/api/get_characters_test.go`
- [ ] T088 [US1] Implement character handler GET /characters in `backend/internal/handler/character_handler.go`
- [ ] T089 [US1] Add query parameter support (search, class, race, sort, order) in GET /characters handler
- [ ] T090 [US1] Wire up GET /characters route in `backend/cmd/server/main.go`
- [ ] T091 [US1] Add Swagger annotations for GET /characters

### Backend - GET /characters/:id API (US1)

- [ ] T092 [P] [US1] Write tests for GET /characters/:id endpoint in `backend/tests/integration/api/get_character_by_id_test.go`
- [ ] T093 [US1] Implement character handler GET /characters/:id in `backend/internal/handler/character_handler.go`
- [ ] T094 [US1] Wire up GET /characters/:id route in `backend/cmd/server/main.go`
- [ ] T095 [US1] Add Swagger annotations for GET /characters/:id

### Backend - Test Data & Seeding (US1)

- [ ] T096 [P] [US1] Create valid character test fixtures in `backend/tests/testdata/valid_characters.json`
- [ ] T097 [US1] Create database seed script for development data in `backend/scripts/seed.go`

### Frontend - Character Service (US1)

- [ ] T098 [P] [US1] Write tests for character service in `frontend/tests/unit/services/characterService.test.ts`
- [ ] T099 [US1] Implement character service with API calls in `frontend/src/services/characterService.ts` (getAll, getById)
- [ ] T100 [P] [US1] Write tests for useCharacters hook in `frontend/tests/unit/hooks/useCharacters.test.ts`
- [ ] T101 [US1] Implement useCharacters hook in `frontend/src/hooks/useCharacters.ts` (fetch characters, loading states, error handling)

### Frontend - Filter & Sort Logic (US1)

- [ ] T102 [P] [US1] Write tests for useFilter hook in `frontend/tests/unit/hooks/useFilter.test.ts`
- [ ] T103 [US1] Implement useFilter hook in `frontend/src/hooks/useFilter.ts` (filter by name/class/race, sort by name, client-side)

### Frontend - Character List Components (US1)

- [ ] T104 [P] [US1] Write tests for CharacterTile in `frontend/tests/unit/components/characters/CharacterTile.test.tsx`
- [ ] T105 [US1] Implement CharacterTile component in `frontend/src/components/characters/CharacterTile.tsx` (display name, class, level, race)
- [ ] T106 [P] [US1] Write tests for EmptyState in `frontend/tests/unit/components/characters/EmptyState.test.tsx`
- [ ] T107 [US1] Implement EmptyState component in `frontend/src/components/characters/EmptyState.tsx`
- [ ] T108 [P] [US1] Write tests for CharacterFilters in `frontend/tests/unit/components/characters/CharacterFilters.test.tsx`
- [ ] T109 [US1] Implement CharacterFilters component in `frontend/src/components/characters/CharacterFilters.tsx` (search, class filter, race filter, sort)
- [ ] T110 [P] [US1] Write tests for CharacterPreview in `frontend/tests/unit/components/characters/CharacterPreview.test.tsx`
- [ ] T111 [US1] Implement CharacterPreview modal in `frontend/src/components/characters/CharacterPreview.tsx` (show key stats: name, class, level, race, ability scores, HP, AC)
- [ ] T112 [P] [US1] Write tests for CharacterList in `frontend/tests/unit/components/characters/CharacterList.test.tsx`
- [ ] T113 [US1] Implement CharacterList component in `frontend/src/components/characters/CharacterList.tsx` (tile grid, load all characters, no pagination)

### Frontend - Characters Page (US1)

- [ ] T114 [P] [US1] Write tests for CharactersPage in `frontend/tests/unit/pages/CharactersPage.test.tsx`
- [ ] T115 [US1] Implement CharactersPage in `frontend/src/pages/CharactersPage.tsx` (compose filters, list, preview)
- [ ] T116 [US1] Add CharactersPage route to App.tsx

### Frontend - Integration Tests (US1)

- [ ] T117 [P] [US1] Setup MSW mock handlers for character API in `frontend/tests/integration/mocks/handlers.ts`
- [ ] T118 [US1] Write integration test for character list flow in `frontend/tests/integration/flows/characterList.test.tsx`

### E2E Tests for User Story 1

- [ ] T119 [P] [US1] Create character fixtures for Cypress in `frontend/tests/e2e/cypress/fixtures/characters.json`
- [ ] T120 [US1] Write Cypress test for acceptance scenario 1 (tile display) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T121 [US1] Write Cypress test for acceptance scenario 2 (filter by name) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T122 [US1] Write Cypress test for acceptance scenario 3 (filter by class) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T123 [US1] Write Cypress test for acceptance scenario 4 (filter by description) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T124 [US1] Write Cypress test for acceptance scenario 5 (sort alphabetically) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T125 [US1] Write Cypress test for acceptance scenario 6 (preview modal) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T126 [US1] Write Cypress test for acceptance scenario 7 (empty state) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`
- [ ] T127 [US1] Write Cypress test for acceptance scenario 8 (theme toggle) in `frontend/tests/e2e/cypress/integration/character-list.spec.ts`

**Checkpoint**: User Story 1 is fully functional - users can browse, filter, sort, and preview characters

---

## Phase 4: User Story 2 - Create New Character (Priority: P1) 🎯 MVP

**Goal**: Users can create new D&D 5e characters with complete form validation, auto-calculations, and duplicate name prevention

**Independent Test**: Access create form, fill with valid/invalid data, verify validation, submit and see new character in list

### Backend - POST /characters API (US2)

- [ ] T128 [P] [US2] Write tests for POST /characters endpoint in `backend/tests/integration/api/create_character_test.go`
- [ ] T129 [US2] Implement POST /characters handler in `backend/internal/handler/character_handler.go`
- [ ] T130 [US2] Add validation for required fields (characterName, race, class, level, abilityScores) in validator
- [ ] T131 [US2] Add validation for 500 char max on all strings in validator
- [ ] T132 [US2] Add validation for level (1-20) in validator
- [ ] T133 [US2] Add validation for ability scores (1-30) in validator
- [ ] T134 [US2] Add validation for alignment enum values in validator
- [ ] T135 [US2] Add duplicate name check in service layer (return 409 Conflict if exists)
- [ ] T136 [US2] Wire up POST /characters route in `backend/cmd/server/main.go`
- [ ] T137 [US2] Add Swagger annotations for POST /characters
- [ ] T138 [US2] Test error response for duplicate name in `backend/tests/integration/api/create_character_test.go`
- [ ] T139 [US2] Test error response for validation errors in `backend/tests/integration/api/create_character_test.go`

### Frontend - Validation Schema (US2)

- [ ] T140 [P] [US2] Write tests for character validation schema in `frontend/tests/unit/validation/characterSchema.test.ts`
- [ ] T141 [US2] Implement Yup validation schema in `frontend/src/validation/characterSchema.ts` (all required fields, 500 char max, level 1-20, ability scores 1-30)
- [ ] T142 [US2] Add custom validator for character name uniqueness (API call) in validation schema
- [ ] T143 [P] [US2] Write tests for useValidation hook in `frontend/tests/unit/hooks/useValidation.test.ts`
- [ ] T144 [US2] Implement useValidation hook in `frontend/src/hooks/useValidation.ts` (validate on blur, manage error state)

### Frontend - Form Sections (US2)

- [ ] T145 [P] [US2] Write tests for BasicInfoSection in `frontend/tests/unit/components/character-form/BasicInfoSection.test.tsx`
- [ ] T146 [US2] Implement BasicInfoSection in `frontend/src/components/character-form/BasicInfoSection.tsx` (name, player, race, subrace, class, subclass, multiclass, level, XP, background, alignment)
- [ ] T147 [P] [US2] Write tests for AbilityScoresSection in `frontend/tests/unit/components/character-form/AbilityScoresSection.test.tsx`
- [ ] T148 [US2] Implement AbilityScoresSection in `frontend/src/components/character-form/AbilityScoresSection.tsx` (6 abilities with auto-calculated modifiers)
- [ ] T149 [P] [US2] Write tests for SkillsSection in `frontend/tests/unit/components/character-form/SkillsSection.test.tsx`
- [ ] T150 [US2] Implement SkillsSection in `frontend/src/components/character-form/SkillsSection.tsx` (18 skills with proficiency/expertise, auto-calculated modifiers)
- [ ] T151 [P] [US2] Write tests for CombatStatsSection in `frontend/tests/unit/components/character-form/CombatStatsSection.test.tsx`
- [ ] T152 [US2] Implement CombatStatsSection in `frontend/src/components/character-form/CombatStatsSection.tsx` (HP, AC, initiative, speed, passive perception, inspiration, death saves)
- [ ] T153 [P] [US2] Write tests for InventorySection in `frontend/tests/unit/components/character-form/InventorySection.test.tsx`
- [ ] T154 [US2] Implement InventorySection in `frontend/src/components/character-form/InventorySection.tsx` (currency, weapons, armor, equipment, carrying capacity)
- [ ] T155 [P] [US2] Write tests for SpellcastingSection in `frontend/tests/unit/components/character-form/SpellcastingSection.test.tsx`
- [ ] T156 [US2] Implement SpellcastingSection in `frontend/src/components/character-form/SpellcastingSection.tsx` (ability, save DC, attack bonus, spell slots, cantrips, spells, prepared spells)
- [ ] T157 [P] [US2] Write tests for PersonalitySection in `frontend/tests/unit/components/character-form/PersonalitySection.test.tsx`
- [ ] T158 [US2] Implement PersonalitySection in `frontend/src/components/character-form/PersonalitySection.tsx` (traits, ideals, bonds, flaws)
- [ ] T159 [P] [US2] Write tests for AppearanceSection in `frontend/tests/unit/components/character-form/AppearanceSection.test.tsx`
- [ ] T160 [US2] Implement AppearanceSection in `frontend/src/components/character-form/AppearanceSection.tsx` (age, height, weight, eyes, skin, hair, appearance, backstory, allies, treasure, notes)

### Frontend - Character Form (US2)

- [ ] T161 [P] [US2] Write tests for CharacterForm in `frontend/tests/unit/components/characters/CharacterForm.test.tsx`
- [ ] T162 [US2] Implement CharacterForm component in `frontend/src/components/characters/CharacterForm.tsx` (tabbed sections, validation on blur, submit button state)
- [ ] T163 [US2] Add proficiency bonus auto-calculation based on level
- [ ] T164 [US2] Add ability modifier auto-calculation (floor((score - 10) / 2))
- [ ] T165 [US2] Add skill modifier auto-calculation (ability modifier + proficiency if checked)
- [ ] T166 [US2] Add spell save DC auto-calculation (8 + prof + spellcasting ability mod)
- [ ] T167 [US2] Add spell attack bonus auto-calculation (prof + spellcasting ability mod)
- [ ] T168 [US2] Add passive perception auto-calculation (10 + perception modifier)
- [ ] T169 [US2] Implement form submission with error handling
- [ ] T170 [US2] Implement success redirect to character list after creation

### Frontend - Create Character Page (US2)

- [ ] T171 [P] [US2] Write tests for CreateCharacterPage in `frontend/tests/unit/pages/CreateCharacterPage.test.tsx`
- [ ] T172 [US2] Implement CreateCharacterPage in `frontend/src/pages/CreateCharacterPage.tsx`
- [ ] T173 [US2] Add CreateCharacterPage route to App.tsx
- [ ] T174 [US2] Add "Create New Character" button to CharactersPage

### Frontend - Integration Tests (US2)

- [ ] T175 [P] [US2] Update MSW handlers for POST /characters in `frontend/tests/integration/mocks/handlers.ts`
- [ ] T176 [US2] Write integration test for character creation flow in `frontend/tests/integration/flows/characterCreate.test.tsx`
- [ ] T177 [US2] Write integration test for validation errors in `frontend/tests/integration/flows/characterCreate.test.tsx`
- [ ] T178 [US2] Write integration test for duplicate name error in `frontend/tests/integration/flows/characterCreate.test.tsx`

### E2E Tests for User Story 2

- [ ] T179 [US2] Write Cypress test for acceptance scenario 1 (create form display) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T180 [US2] Write Cypress test for acceptance scenario 2 (required field validation) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T181 [US2] Write Cypress test for acceptance scenario 3 (ability score range validation) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T182 [US2] Write Cypress test for acceptance scenario 4 (level range validation) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T183 [US2] Write Cypress test for acceptance scenario 5 (alignment dropdown) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T184 [US2] Write Cypress test for acceptance scenario 6 (submit button enable/disable) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T185 [US2] Write Cypress test for acceptance scenario 7 (successful creation) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T186 [US2] Write Cypress test for acceptance scenario 8 (server error handling) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T187 [US2] Write Cypress test for acceptance scenario 9 (duplicate name error) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T188 [US2] Write Cypress test for acceptance scenario 10 (auto-calculated modifiers) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T189 [US2] Write Cypress test for acceptance scenario 11 (validation on blur) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`
- [ ] T190 [US2] Write Cypress test for acceptance scenario 12 (theme toggle) in `frontend/tests/e2e/cypress/integration/character-create.spec.ts`

**Checkpoint**: User Story 2 is fully functional - users can create characters with full validation

---

## Phase 5: User Story 3 - Edit Existing Character (Priority: P2)

**Goal**: Users can edit existing characters with pre-populated data, validation, and unsaved changes warning

**Independent Test**: Load character into edit mode, modify fields, verify validation and save functionality

### Backend - PUT /characters/:id API (US3)

- [ ] T191 [P] [US3] Write tests for PUT /characters/:id endpoint in `backend/tests/integration/api/update_character_test.go`
- [ ] T192 [US3] Implement PUT /characters/:id handler in `backend/internal/handler/character_handler.go`
- [ ] T193 [US3] Add validation for update (same rules as create) in handler
- [ ] T194 [US3] Add duplicate name check (excluding current character) in service layer
- [ ] T195 [US3] Ensure updatedAt timestamp is updated on every save
- [ ] T196 [US3] Wire up PUT /characters/:id route in `backend/cmd/server/main.go`
- [ ] T197 [US3] Add Swagger annotations for PUT /characters/:id
- [ ] T198 [US3] Test error response for duplicate name in `backend/tests/integration/api/update_character_test.go`
- [ ] T199 [US3] Test error response for not found (404) in `backend/tests/integration/api/update_character_test.go`

### Frontend - Edit Character Page (US3)

- [ ] T200 [P] [US3] Write tests for EditCharacterPage in `frontend/tests/unit/pages/EditCharacterPage.test.tsx`
- [ ] T201 [US3] Implement EditCharacterPage in `frontend/src/pages/EditCharacterPage.tsx` (load character by ID, pre-populate form)
- [ ] T202 [US3] Add EditCharacterPage route to App.tsx with :id parameter
- [ ] T203 [US3] Add "Edit" button to CharacterPreview modal
- [ ] T204 [US3] Implement unsaved changes detection in CharacterForm
- [ ] T205 [US3] Implement cancel confirmation dialog when changes exist
- [ ] T206 [US3] Update characterService with update method in `frontend/src/services/characterService.ts`
- [ ] T207 [US3] Update useCharacters hook with update functionality in `frontend/src/hooks/useCharacters.ts`

### Frontend - Integration Tests (US3)

- [ ] T208 [P] [US3] Update MSW handlers for PUT /characters/:id in `frontend/tests/integration/mocks/handlers.ts`
- [ ] T209 [US3] Write integration test for character edit flow in `frontend/tests/integration/flows/characterEdit.test.tsx`
- [ ] T210 [US3] Write integration test for unsaved changes warning in `frontend/tests/integration/flows/characterEdit.test.tsx`

### E2E Tests for User Story 3

- [ ] T211 [US3] Write Cypress test for acceptance scenario 1 (pre-populated form) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T212 [US3] Write Cypress test for acceptance scenario 2 (proficiency bonus update) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T213 [US3] Write Cypress test for acceptance scenario 3 (required field validation) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T214 [US3] Write Cypress test for acceptance scenario 4 (auto-calculations on edit) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T215 [US3] Write Cypress test for acceptance scenario 5 (successful save) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T216 [US3] Write Cypress test for acceptance scenario 6 (validation error handling) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T217 [US3] Write Cypress test for acceptance scenario 7 (cancel with confirmation) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`
- [ ] T218 [US3] Write Cypress test for acceptance scenario 8 (dynamic add/remove items) in `frontend/tests/e2e/cypress/integration/character-edit.spec.ts`

**Checkpoint**: User Story 3 is fully functional - users can edit characters with validation

---

## Phase 6: User Story 4 - Delete Character (Priority: P3)

**Goal**: Users can delete characters with confirmation dialog and proper error handling

**Independent Test**: Select character for deletion, confirm action, verify removal from list

### Backend - DELETE /characters/:id API (US4)

- [ ] T219 [P] [US4] Write tests for DELETE /characters/:id endpoint in `backend/tests/integration/api/delete_character_test.go`
- [ ] T220 [US4] Implement DELETE /characters/:id handler in `backend/internal/handler/character_handler.go`
- [ ] T221 [US4] Add hard delete implementation in repository (permanent removal)
- [ ] T222 [US4] Wire up DELETE /characters/:id route in `backend/cmd/server/main.go`
- [ ] T223 [US4] Add Swagger annotations for DELETE /characters/:id
- [ ] T224 [US4] Test error response for not found (404) in `backend/tests/integration/api/delete_character_test.go`

### Frontend - Delete Functionality (US4)

- [ ] T225 [P] [US4] Write tests for delete confirmation modal in `frontend/tests/unit/components/characters/DeleteConfirmationModal.test.tsx`
- [ ] T226 [US4] Implement delete confirmation modal in `frontend/src/components/characters/DeleteConfirmationModal.tsx`
- [ ] T227 [US4] Add "Delete" button to CharacterPreview modal
- [ ] T228 [US4] Add "Delete" button to EditCharacterPage
- [ ] T229 [US4] Update characterService with delete method in `frontend/src/services/characterService.ts`
- [ ] T230 [US4] Update useCharacters hook with delete functionality in `frontend/src/hooks/useCharacters.ts`
- [ ] T231 [US4] Implement success redirect to character list after deletion

### Frontend - Integration Tests (US4)

- [ ] T232 [P] [US4] Update MSW handlers for DELETE /characters/:id in `frontend/tests/integration/mocks/handlers.ts`
- [ ] T233 [US4] Write integration test for character delete flow in `frontend/tests/integration/flows/characterDelete.test.tsx`
- [ ] T234 [US4] Write integration test for delete error handling in `frontend/tests/integration/flows/characterDelete.test.tsx`

### E2E Tests for User Story 4

- [ ] T235 [US4] Write Cypress test for acceptance scenario 1 (confirmation dialog) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`
- [ ] T236 [US4] Write Cypress test for acceptance scenario 2 (cancel deletion) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`
- [ ] T237 [US4] Write Cypress test for acceptance scenario 3 (confirm deletion) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`
- [ ] T238 [US4] Write Cypress test for acceptance scenario 4 (successful deletion) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`
- [ ] T239 [US4] Write Cypress test for acceptance scenario 5 (delete error handling) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`
- [ ] T240 [US4] Write Cypress test for acceptance scenario 6 (last character deletion shows empty state) in `frontend/tests/e2e/cypress/integration/character-delete.spec.ts`

**Checkpoint**: User Story 4 is fully functional - users can delete characters safely

---

## Phase 7: Testing & Quality Assurance

**Purpose**: Ensure all quality gates are met before deployment

### Backend Testing & Quality

- [ ] T241 [P] [QA] Run all backend unit tests and verify ≥85% coverage
- [ ] T242 [P] [QA] Run all backend integration tests and verify ≥80% coverage
- [ ] T243 [P] [QA] Run golangci-lint and fix all errors
- [ ] T244 [P] [QA] Run gofmt on all Go files
- [ ] T245 [P] [QA] Verify Swagger documentation is accurate and complete
- [ ] T246 [QA] Test API endpoints manually with Postman/Insomnia
- [ ] T247 [QA] Verify all error responses follow standardized format
- [ ] T248 [QA] Verify all operations are logged correctly
- [ ] T249 [QA] Test MongoDB indexes are created correctly
- [ ] T250 [QA] Test character name uniqueness constraint works

### Frontend Testing & Quality

- [ ] T251 [P] [QA] Run all frontend unit tests and verify ≥85% coverage
- [ ] T252 [P] [QA] Run all frontend integration tests and verify ≥80% coverage
- [ ] T253 [P] [QA] Run all Cypress E2E tests and verify all pass
- [ ] T254 [P] [QA] Run ESLint and fix all errors
- [ ] T255 [P] [QA] Run Prettier to format all code
- [ ] T256 [QA] Test light and dark mode across all pages
- [ ] T257 [QA] Test responsive design on mobile (320px width)
- [ ] T258 [QA] Test responsive design on tablet (768px width)
- [ ] T259 [QA] Test responsive design on desktop (1024px+ width)
- [ ] T260 [QA] Run accessibility audit (Lighthouse, axe DevTools)
- [ ] T261 [QA] Fix all accessibility violations (aim for WCAG AA)

### Cross-Browser Testing

- [ ] T262 [P] [QA] Test in Chrome (latest version)
- [ ] T263 [P] [QA] Test in Firefox (latest version)
- [ ] T264 [P] [QA] Test in Safari (latest version)
- [ ] T265 [P] [QA] Test in Edge (latest version)

### Performance Testing

- [ ] T266 [QA] Load test GET /characters endpoint (verify P50 < 1s, P99 < 2s)
- [ ] T267 [QA] Load test POST /characters endpoint (verify P50 < 2s, P99 < 3s)
- [ ] T268 [QA] Load test PUT /characters/:id endpoint (verify P50 < 2s, P99 < 3s)
- [ ] T269 [QA] Test form validation performance (verify < 50ms per field on blur)
- [ ] T270 [QA] Test character list rendering with 100+ characters
- [ ] T271 [QA] Test filter/sort performance with large datasets
- [ ] T272 [QA] Verify frontend bundle size and optimize if needed

### Security Testing

- [ ] T273 [QA] Test XSS prevention (try injecting scripts in text fields)
- [ ] T274 [QA] Test SQL/NoSQL injection prevention (try malicious query params)
- [ ] T275 [QA] Verify CORS configuration allows only frontend origin
- [ ] T276 [QA] Verify sensitive data is not exposed in error messages
- [ ] T277 [QA] Test 500 character limit enforcement on all strings
- [ ] T278 [QA] Test character name uniqueness from multiple clients simultaneously

**Checkpoint**: All quality gates passed - ready for deployment

---

## Phase 8: Documentation & Deployment

**Purpose**: Finalize documentation and deploy to production

### Documentation

- [ ] T279 [P] [DOCS] Write backend README.md with setup, running, testing instructions
- [ ] T280 [P] [DOCS] Write frontend README.md with setup, running, testing instructions
- [ ] T281 [P] [DOCS] Update root README.md with project overview and quick start
- [ ] T282 [P] [DOCS] Document API endpoints in `backend/api/README.md`
- [ ] T283 [P] [DOCS] Create deployment guide in `docs/DEPLOYMENT.md`
- [ ] T284 [DOCS] Document environment variables in both .env.example files
- [ ] T285 [DOCS] Create database migration guide (if needed in future)
- [ ] T286 [DOCS] Document known limitations and future enhancements

### Docker & Deployment

- [ ] T287 [P] [DEPLOY] Build backend Docker image and verify it runs
- [ ] T288 [P] [DEPLOY] Build frontend Docker image and verify it runs
- [ ] T289 [DEPLOY] Test docker-compose.dev.yml locally (all services start correctly)
- [ ] T290 [DEPLOY] Create docker-compose.prod.yml with production configuration
- [ ] T291 [DEPLOY] Configure production environment variables
- [ ] T292 [DEPLOY] Setup MongoDB backup strategy
- [ ] T293 [DEPLOY] Configure health check endpoints for orchestration
- [ ] T294 [DEPLOY] Deploy to staging environment
- [ ] T295 [DEPLOY] Run smoke tests on staging
- [ ] T296 [DEPLOY] Deploy to production environment
- [ ] T297 [DEPLOY] Verify production deployment is working

### Final Acceptance Testing

- [ ] T298 [ACCEPT] User Story 1: Verify all acceptance scenarios pass in production
- [ ] T299 [ACCEPT] User Story 2: Verify all acceptance scenarios pass in production
- [ ] T300 [ACCEPT] User Story 3: Verify all acceptance scenarios pass in production
- [ ] T301 [ACCEPT] User Story 4: Verify all acceptance scenarios pass in production
- [ ] T302 [ACCEPT] Verify performance targets are met in production
- [ ] T303 [ACCEPT] Verify monitoring and logging are working
- [ ] T304 [ACCEPT] Create sample characters for demonstration

**Checkpoint**: Feature is complete, tested, documented, and deployed! 🎉

---

## Task Statistics

- **Total Tasks**: 304
- **Setup & Foundation**: T001-T072 (72 tasks)
- **User Story 1**: T073-T127 (55 tasks)
- **User Story 2**: T128-T190 (63 tasks)
- **User Story 3**: T191-T218 (28 tasks)
- **User Story 4**: T219-T240 (22 tasks)
- **Quality Assurance**: T241-T278 (38 tasks)
- **Documentation & Deployment**: T279-T304 (26 tasks)

## Parallel Work Opportunities

Tasks marked with [P] can be worked on in parallel if you have multiple developers:
- Setup tasks (T001-T021) can all run in parallel
- Foundation tasks have many parallel opportunities
- Within each user story, test writing can happen in parallel
- QA tasks can be distributed across team

## TDD Reminder

**CRITICAL**: For every implementation task, the corresponding test task MUST be completed first. The test MUST fail before writing implementation code. This is non-negotiable per the constitution.

---

**Version**: 1.0  
**Generated**: 2025-11-03  
**Status**: Ready for Implementation
