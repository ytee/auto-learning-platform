import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const sourceDirectory = path.join(
  root,
  'content-source',
  'safety',
  'concepts',
  'functional-safety-management'
);
const outputFile = path.join(root, 'data', 'safety', 'concepts.json');
const checkOnly = process.argv.includes('--check');

const requiredMetadata = [
  'id',
  'title',
  'module',
  'collection',
  'order',
  'standard',
  'difficulty',
  'stage',
  'systems',
  'relatedConcepts',
  'linkedQuestions',
  'references'
];

const requiredSections = [
  'Learning objectives',
  'Concept',
  'Why it matters',
  'Inputs',
  'Activities',
  'Outputs and evidence',
  'Automotive example',
  'Common mistakes'
];

const knownDifficulties = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);
const fail = message => { throw new Error(message); };

function parseValue(rawValue, file, key) {
  const value = rawValue.trim();
  if (!value) return '';

  if (
    value.startsWith('[') ||
    value.startsWith('{') ||
    value.startsWith('"') ||
    value === 'true' ||
    value === 'false' ||
    value === 'null'
  ) {
    try {
      return JSON.parse(value);
    } catch (error) {
      fail(`${file}: invalid JSON value for ${key}: ${error.message}`);
    }
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function parseFrontMatter(text, file) {
  if (!text.startsWith('---\n')) fail(`${file}: Markdown must begin with front matter`);

  const closingMarker = text.indexOf('\n---\n', 4);
  if (closingMarker === -1) fail(`${file}: front matter closing marker is missing`);

  const frontMatterText = text.slice(4, closingMarker);
  const metadata = {};

  for (const rawLine of frontMatterText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf(':');
    if (separator === -1) fail(`${file}: invalid front matter line "${rawLine}"`);

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1);
    if (!key) fail(`${file}: empty front matter key`);
    if (Object.hasOwn(metadata, key)) fail(`${file}: duplicate front matter key ${key}`);

    metadata[key] = parseValue(rawValue, file, key);
  }

  return { metadata, body: text.slice(closingMarker + 5) };
}

function parseSections(body, file) {
  const sections = {};
  let currentHeading = null;
  let currentLines = [];

  const flush = () => {
    if (!currentHeading) return;
    const value = currentLines.join('\n').trim();
    if (Object.hasOwn(sections, currentHeading)) fail(`${file}: duplicate section ${currentHeading}`);
    sections[currentHeading] = value;
  };

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      flush();
      currentHeading = heading[1];
      currentLines = [];
      continue;
    }
    if (currentHeading) currentLines.push(line);
  }

  flush();
  return sections;
}

function parseBulletList(value, file, sectionName) {
  const items = value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (!line.startsWith('- ')) fail(`${file}: ${sectionName} must contain only Markdown bullet items`);
      return line.slice(2).trim();
    });

  if (!items.length) fail(`${file}: ${sectionName} must not be empty`);
  return items;
}

function parseParagraphs(value, file, sectionName) {
  const paragraphs = value
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  if (!paragraphs.length) fail(`${file}: ${sectionName} must not be empty`);
  return paragraphs;
}

function loadSafetyQuestionIds() {
  const contentFile = path.join(root, 'assets', 'content.js');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(contentFile, 'utf8'), sandbox, { filename: 'assets/content.js' });

  const questions = sandbox.window.PREP_CONTENT?.questions;
  if (!Array.isArray(questions)) fail('assets/content.js: Functional Safety questions not found');
  return new Set(questions.map(question => question.id));
}

function validateMetadata(metadata, file) {
  for (const field of requiredMetadata) {
    if (!Object.hasOwn(metadata, field)) fail(`${file}: missing metadata field ${field}`);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) fail(`${file}: invalid concept id ${metadata.id}`);
  if (metadata.module !== 'safety') fail(`${file}: module must be safety`);
  if (metadata.collection !== 'functional-safety-management') {
    fail(`${file}: collection must be functional-safety-management`);
  }
  if (!Number.isInteger(metadata.order) || metadata.order < 1) fail(`${file}: order must be a positive integer`);
  if (!Number.isInteger(metadata.stage) || metadata.stage < 1 || metadata.stage > 10) {
    fail(`${file}: stage must be an integer from 1 to 10`);
  }
  if (!knownDifficulties.has(metadata.difficulty)) fail(`${file}: invalid difficulty ${metadata.difficulty}`);

  if (
    typeof metadata.standard !== 'object' ||
    metadata.standard === null ||
    metadata.standard.family !== 'ISO 26262' ||
    metadata.standard.edition !== '2018' ||
    !Array.isArray(metadata.standard.parts) ||
    !metadata.standard.parts.length ||
    !Array.isArray(metadata.standard.clauseRefs) ||
    !metadata.standard.clauseRefs.length
  ) {
    fail(`${file}: invalid standard metadata`);
  }

  for (const field of ['systems', 'relatedConcepts', 'linkedQuestions', 'references']) {
    if (!Array.isArray(metadata[field]) || !metadata[field].length) {
      fail(`${file}: ${field} must be a non-empty array`);
    }
  }
}

