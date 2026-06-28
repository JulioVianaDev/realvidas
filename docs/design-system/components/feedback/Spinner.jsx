import React from "react";

/* Spinner. size in px, tone sets the active arc color. */

export function Spinner({ size = 22, tone = "brand", thickness, style, ...rest }) {
  const color = tone === "brand" ? "var(--brand)" : tone === "secondary" ? "var(--secondary)" : tone === "accent" ? "var(--accent)" : "currentColor";
  const bw = thickness || Math.max(2, Math.round(size / 10));
  return (
    <span role="status" aria-label="Carregando" style={{
      display: "inline-block", width: size, height: size,
      border: `${bw}px solid color-mix(in srgb, ${color} 22%, transparent)`,
      borderTopColor: color, borderRadius: "50%",
      animation: "rv-spin 0.7s linear infinite", ...style,
    }} {...rest} />
  );
}
