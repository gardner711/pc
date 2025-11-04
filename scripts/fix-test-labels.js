const fs = require('fs');
const path = require('path');

// Mapping of exact strings to strings with { exact: false }
const replacements = {
    "'Character Name'": "'Character Name', { exact: false }",
    "'Race'": "'Race', { exact: false }",
    "'Class'": "'Class', { exact: false }",
    "'Level'": "'Level', { exact: false }",
    "'Background'": "'Background', { exact: false }",
    "'Alignment'": "'Alignment', { exact: false }",
    "'Strength'": "'Strength', { exact: false }",
    "'Dexterity'": "'Dexterity', { exact: false }",
    "'Constitution'": "'Constitution', { exact: false }",
    "'Intelligence'": "'Intelligence', { exact: false }",
    "'Wisdom'": "'Wisdom', { exact: false }",
    "'Charisma'": "'Charisma', { exact: false }",
};

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

    Object.entries(replacements).forEach(([oldValue, newValue]) => {
        const pattern = new RegExp(`getByLabelText\\(${oldValue.replace(/'/g, "'")}\\)`, 'g');
        const matches = content.match(pattern);
        if (matches) {
            fileReplacements += matches.length;
            content = content.replace(pattern, `getByLabelText(${newValue})`);
        }
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${path.basename(filePath)}: ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
});

console.log(`\nTotal replacements: ${totalReplacements}`);
