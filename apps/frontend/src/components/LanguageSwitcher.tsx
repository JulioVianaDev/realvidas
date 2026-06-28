import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationsContext";
import { Globe } from "lucide-react";
import { useUserStore } from "@/zustand/user.store";
import { usePatchMyUiPreferencesMutation } from "@/hooks/query/user/user.query";

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();
    const userAuth = useUserStore((s) => s.userAuth);
    const patchUiPreferences = usePatchMyUiPreferencesMutation();

    const toggleLanguage = () => {
        const next = language === "en-US" ? "pt-BR" : "en-US";
        setLanguage(next);
        if (userAuth?.token) {
            patchUiPreferences.mutate({ language: next });
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="px-2"
        >
            <Globe />
            {language !== "en-US" ? "PT" : "EN"}
        </Button>
    );
}
