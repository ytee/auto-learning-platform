---
id: fsm-hardware-safety-management
title: Hardware Safety Lifecycle Management
module: safety
collection: functional-safety-management
order: 14
standard: {"family":"ISO 26262","edition":"2018","parts":["2","5","8","9","11"],"clauseRefs":["ISO 26262-2 project safety management","ISO 26262-5 hardware development","ISO 26262-8 distributed/supporting processes","ISO 26262-11 semiconductor guidance"]}
difficulty: Advanced
stage: 6
systems: ["FSM","Hardware","Supplier"]
relatedConcepts: ["fsm-distributed-development","fsm-random-hardware-evidence-governance","fsm-tool-integration-governance"]
linkedQuestions: ["D6Q1","D6Q6","D6Q10"]
references: ["ISO 26262-2:2018","ISO 26262-5:2018","ISO 26262-8:2018","ISO 26262-9:2018","ISO 26262-11:2018"]
---

## Learning objectives

- Plan and govern hardware safety development from HSR allocation through integration evidence.
- Coordinate semiconductor and hardware supplier evidence with item-specific responsibilities.
- Define hardware review gates, configuration control and hardware-software interface ownership.
- Identify red flags that require escalation rather than acceptance of vendor claims.

## Concept

Hardware safety lifecycle management coordinates HSR derivation, hardware architecture, safety mechanisms, analyses, metrics, integration and verification. It ensures that hardware and software responsibilities meet at a controlled HSI and that supplier evidence is adapted to the actual item.

Semiconductor safety manuals, FMEDAs and certificates are inputs, not final evidence. The project maps item HSRs to device mechanisms, verifies Assumptions of Use, configures watchdogs, ECC, clock, reset and fault reporting, and demonstrates software handling and reaction timing.

Management gates confirm that schematics, layout, BOM, device derivative, safety configuration, failure data and test evidence all refer to the same baseline. Errata, supplier changes and manufacturing variants are treated through impact and configuration control.

## Why it matters

Random hardware metrics can look strong while the integration violates key assumptions or the released device configuration differs from the analysis.

Hardware decisions also create long lead-time constraints. Early governance is needed to resolve safety gaps before PCB, tooling or supplier commitments become difficult to change.

## Inputs

- TSRs, HSRs, TSC and HSI responsibilities.
- Hardware architecture, schematics, layout and component selection.
- Supplier safety manual, FMEDA, failure data, errata and AoU.
- Software diagnostic and fault-reaction responsibilities.
- Hardware verification, environmental and production-test strategy.

## Activities

- Plan HSR and hardware-architecture reviews with system/software participation.
- Map item requirements to component mechanisms and supplier assumptions.
- Control safety-relevant device and board configuration.
- Review hardware analyses, metrics and diagnostic coverage claims.
- Coordinate fault injection, environmental and HW/SW integration evidence.
- Manage supplier findings, errata and changes through release.

## Outputs and evidence

- Approved HSR and hardware architecture baseline.
- Verified HSI and supplier assumption mapping.
- Configuration-correct FMEDA/metric and safety-mechanism evidence.
- Hardware verification and fault-injection results.
- Supplier acceptance, errata and release decision records.

## Automotive example

A safety MCU advertises lockstep, ECC, watchdog and clock monitoring. The hardware manager requires the team to map each mechanism to HSRs, configure exact registers, define software error handlers, prove reaction timing and address external power/reset and actuator containment. A vendor certificate alone is not accepted.

At release review, the FMEDA is checked against the exact MCU derivative, board revision, clock mode and enabled diagnostics.

## Common mistakes

- Copying vendor diagnostic-coverage values directly into item metrics.
- Leaving HSI responsibilities unresolved between hardware and software.
- Treating safety mechanisms as enabled because the silicon supports them.
- Failing to control device derivative, errata and board configuration.
- Scheduling fault injection only after hardware design freeze.
