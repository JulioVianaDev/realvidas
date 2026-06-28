import { useEffect, useRef, useState } from "react";
import { FileJson, Sparkles } from "lucide-react";
import Editor, { type OnMount } from "@monaco-editor/react";

type MonacoEditor = Parameters<OnMount>[0];
import { useTranslation } from "@/contexts/TranslationsContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/ui/field-group";
import { getJsonEditorSample } from "@/lib/json-editor-sample";
import { parseJsonValue, prettyJson } from "@/lib/json-schema-map";
import { cn } from "@/lib/utils";

type JsonExampleEditorProps = {
    value: string;
    onChange: (json: string) => void;
    onBlur?: (json: string) => void;
    readOnly?: boolean;
    id?: string;
    hint?: string;
    height?: number | string;
    embedded?: boolean;
    showHeader?: boolean;
    label?: string;
    showLoadExample?: boolean;
    error?: string | null;
    onErrorChange?: (error: string | null) => void;
};

export function JsonExampleEditor({
    value,
    onChange,
    onBlur,
    readOnly = false,
    id,
    hint,
    height = 240,
    embedded = false,
    showHeader = true,
    label,
    showLoadExample = true,
    error: externalError,
    onErrorChange,
}: JsonExampleEditorProps) {
    const { t, language } = useTranslation();
    const [draft, setDraft] = useState(value || "{}");
    const [internalError, setInternalError] = useState<string | null>(null);
    const isFocusedRef = useRef(false);
    const editorRef = useRef<MonacoEditor | null>(null);
    const error = externalError ?? internalError;

    useEffect(() => {
        if (isFocusedRef.current) return;
        setDraft(value || "{}");
    }, [value]);

    const setError = (next: string | null) => {
        setInternalError(next);
        onErrorChange?.(next);
    };

    const handleMount: OnMount = (editorInstance) => {
        editorRef.current = editorInstance;
        editorInstance.onDidFocusEditorText(() => {
            isFocusedRef.current = true;
        });
        editorInstance.onDidBlurEditorText(() => {
            isFocusedRef.current = false;
            const text = editorInstance.getValue();
            setDraft(text);
            onBlur?.(text);
        });
    };

    const formatDocument = () => {
        const parsed = parseJsonValue(draft);
        if (!parsed.ok) {
            setError(parsed.error);
            return;
        }
        const formatted = prettyJson(parsed.value);
        setDraft(formatted);
        setError(null);
        onChange(formatted);
        onBlur?.(formatted);
    };

    const loadExample = () => {
        const formatted = getJsonEditorSample(language);
        setDraft(formatted);
        setError(null);
        onChange(formatted);
        onBlur?.(formatted);
    };

    return (
        <div
            className={cn(
                "flex h-full min-h-0 flex-col",
                !embedded && "space-y-2 rounded-lg border bg-muted/20 p-3",
            )}
        >
            {showHeader && (
                <FieldGroup className="space-y-1">
                    {label && (
                        <Label className="text-xs font-medium">{label}</Label>
                    )}
                    {hint && (
                        <p className="text-xs text-muted-foreground">
                            {hint}
                        </p>
                    )}
                </FieldGroup>
            )}

            <div
                id={id}
                className="min-h-0 flex-1 overflow-hidden rounded-md border bg-[#1e1e1e]"
            >
                <Editor
                    height={height}
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={draft}
                    onMount={handleMount}
                    onChange={(next) => {
                        const text = next ?? "";
                        setDraft(text);
                        const parsed = parseJsonValue(text);
                        setError(parsed.ok ? null : parsed.error);
                        onChange(text);
                    }}
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        formatOnPaste: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: {
                            strings: true,
                        },
                    }}
                />
            </div>

            {!readOnly && (
                <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {showLoadExample && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={loadExample}
                            >
                                <FileJson className="size-3.5" />
                                {t("aiToolsPage.jsonEditor.loadExample")}
                            </Button>
                        )}
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={formatDocument}
                        >
                            <Sparkles className="size-3.5" />
                            {t("aiToolsPage.jsonEditor.formatJson")}
                        </Button>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {t("aiToolsPage.jsonEditor.sampleHelp")}
                    </p>
                </div>
            )}

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}