function buildConcept(filePath, questionIds) {
  const relativeFile = path.relative(root, filePath).split(path.sep).join('/');
  const source = fs.readFileSync(filePath, 'utf8');
  const { metadata, body } = parseFrontMatter(source, relativeFile);
  const sections = parseSections(body, relativeFile);

  validateMetadata(metadata, relativeFile);
  for (const sectionName of requiredSections) {
    if (!sections[sectionName]) fail(`${relativeFile}: missing section ${sectionName}`);
  }

  for (const questionId of metadata.linkedQuestions) {
    if (!questionIds.has(questionId)) fail(`${relativeFile}: linked question ${questionId} does not exist`);
  }

  return {
    id: metadata.id,
    title: metadata.title,
    module: metadata.module,
    collection: metadata.collection,
    order: metadata.order,
    standard: metadata.standard,
    difficulty: metadata.difficulty,
    stage: metadata.stage,
    systems: metadata.systems,
    summary: parseParagraphs(sections.Concept, relativeFile, 'Concept')[0],
    learningObjectives: parseBulletList(sections['Learning objectives'], relativeFile, 'Learning objectives'),
    explanation: parseParagraphs(sections.Concept, relativeFile, 'Concept'),
    whyItMatters: parseParagraphs(sections['Why it matters'], relativeFile, 'Why it matters'),
    inputs: parseBulletList(sections.Inputs, relativeFile, 'Inputs'),
    activities: parseBulletList(sections.Activities, relativeFile, 'Activities'),
    outputs: parseBulletList(sections['Outputs and evidence'], relativeFile, 'Outputs and evidence'),
    automotiveExample: parseParagraphs(sections['Automotive example'], relativeFile, 'Automotive example').join('\n\n'),
    commonMistakes: parseBulletList(sections['Common mistakes'], relativeFile, 'Common mistakes'),
    relatedConcepts: metadata.relatedConcepts,
    linkedQuestions: metadata.linkedQuestions,
    references: metadata.references,
    source: relativeFile
  };
}

function buildModel() {
  if (!fs.existsSync(sourceDirectory)) {
    fail(`Concept source directory not found: ${path.relative(root, sourceDirectory)}`);
  }

  const markdownFiles = fs.readdirSync(sourceDirectory)
    .filter(file => file.endsWith('.md'))
    .sort()
    .map(file => path.join(sourceDirectory, file));

  if (!markdownFiles.length) fail('No FSM concept Markdown files found');

  const questionIds = loadSafetyQuestionIds();
  const concepts = markdownFiles.map(file => buildConcept(file, questionIds));
  const ids = new Set();
  const orders = new Set();

  for (const concept of concepts) {
    if (ids.has(concept.id)) fail(`Duplicate concept id ${concept.id}`);
    if (orders.has(concept.order)) fail(`Duplicate concept order ${concept.order}`);
    ids.add(concept.id);
    orders.add(concept.order);
  }

  for (const concept of concepts) {
    for (const relatedId of concept.relatedConcepts) {
      if (!ids.has(relatedId)) fail(`${concept.id}: related concept ${relatedId} does not exist`);
      if (relatedId === concept.id) fail(`${concept.id}: concept cannot relate to itself`);
    }
  }

  concepts.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));

  return {
    schemaVersion: 1,
    module: 'safety',
    collection: { id: 'functional-safety-management', title: 'Functional Safety Management' },
    standardBaseline: { family: 'ISO 26262', edition: '2018', status: 'published-baseline' },
    generatedFrom: 'content-source/safety/concepts/functional-safety-management',
    concepts
  };
}

const model = buildModel();
const serialized = `${JSON.stringify(model, null, 2)}\n`;

if (checkOnly) {
  if (!fs.existsSync(outputFile)) fail(`${path.relative(root, outputFile)} is missing; run npm run build:concepts`);
  const current = fs.readFileSync(outputFile, 'utf8');
  if (current !== serialized) fail(`${path.relative(root, outputFile)} is stale; run npm run build:concepts`);
  console.log(`FSM concepts: ${model.concepts.length} sources validated; generated JSON is current`);
} else {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, serialized);
  console.log(`FSM concepts: wrote ${model.concepts.length} concepts to ${path.relative(root, outputFile)}`);
}
