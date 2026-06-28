import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useTranslation } from "@/contexts/TranslationsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/ui/field-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { JsonExampleEditor } from "@/components/json-example-editor";
import {
    defaultExampleValueForType,
    detectSchemaFormat,
    exampleObjectFromRows,
    getNestedValue,
    inferSchemaMapFromSample,
    mergeBuilderRowsFromExample,
    parseJsonValue,
    parseSchemaMap,
    prettyJson,
    rowsFromSchemaMap,
    SCHEMA_FIELD_TYPES,
    setNestedValue,
} from "@/lib/json-schema-map";
import type { IAiToolResponseSchemaFormat } from "@global-types/entities/ai-tool.entity-type";

type JsonSchemaEditorProps = {
    value: string;
    onChange: (json: string) => void;
    format: IAiToolResponseSchemaFormat;
    onFormatChange: (format: IAiToolResponseSchemaFormat) => void;
    readOnly?: boolean;
    id?: string;
    hint?: string;
};

type BuilderRow = {
    id: string;
    key: string;
    type: string;
    exampleValue: string;
};

const newRow = (): BuilderRow => ({
    id: crypto.randomUUID(),
    key: "",
    type: "string",
    exampleValue: "",
});

export function JsonSchemaEditor({
    value,
    onChange,
    format,
    onFormatChange,
    readOnly = false,
    id,
    hint,
}: JsonSchemaEditorProps) {
    const { t } = useTranslation();
    const [rows, setRows] = useState<BuilderRow[]>([]);
    const [exampleJson, setExampleJson] = useState("{}");
    const skipExternalSync = useRef(false);
    const jsonEditingRef = useRef(false);

    const syncBuilderFromJson = useCallback(
        (json: string, prevRows: BuilderRow[]) => {
            const parsed = parseJsonValue(json);
            if (!parsed.ok || !parsed.value || typeof parsed.value !== "object") {
                return prevRows;
            }
            if (Array.isArray(parsed.value)) {
                return prevRows;
            }

            const inferred = inferSchemaMapFromSample(json);
            if (!inferred.ok) {
                return prevRows;
            }

            return mergeBuilderRowsFromExample(
                prevRows,
                rowsFromSchemaMap(inferred.map),
                parsed.value as Record<string, unknown>,
                { keepEmptyDrafts: false },
            );
        },
        [],
    );

    const hydrateFromSchemaJson = (
        json: string,
        prevRows: BuilderRow[],
    ): { rows: BuilderRow[]; example: string } => {
        const parsed = parseSchemaMap(json || "{}");
        if (!parsed.ok) {
            return { rows: prevRows, example: "{}" };
        }

        const schemaRows = rowsFromSchemaMap(parsed.map);
        const exampleObj = exampleObjectFromRows(prevRows);
        for (const { key, type } of schemaRows) {
            if (getNestedValue(exampleObj, key) === undefined) {
                setNestedValue(
                    exampleObj,
                    key,
                    defaultExampleValueForType(type),
                );
            }
        }

        return {
            rows: mergeBuilderRowsFromExample(
                prevRows,
                schemaRows,
                exampleObj,
                { keepEmptyDrafts: false },
            ),
            example: prettyJson(exampleObj),
        };
    };

    useEffect(() => {
        if (skipExternalSync.current) {
            skipExternalSync.current = false;
            return;
        }
        if (jsonEditingRef.current) {
            return;
        }

        const json = value || "{}";
        const resolvedFormat = format || detectSchemaFormat(json);

        if (resolvedFormat === "example") {
            setExampleJson(json.trim() || "{}");
            setRows((prev) => syncBuilderFromJson(json, prev));
            return;
        }

        setRows((prev) => {
            const hydrated = hydrateFromSchemaJson(json, prev);
            setExampleJson(hydrated.example);
            return hydrated.rows;
        });
    }, [value, format, syncBuilderFromJson]);

    const publishExample = (
        nextRows: BuilderRow[],
        nextExample: string,
        nextFormat: IAiToolResponseSchemaFormat,
    ) => {
        skipExternalSync.current = true;
        setRows(nextRows);
        setExampleJson(nextExample);
        onFormatChange(nextFormat);
        onChange(nextExample);
    };

    const commitRows = (nextRows: BuilderRow[]) => {
        const exampleObj = exampleObjectFromRows(nextRows);
        const example = prettyJson(exampleObj);
        publishExample(nextRows, example, "example");
    };

    const updateRow = (index: number, patch: Partial<BuilderRow>) => {
        const next = [...rows];
        next[index] = { ...next[index], ...patch };

        if (patch.type && patch.exampleValue === undefined) {
            const current = next[index].exampleValue.trim();
            if (!current) {
                next[index].exampleValue = defaultExampleValueForType(
                    patch.type,
                );
            }
        }

        commitRows(next);
    };

    const debouncedPersistJson = useDebouncedCallback((json: string) => {
        setRows((prev) => syncBuilderFromJson(json, prev));
        skipExternalSync.current = true;
        onFormatChange("example");
        onChange(json);
    }, 400);

    const handleExampleChange = (json: string) => {
        jsonEditingRef.current = true;
        setExampleJson(json);
        debouncedPersistJson(json);
    };

    const handleExampleBlur = (json: string) => {
        jsonEditingRef.current = false;
        debouncedPersistJson.cancel();

        const parsed = parseJsonValue(json);
        const normalized = parsed.ok ? prettyJson(parsed.value) : json;
        setExampleJson(normalized);
        setRows((prev) => syncBuilderFromJson(normalized, prev));
        skipExternalSync.current = true;
        onFormatChange("example");
        onChange(normalized);
    };

    return (
        <div className="space-y-3">
            {hint && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}

            <p className="text-xs text-muted-foreground">
                {t("aiToolsPage.jsonEditor.splitHint")}
            </p>

            <div className="grid min-h-[320px] gap-4 lg:grid-cols-2 lg:items-stretch">
                <div className="flex min-h-[320px] flex-col rounded-lg border bg-muted/20 p-3">
                    <FieldGroup className="mb-2 space-y-1">
                        <Label className="text-xs font-medium">
                            {t("aiToolsPage.jsonEditor.builder")}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            {t("aiToolsPage.jsonEditor.builderHint")}
                        </p>
                    </FieldGroup>

                    {rows.length > 0 && (
                        <div className="mb-2 hidden gap-2 px-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[1fr_100px_1fr_auto]">
                            <span>{t("aiToolsPage.jsonEditor.fieldKey")}</span>
                            <span>{t("aiToolsPage.fieldType")}</span>
                            <span className="col-span-1">
                                {t("aiToolsPage.jsonEditor.exampleValue")}
                            </span>
                            <span />
                        </div>
                    )}

                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                        {rows.length === 0 && (
                            <p className="py-6 text-center text-xs text-muted-foreground">
                                {t("aiToolsPage.jsonEditor.noFieldsYet")}
                            </p>
                        )}
                        {rows.map((row, index) => (
                            <div
                                key={row.id}
                                className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_100px_1fr_auto]"
                            >
                                <Input
                                    value={row.key}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    placeholder="fieldName"
                                    className="font-mono text-xs"
                                    onChange={(e) =>
                                        updateRow(index, {
                                            key: e.target.value,
                                        })
                                    }
                                />
                                <Select
                                    value={row.type}
                                    disabled={readOnly}
                                    onValueChange={(type) =>
                                        updateRow(index, { type })
                                    }
                                >
                                    <SelectTrigger className="font-mono text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SCHEMA_FIELD_TYPES.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    value={row.exampleValue}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    placeholder={defaultExampleValueForType(
                                        row.type,
                                    )}
                                    className="font-mono text-xs"
                                    onChange={(e) =>
                                        updateRow(index, {
                                            exampleValue: e.target.value,
                                        })
                                    }
                                />
                                {!readOnly && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-9 shrink-0 text-destructive"
                                        onClick={() => {
                                            const next = rows.filter(
                                                (_, i) => i !== index,
                                            );
                                            commitRows(next);
                                        }}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {!readOnly && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3 border-dashed"
                            onClick={() =>
                                setRows((prev) => [...prev, newRow()])
                            }
                        >
                            <Plus className="size-3.5" />
                            {t("aiToolsPage.jsonEditor.addField")}
                        </Button>
                    )}
                </div>

                <div className="flex min-h-[320px] flex-col rounded-lg border bg-muted/20 p-3">
                    <JsonExampleEditor
                        id={id}
                        embedded
                        showHeader
                        label={t("aiToolsPage.jsonEditor.example")}
                        hint={t("aiToolsPage.jsonEditor.exampleHint")}
                        value={exampleJson}
                        onChange={handleExampleChange}
                        onBlur={handleExampleBlur}
                        readOnly={readOnly}
                        height={320}
                    />
                </div>
            </div>
        </div>
    );
}
