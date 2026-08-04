# Content schema changelog

## 1.2.0 — 2026-08-04

Generalized concept standard metadata for non-ISO learning domains while retaining v1 compatibility.

Changed:

- `standard.parts` now accepts any non-empty string rather than numeric ISO part identifiers only;
- numeric values such as `"2"` and `"8"` remain valid;
- named divisions such as `"Lifecycle planning"`, `"Model-based development"` and `"Structural coverage"` are now supported.

Compatibility notes:

- all existing Functional Safety and Embedded concept records remain valid without modification;
- no required fields were added, removed or renamed;
- the field continues to represent the standard parts, supplements, sections or learning divisions relevant to a concept.

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
