# Feature Specification: D&D 5e Character Creator Website

**Feature Branch**: `001-dnd-character-creator`  
**Created**: 2025-11-03  
**Status**: Draft  
**Input**: User description: "Build a modern inspired website with light and dark mode that enables a user to create DnD 5e characters"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Find Characters (Priority: P1)

Users need to quickly find and access their D&D characters from a visual, organized list.

**Why this priority**: Core navigation feature - users must be able to see and access their characters before any other functionality is useful. This is the entry point to the application.

**Independent Test**: Can be fully tested by creating sample characters and verifying the tile display, filtering by name/class/description, sorting by name, and preview functionality works without needing create/edit/delete features.

**Acceptance Scenarios**:

1. **Given** I have multiple characters created, **When** I visit the character list page, **Then** I see all my characters displayed in a tile/card format with character name, class, level, and race visible on each tile
2. **Given** I am on the character list page, **When** I type a character name in the search/filter field, **Then** only characters matching that name are displayed
3. **Given** I am on the character list page, **When** I select "Class" from filter options and choose "Wizard", **Then** only Wizard characters are displayed
4. **Given** I am on the character list page, **When** I type text that matches a character's description, **Then** characters with matching descriptions are displayed
5. **Given** I have characters named "Aldric", "Zara", and "Bob", **When** I click the sort button, **Then** characters are sorted alphabetically (Aldric, Bob, Zara)
6. **Given** I am viewing the character list, **When** I click on a character tile, **Then** a preview modal/panel opens showing key character details (name, class, level, race, ability scores, HP, AC) without entering edit mode
7. **Given** I have no characters, **When** I visit the character list page, **Then** I see an empty state with a message and a clear call-to-action to create my first character
8. **Given** I am viewing characters in light mode, **When** I toggle to dark mode, **Then** all tiles and UI elements adapt to dark theme colors

---

### User Story 2 - Create New Character (Priority: P1)

Users need to create a new D&D 5e character with all required and optional fields, with validation ensuring data integrity.

**Why this priority**: Primary feature - users cannot use the application without the ability to create characters. This is the core value proposition.

**Independent Test**: Can be tested by accessing the create form, filling in all fields with valid and invalid data, verifying validation works, and confirming successful character creation adds it to the character list.

**Acceptance Scenarios**:

1. **Given** I am on the character list page, **When** I click "Create New Character", **Then** I am presented with a character creation form
2. **Given** I am on the creation form, **When** I attempt to submit without filling required fields (characterName, race, class, level, abilityScores), **Then** validation errors are displayed next to each missing field and the form cannot be submitted
3. **Given** I am filling out ability scores, **When** I enter a Strength score of 35, **Then** I see a validation error stating "Strength must be between 1 and 30"
4. **Given** I am filling out character level, **When** I enter 25, **Then** I see a validation error stating "Level must be between 1 and 20"
5. **Given** I am selecting alignment, **When** I click the alignment dropdown, **Then** I see exactly 9 options: Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil
6. **Given** I have filled all required fields with valid data, **When** all validation passes, **Then** the submit button becomes enabled
7. **Given** I submit a valid character form, **When** the backend successfully creates the character, **Then** I see a success message and am redirected to the character list where my new character appears
8. **Given** I submit a valid character form, **When** the backend returns an error (e.g., duplicate name, server error), **Then** I see a clear error message explaining what went wrong
9. **Given** I am entering a character name that already exists, **When** I submit the form, **Then** I see a validation error stating "A character with this name already exists" and the form cannot be submitted
10. **Given** I am entering ability scores, **When** I enter a score value, **Then** the modifier is automatically calculated and displayed (modifier = floor((score - 10) / 2))
11. **Given** I have validation errors displayed, **When** I correct the invalid fields and move to the next field (blur event), **Then** the error messages disappear for the corrected fields
12. **Given** I am creating a character, **When** I toggle between light and dark mode, **Then** the form remains fully functional and readable in both themes

---

### User Story 3 - Edit Existing Character (Priority: P2)

Users need to update character information as their character progresses through campaigns (level ups, new equipment, changed stats).

**Why this priority**: Essential for ongoing gameplay but characters must exist first. Players frequently update characters as they level up and acquire items.

