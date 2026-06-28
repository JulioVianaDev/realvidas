import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    useGetMyEnterprisesQuery,
    useDeleteEnterpriseMutation,
} from "@/hooks/query/enterprise/enterprise.query";
import { useUserStore } from "@/zustand/user.store";
import { useEnterprisesForSelect } from "@/hooks/use-enterprises-for-select";
import { IEnterpriseWithMembersCount } from "@global-types/entities/enterprise.entity-type";
import { Button } from "@/components/ui/button";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

export const Route = createFileRoute(
    "/_authenticated/_verified/configuration/enterprise/",
)({
    component: ConfigurationEnterprisesPage,
});

function ConfigurationEnterprisesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userId = useUserStore((s) => s.userAuth?.id);
    const userRole = useUserStore((s) => s.userAuth?.role);
    const isAdmin = userRole === "ADMIN";
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const {
        enterprises: tenantEnterpriseOptions,
        isLoading: tenantListLoading,
    } = useEnterprisesForSelect();
    const {
        data,
        isLoading: myLoading,
        error,
    } = useGetMyEnterprisesQuery(
        {
            page,
            pageSize,
            includeInactive: true,
        },
        !isAdmin,
    );
    const { data: myDataAdmin } = useGetMyEnterprisesQuery(
        {
            page: 1,
            pageSize: 200,
            includeInactive: true,
        },
        isAdmin,
    );
    const deleteMutation = useDeleteEnterpriseMutation();
    const [deleteTarget, setDeleteTarget] =
        useState<IEnterpriseWithMembersCount | null>(null);

    const myById = useMemo(() => {
        const list = (isAdmin ? myDataAdmin?.data : data?.data) as
            | IEnterpriseWithMembersCount[]
            | undefined;
        const m = new Map<string, IEnterpriseWithMembersCount>();
        (list || []).forEach((e) => m.set(e.id, e));
        return m;
    }, [isAdmin, myDataAdmin?.data, data?.data]);

    const rows = useMemo((): IEnterpriseWithMembersCount[] => {
        if (isAdmin) {
            return tenantEnterpriseOptions.map((opt) => {
                const full = myById.get(opt.id);
                if (full) return full;
                return {
                    id: opt.id,
                    name: opt.name,
                    cpf: null,
                    cnpj: null,
                    description: null,
                    email: null,
                    phone: null,
                    imageUrl: null,
                    shortPath: null,
                    isActive: true,
                    ownerId: "",
                    mainGoogleEmail: null,
                    googleRefreshToken: null,
                    googleAccessToken: null,
                    tokenExpiresAt: null,
                    timezone: null,
                    needCpfInCatalog: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    _count: { members: 0, calendars: 0 },
                };
            });
        }
        return (data?.data || []) as IEnterpriseWithMembersCount[];
    }, [isAdmin, tenantEnterpriseOptions, myById, data?.data]);

    const metadata = isAdmin ? null : data?.metadata;
    const isLoading =
        tenantListLoading ||
        (!isAdmin && myLoading) ||
        (isAdmin && myLoading);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p className="text-muted-foreground">
                    {t("common.loading")}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p className="text-destructive">
                    {t("configurationEnterprise.list.loadError")}
                </p>
            </div>
        );
    }

    return (
        <PageShell>
            <PageHeader
                title={t("configurationEnterprise.list.title")}
                subtitle={t("configurationEnterprise.list.subtitle")}
                actions={
                    <Button
                        className="gap-2 shrink-0"
                        onClick={() => navigate({ to: "/startup" })}
                    >
                        <Plus className="h-4 w-4" />
                        {t("enterprise.createButton")}
                    </Button>
                }
            />

            {rows.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                        {t("configurationEnterprise.list.empty")}
                    </p>
                    <Button
                        onClick={() => navigate({ to: "/startup" })}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("enterprise.createButton")}
                    </Button>
                </div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t(
                                            "configurationEnterprise.list.columns.name",
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            "configurationEnterprise.list.columns.email",
                                        )}
                                    </TableHead>

                                    <TableHead className="text-right">
                                        {t(
                                            "configurationEnterprise.list.columns.members",
                                        )}
                                    </TableHead>
                                    <TableHead className="text-right w-[140px]">
                                        {t(
                                            "configurationEnterprise.list.columns.actions",
                                        )}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => {
                                    const isOwner =
                                        row.ownerId === userId;
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">
                                                {row.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {row.email || "—"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {row._count
                                                    ?.members ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={t(
                                                            "configurationEnterprise.list.edit",
                                                        )}
                                                        onClick={() =>
                                                            navigate({
                                                                to: "/configuration/enterprise/edit/$enterpriseId",
                                                                params: {
                                                                    enterpriseId:
                                                                        row.id,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    {isOwner ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            aria-label={t(
                                                                "configurationEnterprise.list.delete",
                                                            )}
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    row,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {metadata &&
                    (metadata.hasNextPage ||
                        metadata.hasPreviousPage) ? (
                        <div className="flex justify-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!metadata.hasPreviousPage}
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                            >
                                {t("enterprise.pagination.previous")}
                            </Button>
                            <span className="text-sm text-muted-foreground flex items-center">
                                {t("enterprise.pagination.page")}{" "}
                                {metadata.page}{" "}
                                {t("enterprise.pagination.of")}{" "}
                                {metadata.lastPage}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!metadata.hasNextPage}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                {t("enterprise.pagination.next")}
                            </Button>
                        </div>
                    ) : null}
                </>
            )}

            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t(
                                "configurationEnterprise.deleteDialog.title",
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                "configurationEnterprise.deleteDialog.description",
                                {
                                    name: deleteTarget?.name ?? "",
                                },
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                            onClick={async () => {
                                if (!deleteTarget) return;
                                await deleteMutation.mutateAsync(
                                    deleteTarget.id,
                                );
                                setDeleteTarget(null);
                            }}
                        >
                            {t(
                                "configurationEnterprise.deleteDialog.confirm",
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageShell>
    );
}
