import * as React from "react";
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Full name — initials are derived for the fallback. */
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
  status?: "online" | "busy" | "offline";
}
export function Avatar(props: AvatarProps): JSX.Element;
