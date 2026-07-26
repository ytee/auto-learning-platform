---
id: fsm-verification-validation-governance
title: Verification and Safety-Validation Governance
module: safety
collection: functional-safety-management
order: 20
standard: {"family":"ISO 26262","edition":"2018","parts":["2","4","5","6","8"],"clauseRefs":["ISO 26262-2 planning and confirmation","ISO 26262-4 integration and safety validation","ISO 26262-5/-6 verification","ISO 26262-8 verification"]}
difficulty: Advanced
stage: 9
systems: ["FSM","Verification","Validation","Fault Injection"]
relatedConcepts: ["fsm-analysis-evidence-readiness","fsm-vehicle-domain-integration","fsm-release-residual-risk-governance"]
linkedQuestions: ["D9Q1","D9Q3","D9Q4","D9Q5","D9Q9"]
references: ["ISO 26262-2:2018","ISO 26262-4:2018","ISO 26262-5:2018","ISO 26262-6:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Distinguish governance objectives for verification, integration testing and safety validation.
- Build a multi-level V&V strategy with controlled entry, exit and acceptance criteria.
- Plan fault injection from analysis findings to realistic vehicle behavior.
- Manage configuration, independence, deviations and evidence completeness.

## Concept

Verification and safety-validation governance defines what must be demonstrated, at which level, with which configuration and by whom. Verification checks work products against requirements; safety validation evaluates achievement of safety goals in representative item and vehicle context.

The V&V strategy allocates reviews, MIL, SIL, HIL, bench, rig and vehicle tests according to observability, fidelity, physical effect and safety. Fault-injection scenarios derive from FMEA, FTA, DFA, mechanism claims and timing budgets. Acceptance criteria include initial condition, fault, detection/reaction time, physical limits, degraded behavior, warning, recovery and measurement uncertainty.

Governance controls test environment, tool confidence, independence, variants, regression and deviations. Results are linked to exact hardware/software/calibration and to safety-case claims.

## Why it matters

Large test counts do not prove the safety goals if tests are at the wrong level, use vague criteria or cover the wrong configuration.

Integrated governance prevents local verification success from hiding vehicle-level hazards and ensures deviations are assessed before release.

## Inputs

- Safety goals, requirements, architecture, analyses and FTTI budgets.
- Verification and validation plans with method rationale.
- Fault-injection matrix and test-environment capabilities.
- Variant, configuration and measurement-system definitions.
- Independence needs, anomalies and release criteria.

## Activities

- Allocate each requirement and safety claim to suitable evidence levels.
- Define test entry/exit and quantitative acceptance criteria.
- Prioritize fault scenarios using analyses and risk.
- Control test tools, environments, configuration and data quality.
- Review failures, deviations, uncertainty and regression needs.
- Approve evidence completeness and feed results into the safety case.

## Outputs and evidence

- Integrated V&V strategy and evidence matrix.
- Approved acceptance criteria and fault-injection plan.
- Configuration-identified test results and coverage reports.
- Deviation, anomaly and regression decisions.
- Safety-validation report and claim-to-evidence links.

## Automotive example

For unintended brake pressure, the project defines an injected fault, maximum detection/reaction time, pressure/deceleration/yaw limits, expected inhibit, warning and degraded state. MIL/SIL cover logic, HIL covers ECU/network timing, and rig/vehicle tests cover hydraulics and controllability.

A rare reaction-time exceedance is analyzed against FTTI and measurement uncertainty rather than dismissed because the vehicle appeared stable.

## Common mistakes

- Using HIL as a blanket substitute for vehicle validation.
- Writing acceptance criteria after seeing test results.
- Testing mechanisms without the physical reaction chain.
- Combining results from different configurations into one evidence claim.
- Treating deviations as test-team issues rather than safety decisions.
