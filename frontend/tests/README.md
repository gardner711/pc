# Running Frontend Integration Tests

## Overview

This project includes comprehensive integration tests that validate the complete character creation, editing, and deletion workflows, including frontend-to-backend validation.

## Test Coverage

- **60+ integration tests** across 4 test suites
- Character creation flow with validation
- Character editing flow
- Character deletion flow with confirmation
- Backend validation for all character fields

## Prerequisites

```bash
cd frontend
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test character-creation.test.tsx
```

## Test Files

### Integration Tests (`tests/integration/`)

1. **character-creation.test.tsx** (13 tests)
   - Valid character creation with various builds
   - Validation error handling
   - Boundary testing (levels 1-20, ability scores 1-30)
   - Duplicate name rejection
   - String length limits

2. **character-edit.test.tsx** (11 tests)
   - Loading existing character data
   - Updating character attributes
   - Pre-population of form fields
   - Edit validation
   - Error handling for non-existent characters

3. **character-delete.test.tsx** (7 tests)
   - Delete confirmation workflow
   - Canceling deletion
   - List refresh after deletion
   - Multiple deletions
   - Empty state display

4. **backend-validation.test.ts** (30+ tests)
   - Name validation (required, length limits, duplicates)
   - Level validation (1-20 range)
   - Ability score validation (1-30 range for all 6 abilities)
   - Required vs optional field handling
   - Data persistence verification

## Mock Backend

Tests use **MSW (Mock Service Worker)** to simulate the backend API with realistic validation:

- `tests/mocks/handlers.ts` - API endpoint handlers
- Implements same validation rules as Go backend
- Maintains in-memory character store
- Supports all CRUD operations

## Test Patterns

### Character Creation Example
```typescript
// Fill out form
await user.type(screen.getByLabelText(/Character Name/i), 'Conan')
await user.selectOptions(screen.getByLabelText(/Class/i), 'Fighter')

// Submit
await user.click(screen.getByRole('button', { name: /Create/i }))

// Verify success
await waitFor(() => {
  expect(screen.getByText(/created successfully/i)).toBeInTheDocument()
})
```

### Validation Testing Example
```typescript
// Test invalid level
const levelInput = screen.getByLabelText(/Level/i)
await user.clear(levelInput)
await user.type(levelInput, '21')

await user.click(screen.getByRole('button', { name: /Next/i }))

// Verify error
await waitFor(() => {
  expect(screen.getByText(/level.*between 1 and 20/i)).toBeInTheDocument()
})
```

## Debugging Tests

### View test output in browser
```bash
npm run test:ui
```
This opens Vitest UI where you can:
- See test execution in real-time
- View component rendering
- Inspect test failures
- Re-run individual tests

### Increase timeout for slow tests
```typescript
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
}, { timeout: 5000 }) // 5 second timeout
```

### Debug specific test
```typescript
import { screen } from '@testing-library/react'

// Add debug statement
screen.debug() // Prints current DOM

// Or debug specific element
const element = screen.getByText('Gandalf')
screen.debug(element)
```

## Common Issues

### Test fails with "not wrapped in act(...)"
This usually means an async operation completed after the test. Use `waitFor`:
```typescript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### Element not found errors
Check if element is in modal/dialog:
```typescript
// Wait for modal to appear
await waitFor(() => {
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

// Then query within it
const modal = screen.getByRole('dialog')
within(modal).getByText('Delete')
```

### Mock server not returning expected data
Reset mock data between tests:
```typescript
import { resetMockCharacters } from '../mocks/handlers'

afterEach(() => {
  resetMockCharacters()
})
```

## Continuous Integration

Add to CI pipeline (e.g., GitHub Actions):
```yaml
- name: Run frontend tests
  run: |
    cd frontend
    npm ci
    npm test -- --run
```

## Next Steps

1. Run tests locally: `npm test`
2. Fix any failing tests
3. Add E2E tests with Cypress for browser testing
4. Integrate into CI/CD pipeline
5. Add test coverage requirements

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
