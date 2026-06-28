import React from "react";

/* Small status pill. tone: neutral | brand | success | warning | danger | info | secondary
   `dot` adds a leading status dot; `pulse` animates it (for 24h / "ao vivo"). */

const TONES = {
  neutral:   { bg: "var(--bg-subtle)", color: "var(--text-muted)", dot: "var(--text-subtle)" },
  brand:     { bg: "var(--brand-soft)", color: "var(--danger-text)", dot: "var(--brand)" },
  secondary: { bg: "var(--secondary-soft)", color: "var(--info-text)", dot: "var(--secondary)" },
  success:   { bg: "var(--success-soft)", color: "var(--success-text)", dot: "var(--success)" },
  warning:   { bg: "var(--warning-soft)", color: "var(--warning-text)", dot: "var(--warning)" },
  danger:    { bg: "var(--danger-soft)", color: "var(--danger-text)", dot: "var(--danger)" },
  info:      { bg: "var(--info-soft)", color: "var(--info-text)", dot: "var(--info)" },
  solid:     { bg: "var(--brand)", color: "var(--on-brand)", dot: "#fff" },
};

export function Badge({ tone = "neutral", dot = false, pulse = false, children, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
      padding: "3px var(--space-3)", borderRadius: "var(--radius-pill)",
      background: t.bg, color: t.color,
      fontFamily: "var(--font-display)", fontSize: "var(--text-xs)", fontWeight: "var(--fw-semibold)",
      letterSpacing: "0.02em", lineHeight: 1.6, whiteSpace: "nowrap", ...style,
    }} {...rest}>
      {dot && (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, display: "block" }} />
          {pulse && <span style={{
            position: "absolute", inset: 0, borderRadius: "50%", background: t.dot,
            animation: "rv-ping 1.6s var(--ease-out) infinite",
          }} />}
        </span>
      )}
      {children}
    </span>
  );
}
