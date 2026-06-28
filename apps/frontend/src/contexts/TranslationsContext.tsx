import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import { Locale } from "date-fns";
import { ptBR as ptBRLocale } from "date-fns/locale/pt-BR";
import { enUS as enUSLocale } from "date-fns/locale/en-US";
import ptBR from "../translations/pt-BR.json";
import en from "../translations/en.json";

export type Language = "pt-BR" | "en-US";
type Translation = typeof ptBR;

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, variables?: Record<string, any>) => string;
    dateLocale: Locale;
}

const TranslationContext = createContext<
    TranslationContextType | undefined
>(undefined);

const translations: Record<Language, Translation> = {
    "pt-BR": ptBR,
    "en-US": en,
};

const dateLocales: Record<Language, Locale> = {
    "pt-BR": ptBRLocale,
    "en-US": enUSLocale,
};

export const createTranslation = (language: Language) => {
    const t = (
        key: string,
        variables?: Record<string, any>,
    ): string => {
        if (!key) {
            return "";
        }

        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === "object") {
                value = value[k];
            } else {
                return key; // Return the key if translation not found
            }
        }

        if (!value) return key;

        // Replace variables if they exist
        if (variables) {
            return value.replace(
                /\{(\w+)\}/g,
                (match: string, variableName: string) => {
                    return variables[variableName] !== undefined
                        ? variables[variableName]
                        : match;
                },
            );
        }

        return value;
    };

    return t;
};

export const TranslationProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("pt-BR");

    useEffect(() => {
        // Get language from localStorage or browser's language
        const savedLanguage = localStorage.getItem(
            "language",
        ) as Language;
        const browserLanguage = navigator.language
            .split("-")[0]
            .toUpperCase();

        if (savedLanguage) {
            setLanguage(savedLanguage);
        } else if (browserLanguage === "PT") {
            setLanguage("pt-BR");
        } else if (browserLanguage === "EN") {
            setLanguage("en-US");
        } else {
            setLanguage("pt-BR");
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <TranslationContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                t: createTranslation(language),
                dateLocale: dateLocales[language],
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error(
            "useTranslation must be used within a TranslationProvider",
        );
    }
    return context;
};
