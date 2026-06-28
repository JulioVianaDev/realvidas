import {
    IAiToolBodyField,
    IAiToolFieldType,
    IAiToolFieldValueSource,
} from "../entities/ai-tool.entity-type";

type RawToolBodyField = Partial<IAiToolBodyField> & {
    id: string;
    name: string;
    type: IAiToolFieldType;
    required: boolean;
};

export function inferFieldValueSource(
    field: Partial<IAiToolBodyField>,
): IAiToolFieldValueSource {
    if (field.valueSource) return field.valueSource;
    if (field.sourceToolHandlerKey && field.sourceToolResponseKey) {
        return "TOOL_RESPONSE";
    }
    if (field.sourceToolHandlerKey && field.sourceToolFieldName) {
        return "TOOL_INPUT";
    }
    if (field.ralphRefId || field.ralphStepUuid) {
        return "CHECKLIST";
    }
    return "MANUAL";
}

export function normalizeToolBodyField(raw: RawToolBodyField): IAiToolBodyField {
    const valueSource = inferFieldValueSource(raw);
    return {
        id: raw.id,
        name: raw.name,
        type: raw.type,
        required: raw.required,
        valueSource,
        ralphRefId: raw.ralphRefId ?? null,
        ralphStepUuid: raw.ralphStepUuid ?? null,
        sourceToolHandlerKey: raw.sourceToolHandlerKey ?? null,
        sourceToolFieldName: raw.sourceToolFieldName ?? null,
        sourceToolResponseKey: raw.sourceToolResponseKey ?? null,
        checks: raw.checks ?? [],
    };
}

export function normalizeToolBodyFields(
    fields: RawToolBodyField[] | IAiToolBodyField[] | null | undefined,
): IAiToolBodyField[] {
    return (fields ?? []).map((field) => normalizeToolBodyField(field));
}
