# Editorial discovery home

AutoLeaP uses two complementary surfaces:

1. an editorial discovery home for orientation and content selection;
2. a focused single-page learning workspace for concepts, exercises, scenarios and retained progress.

The home page is structurally inspired by clean technical publications such as Decoding AI. It does not copy that site's branding, text, images or publication-specific features.

## Home-page responsibilities

The home page should answer five questions quickly:

- Where should a new learner start?
- What was the returning learner doing?
- Which learning paths are available?
- Which concepts and applied scenarios are most useful now?
- How can the learner see a complete roadmap without exposing the complete application at once?

The page therefore contains:

- Start Here hero;
- Continue Learning based on browser-retained module state;
- Learning Paths;
- Concepts;
- Case Studies;
- Engineering Scenarios;
- Playbooks;
- Roadmaps.

## Publication patterns adapted for learning

| Publication pattern | AutoLeaP adaptation |
|---|---|
| Featured article | Continue Learning |
| Content categories | Concepts, Case Studies, Scenarios, Playbooks and Roadmaps |
| Publication date | Estimated time or route stage |
| Author metadata | Learning module and difficulty |
| Popularity counts | Completion and confidence |
| Archive | Learning-path library |
| Subscribe action | Start or continue learning |

## Patterns intentionally excluded

AutoLeaP does not use:

- newsletter subscription prompts;
- author avatars;
- reaction or comment counts;
- publication dates on learning cards;
- social-media feeds;
- copied editorial images.

## Navigation model

```text
Discovery home
      ↓
Select a learning path, concept, case study or roadmap
      ↓
Focused AutoLeaP workspace
      ↓
Concept → Practice → Scenario → Review
```

The workspace retains the progressive disclosure introduced previously:

- one concept at a time;
- one exercise stage at a time;
- one system or validation question at a time;
- optional filters;
- persistent Go to Top control;
- retained completion, confidence and bookmarks.

## Catalog authoring

Curated home-page content is stored in:

```text
data/home.json
```

It validates against:

```text
schemas/v1/home-catalog.schema.json
```

A card targets either:

- a concept: `module + area=concepts + concept`; or
- an exercise surface: `module + area=exercises + view`, with a stage for route targets.

All targets are checked against the module manifest and generated concept collections during `npm run validate`.

## Visual principles

- generous whitespace;
- strong typographic hierarchy;
- restrained borders and shadows;
- consistent cards;
- limited cards per shelf;
- one featured item per section;
- light neutral background;
- one automotive accent colour;
- automotive identity expressed through technical content rather than dashboard ornamentation;
- mobile layouts that collapse to one card per row.
