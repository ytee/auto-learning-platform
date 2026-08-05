import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets', 'navigation.js'), 'utf8');
const fail = message => { throw new Error(message); };

new vm.Script(source, { filename: 'assets/navigation.js' });

for (const hook of [
  'conceptSelectorRecords',
  'conceptSelectorSignature',
  'rebuildConceptOptions',
  'clickConceptById',
  'selectionSettling',
  'select.blur()',
  'select.disabled = true',
  'select.disabled = false',
  'optionSignature'
]) {
  if (!source.includes(hook)) fail(`assets/navigation.js: missing selector-stability hook ${hook}`);
}

if (source.includes("new MutationObserver(queueConceptSync).observe($('#conceptNav'), { childList: true, subtree: true, attributes:")) {
  fail('assets/navigation.js: concept observer must not watch class attributes');
}
if (!source.includes("new MutationObserver(queueConceptSync).observe($('#conceptNav'), { childList: true, subtree: true });")) {
  fail('assets/navigation.js: concept observer must watch child-list changes only');
}
if (source.includes("<option value=\"${index}\">")) {
  fail('assets/navigation.js: concept selector must use stable concept IDs, not array indexes');
}

const changeListenerStart = source.indexOf("$('#simpleConceptSelect').addEventListener('change'");
const changeListenerEnd = source.indexOf("controls.querySelectorAll('[data-concept-step]')", changeListenerStart);
if (changeListenerStart < 0 || changeListenerEnd < 0) fail('Concept selector change listener was not found');
const changeListener = source.slice(changeListenerStart, changeListenerEnd);

const blurPosition = changeListener.indexOf('select.blur()');
const disablePosition = changeListener.indexOf('select.disabled = true');
const framePosition = changeListener.indexOf('requestAnimationFrame');
const selectionPosition = changeListener.indexOf('clickConceptById(conceptId)');
if (
  blurPosition < 0 ||
  disablePosition < blurPosition ||
  framePosition < disablePosition ||
  selectionPosition < framePosition
) {
  fail('Concept selection must blur and suspend the native select before rendering the selected concept');
}

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) fail(`Cannot find function ${name}`);
  const openingBrace = source.indexOf('{', start);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = openingBrace; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  fail(`Cannot extract function ${name}`);
}

const sandbox = {
  document: {
    createElement(tagName) {
      if (tagName !== 'option') throw new Error(`Unexpected element ${tagName}`);
      return { value: '', textContent: '' };
    }
  }
};

vm.runInNewContext(
  `${extractFunction('conceptSelectorSignature')}\n${extractFunction('rebuildConceptOptions')}\n` +
  'globalThis.testApi = { rebuildConceptOptions };',
  sandbox,
  { filename: 'concept-selector-functions.js' }
);

const select = {
  dataset: {},
  replacements: 0,
  options: [],
  replaceChildren(...options) {
    this.replacements += 1;
    this.options = options;
  }
};
const records = [
  { id: 'fsm-overview', title: 'Functional Safety Management', meta: 'Foundation · Stage 1' },
  { id: 'fsm-safety-plan', title: 'Functional Safety Plan', meta: 'Intermediate · Stage 2' }
];

if (!sandbox.testApi.rebuildConceptOptions(select, records)) fail('First selector build must replace options');
if (sandbox.testApi.rebuildConceptOptions(select, records)) fail('Identical selector records must not replace options again');
if (select.replacements !== 1) fail(`Expected one option replacement; observed ${select.replacements}`);
if (select.options.map(option => option.value).join(',') !== 'fsm-overview,fsm-safety-plan') {
  fail('Concept option values must be stable concept IDs');
}

const changedRecords = [...records, { id: 'fsm-assessment', title: 'Functional Safety Assessment', meta: 'Advanced · Stage 10' }];
if (!sandbox.testApi.rebuildConceptOptions(select, changedRecords)) fail('Changed concept collection must replace options');
if (select.replacements !== 2) fail('Changed collection must cause exactly one additional replacement');

console.log('Concept selector validation passed: blur-before-render ordering, stable IDs and idempotent option rebuilding.');