**Independent Test**: Can be tested by loading an existing character into edit mode, modifying fields, verifying validation, and confirming changes persist correctly.

**Acceptance Scenarios**:

1. **Given** I am viewing a character in preview mode, **When** I click "Edit Character", **Then** I see the character form pre-populated with all existing character data
2. **Given** I am editing a character, **When** I change the character level from 5 to 6, **Then** the proficiency bonus automatically updates from +3 to +3 (no change until level 9)
3. **Given** I am editing a character, **When** I attempt to clear a required field (e.g., character name), **Then** I see a validation error and cannot submit
4. **Given** I am editing a character, **When** I change ability scores, **Then** related modifiers, skills, and saving throws update automatically
5. **Given** I have made changes to a character, **When** I click "Save Changes", **Then** the character is updated and I see a success confirmation
6. **Given** I have made changes to a character, **When** the backend returns a validation error, **Then** I see the specific error message and my changes are not lost
7. **Given** I am editing a character, **When** I click "Cancel", **Then** I am prompted to confirm discarding changes (if any were made) before returning to the list
8. **Given** I am editing complex nested data (weapons, spells, features), **When** I add/remove items, **Then** the UI dynamically adds/removes form sections

---

### User Story 4 - Delete Character (Priority: P3)

Users need to remove characters they no longer want to track (retired characters, test data, mistakes).

**Why this priority**: Important for data management but less urgent than viewing, creating, and editing. Users can work around missing delete functionality temporarily.

**Independent Test**: Can be tested by selecting a character for deletion, confirming the action, and verifying it's removed from the list and cannot be recovered.

**Acceptance Scenarios**:

1. **Given** I am viewing a character in preview or edit mode, **When** I click the "Delete" button, **Then** I see a confirmation dialog warning me this action cannot be undone
2. **Given** I see the delete confirmation dialog, **When** I click "Cancel", **Then** the dialog closes and the character remains unchanged
3. **Given** I see the delete confirmation dialog, **When** I click "Confirm Delete", **Then** the character is permanently deleted
4. **Given** I have deleted a character, **When** the deletion succeeds, **Then** I see a success message and return to the character list where the character no longer appears
5. **Given** I attempt to delete a character, **When** the backend returns an error, **Then** I see an error message and the character is not deleted
6. **Given** I am on the character list with one character, **When** I delete that character, **Then** I see the empty state screen with a call-to-action to create a new character

---

### Edge Cases

