# Contributing to Alset JS Runtime

Thank you for your interest.

## Principles

1. **Identity first** — prefer persistent keys over recreation.
2. **Local resonance** — avoid anything that forces global recompose.
3. **Capability is explicit** — sensitive actions (MUTATE, COMMAND) must be gated.
4. **Documentation lives with the code** — update `docs/` when you change behavior.

## Development

```bash
# Serve examples
npx serve public -p 3000
npx serve examples/studio -p 3001
```

No build step is required for the core; it is plain ES modules.

## Pull requests

- Keep changes focused.
- Add or update an example when introducing a new primitive.
- Follow the UX Patterns in `docs/UX-Patterns.md` for any new UI surface.
- Do not introduce a virtual DOM or a global store that breaks the Registry model.

## Security

Live mutability (`MUTATE_LOGIC`) is powerful. Any new surface that accepts external code must document the governance mode (DISABLED / CONTROLLED / UNRESTRICTED) and, if exposed, require a Capability Token.
