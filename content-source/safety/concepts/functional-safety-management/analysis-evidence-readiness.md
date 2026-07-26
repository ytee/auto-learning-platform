---
id: fsm-analysis-evidence-readiness
title: Analysis Evidence Readiness and Independent Review
module: safety
collection: functional-safety-management
order: 13
standard: {"family":"ISO 26262","edition":"2018","parts":["2","5","8","9","10"],"clauseRefs":["ISO 26262-2 confirmation and safety case","ISO 26262-5 quantitative hardware evaluation","ISO 26262-9 ASIL-oriented analyses"]}
difficulty: Expert
stage: 5
systems: ["FSM","Safety Analysis","Review","Safety Case"]
relatedConcepts: ["fsm-safety-analysis-governance","fsm-safety-case","fsm-release-residual-risk-governance"]
linkedQuestions: ["D5Q6","D5Q10","D10Q2"]
references: ["ISO 26262-2:2018","ISO 26262-5:2018","ISO 26262-8:2018","ISO 26262-9:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Judge whether safety-analysis evidence is sufficiently complete and credible for a lifecycle gate.
- Explain how ASIL decomposition claims affect analysis and confirmation expectations.
- Define independent review criteria for analysis consistency and configuration validity.
- Connect analysis evidence to safety-case claims rather than attaching reports without argument.

## Concept

Analysis evidence readiness is the decision that the available analyses are sufficiently scoped, consistent, reviewed and linked to support the next lifecycle or release gate. Readiness is claim-based: the project identifies which safety claim each analysis supports and what uncertainty remains.

For ASIL decomposition, evidence must show redundant requirement allocation and sufficient independence; the original safety-goal integrity still governs the overall argument and confirmation measures. For all analyses, scope must match the released configuration, relevant modes and interfaces, and findings must trace to implemented controls and verified reactions.

Independent review challenges completeness, failure data, classification, assumptions, cut sets, dependencies, sensitivity and cross-analysis consistency. Any limitation is recorded as an open risk, restricted claim or required action.

## Why it matters

A large set of analysis reports can create false confidence. Readiness depends on whether they address the actual item and configuration, agree with one another and have changed the design where needed.

Formal readiness criteria prevent analyses from becoming last-minute attachments assembled for an assessor.

## Inputs

- Completed analyses and their approved plans.
- Safety goals, requirements, architecture and released configuration candidate.
- Assumption register, supplier data and failure-rate sources.
- Finding status, verification evidence and change history.
- Safety-case claims and lifecycle-gate criteria.

## Activities

- Map each analysis to the claims and requirements it supports.
- Check scope, abstraction, modes, variants and configuration consistency.
- Review decomposition and independence evidence where applicable.
- Cross-check FMEA, FTA, DFA and quantitative results.
- Challenge assumptions, sensitivity and unresolved findings independently.
- Recommend approval, restricted progression or rework with explicit rationale.

## Outputs and evidence

- Analysis-readiness review record.
- Confirmed claim-to-analysis and finding-to-evidence links.
- Open-risk and limitation register.
- Approved or rejected decomposition argument.
- Safety-case updates and lifecycle-gate recommendation.

## Automotive example

Before approving an ASIL-D brake architecture, the team presents FMEA, FTA and DFA plus a decomposition argument. Independent review finds that the two allocated paths share power and a common specification. The gate is not passed merely because both paths have separate software components; additional containment or a revised non-decomposed design is required.

When readiness is achieved, the safety case references exact analysis versions and the verified configuration rather than generic report titles.

## Common mistakes

- Measuring readiness by document completion percentage.
- Accepting decomposition notation without independence evidence.
- Reviewing analyses separately without checking contradictions.
- Ignoring configuration differences between analysis and release candidate.
- Treating unresolved findings as editorial actions.
