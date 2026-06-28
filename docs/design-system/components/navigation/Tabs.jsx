import React from "react";

/* Tabs. items: [{id,label,icon?}]. Controlled via value/onChange or uncontrolled.
   variant: underline | pill */

export function Tabs({ items = [], value, defaultValue, onChange, variant = "underline", style }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (items[0] && items[0].id));
  const active = isControlled ? value : internal;
  const select = (id) => { if (!isControlled) setInternal(id); onChange && onChange(id); };

  if (variant === "pill") {
    return (
      <div role="tablist" style={{
        display: "inline-flex", gap: 4, padding: 4, background: "var(--bg-inset)",
        borderRadius: "var(--radius-pill)", ...style,
      }}>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button key={it.id} role="tab" aria-selected={on} onClick={() => select(it.id)} style={{
              display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-4)", border: "none",
              borderRadius: "var(--radius-pill)", cursor: "pointer",
              background: on ? "var(--surface)" : "transparent",
              color: on ? "var(--brand)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-sm)" : "none",
              fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)",
              transition: "color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
            }}>
              {it.icon}{it.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" style={{ display: "flex", gap: "var(--space-6)", borderBottom: "var(--border-w) solid var(--border)", ...style }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button key={it.id} role="tab" aria-selected={on} onClick={() => select(it.id)} style={{
            display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
            padding: "var(--space-3) 2px", border: "none", background: "transparent", cursor: "pointer",
            color: on ? "var(--text-strong)" : "var(--text-muted)",
            fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: "var(--fw-semibold)",
            borderBottom: `var(--border-w-accent) solid ${on ? "var(--brand)" : "transparent"}`,
            marginBottom: -1, transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
          }}>
            {it.icon}{it.label}
          </button>
        );
      })}
    </div>
  );
}
