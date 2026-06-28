import React from "react";

/* Toggle switch. Controlled or uncontrolled. */

export function Switch({ checked, defaultChecked, onChange, label, disabled = false, size = "md", style, ...rest }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const W = size === "sm" ? 36 : 44;
  const H = size === "sm" ? 20 : 26;
  const knob = H - 6;

  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };

  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-3)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
      fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--text-body)",
      userSelect: "none", ...style,
    }}>
      <input type="checkbox" checked={isControlled ? checked : undefined} defaultChecked={isControlled ? undefined : defaultChecked}
        onChange={toggle} disabled={disabled} {...rest}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: "relative", width: W, height: H, flexShrink: 0,
        borderRadius: "var(--radius-pill)",
        background: on ? "var(--accent)" : "var(--border-strong)",
        transition: "background var(--dur-base) var(--ease-out)",
      }}>
        <span style={{
          position: "absolute", top: 3, left: on ? W - knob - 3 : 3,
          width: knob, height: knob, borderRadius: "50%", background: "#fff",
          boxShadow: "var(--shadow-sm)",
          transition: "left var(--dur-base) var(--ease-out)",
        }} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
