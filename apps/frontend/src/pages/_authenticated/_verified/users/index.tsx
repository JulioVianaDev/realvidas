import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import { ITenantUserEntity } from "@global-types/entities/tenant-user.entity-type";
import {
    useGetTenantUsersQuery,
    useCreateTenantUserMutation,
    useUpdateTenantUserMutation,
    useDeleteTenantUserMutation,
} from "@/hooks/query/tenant-user/tenant-user.query";
import { useGetProfilesQuery } from "@/hooks/query/profile/profile.query";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Users } from "lucide-react";

export const Route = createFileRoute(
    "/_authenticated/_verified/users/",
)({
    component: ConfigurationUsersPage,
});

function ConfigurationUsersPage() {
    const { t } = useTranslation();

    const [editingUserId, setEditingUserId] = useState<string | null>(
        null,
    );
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpf, setCpf] = useState("");
    const [selectedProfileIds, setSelectedProfileIds] = useState<
        string[]
    >([]);

    const { data: usersData, isLoading } = useGetTenantUsersQuery({
        page: 1,
        pageSize: 100,
    });
    const { data: profilesData } = useGetProfilesQuery({
        page: 1,
        pageSize: 100,
    });

    const createMutation = useCreateTenantUserMutation();
    const updateMutation = useUpdateTenantUserMutation();
    const deleteMutation = useDeleteTenantUserMutation();

    const users = useMemo(
        () => usersData?.data || [],
        [usersData?.data],
    );
    const profiles = useMemo(
        () => profilesData?.data || [],
        [profilesData?.data],
    );

    const toggleProfile = (profileId: string) => {
        setSelectedProfileIds((prev) =>
            prev.includes(profileId)
                ? prev.filter((id) => id !== profileId)
                : [...prev, profileId],
        );
    };

    const resetForm = () => {
        setEditingUserId(null);
        setName("");
        setEmail("");
        setPassword("");
        setCpf("");
        setSelectedProfileIds([]);
    };

    const startEdit = (user: ITenantUserEntity) => {
        setEditingUserId(user.id);
        setName(user.name);
        setEmail(user.email);
        setPassword("");
        setCpf(user.cpf || "");
        setSelectedProfileIds(user.profiles.map((p) => p.id));
    };

    const handleSave = async () => {
        if (editingUserId) {
            await updateMutation.mutateAsync({
                userId: editingUserId,
                payload: {
                    name: name.trim(),
                    email: email.trim(),
                    cpf: cpf.trim() || undefined,
                    profileIds: selectedProfileIds,
                },
            });
        } else {
            await createMutation.mutateAsync({
                name: name.trim(),
                email: email.trim(),
                password,
                cpf: cpf.trim() || undefined,
                profileIds: selectedProfileIds,
            });
        }
        resetForm();
    };

    const isSaving =
        createMutation.isPending || updateMutation.isPending;
    const canSubmit =
        !!name.trim() &&
        !!email.trim() &&
        (editingUserId ? true : !!password);

    return (
        <PageShell>
            <PageHeader
                title={t("tenantUser.title")}
                subtitle={t("tenantUser.subtitle")}
            />

            {/* ── Create / edit user ── */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {editingUserId
                            ? t("tenantUser.form.editTitle")
                            : t("tenantUser.form.createTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="user-name">
                                {t("tenantUser.form.name")}
                            </Label>
                            <Input
                                id="user-name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder={t(
                                    "tenantUser.form.namePlaceholder",
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="user-email">
                                {t("tenantUser.form.email")}
                            </Label>
                            <Input
                                id="user-email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder={t(
                                    "tenantUser.form.emailPlaceholder",
                                )}
                            />
                        </div>
                        {!editingUserId ? (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="user-password">
                                    {t("tenantUser.form.password")}
                                </Label>
                                <Input
                                    id="user-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder={t(
                                        "tenantUser.form.passwordPlaceholder",
                                    )}
                                />
                            </div>
                        ) : null}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="user-cpf">
                                {t("tenantUser.form.cpf")}
                            </Label>
                            <Input
                                id="user-cpf"
                                value={cpf}
                                onChange={(e) =>
                                    setCpf(e.target.value)
                                }
                                placeholder={t(
                                    "tenantUser.form.cpfPlaceholder",
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>{t("tenantUser.form.profiles")}</Label>
                        {profiles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                {t("tenantUser.form.noProfiles")}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {profiles.map((profile) => (
                                    <label
                                        key={profile.id}
                                        htmlFor={`profile-${profile.id}`}
                                        className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50"
                                    >
                                        <Checkbox
                                            id={`profile-${profile.id}`}
                                            checked={selectedProfileIds.includes(
                                                profile.id,
                                            )}
                                            onCheckedChange={() =>
                                                toggleProfile(
                                                    profile.id,
                                                )
                                            }
                                        />
                                        {profile.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={!canSubmit || isSaving}
                        >
                            {isSaving
                                ? t("tenantUser.form.saving")
                                : editingUserId
                                  ? t("tenantUser.form.save")
                                  : t("tenantUser.form.create")}
                        </Button>
                        {editingUserId ? (
                            <Button
                                variant="outline"
                                onClick={resetForm}
                            >
                                {t("common.cancel")}
                            </Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            {/* ── Tenant users ── */}
            {isLoading ? (
                <p className="text-muted-foreground">
                    {t("common.loading")}
                </p>
            ) : users.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        {t("tenantUser.list.empty")}
                    </p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t(
                                        "tenantUser.list.columns.name",
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        "tenantUser.list.columns.email",
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        "tenantUser.list.columns.profiles",
                                    )}
                                </TableHead>
                                <TableHead className="text-right w-[140px]">
                                    {t(
                                        "tenantUser.list.columns.actions",
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {user.profiles.length === 0 ? (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {user.profiles.map(
                                                    (profile) => (
                                                        <Badge
                                                            key={
                                                                profile.id
                                                            }
                                                            variant="secondary"
                                                        >
                                                            {
                                                                profile.name
                                                            }
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={t(
                                                    "tenantUser.list.edit",
                                                )}
                                                onClick={() =>
                                                    startEdit(user)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                aria-label={t(
                                                    "tenantUser.list.delete",
                                                )}
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                                onClick={() =>
                                                    deleteMutation.mutate(
                                                        user.id,
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
