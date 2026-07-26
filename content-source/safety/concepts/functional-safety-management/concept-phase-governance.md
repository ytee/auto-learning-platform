---
id: fsm-concept-phase-governance
title: Concept-Phase Safety Governance
module: safety
collection: functional-safety-management
order: 6
standard: {"family":"ISO 26262","edition":"2018","parts":["2","3","8","10"],"clauseRefs":["ISO 26262-2 project-dependent safety management","ISO 26262-3 concept phase","ISO 26262-8 supporting processes"]}
difficulty: Intermediate
stage: 2
systems: ["FSM","HARA","FSC"]
relatedConcepts: ["fsm-safety-plan","fsm-impact-analysis-lifecycle-reentry","fsm-system-architecture-governance"]
linkedQuestions: ["D2Q1","D2Q4","D2Q5","D2Q6","D2Q10"]
references: ["ISO 26262-2:2018","ISO 26262-3:2018","ISO 26262-8:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Explain the Functional Safety Manager’s responsibilities during item definition, HARA and development of the Functional Safety Concept.
- Define management entry and exit criteria for concept-phase work products.
- Recognize when assumptions, operating modes, variants and external measures need named owners and verification plans.
- Connect concept-phase decisions to later architecture, supplier and validation evidence.

## Concept

Concept-phase safety governance ensures that item definition, HARA, safety goals and the Functional Safety Concept are developed as a coherent decision chain rather than as isolated documents. The management task is to establish scope, ownership, competence, review strategy, configuration and evidence expectations before detailed design begins.

The Functional Safety Manager does not perform every technical analysis. The role is to make sure the right specialists participate, important assumptions are explicit, disagreements are resolved transparently and work products are approved against defined criteria. The safety plan should identify who owns the item boundary, hazardous-event completeness, S/E/C rationale, safety-goal wording, safe-state and availability decisions, and validation assumptions.

A mature concept phase ends with a controlled baseline that later teams can use. Safety goals, ASILs, functional safety requirements, preliminary allocations, external measures and unresolved issues must be traceable to the item and operating context. Open points may remain, but they need owners, due dates, impact classification and constraints on downstream work.

## Why it matters

Errors made during the concept phase propagate widely. An incomplete item boundary can omit interfaces; weak HARA rationale can produce the wrong ASIL; a vague safety goal can generate inconsistent hardware and software requirements. Later testing cannot compensate for a concept that never identified the relevant risk.

Governance also protects technical independence. Schedule pressure, product positioning or architectural preference must not silently bias hazard classification, controllability assumptions or safety-goal wording.

## Inputs

- Approved project scope, intended functionality, variants, operating modes and external interfaces.
- Organizational safety policy, competence assignments and the project safety plan.
- Vehicle-domain knowledge, field experience, regulatory constraints and stakeholder assumptions.
- Existing platform, supplier, reuse and external-measure constraints.
- Defined review, confirmation and configuration-management arrangements.

## Activities

- Confirm the item-definition boundary and interface ownership.
- Plan HARA workshops with appropriate vehicle, control, system, safety and human-factors competence.
- Define review criteria for hazardous-event completeness, S/E/C consistency and safety-goal quality.
- Assign owners to assumptions, external measures, safe states, availability and validation needs.
- Baseline approved concept work products and record unresolved issues.
- Communicate concept constraints to system, hardware, software, supplier and validation teams.

## Outputs and evidence

- Approved item definition and concept-phase work-product baseline.
- Reviewed HARA with decision rationale and controlled assumptions.
- Safety goals and Functional Safety Concept with ownership and traceability.
- Concept-phase review records, actions and deviation decisions.
- Downstream constraints, validation needs and supplier interface expectations.

## Automotive example

For an integrated brake and ESC item, the project initially excludes the gateway and power supply from the item boundary. Concept-phase governance requires explicit external-interface assumptions for message timing, power interruption, reset behavior and diagnostics. During HARA review, experts disagree about controllability of a short unintended rear-wheel brake pulse. The Functional Safety Manager records the competing evidence, requests vehicle-dynamics support and prevents the classification from being closed merely to protect the schedule.

Before stage exit, the approved baseline states the hazardous events, safety goals, availability expectations, safe/degraded behavior and validation assumptions that later architecture teams must preserve.

## Common mistakes

- Treating HARA approval as a meeting signature rather than a technical decision gate.
- Allowing architecture choices to predetermine hazard descriptions or safety goals.
- Leaving variants, modes, external measures or affected road users implicit.
- Using warnings as a controllability argument without evidence and ownership.
- Starting detailed implementation while concept assumptions and safety goals remain unstable.
