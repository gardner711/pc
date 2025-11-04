package models

import (
	"time"
)

// Character represents a D&D 5e character
type Character struct {
	ID                     string            `json:"_id,omitempty" bson:"_id,omitempty"`
	CharacterName          string            `json:"characterName" bson:"characterName" binding:"required,max=500"`
	PlayerName             string            `json:"playerName,omitempty" bson:"playerName,omitempty" binding:"max=500"`
	Race                   string            `json:"race" bson:"race" binding:"required,max=500"`
	Subrace                string            `json:"subrace,omitempty" bson:"subrace,omitempty" binding:"max=500"`
	Class                  string            `json:"class" bson:"class" binding:"required,max=500"`
	Subclass               string            `json:"subclass,omitempty" bson:"subclass,omitempty" binding:"max=500"`
	Multiclass             []MulticlassEntry `json:"multiclass,omitempty" bson:"multiclass,omitempty"`
	Level                  int               `json:"level" bson:"level" binding:"required,min=1,max=20"`
	ExperiencePoints       int               `json:"experiencePoints,omitempty" bson:"experiencePoints,omitempty" binding:"min=0"`
	Background             string            `json:"background,omitempty" bson:"background,omitempty" binding:"max=500"`
	Alignment              string            `json:"alignment,omitempty" bson:"alignment,omitempty" binding:"max=500"`
	AbilityScores          AbilityScores     `json:"abilityScores" bson:"abilityScores" binding:"required"`
	SavingThrows           *SavingThrows     `json:"savingThrows,omitempty" bson:"savingThrows,omitempty"`
	Skills                 Skills            `json:"skills" bson:"skills" binding:"required"`
	Proficiencies          *Proficiencies    `json:"proficiencies,omitempty" bson:"proficiencies,omitempty"`
	HitPoints              HitPoints         `json:"hitPoints" bson:"hitPoints" binding:"required"`
	ArmorClass             int               `json:"armorClass" bson:"armorClass" binding:"required,min=0"`
	Initiative             int               `json:"initiative" bson:"initiative" binding:"required"`
	Speed                  Speed             `json:"speed" bson:"speed" binding:"required"`
	Inspiration            bool              `json:"inspiration" bson:"inspiration"`
	ProficiencyBonus       int               `json:"proficiencyBonus" bson:"proficiencyBonus" binding:"required,min=2,max=6"`
	PassivePerception      int               `json:"passivePerception" bson:"passivePerception" binding:"required,min=0"`
	DeathSaves             *DeathSaves       `json:"deathSaves,omitempty" bson:"deathSaves,omitempty"`
	Attacks                []Attack          `json:"attacks,omitempty" bson:"attacks,omitempty"`
	Inventory              *Inventory        `json:"inventory,omitempty" bson:"inventory,omitempty"`
	Spellcasting           *Spellcasting     `json:"spellcasting,omitempty" bson:"spellcasting,omitempty"`
	Features               []Feature         `json:"features,omitempty" bson:"features,omitempty"`
	PersonalityTraits      []string          `json:"personalityTraits,omitempty" bson:"personalityTraits,omitempty"`
	Ideals                 string            `json:"ideals,omitempty" bson:"ideals,omitempty" binding:"max=500"`
	Bonds                  string            `json:"bonds,omitempty" bson:"bonds,omitempty" binding:"max=500"`
	Flaws                  string            `json:"flaws,omitempty" bson:"flaws,omitempty" binding:"max=500"`
	Appearance             *Appearance       `json:"appearance,omitempty" bson:"appearance,omitempty"`
	Backstory              string            `json:"backstory,omitempty" bson:"backstory,omitempty" binding:"max=500"`
	AlliesAndOrganizations string            `json:"alliesAndOrganizations,omitempty" bson:"alliesAndOrganizations,omitempty" binding:"max=500"`
	Treasure               string            `json:"treasure,omitempty" bson:"treasure,omitempty" binding:"max=500"`
	AdditionalNotes        string            `json:"additionalNotes,omitempty" bson:"additionalNotes,omitempty" binding:"max=500"`
	CreatedAt              time.Time         `json:"createdAt" bson:"createdAt"`
	UpdatedAt              time.Time         `json:"updatedAt" bson:"updatedAt"`
}

type MulticlassEntry struct {
	Class    string `json:"class" bson:"class" binding:"max=500"`
	Subclass string `json:"subclass,omitempty" bson:"subclass,omitempty" binding:"max=500"`
	Level    int    `json:"level" bson:"level" binding:"min=1,max=20"`
}

type AbilityScore struct {
	Score    int `json:"score" bson:"score" binding:"required,min=1,max=30"`
	Modifier int `json:"modifier" bson:"modifier"`
}

