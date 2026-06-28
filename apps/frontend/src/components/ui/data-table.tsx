import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyMessage?: string;
    className?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = "No results.",
    className,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className={cn("rounded-md border", className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export function DataTableColumnHeader<TData>({
    column,
    title,
}: {
    column: { getCanSort: () => boolean; toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" };
    title: string;
}) {
    if (!column.getCanSort()) {
        return <span>{title}</span>;
    }

    const sorted = column.getIsSorted();

    return (
        <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-foreground"
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {title}
            <span className="text-xs text-muted-foreground">
                {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
            </span>
        </button>
    );
}
