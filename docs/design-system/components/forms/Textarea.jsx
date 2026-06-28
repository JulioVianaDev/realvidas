import React from "react";

/* Multi-line text input matching Input styling. */

export function Textarea({ invalid = false, disabled = false, rows = 4, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid ? "var(--danger)" : focus ? "var(--ring)" : "var(--border-strong)";
  return (
    <textarea rows={rows} disabled={disabled}
      onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
      {...rest}
      style={{
        width: "100%", padding: "var(--space-3) var(--space-4)",
        background: disabled ? "var(--surface-sunken)" : "var(--surface)",
        border: `var(--border-w) solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? `0 0 0 3px color-mix(in srgb, ${invalid ? "var(--danger)" : "var(--ring)"} 22%, transparent)` : "var(--shadow-inset)",
        color: "var(--text-body)", fontFamily: "var(--font-body)", fontSize: "var(--text-base)",
        lineHeight: "var(--leading-normal)", resize: "vertical", outline: "none",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }} />
  );
}
