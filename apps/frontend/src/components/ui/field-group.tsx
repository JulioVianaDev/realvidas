import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/** Vertical stack: label above control (0.5rem gap). */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-2", className)} {...props} />
    );
}

type FormFieldRowProps = {
    label: React.ReactNode;
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
    labelClassName?: string;
    /** center = single-line inputs; start = textarea / tall controls */
    align?: "center" | "start";
};

/** Horizontal row: label left, control right — aligned on one line. */
function FormFieldRow({
    label,
    htmlFor,
    children,
    className,
    labelClassName,
    align = "center",
}: FormFieldRowProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-2 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-x-4",
                align === "center" ? "sm:items-center" : "sm:items-start",
                className,
            )}
        >
            <Label
                htmlFor={htmlFor}
                className={cn(
                    "text-muted-foreground sm:text-foreground",
                    align === "start" && "sm:pt-2.5",
                    labelClassName,
                )}
            >
                {label}
            </Label>
            <div className="min-w-0">{children}</div>
        </div>
    );
}

export { FieldGroup, FormFieldRow };
