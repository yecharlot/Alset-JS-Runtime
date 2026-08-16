# Alset Runtime Architecture

**Version:** 0.6.0 Chronos  
**Source:** `src/core/AlsetPulseCore.js`

---

## High-level view

```
┌─────────────────────────────────────────────────────────┐
│                    External Systems                     │
│              (emit pulses via AIP)                      │
└──────────────────────────┬──────────────────────────────┘
                           │ pulse { target, type, data }
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   AlsetRegistry (Map)                   │
│         key → DOM element with __alsetPulse             │
└──────────────────────────┬──────────────────────────────┘
                           │ O(1) lookup
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Persistent Identity Node                   │
│  • local state                                          │
│  • __alsetRender / recomposeAction                      │
│  • optional live mutability                             │
└──────────────────────────┬──────────────────────────────┘
                           │ localized resonance
                           ▼
                    UI update (no global tree)
```

---

## 1. AlsetRegistry — Identity Persistence

```js
export const AlsetRegistry = new Map();
```

- Lives **outside** any render cycle.
- A node with a `key` is stored here the first time it is created.
- Subsequent calls with the same key return the **same** DOM element.
- This is what makes focus, cursor and scroll survive updates.

```js
const el = (key && AlsetRegistry.has(key))
  ? AlsetRegistry.get(key)
  : document.createElement(tag);
if (key && !AlsetRegistry.has(key)) AlsetRegistry.set(key, el);
```

---

## 2. Scheduler — Deterministic batching

```js
function scheduleRecompose(fn) {
  scheduled.add(fn);
  if (flushScheduled) return;
  flushScheduled = true;
  queueMicrotask(() => {
    // batch all pending recomposes
  });
}
```

- All reactive updates are coalesced into a single microtask.
- Eliminates visual jitter (the “Quorum of Consensus” of the UI).
- Errors in one recompose do not stop the rest of the batch.

---

## 3. alsetState — Granular reactivity

```js
export function alsetState(initialValue) {
  const state = {
    value: initialValue,
    subscribers: new Set(),
    get() { /* track currentTracker */ return this.value; },
    set(newValue) {
      if (Object.is(this.value, newValue)) return;
      this.value = newValue;
      this.subscribers.forEach(fn => scheduleRecompose(fn));
    }
  };
  return state;
}
```

- Only the nodes that actually read the state during their last recompose are notified.
- No virtual DOM, no tree diffing.
- Dependency tracking is done via `currentTracker` + `WeakMap`.

---

## 4. Modifier — Fluent style API

Inspired by Jetpack Compose / SwiftUI:

```js
mod()
  .width(300)
  .padding(20)
  .radius(16)
  .glass()
  .clickable(() => {})
  .sm(m => m.padding(12))
  .key("persistent-id");
```

- Styles are applied differentially (`applyStyles` only writes changed properties).
- Responsive variants (`sm/md/lg/xl`) are resolved at recompose time according to `window.innerWidth`.
- Event handlers and click handlers are bound only once (`__alsetBoundClick` flag).

---

## 5. createNode & recomposeAction

The heart of the engine:

1. Resolve or create the element via Registry.
2. Collect dependencies of the previous render (garbage-collect old subscriptions).
3. Apply styles (including responsive overrides).
4. Bind events if not already bound.
5. Set `currentContext` / `currentTracker` and execute the children block.
6. Restore previous context.

This is **recomposition**, not recreation.

---

## 6. Pulse path (AIP)

```js
el.__alsetPulse = (pulse) => {
  if (pulse?.action === "MUTATE_LOGIC") {
    el.__alsetRender = new Function('data', pulse.code);
    return el.recomposeAction();
  }
  if (el.__alsetState) el.__alsetState.set(pulse.data || pulse);
  else el.recomposeAction(pulse);
};
```

External systems never call methods on components.  
They emit a pulse with a `target` key; the Registry delivers it.

---

## 7. Theme & Energy-aware mode

```js
export const Theme = {
  current: {
    primary: "#FFD700",
    secondary: "#8B0000",
    background: "#050505",
    surface: "rgba(255,255,255,0.05)",
    radius: 24
  },
  _version: alsetState(0),
  set(newTheme) { ... }
};
```

Changing the theme increments `_version`, causing every node that called `applyTheme()` to recompose.

---

## 8. Streams, Forms, Editor, Map, Audio, Video

Higher-level primitives built on the same model:

- `ColumnStream` / `RowStream` — infinite lists with local scroll preservation.
- `Input` / `AlsetEditor` — special-cased to keep the native element alive via Registry.
- `MapNode`, `AudioNode`, `VideoNode` — nodes that expose `__alsetPulse` for external control.
- `AlsetPulseStream` — XHR/streaming client that turns network messages into Registry lookups.

---

## Design invariants

1. **Identity before rendering order.**
2. **Local resonance only.** No cascade unless explicitly subscribed.
3. **Continuity over consistency.** Losing a pulse does not force a full rebuild.
4. **Capability is explicit.** Mutability and sensitive actions are gated.

These invariants are what make the UX patterns (keys, feedback, mutability governance) necessary rather than optional.
