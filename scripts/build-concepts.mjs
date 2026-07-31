import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const knownDifficulties = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);
const fail = message => { throw new Error(message); };

const collections = [
  {
    module: 'safety',
    collection: 'functional-safety-management',
    title: 'Functional Safety Management',
    sourceDirectory: 'content-source/safety/concepts/functional-safety-management',
    outputFile: 'data/safety/concepts.json',
    baseline: { family: 'ISO 26262', edition: '2018', status: 'published-baseline' },
    expectedCount: 23,
    questionIds() {
      const sandbox = { window: {} };
      vm.createContext(sandbox);
      vm.runInContext(
        fs.readFileSync(path.join(root, 'assets/content.js'), 'utf8'),
        sandbox,
        { filename: 'assets/content.js' }
      );
      const questions = sandbox.window.PREP_CONTENT?.questions;
      if (!Array.isArray(questions)) fail('assets/content.js: Functional Safety questions not found');
      return new Set(questions.map(question => question.id));
    }
  },
  {
    module: 'embedded',
    collection: 'embedded-systems-firmware',
    title: 'Embedded Systems & Firmware',
    sourceJson: 'content-source/embedded-systems/concepts.json',
    outputFile: 'data/embedded/concepts.json',
    baseline: {
      family: 'AutoLeaP Embedded Systems Body of Knowledge',
      edition: '2026',
      status: 'learning-baseline'
    },
    expectedCount: 10,
    questionIds() {
      const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/topics.json'), 'utf8'));
      const topic = manifest.topics.find(item => item.id === 'embedded');
      const questions = topic.questionFiles.flatMap(file =>
        JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
      );
      if (!Array.isArray(questions) || questions.length !== 100) {
        fail('data/embedded: expected 100 exercises across declared question files');
      }
      return new Set(questions.map(question => question.id));
    }
  }
];

const requiredMetadata = [
  'id', 'title', 'module', 'collection', 'order', 'standard',
  'difficulty', 'stage', 'systems', 'relatedConcepts',
  'linkedQuestions', 'references'
];

const requiredSections = [
  'Learning objectives', 'Concept', 'Why it matters', 'Inputs',
  'Activities', 'Outputs and evidence', 'Automotive example', 'Common mistakes'
];

function parseValue(rawValue, file, key) {
  const value = rawValue.trim();
  if (!value) return '';

  if (
    value.startsWith('[') || value.startsWith('{') || value.startsWith('"') ||
    value === 'true' || value === 'false' || value === 'null'
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

  const metadata = {};
  for (const rawLine of text.slice(4, closingMarker).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf(':');
    if (separator === -1) fail(`${file}: invalid front matter line "${rawLine}"`);
    const key = line.slice(0, separator).trim();
    if (!key) fail(`${file}: empty front matter key`);
    if (Object.hasOwn(metadata, key)) fail(`${file}: duplicate front matter key ${key}`);
    metadata[key] = parseValue(line.slice(separator + 1), file, key);
  }
  return { metadata, body: text.slice(closingMarker + 5) };
}

function parseSections(body, file) {
  const sections = {};
  let heading = null;
  let lines = [];

  const flush = () => {
    if (!heading) return;
    if (Object.hasOwn(sections, heading)) fail(`${file}: duplicate section ${heading}`);
    sections[heading] = lines.join('\n').trim();
  };

  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^##\s+(.+?)\s*$/);
    if (match) {
      flush();
      heading = match[1];
      lines = [];
    } else if (heading) {
      lines.push(line);
    }
  }
  flush();
  return sections;
}

function parseBulletList(value, file, section) {
  const items = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    if (!line.startsWith('- ')) fail(`${file}: ${section} must contain only Markdown bullets`);
    return line.slice(2).trim();
  });
  if (!items.length) fail(`${file}: ${section} must not be empty`);
  return items;
}

