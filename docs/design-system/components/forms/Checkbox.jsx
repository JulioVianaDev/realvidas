import React from "react";

/* Custom checkbox. Controlled via `checked`/`onChange` or uncontrolled. */

export function Checkbox({ checked, defaultChecked, onChange, label, disabled = false, invalid = false, style, ...rest }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;

  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };

  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
      fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--text-body)",
      userSelect: "none", ...style,
    }}>
      <input type="checkbox" checked={isControlled ? checked : undefined} defaultChecked={isControlled ? undefined : defaultChecked}
        onChange={toggle} disabled={disabled} {...rest}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 20, height: 20, flexShrink: 0,
        borderRadius: "var(--radius-xs)",
        border: `var(--border-w-2) solid ${on ? "var(--brand)" : invalid ? "var(--danger)" : "var(--border-strong)"}`,
        background: on ? "var(--brand)" : "var(--surface)",
        color: "var(--on-brand)",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
      }}>
        {on && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
