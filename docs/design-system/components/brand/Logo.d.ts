import * as React from "react";
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "full" | "wordmark" | "mark";
  /** "color" = red mark; "mono" = inherits currentColor (for dark/brand headers). */
  tone?: "color" | "mono";
  /** Mark height in px; wordmark scales from this. Default 40. */
  size?: number;
  showTagline?: boolean;
}
/** Real Vidas logo lockup (placeholder built from brand mark + Montserrat — swap for official files). */
export function Logo(props: LogoProps): JSX.Element;
