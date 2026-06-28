import * as React from "react";
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  icon?: React.ReactNode;
  accent?: "brand" | "accent" | "secondary" | "neutral";
  align?: "start" | "center";
}
export function Stat(props: StatProps): JSX.Element;
