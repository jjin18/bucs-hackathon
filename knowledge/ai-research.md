# AI Research

## Overview

Jia's research interests focus on the intersection of:

* healthcare AI systems
* trust and safety in large language models
* evaluation methods for AI systems in high-stakes environments
* systemic risks in AI infrastructure

Her work combines product experience in health AI with independent research on how AI systems should be evaluated and deployed responsibly.

---

# Health AI Trust Research

Jia conducted independent research examining how users decide whether to trust AI systems in healthcare contexts.

The research explored a central question:

**From the model's response alone, would a patient trust it enough to act?**

Most health AI systems focus primarily on:

* factual correctness
* safety restrictions

However, Jia's research focused on trust behaviors in AI responses, including:

* transparency about uncertainty
* clarity of explanations
* appropriate safety boundaries
* tone and communication style

The project involved:

* scraping 836 patient reviews across health platforms
* generating real patient-style questions
* benchmarking multiple AI models across trust dimensions

The goal was to understand how AI responses influence user trust and decision-making, especially in high-stakes domains like healthcare.

**Live: healthai-trust.vercel.app | Live Eval Tool: trusteval.up.railway.app**

---

# Health AI Product Experience

Jia's research interest in health AI is grounded in direct product experience.

While working on **Mira AI**, a conversational AI health companion used by **over 1 million patients**, she observed that many health AI systems optimize heavily for:

* correctness
* safety compliance

but often overlook trust itself as a measurable product dimension.

Her research attempts to bridge that gap by exploring methods to evaluate:

* whether users understand AI responses
* whether they trust the system
* whether they would act on the information provided

This perspective comes from observing how real patients interact with health AI tools.

---

# AI Infrastructure Supply Chain Research

(Research with Harish Krishnan)

Jia is also conducting research with **Harish Krishnan** focused on **systemic vulnerabilities in AI infrastructure supply chains**.

Most industry conversations focus heavily on semiconductor and GPU supply constraints, but Jia's research explores the broader infrastructure required to support large-scale AI systems.

Her research examines bottlenecks in components such as:

* electrical transformers
* HVAC cooling systems
* energy infrastructure
* industrial batteries
* thermal management equipment

Key observations motivating the research include:

* Transformers can take **more than 30 months** to procure
* China produces approximately **95% of HVAC compressors**
* China produces roughly **75% of industrial batteries**
* many of these components have very limited substitutability

These dependencies create potential fragility in the infrastructure required to support large-scale AI data centers.

## Research Objective

The goal of the project is to build a **dependency map of the AI infrastructure supply chain**.

The research aims to identify:

* critical components required for AI compute infrastructure
* which countries dominate production of these components
* where manufacturing bottlenecks exist
* how disruptions could affect AI infrastructure deployment

The research also aims to model system fragility under disruption scenarios, including:

* geopolitical conflict
* export restrictions
* supply chain shocks
* energy shortages

## Methodological Inspiration

Jia's research draws methodological inspiration from supply chain resilience modeling.

Relevant techniques include:

* mapping multi-tier supplier dependencies
* identifying single points of failure
* analyzing substitution difficulty across suppliers

Harish Krishnan's work on blockchain in sustainable value chains provided conceptual overlap in methodologies related to supply chain transparency and resilience analysis.

## Research Motivation

Jia's interest in this research comes from observing that discussions about AI infrastructure often focus on:

* models
* algorithms
* semiconductor supply

However, the deployment of AI systems at scale depends on a much broader physical infrastructure that includes:

* electrical grid equipment
* cooling systems
* power infrastructure
* industrial manufacturing supply chains

Understanding these dependencies is critical for understanding how resilient the AI ecosystem actually is.

## Research Approach

The project is largely self-driven exploratory research.

Jia is applying knowledge from:

* supply chain coursework
* computer science training
* real-world experience working in AI systems

Her goal is to better understand system-level vulnerabilities in the infrastructure that supports AI deployment and contribute analysis on how resilient that ecosystem is under disruption scenarios.
