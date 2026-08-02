# Automotive Learning Platform (AutoLeaP)

**AutoLeaP** is a modular static web application for learning automotive software, vehicle platforms and embedded engineering.

Current modules:

- **Functional Safety** — 23 Functional Safety Management concepts and 100 practice checkpoints.
- **AUTOSAR Classic Platform** — 100 architecture, configuration, stack and integration exercises.
- **Embedded Systems & Firmware** — 10 core concepts and 100 exercises spanning firmware, RTOS, Linux, Android/AAOS, platform architecture and technical leadership.

## Learning model

```text
Learn one concept
      ↓
Study an engineering example
      ↓
Attempt difficult technical and role-based exercises
      ↓
Reveal guidance and deeper probes
      ↓
Record completion and confidence
```

| Layer | Purpose |
|---|---|
| Concepts | Strong foundations, engineering flow, examples and common mistakes |
| Exercises | Active recollection, debugging, architecture and decision-making |
| Guidance | Key technical reasoning and review points |
| Probes | Tough follow-up questions and boundary cases |
| Validation | Quizzes and architecture exercises |

## Editorial discovery home

AutoLeaP now separates content discovery from the focused learning workspace.

The home page provides:

- a **Start Here** orientation;
- browser-state-aware **Continue Learning**;
- the three current learning paths;
- curated Concepts, Case Studies, Engineering Scenarios, Playbooks and Roadmaps;
- direct transitions into the existing concept and exercise engine.

The design uses the structure of clean technical publications as a reference while replacing magazine metadata with learning metadata such as module, stage, difficulty, estimated time and progress. It does not copy external branding, text or images.

Curated cards are version-controlled in `data/home.json` and validated against `schemas/v1/home-catalog.schema.json`. Design and authoring decisions are documented in [`docs/editorial-discovery-home.md`](docs/editorial-discovery-home.md).

## Simplified interface

AutoLeaP uses progressive disclosure so the complete curriculum does not crowd one page.

- Choose **Concepts** or **Exercises**.
- Select one topic.
- Select one concept, stage, system or validation question.
- Only one exercise stage is displayed at a time.
- Search and diagnostic filters remain collapsed until requested.
- A floating **Go to Top** button is always available.
- An always-visible AutoLeaP header returns to the discovery home.

Direct module and concept links remain compatible, and browser-retained completion, confidence and bookmarks are preserved.

The design rationale and comparison with Bengali Sadhana are documented in [`docs/clean-learning-ui.md`](docs/clean-learning-ui.md).

## Embedded Systems & Firmware

The module is employer-neutral. Two supplied role descriptions were used only as coverage inputs for embedded platform engineering, Android/Linux leadership, common software features and product ownership.

### Ten-stage route

1. Embedded systems foundations
2. Processor, memory and hardware interfaces
3. Firmware, boot and BSP architecture
4. RTOS, concurrency and timing
5. Embedded Linux platform engineering
6. Android platform and Android Automotive
7. Connectivity, infotainment and OTA
8. Reusable platforms and product variability
9. Performance, security, quality and release
10. Engineering and product leadership

Each stage contains exactly ten exercises, including:

- at least two strong foundation questions;
- difficult advanced and expert technical questions;
- one technical-management scenario;
- one product-owner scenario;
- one engineering-manager scenario;
- one board-level architecture exercise.

The full bank contains **100 exercises** and the concept collection links every stage concept directly to its ten exercises.

## Functional Safety Management concepts

Functional Safety uses ISO 26262:2018 as its published baseline. The 23-concept collection covers foundations plus two management concepts for every route stage from 2 through 10.

Each concept provides:

- learning objectives;
- original explanation;
- inputs, activities, outputs and evidence;
- an automotive example;
- common mistakes;
- related concepts;
- linked practice checkpoints;
- reference pointers.

Licensed standards remain authoritative; AutoLeaP does not reproduce normative text.

## Content structure

```text
auto-learning-platform/
├── index.html
├── assets/
│   ├── app.js
│   ├── concepts.js
│   ├── concepts.css
│   ├── navigation.js
│   ├── navigation.css
│   ├── home.js
│   ├── home.css
│   ├── styles.css
│   ├── learning-language.js
│   └── content.js
├── content-source/
│   ├── safety/concepts/functional-safety-management/*.md
│   └── embedded-systems/concepts/*.json
├── data/
│   ├── home.json
│   ├── topics.json
│   ├── safety/concepts.json
│   ├── autosar/
│   │   ├── meta.json
│   │   └── day1.json ... day10.json
│   └── embedded/
│       ├── meta.json
│       ├── day1.json ... day10.json
│       └── concepts.json
├── schemas/v1/
│   ├── concept-authoring.schema.json
│   ├── concept.schema.json
│   ├── concept-collection.schema.json
│   ├── exercise.schema.json
│   ├── exercise-batch.schema.json
│   ├── exercise-module.schema.json
│   └── home-catalog.schema.json
├── scripts/
│   ├── assemble-embedded-source.mjs
│   ├── build-concepts.mjs
│   ├── render-concept-source.mjs
│   ├── validate-content.mjs
│   ├── validate-concepts-ui.mjs
│   ├── validate-home-ui.mjs
│   └── validate-schema-contracts.mjs
├── docs/
│   ├── clean-learning-ui.md
│   └── editorial-discovery-home.md
├── package.json
└── netlify.toml
```

Functional Safety concepts use Markdown as their canonical source. Embedded Systems concepts use the versioned JSON concept records under `content-source/embedded-systems/concepts/`. The build assembles both forms into deterministic runtime JSON for the site.

## Versioned generation contracts

Machine-readable schemas are stored under `schemas/v1/`:

- `concept-authoring.schema.json`
- `concept.schema.json`
- `concept-collection.schema.json`
- `exercise.schema.json`
- `exercise-batch.schema.json`
- `exercise-module.schema.json`
- `home-catalog.schema.json`

Breaking contract changes require a new version directory such as `schemas/v2/`.

## Validation

```bash
npm run build:concepts
npm run check:concepts
npm run validate:schemas
npm run validate
```

The validation pipeline checks:

- deterministic concept generation;
- concept metadata and required sections;
- concept relationships and linked exercise IDs;
- ten stages and 100 exercises per module;
- exactly ten exercises per stage;
- declared tracks and supported difficulty levels;
- the Embedded module's foundation, difficult technical, management and role-scenario mix;
- versioned JSON Schema contracts;
- discovery-home catalog structure and target resolution;
- home-to-workspace transitions and retained progress integration;
- simplified navigation, stage focus and Go-to-top UI hooks;
- learning-oriented user-facing terminology.

## Retained browser state

Progress is stored per module in the current browser profile:

```text
autoNotesNvM:safety
autoNotesNvM:autosar
autoNotesNvM:embedded
```

State is not synchronized across devices. The discovery home reads these same keys to determine the most relevant Continue Learning destination.

## Run locally

```bash
git clone https://github.com/ytee/auto-learning-platform.git
cd auto-learning-platform
npm run validate
python3 -m http.server 8000
```

Open `http://localhost:8000`. A local HTTP server is required because the application fetches JSON assets.

## Deployment

The static site is deployed through Netlify. Both GitHub Actions and Netlify run `npm run validate` before publication.

## Content principles

- Teach strong foundations before difficult applications.
- Preserve technical depth and system context.
- Include debugging, architecture, technical-management and product decisions.
- Keep role-derived coverage employer-neutral.
- Connect software behavior to hardware, timing, interfaces, security, quality and release evidence.
- Use original explanations and project-appropriate reference pointers.
- Verify release-specific implementation details against authoritative platform and vendor documentation.
