/**
 * LivePanel — visual shell for nodes that accept MUTATE_LOGIC or live pulses.
 * Makes mutability visible so the UI never "betrays" the user silently.
 *
 * Governance: intended for CONTROLLED mode (internal tools / admin).
 * Do not use UNRESTRICTED surfaces without Capability Tokens.
 */
import { Column, Row, Text, mod, Theme } from '../core/AlsetPulseCore.js';

/**
 * @param {object} opts
 * @param {string} opts.keyId - stable Registry key (required for pulse targeting)
 * @param {boolean|(() => boolean)} [opts.live] - whether mutation is active
 * @param {string} [opts.label] - badge text (default "LIVE")
 * @param {Function} childrenBlock - content
 * @param {object} [m] - Modifier
 */
export function LivePanel({
  keyId,
  live = true,
  label = "LIVE",
  childrenBlock,
  m = mod()
}) {
  const isLive = typeof live === "function" ? live() : live;

  return Column(
    m
      .key(keyId)
      .position("relative")
      .radius(16)
      .padding(20)
      .background("rgba(10,10,10,0.6)")
      .border(isLive ? "1px solid #00FF41" : "1px solid rgba(255,255,255,0.08)")
      .addStyle("boxShadow", isLive
        ? "0 0 24px rgba(0,255,65,0.25), inset 0 1px 0 rgba(255,255,255,0.05)"
        : "none")
      .addStyle("transition", "box-shadow 0.3s, border-color 0.3s"),
    () => {
      // LIVE badge
      if (isLive) {
        Row(
          mod()
            .position("absolute")
            .top(10)
            .right(12)
            .gap(6)
            .align("center", "center")
            .padding("4px 10px")
            .radius(12)
            .background("rgba(0,255,65,0.15)")
            .border("1px solid #00FF41"),
          () => {
            Column(mod()
              .size(6, 6)
              .radius(3)
              .background("#00FF41")
              .addStyle("boxShadow", "0 0 8px #00FF41"),
              () => {});
            Text(label, mod().sizeText(10).color("#00FF41").weight("900")
              .addStyle("letterSpacing", "1px"));
          }
        );
      }

      if (typeof childrenBlock === "function") childrenBlock();
    }
  );
}

/**
 * Minimal indicator only (for embedding inside other cards)
 */
export function LiveDot(active = true, m = mod()) {
  const on = typeof active === "function" ? active() : active;
  return Column(
    m
      .size(10, 10)
      .radius(5)
      .background(on ? "#00FF41" : "#333")
      .addStyle("boxShadow", on ? "0 0 10px #00FF41" : "none"),
    () => {}
  );
}
