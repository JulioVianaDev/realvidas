import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Timezone mapping: UTC offset (value stored in DB) -> Display label
// Stores UTC offset values like "UTC-3", "UTC+5", etc.
export const TIMEZONE_COMBOBOX_OPTIONS = [
    { value: "UTC-3", label: "UTC-3 - America/Sao_Paulo (BRT - Brasil)" },
    { value: "UTC-3", label: "UTC-3 - America/Argentina/Buenos_Aires (ART - Argentina)" },
    { value: "UTC-5", label: "UTC-5 - America/New_York (EST/EDT - USA)" },
    { value: "UTC-6", label: "UTC-6 - America/Chicago (CST/CDT - USA)" },
    { value: "UTC-7", label: "UTC-7 - America/Denver (MST/MDT - USA)" },
    { value: "UTC-8", label: "UTC-8 - America/Los_Angeles (PST/PDT - USA)" },
    { value: "UTC-6", label: "UTC-6 - America/Mexico_City (CST/CDT - México)" },
    { value: "UTC-5", label: "UTC-5 - America/Toronto (EST/EDT - Canadá)" },
    { value: "UTC+0", label: "UTC+0 - Europe/London (GMT/BST - UK)" },
    { value: "UTC+1", label: "UTC+1 - Europe/Paris (CET/CEST - França)" },
    { value: "UTC+1", label: "UTC+1 - Europe/Berlin (CET/CEST - Alemanha)" },
    { value: "UTC+9", label: "UTC+9 - Asia/Tokyo (JST - Japão)" },
    { value: "UTC+8", label: "UTC+8 - Asia/Shanghai (CST - China)" },
    { value: "UTC+4", label: "UTC+4 - Asia/Dubai (GST - UAE)" },
    { value: "UTC+10", label: "UTC+10 - Australia/Sydney (AEST/AEDT - Austrália)" },
] as const;

function formatOffsetHoursAsUtcLabel(offsetHours: number): string {
    const rounded = Math.round(offsetHours);
    if (rounded === 0) return "UTC+0";
    if (rounded > 0) return `UTC+${rounded}`;
    return `UTC${rounded}`;
}

function parseUtcLabelToHours(label: string): number {
    const m = label.match(/^UTC([+-])(\d+)$/);
    if (!m) return NaN;
    const n = Number(m[2]);
    return m[1] === "-" ? -n : n;
}

function distinctComboboxValues(): string[] {
    return [...new Set(TIMEZONE_COMBOBOX_OPTIONS.map((t) => t.value))];
}

/** Offset in hours from UTC for an IANA zone at the current instant (handles DST). */
function getOffsetHoursForIana(timeZone: string): number | null {
    try {
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone,
            timeZoneName: "longOffset",
        }).formatToParts(new Date());
        const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
        const m = tz.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
        if (!m) return null;
        const sign = m[1] === "+" ? 1 : -1;
        const hh = parseInt(m[2], 10);
        const mm = m[3] != null ? parseInt(m[3], 10) : 0;
        return sign * (hh + mm / 60);
    } catch {
        return null;
    }
}

function closestUtcLabelToOffsetHours(offsetHours: number): string {
    const candidate = formatOffsetHoursAsUtcLabel(offsetHours);
    const distinctValues = distinctComboboxValues();
    if (distinctValues.includes(candidate)) return candidate;

    let best: string = "UTC-3";
    let bestDiff = Infinity;
    for (const v of distinctValues) {
        const h = parseUtcLabelToHours(v);
        if (Number.isNaN(h)) continue;
        const diff = Math.abs(h - offsetHours);
        if (diff < bestDiff) {
            bestDiff = diff;
            best = v;
        }
    }
    return best;
}

/** Map DB / browser strings (IANA or UTC±) to a combobox `value` so the trigger shows a label. */
function normalizeToComboboxValue(stored: string): string {
    const s = stored.trim();
    if (TIMEZONE_COMBOBOX_OPTIONS.some((tz) => tz.value === s)) {
        return s;
    }
    const byIana = TIMEZONE_COMBOBOX_OPTIONS.find((tz) =>
        tz.label.includes(s),
    );
    if (byIana) return byIana.value;
    const offset = getOffsetHoursForIana(s);
    if (offset != null) {
        return closestUtcLabelToOffsetHours(offset);
    }
    const offsetHours = -new Date().getTimezoneOffset() / 60;
    return closestUtcLabelToOffsetHours(offsetHours);
}

export function normalizeStoredTimezoneToComboboxValue(
    stored: string | null | undefined,
): string {
    if (stored == null || String(stored).trim() === "") {
        const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return normalizeToComboboxValue(iana);
    }
    return normalizeToComboboxValue(String(stored).trim());
}

/**
 * Default for forms: browser IANA → list value, else offset → closest list value.
 */
export function getDefaultTimezoneComboboxValue(): string {
    const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return normalizeToComboboxValue(iana);
}

interface TimezoneComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TimezoneCombobox({
    value,
    onValueChange,
    placeholder = "Select timezone...",
    className,
}: TimezoneComboboxProps) {
    const [open, setOpen] = useState(false);

    const canonicalValue =
        value?.trim() !== ""
            ? normalizeStoredTimezoneToComboboxValue(value)
            : "";

    useEffect(() => {
        if (!value?.trim()) return;
        const next = normalizeStoredTimezoneToComboboxValue(value);
        if (next !== value) {
            onValueChange(next);
        }
    }, [value, onValueChange]);

    const selectedTimezone = TIMEZONE_COMBOBOX_OPTIONS.find(
        (tz) => tz.value === canonicalValue,
    );

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedTimezone ? selectedTimezone.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandList className="max-h-[200px]">
                        <CommandEmpty>No timezone found.</CommandEmpty>
                        <CommandGroup>
                            {TIMEZONE_COMBOBOX_OPTIONS.map((timezone, index) => (
                                <CommandItem
                                    key={`${timezone.value}-${index}`}
                                    value={timezone.label}
                                    onSelect={() => {
                                        onValueChange(
                                            canonicalValue === timezone.value
                                                ? ""
                                                : timezone.value,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            canonicalValue === timezone.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {timezone.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

