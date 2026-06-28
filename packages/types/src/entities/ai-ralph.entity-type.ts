import type { IAiRalphStepCheck } from "../validators/ralph-step-check.types";

export type IAiRalphKind = "MOCKED" | "CUSTOM";

export const RALPH_STEP_VALUE_TYPES = [
    "string",
    "number",
    "date",
    "cpf",
    "phone",
    "email",
] as const;

export type IAiRalphStepValueType = (typeof RALPH_STEP_VALUE_TYPES)[number];

/** Embedded step stored in the ralph JSON column. */
export interface IAiRalphStep {
    uuid: string;
    position: number;
    /** What the AI should ask / collect from the user. */
    descriptionCampus: string;
    /** Field key used in the dynamic validation schema (info_name). */
    name: string;
    type: IAiRalphStepValueType;
    checks: IAiRalphStepCheck[];
    isObrigatory: boolean;
}

/** @deprecated Use IAiRalphStep */
export type IAiRalphStepEntity = IAiRalphStep;

export interface IAiRalphEntity {
    id: string;
    enterpriseId: string;
    kind: IAiRalphKind;
    /** Identifier used to resolve the service class in the MOCKED/CUSTOM registries. */
    handlerKey: string;
    name: string;
    description: string;
    reutilizable: boolean;
    /** Monotonic version per handlerKey lineage. Starts at 1. */
    version: number;
    steps: IAiRalphStep[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

/** Legacy step shape kept for JSON migration in repositories. */
export interface ILegacyAiRalphStep extends Partial<IAiRalphStep> {
    description?: string;
    valueTypeExpected?: IAiRalphStepValueType;
    mask?: string | null;
    obrigatory?: boolean;
}
