import { buildRalphSchema } from "./ralph-schema.builder";
import { IAiRalphEntity } from "../entities/ai-ralph.entity-type";
import { buildRalphStepSchema } from "./ralph-schema.builder";

export type IRalphValues = Record<string, unknown>;

export interface IRalphValidationResult {
    valid: boolean;
    /** Values that passed validation, keyed by step uuid (for tool bindings). */
    accepted: IRalphValues;
    /** Values keyed by step name (for schema-aligned consumers). */
    acceptedByName: IRalphValues;
    /** Per-step errors keyed by step name. */
    errors: Record<string, string[]>;
    /** Obrigatory step names still missing a value. */
    missing: string[];
    /** Obrigatory step uuids still missing a value. */
    missingUuids: string[];
    /** True when every obrigatory step has an accepted value. */
    completed: boolean;
}

function getPatchValue(
    step: { name: string; uuid: string },
    patch: IRalphValues,
): unknown | undefined {
    if (patch[step.name] !== undefined) return patch[step.name];
    if (patch[step.uuid] !== undefined) return patch[step.uuid];
    return undefined;
}

function formatZodErrors(error: import("zod").ZodError): string[] {
    return error.issues.map((issue) => issue.message);
}

/**
 * Validate a *partial* ralph fill. Patch keys should use step `name`, but
 * `uuid` keys are accepted for backward compatibility.
 */
export function validateRalphValues(
    ralph: IAiRalphEntity,
    current: IRalphValues,
    patch: IRalphValues,
): IRalphValidationResult {
    const errors: Record<string, string[]> = {};
    const accepted: IRalphValues = { ...current };
    const acceptedByName: IRalphValues = {};

    for (const step of ralph.steps ?? []) {
        const existing =
            current[step.uuid] ??
            current[step.name] ??
            acceptedByName[step.name];
        if (existing !== undefined) {
            accepted[step.uuid] = existing;
            acceptedByName[step.name] = existing;
        }
    }

    for (const step of ralph.steps ?? []) {
        const incoming = getPatchValue(step, patch);
        if (incoming === undefined) continue;

        const stepSchema = buildRalphStepSchema(step);
        const parsed = stepSchema.safeParse(incoming);

        if (!parsed.success) {
            errors[step.name] = formatZodErrors(parsed.error);
            continue;
        }

        accepted[step.uuid] = parsed.data;
        acceptedByName[step.name] = parsed.data;
    }

    const missing = (ralph.steps ?? [])
        .filter(
            (step) =>
                step.isObrigatory &&
                (acceptedByName[step.name] === undefined ||
                    acceptedByName[step.name] === null),
        )
        .map((step) => step.name);

    const missingUuids = (ralph.steps ?? [])
        .filter(
            (step) =>
                step.isObrigatory &&
                (accepted[step.uuid] === undefined ||
                    accepted[step.uuid] === null),
        )
        .map((step) => step.uuid);

    return {
        valid: Object.keys(errors).length === 0,
        accepted,
        acceptedByName,
        errors,
        missing,
        missingUuids,
        completed: missing.length === 0,
    };
}

/** Validate a full payload against the ralph schema (anti-hallucination check). */
export function validateRalphPayload(
    ralph: IAiRalphEntity,
    payload: IRalphValues,
): IRalphValidationResult {
    const schema = buildRalphSchema(ralph.steps ?? []);
    const parsed = schema.safeParse(payload);

    if (parsed.success) {
        const acceptedByName = parsed.data as IRalphValues;
        const accepted: IRalphValues = {};
        for (const step of ralph.steps ?? []) {
            if (acceptedByName[step.name] !== undefined) {
                accepted[step.uuid] = acceptedByName[step.name];
            }
        }
        const missing = (ralph.steps ?? [])
            .filter(
                (step) =>
                    step.isObrigatory &&
                    acceptedByName[step.name] === undefined,
            )
            .map((step) => step.name);

        return {
            valid: true,
            accepted,
            acceptedByName,
            errors: {},
            missing,
            missingUuids: (ralph.steps ?? [])
                .filter(
                    (step) =>
                        step.isObrigatory &&
                        accepted[step.uuid] === undefined,
                )
                .map((step) => step.uuid),
            completed: missing.length === 0,
        };
    }

    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "_root");
        errors[key] = [...(errors[key] ?? []), issue.message];
    }

    return {
        valid: false,
        accepted: {},
        acceptedByName: {},
        errors,
        missing: (ralph.steps ?? [])
            .filter((step) => step.isObrigatory)
            .map((step) => step.name),
        missingUuids: (ralph.steps ?? [])
            .filter((step) => step.isObrigatory)
            .map((step) => step.uuid),
        completed: false,
    };
}
