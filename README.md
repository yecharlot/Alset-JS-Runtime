# Alset JS Runtime

**Interfaces as Addressable Spaces**  
A pulse-based interaction model with persistent identity.

[![Status](https://img.shields.io/badge/status-experimental-orange)]()
[![Version](https://img.shields.io/badge/version-0.6.0%20Chronos-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

Alset is an experimental JavaScript runtime that treats user interfaces as **addressable spaces of persistent entities**. Instead of destroying and recreating the DOM on every state change, Alset keeps nodes alive under stable keys (`AlsetRegistry`) and updates them through **pulses** — identity-directed stimuli.

This repository contains:

- The core runtime (`AlsetPulseCore`)
- AIP (Alset Interaction Protocol) specifications
- UX design patterns tailored to the runtime
- Working examples and a visual IDE (AlsetStudio)
- Academic papers and security profiles

---

## Core Ideas

| Concept | Meaning |
|---------|---------|
| **Persistent Identity Node (PIN)** | A UI entity with a stable `key`. It is never destroyed while registered. |
| **Interactive Address Space (IAS)** | The set of all addressable PINs. |
| **Pulse** | An asynchronous message `{ target, type, data, meta }` directed at a specific key. |
| **Localized Resonance** | The node reacts locally. No global re-render / virtual-DOM diff. |
| **Live Mutability** | A node can change its behavior at runtime (`MUTATE_LOGIC`) under governance. |

```js
// The connection that makes everything work
if (AlsetRegistry.has(pulse.target)) {
  AlsetRegistry.get(pulse.target).__alsetPulse(pulse.data);
}
```

---

## Quick Start

```bash
# Clone / open the repo
cd Alset-JS-Runtime

# Serve the entire repository from the root (required for relative ES module imports)
npx --yes serve . -p 3000
```

Then open in the browser:

| URL | What you get |
|-----|----------------|
| http://localhost:3000/public/ | Landing page with links |
| http://localhost:3000/examples/basic/ | Counter + theme demo |
| http://localhost:3000/examples/forms/ | Login form with keys & feedback |
| http://localhost:3000/examples/telemetry/ | Pulse-driven telemetry nodes |
| http://localhost:3000/examples/studio/ | Full AlsetStudio visual IDE |
| http://localhost:3000/examples/components/ | FormField, Status, LivePanel, Skeleton |


In code:

```js
import {
  AlsetInspector, Column, Row, Text, mod, alsetState,
  Card, Button, Input, Theme
} from './src/core/AlsetPulseCore.js';

const count = alsetState(0);

AlsetInspector(() => {
  Column(mod().fillMaxSize().background("#050505").align("center", "center").gap(20), () => {
    Text(`Count: ${count.get()}`, mod().sizeText(32).color("#FFD700").weight("900"));
    Button("Increment", () => count.set(count.get() + 1));
  });
});
```

---

## Project Structure

```
Alset-JS-Runtime/
├── src/core/AlsetPulseCore.js     # Main runtime (v6 Chronos)
├── public/                        # Minimal entry point
├── examples/
│   ├── basic/                     # Hello world & primitives
│   ├── forms/                     # Login / Register patterns
│   ├── telemetry/                 # Pulse-driven UI example
│   ├── components/                # FormField, Status, LivePanel, Skeleton
│   └── studio/                    # Full visual IDE (AlsetStudio)
├── docs/
│   ├── AIP-Specification.md
│   ├── AIP-Security-Profile.md
│   ├── AIP-Extended-Specification.md
│   ├── Onward-Paper.md
│   ├── UX-Patterns.md
│   └── Architecture.md
├── package.json
└── README.md
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [AIP Specification v1.0](docs/AIP-Specification.md) | Core protocol: pulses, PINs, resonance, transport |
| [AIP Security Profile](docs/AIP-Security-Profile.md) | Capability-based security, mutability modes, threat model |
| [AIP Extended Spec](docs/AIP-Extended-Specification.md) | Discovery, Capability Tokens, Governance, STRIDE analysis |
| [Onward! Paper](docs/Onward-Paper.md) | Academic paper + cover letter (EN / ES) |
| [UX Patterns](docs/UX-Patterns.md) | Design patterns for keys, forms, feedback, a11y, animation |
| [Architecture](docs/Architecture.md) | How Registry, Scheduler, State and Modifier work together |

---

## Key Runtime APIs

```js
// Reactive state (granular)
const value = alsetState(0);
value.get(); value.set(1);

// Layout primitives
Column(mod(), () => { ... });
Row(mod(), () => { ... });
Text("Hello", mod().color("#FFD700"));
Card(mod(), () => { ... });
Button("Click", () => {}, mod());

// Fluent modifier (Compose-style)
mod()
  .width(300).padding(20).radius(16)
  .glass()
  .clickable(() => {})
  .sm(m => m.padding(12))
  .key("my-persistent-node");

// Forms
const email = alsetState("");
Input(email, mod().key("form-email"), { placeholder: "Email" });

// Persistent editor
AlsetEditor(codeState, mod().fillMaxSize());

// External pulses (AIP)
AlsetPulseStream("https://your-server/pulse");
```

---

## Design Philosophy

> *"Alset no se impone. Alset resuena."*

- **Continuity over recreation** — identity survives updates.
- **Local over global** — only the addressed node resonates.
- **Capability over perimeter** — security is expressed as what a pulse may do to a specific identity.
- **Governance of change** — live mutability is powerful and therefore regulated.

---

## License

MIT © Alset Project

---

## Citation

If you use this work in research, please cite the Onward! paper (see `docs/Onward-Paper.md`).

```
Alset Project. Interfaces as Addressable Spaces:
A Pulse-Based Interaction Model with Persistent Identity. 2025.
```
