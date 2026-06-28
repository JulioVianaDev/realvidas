import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    useGetCustomersQuery,
    useDeleteCustomerMutation,
} from "@/hooks/query/customer/customer.query";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

export const Route = createFileRoute(
    "/_authenticated/_verified/customers/",
)({
    component: CustomersListPage,
});

function CustomersListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useGetCustomersQuery({
        page: 1,
        pageSize: 100,
        search: search || undefined,
    });
    const deleteMutation = useDeleteCustomerMutation();

    const customers = data?.data || [];

    return (
        <PageShell>
            <PageHeader
                title={t("customer.title")}
                subtitle={t("customer.subtitle")}
                actions={
                    <Button
                        className="gap-2 shrink-0"
                        onClick={() =>
                            navigate({ to: "/customers/create" })
                        }
                    >
                        <Plus className="h-4 w-4" />
                        {t("customer.newButton")}
                    </Button>
                }
            />

            <div className="mb-4 max-w-sm">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("customer.searchPlaceholder")}
                />
            </div>

            {isLoading ? (
                <p className="text-muted-foreground">
                    {t("common.loading")}
                </p>
            ) : customers.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                        {t("customer.list.empty")}
                    </p>
                    <Button
                        onClick={() =>
                            navigate({ to: "/customers/create" })
                        }
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("customer.newButton")}
                    </Button>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t(
                                        "customer.list.columns.razaoSocial",
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        "customer.list.columns.nomeFantasia",
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        "customer.list.columns.cnpjCpf",
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t("customer.list.columns.cidade")}
                                </TableHead>
                                <TableHead>
                                    {t("customer.list.columns.estado")}
                                </TableHead>
                                <TableHead className="text-right w-[140px]">
                                    {t(
                                        "customer.list.columns.actions",
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        {customer.razaoSocial}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {customer.nomeFantasia || "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {customer.cnpjCpf || "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {customer.cidade || "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {customer.estado || "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={t(
                                                    "customer.list.edit",
                                                )}
                                                onClick={() =>
                                                    navigate({
                                                        to: "/customers/edit/$customerId",
                                                        params: {
                                                            customerId:
                                                                customer.id,
                                                        },
                                                    })
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                aria-label={t(
                                                    "customer.list.delete",
                                                )}
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                                onClick={() =>
                                                    deleteMutation.mutate(
                                                        customer.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </PageShell>
    );
}
