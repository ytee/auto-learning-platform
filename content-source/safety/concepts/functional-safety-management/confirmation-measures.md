---
id: fsm-confirmation-measures
title: Confirmation Measures
module: safety
collection: functional-safety-management
order: 4
standard: {"family":"ISO 26262","edition":"2018","parts":["2"],"clauseRefs":["ISO 26262-2"]}
difficulty: Intermediate
stage: 1
systems: ["FSM","Assessment","Review"]
relatedConcepts: ["fsm-overview","fsm-safety-culture","fsm-safety-plan","fsm-safety-case"]
linkedQuestions: ["D1Q2","D1Q10"]
references: ["ISO 26262-2:2018"]
---

## Learning objectives

- Differentiate confirmation review, functional-safety audit and functional-safety assessment.
- Explain why independence and competence matter to confirmation activities.
- Describe how findings should influence evidence and release decisions.
- Select the confirmation perspective appropriate to a work product, process or item-level judgment.

## Concept

Confirmation measures provide structured challenge that is separate from ordinary task execution. They help determine whether important work products meet their objectives, whether required processes are being applied and whether the available body of evidence supports the conclusion that functional safety has been achieved.

A confirmation review focuses on selected safety work products and their objectives. A functional-safety audit examines the implementation of the functional-safety processes. A functional-safety assessment forms an overall judgment using product and process evidence for the item and its development context.

The value of confirmation depends on competence, access to evidence, appropriate independence and effective finding closure. Independence is not merely organizational distance; the reviewer must be able to challenge assumptions and conclusions without being constrained by authorship or delivery pressure.

## Why it matters

Development teams naturally become familiar with their own assumptions and design rationale. Independent challenge can expose missing interfaces, inconsistent baselines, unsupported safety claims or process gaps that normal reviews overlook.

Confirmation measures also support accountable release decisions. They do not transfer responsibility away from the development organization, but they provide an additional basis for judging whether unresolved findings and residual risk are acceptable.

## Inputs

- Safety plan and confirmation-measure plan.
- Applicable work products, process records and safety evidence.
- Item scope, ASIL context and development responsibilities.
- Independence and competence requirements.
- Open anomalies, deviations, assumptions and previous findings.
- Exact hardware, software, calibration and variant configuration.

## Activities

- Define scope, objectives, criteria and required evidence.
- Assign competent personnel with appropriate independence.
- Review work products, process implementation or the complete safety argument.
- Record findings with severity, ownership and closure criteria.
- Verify corrective actions and assess residual concerns.
- Communicate implications for milestones and release.
- Retain confirmation records as part of the safety evidence.

## Outputs and evidence

- Confirmation-review records and findings.
- Functional-safety audit reports.
- Functional-safety assessment reports and recommendations.
- Finding-response and closure evidence.
- Independence and competence records.
- Decisions on restrictions, additional work or release readiness.

## Automotive example

An ASIL D ESC project may use confirmation reviews for the HARA, safety goals, safety concepts and selected analyses; an audit to examine whether the agreed lifecycle and supporting processes are implemented; and an assessment to judge the integrated evidence before release. If the assessment finds that supplier assumptions are not verified in the vehicle configuration, the issue remains a release concern even when the supplier's documents were delivered on time.

## Common mistakes

- Treating the three confirmation measures as interchangeable.
- Using the document author as the independent confirmer.
- Reviewing formatting while missing technical assumptions and interfaces.
- Closing findings based only on promised future action.
- Assessing a generic product instead of the exact released configuration.
- Treating a positive assessment as a substitute for ongoing safety responsibility.
