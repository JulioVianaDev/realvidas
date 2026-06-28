import * as React from "react";
export interface PlanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: "ouro" | "prata" | "bronze" | "custom";
  name: React.ReactNode;
  coverage?: React.ReactNode;
  price?: React.ReactNode;
  features?: React.ReactNode[];
  /** Raises the card with a brand ring + filled CTA. */
  featured?: boolean;
  cta?: string;
  href?: string;
  onSelect?: () => void;
}
/** Membership plan card (Plano Ouro / Prata / Bronze / Personalizado). */
export function PlanCard(props: PlanCardProps): JSX.Element;
