---
id: fsm-safety-culture
title: Safety Culture
module: safety
collection: functional-safety-management
order: 2
standard: {"family":"ISO 26262","edition":"2018","parts":["2"],"clauseRefs":["ISO 26262-2"]}
difficulty: Foundation
stage: 1
systems: ["FSM","Leadership"]
relatedConcepts: ["fsm-overview","fsm-safety-plan","fsm-confirmation-measures"]
linkedQuestions: ["D1Q9"]
references: ["ISO 26262-2:2018"]
---

## Learning objectives

- Describe safety culture as observable organizational behavior rather than a slogan.
- Explain the relationship between authority, competence, escalation and transparent reporting.
- Recognize behaviors that weaken functional-safety decisions even when templates are complete.
- Identify practical actions that protect independent engineering judgment.

## Concept

Safety culture is the set of shared values, expectations and behaviors that makes functional safety a genuine decision criterion. It is visible in how people raise concerns, how leaders respond to inconvenient evidence, how responsibilities are assigned and whether safety findings can influence schedule and release decisions.

A strong safety culture gives competent people enough authority to perform their responsibilities and escalate unresolved risks. It expects assumptions, anomalies, uncertainty and negative test results to be recorded rather than hidden. It also separates constructive challenge from personal blame so that teams can expose weaknesses early.

Safety culture is reinforced through governance: clear policy, defined roles, competence development, independent review, protected escalation paths and leadership decisions that are consistent with the stated safety objectives.

## Why it matters

Safety engineering depends on incomplete information, judgment and cross-functional negotiation. A technically mature process can fail when people are discouraged from questioning optimistic assumptions or reporting evidence gaps.

The cost of a weak culture is often delayed discovery. A concern suppressed during architecture may reappear during vehicle validation, production or field operation when correction is more difficult and the safety case is already under schedule pressure.

## Inputs

- Organizational functional-safety policy.
- Leadership expectations and decision criteria.
- Defined roles, authority and escalation channels.
- Competence requirements and training plans.
- Anomaly, issue and change-management processes.

## Activities

- Communicate that safety concerns must be raised and assessed.
- Give safety roles authority proportional to their accountability.
- Train teams to distinguish evidence, assumptions and unresolved uncertainty.
- Review whether schedule, cost or hierarchy is distorting safety decisions.
- Protect independent reviews and escalation from retaliation or suppression.
- Use lessons learned and field feedback to improve organizational behavior.

## Outputs and evidence

- Published policy and governance expectations.
- Role descriptions with decision and escalation authority.
- Competence records and development actions.
- Traceable anomaly and escalation records.
- Management-review decisions showing how safety concerns were resolved.
- Lessons-learned actions and evidence of organizational follow-through.

## Automotive example

During ESC validation, an engineer finds that a shared inertial-sensor failure can defeat two supposedly independent monitoring paths. A healthy safety culture records the issue, pauses the affected safety claim, involves architecture and analysis owners and escalates the release impact. An unhealthy culture asks the engineer to classify the result as a test limitation so the milestone remains green.

## Common mistakes

- Equating safety culture with annual training or posters.
- Giving a Functional Safety Manager accountability without authority.
- Measuring teams only against schedule and defect-closure targets.
- Treating dissent as lack of cooperation.
- Closing findings administratively without verifying the corrective action.
- Assuming that an absence of reported concerns means an absence of safety risk.
