import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useUserStore } from "@/zustand/user.store";
import { ArrowLeft, Mail } from "lucide-react";
import { useMemo } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { getAuthApiErrorMessage } from "@/utils/auth-api-error";
import {
    useVerifyRegistrationCodeMutation,
    useResendVerificationCodeMutation,
} from "@/hooks/query/auth/auth.query";

export const Route = createFileRoute("/_public/verify-email/")({
    beforeLoad: ({ location }) => {
        const { userAuth } = useUserStore.getState();
        if (!userAuth) {
            throw redirect({
                to: "/login",
                search: { redirect: location.pathname },
            });
        }
        if (userAuth.emailConfirmed) {
            throw redirect({ to: "/inicio" });
        }
    },
    validateSearch: (search: Record<string, unknown>) => ({
        redirect:
            typeof search.redirect === "string" ? search.redirect : undefined,
    }),
    component: VerifyEmailPage,
});

function VerifyEmailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { redirect: redirectTo } = Route.useSearch();
    const { userAuth, setUserAuth } = useUserStore();

    const handleLogoutAndGoHome = () => {
        setUserAuth(null);
        navigate({ to: "/" });
    };

    const verifySchema = useMemo(
        () =>
            z.object({
                code: z.string().regex(/^\d{6}$/, {
                    message: t("auth.register.verify.codeInvalid"),
                }),
            }),
        [t],
    );

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    });

    const verifyMutation = useVerifyRegistrationCodeMutation();
    const resendMutation = useResendVerificationCodeMutation();

    const onSubmit = (data: z.infer<typeof verifySchema>) => {
        if (!userAuth?.id) {
            toast.error(t("auth.register.verify.missingSession"));
            return;
        }
        verifyMutation.mutate(
            { userId: userAuth.id, code: data.code },
            {
                onSuccess: () => {
                    toast.success(t("auth.verifyEmailPage.success"));
                },
                onError: (error: unknown) => {
                    toast.error(
                        getAuthApiErrorMessage(
                            error,
                            t("auth.register.verify.invalid"),
                        ),
                    );
                },
            },
        );
    };

    return (
        <div className="w-full min-h-screen pt-16 flex justify-center items-center px-4">
            <Card className="border-border/60 shadow-lg max-w-lg w-full">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        {t("auth.verifyEmailPage.title")}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {t("auth.verifyEmailPage.subtitle", {
                            email: userAuth?.email ?? "",
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center gap-3">
                                        <FormLabel className="sr-only">
                                            {t("auth.register.verify.codeLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                pattern="^[0-9]+$"
                                                inputMode="numeric"
                                                value={field.value}
                                                onChange={(v) =>
                                                    field.onChange(v)
                                                }
                                            >
                                                <InputOTPGroup>
                                                    {Array.from({
                                                        length: 6,
                                                    }).map((_, i) => (
                                                        <InputOTPSlot
                                                            key={i}
                                                            index={i}
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={verifyMutation.isPending}
                                >
                                    {verifyMutation.isPending
                                        ? t("auth.register.verify.submitting")
                                        : t("auth.register.verify.submit")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={
                                        resendMutation.isPending ||
                                        !userAuth?.id
                                    }
                                    onClick={() => {
                                        if (!userAuth?.id) return;
                                        resendMutation.mutate(
                                            { userId: userAuth.id },
                                            {
                                                onSuccess: () => {
                                                    toast.success(t("auth.register.verify.resendSuccess"));
                                                },
                                                onError: (error: unknown) => {
                                                    toast.error(
                                                        getAuthApiErrorMessage(
                                                            error,
                                                            t("auth.register.verify.resendError"),
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    {resendMutation.isPending
                                        ? t("auth.register.verify.resending")
                                        : t(
                                            "auth.register.verify.resendNewCode",
                                        )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        {t("auth.verifyEmailPage.footerHint")}
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        className="mt-4 w-full gap-2 text-muted-foreground"
                        onClick={handleLogoutAndGoHome}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("auth.verifyEmailPage.backToHomeLogout")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
