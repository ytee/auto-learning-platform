# AutoLeaP content schemas

AutoLeaP keeps machine-readable generation contracts under a versioned directory.

```text
schemas/
├── README.md
├── CHANGELOG.md
└── v1/
    ├── concept-authoring.schema.json
    ├── concept.schema.json
    ├── concept-collection.schema.json
    ├── exercise.schema.json
    ├── exercise-batch.schema.json
    ├── exercise-module.schema.json
    ├── home-catalog.schema.json
    └── examples/
```

## Current version

The current major content-schema version is **1**.

Every generated authoring or runtime document that owns a top-level version field uses:

```json
{
  "schemaVersion": 1
}
```

The directory name is the compatibility boundary:

- backward-compatible clarifications remain under `schemas/v1/`;
- optional additive fields may be introduced only when existing v1 documents remain valid;
- renamed, removed or semantically changed required fields create `schemas/v2/`;
- existing v1 schemas remain in the repository after a later version is introduced.

## Concepts

### Generation format

Generate a JSON document against:

```text
schemas/v1/concept-authoring.schema.json
```

The authoring document contains:

- version and content type;
- metadata corresponding to Markdown front matter;
- structured arrays for every required concept section.

Example:

```text
schemas/v1/examples/concept-authoring.example.json
```

Render it into canonical Markdown:

```bash
npm run render:concept -- \
  schemas/v1/examples/concept-authoring.example.json \
  content-source/safety/concepts/functional-safety-management/example.md
```

The renderer creates the exact front matter and section headings consumed by `scripts/build-concepts.mjs`.

Canonical concept sources remain Markdown. Generated runtime JSON must not be edited manually.

### Runtime contracts

A normalized concept validates against:

```text
schemas/v1/concept.schema.json
```

A generated collection such as `data/safety/concepts.json` validates against:

```text
schemas/v1/concept-collection.schema.json
```

### Suggested generation instruction

```text
Generate JSON only.
The output must validate against schemas/v1/concept-authoring.schema.json.
Use schemaVersion 1 and contentType "concept".
Write original explanations rather than reproducing normative text.
Keep linkedQuestions limited to IDs that exist in the target exercise bank.
```

## Exercises

An individual checkpoint validates against:

```text
schemas/v1/exercise.schema.json
```

A stage file such as `data/autosar/day1.json` is an array validating against:

```text
schemas/v1/exercise-batch.schema.json
```

Module-level route metadata, tracks, maps, quiz and architecture exercise validate against:

```text
schemas/v1/exercise-module.schema.json
```

Examples:

```text
schemas/v1/examples/exercise-batch.example.json
schemas/v1/examples/exercise-module.example.json
```

In schema v1, the existing wire-format field `day` means the **route stage number**. It remains named `day` to preserve compatibility with current content and retained behavior.

### Suggested generation instruction

```text
Generate JSON only.
Each checkpoint must validate against schemas/v1/exercise.schema.json.
Return one JSON array that validates against schemas/v1/exercise-batch.schema.json.
Use the requested stage number in the day field.
Preserve technical depth and include answer, probes and refs for every checkpoint.
Do not reuse checkpoint IDs.
```

## Discovery home catalog

Curated home-page shelves validate against:

```text
schemas/v1/home-catalog.schema.json
```

The version-controlled catalog is:

```text
data/home.json
```

Each card targets either:

- a concept using `module`, `area: "concepts"` and `concept`; or
- an exercise surface using `module`, `area: "exercises"`, `view` and an optional route `stage`.

Schema validation checks the document shape. `scripts/validate-home-ui.mjs` also verifies that module IDs, concept IDs, route stages and workspace views resolve against the current repository content.

### Suggested generation instruction

```text
Generate JSON only.
The output must validate against schemas/v1/home-catalog.schema.json.
Use only module IDs from data/topics.json.
Concept cards must target existing generated concept IDs.
Route cards must use a stage from 1 through 10.
Use concise original summaries and learning metadata rather than publication metadata.
```

## Validation

Run all schema checks:

```bash
npm run validate:schemas
```

Run the complete repository pipeline:

```bash
npm run validate
```

The schema validator has no external package dependency. It validates:

- all versioned schema files are valid JSON and declare Draft 2020-12;
- all checked-in examples;
- the discovery home catalog;
- generated Functional Safety and Embedded concept collections;
- AUTOSAR and Embedded exercise-module metadata;
- current modular exercise batches.

Repository-specific semantic checks—duplicate IDs, linked-question existence, stage counts, home target resolution and learning-language rules—remain in the content and UI validators.
