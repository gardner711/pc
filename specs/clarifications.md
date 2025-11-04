# Clarification Questions: D&D 5e Character Creator

**Feature**: 001-dnd-character-creator  
**Date**: 2025-11-03  
**Status**: ✅ RESOLVED

## ✅ Decisions Made

All critical clarifications have been resolved. The following decisions were made:

1. **Character Name Uniqueness**: ✅ **ENFORCE UNIQUE NAMES** - Database unique constraint + validation
2. **Pagination Strategy**: ✅ **NO PAGINATION** - Load all characters at once
3. **Modification Timestamps**: ✅ **TRACK BOTH** - createdAt and updatedAt automatically managed
4. **Filter/Sort Persistence**: ✅ **DO NOT PERSIST** - Reset on page load
5. **Validation Error Timing**: ✅ **VALIDATE ON BLUR** - When field loses focus
6. **String Length Limits**: ✅ **500 CHARACTERS MAX** - All string fields limited to 500 chars

These decisions have been incorporated into:
- `spec.md` - Updated functional requirements and schema specifications
- `plan.md` - Updated technical context, data model, and API design

---

## Original Clarification Questions (For Reference)

## Critical Clarifications (Blocking Implementation)

### 1. Character Name Uniqueness
**Question**: Should character names be unique per user, or can a user have multiple characters with the same name?

**Context**: This affects database constraints and validation logic.

**Options**:
- A) **Allow duplicate names** - Users can create "Gandalf the Grey" and "Gandalf the White" as separate characters
- B) **Enforce unique names** - Each character must have a unique name, validation error if duplicate
- C) **Warn but allow** - Show warning message but permit duplicate names

**Impact**:
- Database: Whether to create unique index on characterName
- Validation: Backend validation rules
- UX: Error messaging and user guidance

**Recommendation**: Option A (Allow duplicate names) - D&D players often reuse names across campaigns or create variants. User can distinguish by other properties (class, level, etc.)

---

### 2. Pagination Strategy and Limits
**Question**: How many characters should be displayed per page, and what is the maximum result set?

**Context**: Affects performance, UX, and API design.

**Options**:
- A) **Default 20, max 100** per page with offset pagination
- B) **Default 50, max 200** per page with offset pagination  
- C) **Load all, implement virtual scrolling** on frontend (for < 1000 characters)
- D) **Cursor-based pagination** for better performance at scale

**Impact**:
- Backend: Pagination implementation strategy
- Frontend: UI design (infinite scroll vs page numbers)
- Performance: Query performance and memory usage

**Recommendation**: Option A (Default 20, max 100) with offset pagination - Balances performance and UX. Add cursor-based pagination if user base grows significantly.

---

### 3. Calculated Field Override Behavior
**Question**: Should users be able to manually override auto-calculated fields (ability modifiers, proficiency bonus, skill modifiers)?

**Context**: Some D&D house rules or magic items may modify these values differently than standard rules.

**Options**:
- A) **Always auto-calculate** - No manual override, enforce D&D 5e rules strictly
- B) **Allow override with indication** - Permit manual entry but show "custom" badge
- C) **Auto-calculate with manual adjustment** - Calculate base value, allow +/- adjustments

**Impact**:
- Frontend: Additional UI controls and indicators
- Backend: Validation logic complexity
- Data Model: Store both calculated and override values?

**Recommendation**: Option A (Always auto-calculate) for MVP - Keeps validation simple and enforces schema. Can add override capability in Phase 2+ if requested.

---

### 4. Character Modification Timestamps
**Question**: Should we track when characters are created and last modified?

**Context**: Useful for sorting, auditing, and future features (recently edited, last played, etc.)

**Options**:
- A) **Yes, track both** `createdAt` and `updatedAt` timestamps
- B) **No, keep schema minimal** - Only track what's in character-schema.json
- C) **Track creation only** - Just `createdAt`

**Impact**:
- Backend: Automatic timestamp management in MongoDB
- Frontend: Additional sort options (by creation date, last modified)
- Data Model: Add fields to schema or keep as metadata

**Recommendation**: Option A (Track both) - Minimal overhead, high value. Implement as MongoDB metadata (not in character schema itself).

---

### 5. Filter/Sort Persistence
**Question**: Should filter and sort preferences persist across sessions?

