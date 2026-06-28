export const RALPH_STEP_CHECK_TYPES = [
    "email",
    "url",
    "uuid",
    "min",
    "max",
    "regex",
    "mask",
    "int",
    "positive",
    "negative",
    "optional",
    "nullable",
] as const;

export type IAiRalphStepCheckType = (typeof RALPH_STEP_CHECK_TYPES)[number];

export interface IAiRalphStepCheck {
    type: IAiRalphStepCheckType;
    /** Required for min, max, regex, mask */
    value?: string | number;
}

/** Check types that require a `value` when configured in the form. */
export const RALPH_STEP_CHECKS_WITH_VALUE: IAiRalphStepCheckType[] = [
    "min",
    "max",
    "regex",
    "mask",
];
