---
id: fsm-overview
title: Functional Safety Management Overview
module: safety
collection: functional-safety-management
order: 1
standard: {"family":"ISO 26262","edition":"2018","parts":["2","8","10"],"clauseRefs":["ISO 26262-2","ISO 26262-8","ISO 26262-10"]}
difficulty: Foundation
stage: 1
systems: ["FSM","Lifecycle"]
relatedConcepts: ["fsm-safety-culture","fsm-safety-plan","fsm-confirmation-measures","fsm-safety-case"]
linkedQuestions: ["D1Q1","D1Q2","D1Q10"]
references: ["ISO 26262-2:2018","ISO 26262-8:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Explain why functional safety needs an explicit management system in addition to technical engineering.
- Distinguish organization-level governance from project-specific safety management.
- Relate safety planning, confirmation measures and the safety case to lifecycle decisions.
- Identify how management activities continue into production, operation, service and decommissioning.

## Concept

Functional Safety Management establishes the governance, responsibilities, planning, monitoring and decision-making needed to achieve and maintain functional safety. It does not replace HARA, architecture, safety analysis, verification or validation. It makes those technical activities coordinated, reviewable and connected to an accountable release decision.

The management model operates at more than one level. Organization-level measures create policy, competence, authority and a safety culture. Project-dependent measures tailor the lifecycle, assign responsibilities, plan work products and confirmation activities, monitor progress and resolve deviations. Management also continues after development because production, service actions, field observations and changes can affect the validity of the safety argument.

A useful mental model is a closed loop: plan the safety work, execute the technical lifecycle, collect evidence, independently challenge important results, decide whether the evidence is sufficient, and feed changes or field findings back into the lifecycle.

## Why it matters

Complex vehicle functions cross organizational, supplier, hardware, software and validation boundaries. Without explicit ownership and controlled interfaces, individually correct work products can still be inconsistent, late, based on different configurations or unsupported by evidence.

Functional Safety Management makes unresolved assumptions, anomalies, missing evidence and schedule conflicts visible before they become release risks. It also provides the authority needed to stop, re-plan or constrain a release when the safety case is not convincing.

## Inputs

- Organizational functional-safety policy and governance model.
- Item scope, lifecycle scope, ASIL context and project constraints.
- Development responsibilities across OEM, suppliers and internal teams.
- Applicable processes, work products, confirmation measures and competence needs.
- Production, service, field-monitoring and change-management interfaces.

## Activities

- Define roles, authority, escalation paths and independence.
- Tailor and plan the applicable safety lifecycle.
- Allocate activities, work products, milestones and evidence responsibilities.
- Monitor safety progress, anomalies, assumptions and configuration status.
- Plan and perform confirmation reviews, audits and assessments.
- Build and maintain the safety case progressively.
- Support release, production, operation, service and lifecycle re-entry decisions.

## Outputs and evidence

- Functional-safety plan and responsibility assignments.
- Development-interface agreements and supplier commitments where applicable.
- Competence and resource records.
- Confirmation-measure plans, findings and closure evidence.
- Safety-case structure, evidence status and open-risk register.
- Safety-management reports and release recommendations.
- Records showing how changes and field findings were assessed.

## Automotive example

For an integrated brake and ESC controller, the management layer coordinates the HARA owner, system architect, hardware and software teams, vehicle-validation team and ECU supplier. It defines who owns safety goals, timing assumptions, degraded modes, supplier evidence and vehicle-level validation. When a late calibration change affects wheel-speed filtering, the management process ensures that the impact is assessed across requirements, control performance, diagnostics, analyses, tests and the released configuration before approval.

## Common mistakes

- Treating functional safety management as document administration.
- Assuming that a compliant process automatically proves product safety.
- Building the safety case only at the end of development.
- Leaving supplier responsibilities or assumptions implicit.
- Allowing schedule pressure to suppress anomalies or weaken independent judgment.
- Considering release as the end of the safety lifecycle.
