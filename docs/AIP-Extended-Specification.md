# 📘 AIP Extended Specification v1.0

## Discovery · Capability Tokens · Governance · Security Analysis

## Document Status

- **Status:** Experimental / Draft for Review
- **Version:** 1.0
- **Year:** 2025
- **Related:** AIP Specification v1.0, AIP Security Profile v1.0
- **Author:** Alset Project

---

# PART I — AIP Discovery Specification v1.0

## 1. Introduction

Discovery in AIP defines how an external system can identify **which persistent entities exist**, **what capabilities they expose** and **under which conditions**, without resorting to rigid contracts such as OpenAPI.

AIP replaces the concept of *endpoint discovery* with **discovery of interactive identities**.

## 2. Discovery Principles

1. Discovery is **optional**
2. Discovery is **partial by default**
3. Discovery is **contextual**
4. Discovery **does not imply authorization**

## 3. Discovery Space

A **Discovery Interactive Address Space (DIAS / EDI-D)** is defined as a controlled view of the Interactive Address Space (IAS).

## 4. Discovery Model

Conceptual response format:

```json
{
  "nodes": [
    {
      "key": "reloj-digital",
      "accepts": ["DATA", "QUERY"],
      "mutable": false,
      "description": "Telemetry clock"
    }
  ]
}
```

## 5. Discovery Modes

| Mode     | Description                          |
|----------|--------------------------------------|
| CLOSED   | No discovery                         |
| FILTERED | Partial discovery                    |
| OPEN     | Full discovery (not recommended)     |

---

# PART II — AIP Capability Tokens

## 6. Introduction

**Capability Tokens** define **what actions an emitter may perform** over **which identities**, without depending on global roles.

## 7. Token Structure

```json
{
  "issuer": "alset-core",
  "subject": "telemetry-service",
  "capabilities": {
    "reloj-digital": ["DATA", "QUERY"],
    "canvas-remoto": ["APPEND"]
  },
  "expires": 1735279999
}
```

## 8. Principles

- Tokens **grant capability**, not identity
- They are **revocable**
- They are **node-specific**
- They are **time-limited**

## 9. Token Evaluation

A pulse is processed only if:

1. The token is valid
2. The token has not expired
3. The pulse type is authorized
4. The target matches

---

# PART III — AIP Governance Model

## 10. Introduction

Governance defines **how interaction power is controlled**, especially under live mutability.

## 11. Governance Levels

| Level   | Description          |
|---------|----------------------|
| SYSTEM  | Global control       |
| NODE    | Per-identity control |
| PULSE   | Per-type control     |
| SESSION | Contextual control   |

## 12. Governance Policies

Conceptual example:

```json
{
  "node": "altavoz-nautilus",
  "mutability": "CONTROLLED",
  "allowedEmitters": ["audio-service"],
  "rateLimit": "10/s"
}
```

## 13. Core Principle

**Governance does not eliminate capabilities; it regulates them.**

---

# PART IV — Formal Security Analysis (STRIDE-style)

## 14. Methodology

STRIDE adapted to AIP:

| STRIDE | AIP Risk                        |
|--------|---------------------------------|
| S      | Emitter spoofing                |
| T      | Unauthorized mutation           |
| R      | Lack of traceability            |
| I      | Exposure of the IAS             |
| D      | Saturation by pulses            |
| E      | Capability escalation           |

## 15. Analysis by Category

### S — Spoofing
- Mitigation: Signatures + Capability Tokens

### T — Tampering
- Mitigation: Governed mutability + Sandbox

### R — Repudiation
- Mitigation: Selective auditing

### I — Information Disclosure
- Mitigation: Filtered discovery

### D — Denial of Service
- Mitigation: Logical rate limiting

### E — Elevation of Privilege
- Mitigation: Node-specific tokens

## 16. Residual Risk

AIP accepts controlled residual risk in exchange for **operational continuity**.

## 17. Security Conclusion

> *In living systems, security is not achieved by freezing the system, but by governing its capacity for change.*
