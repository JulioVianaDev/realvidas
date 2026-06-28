import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    APP_MODULES,
    APP_MODULE_LABELS,
    AppModule,
    IProfileEntity,
} from "@global-types/entities/profile.entity-type";
import {
    useGetProfilesQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
} from "@/hooks/query/profile/profile.query";
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
import { Switch } from "@/components/ui/switch";
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
import { Pencil, Trash2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute(
    "/_authenticated/_verified/configuration/profiles/",
)({
    component: ConfigurationProfilesPage,
});

function ConfigurationProfilesPage() {
    const { t } = useTranslation();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [permitAll, setPermitAll] = useState(false);
    const [modules, setModules] = useState<AppModule[]>([]);

    const { data: profilesData, isLoading } = useGetProfilesQuery({
        page: 1,
        pageSize: 100,
    });

    const createMutation = useCreateProfileMutation();
    const updateMutation = useUpdateProfileMutation();
    const deleteMutation = useDeleteProfileMutation();

    const profiles = useMemo(
        () => profilesData?.data || [],
        [profilesData?.data],
    );

    const toggleModule = (key: AppModule) => {
        setModules((prev) =>
            prev.includes(key)
                ? prev.filter((m) => m !== key)
                : [...prev, key],
        );
    };

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setPermitAll(false);
        setModules([]);
    };

    const startEdit = (profile: IProfileEntity) => {
        setEditingId(profile.id);
        setName(profile.name);
        setPermitAll(profile.permitAll);
        setModules(profile.modules);
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) return;
        const payload = {
            name: name.trim(),
            permitAll,
            modules: permitAll ? [] : modules,
        };
        if (editingId) {
            await updateMutation.mutateAsync({
                id: editingId,
                payload,
            });
        } else {
            await createMutation.mutateAsync(payload);
        }
        resetForm();
    };

    const isSavingProfile =
        createMutation.isPending || updateMutation.isPending;

    return (
        <PageShell>
            <PageHeader
                title={t("profile.title")}
                subtitle={t("profile.subtitle")}
            />

            {/* ── Profile create / edit ── */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {editingId
                            ? t("profile.form.editTitle")
                            : t("profile.form.createTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-2 max-w-md">
                        <Label htmlFor="profile-name">
                            {t("profile.form.name")}
                        </Label>
                        <Input
                            id="profile-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t(
                                "profile.form.namePlaceholder",
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="permit-all"
                            checked={permitAll}
                            onCheckedChange={setPermitAll}
                        />
                        <div className="flex flex-col">
                            <Label htmlFor="permit-all">
                                {t("profile.form.permitAll")}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {t("profile.form.permitAllHint")}
                            </span>
                        </div>
                    </div>

                    {!permitAll ? (
                        <div className="space-y-3">
                            <Label>
                                {t("profile.form.modules")}
                            </Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {APP_MODULES.map((key) => (
                                    <label
                                        key={key}
                                        htmlFor={`mod-${key}`}
                                        className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50"
                                    >
                                        <Checkbox
                                            id={`mod-${key}`}
                                            checked={modules.includes(
                                                key,
                                            )}
                                            onCheckedChange={() =>
                                                toggleModule(key)
                                            }
                                        />
                                        {APP_MODULE_LABELS[key]}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="flex gap-3">
                        <Button
                            onClick={handleSaveProfile}
                            disabled={!name.trim() || isSavingProfile}
                        >
                            {isSavingProfile
                                ? t("profile.form.saving")
                                : t("profile.form.save")}
                        </Button>
                        {editingId ? (
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

            {/* ── Existing profiles ── */}
            {isLoading ? (
                <p className="text-muted-foreground">
                    {t("common.loading")}
                </p>
            ) : profiles.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        {t("profile.list.empty")}
                    </p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t("profile.list.columns.name")}
                                </TableHead>
                                <TableHead>
                                    {t("profile.list.columns.access")}
                                </TableHead>
                                <TableHead className="text-right w-[140px]">
                                    {t(
                                        "profile.list.columns.actions",
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profiles.map((profile) => (
                                <TableRow key={profile.id}>
                                    <TableCell className="font-medium">
                                        {profile.name}
                                    </TableCell>
                                    <TableCell>
                                        {profile.permitAll ? (
                                            <Badge>
                                                {t(
                                                    "profile.list.allModules",
                                                )}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {t(
                                                    "profile.list.modulesCount",
                                                    {
                                                        count: String(
                                                            profile
                                                                .modules
                                                                .length,
                                                        ),
                                                    },
                                                )}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={t(
                                                    "profile.list.edit",
                                                )}
                                                onClick={() =>
                                                    startEdit(profile)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                aria-label={t(
                                                    "profile.list.delete",
                                                )}
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                                onClick={() =>
                                                    deleteMutation.mutate(
                                                        profile.id,
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
