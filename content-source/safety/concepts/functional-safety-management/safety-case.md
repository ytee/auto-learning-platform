---
id: fsm-safety-case
title: Safety Case
module: safety
collection: functional-safety-management
order: 5
standard: {"family":"ISO 26262","edition":"2018","parts":["2","10"],"clauseRefs":["ISO 26262-2","ISO 26262-10"]}
difficulty: Intermediate
stage: 1
systems: ["FSM","Safety Case","Evidence"]
relatedConcepts: ["fsm-overview","fsm-safety-plan","fsm-confirmation-measures"]
linkedQuestions: ["D1Q8","D4Q2","D4Q8"]
references: ["ISO 26262-2:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Explain the relationship between safety claims, argument, context and evidence.
- Describe why a safety case must be built progressively and configuration-specifically.
- Identify how assumptions, anomalies and evidence confidence affect release.
- Distinguish a safety case from a document collection or compliance checklist.

## Concept

A safety case is the structured rationale showing why the item is considered to have achieved functional safety in its defined context. It connects top-level safety claims to requirements, architecture, analyses, verification, validation, process evidence, assumptions and configuration information.

The safety case is strongest when built progressively. Early claims and evidence expectations guide development, while later work products fill and challenge the argument. Changes to architecture, software, hardware, calibration, suppliers or assumptions can invalidate parts of the evidence and must be reflected in the safety case.

A convincing safety case is explicit about context and limitations. It identifies what configuration is covered, which assumptions are relied upon, what evidence supports each important claim, what anomalies remain open and why the residual risk is considered acceptable for the intended release.

## Why it matters

Large projects generate thousands of requirements, analyses and test results. A document repository can show that work was performed, but it does not automatically show that the evidence is complete, mutually consistent or sufficient for the safety claims.

The safety case provides the integration view needed by technical leadership, assessors and release authorities. It exposes weak links such as an unverified supplier assumption, a test result from the wrong calibration baseline or an architecture claim not supported by dependent-failure analysis.

## Inputs

- Safety goals and refined safety requirements.
- Functional, technical, hardware and software architectures.
- Safety analyses and quantitative hardware evaluations.
- Verification and validation plans, results and coverage.
- Supplier safety manuals, assumptions and integration evidence.
- Configuration, change and anomaly records.
- Confirmation-review, audit and assessment findings.

## Activities

- Define safety claims, subclaims, context and evidence expectations.
- Link requirements, architecture, analyses and verification evidence.
- Track assumptions, limitations, open anomalies and residual risk.
- Check evidence consistency against the exact release configuration.
- Update the argument when changes affect claims or evidence.
- Review missing, stale, contradictory or weak evidence.
- Use the completed argument to support release and lifecycle decisions.

## Outputs and evidence

- Structured claims and argument.
- Traceable evidence links.
- Assumption and limitation register.
- Configuration and variant applicability statement.
- Open-anomaly and residual-risk rationale.
- Evidence-confidence and completeness review.
- Release-oriented safety-case conclusion.

## Automotive example

For an integrated brake and ESC platform, a claim that unintended yaw-control braking is adequately controlled may depend on sensor plausibility, communication integrity, command arbitration, actuator shutdown timing and vehicle-level validation. If a software update changes arbitration timing, the affected requirements, timing analysis, HIL results and vehicle tests must be re-evaluated before the claim remains valid for release.

## Common mistakes

- Building the safety case shortly before release.
- Treating a folder of approved documents as a safety argument.
- Failing to identify assumptions and evidence limitations.
- Reusing evidence from a different hardware, software or calibration baseline.
- Ignoring contradictory evidence or open anomalies.
- Assuming that standards compliance alone proves acceptable residual risk.
