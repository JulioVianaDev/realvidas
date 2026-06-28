import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import { EnterpriseSelect } from "@/components/selects/enterprise-select";
import { EnterpriseDetailsForm } from "@/components/enterprise/enterprise-details-form";
import { useEnterprisesForSelect } from "@/hooks/use-enterprises-for-select";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/ui/field-group";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute(
    "/_authenticated/_verified/configuration/enterprise/edit/$enterpriseId",
)({
    component: ConfigurationEnterpriseEditPage,
});

function ConfigurationEnterpriseEditPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { enterpriseId } = Route.useParams();
    const { enterprises, isLoading } = useEnterprisesForSelect();

    useEffect(() => {
        if (isLoading) return;
        if (enterprises.length === 0) {
            navigate({ to: "/configuration/enterprise" });
            return;
        }
        const ok = enterprises.some((e) => e.id === enterpriseId);
        if (!ok) {
            navigate({ to: "/configuration/enterprise" });
        }
    }, [isLoading, enterprises, enterpriseId, navigate]);

    return (
        <PageShell className="max-w-5xl">
            <PageHeader
                title={t("configurationEnterprise.edit.title")}
                subtitle={t("configurationEnterprise.edit.subtitle")}
                breadcrumbs={[
                    { label: t("assistants.breadcrumb.home"), to: "/inicio" },
                    {
                        label: t("configurationEnterprise.breadcrumb.enterprises"),
                        to: "/configuration/enterprise",
                    },
                    { label: t("configurationEnterprise.breadcrumb.edit") },
                ]}
            />

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{t("configurationEnterprise.edit.selectCardTitle")}</CardTitle>
                    <CardDescription>
                        {t("configurationEnterprise.edit.selectCardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Label className="text-sm text-muted-foreground">
                            {t("configurationEnterprise.edit.selectLabel")}
                        </Label>
                        <EnterpriseSelect
                            value={enterpriseId}
                            onValueChange={(id) =>
                                navigate({
                                    to: "/configuration/enterprise/edit/$enterpriseId",
                                    params: { enterpriseId: id },
                                })
                            }
                        />
                    </FieldGroup>
                </CardContent>
            </Card>

            <EnterpriseDetailsForm
                embedded
                editEnterpriseId={enterpriseId}
                onCancel={() => navigate({ to: "/configuration/enterprise" })}
                onSuccess={() => navigate({ to: "/configuration/enterprise" })}
            />
        </PageShell>
    );
}
