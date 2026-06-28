import React from "react";

/* Determinate progress bar. value 0–100. tone sets fill. */

export function ProgressBar({ value = 0, tone = "brand", label, showValue = false, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = tone === "secondary" ? "var(--secondary)" : tone === "accent" ? "var(--accent)" : "var(--grad-emergency)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", ...style }} {...rest}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)" }}>
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{
        height: 8, background: "var(--bg-inset)", borderRadius: "var(--radius-pill)", overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: fill, borderRadius: "var(--radius-pill)",
          transition: "width var(--dur-slow) var(--ease-out)",
        }} />
      </div>
    </div>
  );
}
