import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useLoginMutation } from "@/hooks/query/auth/auth.query";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/TranslationsContext";
import { getAuthApiErrorMessage } from "@/utils/auth-api-error";

export function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const loginMutation = useLoginMutation();

    const loginSchema = useMemo(
        () =>
            z.object({
                email: z.string().email(t("auth.login.validation.emailInvalid")),
                password: z
                    .string()
                    .min(3, t("auth.login.validation.passwordMin")),
            }),
        [t],
    );

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        loginMutation.mutate(data, {
            onError: (error: unknown) => {
                toast.error(
                    getAuthApiErrorMessage(
                        error,
                        t("auth.login.errorFallback"),
                    ),
                );
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{t("auth.login.title")}</CardTitle>
                <CardDescription>{t("auth.login.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("auth.register.email")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                "auth.login.emailPlaceholder",
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("auth.register.password")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t(
                                                "auth.login.passwordPlaceholder",
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending
                                ? t("auth.login.submitting")
                                : t("auth.login.submit")}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {t("auth.login.orContinueWith")}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <GoogleLoginButton />
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                    {t("auth.login.noAccount")}{" "}
                    <button
                        type="button"
                        onClick={() => navigate({ to: "/register" })}
                        className="text-primary hover:text-primary/20 underline underline-offset-4"
                    >
                        {t("auth.login.createAccount")}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
