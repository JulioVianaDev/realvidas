import { useMemo, useState } from "react";
import { Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
    {
        label: "Food & drink",
        emojis: [
            "🍕", "🍔", "🌮", "🍣", "🍜", "🥗", "🍰", "☕", "🍺", "🥤",
            "🍎", "🥑", "🍞", "🧀", "🍫", "🍦", "🥐", "🍱", "🥡", "🍩",
        ],
    },
    {
        label: "Shopping",
        emojis: [
            "🛍️", "🛒", "👗", "👕", "👟", "💄", "💍", "⌚", "👜", "🎁",
            "📦", "🏷️", "🧴", "🪞", "🧸", "🎀", "👓", "🧣", "🧤", "👒",
        ],
    },
    {
        label: "Services",
        emojis: [
            "💇", "💅", "🧘", "🏋️", "🩺", "🔧", "🧹", "🚗", "✂️", "📸",
            "🎵", "🎨", "📚", "💼", "🏠", "🌿", "⚡", "🔑", "🛠️", "📋",
        ],
    },
    {
        label: "Places",
        emojis: [
            "🏪", "🏨", "🏥", "🏫", "🏋️", "🍽️", "☕", "🎬", "🏖️", "🏕️",
            "🌆", "🏡", "⛽", "🚉", "✈️", "🎡", "🎪", "⛪", "🏛️", "🗺️",
        ],
    },
    {
        label: "Symbols",
        emojis: [
            "⭐", "🔥", "💎", "✨", "❤️", "💚", "💙", "💜", "🧡", "💛",
            "✅", "🆕", "🔝", "💯", "🎯", "📌", "🔔", "⚡", "🌟", "🏆",
        ],
    },
];

export function isLikelyEmojiIcon(value: string | null | undefined): boolean {
    if (!value?.trim()) return false;
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return false;
    return !trimmed.includes("/") && !trimmed.includes(".");
}

type EmojiPickerButtonProps = {
    value: string;
    onChange: (emoji: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    clearLabel?: string;
    noResultsLabel?: string;
    className?: string;
};

function EmojiPickerPanel({
    displayValue,
    search,
    setSearch,
    filteredGroups,
    onChange,
    onClear,
    searchPlaceholder,
    clearLabel,
    noResultsLabel,
}: {
    displayValue: string;
    search: string;
    setSearch: (value: string) => void;
    filteredGroups: typeof EMOJI_GROUPS;
    onChange: (emoji: string) => void;
    onClear: () => void;
    searchPlaceholder: string;
    clearLabel: string;
    noResultsLabel: string;
}) {
    return (
        <>
            <div className="flex items-center gap-2 border-b p-2">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-8"
                />
                {displayValue ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        aria-label={clearLabel}
                        onClick={onClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                ) : null}
            </div>
            <div className="max-h-64 overflow-y-auto overscroll-contain p-2">
                <div className="space-y-3">
                    {filteredGroups.length === 0 ? (
                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                            {noResultsLabel}
                        </p>
                    ) : (
                        filteredGroups.map((group) => (
                            <div key={group.label}>
                                <p className="mb-1.5 px-1 text-xs font-medium text-muted-foreground">
                                    {group.label}
                                </p>
                                <div className="grid grid-cols-8 gap-0.5">
                                    {group.emojis.map((emoji) => (
                                        <button
                                            key={`${group.label}-${emoji}`}
                                            type="button"
                                            className={cn(
                                                "flex h-9 w-9 items-center justify-center rounded-md text-xl hover:bg-accent",
                                                displayValue === emoji &&
                                                    "bg-accent ring-2 ring-ring ring-offset-1",
                                            )}
                                            onClick={() => onChange(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export function EmojiPickerButton({
    value,
    onChange,
    placeholder = "Select an emoji",
    searchPlaceholder = "Search emoji...",
    clearLabel = "Clear",
    noResultsLabel = "No emojis found",
    className,
}: EmojiPickerButtonProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredGroups = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return EMOJI_GROUPS;
        return EMOJI_GROUPS.map((group) => ({
            ...group,
            emojis: group.emojis.filter(
                (emoji) =>
                    emoji.includes(q) ||
                    group.label.toLowerCase().includes(q),
            ),
        })).filter((group) => group.emojis.length > 0);
    }, [search]);

    const displayValue =
        value && isLikelyEmojiIcon(value) ? value : "";

    const handleSelect = (emoji: string) => {
        onChange(emoji);
        setOpen(false);
        setSearch("");
    };

    const handleClear = () => {
        onChange("");
        setSearch("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "h-10 w-10 shrink-0 p-0 text-xl font-normal",
                        className,
                    )}
                    aria-label={placeholder}
                >
                    {displayValue || (
                        <Smile className="h-5 w-5 text-muted-foreground" />
                    )}
                </Button>
            </PopoverTrigger>
            {open ? (
                <PopoverContent
                    className="w-80 p-0"
                    align="start"
                    side="bottom"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <EmojiPickerPanel
                        displayValue={displayValue}
                        search={search}
                        setSearch={setSearch}
                        filteredGroups={filteredGroups}
                        onChange={handleSelect}
                        onClear={handleClear}
                        searchPlaceholder={searchPlaceholder}
                        clearLabel={clearLabel}
                        noResultsLabel={noResultsLabel}
                    />
                </PopoverContent>
            ) : null}
        </Popover>
    );
}
