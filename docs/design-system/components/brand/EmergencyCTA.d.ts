import * as React from "react";
export interface EmergencyCTAProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  phone?: string;
  phoneHref?: string;
  whatsappHref?: string;
}
/** Signature brand-red emergency band with phone + WhatsApp CTAs. */
export function EmergencyCTA(props: EmergencyCTAProps): JSX.Element;
