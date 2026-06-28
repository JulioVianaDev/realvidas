import * as React from "react";
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  tone?: "brand" | "secondary" | "accent" | "current";
  thickness?: number;
}
export function Spinner(props: SpinnerProps): JSX.Element;
