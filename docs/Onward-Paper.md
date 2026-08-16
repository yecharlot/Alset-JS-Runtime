# Interfaces as Addressable Spaces:  
## A Pulse-Based Interaction Model with Persistent Identity

**Author:** Alset (Independent Researcher)  
**Affiliation:** Alset Project  
**Year:** 2025

---

### Abstract

Modern interactive systems overwhelmingly rely on request–response interaction models and ephemeral user interfaces that are continuously destroyed and recreated. While effective for transactional applications, this approach imposes structural limitations on long-lived, adaptive, and continuously interactive systems.

This paper introduces **Alset**, an experimental runtime that treats interfaces as **addressable spaces of persistent entities**, and **AIP (Alset Interaction Protocol)**, a pulse-based interaction model where external systems interact with interface elements through identity-directed stimuli rather than function calls or REST endpoints.

In this model, interface elements possess persistent identity, local state, and optional live mutability, enabling systems to stimulate, observe, and adapt interfaces without global recomposition. We present the conceptual model, describe a working implementation, and discuss how this approach challenges dominant assumptions about rendering, interaction, and system boundaries.

Rather than proposing a replacement for existing paradigms, this work explores an alternative interaction space and invites discussion on interfaces as first-class computational entities.

## 1. Introduction

User interfaces are typically treated as transient artifacts: rendered, destroyed, and recreated in response to state changes. This ephemerality is embedded deeply in dominant UI frameworks and aligns well with request–response interaction models such as REST and RPC.

However, as systems become long-lived, distributed, and continuously interactive, this assumption introduces friction. Interfaces lose continuity, local state is repeatedly reconstructed, and interaction becomes tightly coupled to rendering cycles.

This paper asks a simple but underexplored question:

*What if interfaces had persistent identity and could be addressed directly by other systems?*

## 2. Motivation: The Cost of Ephemeral Interfaces

Ephemeral interfaces introduce several costs:

- Loss of focus, cursor position, and local interaction context
- Visual jitter caused by full recomposition
- Cognitive discontinuity for users
- Architectural asymmetry: interfaces consume systems but cannot be consumed as systems

These costs are often accepted as inevitable. Alset challenges that assumption.

## 3. Conceptual Model

### 3.1 Persistent Identity Nodes

Alset introduces **Persistent Identity Nodes (PINs)**: interactive entities with stable identity over time. Each node is identified by a unique key and preserves local state independently of rendering cycles.

### 3.2 Interactive Address Space

The collection of PINs forms an **Interactive Address Space**, analogous to an address space in operating systems, but applied to interfaces.

### 3.3 Pulses and Resonance

Interaction occurs through **pulses**: asynchronous, identity-directed stimuli. Nodes react locally through **resonance**, without triggering global recomposition.

## 4. Alset Runtime Overview

Alset is implemented as a lightweight runtime that enforces identity persistence and localized updates.

**Listing 1 — Persistent Identity Resolution**

```js
const el = (key && Registry.has(key))
  ? Registry.get(key)
  : document.createElement(tag);
```

**Listing 2 — Pulse Dispatch**

```js
if (Registry.has(pulse.target)) {
  Registry.get(pulse.target).__alsetPulse(pulse.data);
}
```

These mechanisms ensure that identity, not rendering order, governs interaction.

## 5. AIP: Interaction Beyond APIs

AIP replaces request–response semantics with **identity-directed interaction**. Instead of calling functions or endpoints, systems emit pulses to named entities.

This enables **System-to-System Interaction over Persistent Interfaces**, where an interface can simultaneously consume and expose capabilities.

## 6. Live Mutability

Alset optionally supports **live mutability**: the ability of a node to alter its behavior at runtime without losing identity.

This capability is intentionally constrained and governed. It is powerful, risky, and deliberately exposed as a first-class concern rather than hidden.

## 7. Examples

### 7.1 Remote Telemetry Interface

A telemetry system emits pulses targeting persistent UI nodes, updating time, visuals, and state without re-rendering the interface.

### 7.2 Phantom Command Interface

A controlled environment allows external systems to inject logic into live nodes, demonstrating governed mutability and runtime evolution.

## 8. Discussion

Treating interfaces as addressable systems challenges long-standing assumptions about boundaries between UI and backend systems. This model introduces new risks and complexities but also opens a design space that is largely unexplored.

## 9. Related Work

Existing paradigms such as REST, RPC, Actor Model, and server-driven UI systems address different concerns. Alset does not replace them but explores a complementary interaction model focused on persistence and identity.

## 10. Conclusion

This work proposes a shift in how interfaces are conceptualized: from ephemeral render targets to persistent, addressable computational entities. Alset and AIP demonstrate that this shift is both feasible and generative of new interaction possibilities.

---

# Cover Letter — Onward!

**Dear Onward! Program Committee,**

We submit this paper for consideration at **Onward!**, as we believe it aligns strongly with the track’s focus on provocative, forward-looking ideas that challenge established assumptions in programming and interaction models.

Our work introduces **Alset**, an experimental runtime, and **AIP**, a pulse-based interaction model that treats interfaces as addressable spaces of persistent entities. Rather than presenting a new framework or optimization, the paper explores an alternative conceptualization of interfaces as first-class computational participants in system-to-system interaction.

The contribution is intentionally exploratory and reflective, supported by a working implementation, and aims to open discussion rather than claim definitive solutions. We believe this perspective resonates with the spirit of Onward! and its tradition of examining unconventional yet coherent ideas.

Thank you for your consideration.

**Sincerely,**  
Yulei Esteban Charlot Poll
