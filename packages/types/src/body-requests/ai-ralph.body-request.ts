import {
    IAiRalphKind,
    IAiRalphStepValueType,
    RALPH_STEP_VALUE_TYPES,
} from "../entities/ai-ralph.entity-type";
import {
    IAiRalphStepCheck,
    IAiRalphStepCheckType,
    RALPH_STEP_CHECK_TYPES,
} from "../validators/ralph-step-check.types";

export interface IAiRalphStepInput {
    uuid?: string;
    position: number;
    descriptionCampus: string;
    name: string;
    type: IAiRalphStepValueType;
    checks?: IAiRalphStepCheck[];
    isObrigatory: boolean;
}

export interface IPostCreateAiRalphBodyRequest {
    enterpriseId: string;
    kind: IAiRalphKind;
    /** Assigned by the backend on create; clients must not send this. */
    handlerKey?: string;
    name: string;
    description: string;
    reutilizable: boolean;
    steps: IAiRalphStepInput[];
    isActive?: boolean;
}

/** Creates a new immutable version from an existing ralph (never updates in place). */
export interface IPostCreateAiRalphVersionBodyRequest {
    name: string;
    description: string;
    reutilizable: boolean;
    steps: IAiRalphStepInput[];
    isActive?: boolean;
}
