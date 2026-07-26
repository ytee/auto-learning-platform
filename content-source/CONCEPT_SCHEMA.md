# AutoLeaP concept authoring schema

AutoLeaP uses Markdown as the canonical source for long-form concept learning. Runtime JSON is generated and validated; it should not be edited manually.

## Source layout

```text
content-source/
└── safety/
    └── concepts/
        └── functional-safety-management/
            ├── overview.md
            ├── safety-culture.md
            ├── safety-plan.md
            ├── confirmation-measures.md
            └── safety-case.md
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

- Use ISO 26262:2018 as the published baseline.
- Write original explanations; do not reproduce normative standard text.
- Use clause and part pointers for navigation, not as a substitute for the licensed standard.
- Explain lifecycle context, engineering intent and practical consequences.
- Prefer concrete brake, ESC or vehicle-platform examples.
- Keep concepts independent from the question wording.
- Link concepts to existing questions for practice and review.
- Do not edit generated JSON manually.

## Learn → Practice → Review

```text
Concept source
    ↓
Generated runtime model
    ↓
Learner studies explanation and example
    ↓
Linked existing checkpoints provide practice
    ↓
Guidance, quiz and architecture exercises support review
```

Concepts are the primary learning material. Existing questions, answers, probes, quizzes and exercises remain the practice and review layer.

## Commands

Generate runtime JSON:

```bash
npm run build:concepts
```

Verify that Markdown and generated JSON are valid and synchronized:

```bash
npm run check:concepts
```

Run all repository validation:

```bash
npm run validate
```

## Validation rules

The concept build fails for:

- missing required metadata or sections;
- duplicate concept IDs or display order;
- unsupported difficulty or invalid stage;
- invalid standard baseline metadata;
- missing related-concept targets;
- self-referencing concepts;
- missing linked Functional Safety question IDs;
- stale generated JSON.
