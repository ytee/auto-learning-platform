---
id: fsm-vehicle-domain-integration
title: Vehicle-Domain Safety Integration Governance
module: safety
collection: functional-safety-management
order: 18
standard: {"family":"ISO 26262","edition":"2018","parts":["2","3","4","6","9"],"clauseRefs":["ISO 26262-2 project safety management","ISO 26262-3/-4 safety concepts","ISO 26262-9 analyses"]}
difficulty: Advanced
stage: 8
systems: ["FSM","Brakes","ESC","System Architecture"]
relatedConcepts: ["fsm-system-architecture-governance","fsm-degraded-calibration-control","fsm-verification-validation-governance"]
linkedQuestions: ["D8Q4","D8Q6","D8Q10"]
references: ["ISO 26262-2:2018","ISO 26262-3:2018","ISO 26262-4:2018","ISO 26262-6:2018","ISO 26262-9:2018"]
---

## Learning objectives

- Manage end-to-end safety integration across sensing, control, arbitration, actuation and vehicle response.
- Define ownership for cross-function interfaces and shared vehicle signals.
- Use vehicle-domain evidence to govern FTTI, limits, safe states and availability.
- Coordinate cross-functional analyses and validation responsibilities.

## Concept

Vehicle-domain safety integration governance ensures that the item is evaluated as an end-to-end control chain rather than a collection of ECUs and algorithms. For brakes and ESC, sensing, state estimation, arbitration, communication, driver electronics, hydraulics, vehicle dynamics and HMI jointly determine safety behavior.

The management task assigns ownership at each boundary, controls units/signs/rates/validity, coordinates ABS/TCS/ESC/ADAS and driver-demand arbitration, and ensures that detection, inhibition and physical pressure decay fit a dynamics-derived FTTI.

Cross-functional scenarios drive reviews, analyses and tests. The safety case must connect electrical and software evidence to hydraulic and vehicle outcomes.

## Why it matters

A technically correct command can still be hazardous if applied to the wrong wheel, at the wrong time or during conflicting control requests. Interface ownership and vehicle dynamics are therefore management concerns.

Domain integration also reveals availability trade-offs and transition hazards that are not visible in isolated ECU testing.

## Inputs

- Item/FSC/TSC and end-to-end control-chain architecture.
- Vehicle signals, interface contracts and arbitration rules.
- FTTI, safe/degraded states and availability requirements.
- FMEA/FTA/DFA and control/vehicle-dynamics evidence.
- Integration and vehicle validation strategy.

## Activities

- Map the end-to-end nominal and faulted control chain.
- Assign ownership for every safety-relevant signal and decision.
- Review cross-function arbitration, inhibition and feedback.
- Allocate timing budgets through computation, network, actuator and plant response.
- Coordinate analyses and fault scenarios across teams.
- Define integration and vehicle-level evidence for safety claims.

## Outputs and evidence

- Approved end-to-end safety architecture and responsibility map.
- Interface, arbitration and timing contracts.
- Cross-functional analysis findings and controls.
- Integration/fault-injection scenario matrix.
- Vehicle-level evidence plan linked to safety goals.

## Automotive example

For a 300 ms unintended rear-wheel brake command at highway speed, governance traces possible causes from request generation through wheel mapping, arbitration, CAN, driver electronics and valve behavior. It assigns owners for request-envelope monitoring, independent inhibit, pressure feedback and yaw/deceleration plausibility.

The review uses vehicle dynamics to set reaction and pressure-decay criteria and ensures HIL and proving-ground tests cover the same end-to-end claim.

## Common mistakes

- Stopping analysis at the ECU output rather than physical vehicle response.
- Leaving arbitration ownership split between functions.
- Using generic FTTI values without vehicle-dynamics basis.
- Assuming network integrity detects valid-but-wrong control requests.
- Separating domain validation from the technical safety architecture.