**Context**: Improves UX for users who frequently use same filters.

**Options**:
- A) **Persist in localStorage** - Filters/sorts saved per browser
- B) **Reset on page load** - Always show default view (all characters, sorted by name)
- C) **Persist during session only** - Clear on browser close

**Impact**:
- Frontend: localStorage management
- UX: User expectations and discoverability

**Recommendation**: Option B (Reset on page load) for MVP - Simpler, more predictable. Can add persistence in Phase 2 if users request it.

---

## Feature Scope Clarifications

### 6. Auto-Save Functionality
**Question**: Should character edits auto-save while the user is typing, or only on explicit "Save" button click?

**Context**: Affects UX, backend load, and data integrity.

**Options**:
- A) **Manual save only** - User must click "Save" or "Submit" button
- B) **Auto-save with debounce** - Save after 3 seconds of inactivity
- C) **Draft mode** - Auto-save to draft, manual "Publish" to finalize

**Impact**:
- Backend: API call frequency
- Frontend: Debouncing logic, loading states
- UX: User confidence in data persistence

**Recommendation**: Option A (Manual save only) for MVP - Clearer user intent, simpler implementation, follows constitution's principle of simplicity.

---

### 7. Bulk Operations
**Question**: Do we need bulk delete or bulk actions (e.g., delete multiple characters at once)?

**Context**: Useful for cleaning up test characters or managing large collections.

**Options**:
- A) **Yes, add bulk delete** with multi-select checkboxes
- B) **No, single operations only** - Delete one character at a time
- C) **Add in Phase 2** if user feedback indicates need

**Impact**:
- Frontend: Multi-select UI, bulk action buttons
- Backend: Bulk delete endpoint
- UX: Additional complexity in UI

**Recommendation**: Option B (No bulk operations) for MVP - YAGNI principle. Can add if users manage 50+ characters and request feature.

---

### 8. Schema Evolution Strategy
**Question**: How should we handle schema updates when new D&D content is released or character-schema.json is updated?

**Context**: Affects data migration strategy and backward compatibility.

**Options**:
- A) **Automatic migration** - Run migration scripts to add new fields with defaults
- B) **Lazy migration** - Update documents on read/write
- C) **Manual migration** - Provide migration tool for users
- D) **Version schema** - Store schema version with each character

**Impact**:
- Backend: Migration infrastructure
- Data integrity: How to handle old vs new characters
- Deployment: Migration strategy during updates

**Recommendation**: Option B (Lazy migration) for MVP - MongoDB handles missing fields gracefully. Update documents when edited. Add Option D (version schema) if breaking changes anticipated.

---

## Technical Implementation Clarifications

### 9. React State Management Library
**Question**: Should we use Context API alone, or add Redux/Zustand/Jotai for state management?

**Context**: Affects architecture complexity and learning curve.

**Options**:
- A) **Context API only** - Built-in React, simpler
- B) **React Query/SWR** - Handles server state, caching, optimistic updates
- C) **Redux Toolkit** - Full state management with dev tools
- D) **Zustand** - Lightweight alternative to Redux

**Impact**:
- Complexity: Additional dependencies and boilerplate
- DX: Developer experience and debugging
- Performance: State update optimization

**Recommendation**: Option B (React Query/SWR) - Excellent for server state, caching, and loading states. Use Context API for theme. Avoids Redux complexity while providing better UX than raw Axios.

---

### 10. CSS Framework Choice
**Question**: Which CSS/UI framework should we use for theming and components?

**Context**: Affects development speed, bundle size, and design consistency.

**Options**:
- A) **Tailwind CSS** - Utility-first, highly customizable, smaller bundle
- B) **Material-UI (MUI)** - Complete component library, built-in theming
- C) **Chakra UI** - Modern component library with excellent accessibility
- D) **Custom CSS with CSS Modules** - Maximum control, learning curve

**Impact**:
- Development speed: Pre-built components vs custom styling
- Bundle size: MUI is heavier than Tailwind
- Accessibility: Some frameworks better than others
- Design consistency: Framework constraints vs flexibility

**Recommendation**: Option A (Tailwind CSS) - Lightweight, flexible, excellent dark mode support. Build custom components for full control while maintaining performance.

---

### 11. Go HTTP Framework
**Question**: Which Go HTTP framework should we use?

