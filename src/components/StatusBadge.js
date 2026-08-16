/**
 * StatusBadge — local feedback for idle | loading | success | error | empty
 * Always render near the node that owns the status (never only as a global toast).
 */
import { Column, Row, Text, Card, mod, Theme } from '../core/AlsetPulseCore.js';

const STYLES = {
  idle:    { color: "#888",    border: "1px solid #333",           bg: "rgba(255,255,255,0.03)" },
  loading: { color: "#FFD700", border: "1px solid #FFD70055",      bg: "rgba(255,215,0,0.08)" },
  success: { color: "#00FF41", border: "1px solid #00FF4155",      bg: "rgba(0,255,65,0.10)" },
  error:   { color: "#ff6b6b", border: "1px solid #8B0000",        bg: "rgba(139,0,0,0.18)" },
  empty:   { color: "#666",    border: "1px solid #333",           bg: "rgba(255,255,255,0.03)" }
};

const LABELS = {
  idle: "Ready",
  loading: "Synchronizing…",
  success: "Done",
  error: "Error",
  empty: "No data"
};

/**
 * Compact badge
 * @param {string|(() => string)} status - "idle"|"loading"|"success"|"error"|"empty" or getter
 * @param {string} [message] - optional override message
 * @param {object} [m] - Modifier
 */
export function StatusBadge(status, message = null, m = mod()) {
  const s = typeof status === "function" ? status() : status;
  const style = STYLES[s] || STYLES.idle;
  const label = message || LABELS[s] || s;

  return Row(
    m
      .padding("6px 12px")
      .radius(20)
      .background(style.bg)
      .border(style.border)
      .align("center", "center")
      .gap(8),
    () => {
      // Dot
      Column(mod()
        .size(8, 8)
        .radius(4)
        .background(style.color)
        .addStyle("boxShadow", s === "loading" ? `0 0 8px ${style.color}` : "none"),
        () => {});
      Text(label, mod().sizeText(12).color(style.color).weight("700"));
    }
  );
}

/**
 * Full feedback block (for forms / panels)
 * Renders nothing when status is "idle".
 */
export function StatusBlock(status, messages = {}, m = mod()) {
  const s = typeof status === "function" ? status() : status;
  if (s === "idle") return;

  const style = STYLES[s] || STYLES.idle;
  const text = messages[s] || LABELS[s] || s;

  return Card(
    m
      .padding(12)
      .background(style.bg)
      .border(style.border)
      .radius(12),
    () => Text(text, mod().sizeText(13).color(style.color).weight("600"))
  );
}
