import * as React from "react";
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value?: number;
  tone?: "brand" | "secondary" | "accent";
  label?: React.ReactNode;
  showValue?: boolean;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
