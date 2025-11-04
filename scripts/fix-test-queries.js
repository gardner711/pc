const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/tests/integration/character-creation.test.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Fix "Ability Scores" to use heading role
content = content.replace(
    /expect\(screen\.getByText\(\/Ability Scores\/i\)\)\.toBeInTheDocument\(\)/g,
    "expect(screen.getByRole('heading', { name: /Ability Scores/i })).toBeInTheDocument()"
);

// Fix the timeout issue by using paste instead of type for long strings
content = content.replace(
    /await user\.type\(screen\.getByRole\('textbox', \{ name: \/Character Name\/i \}\), longName\)/,
    "await user.paste(screen.getByRole('textbox', { name: /Character Name/i }), longName)"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed character-creation.test.tsx');
