---
id: software-unit-design-and-implementation
title: Software Unit Design and Implementation
module: iso26262-software-level
collection: functional-safety-software
order: 4
standard: {"family":"ISO 26262","edition":"2018","parts":["6"],"clauseRefs":["ISO 26262-6:2018 Clause 8"]}
difficulty: Intermediate
stage: 4
systems: ["Automotive embedded software","Safety-related ECU software","ADAS and chassis control systems"]
relatedConcepts: ["software-architectural-design","software-unit-verification","model-based-development-in-software-safety"]
linkedQuestions: ["Q_SW_UNIT_DESIGN_001","Q_DEFENSIVE_PROGRAMMING_001"]
references: ["ISO 26262-Part6-10.pdf pages 29-39"]
---

## Learning objectives

- Translate architectural elements into software unit design
- Identify notations suitable for unit design
- Apply unit-level design principles such as one entry and exit, no recursion, strong typing and defensive programming
- Recognize construction concerns for resources, scheduling, loops, communication and plausibility checks

## Concept

Develop detailed software unit design from the architecture and implement software units using design and coding principles that improve robustness, testability, readability, and verifiability.

Software unit design is developed from the software architecture and can be represented using natural language, informal, semi-formal, or formal notations. In model-based development, the functional model may serve as the basis for code generation.

Implementation can be manual or automatically generated from the unit design in accordance with the software development environment.

Design principles target correct execution order, interface consistency, correct data and control flow, simplicity, readability, robustness, suitability for modification, and verifiability.

Construction concerns include shared-resource control, deterministic scheduling, feedback and feed-forward loop safety, inter-CPU communication monitoring, and plausibility checks before executing safety-critical functions.

## Why it matters

Unit design is the point where architecture becomes code; weak unit design directly causes implementation defects and test gaps.

Robust unit design prevents common embedded failures such as division by zero, invalid inputs, uncontrolled pointers, deadlocks, stack issues and timing violations.

## Inputs

- Software architectural design specification
- Software safety requirements allocated to software units
- Hardware-software interface specification
- Target hardware constraints
- Coding guidelines
- Software development environment documentation

## Activities

- Create software unit design specification
- Select suitable notation based on ASIL and complexity
- Implement software units manually or by code generation
- Apply coding and modelling guidelines
- Apply defensive programming and resource-control mechanisms
- Perform unit design verification using walkthrough, inspection, control-flow analysis and data-flow analysis

## Outputs and evidence

- Software unit design specification
- Software unit implementation
- Source code specification
- Refined software verification specification

## Automotive example

A brake-control unit design specifies input range checks, initialized state variables, no recursion, bounded execution time, semaphore-protected shared buffers, and CRC-protected inter-processor messages.

## Common mistakes

- Implementing code before unit design is complete
- Using implicit type conversions or uncontrolled pointers in safety-related code
- Ignoring peak-load scheduling behavior
- Skipping plausibility checks on safety-critical inputs
- Assuming auto-generated code is automatically robust
