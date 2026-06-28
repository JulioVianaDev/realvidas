import * as React from "react";
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "brand" | "secondary" | "success" | "warning" | "danger" | "info" | "solid";
  dot?: boolean;
  /** Animate the dot — use for "24h" / live status. */
  pulse?: boolean;
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
