import * as React from "react";

export type ButtonVariant =
  | "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Primary action control for Real Vidas. Emergency/primary actions use `primary`
 * (red) or `whatsapp`; institutional actions use `secondary` (navy).
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon node placed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon node placed after the label. */
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  /** Render as an anchor when set. */
  href?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
