import * as React from "react";
export interface TabItem { id: string; label: React.ReactNode; icon?: React.ReactNode; }
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "underline" | "pill";
  style?: React.CSSProperties;
}
export function Tabs(props: TabsProps): JSX.Element;
