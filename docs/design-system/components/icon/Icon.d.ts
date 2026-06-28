import * as React from "react";

export type IconName =
  | "phone" | "mail" | "map-pin" | "clock" | "heart-pulse" | "activity"
  | "shield" | "shield-check" | "user" | "users" | "menu" | "x" | "check"
  | "check-circle" | "chevron-down" | "chevron-right" | "arrow-right" | "plus"
  | "minus" | "search" | "alert-triangle" | "info" | "calendar" | "star"
  | "map-pinned" | "truck" | "plane" | "flame" | "graduation-cap" | "file-text"
  | "credit-card" | "sun" | "moon" | "external-link" | "send" | "whatsapp";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon name from the Real Vidas set. */
  name: IconName;
  /** Pixel size (width & height). Default 20. */
  size?: number;
  /** Stroke width for line icons. Default 2. */
  strokeWidth?: number;
}

/** Real Vidas iconography: Lucide-geometry line icons + brand glyphs, all currentColor. */
export function Icon(props: IconProps): JSX.Element;
