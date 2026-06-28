import * as React from "react";

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

/** Pill button that toggles light/dark by setting data-theme on <html>; persists to localStorage ("rv-theme"). */
export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
