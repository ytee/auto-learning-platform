---
id: embedded-software-testing
title: Testing of the Embedded Software
module: iso26262-software-level
collection: functional-safety-software
order: 8
standard: {"family":"ISO 26262","edition":"2018","parts":["6"],"clauseRefs":["ISO 26262-6:2018 Clause 11"]}
difficulty: Intermediate
stage: 8
systems: ["Automotive embedded software","Safety-related ECU software","ADAS and chassis control systems"]
relatedConcepts: ["software-integration-and-verification","software-safety-requirements-specification"]
linkedQuestions: ["Q_EMBEDDED_SW_TEST_001","Q_TARGET_ENV_001"]
references: ["ISO 26262-Part6-10.pdf pages 57-59"]
---

## Learning objectives

- State the purpose of embedded-software testing
- Identify suitable test environments for final software safety verification
- Explain why target-hardware execution is required
- Evaluate test results against expected results and software safety requirements coverage

## Concept

Verify that the fully integrated embedded software fulfils software safety requirements in the target environment and contains no undesired safety-relevant functionality or properties.

Testing of embedded software verifies that safety-related requirements are fulfilled when the software executes in the target environment.

Verification of software safety requirements is planned, specified and executed in suitable environments such as hardware-in-the-loop, ECU network environments, lab cars, mule vehicles, rest-of-bus simulations or vehicles.

Verification of embedded software safety requirements is executed on target hardware and evaluated for compliance with expected results and coverage of software safety requirements.

## Why it matters

Final target-environment testing confirms that integrated software behaves safely under realistic hardware, network and vehicle conditions.

It provides release-level evidence that complements unit and integration verification.

## Inputs

- Integrated embedded software
- Software safety requirements specification
- Software verification specification
- Target hardware
- Hardware-in-the-loop or vehicle test environment
- Expected results and acceptance criteria

## Activities

- Plan embedded-software safety verification
- Specify target-environment test cases
- Execute tests on target hardware
- Use HIL, ECU network benches, lab cars, mule vehicles or production vehicles as appropriate
- Evaluate results against expected behavior and requirements coverage

## Outputs and evidence

- Validated embedded software test results
- Software verification report
- Software safety requirements coverage evidence
- Release verification evidence

## Automotive example

A lane-keeping ECU is tested on target hardware in HIL and vehicle environments to verify diagnostics, degraded-mode transitions, timing, communication loss handling and safety requirement coverage.

## Common mistakes

- Treating simulator-only testing as sufficient final evidence
- Not executing software safety verification on target hardware
- Evaluating pass or fail without checking requirements coverage
- Ignoring vehicle operating modes and network environments
