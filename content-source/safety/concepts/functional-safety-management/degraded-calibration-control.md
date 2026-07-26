---
id: fsm-degraded-calibration-control
title: Degraded Operation, Calibration and Cross-Function Change Control
module: safety
collection: functional-safety-management
order: 19
standard: {"family":"ISO 26262","edition":"2018","parts":["2","3","4","6","7","8"],"clauseRefs":["ISO 26262-2 safety management","ISO 26262-3/-4 degraded and safe-state concepts","ISO 26262-8 change/configuration management"]}
difficulty: Advanced
stage: 8
systems: ["FSM","Degraded Operation","Calibration","Control Functions"]
relatedConcepts: ["fsm-vehicle-domain-integration","fsm-impact-analysis-lifecycle-reentry","fsm-production-service-field-management"]
linkedQuestions: ["D8Q5","D8Q7","D8Q8","D8Q9"]
references: ["ISO 26262-2:2018","ISO 26262-3:2018","ISO 26262-4:2018","ISO 26262-6:2018","ISO 26262-7:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Govern degraded modes and transitions as safety requirements rather than fallback implementation details.
- Control safety-relevant calibration, thresholds and operating-domain assumptions.
- Manage cross-function changes affecting plausibility, communication and availability.
- Define evidence for warnings, recovery and driver controllability.

## Concept

Degraded-operation governance defines what remains available after faults, how the system transitions, how long emergency operation is permitted and how recovery is controlled. For brake and stability functions, fail-silent behavior may itself be hazardous, so retained capabilities and limits require explicit approval.

Calibration governance treats thresholds, timing, envelopes, model parameters and mode settings as configuration-controlled safety inputs. A threshold change can alter detection coverage, false-positive behavior, FTTI margin and vehicle response even when no source code changes.

Cross-function change control coordinates sensing plausibility, CAN behavior, arbitration, warnings and service implications. Validation covers transitions, intermittent faults, combined failures and representative operating domains.

## Why it matters

Unsafe transitions are often overlooked because nominal and final safe states are reviewed separately. A yaw-sensor failure during an active low-friction maneuver may require temporary controlled behavior rather than immediate disablement.

Uncontrolled calibration is a common route for a proven architecture to lose its safety margin.

## Inputs

- FSC/TSC definitions of safe, degraded and emergency operation.
- Sensor validity, plausibility and operating-domain models.
- Calibration set, threshold rationale and variant constraints.
- Communication failure behavior and arbitration rules.
- Driver-warning, service and recovery assumptions.

## Activities

- Define mode transitions, guards, timing, retained functions and exit conditions.
- Assign ownership and approval for safety-relevant calibrations.
- Analyze false detection, missed detection and correlated-fault scenarios.
- Control cross-function and network changes through impact analysis.
- Validate warning effectiveness, controllability and recovery.
- Maintain calibration/configuration traceability through production and service.

## Outputs and evidence

- Approved degraded-mode and transition requirements.
- Safety-relevant calibration catalogue with rationale and limits.
- Change-impact and variant-coverage records.
- Transition, plausibility and communication fault-test evidence.
- Updated driver, service and safety-case information.

## Automotive example

A yaw-rate sensor fails during a low-friction curve. The project defines which functions remain, whether estimation may be used temporarily, how false intervention is prevented, when ESC disables, what warning is issued and how intermittent recovery behaves. These are reviewed and validated as one transition concept.

A later change to plausibility thresholds is treated as a safety change with regression across split-friction, sensor bias, CAN delay and affected vehicle variants.

## Common mistakes

- Defining only the final safe state and not the transition.
- Treating calibration as non-software and outside safety control.
- Allowing automatic recovery without fault-history and transition analysis.
- Using warnings as substitutes for timely technical reaction.
- Validating degraded behavior in one nominal environment only.
