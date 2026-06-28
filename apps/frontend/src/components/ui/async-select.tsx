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
import { createRef, useEffect, useRef, useState } from "react";

interface AsyncSelectProps {
    search: string;
    setSearch: (s: string) => void;
    isLoading: boolean;
    data: { label: string; value: string | number }[];
    onSelect: (value: string | number) => void;
}
export function AsyncSelect({
    search,
    setSearch,
    isLoading,
    data,
    onSelect,
}: AsyncSelectProps) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [popoverWidth, setPopoverWidth] = useState<number | null>(
        null,
    );

    useEffect(() => {
        if (open && buttonRef.current) {
            const buttonRect =
                buttonRef.current.getBoundingClientRect();
            setPopoverWidth(buttonRect.width);
        }
    }, [open]);
    return (
        <>
            <Popover
                open={open}
                onOpenChange={setOpen}
                modal={false}
            >
                <PopoverTrigger
                    asChild
                    className="w-full"
                >
                    <div
                        // @ts-ignore
                        ref={buttonRef}
                        className="w-full"
                    >
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between  h-8 rounded-sm"
                        >
                            Procurar...
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    forceMount
                    modal={false}
                    style={{
                        width: popoverWidth
                            ? `${popoverWidth}px`
                            : "auto",
                    }}
                >
                    <Command
                        shouldFilter={false}
                        className="w-full"
                    >
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Procurar..."
                            className="w-full "
                        />
                        <CommandList className="w-full">
                            <CommandGroup
                                className={`w-full h-[200px] `}
                            >
                                {isLoading && (
                                    <CommandItem>
                                        Carregando...
                                    </CommandItem>
                                )}
                                {!isLoading && data.length ? (
                                    data.map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value.toString()}
                                            className="w-full"
                                            onSelect={(
                                                currentValue,
                                            ) => {
                                                onSelect(
                                                    currentValue,
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {item.label}
                                        </CommandItem>
                                    ))
                                ) : (
                                    <CommandEmpty>
                                        Nenhum cliente achado
                                    </CommandEmpty>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
