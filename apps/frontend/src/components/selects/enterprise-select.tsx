"use client";

import * as React from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEnterprisesForSelect } from "@/hooks/use-enterprises-for-select";
import { useTrialStore } from "@/zustand/trial.store";
import { cn } from "@/lib/utils";

export type EnterpriseSelectProps = {
    value: string;
    onValueChange: (enterpriseId: string) => void;
    className?: string;
    /** When true, changing the value also updates trial store + localStorage (sidebar parity). */
    syncGlobalContext?: boolean;
};

export function EnterpriseSelect({
    value,
    onValueChange,
    className,
    syncGlobalContext = true,
}: EnterpriseSelectProps) {
    const { t } = useTranslation();
    const { enterprises, isLoading } = useEnterprisesForSelect();
    const setEnterpriseId = useTrialStore((s) => s.setEnterpriseId);

    const handleChange = (id: string) => {
        if (syncGlobalContext) {
            setEnterpriseId(id);
            localStorage.setItem("selected-enterprise-id", id);
        }
        onValueChange(id);
    };

    if (isLoading && enterprises.length === 0) {
        return (
            <div
                className={cn(
                    "rounded-md border px-3 py-2 text-sm text-muted-foreground",
                    className,
                )}
            >
                {t("common.loading")}
            </div>
        );
    }

    if (enterprises.length === 0) {
        return (
            <div
                className={cn(
                    "rounded-md border px-3 py-2 text-sm text-muted-foreground",
                    className,
                )}
            >
                {t("configurationEnterprise.select.noEnterprises")}
            </div>
        );
    }

    if (enterprises.length === 1) {
        return (
            <div
                className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium",
                    className,
                )}
            >
                {enterprises[0].name}
            </div>
        );
    }

    return (
        <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className={cn("w-full max-w-md", className)}>
                <SelectValue
                    placeholder={t(
                        "configurationEnterprise.select.placeholder",
                    )}
                />
            </SelectTrigger>
            <SelectContent>
                {enterprises.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                        {e.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
