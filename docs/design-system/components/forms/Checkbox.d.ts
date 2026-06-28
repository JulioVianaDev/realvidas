import * as React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  invalid?: boolean;
}

/** Custom checkbox with brand-red fill. */
export function Checkbox(props: CheckboxProps): JSX.Element;
