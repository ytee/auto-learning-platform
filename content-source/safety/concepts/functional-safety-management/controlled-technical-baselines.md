---
id: fsm-controlled-technical-baselines
title: Controlled Technical Baselines and Interface Authority
module: safety
collection: functional-safety-management
order: 9
standard: {"family":"ISO 26262","edition":"2018","parts":["2","4","8"],"clauseRefs":["ISO 26262-2 safety planning and monitoring","ISO 26262-4 technical safety concept","ISO 26262-8 requirements and configuration management"]}
difficulty: Intermediate
stage: 3
systems: ["FSM","Configuration Management","Interfaces"]
relatedConcepts: ["fsm-system-architecture-governance","fsm-change-configuration-reuse","fsm-safety-case"]
linkedQuestions: ["D3Q2","D3Q6","D3Q9"]
references: ["ISO 26262-2:2018","ISO 26262-4:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Explain why models, requirements databases, interface documents and generated artifacts need a defined authority model.
- Establish a configuration baseline that keeps system, hardware and software interpretations aligned.
- Manage disagreements between sources without silently choosing the most convenient artifact.
- Connect baseline control to change impact and safety-case evidence.

## Concept

A controlled technical baseline is the identified set of mutually consistent safety requirements, architecture models, interface specifications, analyses and configuration records used for a development or release decision. Each artifact needs a declared role: authoritative source, derived representation or generated output.

Interface authority is especially important for timing, units, validity, reset behavior, diagnostics and hardware-software responsibilities. If SysML, DOORS, an HSI spreadsheet and supplier documentation disagree, the project must stop the affected decision path, identify the approved baseline and resolve the inconsistency through controlled change.

Baseline governance defines naming, versions, approvals, typed traceability, generation rules and synchronization checks. It also identifies which evidence is invalidated when a source changes.

## Why it matters

A system can pass local reviews while still being unsafe because teams built against different timeouts, scaling, safe-state behavior or watchdog responsibilities. Configuration consistency is therefore a product-safety concern, not only an administrative one.

Clear authority also makes impact analysis credible. Without knowing which artifact is primary and which outputs derive from it, a change cannot be propagated reliably.

## Inputs

- Project information model and configuration-management plan.
- Requirements, models, interface specifications, HSI and supplier documents.
- Toolchain and generation workflow definitions.
- Current baselines, approvals, change history and suspect-link reports.
- Planned integration and release configurations.

## Activities

- Declare authoritative and derived artifacts for each information type.
- Define baseline composition, approval status and synchronization rules.
- Reconcile semantic differences across models, requirements and interfaces.
- Control generated artifacts, tool versions and configuration parameters.
- Perform consistency and traceability checks before technical gates.
- Identify and regenerate evidence affected by baseline changes.

## Outputs and evidence

- Approved technical baseline index and authority matrix.
- Consistent requirements, models, HSI and interface specifications.
- Configuration records for tools, generation and variants.
- Resolved inconsistency records and controlled changes.
- Evidence-validity and release-configuration mapping.

## Automotive example

The system model states a 20 ms brake-command timeout while DOORS specifies 30 ms and the supplier ECU uses 40 ms. The project does not simply declare DOORS authoritative after the fact. It identifies the approved source, evaluates FTTI and supplier impacts, freezes the interface decision, resolves the requirement through change control and regenerates affected tests and safety-case evidence.

The release baseline then records the exact timeout across the requirement, model, ARXML/interface data, implementation and test results.

## Common mistakes

- Assuming the requirements database is always authoritative without defining it.
- Allowing generated files to become uncontrolled sources of truth.
- Checking link completeness without reviewing semantic agreement.
- Baselining documents individually without a coherent configuration set.
- Failing to identify which analyses and tests become stale after an interface change.
