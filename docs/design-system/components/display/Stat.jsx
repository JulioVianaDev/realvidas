import React from "react";

/* Headline metric block (e.g. "24h cobertura", "+10 anos"). */

export function Stat({ value, label, icon, accent = "brand", align = "start", style, ...rest }) {
  const color = accent === "brand" ? "var(--brand)" : accent === "accent" ? "var(--accent)" : accent === "secondary" ? "var(--secondary)" : "var(--text-strong)";
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "var(--space-1)",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align === "center" ? "center" : "start", ...style,
    }} {...rest}>
      {icon && <span style={{ color, display: "flex", marginBottom: "var(--space-1)" }}>{icon}</span>}
      <span style={{
        fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)",
        fontSize: "var(--text-2xl)", lineHeight: 1, color,
        letterSpacing: "var(--tracking-tight)",
      }}>{value}</span>
      <span style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
        color: "var(--text-muted)", lineHeight: "var(--leading-snug)",
      }}>{label}</span>
    </div>
  );
}
