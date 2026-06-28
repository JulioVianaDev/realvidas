import React from "react";

/* Tag / chip with optional leading icon and removable X.
   Used for service categories & filters. tone like Badge but squarer. */

const TONES = {
  neutral:   { bg: "var(--surface)", border: "var(--border)", color: "var(--text-body)" },
  brand:     { bg: "var(--brand-soft)", border: "var(--brand-border)", color: "var(--danger-text)" },
  secondary: { bg: "var(--secondary-soft)", border: "var(--secondary-border)", color: "var(--info-text)" },
  success:   { bg: "var(--success-soft)", border: "transparent", color: "var(--success-text)" },
};

export function Tag({ tone = "neutral", icon, onRemove, children, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
      padding: "5px var(--space-3)", borderRadius: "var(--radius-sm)",
      background: t.bg, border: `var(--border-w) solid ${t.border}`, color: t.color,
      fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-medium)",
      lineHeight: 1.4, whiteSpace: "nowrap", ...style,
    }} {...rest}>
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
      {onRemove && (
        <button type="button" aria-label="Remover" onClick={onRemove} style={{
          display: "inline-flex", border: "none", background: "transparent", color: "inherit",
          cursor: "pointer", padding: 0, marginInlineStart: 2, opacity: 0.7,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </span>
  );
}
