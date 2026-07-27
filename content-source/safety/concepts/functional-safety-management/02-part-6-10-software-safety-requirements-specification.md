---
id: software-safety-requirements-specification
title: Software Safety Requirements Specification
module: iso26262-software-level
collection: functional-safety-software
order: 2
standard: {"family":"ISO 26262","edition":"2018","parts":["6"],"clauseRefs":["ISO 26262-6:2018 Clause 6","ISO 26262-8:2018 Clause 6"]}
difficulty: Intermediate
stage: 2
systems: ["Automotive embedded software","Safety-related ECU software","ADAS and chassis control systems"]
relatedConcepts: ["software-development-environment-planning","software-architectural-design","software-unit-verification"]
linkedQuestions: ["Q_SW_SAFETY_REQ_001","Q_TRACEABILITY_001"]
references: ["ISO 26262-Part6-10.pdf pages 6-12"]
---

## Learning objectives

- Derive software safety requirements from technical safety requirements
- List typical attributes of software safety requirements
- Explain required quality properties such as traceability, completeness, and consistency
- Select verification methods for requirements based on ASIL and complexity

## Concept

Specify software safety requirements derived from technical safety requirements allocated to software, including safety functions, monitoring, safe-state behavior, interfaces, timing, and operating modes.

Software safety requirements are derived directly from technical safety requirements allocated to software or from software functions and properties whose violation could break the allocated technical safety requirements.

Typical content includes functions for safe execution, safe or degraded state achievement, hardware fault detection and mitigation, self-test and monitoring of software or operating-system failures, production and service tests, software modification control, and time-critical behavior.

The requirements specification should demonstrate hierarchical structure, vertical and horizontal traceability, completeness, external consistency, and internal consistency.

Verification provides evidence that software safety requirements are precise, clear, feasible, consistent, understandable, verifiable, and compliant with the technical safety requirements, system design, and relevant hardware safety requirements.

## Why it matters

Software safety requirements are the bridge between system safety intent and implementable software behavior.

Poorly specified safety requirements propagate faults into architecture, unit design, integration tests, and final embedded-software validation.

## Inputs

- Technical safety requirements specification
- Technical safety concept
- System architectural design specification
- Hardware-software interface specification
- Documentation of the software development environment
- Hardware design specification
- Specification of non-safety-related functions
- Specification of software properties

## Activities

- Derive software safety requirements
- Specify ASIL and operating modes
- Specify interfaces, timing and resource constraints
- Assign safety-related and non-safety-related functions
- Verify requirements using walkthrough, inspection, semi-formal or formal methods

## Outputs and evidence

- Software safety requirements specification
- Software verification report
- Updated traceability to system safety requirements

## Automotive example

For automated emergency braking, software safety requirements specify sensor plausibility checks, brake request timing, degraded-state behavior, diagnostic reporting, and ASIL allocation for each safety function.

## Common mistakes

- Writing vague requirements that cannot be verified
- Omitting timing constraints and operating-mode transitions
- Missing horizontal traceability between software and hardware requirements
- Forgetting requirements for diagnostics, monitoring, production, service, or software update behavior
