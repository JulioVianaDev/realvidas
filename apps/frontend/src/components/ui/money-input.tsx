import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    centsToMoneyInput,
    moneyInputPlaceholder,
    parseMoneyInputToCents,
} from "@/lib/price";

type MoneyInputProps = Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "type"
> & {
    valueCents: number;
    onChangeCents: (cents: number) => void;
    locale?: "pt-BR" | "en-US";
};

export function MoneyInput({
    valueCents,
    onChangeCents,
    locale = "pt-BR",
    className,
    onBlur,
    onFocus,
    ...props
}: MoneyInputProps) {
    const [display, setDisplay] = useState(() =>
        centsToMoneyInput(valueCents, locale),
    );
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (!focused) {
            setDisplay(centsToMoneyInput(valueCents, locale));
        }
    }, [valueCents, locale, focused]);

    return (
        <Input
            {...props}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={moneyInputPlaceholder(locale)}
            className={cn("tabular-nums", className)}
            value={display}
            onChange={(e) => {
                const next = e.target.value;
                setDisplay(next);
                onChangeCents(parseMoneyInputToCents(next, locale));
            }}
            onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
            }}
            onBlur={(e) => {
                setFocused(false);
                const cents = parseMoneyInputToCents(display, locale);
                onChangeCents(cents);
                setDisplay(centsToMoneyInput(cents, locale));
                onBlur?.(e);
            }}
        />
    );
}
