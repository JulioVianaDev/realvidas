import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const multiSelectVariants = cva("m-1", {
    variants: {
        variant: {
            default: "border-foreground/10 text-foreground bg-card",
            secondary:
                "border-foreground/10 bg-secondary text-secondary-foreground",
            destructive:
                "border-transparent bg-destructive text-destructive-foreground ",
            inverted: "inverted",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface MultiSelectProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof multiSelectVariants> {
    options: {
        label: string;
        key?: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    onValueChange: (value: string[]) => void;
    defaultValue: string[];
    placeholder?: string;
    maxCount?: number;
    modalPopover?: boolean;
    asChild?: boolean;
    hasError?: boolean;
    hideSelectAll?: boolean;
    shouldFilter?: boolean;
    widthMenu?: number;
    className?: string;
    inputValue?: string;
    setInputValue?: (data: string) => void;
    onClose?: () => void;
}

export const MultiSelect = React.forwardRef<
    HTMLButtonElement,
    MultiSelectProps
>(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Selecionar opções",
            maxCount = 3,
            modalPopover = false,
            asChild = false,
            hasError = false,
            widthMenu = 12.5,
            inputValue = "",
            setInputValue,
            className,
            hideSelectAll = false,
            shouldFilter = true,
            onClose,
            ...props
        },
        ref,
    ) => {
        const [selectedValues, setSelectedValues] =
            React.useState<string[]>(defaultValue);
        const [selectedOptionsMap, setSelectedOptionsMap] =
            React.useState<Map<string, any>>(new Map());
        const inputCommandRef = React.useRef(null);
        const [isPopoverOpen, setIsPopoverOpen] =
            React.useState(false);
        const [localInputValue, setLocalInputValue] =
            React.useState(inputValue);

        const optionsMap = React.useMemo(() => {
            const map = new Map();
            options.forEach((option) => {
                map.set(option.value, option);
            });
            return map;
        }, [options]);

        React.useEffect(() => {
            const newMap = new Map(selectedOptionsMap);
            defaultValue.forEach((value) => {
                const option = options.find(
                    (opt) => opt.value === value,
                );
                if (option) {
                    newMap.set(value, option);
                }
            });
            setSelectedOptionsMap(newMap);
        }, [defaultValue, options]);

        const selectedOptions = React.useMemo(() => {
            return selectedValues.map((value) => {
                const storedOption = selectedOptionsMap.get(value);
                if (storedOption) {
                    return storedOption;
                }
                const currentOption = optionsMap.get(value);
                if (currentOption) {
                    return currentOption;
                }
                return {
                    label: value,
                    value: value,
                    key: value,
                };
            });
        }, [selectedValues, optionsMap, selectedOptionsMap]);

        React.useEffect(() => {
            if (selectedValues !== defaultValue) {
                setSelectedValues(defaultValue);
            }
        }, [defaultValue, selectedValues]);
        React.useEffect(() => {
            if (inputValue !== localInputValue) {
                setLocalInputValue(inputValue);
            }
        }, [inputValue]);

        const handleInputChange = (value: string) => {
            setLocalInputValue(value);
            if (setInputValue) {
                setInputValue(value);
            }
        };

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>,
        ) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (
                event.key === "Backspace" &&
                !event.currentTarget.value
            ) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (value: string) => {
            const newSelectedValues = selectedValues.includes(value)
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];

            if (!selectedValues.includes(value)) {
                const option = optionsMap.get(value);
                if (option) {
                    const newMap = new Map(selectedOptionsMap);
                    newMap.set(value, option);
                    setSelectedOptionsMap(newMap);
                }
            } else {
                const newMap = new Map(selectedOptionsMap);
                newMap.delete(value);
                setSelectedOptionsMap(newMap);
            }

            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            setSelectedOptionsMap(new Map());
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(
                0,
                maxCount,
            );
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map(
                    (option) => option.value,
                );
                const newMap = new Map();
                options.forEach((option) => {
                    newMap.set(option.value, option);
                });
                setSelectedOptionsMap(newMap);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={(value) => {
                    setIsPopoverOpen(value);
                    if (!value) {
                        onClose?.();
                    }
                }}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex h-auto min-h-[2.25rem] w-full items-center justify-between rounded-sm border bg-inherit p-1 hover:bg-inherit",
                            className,
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedOptions
                                        .slice(0, maxCount)
                                        .map((option) => {
                                            const IconComponent =
                                                option?.icon;
                                            return (
                                                <Badge
                                                    key={option.value}
                                                    className="flex gap-2 rounded-sm bg-gray-300 px-[0.5rem] py-1 text-gray-800"
                                                >
                                                    {IconComponent && (
                                                        <IconComponent className="mr-2 h-4 w-4" />
                                                    )}
                                                    <span className="max-w-[200px] truncate">
                                                        {option.label}
                                                    </span>
                                                    <Cross2Icon
                                                        className="text-gray-600"
                                                        onClick={(
                                                            event,
                                                        ) => {
                                                            event.stopPropagation();
                                                            toggleOption(
                                                                option.value,
                                                            );
                                                        }}
                                                    />
                                                </Badge>
                                            );
                                        })}
                                    {selectedValues.length >
                                        maxCount && (
                                        <Badge
                                            className={cn(
                                                "border-foreground/1 rounded-sm bg-transparent px-[0.5rem] py-1 text-foreground hover:bg-transparent",
                                            )}
                                        >
                                            {`+ ${selectedValues.length - maxCount} mais`}
                                            <Cross2Icon
                                                className="ml-2 h-4 w-4 cursor-pointer text-gray-600"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    clearExtraOptions();
                                                }}
                                            />
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <XIcon
                                        className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />
                                    <Separator
                                        orientation="vertical"
                                        className="flex h-full min-h-6"
                                    />
                                    <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto flex w-full items-center justify-between">
                                <span className="mx-3 text-sm text-muted-foreground">
                                    {placeholder}
                                </span>
                                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="z-[999999999] rounded-sm p-0"
                    style={{ width: `${widthMenu}rem` }}
                    align="start"
                    modal={false}
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command shouldFilter={shouldFilter}>
                        <div>
                            <CommandInput
                                ref={inputCommandRef}
                                placeholder="Buscar..."
                                value={localInputValue}
                                onValueChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                            />
                        </div>
                        <CommandList
                            onWheel={(e) => {
                                const container = e.currentTarget;
                                container.scrollTop += e.deltaY * 0.5;
                            }}
                            className="overflow-y-scroll"
                        >
                            <CommandEmpty>
                                Nenhum resultado encontrado.
                            </CommandEmpty>
                            <CommandGroup className="">
                                {!hideSelectAll && (
                                    <CommandItem
                                        key="all"
                                        onSelect={toggleAll}
                                        className="cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedValues.length ===
                                                    options.length
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </div>
                                        <span>(Selecionar tudo)</span>
                                    </CommandItem>
                                )}
                                {options.map((option) => {
                                    const isSelected =
                                        selectedValues.includes(
                                            option.value,
                                        );
                                    return (
                                        <CommandItem
                                            key={
                                                option.key
                                                    ? `${option.key}`
                                                    : option.value
                                            }
                                            onSelect={() =>
                                                toggleOption(
                                                    option.value,
                                                )
                                            }
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible",
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            {option.icon && (
                                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>
                                                {option.label}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="scroll flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={handleClear}
                                                className="flex-1 cursor-pointer justify-center"
                                            >
                                                Limpar
                                            </CommandItem>
                                            <Separator
                                                orientation="vertical"
                                                className="flex h-full min-h-6"
                                            />
                                        </>
                                    )}
                                    <CommandItem
                                        onSelect={() =>
                                            setIsPopoverOpen(false)
                                        }
                                        className="max-w-full flex-1 cursor-pointer justify-center"
                                    >
                                        Fechar
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

MultiSelect.displayName = "MultiSelect";
