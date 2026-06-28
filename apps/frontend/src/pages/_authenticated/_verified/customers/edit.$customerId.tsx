import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
} from "@/hooks/query/customer/customer.query";
import {
    CustomerForm,
    CustomerFormValues,
} from "@/components/customer-form";
import { PageHeader, PageShell } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute(
    "/_authenticated/_verified/customers/edit/$customerId",
)({
    component: CustomerEditPage,
});

function CustomerEditPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { customerId } = Route.useParams();

    const { data: customer, isLoading } =
        useGetCustomerByIdQuery(customerId);
    const updateMutation = useUpdateCustomerMutation();

    if (isLoading) {
        return (
            <PageShell>
                <p className="text-muted-foreground">
                    {t("common.loading")}
                </p>
            </PageShell>
        );
    }

    if (!customer) {
        return (
            <PageShell>
                <p className="text-destructive">
                    {t("customer.edit.notFound")}
                </p>
            </PageShell>
        );
    }

    const defaultValues: Partial<CustomerFormValues> = {
        razaoSocial: customer.razaoSocial || "",
        limiteTolerancia:
            customer.limiteTolerancia != null
                ? String(customer.limiteTolerancia)
                : "",
        nomeFantasia: customer.nomeFantasia || "",
        cnpjCpf: customer.cnpjCpf || "",
        responsavel: customer.responsavel || "",
        email: customer.email || "",
        telefone: customer.telefone || "",
        celular: customer.celular || "",
        phoneCountry: customer.phoneCountry || "br",
        endereco: customer.endereco || "",
        complemento: customer.complemento || "",
        bairro: customer.bairro || "",
        cidade: customer.cidade || "",
        cep: customer.cep || "",
        estado: customer.estado || "",
    };

    return (
        <PageShell>
            <PageHeader
                title={t("customer.edit.title")}
                subtitle={customer.razaoSocial}
            />
            <Card>
                <CardContent className="pt-6">
                    <CustomerForm
                        defaultValues={defaultValues}
                        submitting={updateMutation.isPending}
                        onCancel={() =>
                            navigate({ to: "/customers" })
                        }
                        onSubmit={async (body) => {
                            await updateMutation.mutateAsync({
                                id: customerId,
                                payload: body,
                            });
                            navigate({ to: "/customers" });
                        }}
                    />
                </CardContent>
            </Card>
        </PageShell>
    );
}
