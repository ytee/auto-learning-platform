# Content schema changelog

## 1.0.0 — 2026-07-27

Initial versioned AutoLeaP content contracts.

Added:

- concept authoring interchange schema;
- normalized runtime concept schema;
- generated concept-collection schema;
- exercise-checkpoint schema;
- exercise-stage batch schema;
- exercise-module schema;
- generation examples;
- no-dependency concept renderer;
- repository schema-contract validation.

Compatibility notes:

- concepts remain canonically authored as Markdown;
- exercise checkpoint field `day` represents the route stage in v1;
- existing Functional Safety and AUTOSAR learning content is unchanged.
