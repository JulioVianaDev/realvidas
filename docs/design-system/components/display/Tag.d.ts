import * as React from "react";
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "brand" | "secondary" | "success";
  icon?: React.ReactNode;
  /** Renders a remove (×) button when provided. */
  onRemove?: () => void;
  children?: React.ReactNode;
}
export function Tag(props: TagProps): JSX.Element;
