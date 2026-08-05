# Concept selector lifecycle

## Symptom

After selecting a concept, the browser's native concept dropdown could remain open or repeatedly reopen. In the worst case, the popup captured interaction strongly enough that refreshing or closing the page became difficult.

## Why it happened

AutoLeaP has two concept-navigation surfaces:

1. `#conceptNav` — the full internal button list rendered by `assets/concepts.js`.
2. `#simpleConceptSelect` — the compact dropdown rendered by `assets/navigation.js`.

Selecting a concept through the dropdown previously followed this sequence:

```text
Native dropdown change
        ↓
Click concept button by array index
        ↓
concepts.js rebuilds all #conceptNav buttons
        ↓
MutationObserver fires
        ↓
navigation.js replaces every dropdown option with innerHTML
```

The final step could occur while the browser was still completing the native selection gesture. Desktop browsers usually tolerated this. Some touch/mobile browser implementations could interpret the replacement as a newly changed active control and keep reopening the native popup.

The observer also watched `class` attributes even though concept selection already replaces the navigation children. This caused unnecessary synchronisation callbacks.

## Fix location

The runtime fix is in:

```text
assets/navigation.js
```

The regression test is in:

```text
scripts/validate-concept-selector.mjs
```

The full validation command is:

```bash
npm run validate
```

## What changed

### 1. Stable concept IDs

Dropdown values now use the concept ID:

```text
fsm-overview
fsm-safety-plan
aero-lifecycle-assurance-planning
```

They no longer use transient array positions such as `0`, `1` or `2`.

This makes selection independent of ordering and re-render timing.

### 2. Close before render

The dropdown change handler now performs this sequence:

```text
Read selected concept ID
        ↓
blur() the native select
        ↓
temporarily disable the select
        ↓
wait for the next animation frame
        ↓
render the selected concept
        ↓
re-enable the select
```

Closing the native control before changing related DOM prevents option updates from interfering with the browser popup lifecycle.

### 3. Idempotent option rebuilding

`rebuildConceptOptions()` calculates a signature from:

- concept ID;
- title;
- difficulty and stage metadata.

The option list is rebuilt only when that signature changes, normally when switching modules or loading a different concept collection.

Selecting another concept in the same module changes only the selected value. It does not destroy and recreate the option elements.

### 4. Narrow observer scope

The concept observer now watches only child-list changes:

```js
{ childList: true, subtree: true }
```

It no longer watches class-attribute changes. `concepts.js` replaces the concept-navigation children whenever a concept is selected, so child-list observation is sufficient.

### 5. Deferred scrolling

The page scroll happens on a later animation frame, after the browser has closed the native selector and completed concept rendering.

## Regression checks

`scripts/validate-concept-selector.mjs` verifies:

- `navigation.js` is valid JavaScript;
- the selector blurs and suspends before concept rendering;
- concept IDs are used instead of indexes;
- identical concept records do not rebuild options;
- a changed concept collection rebuilds options exactly once;
- the concept observer does not watch class attributes.

The earlier `domain-labels.js` mutation-loop regression remains active as a separate check.

## Design lesson

Native form controls are partly managed by the browser or operating system. While a native dropdown is open, avoid replacing its options, moving it, disabling surrounding layout, or forcing focus changes from unrelated observers.

A stable pattern is:

```text
User gesture → close native control → update application state → render once
```

DOM synchronisation should also be idempotent: applying the same state twice should not rewrite the DOM twice.
