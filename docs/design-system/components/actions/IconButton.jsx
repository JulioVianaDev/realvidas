import React from "react";

/* Square icon-only button. Same variants as Button, plus a `round` flag
   for the floating WhatsApp / call bubbles Real Vidas uses. */

const SIZES = { sm: 34, md: 42, lg: 52 };

const VARIANTS = {
  primary:   { bg: "var(--brand)", color: "var(--on-brand)", border: "transparent", hoverBg: "var(--brand-hover)" },
  secondary: { bg: "var(--secondary)", color: "var(--on-secondary)", border: "transparent", hoverBg: "var(--secondary-hover)" },
  accent:    { bg: "var(--accent)", color: "var(--on-accent)", border: "transparent", hoverBg: "var(--accent-hover)" },
  whatsapp:  { bg: "#25D366", color: "#04301a", border: "transparent", hoverBg: "#1ebe5a" },
  outline:   { bg: "transparent", color: "var(--text-strong)", border: "var(--border-strong)", hoverBg: "var(--surface-hover)" },
  ghost:     { bg: "transparent", color: "var(--text-muted)", border: "transparent", hoverBg: "var(--surface-hover)" },
  soft:      { bg: "var(--brand-soft)", color: "var(--brand)", border: "transparent", hoverBg: "var(--brand-soft-2)" },
};

export function IconButton({
  icon, label, variant = "ghost", size = "md", round = false,
  disabled = false, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const css = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: dim, height: dim, padding: 0,
    color: v.color,
    background: hover && !disabled ? v.hoverBg : v.bg,
    border: `var(--border-w) solid ${v.border}`,
    borderRadius: round ? "var(--radius-pill)" : "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    boxShadow: variant === "whatsapp" || variant === "primary" ? "var(--shadow-sm)" : "none",
    transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
    transform: hover && !disabled ? "translateY(-1px)" : "none",
    ...style,
  };
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} style={css}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      {icon}
    </button>
  );
}
