import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
import {
    PaginationRoot,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationFirst,
    PaginationLast,
} from "@/components/ui/pagination";
import { useLocation } from "@tanstack/react-router";
import useQueryParams from "../hooks/useQueryparams";

interface PaginationProps {
    total?: number;
    currentPage?: number;
    limit?: number;
}

export const Pagination = ({
    total = 0,
    currentPage = 1,
    limit = 10,
}: PaginationProps) => {
    const location = useLocation();
    const { search: searchQuery } = useQueryParams();

    const totalPages = Math.ceil(total / limit);
    const search = Object.fromEntries(searchQuery);

    const toGoNext = generateLinkWithQueryParams(location.pathname, {
        ...search,
        page: String(
            totalPages > currentPage ? currentPage + 1 : currentPage,
        ),
    });

    const toGoPrevious = generateLinkWithQueryParams(
        location.pathname,
        {
            ...search,
            page: String(
                currentPage > 1 ? currentPage - 1 : currentPage,
            ),
        },
    );

    const toGoLast = generateLinkWithQueryParams(location.pathname, {
        ...search,
        page: String(totalPages),
    });

    const toGoFirst = generateLinkWithQueryParams(location.pathname, {
        ...search,
        page: String(1),
    });

    const toGoCurrentPage = generateLinkWithQueryParams(
        location.pathname,
        {
            ...search,
            page: String(currentPage),
        },
    );

    const disabledNextLastPagination = totalPages === currentPage;
    const disabledFirstPrevPagination = currentPage === 1;

    const showing = total < limit ? total : total > 0 ? limit : 0;

    return (
        <PaginationRoot className="flex justify-between items-center px-4 pb-2">
            <div className="">
                <span>
                    Mostrando <b>{showing}</b> de <b>{total}</b>{" "}
                    registro
                    {total > 1 ? "s" : ""}
                </span>
            </div>

            <PaginationContent>
                <PaginationItem>
                    <PaginationFirst
                        to={toGoFirst}
                        disabled={disabledFirstPrevPagination}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationPrevious
                        to={toGoPrevious}
                        disabled={disabledFirstPrevPagination}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        to={toGoCurrentPage}
                        isActive={true}
                    >
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        to={toGoNext}
                        disabled={disabledNextLastPagination}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLast
                        to={toGoLast}
                        disabled={disabledNextLastPagination}
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationRoot>
    );
};

const generateLinkWithQueryParams = (
    path: string,
    params: { [key: string]: string },
) => {
    const searchParams = new URLSearchParams(params);
    return `${path}?${searchParams.toString()}`;
};
