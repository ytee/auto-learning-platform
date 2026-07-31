# Clean Learning UI Principles

AutoLeaP is a content-dense technical learning application. Its interface should reduce the amount of material visible at one time without hiding the breadth of the curriculum.

## Design principles

### 1. Progressive disclosure

Show the learner only the controls and content needed for the current decision:

1. Choose **Concepts** or **Exercises**.
2. Choose one topic.
3. Choose one concept, stage, system or validation question.
4. Reveal answers, probes and supporting detail only when requested.

Large topic grids, complete ten-stage routes and long concept lists should not remain visible together.

### 2. One primary task per screen

A screen should answer one question:

- What concept am I learning?
- Which exercise am I attempting?
- Which system am I reviewing?
- Which map or validation activity am I using?

Secondary controls remain accessible but visually subordinate.

### 3. Stable navigation

The learner should always know:

- the active area;
- the active topic;
- the active concept, stage or system;
- how to move backward, forward or to the top.

The navigation shell must remain stable while content changes below it.

### 4. Strong hierarchy, low ornament

Use typography, spacing, borders and restrained surface changes before decorative graphics. A learning application benefits from calm pages, readable line lengths and predictable cards more than from dashboard ornament.

### 5. Limit simultaneous choices

Dropdowns and previous/next controls are preferable when a collection contains many topics. The interface should normally expose one selected topic plus, at most, one adjacent context such as the current stage selector.

### 6. Keep advanced controls optional

Search, difficulty, system and completion filters are useful, but they should remain collapsed until requested. Timers and diagnostic tools should not compete with the learning content.

### 7. Preserve state and deep links

Visual simplification must not remove:

- saved completion;
- confidence ratings;
- bookmarks;
- concept-to-exercise links;
- direct URLs to a module or concept.

### 8. Design mobile-first, enhance for desktop

Controls must work in one column on narrow screens. Desktop layouts may place two related panels side by side, but should not turn into dense dashboards.

### 9. Accessible interaction

Use native buttons, labels and selects; clear focus states; adequate touch targets; semantic headings; readable contrast; and text labels in addition to icons.

### 10. Performance is part of usability

Static assets, small dependency-free controllers and incremental rendering keep navigation responsive. Large content collections should not require a framework merely to present one active item.

## AutoLeaP and Bengali Sadhana

Both projects are statically hosted, client-rendered learning applications. Hosting does not determine whether a site is a single-page application.

### Bengali Sadhana

Bengali Sadhana uses one HTML application shell with a single dynamic `<main>` area, JavaScript-rendered views, a compact sticky header and persistent bottom navigation. It also declares a web-app manifest and mobile web-app metadata, which makes it PWA-style and install-oriented.

Its visual model is intentionally narrow:

- one current view;
- compact status indicators;
- a maximum content width;
- cards with consistent spacing;
- bottom navigation optimized for repeated mobile use;
- settings kept in a dialog;
- progressive disclosure for details and learning aids.

### AutoLeaP before simplification

AutoLeaP is also a client-rendered SPA, but its original interface grew around a desktop cockpit metaphor. It could show a hero, two menu groups, five exercise tabs, filters, ten stage buttons and the entire ten-stage route on one page. This exposed the architecture of the learning platform but created excessive simultaneous choice.

### Simplified AutoLeaP model

The revised interface keeps AutoLeaP's deeper technical structures but adopts Bengali Sadhana's focus:

- one area switch: Concepts or Exercises;
- one topic selector;
- one context selector for concept, stage, system or validation question;
- one exercise stage visible at a time;
- filters collapsed by default;
- one persistent Go to Top action;
- a calmer content width and reduced decorative styling.

AutoLeaP remains a desktop-capable technical SPA. It does not become a conventional document website merely because its UI becomes simpler.

## SPA, PWA and conventional website

### Single-page application (SPA)

A single HTML shell remains loaded while JavaScript changes views and content. URLs may use hashes or client-side routing. Both AutoLeaP and Bengali Sadhana follow this model.

### Progressive Web App (PWA)

A web application adds installability and, usually, service-worker-based caching or offline behavior. A manifest and mobile app metadata are visible signals, but complete PWA behavior also depends on service-worker and caching implementation. Bengali Sadhana is designed in this direction.

### Conventional multi-page website

Navigation loads separate HTML documents from the server. This is often appropriate for public articles, documentation and search-engine-oriented content, but less convenient for retained learning state, instant filtering and app-like exercises.

## Decision for AutoLeaP

Keep AutoLeaP as a dependency-light SPA because it needs retained progress, dynamic filtering, concept-to-exercise transitions and reusable topic schemas. Apply document-site clarity inside that application architecture rather than converting the project into many independent HTML pages.
