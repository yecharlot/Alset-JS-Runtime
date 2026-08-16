# 🔐 AIP Security Profile v1.0

## Security Profile for the Alset Interaction Protocol

## Document Status

**Status:** Experimental  
**Version:** 1.0  
**Date:** 2025  
**Related to:** AIP Specification v1.0  
**Audience:** Security architects, researchers in distributed systems, runtime systems, interactive systems.

This document defines an initial **security profile** for implementations of the **Alset Interaction Protocol (AIP)**.  
It describes **principles, recommended mechanisms and governance models**, without imposing a specific implementation.

---

## 1. Introduction

AIP introduces a model based on **persistent addressable entities** and **live mutability**, significantly expanding the capability space of an interactive system.

These capabilities require an **explicit security model**, different from traditional REST systems where risk is managed mainly through isolation, rigid contracts and absence of runtime mutation.

This profile defines how to **control capability**, not how to eliminate it.

## 2. Security Principles in AIP

### 2.1 Capability-Based Security, not Perimeter

AIP adopts a **capability security** approach:

- No implicit trust by location is assumed.
- Each pulse represents a **potential capability**.
- Authorization is evaluated **by identity and pulse type**, not by a global endpoint.

### 2.2 Identity Before Authentication

In AIP, the identity of the **Persistent Identity Node (PIN)** is primary.

- Authentication validates **who emits** a pulse.
- Identity defines **what can be affected**.

Security is applied **at the point of resonance**, not only in transport.

### 2.3 Secure-by-Default Denial

Every PIN MUST assume:

- Unauthorized pulses → **ignored**
- Unknown pulses → **not executed**
- Invalid pulses → **not propagated**

Absence of response does NOT imply failure.

## 3. Threat Model

Main vectors considered:

1. Emission of unauthorized pulses
2. Spoofing of emitter identity
3. Malicious behavior mutation
4. Logical saturation by pulses (DoS)
5. Unauthorized exploration of the identity space

## 4. Pulse Authentication

### 4.1 Pulse Signature (RECOMMENDED)

Pulses SHOULD include a signature block:

```json
{
  "target": "string",
  "type": "COMMAND",
  "data": {},
  "meta": {
    "signature": "string",
    "issuer": "string",
    "timestamp": 1735270000
  }
}
```

**Rules:**

- Signature MUST be validated before resonance.
- Issuer identifies the logical emitter.
- Timestamp helps prevent replay attacks.

### 4.2 Verification

PINs or the AIP runtime MAY implement:

- Shared keys
- Asymmetric signatures
- Ephemeral tokens
- Capability certificates

The protocol does not prescribe a single mechanism.

## 5. Capability Authorization

### 5.1 Capability Matrix

Each PIN SHOULD explicitly declare:

- Accepted pulse types
- Authorized emitters
- Execution conditions

Conceptual example:

```json
{
  "accepts": ["DATA", "QUERY"],
  "mutate": false,
  "emitters": ["telemetry-service"]
}
```

### 5.2 Sensitive Capabilities

The following pulses are considered **sensitive**:

- MUTATE
- COMMAND
- STREAM (bidirectional)

These MUST be restricted by default.

## 6. Live Mutability Security

### 6.1 Principle of Confined Mutability

Live mutability MUST be:

- Explicit
- Limited
- Governed

RECOMMENDED:

- Sandboxing of mutated code
- Isolated execution environments
- Controlled access to global resources

### 6.2 Mutability Modes

| Mode          | Description                          |
|---------------|--------------------------------------|
| DISABLED      | Mutation forbidden                   |
| CONTROLLED    | Mutation under rules                 |
| UNRESTRICTED  | Full mutation (experimental only)    |

## 7. Secure Identity Discovery

The Interactive Address Space MUST NOT be fully exposed by default.

RECOMMENDED:

- Partial discovery
- Filtering by emitter
- Anonymization of internal identities

## 8. Protection against Logical DoS

AIP defines logical mitigation mechanisms:

- Rate limiting per emitter
- Pulse prioritization
- Queues per identity
- Silent discard under pressure

## 9. Audit and Observability

Implementations SHOULD allow:

- Logging of critical pulses
- Traceability by identity
- Mutation auditing
- Observation without interference

## 10. Transport and Security

AIP inherits risks from the underlying transport.

RECOMMENDED:

- TLS for HTTP/WS transports
- Isolation of binary streams
- Framing validation

## 11. Failures and Recovery

On validation failure:

- The pulse is discarded
- Identity is preserved
- The system continues operating

Global collapse due to local failure is not allowed.

## 12. Implementation Considerations

- Security is evaluated **at resonance**, not only at the entry point.
- The UI is an attack surface and must be treated as such.
- Operational continuity is priority.

## 13. Limitations of Profile v1.0

- Does not define a mandatory cryptographic scheme.
- Does not standardize secure discovery.
- Does not formalize mutation isolation.

These areas are reserved for future versions.

## 14. Future Work

- AIP Secure Discovery Profile
- AIP Capability Tokens
- Formal threat modeling
- Verified execution environments

## 15. Conclusion

AIP requires a security model aligned with its architecture:  
**capability, identity and governance**, instead of perimeter and endpoints.

> *Security in living systems is not achieved by freezing the system, but by governing its capacity for change.*
