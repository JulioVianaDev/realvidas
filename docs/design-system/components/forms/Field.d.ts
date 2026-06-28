import * as React from "react";

export interface FieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  /** Helper text shown below when there's no error. */
  hint?: React.ReactNode;
  /** Error message (replaces hint, turns red). */
  error?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Label + helper/error wrapper for any form control. */
export function Field(props: FieldProps): JSX.Element;