function parseParagraphs(value, file, section) {
  const paragraphs = value
    .split(/\n\s*\n/)
    .map(item => item.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
  if (!paragraphs.length) fail(`${file}: ${section} must not be empty`);
  return paragraphs;
}

function validateMetadata(metadata, file, config) {
  for (const field of requiredMetadata) {
    if (!Object.hasOwn(metadata, field)) fail(`${file}: missing metadata field ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) fail(`${file}: invalid concept id ${metadata.id}`);
  if (metadata.module !== config.module) fail(`${file}: module must be ${config.module}`);
  if (metadata.collection !== config.collection) fail(`${file}: collection must be ${config.collection}`);
  if (!Number.isInteger(metadata.order) || metadata.order < 1) fail(`${file}: order must be positive`);
  if (!Number.isInteger(metadata.stage) || metadata.stage < 1 || metadata.stage > 10) {
    fail(`${file}: stage must be from 1 to 10`);
  }
  if (!knownDifficulties.has(metadata.difficulty)) fail(`${file}: invalid difficulty ${metadata.difficulty}`);

  const standard = metadata.standard;
  if (
    !standard || typeof standard !== 'object' ||
    typeof standard.family !== 'string' || !standard.family ||
    typeof standard.edition !== 'string' || !standard.edition ||
    !Array.isArray(standard.parts) || !standard.parts.length ||
    !Array.isArray(standard.clauseRefs) || !standard.clauseRefs.length
  ) {
    fail(`${file}: invalid standard metadata`);
  }

  for (const field of ['systems', 'relatedConcepts', 'linkedQuestions', 'references']) {
    if (!Array.isArray(metadata[field]) || !metadata[field].length) {
      fail(`${file}: ${field} must be a non-empty array`);
    }
  }
}

function buildConcept(filePath, config, questionIds) {
  const relativeFile = path.relative(root, filePath).split(path.sep).join('/');
  const { metadata, body } = parseFrontMatter(fs.readFileSync(filePath, 'utf8'), relativeFile);
  const sections = parseSections(body, relativeFile);
  validateMetadata(metadata, relativeFile, config);

  for (const section of requiredSections) {
    if (!sections[section]) fail(`${relativeFile}: missing section ${section}`);
  }
  for (const questionId of metadata.linkedQuestions) {
    if (!questionIds.has(questionId)) fail(`${relativeFile}: linked question ${questionId} does not exist`);
  }

  const explanation = parseParagraphs(sections.Concept, relativeFile, 'Concept');
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
    summary: explanation[0],
    learningObjectives: parseBulletList(sections['Learning objectives'], relativeFile, 'Learning objectives'),
    explanation,
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

function buildCollection(config) {
  if (config.sourceJson) {
    const sourcePath = path.join(root, config.sourceJson);
    if (!fs.existsSync(sourcePath)) fail(`Concept source file not found: ${config.sourceJson}`);
    const model = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const questionIds = config.questionIds();
    if (model.module !== config.module || model.collection?.id !== config.collection) {
      fail(`${config.sourceJson}: module or collection mismatch`);
    }
    if (!Array.isArray(model.concepts) || model.concepts.length !== config.expectedCount) {
      fail(`${config.sourceJson}: expected ${config.expectedCount} concepts`);
    }
    const ids = new Set(model.concepts.map(concept => concept.id));
    const orders = new Set();
    for (const concept of model.concepts) {
      if (!concept.id || concept.module !== config.module) fail(`${config.sourceJson}: invalid concept identity`);
      if (orders.has(concept.order)) fail(`${config.sourceJson}: duplicate concept order ${concept.order}`);
      orders.add(concept.order);
      for (const relatedId of concept.relatedConcepts || []) {
        if (!ids.has(relatedId)) fail(`${concept.id}: related concept ${relatedId} does not exist`);
      }
      for (const questionId of concept.linkedQuestions || []) {
        if (!questionIds.has(questionId)) fail(`${concept.id}: linked question ${questionId} does not exist`);
      }
    }
    model.generatedFrom = config.sourceJson;
    const output = path.join(root, config.outputFile);
    const serialized = `${JSON.stringify(model, null, 2)}\n`;
    if (checkOnly) {
      if (!fs.existsSync(output)) fail(`${config.outputFile} is missing; run npm run build:concepts`);
      if (fs.readFileSync(output, 'utf8') !== serialized) fail(`${config.outputFile} is stale; run npm run build:concepts`);
      console.log(`${config.module}: ${model.concepts.length} JSON-authored concepts validated; generated JSON is current`);
    } else {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, serialized);
      console.log(`${config.module}: wrote ${model.concepts.length} concepts to ${config.outputFile}`);
    }
    return;
  }

  const sourceDirectory = path.join(root, config.sourceDirectory);
  if (!fs.existsSync(sourceDirectory)) fail(`Concept source directory not found: ${config.sourceDirectory}`);

  const candidateFiles = fs.readdirSync(sourceDirectory)
    .filter(file => file.endsWith('.md'))
    .sort()
    .map(file => path.join(sourceDirectory, file));

  const files = candidateFiles.filter(file => {
    const relativeFile = path.relative(root, file).split(path.sep).join('/');
    const { metadata } = parseFrontMatter(fs.readFileSync(file, 'utf8'), relativeFile);
    return metadata.module === config.module && metadata.collection === config.collection;
  });

  if (files.length !== config.expectedCount) {
    fail(
      `${config.module}/${config.collection}: expected ${config.expectedCount} concept sources; ` +
      `found ${files.length} among ${candidateFiles.length} Markdown files`
    );
  }

  const questionIds = config.questionIds();
  const concepts = files.map(file => buildConcept(file, config, questionIds));
  const ids = new Set();
  const orders = new Set();

  for (const concept of concepts) {
    if (ids.has(concept.id)) fail(`${config.module}: duplicate concept id ${concept.id}`);
    if (orders.has(concept.order)) fail(`${config.module}: duplicate concept order ${concept.order}`);
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
  const model = {
    schemaVersion: 1,
    module: config.module,
    collection: { id: config.collection, title: config.title },
    standardBaseline: config.baseline,
    generatedFrom: config.sourceDirectory,
    concepts
  };

  const output = path.join(root, config.outputFile);
  const serialized = `${JSON.stringify(model, null, 2)}\n`;
  if (checkOnly) {
    if (!fs.existsSync(output)) fail(`${config.outputFile} is missing; run npm run build:concepts`);
    if (fs.readFileSync(output, 'utf8') !== serialized) {
      fail(`${config.outputFile} is stale; run npm run build:concepts`);
    }
    console.log(`${config.module}: ${concepts.length} concepts validated; generated JSON is current`);
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, serialized);
    console.log(`${config.module}: wrote ${concepts.length} concepts to ${config.outputFile}`);
  }
}

collections.forEach(buildCollection);
