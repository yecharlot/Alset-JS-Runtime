/**
 * FormField — label + Input + error message
 * Follows UX Patterns: stable key, local error, optional debounce hook.
 */
import { Column, Text, Input, mod, alsetState } from '../core/AlsetPulseCore.js';

/**
 * @param {object} opts
 * @param {string} opts.label
 * @param {import('../core/AlsetPulseCore.js').alsetState} opts.state  - alsetState for the value
 * @param {string} opts.keyId - stable identity key (required)
 * @param {string} [opts.placeholder]
 * @param {string} [opts.type] - "text" | "password" | "email"
 * @param {(value: string) => string} [opts.validate] - returns error string or ""
 * @param {number} [opts.debounceMs]
 * @param {import('../core/AlsetPulseCore.js').Modifier} [opts.m]
 */
export function FormField({
  label,
  state,
  keyId,
  placeholder = "",
  type = "text",
  validate = null,
  debounceMs = 300,
  m = mod()
}) {
  const error = alsetState("");
  let timer = null;

  // Wrap the original state so we can debounce validation
  // Input still binds directly to `state` for cursor persistence.
  const originalSet = state.set.bind(state);
  state.set = (val) => {
    originalSet(val);
    if (!validate) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      error.set(validate(val) || "");
    }, debounceMs);
  };

  return Column(m.gap(6).width("100%"), () => {
    if (label) {
      Text(label, mod().sizeText(12).color("#888").weight("600"));
    }

    Input(
      state,
      mod()
        .key(keyId)
        .padding(14)
        .radius(14)
        .width("100%")
        .background(error.get()
          ? "rgba(139,0,0,0.25)"
          : "rgba(255,255,255,0.05)")
        .border(error.get()
          ? "1px solid #8B0000"
          : "1px solid transparent")
        .color("#fff"),
      { placeholder, type }
    );

    if (error.get()) {
      Text(error.get(), mod().sizeText(11).color("#ff6b6b").margin("2 0 0 4"));
    }
  });
}

/**
 * Helper to run all validators before submit.
 * @param {Array<() => string>} validators - each returns error or ""
 * @returns {boolean} true if all valid
 */
export function validateAll(validators) {
  let ok = true;
  for (const v of validators) {
    if (v()) ok = false;
  }
  return ok;
}
