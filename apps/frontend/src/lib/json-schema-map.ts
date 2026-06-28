import { IAiToolFieldType } from "@global-types/entities/ai-tool.entity-type";

export const SCHEMA_FIELD_TYPES: IAiToolFieldType[] = [
    "string",
    "number",
    "boolean",
    "uuid",
    "date",
    "cpf",
    "phone",
    "email",
];

export interface SchemaMap {
    [key: string]: string | SchemaMap;
}

export type FlatSchemaKey = {
    key: string;
    type: string;
};

export function isSchemaMap(value: unknown): value is SchemaMap {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseJsonValue(
    json: string,
): { ok: true; value: unknown } | { ok: false; error: string } {
    const trimmed = json.trim();
    if (!trimmed || trimmed === "null") {
        return { ok: true, value: null };
    }
    try {
        return { ok: true, value: JSON.parse(trimmed) };
    } catch {
        return { ok: false, error: "Invalid JSON" };
    }
}

export function prettyJson(value: unknown): string {
    if (value === null) return "null";
    return JSON.stringify(value, null, 2);
}

export function parseSchemaMap(
    json: string,
): { ok: true; map: SchemaMap } | { ok: false; error: string } {
    const parsed = parseJsonValue(json);
    if (!parsed.ok) return parsed;
    if (!isSchemaMap(parsed.value)) {
        return { ok: false, error: "JSON must be an object" };
    }
    return { ok: true, map: parsed.value };
}

export function stringifySchemaMap(map: SchemaMap, pretty = true): string {
    if (Object.keys(map).length === 0) {
        return "{}";
    }
    return JSON.stringify(map, null, pretty ? 2 : 0);
}

function allSchemaLeavesAreTypes(map: SchemaMap): boolean {
    for (const value of Object.values(map)) {
        if (isSchemaMap(value)) {
            if (!allSchemaLeavesAreTypes(value)) return false;
            continue;
        }
        if (
            typeof value !== "string" ||
            !SCHEMA_FIELD_TYPES.includes(value as IAiToolFieldType)
        ) {
            return false;
        }
    }
    return true;
}

export function detectSchemaFormat(json: string): "builder" | "example" {
    const parsed = parseJsonValue(json);
    if (!parsed.ok || parsed.value === null) return "example";
    if (!isSchemaMap(parsed.value)) return "example";
    const map = parsed.value;
    if (Object.keys(map).length === 0) return "builder";
    return allSchemaLeavesAreTypes(map) ? "builder" : "example";
}

export function flattenSchemaMapKeys(
    map: SchemaMap,
    prefix = "",
): FlatSchemaKey[] {
    const keys: FlatSchemaKey[] = [];

    for (const [key, value] of Object.entries(map)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (isSchemaMap(value)) {
            keys.push(...flattenSchemaMapKeys(value, path));
            continue;
        }
        if (typeof value === "string") {
            keys.push({ key: path, type: value });
        }
    }

    return keys;
}

export function flattenJsonKeys(value: unknown, prefix = ""): string[] {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return prefix ? [prefix] : [];
    }

    const keys: string[] = [];
    for (const [key, nested] of Object.entries(value)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (
            nested &&
            typeof nested === "object" &&
            !Array.isArray(nested)
        ) {
            keys.push(...flattenJsonKeys(nested, path));
        } else {
            keys.push(path);
        }
    }
    return keys;
}

export function getSchemaKeyType(map: SchemaMap, key: string): string | null {
    const parts = key.split(".");
    let current: string | SchemaMap | undefined = map;

    for (const part of parts) {
        if (!current || typeof current !== "object") {
            return null;
        }
        current = current[part];
    }

    return typeof current === "string" ? current : null;
}

export function schemaMapFromRows(
    rows: { key: string; type: string }[],
): SchemaMap {
    const map: SchemaMap = {};

    for (const row of rows) {
        const trimmedKey = row.key.trim();
        if (!trimmedKey) continue;

        const parts = trimmedKey.split(".");
        let cursor: SchemaMap = map;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLeaf = i === parts.length - 1;

            if (isLeaf) {
                cursor[part] = row.type;
                continue;
            }

            const existing = cursor[part];
            if (!existing || typeof existing !== "object") {
                cursor[part] = {};
            }
            cursor = cursor[part] as SchemaMap;
        }
    }

    return map;
}

export function rowsFromSchemaMap(map: SchemaMap): { key: string; type: string }[] {
    return flattenSchemaMapKeys(map).map(({ key, type }) => ({ key, type }));
}

function inferLeafType(value: unknown): string {
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (typeof value !== "string") return "string";

    if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            value,
        )
    ) {
        return "uuid";
    }
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        return "email";
    }
    return "string";
}

function exampleValueForType(type: string): unknown {
    switch (type) {
        case "number":
            return 0;
        case "boolean":
            return false;
        case "uuid":
            return "00000000-0000-4000-8000-000000000000";
        case "date":
            return "2026-01-01T00:00:00.000Z";
        case "cpf":
            return "000.000.000-00";
        case "phone":
            return "+55 11 99999-9999";
        case "email":
            return "user@example.com";
        default:
            return "";
    }
}

