import {
    IAiRalphStep,
    ILegacyAiRalphStep,
} from "../entities/ai-ralph.entity-type";
import { IAiRalphStepInput } from "../body-requests/ai-ralph.body-request";
import { IAiRalphStepCheck } from "./ralph-step-check.types";

export function normalizeRalphStepInput(
    raw: IAiRalphStepInput | ILegacyAiRalphStep,
    position: number,
    generateUuid: () => string = () => `step-${position}`,
): IAiRalphStep {
    const checks: IAiRalphStepCheck[] = [...(raw.checks ?? [])];

    const legacyMask = (raw as ILegacyAiRalphStep).mask;
    if (checks.length === 0 && legacyMask) {
        checks.push({ type: "mask", value: legacyMask });
    }

    const legacyDescription =
        (raw as ILegacyAiRalphStep).description ??
        raw.descriptionCampus ??
        "";

    return {
        uuid: raw.uuid ?? generateUuid(),
        position: raw.position ?? position,
        descriptionCampus: raw.descriptionCampus ?? legacyDescription,
        name:
            raw.name ??
            slugifyStepName(legacyDescription) ??
            `field_${position}`,
        type:
            raw.type ??
            (raw as ILegacyAiRalphStep).valueTypeExpected ??
            "string",
        checks,
        isObrigatory:
            raw.isObrigatory ??
            (raw as ILegacyAiRalphStep).obrigatory ??
            true,
    };
}

export function normalizeRalphSteps(
    steps: (IAiRalphStepInput | ILegacyAiRalphStep)[],
    generateUuid: () => string = () => crypto.randomUUID(),
): IAiRalphStep[] {
    return (steps ?? []).map((step, index) =>
        normalizeRalphStepInput(step, step.position ?? index, generateUuid),
    );
}

function slugifyStepName(text: string): string {
    const slug = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 48);

    return slug || "field";
}
