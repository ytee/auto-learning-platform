---
id: fsm-software-safety-management
title: Software Safety Lifecycle Management
module: safety
collection: functional-safety-management
order: 16
standard: {"family":"ISO 26262","edition":"2018","parts":["2","6","8","9"],"clauseRefs":["ISO 26262-2 project safety management","ISO 26262-6 software development","ISO 26262-8 supporting processes"]}
difficulty: Advanced
stage: 7
systems: ["FSM","Software","Requirements","Verification"]
relatedConcepts: ["fsm-distributed-development","fsm-tool-integration-governance","fsm-controlled-technical-baselines"]
linkedQuestions: ["D7Q1","D7Q6","D7Q8","D7Q9"]
references: ["ISO 26262-2:2018","ISO 26262-6:2018","ISO 26262-8:2018","ISO 26262-9:2018"]
---

## Learning objectives

- Plan the software safety lifecycle from SSR derivation through integration and verification.
- Define competence, independence, method and evidence expectations by ASIL and objective.
- Govern model-based development, generated code and software tool confidence.
- Maintain configuration-correct software evidence across variants and releases.

## Concept

Software safety lifecycle management translates system allocations into an executable, reviewable and verifiable software program. It establishes SSR quality, architecture gates, unit design and implementation methods, verification strategy, integration planning, tool confidence and configuration control.

Methods are selected to satisfy objectives and address risk, not to fill a checklist. Requirements testing, reviews, static analysis, structural coverage, fault injection and back-to-back testing provide different evidence. Independence and competence are planned where required and where technical risk warrants it.

For model-based development, the model, generator, libraries, solver settings, compiler and handwritten integration are one controlled toolchain/configuration set. Tool confidence is evaluated for the exact use case and revisited when version or usage changes.

## Why it matters

Software evidence can be extensive yet fail to demonstrate the intended safety behavior if requirements are incomplete, architecture assumptions are unclear or tool/generated artifacts are uncontrolled.

Lifecycle management prevents late discovery that tests, coverage or qualification evidence do not match the released executable and configuration.

## Inputs

- Allocated TSRs, SSRs, HSI and system timing/safe-state constraints.
- Software architecture, platform services and variant strategy.
- ASIL/objective-based method selection and independence needs.
- Development and verification toolchain with exact use cases.
- Integration, fault-injection and release configuration plan.

## Activities

- Review SSR completeness, attributes and traceability.
- Plan architecture, unit and integration review gates.
- Select complementary verification methods and acceptance criteria.
- Evaluate tool confidence and control model/code-generation workflow.
- Track anomalies, coverage gaps, variants and configuration status.
- Approve software evidence for integration and release.

## Outputs and evidence

- Approved software safety plan and SSR baseline.
- Software architecture and review records.
- Unit/integration verification strategy and results.
- Tool-confidence or qualification evidence.
- Configuration index linking source, model, generated code, binaries and tests.

## Automotive example

An ESC controller is generated from a model while monitoring and integration code are handwritten. Management baselines the model, libraries, generator, compiler and calibration set; plans model review, back-to-back testing, static analysis, target tests and fault injection; and records which evidence covers the handwritten interfaces.

After a generator upgrade, tool confidence and regression scope are reassessed rather than assuming earlier evidence remains valid.

## Common mistakes

- Selecting methods solely by ASIL table without considering the objective.
- Equating structural coverage with requirements completeness.
- Controlling source code but not models, generators or calibration.
- Qualifying a tool generically without defining its exact use.
- Allowing variant-specific software evidence to be merged into one ambiguous release claim.
