import * as React from "react";
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "soft" | "brand";
  padding?: string;
  /** Brand accent stripe down the leading edge (service cards). */
  accentBar?: boolean;
  /** Lift + shadow on hover. */
  interactive?: boolean;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;
