import React from "react";

/* Avatar: image, or initials fallback. Optional status ring. */

const SIZES = { sm: 32, md: 42, lg: 56, xl: 72 };

export function Avatar({ src, name = "", size = "md", status, style, ...rest }) {
  const dim = SIZES[size] || (typeof size === "number" ? size : 42);
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const statusColor = status === "online" ? "var(--success)" : status === "busy" ? "var(--danger)" : "var(--text-subtle)";
  return (
    <span style={{ position: "relative", display: "inline-flex", width: dim, height: dim, ...style }} {...rest}>
      {src ? (
        <img src={src} alt={name} style={{
          width: dim, height: dim, borderRadius: "50%", objectFit: "cover",
          border: "var(--border-w-2) solid var(--surface)", boxShadow: "var(--shadow-xs)",
        }} />
      ) : (
        <span style={{
          width: dim, height: dim, borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--secondary)", color: "var(--on-secondary)",
          fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)",
          fontSize: dim * 0.38, letterSpacing: "0.02em",
        }}>{initials || "?"}</span>
      )}
      {status && <span style={{
        position: "absolute", right: 0, bottom: 0,
        width: dim * 0.28, height: dim * 0.28, borderRadius: "50%",
        background: statusColor, border: "2px solid var(--surface)",
      }} />}
    </span>
  );
}
