import { cn } from "@/lib/utils";
import {
    Button,
    buttonVariants,
    ButtonProps,
} from "@/components/ui/button";

import {
    ChevronLeftIcon,
    DoubleArrowLeftIcon,
    ChevronRightIcon,
    DotsHorizontalIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import * as React from "react";
import { Link } from "@tanstack/react-router";

const PaginationRoot = ({
    className,
    ...props
}: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn(
            "mx-auto flex w-full justify-center border-t-2 pt-2",
            className,
        )}
        {...props}
    />
);
PaginationRoot.displayName = "PaginationRoot";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("", className)}
        {...props}
    />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    to: string;
    isActive?: boolean;
    disabled?: boolean;
} & Pick<ButtonProps, "size"> &
    React.ComponentProps<typeof Link>;

const PaginationLink = ({
    className,
    isActive,
    disabled,
    to,
    size = "icon",
    ...props
}: PaginationLinkProps) => {
    const handleClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        if (disabled) {
            event.preventDefault();
        }
    };

    return (
        <Link
            to={to}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size,
                }),
                `${disabled ? "cursor-default" : "cursor-pointer"}`,
                className,
            )}
            aria-disabled={disabled}
            onClick={handleClick}
            {...props}
        />
    );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Ir para a página anterior"
        size="icon"
        className={cn(className)}
        {...props}
    >
        <ChevronLeftIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationFirst = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Ir para a primeira página"
        size="icon"
        className={cn(className)}
        {...props}
    >
        <DoubleArrowLeftIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationFirst.displayName = "PaginationFirst";

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Ir para a próxima página"
        size="icon"
        className={cn(className)}
        {...props}
    >
        <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationLast = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Ir para a última página"
        size="icon"
        className={cn(className)}
        {...props}
    >
        <DoubleArrowRightIcon className="h-4 w-4" />
    </PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn(
            "flex h-9 w-9 items-center justify-center",
            className,
        )}
        {...props}
    >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">Mais páginas</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    PaginationRoot,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationFirst,
    PaginationPrevious,
    PaginationNext,
    PaginationLast,
    PaginationEllipsis,
};
