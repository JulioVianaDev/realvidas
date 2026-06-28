import React from "react";
import { Icon } from "../icon/Icon.jsx";

/* Signature emergency call band — brand-red gradient with phone + WhatsApp.
   The recurring "Pensou em remoções ou emergências? Fale com a Real Vidas" CTA. */

export function EmergencyCTA({
  title = "Pensou em Remoções ou Emergências?",
  subtitle = "Fale com a Real Vidas — atendimento 24 horas, todos os dias.",
  phone = "(12) 99715-1128",
  phoneHref = "tel:+5512997151128",
  whatsappHref = "https://api.whatsapp.com/send?phone=5512997151128",
  style, ...rest
}) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "var(--grad-emergency)", color: "#fff",
      borderRadius: "var(--radius-xl)", padding: "var(--space-8)",
      display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
      gap: "var(--space-6)", boxShadow: "var(--shadow-brand)", ...style,
    }} {...rest}>
      {/* faint ECG motif */}
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
        <path d="M0 40 H120 L140 14 L168 66 L188 30 L205 40 H400" fill="none" stroke="#fff" strokeWidth="3" />
      </svg>
      <div style={{ position: "relative", maxWidth: 520 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", margin: 0, lineHeight: "var(--leading-tight)", color: "#fff" }}>{title}</h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-md)", margin: "var(--space-3) 0 0", color: "rgba(255,255,255,0.92)" }}>{subtitle}</p>
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: 230 }}>
        <a href={phoneHref} style={{
          display: "inline-flex", alignItems: "center", gap: "var(--space-3)",
          background: "#fff", color: "var(--brand)", borderRadius: "var(--radius-md)",
          padding: "var(--space-3) var(--space-5)", textDecoration: "none",
          fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-lg)",
          boxShadow: "var(--shadow-md)",
        }}>
          <Icon name="phone" size={22} />{phone}
        </a>
        <a href={whatsappHref} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
          background: "#25D366", color: "#04301a", borderRadius: "var(--radius-md)",
          padding: "var(--space-3) var(--space-5)", textDecoration: "none",
          fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", fontSize: "var(--text-base)",
        }}>
          <Icon name="whatsapp" size={20} />WhatsApp 24h
        </a>
      </div>
    </div>
  );
}
