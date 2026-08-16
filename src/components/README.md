# Alset Components

Reusable UI building blocks on top of the core runtime.  
All of them follow `docs/UX-Patterns.md`.

| Component | Purpose |
|-----------|---------|
| **FormField** | Label + Input + error, stable `key`, optional debounce validation |
| **StatusBadge** / **StatusBlock** | Local feedback for `idle \| loading \| success \| error \| empty` |
| **LivePanel** / **LiveDot** | Visual shell for nodes that accept live mutability / pulses |
| **SkeletonBar** / **SkeletonCard** | Local loading placeholders (no full-screen block) |

## Usage

```js
import { FormField, StatusBlock, LivePanel, ensureSkeletonStyles } from '../components/index.js';
import { alsetState, Column, mod } from '../core/AlsetPulseCore.js';

ensureSkeletonStyles(); // once at app start if you use Skeleton*

const email = alsetState("");
const status = alsetState("idle");

Column(mod().gap(16), () => {
  FormField({
    label: "Email",
    state: email,
    keyId: "form-email",
    placeholder: "you@alset.dev",
    validate: (v) => (!v.includes("@") ? "Invalid email" : "")
  });

  StatusBlock(status.get(), {
    loading: "Authenticating…",
    error: "Could not sign in",
    success: "Welcome back"
  });

  LivePanel({
    keyId: "admin-panel",
    live: true,
    label: "LIVE",
    childrenBlock: () => { /* content that may receive MUTATE pulses */ }
  });
});
```

## Rules

1. Every interactive field gets a **stable key** (`keyId`).
2. Feedback is **local** to the component that owns the status.
3. Live mutability is **visible** (green border + LIVE badge).
4. Prefer skeletons over blocking the whole viewport.
