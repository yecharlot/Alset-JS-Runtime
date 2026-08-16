# Alset UX Patterns v1.0

**Design and interaction patterns for the Alset runtime / AIP**

**Status:** Experimental · Operational draft  
**Scope:** Persistent identity, granular reactivity, forms, feedback states, mutability governance, accessibility, responsive design and animation  
**Source of truth:** `AlsetPulseCore.js` + `AlsetStudio.js` + AIP specifications

---

## 1. Key & Persistent Identity Management

### Principle
The `key` is identity. While it exists in `AlsetRegistry`, the node **is never destroyed or recreated**. This natively preserves focus, cursor, scroll and internal state.

### When to use `key`

| Case | Use `key` | Reason |
|------|-----------|--------|
| Input / Textarea / Editor | **Yes** (mandatory) | Preserve cursor and value while the rest of the UI pulses |
| Infinite scroll lists (`ColumnStream` / `RowStream`) | Yes (per item) | Avoid scroll jumps |
| Nodes that receive external pulses (telemetry, audio, video) | **Yes** | Without key there is no possible `target` |
| Buttons, icons, static texts | No | Unnecessary overhead |
| Layout containers (structural Column/Row) | Rarely | Only if the container itself must receive pulses |

### Golden rules
1. **One key = one logical node for life.** Never reuse the same key on two different components in the same session.
2. Semantic prefix: `"form-email"`, `"telemetry-clock"`, `"studio-editor"`, `"float-btn-main"`.
3. Keys generated with `Math.random()` only for disposable nodes (never for inputs or pulse receivers).
4. If two components “merge” visually, it is almost certainly a key collision — the characteristic bug of this model (does not exist in virtual-DOM frameworks).

### Recommended pattern
```js
// Correct
Input(emailState, mod().key("login-email").padding(14).radius(14)...);

// Incorrect (loses cursor on every recompose)
Input(emailState, mod().padding(14).radius(14)...);
```

---

## 2. Interaction States & Feedback

The runtime does not impose a convention today. The catch in AlsetStudio only shows a generic grey icon. That is not acceptable in production.

### Canonical states (always use these names)
```js
const status = alsetState("idle"); // "idle" | "loading" | "success" | "error" | "empty"
```

### Feedback pattern
```js
Column(mod().gap(12), () => {
  const s = status.get();

  if (s === "loading") {
    Row(mod().gap(8).align("center", "center"), () => {
      Icon("pulse", mod().size(18).color(Theme.current.primary));
      Text("Synchronizing…", mod().sizeText(13).color("#888"));
    });
    return;
  }

  if (s === "error") {
    Card(mod().border("1px solid #8B0000").background("rgba(139,0,0,0.15)"), () => {
      Text("Connection error", mod().color("#ff6b6b").weight("700"));
      Text("The node did not respond. Retrying…", mod().sizeText(12).color("#ccc"));
    });
    return;
  }

  if (s === "empty") {
    Column(mod().align("center", "center").padding(40), () => {
      Icon("layers", mod().size(48).color("#333"));
      Text("No data", mod().color("#555").margin("12 0 0 0"));
    });
    return;
  }

  // Real content
});
```

### Rule
Feedback is **always local to the node or its immediate container**. Never a global toast as the only response to a form failure.

---

## 3. Forms & Inputs

`Input` and `AlsetEditor` do not come with debounce or validation. The layer must be built on top.

### Standard controlled Input pattern
```js
const email = alsetState("");
const emailError = alsetState("");
const debouncedEmail = alsetState("");

let debounceTimer;
const onEmailChange = (val) => {
  email.set(val);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedEmail.set(val);
    if (!val.includes("@")) emailError.set("Invalid email");
    else emailError.set("");
  }, 300);
};

// In render:
Input(email, mod().key("form-email")
  .padding(14).radius(14)
  .background(emailError.get() ? "rgba(139,0,0,0.2)" : "rgba(255,255,255,0.05)")
  .border(emailError.get() ? "1px solid #8B0000" : "1px solid transparent")
  .color("#fff"),
  { placeholder: "Email" }
);

if (emailError.get()) {
  Text(emailError.get(), mod().sizeText(11).color("#ff6b6b").margin("4 0 0 4"));
}
```

