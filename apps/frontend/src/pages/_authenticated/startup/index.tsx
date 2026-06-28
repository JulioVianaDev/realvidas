import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/TranslationsContext";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Building2,
    Loader2,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStartUserTenantMutation } from "@/hooks/query/start-user-tenant/start-user-tenant.query";
import { useSetUserTenantCache } from "@/hooks/query/user/user.query";
import { socket, useSocketV1 } from "@/api/socket";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import CpfInput from "@/components/CpfInput";
import { validateCpf } from "@global-types/helpers/validateCpf";
import { useUserStore } from "@/zustand/user.store";
import CnpjInput from "@/components/CnpjInput";
import { getDefaultTimezoneComboboxValue } from "@/components/timezone-combobox";

export const Route = createFileRoute("/_authenticated/startup/")({
    component: StartupPage,
});

function formatCpf(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 11) return raw;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

const startupFormSchema = z
    .object({
        enterpriseName: z.string().min(2).max(120),
        cpf: z
            .string()
            .optional()
            .nullable()
            .refine(
                (val) => {
                    if (!val) return true;
                    const digits = val.replace(/\D/g, "");
                    if (digits.length === 0) return true;
                    if (digits.length !== 11) return false;
                    return validateCpf(digits);
                },
                { message: "Invalid CPF" },
            ),
        cnpj: z.string().optional().nullable(),
        email: z
            .string()
            .email()
            .optional()
            .nullable()
            .or(z.literal("")),
        timezone: z.string().optional().nullable(),
    })
    .refine(
        (data) => {
            const cpfDigits = data.cpf?.replace(/\D/g, "") || "";
            const cnpjDigits = data.cnpj?.replace(/\D/g, "") || "";
            return cpfDigits.length > 0 || cnpjDigits.length > 0;
        },
        {
            message: "CPF or CNPJ is required",
            path: ["cpf"],
        },
    );

type StartupFormValues = z.infer<typeof startupFormSchema>;

function StartupPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const mutation = useStartUserTenantMutation();
    const setUserTenantCache = useSetUserTenantCache();
    const userAuth = useUserStore((state) => state.userAuth);
    const [step, setStep] = useState<
        "form" | "provisioning" | "ready"
    >("form");
    const [tenantData, setTenantData] = useState<{
        tenantId: string;
        enterpriseId: string;
        enterpriseName: string;
    } | null>(null);

    const form = useForm<StartupFormValues>({
        resolver: zodResolver(startupFormSchema),
        defaultValues: {
            enterpriseName: "",
            cpf: "",
            cnpj: "",
            email: "",
            timezone: getDefaultTimezoneComboboxValue(),
        },
    });

    const handleTenantReady = useCallback(
        (data: {
            tenantId: string;
            enterpriseId: string;
            enterpriseName: string;
        }) => {
            setTenantData(data);
            setStep("ready");
            localStorage.setItem("selected-tenant-id", data.tenantId);
            if (userAuth?.id) {
                setUserTenantCache(userAuth.id, data.tenantId);
            }
            toast.success(
                t("pages.startup.tenantReady") ||
                    "Your workspace is ready!",
            );
        },
        [setUserTenantCache, t, userAuth?.id],
    );

    const handleTenantError = useCallback(
        (data: { tenantId: string; error: string }) => {
            setStep("form");
            toast.error(data.error || "Failed to create workspace");
        },
        [],
    );

    useSocketV1("tenant:ready", handleTenantReady, [
        handleTenantReady,
    ]);
    useSocketV1("tenant:error", handleTenantError, [
        handleTenantError,
    ]);

    const onSubmit = async (values: StartupFormValues) => {
        try {
            const cpfDigits = values.cpf?.replace(/\D/g, "") || "";
            const result = await mutation.mutateAsync({
                enterpriseName: values.enterpriseName,
                cpf:
                    cpfDigits.length === 11
                        ? formatCpf(cpfDigits)
                        : null,
                cnpj: values.cnpj || null,
                email: values.email || null,
                timezone: values.timezone || null,
            });
            socket.joinTenantRoom(result.tenant.id);
            setStep("provisioning");
        } catch {
            toast.error(
                t("pages.startup.createError") ||
                    "Failed to start workspace creation",
            );
        }
    };

    const handleGoToDashboard = () => {
        navigate({ to: "/inicio" });
    };

    if (step === "ready" && tenantData) {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
                <Card className="w-full max-w-lg border-green-500/30 shadow-lg">
                    <CardHeader className="space-y-3 text-center pb-2">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            {t("pages.startup.readyTitle") ||
                                "Workspace Ready!"}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            {t("pages.startup.readyDescription") ||
                                `Your workspace "${tenantData.enterpriseName}" has been created successfully.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pt-4">
                        <Button
                            size="lg"
                            onClick={handleGoToDashboard}
                            className="gap-2"
                        >
                            <Building2 className="h-4 w-4" />
                            {t("pages.startup.goToDashboard") ||
                                "Go to Dashboard"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === "provisioning") {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
                <Card className="w-full max-w-lg border-primary/20 shadow-lg">
                    <CardHeader className="space-y-3 text-center pb-2">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            {t("pages.startup.provisioningTitle") ||
                                "Setting up your workspace..."}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            {t(
                                "pages.startup.provisioningDescription",
                            ) ||
                                "We're preparing everything for you. This may take a few moments."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            {t("pages.startup.provisioningHint") ||
                                "Please don't close this page"}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
            <Card className="w-full max-w-lg border-primary/20 shadow-lg">
                <CardHeader className="space-y-3 text-center pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles
                            className="h-6 w-6 text-primary"
                            aria-hidden
                        />
                    </div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                        {t("pages.startup.title") ||
                            "Create your workspace"}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        {t("pages.startup.subtitle") ||
                            "Fill in your enterprise details to get started"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="enterpriseName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "pages.startup.form.enterpriseName",
                                            ) || "Enterprise name"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={
                                                    t(
                                                        "pages.startup.form.enterpriseNamePlaceholder",
                                                    ) || "My Company"
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF</FormLabel>
                                            <FormControl>
                                                <CpfInput
                                                    value={
                                                        field.value ||
                                                        ""
                                                    }
                                                    onChange={(ev) =>
                                                        field.onChange(
                                                            ev.target
                                                                .value,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cnpj"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                CNPJ
                                            </FormLabel>
                                            <FormControl>
                                                <CnpjInput
                                                    placeholder="00.000.000/0000-00"
                                                    value={
                                                        field.value ||
                                                        ""
                                                    }
                                                    onChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "pages.startup.form.email",
                                            ) || "Business email"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="contact@company.com"
                                                value={
                                                    field.value || ""
                                                }
                                                onChange={
                                                    field.onChange
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                size="lg"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Building2 className="h-4 w-4" />
                                )}
                                {t("pages.startup.form.submit") ||
                                    "Create workspace"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
