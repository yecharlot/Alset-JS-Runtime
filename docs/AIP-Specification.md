# 📡 AIP Specification v1.0

## Alset Interaction Protocol
### *(Persistent Identity-Based Interaction Protocol)*

## Document Status

**Status:** Experimental  
**Version:** 1.0  
**Date:** 2025  
**Author:** Alset Project  
**Audience:** Software architects, researchers in interactive systems, distributed systems, runtime systems.

This document defines the first version of the **Alset Interaction Protocol (AIP)**.  
The specification is **experimental** and subject to evolution based on academic and practical feedback.

---

## 1. Introduction

Dominant system interaction models rely on request–response architectures, rigid contracts, and resources without persistent identity. While suitable for transactional systems, these approaches present significant limitations for persistent, distributed, and long-lived interactive systems.

AIP proposes an alternative interaction model where interfaces are conceived as **addressable spaces of persistent entities**, capable of receiving asynchronous stimuli called **pulses**.

## 2. Protocol Goals

1. Enable system-to-system interaction without requiring traditional REST models.
2. Treat interfaces as interactive address spaces.
3. Guarantee persistent identity of entities.
4. Facilitate live mutability without system reinitialization.
5. Decouple emitters and receivers through asynchronous pulses.

## 3. Definitions and Terminology

### 3.1 Persistent Identity Node (PIN / NIP)
An interactive entity with stable identity over time, externally addressable via a unique **key**.

### 3.2 Interactive Address Space (IAS / EDI)
Dynamic set of all accessible PINs within an AIP interface.

### 3.3 Interaction Pulse
Fundamental communication unit in AIP.  
A pulse is an asynchronous stimulus directed at a specific PIN.

### 3.4 Localized Resonance
Process by which a PIN reacts to a pulse without triggering global recomposition of the system.

### 3.5 Live Mutability
Capability of a PIN to modify its behavior at runtime without losing identity or state.

## 4. Architectural Model

AIP defines an asynchronous, decoupled model:

```
[ Pulse Emitter ]
        ↓
[ Interactive Address Space ]
        ↓
[ Persistent Identity Node ]
        ↓
[ Localized Resonance ]
```

There is no global render cycle nor a mandatory response to the pulse.

## 5. Identity and Addressing

### 5.1 Identifiers
Each PIN MUST possess a unique identifier (`key`) within the IAS.

- Identifiers are opaque to the protocol.
- No hierarchy or mandatory semantic structure is assumed.

### 5.2 Identity Resolution
A pulse MUST include a `target` field that matches a valid identifier.

## 6. Pulse Format

Recommended minimal pulse format:

```json
{
  "target": "string",
  "type": "string",
  "data": "any",
  "meta": {}
}
```

### Fields
- **target** (REQUIRED): PIN identifier.
- **type** (OPTIONAL): Semantic type of the pulse.
- **data** (OPTIONAL): Pulse content.
- **meta** (OPTIONAL): Additional metadata.

## 7. Standard Pulse Types

| Type       | Description                    |
|------------|--------------------------------|
| DATA       | State update                   |
| APPEND     | Incremental accumulation       |
| COMMAND    | Action execution               |
| MUTATE     | Behavior modification          |
| STREAM     | Continuous data flow           |
| HEARTBEAT  | Presence signal                |
| QUERY      | Information request            |

Systems MAY extend this set.

## 8. Receiver Behavior

A PIN:

- MAY ignore irrelevant pulses.
- MUST NOT trigger global recomposition.
- MUST preserve its identity after processing a pulse.
- MAY mutate its behavior if governance allows it.

## 9. Identity Discovery

AIP defines an optional discovery mechanism:

- Enumeration of available PINs.
- Capabilities exposed by each PIN.
- Accepted pulse types.

This mechanism replaces rigid contracts such as OpenAPI.

## 10. Governance and Security

Governance of AIP is intentionally not prescribed in this version.

RECOMMENDED practices:

- Authentication of emitters.
- Pulse signatures.
- Capability control per identity.
- Sandboxing for live mutability.

See the companion **AIP Security Profile v1.0**.

## 11. Transport

AIP is transport-agnostic.

Implementations MAY use:

- HTTP streaming
- WebSockets
- Binary streams
- Local IPC
- Edge runtimes

## 12. Implementation Considerations

- The protocol does not impose synchrony.
- Error handling is the responsibility of the receiver.
- Pulse loss does NOT imply global inconsistency.
- Continuity is prioritized over strict consistency.

## 13. Known Limitations

- Governance complexity in open systems.
- Security risks inherent to live mutability.
- Lack of mathematical formalization in this version.

## 14. Future Work

- Formalization of the model.
- Standardized security profiles.
- Discovery specification.
- Empirical evaluation.

## 15. Conclusion

AIP proposes an interaction model where interfaces cease to be passive endpoints and become addressable spaces of persistent entities, enabling new forms of system-to-system interaction beyond REST.
