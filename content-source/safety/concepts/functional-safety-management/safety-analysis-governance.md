---
id: fsm-safety-analysis-governance
title: Safety-Analysis Governance and Assumption Control
module: safety
collection: functional-safety-management
order: 12
standard: {"family":"ISO 26262","edition":"2018","parts":["2","4","5","6","8","9"],"clauseRefs":["ISO 26262-2 safety management","ISO 26262-4/-5/-6 safety analyses","ISO 26262-8 requirements/configuration","ISO 26262-9 analyses"]}
difficulty: Advanced
stage: 5
systems: ["FSM","Safety Analysis","Assumptions"]
relatedConcepts: ["fsm-system-architecture-governance","fsm-analysis-evidence-readiness","fsm-random-hardware-evidence-governance"]
linkedQuestions: ["D5Q1","D5Q8","D5Q9"]
references: ["ISO 26262-2:2018","ISO 26262-4:2018","ISO 26262-5:2018","ISO 26262-6:2018","ISO 26262-8:2018","ISO 26262-9:2018"]
---

## Learning objectives

- Define scope, ownership, abstraction and iteration rules for safety analyses.
- Manage assumptions as controlled, verifiable safety artifacts.
- Explain how FMEA, FTA and DFA feed architecture and verification decisions.
- Govern analysis findings to prevent report-only compliance.

## Concept

Safety-analysis governance establishes why an analysis is performed, which configuration and safety claims it covers, who owns it, which methods are complementary and how findings change the design. FMEA, FTA and DFA are not independent reports; they are coordinated views of failure propagation, causal combinations and dependencies.

Every analysis is conditional on assumptions such as signal availability, diagnostic interval, repair time, independence, operating mode and environmental limits. These assumptions need identifiers, owners, trace links, verification methods and lifecycle review points. An unverified assumption is an open safety obligation.

Findings are classified by safety impact and routed to requirements, architecture, supplier actions or tests. Closure requires evidence that the design or argument changed, not only that the analysis document was edited.

## Why it matters

Analyses can appear complete while sharing the same hidden blind spot. A controller and monitor may read the same corrupt RAM, or a coverage claim may depend on a service interval never enforced.

Governance ensures that analysis is timed early enough to influence architecture and repeated when configuration, assumptions or failure data change.

## Inputs

- Safety goals, TSC, architecture and allocated safety requirements.
- Item modes, interfaces, failure data and diagnostic concepts.
- Existing FMEA, FTA, DFA and quantitative-analysis plans.
- Assumption register, supplier evidence and configuration baseline.
- Review criteria, competence and independence requirements.

## Activities

- Define analysis objectives, boundaries, abstraction and responsible owners.
- Coordinate bottom-up, top-down and dependency analyses.
- Create and maintain a controlled assumption register.
- Review classifications, coverage claims, cut sets and dependencies.
- Convert findings into tracked design, requirement and verification actions.
- Re-run or update analyses after relevant changes and close findings with evidence.

## Outputs and evidence

- Approved analysis plan and scope.
- Consistent FMEA, FTA, DFA and assumption baseline.
- Design and requirement actions linked to findings.
- Verification and fault-injection obligations.
- Review records and safety-case evidence links.

## Automotive example

An independent ESC monitor reads the same RAM value as the controller. The FMEA initially credits the monitor, but a cross-analysis review identifies the shared-data dependency. Governance raises a design finding, updates DFA and FTA, assigns an architecture owner and requires fault injection after the data path is separated or protected.

The assumption that a latent diagnostic runs every key cycle is also assigned to service/use-profile verification rather than left in an FMEDA note.

## Common mistakes

- Commissioning analysis after architecture decisions are fixed.
- Allowing different analyses to use different configurations or boundaries.
- Leaving assumptions in free-text notes without owners.
- Closing findings by changing failure classification without design evidence.
- Using one analysis method as a substitute for complementary views.
