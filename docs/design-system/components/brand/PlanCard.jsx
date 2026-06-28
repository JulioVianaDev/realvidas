import React from "react";

/* Membership plan card (Plano Ouro / Prata / Bronze / Personalizado).
   tier sets the metal accent. `featured` raises it with a brand ring. */

const TIERS = {
  ouro:   { color: "var(--tier-ouro)", label: "Ouro" },
  prata:  { color: "var(--tier-prata)", label: "Prata" },
  bronze: { color: "var(--tier-bronze)", label: "Bronze" },
  custom: { color: "var(--secondary)", label: "Personalizado" },
};

export function PlanCard({
  tier = "ouro", name, coverage, price, features = [], featured = false,
  cta = "Conheça em detalhes", onSelect, href, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const t = TIERS[tier] || TIERS.custom;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        background: "var(--surface)", borderRadius: "var(--radius-xl)",
        border: `var(--border-w) solid ${featured ? "var(--brand-border)" : "var(--border)"}`,
        boxShadow: featured ? "var(--shadow-lg)" : hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        overflow: "hidden", transform: hover ? "translateY(-4px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style,
      }} {...rest}>
      {/* Metal cap */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${t.color}, color-mix(in srgb, ${t.color} 55%, #000))` }} />
      <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
            fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-xs)",
            letterSpacing: "0.12em", textTransform: "uppercase", color: t.color,
          }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: t.color }} />
            Plano {t.label}
          </span>
          {featured && <span style={{
            background: "var(--brand)", color: "var(--on-brand)", borderRadius: "var(--radius-pill)",
            padding: "2px var(--space-3)", fontFamily: "var(--font-display)", fontSize: "var(--text-2xs)",
            fontWeight: "var(--fw-bold)", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Mais escolhido</span>}
        </div>

        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-xl)", color: "var(--text-strong)", margin: 0 }}>{name}</h3>
          {coverage && <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)", margin: "4px 0 0" }}>{coverage}</p>}
        </div>

        {price && <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", color: "var(--text-strong)" }}>{price}</span>
        </div>}

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5" /></svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <a href={href} onClick={onSelect} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
          height: "var(--control-md)", borderRadius: "var(--radius-md)", textDecoration: "none",
          background: featured ? "var(--brand)" : "transparent",
          color: featured ? "var(--on-brand)" : "var(--text-strong)",
          border: featured ? "none" : "var(--border-w) solid var(--border-strong)",
          fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: "var(--text-sm)",
          boxShadow: featured ? "var(--shadow-sm)" : "none", cursor: "pointer",
        }}>{cta}</a>
      </div>
    </div>
  );
}