export function exampleValueToString(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

export function defaultExampleValueForType(type: string): string {
    return exampleValueToString(exampleValueForType(type));
}

export function coerceExampleValue(raw: string, type: string): unknown {
    const trimmed = raw.trim();
    switch (type) {
        case "number": {
            const n = Number(trimmed);
            return Number.isNaN(n) ? 0 : n;
        }
        case "boolean":
            return trimmed === "true" || trimmed === "1";
        default:
            return raw;
    }
}

export function getNestedValue(
    obj: Record<string, unknown>,
    path: string,
): unknown {
    const parts = path.split(".");
    let current: unknown = obj;
    for (const part of parts) {
        if (
            !current ||
            typeof current !== "object" ||
            Array.isArray(current)
        ) {
            return undefined;
        }
        current = (current as Record<string, unknown>)[part];
    }
    return current;
}

export function setNestedValue(
    obj: Record<string, unknown>,
    path: string,
    value: unknown,
): void {
    const parts = path.split(".");
    let cursor: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const existing = cursor[part];
        if (
            !existing ||
            typeof existing !== "object" ||
            Array.isArray(existing)
        ) {
            cursor[part] = {};
        }
        cursor = cursor[part] as Record<string, unknown>;
    }
    cursor[parts[parts.length - 1]] = value;
}

export type BuilderRowData = {
    key: string;
    type: string;
    exampleValue: string;
};

export function exampleObjectFromRows(
    rows: BuilderRowData[],
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const row of rows) {
        const trimmedKey = row.key.trim();
        if (!trimmedKey) continue;
        setNestedValue(
            result,
            trimmedKey,
            coerceExampleValue(row.exampleValue, row.type),
        );
    }
    return result;
}

export function mergeBuilderRowsFromExample(
    prevRows: Array<BuilderRowData & { id: string }>,
    schemaRows: { key: string; type: string }[],
    exampleObj: Record<string, unknown>,
    options?: { keepEmptyDrafts?: boolean },
): Array<BuilderRowData & { id: string }> {
    const keepEmptyDrafts = options?.keepEmptyDrafts ?? false;
    const prevByKey = new Map(
        prevRows
            .filter((row) => row.key.trim().length > 0)
            .map((row) => [row.key, row]),
    );
    const usedIds = new Set<string>();

    const merged = schemaRows.map(({ key, type }) => {
        const existing = prevByKey.get(key);
        const id = existing?.id ?? crypto.randomUUID();
        usedIds.add(id);
        const fromJson = getNestedValue(exampleObj, key);
        const exampleValue =
            fromJson !== undefined
                ? exampleValueToString(fromJson)
                : (existing?.exampleValue ??
                  defaultExampleValueForType(type));

        return {
            id,
            key,
            type,
            exampleValue,
        };
    });

    if (!keepEmptyDrafts) {
        return merged;
    }

    const emptyDraftRows = prevRows.filter(
        (row) => row.key.trim().length === 0 && !usedIds.has(row.id),
    );

    return [...merged, ...emptyDraftRows];
}

export function schemaMapToExample(map: SchemaMap): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(map)) {
        if (isSchemaMap(value)) {
            result[key] = schemaMapToExample(value);
            continue;
        }
        result[key] = exampleValueForType(
            typeof value === "string" ? value : "string",
        );
    }
    return result;
}

export function inferSchemaMapFromSample(
    json: string,
): { ok: true; map: SchemaMap } | { ok: false; error: string } {
    const parsed = parseJsonValue(json);
    if (!parsed.ok) return parsed;
    if (!isSchemaMap(parsed.value)) {
        return { ok: false, error: "Sample must be a JSON object" };
    }

    const map: SchemaMap = {};
    for (const [key, value] of Object.entries(parsed.value)) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const nested = inferSchemaMapFromSample(JSON.stringify(value));
            if (nested.ok) {
                map[key] = nested.map;
            }
            continue;
        }
        map[key] = inferLeafType(value);
    }

    return { ok: true, map };
}

export function resolveSchemaFlatKeys(schema: string): FlatSchemaKey[] {
    const format = detectSchemaFormat(schema);
    if (format === "builder") {
        const parsed = parseSchemaMap(schema);
        if (!parsed.ok) return [];
        return flattenSchemaMapKeys(parsed.map);
    }

    const inferred = inferSchemaMapFromSample(schema);
    if (inferred.ok) {
        return flattenSchemaMapKeys(inferred.map);
    }

    const parsed = parseJsonValue(schema);
    if (!parsed.ok || !isSchemaMap(parsed.value)) return [];
    return flattenJsonKeys(parsed.value).map((key) => ({
        key,
        type: "string",
    }));
}

export function parseResponseSchemaKeys(schema: string): string[] {
    return resolveSchemaFlatKeys(schema).map((entry) => entry.key);
}

export function responseSchemaKeyType(
    schema: string,
    key: string,
): IAiToolFieldType | null {
    const flat = resolveSchemaFlatKeys(schema);
    const match = flat.find((entry) => entry.key === key);
    if (
        match &&
        SCHEMA_FIELD_TYPES.includes(match.type as IAiToolFieldType)
    ) {
        return match.type as IAiToolFieldType;
    }
    return null;
}

export function bodyFieldsToSchemaMap(
    bodyFields: { name: string; type: string }[],
): SchemaMap {
    return schemaMapFromRows(
        bodyFields.map((field) => ({
            key: field.name,
            type: field.type,
        })),
    );
}

export function convertSchemaFormat(
    json: string,
    target: "builder" | "example",
): string {
    if (target === "example") {
        const parsed = parseSchemaMap(json);
        if (parsed.ok) {
            return prettyJson(schemaMapToExample(parsed.map));
        }
        const value = parseJsonValue(json);
        if (value.ok && isSchemaMap(value.value)) {
            return prettyJson(value.value);
        }
        return json.trim() || "{}";
    }

    const inferred = inferSchemaMapFromSample(json);
    if (inferred.ok) {
        return stringifySchemaMap(inferred.map);
    }
    return json.trim() || "{}";
}
