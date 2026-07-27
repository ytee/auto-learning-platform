# AutoLeaP concept authoring schema

AutoLeaP uses Markdown as the canonical source for long-form concept learning. Runtime JSON is generated and validated; it should not be edited manually.

## Versioned machine-readable contract

The formal generation contracts are version-controlled under:

```text
schemas/v1/
├── concept-authoring.schema.json
├── concept.schema.json
└── concept-collection.schema.json
```

Generate structured concept JSON using `concept-authoring.schema.json`, then render it into canonical Markdown:

```bash
npm run render:concept -- generated-concept.json path/to/concept.md
```

See `schemas/README.md` for the compatibility policy, examples and generation instructions.

## Source layout

```text
content-source/
└── safety/
    └── concepts/
        └── functional-safety-management/
            └── *.md
```

Generated output:

```text
data/safety/concepts.json
```

## Front matter

Each file begins with constrained YAML-style front matter. Arrays and objects use valid inline JSON so the repository does not require a YAML dependency.

```yaml
---
id: fsm-safety-plan
title: Safety Plan
module: safety
collection: functional-safety-management
order: 3
standard: {"family":"ISO 26262","edition":"2018","parts":["2","8"],"clauseRefs":["ISO 26262-2","ISO 26262-8"]}
difficulty: Foundation
stage: 1
systems: ["FSM","Planning","Supplier"]
relatedConcepts: ["fsm-overview","fsm-confirmation-measures"]
linkedQuestions: ["D1Q2","D4Q5","D4Q6"]
references: ["ISO 26262-2:2018","ISO 26262-8:2018"]
---
```

## Required sections

Every concept must contain these level-two Markdown headings:

```text
## Learning objectives
## Concept
## Why it matters
## Inputs
## Activities
## Outputs and evidence
## Automotive example
## Common mistakes
```

`Learning objectives`, `Inputs`, `Activities`, `Outputs and evidence`, and `Common mistakes` are bullet lists. The other sections are prose paragraphs.

## Authoring principles

- Use the declared standard edition as the baseline.
- Write original explanations; do not reproduce normative standard text.
- Use clause and part pointers for navigation, not as a substitute for licensed standards.
- Explain lifecycle context, engineering intent and practical consequences.
- Prefer concrete vehicle, ECU or platform examples.
- Keep concepts independent from the linked exercise wording.
- Link concepts to existing exercises for practice and review.
- Do not edit generated runtime JSON manually.

## Commands

Render generated authoring JSON:

```bash
npm run render:concept -- input.json output.md
```

Generate runtime JSON:

```bash
npm run build:concepts
```

Verify Markdown and generated JSON:

```bash
npm run check:concepts
```

Validate schemas and current content:

```bash
npm run validate:schemas
npm run validate
```

## Repository semantic rules

The concept build additionally rejects:

- missing required metadata or sections;
- duplicate concept IDs or display order;
- unsupported difficulty or invalid stage;
- invalid standard baseline metadata;
- missing related-concept targets;
- self-referencing concepts;
- missing linked exercise IDs;
- stale generated JSON.
