import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  invalid?: boolean;
}

/** Single-line text input with optional icons and error state. */
export function Input(props: InputProps): JSX.Element;