**Context**: Affects performance, ecosystem, and development experience.

**Options**:
- A) **Gin** - Popular, mature, good performance, extensive middleware
- B) **Fiber** - Express-like API, extremely fast, growing ecosystem
- C) **Chi** - Lightweight, idiomatic Go, standard library compatible
- D) **Standard library (net/http)** - No dependencies, maximum control

**Impact**:
- Performance: Fiber fastest, but all are adequate
- Learning curve: Gin/Fiber easier, Chi/stdlib more idiomatic
- Ecosystem: Gin has most middleware and examples

**Recommendation**: Option A (Gin) - Battle-tested, excellent documentation, large ecosystem. Meets performance targets while being developer-friendly.

---

### 12. Swagger Generation Approach
**Question**: How should we generate and maintain Swagger/OpenAPI documentation?

**Context**: Affects code maintainability and documentation accuracy.

**Options**:
- A) **Swaggo annotations** - Generate from Go code comments
- B) **Manual YAML** - Write OpenAPI spec by hand
- C) **Code-first with go-swagger** - Generate from Go structs/interfaces
- D) **Hybrid** - Manual YAML + validation against code

**Impact**:
- Maintainability: Keep code and docs in sync
- Developer experience: Ease of updates
- Accuracy: Risk of drift between code and docs

**Recommendation**: Option A (Swaggo annotations) - Keeps docs close to code, auto-generates on build. Aligns with specification-first principle when used with TDD.

---

### 13. MongoDB Test Strategy
**Question**: How should we handle MongoDB in tests?

**Context**: Affects test reliability, speed, and CI/CD complexity.

**Options**:
- A) **Real MongoDB in Docker** - Most realistic, slower
- B) **In-memory MongoDB (mongomem)** - Fast, portable, limited features
- C) **Mock repository** - No real DB, fastest, less confidence
- D) **Hybrid** - Mocks for unit tests, real DB for integration tests

**Impact**:
- Test speed: In-memory fastest, Docker slowest
- Test reliability: Real DB most realistic
- CI/CD: Docker requires container support

**Recommendation**: Option D (Hybrid) - Mock repository for unit tests, Docker MongoDB for integration tests. Best balance of speed and confidence.

---

### 14. Error Logging Detail Level
**Question**: What level of detail should be logged for errors?

**Context**: Affects debugging capability vs log volume/cost.

**Options**:
- A) **Minimal** - Error type, message, timestamp
- B) **Standard** - + Request ID, endpoint, user context
- C) **Verbose** - + Full request body, headers, stack trace
- D) **Configurable** - Different levels per environment

**Impact**:
- Debugging: More logs = easier debugging
- Cost: More logs = higher storage/processing costs
- Security: Risk of logging sensitive data

**Recommendation**: Option D (Configurable) - Debug level in development (verbose), Info/Warn in production (standard). Never log sensitive data (future: auth tokens, passwords).

---

## UX/Design Clarifications

### 15. Form Section Organization
**Question**: Should the character creation/edit form be:

**Options**:
- A) **Single long form** - All sections visible, lots of scrolling
- B) **Tabbed sections** - Switch between tabs (Basic, Stats, Inventory, etc.)
- C) **Wizard/stepper** - Multi-step guided flow
- D) **Collapsible accordions** - Expand/collapse sections as needed

**Impact**:
- UX: How users navigate complex form
- Mobile: Screen space constraints
- Validation: When/how to show errors

**Recommendation**: Option B (Tabbed sections) for desktop, Option D (Accordions) for mobile. Required fields (Basic Info, Ability Scores) default open, optional sections default closed.

---

### 16. Empty State Actions
**Question**: What should the empty state (no characters) offer?

**Context**: First-time user experience.

**Options**:
- A) **Just "Create Character" button**
- B) **+ Sample characters to import** (load from sample-characters.json)
- C) **+ Tutorial/walkthrough**
- D) **+ Quick start templates** (pre-filled common builds)

**Impact**:
- New user onboarding
- Development effort
- Feature scope

**Recommendation**: Option B (Create button + sample import) - Helps users test the app immediately. Load sample-characters.json with "Import Sample Characters" button.

---

### 17. Character Preview Detail Level
**Question**: How much detail should the character preview modal show?

**Context**: Affects information density and modal size.

