const fs = require('fs');
const path = require('path');

// Mapping of label text to role-based queries
const replacements = [
    // Text inputs
    {
        old: "getByLabelText('Character Name', { exact: false })",
        new: "getByRole('textbox', { name: /Character Name/i })"
    },
    {
        old: "getByLabelText('Background', { exact: false })",
        new: "getByRole('textbox', { name: /Background/i })"
    },
    {
        old: "getByLabelText('Player Name', { exact: false })",
        new: "getByRole('textbox', { name: /Player Name/i })"
    },
    // Comboboxes (selects)
    {
        old: "getByLabelText('Race', { exact: false })",
        new: "getByRole('combobox', { name: /Race/i })"
    },
    {
        old: "getByLabelText('Class', { exact: false })",
        new: "getByRole('combobox', { name: /Class/i })"
    },
    {
        old: "getByLabelText('Alignment', { exact: false })",
        new: "getByRole('combobox', { name: /Alignment/i })"
    },
    // Spinbuttons (number inputs)
    {
        old: "getByLabelText('Level', { exact: false })",
        new: "getByRole('spinbutton', { name: /Level/i })"
    },
    {
        old: "getByLabelText('Strength', { exact: false })",
        new: "getByRole('spinbutton', { name: /Strength/i })"
    },
    {
        old: "getByLabelText('Dexterity', { exact: false })",
        new: "getByRole('spinbutton', { name: /Dexterity/i })"
    },
    {
        old: "getByLabelText('Constitution', { exact: false })",
        new: "getByRole('spinbutton', { name: /Constitution/i })"
    },
    {
        old: "getByLabelText('Intelligence', { exact: false })",
        new: "getByRole('spinbutton', { name: /Intelligence/i })"
    },
    {
        old: "getByLabelText('Wisdom', { exact: false })",
        new: "getByRole('spinbutton', { name: /Wisdom/i })"
    },
    {
        old: "getByLabelText('Charisma', { exact: false })",
        new: "getByRole('spinbutton', { name: /Charisma/i })"
    }
];

const testFiles = [
    path.join(__dirname, '../frontend/tests/integration/character-creation.test.tsx'),
    path.join(__dirname, '../frontend/tests/integration/character-edit.test.tsx'),
    path.join(__dirname, '../frontend/tests/integration/character-delete.test.tsx'),
];

let totalReplacements = 0;

testFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;

    replacements.forEach(({ old, new: newQuery }) => {
        const oldEscaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(oldEscaped, 'g');
        const matches = content.match(pattern);

        if (matches) {
            fileReplacements += matches.length;
            content = content.replace(pattern, newQuery);
        }
    });

    if (fileReplacements > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${path.basename(filePath)}: ${fileReplacements} replacements`);
        totalReplacements += fileReplacements;
    } else {
        console.log(`${path.basename(filePath)}: No replacements needed`);
    }
});

console.log(`\nTotal replacements: ${totalReplacements}`);
