---
id: fsm-system-architecture-governance
title: System Safety Architecture Governance
module: safety
collection: functional-safety-management
order: 8
standard: {"family":"ISO 26262","edition":"2018","parts":["2","4","8","9"],"clauseRefs":["ISO 26262-2 project safety management","ISO 26262-4 system-level product development","ISO 26262-9 ASIL-oriented analyses"]}
difficulty: Advanced
stage: 3
systems: ["FSM","System Architecture","Review"]
relatedConcepts: ["fsm-concept-phase-governance","fsm-controlled-technical-baselines","fsm-safety-analysis-governance"]
linkedQuestions: ["D3Q5","D3Q7","D3Q10"]
references: ["ISO 26262-2:2018","ISO 26262-4:2018","ISO 26262-8:2018","ISO 26262-9:2018"]
---

## Learning objectives

- Define management gates for the Technical Safety Concept and system safety architecture.
- Explain how architecture reviews combine requirement allocation, timing, independence, interfaces and verification feasibility.
- Recognize governance responsibilities for cross-domain architectural decisions.
- Describe how major architecture findings are tracked to closure.

## Concept

System safety architecture governance turns the Functional Safety Concept into an approvable technical baseline. It coordinates system architects, vehicle-domain experts, hardware, software, network, power, actuator and supplier teams so that safety requirements are allocated consistently and failure behavior is designed deliberately.

The key management mechanism is a sequence of technical decision gates rather than one final architecture review. Early reviews establish allocation principles and external interfaces. Later reviews challenge fault containment, timing budgets, independence, degraded states, hardware-software interaction and verification feasibility. Decisions that affect safety goals or assumptions are escalated to the appropriate lifecycle level.

Approval requires more than a complete diagram. The architecture must have traceable requirements, named owners, controlled assumptions, analysis results, interface contracts and actionable verification criteria. Findings are classified by safety impact, assigned and closed with evidence.

## Why it matters

Cross-domain safety mechanisms often fail at boundaries: a software monitor depends on the same data as the controller, redundant channels share power, or a reaction budget omits actuator settling. Governance provides the forum and authority to expose these dependencies before implementation hardens them.

A controlled architecture baseline also prevents teams from implementing different interpretations of safe state, timing, validity or independence.

## Inputs

- Approved safety goals, FSC, FSRs and concept-phase assumptions.
- System context, variants, interfaces, platform constraints and supplier capabilities.
- Preliminary TSC, system architecture and requirement allocations.
- Timing, fault-tolerance, availability and independence targets.
- Safety analyses, feasibility studies and verification strategy.

## Activities

- Plan architecture review gates and required multidisciplinary participation.
- Review end-to-end allocation of every safety requirement and external measure.
- Challenge normal, degraded, emergency and safe-state transitions.
- Review FTTI budgets, shared resources, dependent failures and decomposition claims.
- Resolve hardware-software, network, power and supplier interface ownership.
- Track blocking findings and baseline the approved TSC and architecture.

## Outputs and evidence

- Approved TSC and system safety architecture baseline.
- Allocated technical safety requirements and interface ownership.
- Architecture decision records with assumptions and trade-offs.
- Review findings, closure evidence and escalation records.
- Verification, integration and supplier evidence expectations.

## Automotive example

An ESC design proposes two yaw-processing channels implemented as separate algorithms on the same ECU. The architecture gate does not accept “different software” as sufficient independence. It requires analysis of shared power, clock, memory, communication, calibration, requirements and tools, plus a defined inhibit path and verification plan.

The final decision record states whether decomposition is claimed, which dependencies remain, what DFA evidence is required and which finding blocks implementation.

## Common mistakes

- Approving architecture from functional diagrams without failure behavior.
- Treating hardware, software, network and actuator reviews as independent approvals.
- Accepting redundancy labels without analyzing common dependencies.
- Deferring timing and verification feasibility until integration.
- Closing major findings through wording changes instead of design or evidence.
