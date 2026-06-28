import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type PageHeaderBreadcrumb = {
    label: string;
    to?: string;
    params?: Record<string, string>;
};

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    breadcrumbs?: PageHeaderBreadcrumb[];
    actions?: ReactNode;
    className?: string;
};

export function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    const hasTrailing = (breadcrumbs?.length ?? 0) > 0 || actions;

    return (
        <div
            className={cn(
                "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                className,
            )}
        >
            <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle ? (
                    <p className="mt-2 text-muted-foreground">{subtitle}</p>
                ) : null}
            </div>
            {hasTrailing ? (
                <div className="flex shrink-0 flex-col items-end gap-2 sm:pt-1">
                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        <Breadcrumb>
                            <BreadcrumbList className="justify-end">
                                {breadcrumbs.map((crumb, index) => {
                                    const isLast = index === breadcrumbs.length - 1;
                                    return (
                                        <span key={`${crumb.label}-${index}`} className="contents">
                                            {index > 0 ? <BreadcrumbSeparator /> : null}
                                            <BreadcrumbItem>
                                                {isLast || !crumb.to ? (
                                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link
                                                            to={crumb.to}
                                                            params={crumb.params}
                                                        >
                                                            {crumb.label}
                                                        </Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </span>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    ) : null}
                    {actions}
                </div>
            ) : null}
        </div>
    );
}

type PageShellProps = {
    children: React.ReactNode;
    className?: string;
};

/** Standard page wrapper: centered container with consistent padding. */
export function PageShell({ children, className }: PageShellProps) {
    return (
        <div className={cn("container mx-auto px-4 py-4", className)}>
            {children}
        </div>
    );
}
