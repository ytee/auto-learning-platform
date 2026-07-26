---
id: fsm-safety-plan
title: Safety Plan
module: safety
collection: functional-safety-management
order: 3
standard: {"family":"ISO 26262","edition":"2018","parts":["2","8"],"clauseRefs":["ISO 26262-2","ISO 26262-8"]}
difficulty: Foundation
stage: 1
systems: ["FSM","Planning","Supplier"]
relatedConcepts: ["fsm-overview","fsm-safety-culture","fsm-confirmation-measures","fsm-safety-case"]
linkedQuestions: ["D1Q2","D4Q5","D4Q6"]
references: ["ISO 26262-2:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Explain the purpose of a project-specific safety plan.
- Identify the responsibilities, activities, milestones and evidence that the plan must control.
- Distinguish the safety plan from a general project schedule.
- Explain why the plan must evolve when scope, architecture, suppliers or evidence change.

## Concept

The safety plan is the controlled project view of how functional-safety activities will be performed. It translates the applicable lifecycle into assigned work, milestones, dependencies, work products, reviews, confirmation measures and release expectations.

A useful safety plan is tailored to the item and development context. It identifies what is applicable, who is responsible, when outputs are expected, which configuration they belong to and how completion will be judged. It also covers external dependencies such as supplier deliveries, vehicle integration, production preparation and service information.

The plan is a living control mechanism. When the item boundary, architecture, ASIL allocation, supplier responsibility, toolchain or release configuration changes, the plan and affected evidence expectations must be reviewed. A baseline copied from another project is only a starting point.

## Why it matters

Functional-safety work is highly interdependent. A late HARA decision can affect architecture, supplier requirements, analyses and vehicle tests. Without an integrated plan, teams may complete local deliverables while critical lifecycle dependencies remain unresolved.

The safety plan gives management a way to distinguish real completion from percentage reporting. It makes entry criteria, exit criteria, open findings and evidence dependencies visible at each safety milestone.

## Inputs

- Item definition, project scope and applicable lifecycle phases.
- ASIL context and safety responsibilities.
- Organizational processes and tailoring rules.
- Development-interface agreements and supplier plans.
- Project milestones, variants and release strategy.
- Required work products, reviews, verification and validation activities.
- Planned confirmation measures and independence needs.

## Activities

- Determine applicable safety activities and permitted tailoring.
- Allocate owners, contributors, reviewers and approvers.
- Define work products, dependencies, milestones and acceptance criteria.
- Integrate supplier, integration, validation, production and service activities.
- Plan configuration, change, anomaly and evidence management.
- Track deviations, delayed inputs and invalidated evidence.
- Update the plan after relevant technical or organizational change.

## Outputs and evidence

- Approved and version-controlled safety plan.
- Responsibility and interface matrix.
- Milestone and work-product schedule.
- Confirmation-measure schedule and independence assignments.
- Supplier evidence and review plan.
- Entry and exit criteria for safety gates.
- Status reports, deviations, replanning decisions and closure records.

## Automotive example

For a brake-by-wire ECU, the safety plan connects the OEM HARA and vehicle-validation milestones with the supplier's TSC, hardware metrics, software verification and safety-manual deliveries. If the OEM changes the degraded braking strategy, the plan identifies which requirements, supplier analyses, HIL tests, vehicle tests and confirmation reviews must be repeated before release.

## Common mistakes

- Treating the safety plan as a one-time document created for an audit.
- Copying activities from a previous project without item-specific tailoring.
- Omitting supplier assumptions, evidence access or escalation deadlines.
- Tracking document delivery without defining technical acceptance criteria.
- Failing to re-plan after changes invalidate completed evidence.
- Keeping the safety plan separate from the real project decision process.
