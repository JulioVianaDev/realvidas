import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useCreateCustomerMutation } from "@/hooks/query/customer/customer.query";
import { CustomerForm } from "@/components/customer-form";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute(
    "/_authenticated/_verified/customers/create",
)({
    component: CustomerCreatePage,
});

function CustomerCreatePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const createMutation = useCreateCustomerMutation();

    return (
        <PageShell>
            <PageHeader
                title={t("customer.create.title")}
                subtitle={t("customer.create.subtitle")}
            />
            <Card>
                <CardContent className="pt-6">
                    <CustomerForm
                        submitting={createMutation.isPending}
                        onCancel={() =>
                            navigate({ to: "/customers" })
                        }
                        onSubmit={async (body) => {
                            await createMutation.mutateAsync(body);
                            navigate({ to: "/customers" });
                        }}
                    />
                </CardContent>
            </Card>
        </PageShell>
    );
}
