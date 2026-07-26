import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

new vm.Script(readText('assets/concepts.js'), { filename: 'assets/concepts.js' });

const indexHtml = readText('index.html');
const requiredHooks = [
  'assets/concepts.css',
  'data-view="concepts"',
  'id="view-concepts"',
  'id="conceptCollectionTitle"',
  'id="conceptBaseline"',
  'id="conceptNav"',
  'id="conceptDetail"',
  'assets/concepts.js'
];

for (const hook of requiredHooks) {
  if (!indexHtml.includes(hook)) fail(`index.html: missing Concepts UI hook ${hook}`);
}

const appScriptPosition = indexHtml.indexOf('assets/app.js');
const conceptsScriptPosition = indexHtml.indexOf('assets/concepts.js');
if (appScriptPosition === -1 || conceptsScriptPosition < appScriptPosition) {
  fail('index.html: concepts.js must load after app.js');
}

const manifest = readJson('data/topics.json');
const safety = manifest.topics?.find(module => module.id === 'safety');
if (!safety?.concepts) fail('data/topics.json: Safety module must declare a concepts path');

const conceptModel = readJson(safety.concepts);
if (conceptModel.module !== 'safety') fail('Safety concept model has an invalid module id');
if (!Array.isArray(conceptModel.concepts) || conceptModel.concepts.length !== 5) {
  fail('Safety concept model must contain the five FSM pilot concepts');
}

const conceptIds = new Set(conceptModel.concepts.map(concept => concept.id));
for (const concept of conceptModel.concepts) {
  for (const relatedId of concept.relatedConcepts) {
    if (!conceptIds.has(relatedId)) fail(`${concept.id}: unresolved related concept ${relatedId}`);
  }
}

const conceptsScript = readText('assets/concepts.js');
for (const behavior of [
  'Practice this concept',
  'linkedQuestions',
  'concept-practice-hidden',
  'data-related-concept',
  'data-clear-concept-practice'
]) {
  if (!conceptsScript.includes(behavior)) fail(`assets/concepts.js: missing behavior ${behavior}`);
}

console.log(`Concepts UI validation passed for ${conceptModel.concepts.length} FSM concepts.`);
