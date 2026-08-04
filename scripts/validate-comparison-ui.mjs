import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

for (const file of [
  'assets/comparison.js',
  'assets/comparison-bootstrap.js',
  'assets/domain-labels.js'
]) {
  new vm.Script(readText(file), { filename: file });
}

const model = readJson('data/comparisons/aerospace-vs-automotive-safety.json');
const schema = readJson('schemas/v1/safety-domain-comparison.schema.json');

if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
  fail('Comparison schema must use JSON Schema Draft 2020-12');
}
if (!schema.$id?.includes('/schemas/v1/')) fail('Comparison schema must have a versioned v1 $id');
if (model.schemaVersion !== 1) fail('Comparison content must use schemaVersion 1');
if (model.id !== 'aerospace-vs-automotive-safety') fail('Unexpected comparison id');
if (!/^\d{4}-\d{2}-\d{2}$/.test(model.verifiedOn)) fail('Comparison verifiedOn must be YYYY-MM-DD');

const expectedCounts = {
  sharedPrinciples: 8,
  differences: 8,
  mappings: 9
};
for (const [field, minimum] of Object.entries(expectedCounts)) {
  if (!Array.isArray(model[field]) || model[field].length < minimum) {
    fail(`Comparison ${field} must contain at least ${minimum} entries`);
  }
}

for (const field of ['shared', 'automotiveSpecific', 'aerospaceSpecific']) {
  if (!Array.isArray(model.transfer?.[field]) || model.transfer[field].length < 3) {
    fail(`Comparison transfer.${field} must contain at least three entries`);
  }
}
for (const field of ['sharedFoundation', 'automotiveBranch', 'aerospaceBranch']) {
  if (!Array.isArray(model.learningRoute?.[field]) || model.learningRoute[field].length < 3) {
    fail(`Comparison learningRoute.${field} must contain at least three entries`);
  }
}

const mappingText = JSON.stringify(model.mappings);
for (const warning of ['ASIL D', 'DAL A', 'not equivalent', 'not interchangeable']) {
  if (!mappingText.toLowerCase().includes(warning.toLowerCase())) {
    fail(`Comparison mapping must preserve the warning: ${warning}`);
  }
}

const referenceHosts = new Set(model.references.map(reference => new URL(reference.url).hostname));
for (const host of ['www.faa.gov', 'saemobilus.sae.org', 'www.iso.org']) {
  if (!referenceHosts.has(host)) fail(`Comparison references must include official source ${host}`);
}

const bootstrap = readText('assets/comparison-bootstrap.js');
for (const hook of [
  'assets/comparison.css',
  'assets/comparison.js',
  'view-comparison',
  'comparisonContent',
  'data-open-comparison',
  'caseStudyCards',
  'AUTOLEAP_COMPARISON_LOADER'
]) {
  if (!bootstrap.includes(hook)) fail(`comparison-bootstrap.js: missing ${hook}`);
}
if (bootstrap.includes('MutationObserver')) {
  fail('comparison-bootstrap.js must not use a MutationObserver for home-card integration');
}

const renderer = readText('assets/comparison.js');
for (const hook of [
  'WHERE THEY AGREE',
  'WHERE THEY DIFFER',
  'Useful analogies, not equivalences',
  'ENGINE-CONTROL EXAMPLE',
  'Official references',
  'view=comparison',
  'AUTOLEAP_COMPARISON'
]) {
  if (!renderer.includes(hook)) fail(`comparison.js: missing ${hook}`);
}

const domainLabels = readText('assets/domain-labels.js');
if (!domainLabels.includes('assets/comparison-bootstrap.js')) {
  fail('domain-labels.js must load the comparison bootstrap from the existing site shell');
}
for (const regressionHook of ['setTextIfChanged', 'scheduleDomainLabels']) {
  if (!domainLabels.includes(regressionHook)) {
    fail(`domain-labels.js lost mutation-loop regression hook ${regressionHook}`);
  }
}

console.log(
  `Safety-domain comparison validation passed: ${model.sharedPrinciples.length} shared principles, ` +
  `${model.differences.length} differences, ${model.mappings.length} mappings and ${model.references.length} official references.`
);
