---
id: fsm-impact-analysis-lifecycle-reentry
title: Impact Analysis and Safety-Lifecycle Re-entry
module: safety
collection: functional-safety-management
order: 7
standard: {"family":"ISO 26262","edition":"2018","parts":["2","3","8"],"clauseRefs":["ISO 26262-2 safety management during development","ISO 26262-3 concept-phase impact","ISO 26262-8 change management"]}
difficulty: Advanced
stage: 2
systems: ["FSM","Change Management","Lifecycle"]
relatedConcepts: ["fsm-concept-phase-governance","fsm-change-configuration-reuse","fsm-safety-case"]
linkedQuestions: ["D2Q9","D4Q5","D10Q4"]
references: ["ISO 26262-2:2018","ISO 26262-3:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Explain why a change can require re-entry at an earlier point in the safety lifecycle.
- Structure an impact analysis across item, hazards, requirements, architecture, analyses, tests and released evidence.
- Distinguish a local implementation update from a change to intended functionality or operating context.
- Define governance for approving, constraining and communicating safety-relevant changes.

## Concept

Safety-lifecycle re-entry is the controlled return to the earliest lifecycle activity affected by a change. The correct re-entry point is determined by safety impact, not by the organizational team that requested the change or by how small the code or calibration diff appears.

Changes to modes, limits, timing, interfaces, assumptions, vehicle variants, suppliers or intended behavior can invalidate concept-phase reasoning. Impact analysis follows the dependency chain from the change to item definition and HARA, then through safety concepts, requirements, architecture, analyses, verification, validation, production/service controls and the safety case.

The management process should classify urgency and risk, freeze affected baselines where necessary, assign analysis owners, define required rework and independent review, and prevent release of a mixed configuration. Re-entry is complete only when affected evidence is regenerated or explicitly justified.

## Why it matters

Many serious safety gaps arise from changes treated as local. A calibration update can change reaction time; a sport mode can change controllability; a gateway update can invalidate timing and freshness assumptions. Without lifecycle re-entry, downstream evidence remains internally consistent with an obsolete context.

Disciplined impact analysis also avoids unnecessary full redevelopment. It identifies exactly which assumptions and work products are affected and records why unaffected evidence remains valid.

## Inputs

- Controlled change request with motivation, affected variants and proposed implementation.
- Current item, HARA, safety concepts, requirements, architecture and analysis baselines.
- Configuration records for software, hardware, calibration, tools and supplier components.
- Open anomalies, field information and prior change history.
- Release schedule, verification resources and confirmation-measure needs.

## Activities

- Classify whether intended behavior, operating context, interfaces or assumptions change.
- Trace impacts upward to hazards and goals and downward to implementation and tests.
- Identify evidence invalidated by timing, architecture, supplier, variant or tool changes.
- Define lifecycle re-entry point, responsibilities, reviews and regression scope.
- Control implementation and release baselines until impact actions are complete.
- Update the safety case and communicate changed obligations to all affected parties.

## Outputs and evidence

- Approved safety impact analysis and lifecycle re-entry decision.
- Updated work-product and evidence plan.
- Revised baselines, trace links and supplier obligations.
- Targeted and regression verification/validation results.
- Safety-case update and release disposition for the changed configuration.

## Automotive example

A new sport ESC mode permits higher sideslip before intervention. Although implemented mainly through calibration, the mode changes intended vehicle response and may change controllability. The impact analysis therefore re-enters at item definition and HARA, then updates FSC/TSC limits, monitor thresholds, mode-transition requirements, validation scenarios and driver information.

The release board receives one integrated package showing the changed assumptions, affected variants, test evidence and residual risks rather than a calibration approval detached from the safety lifecycle.

## Common mistakes

- Using code size or cost as the measure of safety impact.
- Re-entering only at the implementation phase that owns the change.
- Running regression tests without checking whether requirements and hazards changed.
- Failing to invalidate evidence tied to an old configuration or assumption.
- Approving a change before supplier and vehicle-level impacts are understood.
