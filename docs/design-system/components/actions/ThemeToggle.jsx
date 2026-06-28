import React from "react";
import { Icon } from "../icon/Icon.jsx";

/* Light/dark switch. Reads & writes data-theme on <html> and persists to
   localStorage under "rv-theme". Drop one in any header. */

function getInitial() {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("rv-theme") : null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ size = "md", style, ...rest }) {
  const [theme, setTheme] = React.useState(getInitial);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("rv-theme", theme); } catch (e) {}
  }, [theme]);

  const dim = size === "sm" ? 34 : size === "lg" ? 52 : 42;
  const isDark = theme === "dark";

  return (
    <button type="button" aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={isDark} title={isDark ? "Tema claro" : "Tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: dim, height: dim, borderRadius: "var(--radius-pill)",
        border: "var(--border-w) solid var(--border)",
        background: hover ? "var(--surface-hover)" : "var(--surface)",
        color: "var(--text-body)", cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style,
      }} {...rest}>
      <Icon name={isDark ? "sun" : "moon"} size={size === "sm" ? 16 : 18} />
    </button>
  );
}
