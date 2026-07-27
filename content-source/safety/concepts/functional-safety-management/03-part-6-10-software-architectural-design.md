---
id: software-architectural-design
title: Software Architectural Design
module: iso26262-software-level
collection: functional-safety-software
order: 3
standard: {"family":"ISO 26262","edition":"2018","parts":["6"],"clauseRefs":["ISO 26262-6:2018 Clause 7"]}
difficulty: Advanced
stage: 3
systems: ["Automotive embedded software","Safety-related ECU software","ADAS and chassis control systems"]
relatedConcepts: ["software-safety-requirements-specification","freedom-from-interference","software-integration-and-verification"]
linkedQuestions: ["Q_SW_ARCH_001","Q_FFI_001"]
references: ["ISO 26262-Part6-10.pdf pages 13-28"]
---

## Learning objectives

- Explain static and dynamic aspects of software architecture
- Apply architectural principles such as modularity, encapsulation, cohesion, low coupling and scheduling control
- Describe freedom from interference for mixed-ASIL software
- Identify architectural verification methods

## Concept

Develop and verify a software architecture that satisfies software safety requirements, allocates requirements to components, supports implementation and verification, manages complexity, and handles ASIL coexistence through freedom from interference.

Software architecture represents software elements and their interactions in a hierarchical structure, including static aspects such as component interfaces and dynamic aspects such as process sequences and timing behavior.

The architecture should satisfy safety and non-safety software requirements in one development process and provide a structure that supports detailed design, implementation, and verification.

Architecture should allocate software safety requirements to components; consider cohesiveness, low coupling, hierarchical structure, restricted component and interface size, scheduling properties, spatial isolation, shared-resource management, and error detection and handling.

Where components of different ASILs or safety and non-safety components coexist, the software is treated according to the highest ASIL unless freedom from interference is demonstrated.

## Why it matters

Architecture controls how requirements become implementable components and how mixed-criticality software can safely coexist.

Architectural weaknesses often appear later as timing failures, memory corruption, resource conflicts, or integration defects.

## Inputs

- Documentation of the software development environment
- Refined hardware-software interface specification
- Software safety requirements specification
- Technical safety concept
- System architectural design specification
- Qualified software components
- Specification of non-safety-related functions and software properties

## Activities

- Define static architecture including components, interfaces, data types, global variables and constraints
- Define dynamic architecture including event chains, data flow, control flow, concurrency and timing
- Allocate software safety requirements to software components
- Apply modularity, encapsulation, cohesion and low-coupling principles
- Analyze freedom from interference and shared-resource access
- Verify architecture by inspection, control-flow analysis, data-flow analysis, simulation, scheduling analysis or formal verification

## Outputs and evidence

- Software architectural design specification
- Safety analysis report
- Dependent failure analysis report
- Software verification report

## Automotive example

An electronic stability control ECU separates wheel-speed processing, yaw-rate plausibility, brake-pressure control, diagnostics, and communication services into components with explicit interfaces and timing budgets.

## Common mistakes

- Mixing ASIL and QM components without freedom-from-interference evidence
- Ignoring dynamic behavior such as scheduling and timing
- Using global variables without architectural control
- Creating tightly coupled components that hinder verification
- Treating architecture as a diagram only, without interface, data-flow and timing details
