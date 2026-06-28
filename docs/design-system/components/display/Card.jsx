import React from "react";

/* Surface container. variant: elevated | outlined | soft | brand
   `accentBar` adds the brand top/left accent stripe Real Vidas uses on service cards. */

const VARIANTS = {
  elevated: { bg: "var(--surface)", border: "transparent", shadow: "var(--shadow-md)" },
  outlined: { bg: "var(--surface)", border: "var(--border)", shadow: "none" },
  soft:     { bg: "var(--bg-subtle)", border: "transparent", shadow: "none" },
  brand:    { bg: "var(--brand-soft)", border: "var(--brand-border)", shadow: "none" },
};

export function Card({
  variant = "elevated", padding = "var(--space-6)", accentBar = false,
  interactive = false, children, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.elevated;
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        position: "relative", background: v.bg,
        border: `var(--border-w) solid ${v.border}`,
        borderRadius: "var(--radius-lg)", padding,
        boxShadow: interactive && hover ? "var(--shadow-lg)" : v.shadow,
        transform: interactive && hover ? "translateY(-3px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        cursor: interactive ? "pointer" : "default",
        overflow: "hidden", ...style,
      }} {...rest}>
      {accentBar && <span style={{
        position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: "var(--border-w-accent)",
        background: "var(--grad-emergency)",
      }} />}
      {children}
    </div>
  );
}
