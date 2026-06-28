import React from "react";
import { Card } from "../display/Card.jsx";

/* Service tile — icon, title, description, "Saiba mais" link.
   Mirrors the Real Vidas services grid. */

export function ServiceCard({ icon, title, description, href, cta = "Saiba mais", style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <Card variant="outlined" interactive padding="var(--space-6)"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", height: "100%", ...style }} {...rest}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 56, height: 56, borderRadius: "var(--radius-md)",
        background: hover ? "var(--brand)" : "var(--brand-soft)",
        color: hover ? "var(--on-brand)" : "var(--brand)",
        transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)",
      }}>{icon}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-lg)", color: "var(--text-strong)", margin: 0, lineHeight: "var(--leading-snug)" }}>{title}</h3>
        {description && <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)", margin: 0, lineHeight: "var(--leading-normal)" }}>{description}</p>}
      </div>
      {href && (
        <a href={href} style={{
          display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
          color: "var(--brand)", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)",
          fontSize: "var(--text-sm)", textDecoration: "none",
        }}>
          {cta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: hover ? "translateX(3px)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
      )}
    </Card>
  );
}
