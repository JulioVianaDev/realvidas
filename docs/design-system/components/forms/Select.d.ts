import * as React from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: "sm" | "md" | "lg";
  /** Convenience option list; alternatively pass <option> children. */
  options?: SelectOption[];
  invalid?: boolean;
}

/** Styled native select with chevron. */
export function Select(props: SelectProps): JSX.Element;
