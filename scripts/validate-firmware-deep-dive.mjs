import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const fail = message => { throw new Error(message); };

const topicFiles = Array.from({ length: 6 }, (_, index) => `assets/firmware-deep-dive-topics-${index + 1}.js`);
const modelSource = read('assets/firmware-deep-dive-model.js');
const rendererSource = read('assets/firmware-deep-dive.js');
const styles = read('assets/firmware-deep-dive.css');
const domainLabels = read('assets/domain-labels.js');
const navigation = read('assets/navigation.js');

new vm.Script(modelSource, { filename: 'assets/firmware-deep-dive-model.js' });
new vm.Script(rendererSource, { filename: 'assets/firmware-deep-dive.js' });
for (const file of topicFiles) new vm.Script(read(file), { filename: file });

const sandbox = {};
vm.createContext(sandbox);
for (const file of topicFiles) vm.runInContext(read(file), sandbox, { filename: file });
vm.runInContext(modelSource, sandbox, { filename: 'assets/firmware-deep-dive-model.js' });

const topics = sandbox.AUTOLEAP_FDD_TOPICS;
const model = sandbox.AUTOLEAP_FDD_MODEL;
if (!Array.isArray(topics) || topics.length !== 25) fail(`Expected 25 firmware deep-dive topics; found ${topics?.length}`);
if (!model) fail('Firmware deep-dive model did not initialize');

const ids = new Set();
const requiredTopicFields = ['id','title','group','summary','principles','failure','design','tradeoff','evidence','keywords'];
for (const topic of topics) {
  if (!topic.id || ids.has(topic.id)) fail(`Duplicate or missing topic id ${topic.id}`);
  ids.add(topic.id);
  for (const field of requiredTopicFields) {
    if (!topic[field] || (Array.isArray(topic[field]) && topic[field].length === 0)) {
      fail(`${topic.id}: missing ${field}`);
    }
  }
  if (topic.principles.length < 4) fail(`${topic.id}: expected at least four principles`);
  if (topic.evidence.length < 4) fail(`${topic.id}: expected at least four evidence items`);
}

const corpus = JSON.stringify(topics).toLowerCase();
const requiredTerms = [
  'i2c','uart','can','spi','dma','semaphore','mutex','volatile','rtos','race condition',
  'bit masking','stack','heap','process','thread','smart pointers','linked list','const','static',
  'deadlock','ethernet','tcp/ip','logic analyzer','oscilloscope','multimeter','adc','pwm',
  'cortex-m23','cortex-m33','cortex-m4','cortex-m7','aurix tc3xx','tricore','dsp',
  'bare-metal','embedded linux','autosar mcal','secure boot','firmware upgrade'
];
for (const term of requiredTerms) {
  if (!corpus.includes(term)) fail(`Firmware deep dive is missing requested coverage: ${term}`);
}

if (!Array.isArray(model.checklist) || model.checklist.length !== 40) {
  fail(`Expected 40 interview checklist items; found ${model.checklist?.length}`);
}
for (const [, , topicId] of model.checklist) {
  if (!ids.has(topicId)) fail(`Checklist links to unknown topic ${topicId}`);
}

for (const moduleName of ['Mcu','Port','Dio','Gpt','Icu','Adc','Pwm','Spi','Can']) {
  if (!model.mcal.some(row => row[0] === moduleName)) fail(`MCAL map is missing ${moduleName}`);
}
if (model.platforms.length !== 5) fail('Platform comparison must contain M23, M33, M4, M7 and AURIX');
if (model.architectures.length !== 4) fail('Architecture comparison must contain bare-metal, RTOS, Linux and hybrid');
if (model.tools.length !== 4) fail('Equipment comparison must contain multimeter, oscilloscope, logic analyzer and debug trace');

const questions = model.buildQuestions(topics);
if (!Array.isArray(questions) || questions.length !== 125) fail(`Expected 125 questions; found ${questions?.length}`);
const questionIds = new Set();
for (const question of questions) {
  if (!question.id || questionIds.has(question.id)) fail(`Duplicate question id ${question.id}`);
  questionIds.add(question.id);
  if (!ids.has(question.topicId)) fail(`${question.id}: unknown topic ${question.topicId}`);
  if (!['Advanced','Expert'].includes(question.tier)) fail(`${question.id}: question is not advanced/expert`);
  if (!Array.isArray(question.answer) || question.answer.length < 4) fail(`${question.id}: weak answer framework`);
  if (!Array.isArray(question.probes) || question.probes.length < 3) fail(`${question.id}: missing probes`);
}

for (const hook of [
  'view-firmware-deep-dive','firmwareDeepDiveContent','Firmware Deep Dive','AUTOLEAP_FDD_TOPICS',
  'AUTOLEAP_FDD_MODEL','autoleap:embedded-interview-checklist:v1','data-open-firmware-deep-dive',
  'data-fdd-section','data-fdd-check','data-fdd-note','view=firmware-deep-dive','LinkedIn post'
]) {
  if (!rendererSource.includes(hook)) fail(`firmware-deep-dive.js: missing ${hook}`);
}
if (rendererSource.includes('MutationObserver')) fail('Firmware Deep Dive must not introduce a MutationObserver');
if (!rendererSource.includes('select.blur()')) fail('Firmware Deep Dive native selectors must close before rerendering');

for (const style of ['.fdd-hero','.fdd-nav','.fdd-panel','.fdd-checks','.fdd-table']) {
  if (!styles.includes(style)) fail(`firmware-deep-dive.css: missing ${style}`);
}

for (const loader of ['assets/firmware-deep-dive-model.js','assets/firmware-deep-dive.js']) {
  if (!domainLabels.includes(loader)) fail(`domain-labels.js must load ${loader}`);
}
for (const selectorGuard of ['conceptSelectorSignature','rebuildConceptOptions','select.blur()']) {
  if (!navigation.includes(selectorGuard)) fail(`Concept-selector regression safeguard lost: ${selectorGuard}`);
}
for (const mutationGuard of ['setTextIfChanged','scheduleDomainLabels']) {
  if (!domainLabels.includes(mutationGuard)) fail(`Domain-label mutation safeguard lost: ${mutationGuard}`);
}

console.log(`Firmware Deep Dive validation passed: ${topics.length} topics, ${questions.length} advanced/expert questions and ${model.checklist.length} checklist items.`);
