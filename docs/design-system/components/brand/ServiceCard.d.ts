import * as React from "react";
export interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  cta?: string;
}
/** Service tile (icon + title + description + "Saiba mais"), as on the Real Vidas services grid. */
export function ServiceCard(props: ServiceCardProps): JSX.Element;
