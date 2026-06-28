import * as React from "react";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  size?: "sm" | "md";
}

/** Toggle switch (green when on). */
export function Switch(props: SwitchProps): JSX.Element;
