import React from "react";

/* Inline alert / callout. tone: info | success | warning | danger | brand */

const TONES = {
  info:    { bg: "var(--info-soft)", bar: "var(--info)", color: "var(--info-text)", icon: "info" },
  success: { bg: "var(--success-soft)", bar: "var(--success)", color: "var(--success-text)", icon: "check-circle" },
  warning: { bg: "var(--warning-soft)", bar: "var(--warning)", color: "var(--warning-text)", icon: "alert-triangle" },
  danger:  { bg: "var(--danger-soft)", bar: "var(--danger)", color: "var(--danger-text)", icon: "alert-triangle" },
  brand:   { bg: "var(--brand-soft)", bar: "var(--brand)", color: "var(--danger-text)", icon: "heart-pulse" },
};

function Glyph({ name }) {
  const paths = {
    "info": ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20", "M12 16v-4", "M12 8h.01"],
    "check-circle": ["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", "m9 12 2 2 4-4"],
    "alert-triangle": ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"],
    "heart-pulse": ["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z", "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"],
  }[name];
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths.map((d, i) => <path key={i} d={d} />)}</svg>;
}

export function Alert({ tone = "info", title, children, style, ...rest }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div role="status" style={{
      display: "flex", gap: "var(--space-3)",
      padding: "var(--space-4)", background: t.bg,
      borderRadius: "var(--radius-md)",
      borderInlineStart: `var(--border-w-accent) solid ${t.bar}`,
      color: "var(--text-body)", ...style,
    }} {...rest}>
      <span style={{ color: t.bar, flexShrink: 0, marginTop: 1 }}><Glyph name={t.icon} /></span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {title && <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", color: t.color }}>{title}</strong>}
        {children && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-snug)" }}>{children}</span>}
      </div>
    </div>
  );
}
