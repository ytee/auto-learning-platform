import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = (message) => { throw new Error(message); };

function validateQuestions(topicId, days, tracks, questions) {
  if (!Array.isArray(days) || days.length !== 10) fail(`${topicId}: expected 10 days`);
  if (!Array.isArray(questions) || questions.length !== 100) fail(`${topicId}: expected 100 questions`);

  const dayNumbers = new Set(days.map((d) => d.day));
  const ids = new Set();
  const knownTiers = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);

  for (const q of questions) {
    if (!q.id || ids.has(q.id)) fail(`${topicId}: duplicate or missing question id ${q.id}`);
    ids.add(q.id);
    if (!dayNumbers.has(q.day)) fail(`${topicId}/${q.id}: invalid day ${q.day}`);
    if (!knownTiers.has(q.tier)) fail(`${topicId}/${q.id}: invalid tier ${q.tier}`);
    if (!Number.isFinite(q.minutes) || q.minutes < 1) fail(`${topicId}/${q.id}: invalid minutes`);
    for (const field of ['question', 'kind']) if (!q[field]) fail(`${topicId}/${q.id}: missing ${field}`);
    for (const field of ['tracks', 'answer', 'probes', 'refs']) {
      if (!Array.isArray(q[field]) || q[field].length === 0) fail(`${topicId}/${q.id}: missing ${field}`);
    }
  }

  for (const day of days) {
    const count = questions.filter((q) => q.day === day.day).length;
    if (count !== 10) fail(`${topicId}: day ${day.day} has ${count} questions; expected 10`);
  }

  if (!Array.isArray(tracks) || tracks.length === 0) fail(`${topicId}: missing tracks`);
  console.log(`${topicId}: ${questions.length} questions, ${days.length} days, ${tracks.length} tracks`);
}

function loadLegacy(globalName) {
  const source = fs.readFileSync(path.join(root, 'assets/content.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'assets/content.js' });
  const content = sandbox.window[globalName];
  if (!content) fail(`Legacy global ${globalName} was not created`);
  return content;
}

const manifest = readJson('data/topics.json');
if (!Array.isArray(manifest.topics) || manifest.topics.length < 2) fail('Topic manifest must contain at least Safety and AUTOSAR');

const topicIds = new Set();
for (const topic of manifest.topics) {
  if (!topic.id || topicIds.has(topic.id)) fail(`Duplicate or missing topic id ${topic.id}`);
  topicIds.add(topic.id);

  if (topic.legacyGlobal) {
    const content = loadLegacy(topic.legacyGlobal);
    validateQuestions(topic.id, content.days, content.tracks, content.questions);
    continue;
  }

  if (!topic.content) fail(`${topic.id}: missing metadata content path`);
  const content = readJson(topic.content);
  const questionFiles = topic.questionFiles || [];
  if (questionFiles.length === 0) fail(`${topic.id}: no question files`);
  const questions = questionFiles.flatMap((file) => readJson(file));
  validateQuestions(topic.id, content.days, content.tracks, questions);

  const declaredTracks = new Set(content.tracks.map((t) => t.name));
  const undeclared = [...new Set(questions.flatMap((q) => q.tracks).filter((t) => !declaredTracks.has(t)))];
  if (undeclared.length) fail(`${topic.id}: undeclared tracks: ${undeclared.join(', ')}`);
}

console.log('Content validation passed.');
