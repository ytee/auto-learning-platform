import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

new vm.Script(readText('assets/home.js'), { filename: 'assets/home.js' });

const indexHtml = readText('index.html');
const requiredHooks = [
  'assets/home.css',
  'assets/home.js',
  'id="view-home"',
  'id="continueLearning"',
  'id="learningPathCards"',
  'id="conceptCards"',
  'id="caseStudyCards"',
  'id="scenarioCards"',
  'id="playbookCards"',
  'id="roadmapCards"',
  'data-open-home',
  'data-home-section="learning-paths"',
  'id="workspaceFooter"'
];

for (const hook of requiredHooks) {
  if (!indexHtml.includes(hook)) fail(`index.html: missing discovery-home hook ${hook}`);
}

const navigationPosition = indexHtml.indexOf('assets/navigation.js');
const homePosition = indexHtml.indexOf('assets/home.js');
if (navigationPosition === -1 || homePosition < navigationPosition) {
  fail('index.html: home.js must load after navigation.js');
}

const manifest = readJson('data/topics.json');
const catalog = readJson('data/home.json');
const topicIds = new Set(manifest.topics.map(topic => topic.id));
const conceptIdsByModule = new Map();

for (const topic of manifest.topics) {
  if (!topic.concepts) continue;
  const model = readJson(topic.concepts);
  conceptIdsByModule.set(topic.id, new Set(model.concepts.map(concept => concept.id)));
}

const sectionNames = ['concepts', 'caseStudies', 'scenarios', 'playbooks', 'roadmaps'];
for (const sectionName of sectionNames) {
  const cards = catalog[sectionName];
  if (!Array.isArray(cards) || cards.length < 3 || cards.length > 6) {
    fail(`data/home.json: ${sectionName} must contain 3–6 cards`);
  }

  for (const card of cards) {
    if (!topicIds.has(card.module)) {
      fail(`data/home.json/${sectionName}/${card.title}: unknown module ${card.module}`);
    }
    if (card.area === 'concepts') {
      const conceptIds = conceptIdsByModule.get(card.module);
      if (!conceptIds) {
        fail(`data/home.json/${sectionName}/${card.title}: module has no concept collection`);
      }
      if (!card.concept || !conceptIds.has(card.concept)) {
        fail(`data/home.json/${sectionName}/${card.title}: unresolved concept ${card.concept || '(missing)'}`);
      }
      if (card.view || card.stage) {
        fail(`data/home.json/${sectionName}/${card.title}: concept cards cannot declare exercise view or stage`);
      }
    } else if (card.area === 'exercises') {
      if (card.concept) {
        fail(`data/home.json/${sectionName}/${card.title}: exercise cards cannot declare a concept`);
      }
      if (!card.view) {
        fail(`data/home.json/${sectionName}/${card.title}: exercise cards require a view`);
      }
      if (card.view === 'route' && (!Number.isInteger(card.stage) || card.stage < 1 || card.stage > 10)) {
        fail(`data/home.json/${sectionName}/${card.title}: route cards require stage 1–10`);
      }
    } else {
      fail(`data/home.json/${sectionName}/${card.title}: invalid area ${card.area}`);
    }
  }
}

const homeScript = readText('assets/home.js');
for (const behavior of [
  'autoNotesNvM:',
  'Continue learning',
  'data-home-target',
  'showHome',
  'showWorkspace',
  'simpleTopicSelect',
  'simpleStageSelect',
  'data-simple-area'
]) {
  if (!homeScript.includes(behavior)) fail(`assets/home.js: missing behavior ${behavior}`);
}

const navigationScript = readText('assets/navigation.js');
if (!navigationScript.includes('go-to-top') || !navigationScript.includes('Go to top')) {
  fail('assets/navigation.js: floating Go to Top control must remain available');
}

console.log(
  `Discovery home validation passed: ${manifest.topics.length} learning paths and ` +
  `${sectionNames.reduce((count, name) => count + catalog[name].length, 0)} curated cards.`
);
