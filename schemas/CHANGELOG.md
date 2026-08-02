# Content schema changelog

## 1.1.0 — 2026-08-02

Added a compatible discovery-home contract under the existing v1 compatibility boundary.

Added:

- `home-catalog.schema.json` for version-controlled home-page shelves;
- target fields for concepts and exercise surfaces;
- schema validation for `data/home.json`;
- semantic validation for module, concept, stage and view targets.

Compatibility notes:

- existing concept and exercise documents remain unchanged;
- the addition is independent of retained learner state;
- breaking changes to the home catalog still require `schemas/v2/`.

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
