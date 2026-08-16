/**
 * Skeleton — local loading placeholders.
 * Prefer these over blocking the whole screen.
 */
import { Column, Row, mod } from '../core/AlsetPulseCore.js';

/**
 * Single skeleton bar
 */
export function SkeletonBar(width = "100%", height = 12, m = mod()) {
  return Column(
    m
      .width(width)
      .height(height)
      .radius(6)
      .background("linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)")
      .addStyle("backgroundSize", "200% 100%")
      .addStyle("animation", "alset-shimmer 1.4s ease infinite"),
    () => {}
  );
}

/**
 * Card-shaped skeleton (title + lines)
 */
export function SkeletonCard(m = mod()) {
  return Column(
    m
      .padding(20)
      .radius(16)
      .background("rgba(255,255,255,0.03)")
      .border("1px solid #222")
      .gap(12)
      .width(280),
    () => {
      SkeletonBar("40%", 14);
      SkeletonBar("100%", 10);
      SkeletonBar("85%", 10);
      SkeletonBar("60%", 10);
    }
  );
}

/**
 * Inject the shimmer keyframes once (call from app root if needed)
 */
export function ensureSkeletonStyles() {
  if (document.getElementById("alset-skeleton-css")) return;
  const style = document.createElement("style");
  style.id = "alset-skeleton-css";
  style.textContent = `
    @keyframes alset-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}
