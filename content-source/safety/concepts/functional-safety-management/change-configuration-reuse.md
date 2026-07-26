---
id: fsm-change-configuration-reuse
title: Safety Change, Configuration and Reuse Governance
module: safety
collection: functional-safety-management
order: 11
standard: {"family":"ISO 26262","edition":"2018","parts":["2","8","10","11"],"clauseRefs":["ISO 26262-2 project safety management","ISO 26262-8 configuration, change and qualification/reuse processes","ISO 26262-10 and -11 guidance"]}
difficulty: Advanced
stage: 4
systems: ["FSM","Change Management","Configuration Management","Reuse"]
relatedConcepts: ["fsm-impact-analysis-lifecycle-reentry","fsm-distributed-development","fsm-controlled-technical-baselines"]
linkedQuestions: ["D4Q5","D4Q7","D4Q8","D4Q10"]
references: ["ISO 26262-2:2018","ISO 26262-8:2018","ISO 26262-10:2018","ISO 26262-11:2018"]
---

## Learning objectives

- Connect change management, configuration management and reuse justification as one safety-control system.
- Explain how SEooC assumptions and legacy evidence are governed during integration.
- Define configuration-correct evidence for hardware, software, calibration and tools.
- Use metrics to reveal risk without replacing technical review.

## Concept

Safety change and configuration governance ensures that every approved claim refers to an identified product configuration and that reused elements are valid in their actual context. Reuse can reduce development effort, but it introduces assumptions, historical evidence and integration obligations that must remain controlled.

For an SEooC, the integrator maps item requirements to assumed safety requirements and verifies every relevant Assumption of Use. For legacy or pre-existing elements, the project evaluates development evidence, field history, modifications, interfaces, operating profile and applicable qualification arguments. Neither approach permits assumptions to remain implicit.

Configuration management identifies exact hardware, software, calibration, toolchain and supplier versions. Change management evaluates impacts and invalidates affected evidence. Governance metrics can highlight traceability gaps, aging anomalies, volatility and unverified variants, but approval still requires semantic review.

## Why it matters

Safety evidence is configuration-specific. A valid FMEDA, safety manual or test result can become irrelevant after a compiler upgrade, calibration change, PCB revision or unmet AoU.

Reuse governance prevents field history or vendor reputation from becoming a substitute for a defined safety argument.

## Inputs

- Reuse candidate, safety manual, AoU, historical evidence and known limitations.
- Current item requirements, interfaces, environment and use profile.
- Hardware, software, calibration, tool and supplier configuration records.
- Change requests, anomaly history and affected evidence links.
- Qualification, proven-in-use or redevelopment strategy.

## Activities

- Map item requirements and environment to reuse assumptions and limitations.
- Select and justify the applicable reuse or qualification approach.
- Identify exact configurations and establish reproducible baselines.
- Perform change impact across requirements, analyses, tests and safety case.
- Verify unmet assumptions through external measures or redesign.
- Track configuration coverage, evidence validity and variant status.

## Outputs and evidence

- Reuse or SEooC integration argument with verified assumptions.
- Configuration baseline and variant applicability matrix.
- Approved change records and evidence-invalidation list.
- Updated requirements, analyses, tests and safety case.
- Dashboard indicators plus technical review and acceptance records.

## Automotive example

A safety MCU offers lockstep, ECC and watchdog functions as an SEooC. The team maps its HSRs to MCU mechanisms, verifies watchdog and error-handler assumptions, records errata and configures the exact derivative. A later bootloader update changes reset sequencing, so the impact analysis reopens HSI, startup tests and fault-reaction evidence.

For a legacy brake component, millions of field units are treated as supporting data, not proof by themselves. The use profile, modifications, failure reporting quality and item interfaces are evaluated before credit is claimed.

## Common mistakes

- Treating a supplier safety manual as generic rather than configuration-specific.
- Assuming field volume alone proves suitability.
- Changing calibration or tools outside product configuration control.
- Recording AoU without owners and verification evidence.
- Using coverage metrics as approval criteria without examining meaning and gaps.