type AbilityScores struct {
	Strength     AbilityScore `json:"strength" bson:"strength" binding:"required"`
	Dexterity    AbilityScore `json:"dexterity" bson:"dexterity" binding:"required"`
	Constitution AbilityScore `json:"constitution" bson:"constitution" binding:"required"`
	Intelligence AbilityScore `json:"intelligence" bson:"intelligence" binding:"required"`
	Wisdom       AbilityScore `json:"wisdom" bson:"wisdom" binding:"required"`
	Charisma     AbilityScore `json:"charisma" bson:"charisma" binding:"required"`
}

type SavingThrows struct {
	Strength     bool `json:"strength" bson:"strength"`
	Dexterity    bool `json:"dexterity" bson:"dexterity"`
	Constitution bool `json:"constitution" bson:"constitution"`
	Intelligence bool `json:"intelligence" bson:"intelligence"`
	Wisdom       bool `json:"wisdom" bson:"wisdom"`
	Charisma     bool `json:"charisma" bson:"charisma"`
}

type Skill struct {
	Proficient bool `json:"proficient" bson:"proficient"`
	Expertise  bool `json:"expertise" bson:"expertise"`
	Modifier   int  `json:"modifier" bson:"modifier"`
}

type Skills struct {
	Acrobatics     Skill `json:"acrobatics" bson:"acrobatics"`
	AnimalHandling Skill `json:"animalHandling" bson:"animalHandling"`
	Arcana         Skill `json:"arcana" bson:"arcana"`
	Athletics      Skill `json:"athletics" bson:"athletics"`
	Deception      Skill `json:"deception" bson:"deception"`
	History        Skill `json:"history" bson:"history"`
	Insight        Skill `json:"insight" bson:"insight"`
	Intimidation   Skill `json:"intimidation" bson:"intimidation"`
	Investigation  Skill `json:"investigation" bson:"investigation"`
	Medicine       Skill `json:"medicine" bson:"medicine"`
	Nature         Skill `json:"nature" bson:"nature"`
	Perception     Skill `json:"perception" bson:"perception"`
	Performance    Skill `json:"performance" bson:"performance"`
	Persuasion     Skill `json:"persuasion" bson:"persuasion"`
	Religion       Skill `json:"religion" bson:"religion"`
	SleightOfHand  Skill `json:"sleightOfHand" bson:"sleightOfHand"`
	Stealth        Skill `json:"stealth" bson:"stealth"`
	Survival       Skill `json:"survival" bson:"survival"`
}

type Proficiencies struct {
	Armor     []string `json:"armor,omitempty" bson:"armor,omitempty"`
	Weapons   []string `json:"weapons,omitempty" bson:"weapons,omitempty"`
	Tools     []string `json:"tools,omitempty" bson:"tools,omitempty"`
	Languages []string `json:"languages,omitempty" bson:"languages,omitempty"`
}

type HitPoints struct {
	Maximum   int `json:"maximum" bson:"maximum" binding:"required,min=1"`
	Current   int `json:"current" bson:"current" binding:"required,min=0"`
	Temporary int `json:"temporary" bson:"temporary" binding:"min=0"`
}

type Speed struct {
	Walk   int `json:"walk" bson:"walk" binding:"required,min=0"`
	Fly    int `json:"fly,omitempty" bson:"fly,omitempty" binding:"min=0"`
	Swim   int `json:"swim,omitempty" bson:"swim,omitempty" binding:"min=0"`
	Climb  int `json:"climb,omitempty" bson:"climb,omitempty" binding:"min=0"`
	Burrow int `json:"burrow,omitempty" bson:"burrow,omitempty" binding:"min=0"`
}

type DeathSaves struct {
	Successes int `json:"successes" bson:"successes" binding:"min=0,max=3"`
	Failures  int `json:"failures" bson:"failures" binding:"min=0,max=3"`
}

type Attack struct {
	Name        string `json:"name" bson:"name" binding:"max=500"`
	AttackBonus int    `json:"attackBonus" bson:"attackBonus"`
	Damage      string `json:"damage" bson:"damage" binding:"max=500"`
	DamageType  string `json:"damageType" bson:"damageType" binding:"max=500"`
	Notes       string `json:"notes,omitempty" bson:"notes,omitempty" binding:"max=500"`
}

type Inventory struct {
	Currency         *Currency       `json:"currency,omitempty" bson:"currency,omitempty"`
	Weapons          []Weapon        `json:"weapons,omitempty" bson:"weapons,omitempty"`
	Armor            []ArmorItem     `json:"armor,omitempty" bson:"armor,omitempty"`
	Equipment        []EquipmentItem `json:"equipment,omitempty" bson:"equipment,omitempty"`
	CarryingCapacity int             `json:"carryingCapacity,omitempty" bson:"carryingCapacity,omitempty" binding:"min=0"`
}

