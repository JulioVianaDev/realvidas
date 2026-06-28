import React from "react";

/* Real Vidas Button.
   variant: primary | secondary | accent | outline | ghost | danger | whatsapp
   size: sm | md | lg  ·  optional leftIcon / rightIcon (ReactNode)
   Renders an <a> when `href` is set, otherwise a <button>. */

const SIZES = {
  sm: { height: "var(--control-sm)", padding: "0 var(--space-4)", font: "var(--text-sm)", gap: "var(--space-2)", radius: "var(--radius-sm)" },
  md: { height: "var(--control-md)", padding: "0 var(--space-5)", font: "var(--text-base)", gap: "var(--space-2)", radius: "var(--radius-md)" },
  lg: { height: "var(--control-lg)", padding: "0 var(--space-8)", font: "var(--text-md)", gap: "var(--space-3)", radius: "var(--radius-md)" },
};

const VARIANTS = {
  primary:   { bg: "var(--brand)", color: "var(--on-brand)", border: "transparent", shadow: "var(--shadow-sm)", hoverBg: "var(--brand-hover)" },
  secondary: { bg: "var(--secondary)", color: "var(--on-secondary)", border: "transparent", shadow: "var(--shadow-sm)", hoverBg: "var(--secondary-hover)" },
  accent:    { bg: "var(--accent)", color: "var(--on-accent)", border: "transparent", shadow: "var(--shadow-sm)", hoverBg: "var(--accent-hover)" },
  danger:    { bg: "var(--danger)", color: "#fff", border: "transparent", shadow: "var(--shadow-sm)", hoverBg: "var(--brand-active)" },
  outline:   { bg: "transparent", color: "var(--text-strong)", border: "var(--border-strong)", shadow: "none", hoverBg: "var(--surface-hover)" },
  ghost:     { bg: "transparent", color: "var(--text-body)", border: "transparent", shadow: "none", hoverBg: "var(--surface-hover)" },
  whatsapp:  { bg: "#25D366", color: "#04301a", border: "transparent", shadow: "var(--shadow-sm)", hoverBg: "#1ebe5a" },
};

export function Button({
  children, variant = "primary", size = "md", leftIcon, rightIcon,
  fullWidth = false, disabled = false, loading = false, href, type = "button",
  style, onMouseEnter, onMouseLeave, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  const css = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: s.gap, height: s.height, padding: s.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)",
    fontSize: s.font, lineHeight: 1, letterSpacing: "0.01em",
    color: v.color,
    background: hover && !isDisabled ? v.hoverBg : v.bg,
    border: `var(--border-w) solid ${v.border}`,
    borderRadius: s.radius,
    boxShadow: variant === "outline" || variant === "ghost" ? "none" : v.shadow,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.55 : 1,
    transform: hover && !isDisabled ? "translateY(-1px)" : "translateY(0)",
    transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
    textDecoration: "none", whiteSpace: "nowrap", userSelect: "none",
    ...style,
  };

  const enter = (e) => { setHover(true); onMouseEnter && onMouseEnter(e); };
  const leave = (e) => { setHover(false); onMouseLeave && onMouseLeave(e); };

  const inner = (
    <>
      {loading && <Spinner />}
      {!loading && leftIcon}
      {children && <span>{children}</span>}
      {!loading && rightIcon}
    </>
  );

  if (href && !isDisabled) {
    return <a href={href} style={css} onMouseEnter={enter} onMouseLeave={leave} {...rest}>{inner}</a>;
  }
  return (
    <button type={type} disabled={isDisabled} style={css} onMouseEnter={enter} onMouseLeave={leave} {...rest}>
      {inner}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width: "1em", height: "1em", borderRadius: "50%",
      border: "2px solid color-mix(in srgb, currentColor 35%, transparent)",
      borderTopColor: "currentColor", display: "inline-block",
      animation: "rv-spin 0.7s linear infinite",
    }} />
  );
}
