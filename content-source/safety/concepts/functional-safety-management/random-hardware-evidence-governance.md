---
id: fsm-random-hardware-evidence-governance
title: Random Hardware Evidence and Metric Governance
module: safety
collection: functional-safety-management
order: 15
standard: {"family":"ISO 26262","edition":"2018","parts":["2","5","8","9","11"],"clauseRefs":["ISO 26262-2 safety management and release","ISO 26262-5 hardware architectural metrics and evaluation","ISO 26262-9 analyses","ISO 26262-11 guidance"]}
difficulty: Expert
stage: 6
systems: ["FSM","Hardware","Metrics","Verification"]
relatedConcepts: ["fsm-hardware-safety-management","fsm-safety-analysis-governance","fsm-analysis-evidence-readiness"]
linkedQuestions: ["D6Q2","D6Q3","D6Q4","D6Q9"]
references: ["ISO 26262-2:2018","ISO 26262-5:2018","ISO 26262-8:2018","ISO 26262-9:2018","ISO 26262-11:2018"]
---

## Learning objectives

- Govern fault classification, diagnostic coverage, failure-rate data and quantitative evaluation as controlled evidence.
- Explain the management relationship between SPFM, LFM, PMHF and verification.
- Define review and acceptance criteria for supplier FMEDA and metric reports.
- Connect metric assumptions to service, diagnostic interval and released configuration.

## Concept

Random hardware evidence governance controls the data, assumptions, classifications and verification that support SPFM, LFM and PMHF or equivalent evaluation. Metrics are outputs of an architecture and analysis model; they are not standalone design targets or supplier certificates.

Failure-rate sources, distributions, diagnostic coverage, test intervals, repair assumptions, independence and fault classes need documented rationale and ownership. Coverage claims are supported by analysis, simulation and representative physical fault injection, with limitations made explicit.

Governance includes sensitivity analysis and reconciliation with FMEA, FTA, DFA, HSRs, HSI and software diagnostics. Changes to hardware, configuration, diagnostic implementation or use profile trigger re-evaluation.

## Why it matters

Small optimistic assumptions can materially improve a metric while hiding real risk. A 99% coverage claim is meaningful only when the fault population, detection mechanism, timing and evidence are clear.

Quantitative evidence also depends on lifecycle conditions such as diagnostic intervals and service repair assumptions, so it must remain valid after production.

## Inputs

- Hardware architecture, safety mechanisms and fault-classification rules.
- Failure-rate data, mission profile and component distributions.
- Diagnostic coverage analyses and fault-injection plans.
- Test intervals, repair assumptions and service concept.
- Exact hardware/software/configuration baseline.

## Activities

- Review failure-rate sources, exclusions and distributions.
- Classify faults consistently with the safety concept and analyses.
- Allocate and justify diagnostic coverage and intervals.
- Plan representative verification and fault injection.
- Perform metric/PMHF calculation and sensitivity review.
- Reassess evidence after design, configuration or field changes.

## Outputs and evidence

- Reviewed fault-classification and failure-rate dataset.
- SPFM, LFM and PMHF/equivalent evaluation with rationale.
- Coverage-verification and fault-injection evidence.
- Sensitivity, limitation and residual-risk record.
- Configuration-specific quantitative evidence for the safety case.

## Automotive example

A wheel-speed input path receives high diagnostic coverage in the FMEDA. The review asks which sensor, wiring, supply, acquisition, memory and communication faults are included and which mechanism detects each. Physical and simulated fault injection measures detection time and reveals intermittent and common-supply gaps.

The resulting coverage and metric report states the exact ECU configuration, diagnostic interval and unsupported fault classes instead of presenting one global percentage.

## Common mistakes

- Treating SPFM/LFM thresholds as proof of safety by themselves.
- Using failure-rate sources without traceable applicability.
- Assuming diagnostic coverage without evidence of reaction timing.
- Ignoring latent-fault intervals and service assumptions.
- Failing to update metrics when software diagnostics or configuration change.
