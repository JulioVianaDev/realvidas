import type { Language } from "@/contexts/TranslationsContext";
import { prettyJson } from "@/lib/json-schema-map";

const PT_SAMPLE = {
    numero: 14,
    booleano: true,
    texto: "aoba",
    objeto: {
        valor1: "teste",
        valor2: 777,
    },
} as const;

const EN_SAMPLE = {
    number: 14,
    boolean: true,
    text: "hello",
    object: {
        value1: "test",
        value2: 777,
    },
} as const;

export function getJsonEditorSample(language: Language): string {
    const sample = language === "pt-BR" ? PT_SAMPLE : EN_SAMPLE;
    return prettyJson(sample);
}