- What happens when a user enters XSS attack vectors in text fields (character name, description, backstory)?
- How does the system handle character names or text fields exceeding 500 characters?
- What happens if a user tries to create a character with a name that matches an existing character?
- What happens if two users try to edit the same character simultaneously?
- How does the form behave with slow network connections during submission?
- What happens when the backend is unavailable during character list load?
- How does the system handle invalid data received from the backend (malformed JSON, missing required fields)?
- What happens when ability score modifiers result in edge cases (score of 1 = -5 modifier)?
- How does pagination work if a user has 1000+ characters?
- What happens when filtering/sorting returns zero results?
- How does the UI handle characters with incomplete data (missing optional fields)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all user characters in a tile/card layout showing characterName, class, level, and race
- **FR-002**: System MUST allow filtering characters by characterName (case-insensitive partial match)
- **FR-003**: System MUST allow filtering characters by class (exact match from dropdown)
- **FR-004**: System MUST allow filtering characters by description (case-insensitive partial match)
- **FR-005**: System MUST allow sorting characters alphabetically by characterName (ascending)
- **FR-006**: System MUST display character preview with key stats when a tile is clicked (name, class, level, race, ability scores, HP, AC, skills summary)
- **FR-007**: System MUST provide a "Create New Character" action from the character list
- **FR-008**: System MUST validate all required fields (characterName, race, class, level, abilityScores) before allowing form submission
- **FR-009**: System MUST validate ability score values are integers between 1 and 30 inclusive
- **FR-010**: System MUST validate level is an integer between 1 and 20 inclusive
- **FR-011**: System MUST validate alignment is one of the 9 D&D 5e alignments
- **FR-012**: System MUST automatically calculate ability modifiers from ability scores using formula: floor((score - 10) / 2)
- **FR-013**: System MUST automatically calculate proficiency bonus from character level
- **FR-014**: System MUST display all validation errors in real-time as user fills the form
- **FR-015**: System MUST prevent form submission until all validation errors are resolved
- **FR-016**: System MUST display server-side validation or submission errors to the user with clear, actionable messages
- **FR-017**: System MUST support light and dark mode themes
- **FR-018**: System MUST persist theme preference across sessions
- **FR-019**: System MUST allow editing existing characters with all fields pre-populated
- **FR-020**: System MUST validate edited character data using the same rules as character creation
- **FR-021**: System MUST confirm user intent before deleting a character
- **FR-022**: System MUST permanently remove deleted characters from the system
- **FR-023**: System MUST sanitize all user input to prevent XSS attacks
- **FR-024**: System MUST enforce character name uniqueness - no two characters can have the same name
- **FR-025**: System MUST enforce maximum length of 500 characters for all string fields
- **FR-026**: System MUST validate all string fields on blur (when field loses focus)
- **FR-027**: System MUST automatically track character creation timestamp (createdAt)
- **FR-028**: System MUST automatically track character last modification timestamp (updatedAt)
- **FR-029**: System MUST update the updatedAt timestamp on every character modification
- **FR-030**: System MUST validate all array items (skills, spells, equipment) conform to schema constraints
- **FR-031**: System MUST validate nested objects (abilityScores, hitPoints, inventory) contain required fields
- **FR-032**: System MUST handle optional fields gracefully (allow null/undefined for non-required fields)
- **FR-033**: System MUST validate integer fields do not accept decimal values
- **FR-034**: System MUST validate boolean fields only accept true/false values
- **FR-035**: System MUST validate enum fields only accept predefined values (alignment, spellcasting ability, armor type)
- **FR-036**: Backend MUST independently validate all data regardless of UI validation
- **FR-037**: Backend MUST return standardized error response format with error codes and messages
- **FR-038**: System MUST display loading states during asynchronous operations (list load, create, update, delete)
- **FR-039**: System MUST display empty state when character list is empty
- **FR-040**: System MUST be fully responsive (mobile, tablet, desktop)
- **FR-041**: System MUST display all characters without pagination (load all at once)
- **FR-042**: Filters and sort preferences MUST NOT persist across sessions (reset on page load)

### Key Entities *(include if feature involves data)*

- **Character**: The complete D&D 5e player character conforming to character-schema.json
  - Contains: basic info (name, race, class, level), ability scores, skills, combat stats, inventory, spells, personality, appearance, backstory
  - Unique identifier: character ID (generated by backend)
  - Required fields: characterName (unique), race, class, level, abilityScores (all 6 abilities with scores)
  - System fields: createdAt (ISO-8601 timestamp), updatedAt (ISO-8601 timestamp)
  - String field constraints: All strings max 500 characters

