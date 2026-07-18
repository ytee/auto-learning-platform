# Automotive Engineering Preparation Library

A static, Netlify-ready interview-preparation website with independent topic modules.

## Available topics

### Functional Safety

100 questions across 10 days covering ISO 26262, FSM, HARA, SysML/MBSE, system architecture, brakes, ESC/control, requirements, FMEA/FTA/DFA, ASIL decomposition, hardware, software, CAN/OBD, V&V, suppliers, safety case and leadership.

### AUTOSAR Classic Platform

100 questions across 10 days covering:

- Architecture, Classic vs Adaptive, VFB and software components
- AUTOSAR system design, ports, interfaces, data types and ECU allocation
- ARXML, System Description, ECU Extract, ECU Configuration and generation workflow
- BSW, MCAL, ECU abstraction, Complex Drivers and variants
- COM, PduR, CanIf, CanDrv, CanTp, CanSM, ComM, Nm and E2E
- EcuM, BswM, WdgM, Dem, Det, FiM, NvM and Dcm
- AUTOSAR OS scheduling, resources, protection and multicore
- RTE communication, events, concurrency and service access
- Integration, troubleshooting, performance and supplier handovers
- Domain-to-AUTOSAR-to-ISO 26262 interfacing using brake and ESC examples

## Architecture

```text
index.html                 Reusable application shell
assets/app.js              Topic loader and study application
assets/styles.css          Shared presentation
assets/content.js          Existing Functional Safety module
data/topics.json           Topic registry
data/autosar/meta.json      AUTOSAR curriculum and topic metadata
data/autosar/day*.json      AUTOSAR daily question modules
scripts/validate-content.mjs Content validation
```

The application supports both the original Safety module and file-based topic modules. Progress, ratings and bookmarks are namespaced per topic in browser local storage.

## Add another topic

1. Add one topic entry to `data/topics.json`.
2. Add a metadata JSON file containing the curriculum, tracks, interface matrix, focus map and quiz.
3. Add one or more question JSON files and list them in `questionFiles`.
4. Run `npm run validate`.

No changes to `index.html` or `assets/app.js` are normally required.

## Run locally

```bash
npm run validate
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Netlify

This is a static site.

- Build command: `npm run validate`
- Publish directory: `.`

## Content principles

- Questions progress from foundation to expert-level architecture and leadership scenarios.
- Answers contain structured guidance and interviewer probes rather than copied standard text.
- Domain behavior, platform design and safety-standard interfaces are treated together.
- AUTOSAR material is release-neutral unless a release is explicitly mentioned; use the exact project release and vendor documentation for implementation decisions.

## Copyright

This study aid contains original questions and paraphrased guidance with specification pointers. It does not reproduce ISO or AUTOSAR normative text. Licensed standards and official project specifications remain authoritative.
