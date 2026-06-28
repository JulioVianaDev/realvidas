import React from "react";

/* Breadcrumb. items: [{label, href?}]. Last item is the current page. */

export function Breadcrumb({ items = [], style, ...rest }) {
  return (
    <nav aria-label="Breadcrumb" style={{ ...style }} {...rest}>
      <ol style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-2)",
        listStyle: "none", margin: 0, padding: 0,
        fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
      }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
              {last || !it.href ? (
                <span aria-current={last ? "page" : undefined} style={{ color: last ? "var(--text-strong)" : "var(--text-muted)", fontWeight: last ? "var(--fw-semibold)" : "var(--fw-regular)" }}>{it.label}</span>
              ) : (
                <a href={it.href} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{it.label}</a>
              )}
              {!last && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
