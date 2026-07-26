# Automotive Learning Platform (AutoLeaP)

**AutoLeaP** is a modular, static learning platform for advanced automotive engineering topics.

Current learning modules:

- **Functional Safety**
- **AUTOSAR Classic Platform**

The platform combines concept learning, technical checkpoints, deeper-dive prompts, architecture exercises, knowledge validation, confidence tracking and browser-retained progress.

## Learning model

AutoLeaP follows a **Learn → Practice → Review** flow:

```text
Concept explanation
      ↓
Automotive example and common mistakes
      ↓
Linked existing technical checkpoints
      ↓
Guidance and deeper-dive prompts
      ↓
Knowledge validation and architecture exercises
```

The layers have distinct purposes:

| Layer | Purpose |
|---|---|
| Concepts | Primary explanations, context, examples and relationships |
| Questions | Practice and active recollection |
| Answers | Review guidance and key learning points |
| Probes | Deeper-dive review prompts |
| Quizzes | Knowledge validation |
| Architecture exercises | Applied system-level learning |

Existing questions, answers, quizzes, scenarios and exercises remain intact. Concepts are added alongside them and link to relevant checkpoints for practice.

## Functional Safety Management concept pilot

The first concept collection covers Functional Safety Management using **ISO 26262:2018** as the published baseline.

Pilot concepts:

1. Functional Safety Management Overview
2. Safety Culture
3. Safety Plan
4. Confirmation Measures
5. Safety Case

Each concept contains:

- learning objectives;
- original explanatory material;
- why the topic matters;
- inputs, activities and outputs/evidence;
- an automotive example;
- common mistakes;
- related concepts;
- linked existing questions;
- standard and reference pointers.

The concept material does not reproduce ISO normative text. Licensed standards remain authoritative.

## Concept authoring

Markdown is the canonical source:

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

The build generates the runtime model at:

```text
data/safety/concepts.json
```

Authoring details and the required schema are documented in:

```text
content-source/CONCEPT_SCHEMA.md
```

Generate concepts:

```bash
npm run build:concepts
```

Check that a previously generated file is synchronized:

```bash
npm run check:concepts
```

Run the complete repository validation:

```bash
npm run validate
```

`npm run validate` regenerates the runtime concept JSON before validating all learning content. Netlify uses the same command, so the generated concept model is included in the deployed static site.

## Concept validation

The concept pipeline checks:

- required front-matter fields;
- required Markdown sections;
- ISO 26262:2018 baseline metadata;
- supported difficulty and stage values;
- duplicate concept IDs and display order;
- related-concept references;
- links to existing Functional Safety question IDs;
- deterministic generated JSON;
- required runtime fields;
- learning-oriented user-facing terminology.

## Current learning modules

### Functional Safety

100 checkpoints across 10 stages covering:

- ISO 26262 lifecycle and Functional Safety Management;
- item definition, HARA, safety goals, FSC and TSC;
- SysML, MBSE and system safety architecture;
- requirements, traceability and supplier interfaces;
- FMEA, FTA, DFA and ASIL decomposition;
- random hardware failures and hardware metrics;
- software safety architecture and verification;
- brakes, ESC and vehicle-control safety;
- CAN, diagnostics, production, service and validation;
- safety case, architecture trade-offs and release decisions.

### AUTOSAR Classic Platform

100 checkpoints across 10 stages covering:

- Classic and Adaptive platform concepts;
- VFB, software components, ports and interfaces;
- system design, ECU allocation and communication mapping;
- ARXML, ECU Extract, ECU Configuration and generation workflow;
- BSW, MCAL, ECU abstraction and Complex Drivers;
- COM, PduR, CanIf, CanDrv, CanTp, CanSM, ComM, Nm and E2E;
- EcuM, BswM, WdgM, Dem, Det, FiM, NvM and Dcm;
- AUTOSAR OS scheduling, protection and multicore;
- RTE communication, events, concurrency and service access;
- integration, troubleshooting, performance and ISO 26262 interfacing.

## Automotive cockpit model

| Platform concept | Automotive metaphor |
|---|---|
| Application | Automotive learning cockpit |
| Learning-module selector | Active subsystem selector |
| Module library | Vehicle learning garage |
| 10-stage curriculum | Learning route |
| Stage | Route stage |
| Question | Technical checkpoint |
| Topic track | Automotive system |
| Search and filters | Diagnostic filters |
| Progress | Learning odometer |
| Bookmark | Flagged checkpoint |
| Browser storage | Retained module state / NvM analogy |
| Quiz | Knowledge validation run |
| Practical exercise | Architecture exercise |

The metaphor supports navigation without changing the technical meaning of the learning material.

## Repository architecture

```text
auto-learning-platform/
├── index.html
├── assets/
│   ├── app.js
│   ├── styles.css
│   ├── learning-language.js
│   └── content.js
├── content-source/
│   ├── CONCEPT_SCHEMA.md
│   └── safety/concepts/functional-safety-management/*.md
├── data/
│   ├── topics.json
│   ├── safety/concepts.json              Generated during validation
│   └── autosar/
│       ├── meta.json
│       └── day1.json ... day10.json
├── scripts/
│   ├── build-concepts.mjs
│   └── validate-content.mjs
├── .github/workflows/validate-content.yml
├── package.json
└── netlify.toml
```

### Main file responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Static cockpit shell and view placeholders |
| `assets/app.js` | Loading, retained state, filtering and rendering |
| `assets/content.js` | Existing Functional Safety checkpoint bank |
| `data/topics.json` | Learning-module manifest |
| `data/autosar/*` | AUTOSAR curriculum and checkpoints |
| `content-source/**/*.md` | Canonical concept explanations |
| `scripts/build-concepts.mjs` | Concept parsing, link validation and JSON generation |
| `scripts/validate-content.mjs` | Runtime model, question-bank and terminology validation |

## Retained browser state

Completion, confidence ratings and flags are stored by module:

```text
autoNotesNvM:safety
autoNotesNvM:autosar
```

The current state belongs to the browser profile and is not synchronized across devices.

## Run locally

```bash
git clone https://github.com/ytee/auto-learning-platform.git
cd auto-learning-platform
npm run validate
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Do not open `index.html` directly with a `file://` URL because browsers may prevent JavaScript from fetching JSON files.

## Deployment

AutoLeaP is deployed as a static Netlify site:

```text
https://osg1991-auto-leap.netlify.app/
```

Netlify configuration:

```toml
[build]
command = "npm run validate"
publish = "."
```

Deployment flow:

```text
Push or merge to main
        ↓
GitHub Actions validates and generates content
        ↓
Netlify runs the same validation and generation
        ↓
Static files are published
```

## Content principles

- Preserve technical depth and engineering context.
- Teach concepts before using questions for practice and review.
- Connect vehicle behavior, platform architecture and safety evidence.
- Use original explanations and paraphrased learning guidance.
- Keep content vendor-neutral and release-aware where practical.
- Verify implementation details against the exact standard and vendor stack used by a real project.
- Do not treat AUTOSAR conformance as equivalent to ISO 26262 compliance.

## Copyright and standards

AutoLeaP contains original learning concepts, checkpoints and paraphrased guidance with specification pointers. It does not reproduce ISO or AUTOSAR normative text.

Licensed standards, official AUTOSAR specifications and project-specific vendor documentation remain authoritative.
