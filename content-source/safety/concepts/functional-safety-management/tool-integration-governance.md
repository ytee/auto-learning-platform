---
id: fsm-tool-integration-governance
title: Software Architecture, Tool and Integration Governance
module: safety
collection: functional-safety-management
order: 17
standard: {"family":"ISO 26262","edition":"2018","parts":["2","4","6","8"],"clauseRefs":["ISO 26262-2 management and confirmation","ISO 26262-6 software architecture/integration","ISO 26262-8 tool confidence"]}
difficulty: Expert
stage: 7
systems: ["FSM","Software","Integration","Tool Confidence"]
relatedConcepts: ["fsm-software-safety-management","fsm-change-configuration-reuse","fsm-verification-validation-governance"]
linkedQuestions: ["D7Q2","D7Q7","D7Q10"]
references: ["ISO 26262-2:2018","ISO 26262-4:2018","ISO 26262-6:2018","ISO 26262-8:2018"]
---

## Learning objectives

- Govern software safety architecture and integration as cross-team safety decisions.
- Manage timing, interference and platform dependencies against system safety budgets.
- Define architecture review findings that block integration.
- Ensure tool and platform configuration are included in release evidence.

## Concept

Software architecture and integration governance ensures that SSR allocation, controller/monitor separation, freedom from interference, scheduling, communication, startup and degraded behavior remain consistent with the system safety concept. It also controls dependencies on OS, AUTOSAR BSW, bootloader, compiler, generator and diagnostic services.

Integration entry criteria include approved architecture, stable interfaces, timing budgets, configuration baselines and test environments. Integration findings are evaluated against FTTI, fault containment and safety goals, not only functional pass rates.

Tool and platform changes are safety-relevant when they can introduce errors or alter timing, memory, initialization or communication behavior. The release evidence must identify exact versions, configuration and compensating verification.

## Why it matters

Many software safety failures emerge only when correct units compete for CPU, memory, bus or shared services. A QM logger can delay an ASIL-D task even though both functions pass unit tests.

Governance gives integration teams authority to stop progression when platform behavior violates the safety architecture.

## Inputs

- Approved SSR and software architecture baseline.
- OS/BSW/bootloader/platform configuration and interface contracts.
- WCET, scheduling, FTTI and resource budgets.
- Tool-confidence evidence and exact toolchain versions.
- Integration test plan, anomaly status and variant matrix.

## Activities

- Review software architecture allocation, separation and fault reaction.
- Analyze memory, timing, execution and communication interference.
- Set integration entry/exit criteria and blocking-finding rules.
- Stress platform services, load, reset, startup and degraded modes.
- Assess tool/platform/configuration changes and regression impact.
- Link integration results to the safety case and system validation plan.

## Outputs and evidence

- Approved software architecture and platform configuration.
- Scheduling/FFI analyses and stress-test evidence.
- Integration gate records and resolved anomalies.
- Tool/platform configuration index.
- Safety-case evidence and system-level issue escalation.

## Automotive example

A brake control task misses deadlines only when diagnostics and CAN logging are active. The project measures worst-case execution, interrupts, DMA, locks, cache and bus load; compares the total delay to the allocated FTTI budget; and identifies temporal interference. Integration is blocked until priorities, budgets or overload behavior are corrected and regression evidence is produced.

Simply increasing task priority is not accepted without checking effects on other safety functions and shared resources.

## Common mistakes

- Treating successful unit tests as integration readiness.
- Reviewing memory protection but ignoring timing and communication interference.
- Changing OS or BSW configuration outside safety change control.
- Accepting occasional deadline misses because no observed vehicle instability occurred.
- Failing to include tool/platform versions in the release configuration.
