import React from "react";

/* Form field wrapper: label, optional required mark, helper / error text. */

export function Field({ label, htmlFor, required = false, hint, error, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", ...style }}>
      {label && (
        <label htmlFor={htmlFor} style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: "var(--fw-semibold)",
          color: "var(--text-strong)", display: "inline-flex", gap: 4,
        }}>
          {label}{required && <span style={{ color: "var(--brand)" }}>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--danger-text)", fontFamily: "var(--font-body)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-subtle)", fontFamily: "var(--font-body)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
