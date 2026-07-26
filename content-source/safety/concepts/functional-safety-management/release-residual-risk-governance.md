---
id: fsm-release-residual-risk-governance
title: Safety Release and Residual-Risk Governance
module: safety
collection: functional-safety-management
order: 22
standard: {"family":"ISO 26262","edition":"2018","parts":["2","7","8","9","10"],"clauseRefs":["ISO 26262-2 safety case, assessment and release","ISO 26262-7 post-development controls","ISO 26262-8 supporting evidence","ISO 26262-9 analyses"]}
difficulty: Expert
stage: 10
systems: ["FSM","Release","Safety Case","Leadership"]
relatedConcepts: ["fsm-safety-case","fsm-confirmation-measures","fsm-analysis-evidence-readiness","fsm-assessment-tailoring-competence"]
linkedQuestions: ["D10Q1","D10Q2","D10Q3","D10Q7"]
references: ["ISO 26262-2:2018","ISO 26262-7:2018","ISO 26262-8:2018","ISO 26262-9:2018","ISO 26262-10:2018"]
---

## Learning objectives

- Define evidence-based entry criteria for safety release.
- Separate evidence completeness, open anomalies and residual-risk decisions.
- Use the safety case and confirmation results to support an accountable release recommendation.
- Plan recovery when a late project lacks credible safety governance.

## Concept

Safety release governance is the accountable decision that the identified item configuration has sufficient evidence to support its safety claims in the defined context. The decision uses the safety case, confirmation reviews, audit/assessment results, traceability, analyses, V&V, supplier evidence and production/service readiness.

Open anomalies are not automatically acceptable or blocking. Each needs validated facts, safety impact, affected claims, configuration, workaround or restriction, closure plan and authorized disposition. Residual risk is not accepted by hiding uncertainty or retrospectively weakening requirements.

For a distressed project, recovery begins with scope and configuration, then a gap/risk assessment and a prioritized plan that restores the evidence chain from HARA and architecture through verification and release. Technical gaps that invalidate downstream evidence are addressed first.

## Why it matters

Release pressure creates incentives to equate passed tests or completed documents with safety. Governance forces the decision to address missing claims, stale evidence, unresolved assumptions and configuration mismatch.

A transparent release record protects both safety and organizational accountability.

## Inputs

- Release-candidate configuration and baseline index.
- Safety case, confirmation findings and assessment conclusion.
- Requirements, analyses, V&V and supplier evidence status.
- Open anomalies, deviations, assumptions and residual risks.
- Production/service readiness and post-release monitoring plan.

## Activities

- Confirm evidence applies to the exact release configuration.
- Review claim completeness, traceability and cross-work-product consistency.
- Evaluate open anomalies and deviations against safety goals and FTTI.
- Check confirmation findings and required independence.
- Define restrictions, conditions, monitoring and rollback where justified.
- Record release recommendation, authority and rationale.

## Outputs and evidence

- Approved or rejected safety release recommendation.
- Residual-risk and anomaly disposition record.
- Final safety case and configuration index.
- Confirmation/assessment closure evidence.
- Release conditions and post-release monitoring commitments.

## Automotive example

A rare HIL test exceeds a reaction-time requirement by 20 ms but no instability is observed. Release governance verifies the result and configuration, compares total worst-case reaction with FTTI, examines combined delays and uncertainty, and requests targeted dynamics evidence. The requirement is not relaxed after the fact merely to preserve schedule.

If margin and evidence remain insufficient, release is blocked or constrained with an explicit technical rationale.

## Common mistakes

- Using passed tests as a substitute for complete traceability and claims.
- Accepting residual risk without identifying decision authority.
- Treating assessment findings as negotiable documentation comments.
- Releasing a configuration different from the analyzed and tested baseline.
- Building the recovery plan around document completion instead of safety impact.