type Currency struct {
	Copper   int `json:"copper" bson:"copper" binding:"min=0"`
	Silver   int `json:"silver" bson:"silver" binding:"min=0"`
	Electrum int `json:"electrum" bson:"electrum" binding:"min=0"`
	Gold     int `json:"gold" bson:"gold" binding:"min=0"`
	Platinum int `json:"platinum" bson:"platinum" binding:"min=0"`
}

type Weapon struct {
	Name       string   `json:"name" bson:"name" binding:"max=500"`
	Type       string   `json:"type" bson:"type" binding:"max=500"`
	Damage     string   `json:"damage" bson:"damage" binding:"max=500"`
	DamageType string   `json:"damageType" bson:"damageType" binding:"max=500"`
	Properties []string `json:"properties,omitempty" bson:"properties,omitempty"`
	Equipped   bool     `json:"equipped" bson:"equipped"`
	Quantity   int      `json:"quantity" bson:"quantity" binding:"min=1"`
}

type ArmorItem struct {
	Name                string `json:"name" bson:"name" binding:"max=500"`
	Type                string `json:"type" bson:"type" binding:"max=500"`
	ArmorClass          int    `json:"armorClass" bson:"armorClass" binding:"min=0"`
	Equipped            bool   `json:"equipped" bson:"equipped"`
	StealthDisadvantage bool   `json:"stealthDisadvantage" bson:"stealthDisadvantage"`
}

type EquipmentItem struct {
	Name        string  `json:"name" bson:"name" binding:"max=500"`
	Quantity    int     `json:"quantity" bson:"quantity" binding:"min=1"`
	Weight      float64 `json:"weight,omitempty" bson:"weight,omitempty" binding:"min=0"`
	Description string  `json:"description,omitempty" bson:"description,omitempty" binding:"max=500"`
}

type Spellcasting struct {
	SpellcastingAbility string      `json:"spellcastingAbility,omitempty" bson:"spellcastingAbility,omitempty" binding:"max=500"`
	SpellSaveDC         int         `json:"spellSaveDC,omitempty" bson:"spellSaveDC,omitempty" binding:"min=0"`
	SpellAttackBonus    int         `json:"spellAttackBonus,omitempty" bson:"spellAttackBonus,omitempty"`
	SpellSlots          *SpellSlots `json:"spellSlots,omitempty" bson:"spellSlots,omitempty"`
	CantripsKnown       []string    `json:"cantripsKnown,omitempty" bson:"cantripsKnown,omitempty"`
	SpellsKnown         []string    `json:"spellsKnown,omitempty" bson:"spellsKnown,omitempty"`
	PreparedSpells      []string    `json:"preparedSpells,omitempty" bson:"preparedSpells,omitempty"`
}

type SpellSlots struct {
	Level1 SpellSlotLevel `json:"level1,omitempty" bson:"level1,omitempty"`
	Level2 SpellSlotLevel `json:"level2,omitempty" bson:"level2,omitempty"`
	Level3 SpellSlotLevel `json:"level3,omitempty" bson:"level3,omitempty"`
	Level4 SpellSlotLevel `json:"level4,omitempty" bson:"level4,omitempty"`
	Level5 SpellSlotLevel `json:"level5,omitempty" bson:"level5,omitempty"`
	Level6 SpellSlotLevel `json:"level6,omitempty" bson:"level6,omitempty"`
	Level7 SpellSlotLevel `json:"level7,omitempty" bson:"level7,omitempty"`
	Level8 SpellSlotLevel `json:"level8,omitempty" bson:"level8,omitempty"`
	Level9 SpellSlotLevel `json:"level9,omitempty" bson:"level9,omitempty"`
}

type SpellSlotLevel struct {
	Total int `json:"total" bson:"total" binding:"min=0"`
	Used  int `json:"used" bson:"used" binding:"min=0"`
}

type Feature struct {
	Name        string `json:"name" bson:"name" binding:"max=500"`
	Source      string `json:"source" bson:"source" binding:"max=500"`
	Description string `json:"description" bson:"description" binding:"max=500"`
}

type Appearance struct {
	Age      int    `json:"age,omitempty" bson:"age,omitempty" binding:"min=0"`
	Height   string `json:"height,omitempty" bson:"height,omitempty" binding:"max=500"`
	Weight   string `json:"weight,omitempty" bson:"weight,omitempty" binding:"max=500"`
	Eyes     string `json:"eyes,omitempty" bson:"eyes,omitempty" binding:"max=500"`
	Skin     string `json:"skin,omitempty" bson:"skin,omitempty" binding:"max=500"`
	Hair     string `json:"hair,omitempty" bson:"hair,omitempty" binding:"max=500"`
	ImageURL string `json:"imageUrl,omitempty" bson:"imageUrl,omitempty" binding:"max=500"`
}
