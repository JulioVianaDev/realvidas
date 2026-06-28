import React from "react";

/* Styled native <select> with a chevron. Pass `options` [{value,label}] or children. */

const SIZES = {
  sm: { height: "var(--control-sm)", font: "var(--text-sm)", pad: "0 var(--space-8) 0 var(--space-3)" },
  md: { height: "var(--control-md)", font: "var(--text-base)", pad: "0 var(--space-10) 0 var(--space-4)" },
  lg: { height: "var(--control-lg)", font: "var(--text-md)", pad: "0 var(--space-10) 0 var(--space-5)" },
};

export function Select({ size = "md", options, invalid = false, disabled = false, children, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const borderColor = invalid ? "var(--danger)" : focus ? "var(--ring)" : "var(--border-strong)";
  return (
    <div style={{ position: "relative", display: "inline-flex", width: style?.width || "100%" }}>
      <select disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest}
        style={{
          width: "100%", height: s.height, padding: s.pad,
          appearance: "none", WebkitAppearance: "none",
          background: disabled ? "var(--surface-sunken)" : "var(--surface)",
          border: `var(--border-w) solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)` : "var(--shadow-inset)",
          color: "var(--text-body)", fontFamily: "var(--font-body)", fontSize: s.font,
          cursor: disabled ? "not-allowed" : "pointer", outline: "none",
          transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
          opacity: disabled ? 0.6 : 1, ...style,
        }}>
        {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
      </select>
      <span aria-hidden="true" style={{
        position: "absolute", right: "var(--space-3)", top: "50%", transform: "translateY(-50%)",
        pointerEvents: "none", color: "var(--text-subtle)", display: "flex",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </span>
    </div>
  );
}
