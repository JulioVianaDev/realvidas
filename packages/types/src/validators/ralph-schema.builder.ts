import { z, type ZodTypeAny } from "zod";
import {
    IAiRalphStep,
    IAiRalphStepValueType,
    RALPH_STEP_VALUE_TYPES,
} from "../entities/ai-ralph.entity-type";
import { maskToRegex } from "./mask-to-regex";
import {
    IAiRalphStepCheck,
    IAiRalphStepCheckType,
} from "./ralph-step-check.types";

const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
const PHONE_REGEX =
    /^\+?\d{1,3}?[\s-]?\(?\d{2,3}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

export const ralphStepTypeMap: Record<
    IAiRalphStepValueType,
    () => ZodTypeAny
> = {
    string: () => z.string(),
    number: () => z.number(),
    date: () =>
        z.union([
            z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
                message: "Invalid date string",
            }),
            z.date(),
        ]),
    cpf: () => z.string().regex(CPF_REGEX, "Invalid CPF format"),
    phone: () => z.string().regex(PHONE_REGEX, "Invalid phone format"),
    email: () => z.string().email(),
};

export const ralphStepChecks: Record<
    IAiRalphStepCheckType,
    (
        schema: ZodTypeAny,
        value?: string | number,
    ) => ZodTypeAny
> = {
    email: (schema) => {
        if (!(schema instanceof z.ZodString)) return schema;
        return (schema as z.ZodString).email();
    },
    url: (schema) => {
        if (!(schema instanceof z.ZodString)) return schema;
        return (schema as z.ZodString).url();
    },
    uuid: (schema) => {
        if (!(schema instanceof z.ZodString)) return schema;
        return (schema as z.ZodString).uuid();
    },
    min: (schema, value) => {
        if (schema instanceof z.ZodString && typeof value === "number") {
            return schema.min(value);
        }
        if (schema instanceof z.ZodNumber && typeof value === "number") {
            return schema.min(value);
        }
        return schema;
    },
    max: (schema, value) => {
        if (schema instanceof z.ZodString && typeof value === "number") {
            return (schema as z.ZodString).max(value);
        }
        if (schema instanceof z.ZodNumber && typeof value === "number") {
            return (schema as z.ZodNumber).max(value);
        }
        return schema;
    },
    regex: (schema, value) => {
        if (!(schema instanceof z.ZodString) || typeof value !== "string") {
            return schema;
        }
        return (schema as z.ZodString).regex(new RegExp(value));
    },
    mask: (schema, value) => {
        if (!(schema instanceof z.ZodString) || typeof value !== "string") {
            return schema;
        }
        return (schema as z.ZodString).regex(maskToRegex(value), {
            message: `Must match mask: ${value}`,
        });
    },
    int: (schema) => {
        if (!(schema instanceof z.ZodNumber)) return schema;
        return (schema as z.ZodNumber).int();
    },
    positive: (schema) => {
        if (!(schema instanceof z.ZodNumber)) return schema;
        return (schema as z.ZodNumber).positive();
    },
    negative: (schema) => {
        if (!(schema instanceof z.ZodNumber)) return schema;
        return (schema as z.ZodNumber).negative();
    },
    optional: (schema) => schema.optional(),
    nullable: (schema) => schema.nullable(),
};

export function applyRalphStepChecks(
    schema: ZodTypeAny,
    checks: IAiRalphStepCheck[] = [],
): ZodTypeAny {
    return checks.reduce(
        (current, check) =>
            ralphStepChecks[check.type](current, check.value),
        schema,
    );
}

export function buildRalphStepSchema(step: IAiRalphStep): ZodTypeAny {
    const baseFactory = ralphStepTypeMap[step.type];
    if (!baseFactory) {
        throw new Error(`Unsupported ralph step type: ${step.type}`);
    }
    return applyRalphStepChecks(baseFactory(), step.checks ?? []);
}

export function buildRalphSchema(
    steps: IAiRalphStep[],
): z.ZodObject<Record<string, ZodTypeAny>> {
    const shape: Record<string, ZodTypeAny> = {};

    for (const step of steps) {
        let fieldSchema = buildRalphStepSchema(step);
        if (!step.isObrigatory) {
            fieldSchema = fieldSchema.optional();
        }
        shape[step.name] = fieldSchema;
    }

    return z.object(shape);
}

export function buildRalphPartialSchema(
    steps: IAiRalphStep[],
): z.ZodObject<Record<string, ZodTypeAny>> {
    return buildRalphSchema(steps).partial();
}

export function assertRalphStepTypesValid(types: string[]): void {
    for (const type of types) {
        if (!(RALPH_STEP_VALUE_TYPES as readonly string[]).includes(type)) {
            throw new Error(`Invalid ralph step type: ${type}`);
        }
    }
}

export function assertRalphStepNamesUnique(steps: IAiRalphStep[]): void {
    const seen = new Set<string>();
    for (const step of steps) {
        if (seen.has(step.name)) {
            throw new Error(`Duplicate ralph step name: ${step.name}`);
        }
        seen.add(step.name);
    }
}