### Form checklist
- [ ] Every input has a unique and stable `key`
- [ ] Validation runs on the debounced value, not every keystroke
- [ ] Submit button is visually disabled while `status === "loading"`
- [ ] Errors are shown **below** the field, never only in a toast

---

## 4. Live Mutability Governance in UI

From the Security Profile:

| Mode | Allowed use in UI |
|------|-------------------|
| **DISABLED** | Default for every end-user production interface |
| **CONTROLLED** | Only in internal tools (AlsetStudio, admin panels) and with Capability Token |
| **UNRESTRICTED** | Never in production. Lab / demos only |

### UX Rule
A node that changes behavior on the fly (`MUTATE_LOGIC`) **must** communicate it explicitly to the user (color change, “LIVE” badge, transition animation). If the user does not perceive that the node mutated, the interface feels treacherous.

Visual signal example:
```js
Column(mod().key("live-panel")
  .border("1px solid #00FF41")
  .addStyle("boxShadow", "0 0 20px rgba(0,255,65,0.3)"), () => {
  Text("● LIVE", mod().sizeText(10).color("#00FF41").weight("900"));
  // mutated content
});
```

---

## 5. Minimal Accessibility (currently missing)

The runtime currently only generates `div` and `span`. Semantics must be added manually.

### Mandatory conventions
```js
// Buttons
Column(mod().clickable(onClick)
  .addStyle("role", "button")
  .addStyle("tabIndex", "0")
  .on("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") onClick(e);
  }),
  () => Text("Action")
);
```

### Contrast
- Primary text on `#050505` → minimum `#E0E0E0`
- Secondary text → `#A0A0A0`
- Never use `#555` or darker for readable text
- Gold `#FFD700` only for accents and actions, never for long text

### Focus
Every `clickable` element must have a visible focus style:
```js
.addStyle("outline", "none")
.on("focus", (e) => e.target.style.boxShadow = "0 0 0 2px #FFD700")
.on("blur", (e) => e.target.style.boxShadow = "none")
```

---

## 6. Responsive with the breakpoint system

The `Modifier` already has `sm()`, `md()`, `lg()`, `xl()`. Use them consistently.

### Usage convention
```js
Column(mod()
  .padding(40)                    // desktop
  .md(m => m.padding(24))         // tablet
  .sm(m => m.padding(16).gap(12)) // mobile
  .fillMaxSize(),
() => { ... });
```

### Real breakpoints (from code)
- `sm` ≤ 480px
- `md` ≤ 768px
- `lg` ≤ 1024px
- `xl` > 1024px

### Rule
Never hardcode media queries. All responsive behavior goes through the Modifier. If a component needs a radically different layout on mobile, use `useBreakpoint()` + conditional render, not external CSS.

---

## 7. Animation: Animate() vs alsetState + setInterval

| Situation | Use | Reason |
|-----------|-----|--------|
| Entry/exit of an element | `Animate()` | Once, hardware-accelerated, clean |
| Continuously changing values (clocks, waves, particles) | `alsetState` + `setInterval` / `requestAnimationFrame` | Real reactivity of the runtime |
| Hover / focus micro-interactions | CSS transitions via `addStyle("transition", ...)` + `on` events | Cheaper and native |
| Page state transitions | `Animate()` wrapping the new content | Visual consistency |

### Anti-pattern (avoid)
Mixing `setInterval` that directly mutates DOM styles with the recompose system. That breaks “local resonance” and produces jitter.

---

## Quick decision summary

1. **Needs key?** → If it is an input, pulse receiver or scrollable list → yes.
2. **How to show loading/error?** → Local `status` state + immediate feedback on the node.
3. **Can I mutate live?** → Only in internal tools and with clear visual signal.
4. **How to do responsive?** → Only with `sm()/md()/lg()/xl()`.
5. **How to animate?** → `Animate()` for entries, `alsetState` for living values.
6. **Is it accessible?** → Role + tabIndex + contrast + visible focus.
