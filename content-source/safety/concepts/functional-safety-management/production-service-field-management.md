---
id: fsm-production-service-field-management
title: Production, Service and Field Safety Management
module: safety
collection: functional-safety-management
order: 21
standard: {"family":"ISO 26262","edition":"2018","parts":["2","7","8"],"clauseRefs":["ISO 26262-2 safety management after development","ISO 26262-7 production, operation, service and decommissioning","ISO 26262-8 change/anomaly/configuration"]}
difficulty: Advanced
stage: 9
systems: ["FSM","Production","Service","Field Monitoring"]
relatedConcepts: ["fsm-verification-validation-governance","fsm-impact-analysis-lifecycle-reentry","fsm-release-residual-risk-governance"]
linkedQuestions: ["D9Q7","D9Q8","D9Q10"]
references: ["ISO 26262-2:2018","ISO 26262-7:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Extend functional safety management beyond development release.
- Define production and service controls that preserve the safety concept and configuration.
- Manage field anomalies and safety-related lifecycle re-entry.
- Explain how OBD/service diagnostics interface with time-critical safety mechanisms.

## Concept

Production, service and field safety management preserves the assumptions and evidence of the safety case after development. It controls correct hardware, software and calibration variants; end-of-line testing; coding and parameterization; replacement parts; diagnostic procedures; updates; post-repair tests and decommissioning.

Service/OBD functions may share information with safety diagnostics, but DTC storage is not the time-critical safety reaction. Service operations, actuator tests and DTC clearing must not defeat safe states, latent-fault detection or evidence assumptions.

Field monitoring defines which incidents, warranty data, diagnostic patterns and changes trigger analysis, escalation, corrective action or lifecycle re-entry. The safety case is maintained as the product evolves.

## Why it matters

A safe development configuration can become unsafe through wrong coding, calibration, replacement parts, service procedures or unassessed field changes.

Field evidence is also the earliest signal that assumptions or coverage claims may be wrong, so anomaly handling must connect back to engineering.

## Inputs

- Released safety case, production control plan and configuration baseline.
- End-of-line tests, coding/calibration and traceability requirements.
- Service manuals, diagnostic tools, replacement parts and update procedures.
- Field monitoring, warranty and incident data.
- Anomaly, change, recall and decommissioning processes.

## Activities

- Control production variants, calibration and end-of-line safety checks.
- Validate service procedures, tools, replacements and post-repair tests.
- Protect safe-state and diagnostic behavior during service operations.
- Monitor field data and classify safety relevance.
- Initiate impact analysis, corrective action and lifecycle re-entry.
- Maintain traceability from field issue to affected fleets and evidence.

## Outputs and evidence

- Production and service safety-control records.
- Configuration and vehicle traceability.
- Validated diagnostic/service procedures and tools.
- Field safety monitoring and anomaly reports.
- Corrective-action, update/recall and safety-case maintenance evidence.

## Automotive example

An ECU replacement procedure can load the wrong tire-size coding, changing wheel-speed plausibility and ESC behavior. Production/service governance requires validated coding, variant checks and post-repair tests tied to the vehicle configuration.

If field data shows repeated sensor intermittency before scheduled diagnostics detect it, the issue is classified for safety impact, the diagnostic interval assumption is revisited and affected lifecycle work products are reopened.

## Common mistakes

- Treating production release as the end of FSM.
- Assuming DTC storage provides the required safety reaction.
- Allowing service actuator tests to bypass safety controls.
- Using replacement parts without verified assumptions and configuration.
- Collecting field data without defined safety escalation criteria.
