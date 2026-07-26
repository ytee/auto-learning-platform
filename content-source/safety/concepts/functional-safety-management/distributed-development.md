---
id: fsm-distributed-development
title: Distributed Development and Development Interface Agreements
module: safety
collection: functional-safety-management
order: 10
standard: {"family":"ISO 26262","edition":"2018","parts":["2","8","10"],"clauseRefs":["ISO 26262-2 distributed safety management","ISO 26262-8 distributed development","ISO 26262-10 guidance"]}
difficulty: Advanced
stage: 4
systems: ["FSM","Supplier","DIA"]
relatedConcepts: ["fsm-safety-plan","fsm-change-configuration-reuse","fsm-hardware-safety-management","fsm-software-safety-management"]
linkedQuestions: ["D4Q6","D4Q9","D10Q5"]
references: ["ISO 26262-2:2018","ISO 26262-8:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Explain how safety responsibilities are divided across customer, supplier and third parties.
- Define the content and governance purpose of a Development Interface Agreement.
- Manage proprietary evidence without losing item-level assurance.
- Establish escalation and acceptance criteria for supplier safety work products.

## Concept

Distributed development requires explicit allocation of safety lifecycle activities, work products, assumptions, interfaces and evidence across organizations. The Development Interface Agreement is the operational contract that turns this allocation into named responsibilities, milestones, formats, review rights, change rules and escalation paths.

The DIA should cover more than document delivery. It addresses safety requirements and ASIL context, analysis ownership, integration and validation responsibilities, configuration and tool information, anomaly communication, competence, production/service obligations and access to evidence needed for the item safety case.

Proprietary restrictions may change the form of evidence but do not remove the integrator’s responsibility. Acceptable alternatives can include safety manuals, structured summaries, independent assessment reports, controlled on-site reviews or interface-level demonstrations, provided they support the required claim.

## Why it matters

Supplier gaps often appear late because responsibilities were assumed rather than agreed. A component certificate cannot establish that item-specific timing, interfaces, assumptions and configuration are correct.

Strong distributed management also makes escalation objective. Missed work products are evaluated against agreed acceptance criteria and program risk, not personal relationships or commercial pressure.

## Inputs

- Item safety goals, allocated requirements and supplier scope.
- Organizational responsibilities, commercial boundaries and confidentiality constraints.
- Supplier safety plan, processes, competence and product safety information.
- Integration, verification, validation and release milestones.
- Production, service, change and anomaly-management needs.

## Activities

- Allocate lifecycle activities, work products and safety decisions between parties.
- Define information content, formats, review criteria and delivery dates.
- Agree assumptions, external measures, interfaces and configuration identification.
- Define anomaly, change, escalation and evidence-access processes.
- Review supplier progress and findings against the integrated safety plan.
- Accept, conditionally accept or reject evidence using documented criteria.

## Outputs and evidence

- Approved DIA and responsibility matrix.
- Supplier safety plan alignment and milestone commitments.
- Controlled interface, assumption and configuration records.
- Supplier review findings, actions and escalation decisions.
- Accepted evidence package for integration and the item safety case.

## Automotive example

An ESC ECU supplier receives ASIL-D requirements but not the vehicle safety goals or use assumptions. The supplier explains that safe state, timing and verification cannot be interpreted without minimum context. Through the DIA, the OEM provides controlled safety context, while proprietary vehicle details remain protected.

Later, the supplier cannot release internal FMEDA details. The parties agree on an independent review report, safety manual, failure-rate summary and controlled evidence review. The integrator records remaining limitations rather than treating confidentiality as automatic acceptance.

## Common mistakes

- Using a purchase specification as a substitute for a DIA.
- Allocating deliverables without allocating decisions and assumptions.
- Accepting certificates without item-specific integration evidence.
- Leaving anomaly and change notification thresholds undefined.
- Discovering proprietary-evidence constraints only at assessment or release.