**Options**:
- A) **Minimal** - Name, class, level, race, ability scores, HP, AC
- B) **Standard** - + Skills, saving throws, speed, proficiencies
- C) **Detailed** - + Inventory summary, spell list, features
- D) **Full character sheet** - Everything (essentially read-only edit form)

**Impact**:
- UX: Information density vs readability
- Performance: Amount of data to render
- Implementation: Component complexity

**Recommendation**: Option B (Standard) - Shows enough to identify character and key stats without overwhelming. "Edit" button for full details.

---

### 18. Mobile Responsiveness Priority
**Question**: What is the mobile experience priority?

**Context**: Affects design decisions and testing scope.

**Options**:
- A) **Desktop-first** - Optimize for desktop, make mobile usable
- B) **Mobile-first** - Optimize for mobile, enhance for desktop
- C) **Responsive-first** - Equal priority for all screen sizes
- D) **Desktop-only** - Mobile not supported initially

**Impact**:
- Design approach
- Testing effort
- User base reach

**Recommendation**: Option C (Responsive-first) - D&D players use all devices. Design components mobile-first but optimize complex forms for desktop. Use responsive breakpoints: 320px, 768px, 1024px, 1440px.

---

## Data Validation Clarifications

### 19. Validation Error Display Timing
**Question**: When should validation errors be displayed?

**Context**: Affects UX and user frustration.

**Options**:
- A) **On submit only** - No errors until form submission
- B) **On blur** - Show error when field loses focus
- C) **On change (immediate)** - Show/hide error as user types
- D) **Hybrid** - Required fields on blur, format validation on change

**Impact**:
- UX: User frustration vs helpful guidance
- Performance: Validation frequency

**Recommendation**: Option D (Hybrid) - Show required field errors on blur (after user moves away), show format errors (number ranges, etc.) on change. Clear errors as soon as valid.

---

### 20. Character Name Length Limit
**Question**: What is the practical maximum length for character names?

**Context**: Spec says max 100 characters, but is that realistic?

**Options**:
- A) **100 characters** - As specified
- B) **50 characters** - More practical for UI display
- C) **200 characters** - Allow very long names
- D) **No limit** - Let users decide

**Impact**:
- UI: Display in tiles (truncation needed)
- Database: String storage
- Validation: Error messages

**Recommendation**: Option A (100 characters) - Follows spec, accommodates even elaborate names. Truncate with ellipsis in tile view (show first 30-40 chars + "...").

---

## Summary of Recommendations

| # | Question | Recommended Answer | Priority |
|---|----------|-------------------|----------|
| 1 | Character name uniqueness | Allow duplicate names | High |
| 2 | Pagination limits | Default 20, max 100 | High |
| 3 | Calculated field overrides | Always auto-calculate (MVP) | High |
| 4 | Modification timestamps | Track createdAt & updatedAt | High |
| 5 | Filter/sort persistence | Reset on page load (MVP) | Medium |
| 6 | Auto-save | Manual save only (MVP) | Medium |
| 7 | Bulk operations | No bulk ops (MVP) | Low |
| 8 | Schema evolution | Lazy migration | Medium |
| 9 | React state management | React Query/SWR | High |
| 10 | CSS framework | Tailwind CSS | High |
| 11 | Go HTTP framework | Gin | High |
| 12 | Swagger generation | Swaggo annotations | High |
| 13 | MongoDB test strategy | Hybrid (mocks + Docker) | High |
| 14 | Error logging detail | Configurable by environment | High |
| 15 | Form organization | Tabs (desktop), Accordions (mobile) | High |
| 16 | Empty state | Create button + sample import | Medium |
| 17 | Character preview detail | Standard (key stats only) | Medium |
| 18 | Mobile responsiveness | Responsive-first | High |
| 19 | Validation error timing | Hybrid (blur + change) | High |
| 20 | Character name length | 100 chars max, truncate display | Medium |

## Action Items

1. **Review and approve recommendations** (or provide different answers)
2. **Update spec.md** to incorporate decisions
3. **Update plan.md** to reflect technical choices
4. **Proceed to Phase 0 (Research)** to validate chosen technologies
5. **Proceed to Phase 1 (Design)** to create detailed contracts and data models

---

**Document Version**: 1.0  
**Status**: Awaiting stakeholder review  
**Next Step**: Approve decisions and update specification documents
