import * as React from "react";

export type IconButtonVariant =
  | "primary" | "secondary" | "accent" | "whatsapp" | "outline" | "ghost" | "soft";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon node (e.g. <Icon name="phone" />). */
  icon: React.ReactNode;
  /** Accessible label (also used as title). */
  label: string;
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Pill/circular shape — used for floating call & WhatsApp bubbles. */
  round?: boolean;
}

/** Square or round icon-only button matching Button's variants. */
export function IconButton(props: IconButtonProps): JSX.Element;
