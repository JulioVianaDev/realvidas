import React from "react";

/* Text input. Optional leftIcon/rightIcon, error state, sizes sm|md|lg. */

const SIZES = {
  sm: { height: "var(--control-sm)", font: "var(--text-sm)", pad: "0 var(--space-3)" },
  md: { height: "var(--control-md)", font: "var(--text-base)", pad: "0 var(--space-4)" },
  lg: { height: "var(--control-lg)", font: "var(--text-md)", pad: "0 var(--space-5)" },
};

export function Input({
  size = "md", leftIcon, rightIcon, invalid = false, disabled = false,
  style, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const borderColor = invalid ? "var(--danger)" : focus ? "var(--ring)" : "var(--border-strong)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "var(--space-2)",
      height: s.height, padding: s.pad,
      background: disabled ? "var(--surface-sunken)" : "var(--surface)",
      border: `var(--border-w) solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)` : "var(--shadow-inset)",
      transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
      opacity: disabled ? 0.6 : 1, color: "var(--text-muted)",
      ...style,
    }}>
      {leftIcon && <span style={{ display: "flex", color: focus ? "var(--brand)" : "var(--text-subtle)" }}>{leftIcon}</span>}
      <input disabled={disabled}
        onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        {...rest}
        style={{
          flex: 1, minWidth: 0, height: "100%", border: "none", outline: "none",
          background: "transparent", color: "var(--text-body)",
          fontFamily: "var(--font-body)", fontSize: s.font,
        }} />
      {rightIcon && <span style={{ display: "flex", color: "var(--text-subtle)" }}>{rightIcon}</span>}
    </div>
  );
}
