import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const conceptDirectory = path.join(root, 'content-source', 'embedded-systems', 'concepts');
const conceptOutput = path.join(root, 'content-source', 'embedded-systems', 'concepts.json');
const exerciseOutput = path.join(root, 'data', 'embedded', 'day6-10.json');

const conceptFiles = fs.readdirSync(conceptDirectory)
  .filter(file => file.endsWith('.json'))
  .sort();

if (conceptFiles.length !== 10) {
  throw new Error(`Expected 10 Embedded concept sources; found ${conceptFiles.length}`);
}

const concepts = conceptFiles.map(file => {
  const concept = JSON.parse(fs.readFileSync(path.join(conceptDirectory, file), 'utf8'));
  return {
    ...concept,
    source: `content-source/embedded-systems/concepts/${file}`
  };
});

const conceptModel = {
  schemaVersion: 1,
  module: 'embedded',
  collection: {
    id: 'embedded-systems-firmware',
    title: 'Embedded Systems & Firmware'
  },
  standardBaseline: {
    family: 'AutoLeaP Embedded Systems Body of Knowledge',
    edition: '2026',
    status: 'learning-baseline'
  },
  generatedFrom: 'content-source/embedded-systems/concepts',
  concepts
};

fs.mkdirSync(path.dirname(conceptOutput), { recursive: true });
fs.writeFileSync(conceptOutput, `${JSON.stringify(conceptModel, null, 2)}\n`);

const exercises = Array.from({ length: 5 }, (_, index) =>
  JSON.parse(fs.readFileSync(path.join(root, 'data', 'embedded', `day${index + 6}.json`), 'utf8'))
).flat();

if (exercises.length !== 50) {
  throw new Error(`Expected 50 Embedded exercises across stages 6–10; found ${exercises.length}`);
}

fs.writeFileSync(exerciseOutput, `${JSON.stringify(exercises)}\n`);
console.log('Embedded source assembly: 10 concepts and 50 later-stage exercises prepared.');