- **AbilityScore**: Represents one of the six D&D abilities (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
  - Contains: score (1-30), modifier (calculated), savingThrowProficiency (boolean)
  - Modifier calculation is deterministic based on score

- **Skill**: Represents proficiency in one of 18 D&D skills
  - Contains: proficient (boolean), expertise (boolean), modifier (calculated)
  - Tied to specific ability scores (e.g., Athletics uses Strength)

## Schema Property Specifications

### Basic Information Properties

#### characterName
- **Type**: String
- **Required**: Yes
- **Constraints**: 1-500 characters, must be unique
- **UI Element**: Text input
- **Validation**: Required, max length 500, no leading/trailing whitespace, must contain at least one non-whitespace character, must be unique across all characters
- **Behavior**: Auto-trims whitespace, displays character count, validates on blur (field loses focus), shows error if duplicate name detected

#### playerName
- **Type**: String
- **Required**: No
- **Constraints**: Max 500 characters
- **UI Element**: Text input
- **Validation**: Optional, max length 500 if provided, validates on blur
- **Behavior**: Optional field, collapses if not filled

#### race
- **Type**: String (free text or dropdown with common races)
- **Required**: Yes
- **Constraints**: Must not be empty, max 500 characters
- **UI Element**: Autocomplete combo box or dropdown with common races (Human, Elf, Dwarf, Halfling, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling) + custom entry option
- **Validation**: Required, max length 500, validates on blur
- **Behavior**: Suggests common races but allows custom entry

#### subrace
- **Type**: String
- **Required**: No
- **Constraints**: Max 500 characters
- **UI Element**: Text input or conditional dropdown based on selected race
- **Validation**: Optional, max length 500, validates on blur
- **Behavior**: Only shown if race typically has subraces; provides suggestions (High Elf, Hill Dwarf, Lightfoot Halfling, etc.)

#### class
- **Type**: String
- **Required**: Yes
- **Constraints**: Must not be empty, max 500 characters
- **UI Element**: Dropdown or autocomplete with 12 core classes (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard)
- **Validation**: Required, max length 500, validates on blur
- **Behavior**: Dropdown selection with optional custom class support

#### subclass
- **Type**: String
- **Required**: No
- **Constraints**: Max 500 characters
- **UI Element**: Text input or conditional dropdown based on class
- **Validation**: Optional, max length 500, validates on blur
- **Behavior**: Shown when character level is appropriate for subclass selection (typically level 3+)

#### multiclass
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each object must have class, optional subclass, level (integer ≥ 1)
- **UI Element**: Repeatable fieldset with "Add Multiclass" button
- **Validation**: If present, each entry must have valid class and level
- **Behavior**: Dynamic add/remove of multiclass entries, validates total levels don't exceed character level

#### level
- **Type**: Integer
- **Required**: Yes
- **Constraints**: 1-20
- **UI Element**: Number input or slider
- **Validation**: Required, integer only, min 1, max 20
- **Behavior**: Automatically updates proficiency bonus (+2 at levels 1-4, +3 at 5-8, +4 at 9-12, +5 at 13-16, +6 at 17-20)

#### experiencePoints
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 0
- **UI Element**: Number input
- **Validation**: If provided, must be ≥ 0
- **Behavior**: Optional tracking field

#### background
- **Type**: String
- **Required**: No
- **Constraints**: Max 500 characters
- **UI Element**: Autocomplete combo box with common backgrounds (Acolyte, Criminal, Folk Hero, Noble, Sage, Soldier, etc.)
- **Validation**: Optional, max length 500, validates on blur
- **Behavior**: Suggests common backgrounds, allows custom entry

#### alignment
- **Type**: String (enum)
- **Required**: No
- **Constraints**: Must be one of 9 alignments if provided
- **UI Element**: Dropdown or 3x3 grid selector
- **Validation**: If provided, must match: "Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"
- **Behavior**: Visual 3x3 grid selector or traditional dropdown

### Ability Scores (abilityScores object - REQUIRED)

Each ability (strength, dexterity, constitution, intelligence, wisdom, charisma) has the same structure:

#### abilityScores.{ability}.score
- **Type**: Integer
- **Required**: Yes (for each of the 6 abilities)
- **Constraints**: 1-30
- **UI Element**: Number input
- **Validation**: Required, integer, min 1, max 30
- **Behavior**: Auto-calculates modifier when changed

#### abilityScores.{ability}.modifier
- **Type**: Integer
- **Required**: No (calculated field)
- **Constraints**: Calculated as floor((score - 10) / 2)
- **UI Element**: Read-only display or calculated badge
- **Validation**: None (auto-calculated)
- **Behavior**: Updates automatically when score changes, displayed with +/- prefix

#### abilityScores.{ability}.savingThrowProficiency
- **Type**: Boolean
- **Required**: No
- **Constraints**: None
- **UI Element**: Checkbox
- **Validation**: Boolean value
- **Behavior**: Determines if proficiency bonus applies to saving throws

### Proficiency and Skills

#### proficiencyBonus
- **Type**: Integer
- **Required**: No (calculated)
- **Constraints**: Minimum 2, calculated from level
- **UI Element**: Read-only display
- **Validation**: Auto-calculated
- **Behavior**: Updates automatically based on level (see level behavior)

#### skills.{skillName}.proficient
- **Type**: Boolean
- **Required**: No
- **Constraints**: None
- **UI Element**: Checkbox (one for each of 18 skills)
- **Validation**: Boolean
- **Behavior**: When checked, adds proficiency bonus to skill modifier

#### skills.{skillName}.expertise
- **Type**: Boolean
- **Required**: No
- **Constraints**: Cannot be true if proficient is false
- **UI Element**: Checkbox (disabled unless proficient is checked)
- **Validation**: If expertise is true, proficient must also be true
- **Behavior**: When checked (and proficient), doubles proficiency bonus for that skill

#### skills.{skillName}.modifier
- **Type**: Integer
- **Required**: No (calculated)
- **Constraints**: None
- **UI Element**: Read-only display
- **Validation**: Auto-calculated
- **Behavior**: Calculated as: ability modifier + (proficient ? proficiencyBonus : 0) + (expertise ? proficiencyBonus : 0)

**18 Skills**: acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival

### Combat Stats

#### hitPoints.maximum
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 1 if provided
- **UI Element**: Number input
- **Validation**: If provided, must be ≥ 1
- **Behavior**: Represents maximum HP

#### hitPoints.current
- **Type**: Integer
- **Required**: No
- **Constraints**: None (can be negative for massive damage)
- **UI Element**: Number input
- **Validation**: Integer
- **Behavior**: Tracks current HP during gameplay

#### hitPoints.temporary
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 0
- **UI Element**: Number input
- **Validation**: If provided, must be ≥ 0
- **Behavior**: Temporary HP buffer

#### hitPoints.hitDice.total
- **Type**: String
- **Required**: No
- **Constraints**: Dice notation format (e.g., "5d8")
- **UI Element**: Text input or calculated display
- **Validation**: Must match pattern: `\d+d\d+` if provided
- **Behavior**: Based on class and level

#### hitPoints.hitDice.current
- **Type**: String
- **Required**: No
- **Constraints**: Dice notation format
- **UI Element**: Text input
- **Validation**: Must match pattern: `\d+d\d+` if provided
- **Behavior**: Tracks remaining hit dice

#### armorClass
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 1 if provided
- **UI Element**: Number input
- **Validation**: If provided, must be ≥ 1
- **Behavior**: AC calculation based on armor and dexterity

#### initiative
- **Type**: Integer
- **Required**: No (can be calculated)
- **Constraints**: None
- **UI Element**: Number input or calculated display
- **Validation**: Integer
- **Behavior**: Typically equals Dexterity modifier

#### speed.walking
- **Type**: Integer
- **Required**: No
- **Constraints**: None
- **UI Element**: Number input
- **Validation**: Integer if provided
- **Behavior**: Measured in feet (default 30 for most races)

#### speed.swimming / speed.climbing / speed.flying / speed.burrowing
- **Type**: Integer
- **Required**: No
- **Constraints**: None
- **UI Element**: Number input (collapsed/optional section)
- **Validation**: Integer if provided
- **Behavior**: Special movement speeds, often 0 or equal to walking

#### passivePerception
- **Type**: Integer
- **Required**: No (calculated)
- **Constraints**: None
- **UI Element**: Read-only display or number input
- **Validation**: Integer
- **Behavior**: Calculated as: 10 + Perception skill modifier

#### inspiration
- **Type**: Boolean
- **Required**: No
- **Constraints**: None
- **UI Element**: Checkbox or toggle
- **Validation**: Boolean
- **Behavior**: Tracks inspiration point

#### deathSaves.successes / deathSaves.failures
- **Type**: Integer
- **Required**: No
- **Constraints**: 0-3
- **UI Element**: 3 checkboxes or number input with max 3
- **Validation**: Min 0, max 3
- **Behavior**: Death saving throw tracker

### Lists and Arrays

#### languages
- **Type**: Array of strings
- **Required**: No
- **Constraints**: None
- **UI Element**: Multi-select dropdown or tag input
- **Validation**: Each item must be non-empty string
- **Behavior**: Add/remove language tags

#### proficiencies.armor / proficiencies.weapons / proficiencies.tools
- **Type**: Array of strings
- **Required**: No
- **Constraints**: None
- **UI Element**: Multi-select or tag input
- **Validation**: Each item must be non-empty string
- **Behavior**: Add/remove proficiency tags, suggest common options

#### features
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each feature has name (string), source (string), description (string), optional uses object
- **UI Element**: Repeatable fieldset with "Add Feature" button
- **Validation**: Each feature must have at least a name
- **Behavior**: Expandable/collapsible feature cards, add/remove dynamically

#### feats
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each feat has name (string) and description (string)
- **UI Element**: Repeatable fieldset with "Add Feat" button
- **Validation**: Each feat must have at least a name
- **Behavior**: Add/remove feat entries

### Inventory

#### inventory.currency.{copper/silver/electrum/gold/platinum}
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 0
- **UI Element**: Number input (grouped in currency section)
- **Validation**: If provided, must be ≥ 0
- **Behavior**: Track different coin types

#### inventory.weapons
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each weapon has name, optional type, damage, damageType, properties (array), attackBonus, damageBonus, magical, magicalBonus, equipped, quantity, weight, description
- **UI Element**: Repeatable weapon form with "Add Weapon" button
- **Validation**: Each weapon must have name; damage must match dice notation if provided; attackBonus/damageBonus/magicalBonus must be integers; quantity minimum 1; weight must be number ≥ 0
- **Behavior**: Expandable weapon cards, add/remove weapons, checkbox for equipped status

#### inventory.armor
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each armor has name, type (enum: Light/Medium/Heavy/Shield), armorClass, dexterityBonus, stealthDisadvantage, strengthRequirement, magical, magicalBonus, equipped, weight, description
- **UI Element**: Repeatable armor form with "Add Armor" button
- **Validation**: Type must be one of 4 valid values; armorClass must be integer; equipped must be boolean
- **Behavior**: Only one armor per type can be equipped at a time (validation rule)

#### inventory.equipment
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each item has name, type, quantity (min 1), weight, description, magical, attunement, attuned
- **UI Element**: Repeatable equipment form with "Add Item" button
- **Validation**: Quantity minimum 1; attuned can only be true if attunement is true
- **Behavior**: Add/remove generic equipment items

#### inventory.carryingCapacity.maximum / current / encumbered / heavilyEncumbered
- **Type**: Integer (maximum/current), Boolean (encumbered/heavilyEncumbered)
- **Required**: No
- **Constraints**: Maximum calculated as Strength × 15; current is sum of all inventory weights
- **UI Element**: Read-only displays with progress bar
- **Validation**: Auto-calculated
- **Behavior**: Updates when inventory or Strength changes; encumbered if current > Str × 5; heavily encumbered if current > Str × 10

### Spellcasting

#### spellcasting.spellcastingAbility
- **Type**: String (enum)
- **Required**: No (only if character can cast spells)
- **Constraints**: Must be "Intelligence", "Wisdom", or "Charisma"
- **UI Element**: Dropdown
- **Validation**: If provided, must be one of three values
- **Behavior**: Determines which ability modifier is used for spell calculations

#### spellcasting.spellSaveDC
- **Type**: Integer
- **Required**: No (calculated)
- **Constraints**: Calculated as 8 + proficiencyBonus + spellcasting ability modifier
- **UI Element**: Read-only display
- **Validation**: Auto-calculated
- **Behavior**: Updates when level or spellcasting ability changes

#### spellcasting.spellAttackBonus
- **Type**: Integer
- **Required**: No (calculated)
- **Constraints**: Calculated as proficiencyBonus + spellcasting ability modifier
- **UI Element**: Read-only display
- **Validation**: Auto-calculated
- **Behavior**: Updates when level or spellcasting ability changes

#### spellcasting.spellSlots.level{1-9}.maximum / current
- **Type**: Integer
- **Required**: No
- **Constraints**: Minimum 0; current cannot exceed maximum
- **UI Element**: Paired number inputs or checkbox trackers
- **Validation**: Max and current must be ≥ 0; current ≤ maximum
- **Behavior**: Track spell slot usage per level

#### spellcasting.pactMagic.slotLevel / slotsMaximum / slotsCurrent
- **Type**: Integer
- **Required**: No (Warlock-specific)
- **Constraints**: slotLevel 1-5; slotsMaximum 1-4; slotsCurrent 0-4
- **UI Element**: Number inputs (only shown for Warlocks)
- **Validation**: Within specified ranges
- **Behavior**: Alternative spell slot tracking for Pact Magic

#### spellcasting.cantripsKnown / spellsKnown
- **Type**: Array of objects
- **Required**: No
- **Constraints**: Each spell has name (required), school, castingTime, range, components (object with verbal/somatic/material booleans + materialComponents string), duration, description; spellsKnown also includes level (1-9), concentration (boolean), ritual (boolean)
- **UI Element**: Repeatable spell form with "Add Spell" button, filterable list
- **Validation**: Spell name required; level must be 1-9 for leveled spells; components must have valid boolean values
- **Behavior**: Searchable/filterable spell lists, add/remove spells, checkbox for concentration/ritual

#### spellcasting.preparedSpells
- **Type**: Array of strings (spell names)
- **Required**: No
- **Constraints**: Each entry must reference a spell from spellsKnown
- **UI Element**: Multi-select checkboxes from spellsKnown list
- **Validation**: Can only prepare spells that are known
- **Behavior**: Toggle prepared status for known spells

#### spellcasting.spellbook
- **Type**: Array of strings (spell names)
- **Required**: No (Wizard-specific)
- **Constraints**: None
- **UI Element**: Tag input or list (only for Wizards)
- **Validation**: Spell names
- **Behavior**: Track spells in wizard's spellbook (separate from prepared)

### Personality and Appearance

#### personality.personalityTraits / ideals / bonds / flaws
- **Type**: Array of strings
- **Required**: No
- **Constraints**: None
- **UI Element**: Textarea or list of text inputs
- **Validation**: Each item must be non-empty string if provided
- **Behavior**: Add/remove personality trait entries

#### appearance.age / height / weight / eyes / skin / hair / appearance
- **Type**: Integer (age), String (others)
- **Required**: No
- **Constraints**: Age must be integer ≥ 0 if provided
- **UI Element**: Number input (age), text inputs (physical traits), textarea (general appearance)
- **Validation**: Age must be non-negative integer; others are free text
- **Behavior**: Optional physical description fields

#### backstory
- **Type**: String
- **Required**: No
- **Constraints**: None
- **UI Element**: Large textarea with character counter
- **Validation**: None (can be very long)
- **Behavior**: Rich text area for character history

#### allies / treasure
- **Type**: Array of strings
- **Required**: No
- **Constraints**: None
- **UI Element**: Tag input or list
- **Validation**: Each item must be non-empty string
- **Behavior**: Track allies/organizations and treasure

#### notes
- **Type**: String
- **Required**: No
- **Constraints**: None
- **UI Element**: Large textarea
- **Validation**: None
- **Behavior**: Free-form notes area

## Non-Functional Requirements

### Performance Requirements

- **NFR-001**: Character list page MUST load and display within 2 seconds on broadband connection
- **NFR-002**: Character preview MUST open within 500ms of tile click
- **NFR-003**: Form validation MUST provide feedback within 100ms of user input
- **NFR-004**: Character creation submission MUST complete within 3 seconds under normal conditions
- **NFR-005**: Search/filter operations MUST update results within 300ms
- **NFR-006**: Theme toggle MUST transition within 200ms

### User Experience Requirements

- **NFR-007**: UI MUST follow modern design principles (clean, minimal, intuitive)
- **NFR-008**: Form fields MUST have clear labels and placeholder text
- **NFR-009**: Validation errors MUST be displayed inline near the relevant field
- **NFR-010**: Success/error messages MUST be clearly visible and dismissible
- **NFR-011**: Long forms MUST be organized into logical sections/tabs
- **NFR-012**: Complex nested data (spells, inventory) MUST be collapsible to reduce cognitive load
- **NFR-013**: MUST be fully keyboard accessible (tab navigation, enter to submit, escape to cancel)
- **NFR-014**: MUST be screen reader compatible (ARIA labels, semantic HTML)

### Security Requirements

- **NFR-015**: All user input MUST be sanitized to prevent XSS attacks
- **NFR-016**: All user input MUST be sanitized to prevent SQL injection
- **NFR-017**: API endpoints MUST validate authentication/authorization
- **NFR-018**: Sensitive data MUST NOT be exposed in client-side code or network responses

### Browser Support

- **NFR-019**: MUST support latest 2 versions of Chrome, Firefox, Safari, Edge
- **NFR-020**: MUST degrade gracefully on older browsers

### Responsive Design

- **NFR-021**: MUST be fully functional on mobile devices (320px width minimum)
- **NFR-022**: MUST adapt layout for tablet (768px-1024px)
- **NFR-023**: MUST optimize for desktop (1024px+)
- **NFR-024**: Touch targets MUST be minimum 44x44px on mobile

## Technical Constraints

- **TC-001**: Frontend MUST conform to character-schema.json (JSON Schema Draft 07)
- **TC-002**: Backend MUST conform to character-schema.json (JSON Schema Draft 07)
- **TC-003**: Backend MUST independently validate all data using the schema
- **TC-004**: Frontend and Backend validation logic MUST produce identical results for the same input
- **TC-005**: All API responses MUST follow standardized error format:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable message",
      "details": {}
    }
  }
  ```
- **TC-006**: Character IDs MUST be unique and immutable
- **TC-007**: Theme preference MUST be stored in localStorage
- **TC-008**: Form state MUST be preserved during navigation (warn before losing unsaved changes)

## Success Criteria

1. User can view all their characters in a tile layout with working filter/sort/preview
2. User can create a new character with all required fields validated in real-time
3. User can edit an existing character with pre-populated data and validation
4. User can delete a character with confirmation dialog
5. All validation errors prevent submission and display clear messages
6. Backend validation independently catches invalid data
7. Light and dark modes work across all pages
8. Application is responsive on mobile, tablet, and desktop
9. Form sections for complex data (inventory, spells) are user-friendly
10. All 18 skills auto-calculate modifiers based on ability scores and proficiency
11. Ability score modifiers auto-calculate correctly
12. Proficiency bonus updates correctly based on level
13. Zero accessibility violations in automated testing tools
14. Application handles all edge cases gracefully (empty states, errors, slow network)

## Out of Scope

- User authentication/authorization (assume single-user or handle externally)
- Character import/export to PDF or other formats
- Dice rolling functionality
- Campaign management or session tracking
- Real-time collaboration/sharing characters with other users
- Integration with D&D Beyond or other external APIs
- Character artwork upload
- Printable character sheet generation
- Undo/redo functionality for edits
- Version history for characters
- Advanced spell filtering (by school, level, class)
- Automated character leveling wizard
- Rules enforcement (e.g., max skills for class, valid multiclass combinations)
- Initiative tracker or combat mode
- Character comparison view

## Dependencies

- character-schema.json (JSON Schema definition)
- Modern web framework (React, Vue, Svelte, or similar)
- JSON Schema validator library (frontend and backend)
- CSS framework or design system for theming
- Backend API framework
- Database for character storage (MongoDB recommended given JSON schema)
- Form validation library compatible with JSON Schema

## Migration Notes

This is a new feature - no migration from existing system required.

Initial implementation should support all required fields from character-schema.json. Optional fields can be implemented progressively:
- Phase 1 (MVP): Basic info, ability scores, skills, combat stats, simple lists
- Phase 2: Full inventory system (weapons, armor, equipment)
- Phase 3: Complete spellcasting system
- Phase 4: Personality, appearance, backstory, notes

## Performance Targets

- **List Load**: P50 < 1s, P99 < 2s
- **Character Create/Update**: P50 < 2s, P99 < 3s
- **Character Delete**: P50 < 1s, P99 < 2s
- **Search/Filter**: P50 < 200ms, P99 < 500ms
- **Form Validation**: P50 < 50ms, P99 < 100ms (per field)
- **Theme Toggle**: P50 < 100ms, P99 < 200ms

## Open Questions

1. Should we implement auto-save for character edits?
2. Should character names be unique per user?
3. What happens to orphaned data if schema is updated in the future?
4. Should we provide default values for calculated fields if user overrides them?
5. How many characters should we display per page (pagination limit)?
6. Should filters/sorts persist across sessions?
7. Do we need bulk operations (delete multiple characters)?
8. Should we track character modification timestamps (created_at, updated_at)?
