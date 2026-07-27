import fs from 'node:fs';
import path from 'node:path';

const [, , inputArgument, outputArgument] = process.argv;
const fail = message => { throw new Error(message); };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const idPattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const difficulties = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);

if (!inputArgument) {
  fail('Usage: npm run render:concept -- <concept-authoring.json> [output.md]');
}

const inputFile = path.resolve(inputArgument);
const document = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

function nonEmptyString(value, field) {
  if (typeof value !== 'string' || !value.trim()) fail(`${field} must be a non-empty string`);
  if (/[\r\n]/.test(value)) fail(`${field} must not contain line breaks`);
  return value.trim();
}

function stringArray(value, field, { pattern = null } = {}) {
  if (!Array.isArray(value) || value.length === 0) fail(`${field} must be a non-empty array`);
  const normalized = value.map((item, index) => {
    const text = nonEmptyString(item, `${field}[${index}]`);
    if (pattern && !pattern.test(text)) fail(`${field}[${index}] has an invalid value`);
    return text;
  });
  if (new Set(normalized).size !== normalized.length) fail(`${field} must not contain duplicates`);
  return normalized;
}

function validate(documentValue) {
  if (!documentValue || typeof documentValue !== 'object' || Array.isArray(documentValue)) {
    fail('Concept authoring document must be an object');
  }
  if (documentValue.schemaVersion !== 1) fail('schemaVersion must be 1');
  if (documentValue.contentType !== 'concept') fail('contentType must be concept');

  const metadata = documentValue.metadata;
  const sections = documentValue.sections;
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) fail('metadata must be an object');
  if (!sections || typeof sections !== 'object' || Array.isArray(sections)) fail('sections must be an object');

  const id = nonEmptyString(metadata.id, 'metadata.id');
  const module = nonEmptyString(metadata.module, 'metadata.module');
  const collection = nonEmptyString(metadata.collection, 'metadata.collection');
  if (!slugPattern.test(id)) fail('metadata.id must be a lowercase hyphenated slug');
  if (!slugPattern.test(module)) fail('metadata.module must be a lowercase hyphenated slug');
  if (!slugPattern.test(collection)) fail('metadata.collection must be a lowercase hyphenated slug');
  nonEmptyString(metadata.title, 'metadata.title');

  if (!Number.isInteger(metadata.order) || metadata.order < 1) fail('metadata.order must be a positive integer');
  if (!Number.isInteger(metadata.stage) || metadata.stage < 1 || metadata.stage > 10) {
    fail('metadata.stage must be an integer from 1 to 10');
  }
  if (!difficulties.has(metadata.difficulty)) fail('metadata.difficulty is unsupported');

  const standard = metadata.standard;
  if (!standard || typeof standard !== 'object' || Array.isArray(standard)) fail('metadata.standard must be an object');
  nonEmptyString(standard.family, 'metadata.standard.family');
  nonEmptyString(standard.edition, 'metadata.standard.edition');
  stringArray(standard.parts, 'metadata.standard.parts', { pattern: /^\d+$/ });
  stringArray(standard.clauseRefs, 'metadata.standard.clauseRefs');

  stringArray(metadata.systems, 'metadata.systems');
  stringArray(metadata.relatedConcepts, 'metadata.relatedConcepts', { pattern: slugPattern });
  stringArray(metadata.linkedQuestions, 'metadata.linkedQuestions', { pattern: idPattern });
  stringArray(metadata.references, 'metadata.references');

  stringArray(sections.learningObjectives, 'sections.learningObjectives');
  stringArray(sections.concept, 'sections.concept');
  stringArray(sections.whyItMatters, 'sections.whyItMatters');
  stringArray(sections.inputs, 'sections.inputs');
  stringArray(sections.activities, 'sections.activities');
  stringArray(sections.outputsAndEvidence, 'sections.outputsAndEvidence');
  stringArray(sections.automotiveExample, 'sections.automotiveExample');
  stringArray(sections.commonMistakes, 'sections.commonMistakes');
}

const bullets = items => items.map(item => `- ${item}`).join('\n');
const paragraphs = items => items.join('\n\n');
const inlineJson = value => JSON.stringify(value);

function render(documentValue) {
  const { metadata, sections } = documentValue;
  return `---
id: ${metadata.id}
title: ${metadata.title}
module: ${metadata.module}
collection: ${metadata.collection}
order: ${metadata.order}
standard: ${inlineJson(metadata.standard)}
difficulty: ${metadata.difficulty}
stage: ${metadata.stage}
systems: ${inlineJson(metadata.systems)}
relatedConcepts: ${inlineJson(metadata.relatedConcepts)}
linkedQuestions: ${inlineJson(metadata.linkedQuestions)}
references: ${inlineJson(metadata.references)}
---

## Learning objectives

${bullets(sections.learningObjectives)}

## Concept

${paragraphs(sections.concept)}

## Why it matters

${paragraphs(sections.whyItMatters)}

## Inputs

${bullets(sections.inputs)}

## Activities

${bullets(sections.activities)}

## Outputs and evidence

${bullets(sections.outputsAndEvidence)}

## Automotive example

${paragraphs(sections.automotiveExample)}

## Common mistakes

${bullets(sections.commonMistakes)}
`;
}

validate(document);
const markdown = render(document);

if (outputArgument) {
  const outputFile = path.resolve(outputArgument);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, markdown);
  console.log(`Rendered ${document.metadata.id} to ${path.relative(process.cwd(), outputFile)}`);
} else {
  process.stdout.write(markdown);
}
