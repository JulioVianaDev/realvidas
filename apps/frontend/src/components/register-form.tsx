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
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { validateCpf } from "@global-types/helpers/validateCpf";
import { Separator } from "@/components/ui/separator";
import CpfInput from "@/components/CpfInput";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useTheme } from "next-themes";
import { CreateUserBodyRequest } from "@global-types/body-requests/user.body-request";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAuthApiErrorMessage } from "@/utils/auth-api-error";
import {
    useRegisterMutation,
    useResendVerificationCodeMutation,
    useVerifyRegistrationCodeMutation,
} from "@/hooks/query/auth/auth.query";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMemo, useState } from "react";
import { Mail } from "lucide-react";

export function RegisterForm() {
    const { t, language } = useTranslation();
    const { theme: preferredTheme } = useTheme();
    const navigate = useNavigate();
    const registerMutation = useRegisterMutation();
    const verifyMutation = useVerifyRegistrationCodeMutation();
    const resendMutation = useResendVerificationCodeMutation();
    const [step, setStep] = useState<1 | 2>(1);
    const [pendingUserId, setPendingUserId] = useState<string | null>(
        null,
    );
    const [registeredEmail, setRegisteredEmail] =
        useState<string>("");

    const registerSchema = useMemo(
        () =>
            z
                .object({
                    name: z
                        .string()
                        .min(
                            2,
                            t("auth.register.validation.nameMin"),
                        ),
                    email: z
                        .string()
                        .email(
                            t(
                                "auth.register.validation.emailInvalid",
                            ),
                        ),
                    password: z
                        .string()
                        .min(
                            6,
                            t("auth.register.validation.passwordMin"),
                        ),
                    confirmPassword: z.string(),
                    cpf: z
                        .string()
                        .optional()
                        .refine(
                            (val) =>
                                !val ||
                                val.length !== 11 ||
                                validateCpf(val),
                            {
                                message: t(
                                    "auth.register.validation.cpfInvalid",
                                ),
                            },
                        ),
                })
                .refine(
                    (data) => data.password === data.confirmPassword,
                    {
                        message: t(
                            "auth.register.validation.passwordMatch",
                        ),
                        path: ["confirmPassword"],
                    },
                ),
        [t],
    );

    const verifySchema = useMemo(
        () =>
            z.object({
                code: z.string().regex(/^\d{6}$/, {
                    message: t("auth.register.verify.codeInvalid"),
                }),
            }),
        [t],
    );

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            cpf: "",
        },
    });

    const codeForm = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    });

    const onSubmitRegister = (
        data: z.infer<typeof registerSchema>,
    ) => {
        const { confirmPassword, cpf, ...userData } = data;
        const themeStored =
            preferredTheme === "dark" ||
            preferredTheme === "light" ||
            preferredTheme === "system"
                ? preferredTheme
                : "light";
        const registerData: CreateUserBodyRequest = {
            ...userData,
            ...(cpf?.trim() ? { cpf: cpf.trim() } : {}),
            language,
            theme: themeStored,
        };

        registerMutation.mutate(registerData, {
            onSuccess: (res) => {
                setPendingUserId(res.id);
                setRegisteredEmail(data.email);
                setStep(2);
                codeForm.reset({ code: "" });
                toast.success(t("auth.register.codeSent"));
            },
            onError: (error: unknown) => {
                toast.error(
                    getAuthApiErrorMessage(
                        error,
                        t("auth.register.error"),
                    ),
                );
            },
        });
    };

    const onSubmitCode = (data: z.infer<typeof verifySchema>) => {
        if (!pendingUserId) {
            toast.error(t("auth.register.verify.missingSession"));
            return;
        }
        verifyMutation.mutate(
            { userId: pendingUserId, code: data.code },
            {
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

    if (step === 2) {
        return (
            <Card className="border-border/60 shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        {t("auth.register.verify.title")}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {t("auth.register.verify.subtitle", {
                            email: registeredEmail,
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...codeForm}>
                        <form
                            onSubmit={codeForm.handleSubmit(
                                onSubmitCode,
                            )}
                            className="space-y-6"
                        >
                            <FormField
                                control={codeForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center gap-3">
                                        <FormLabel className="sr-only">
                                            {t(
                                                "auth.register.verify.codeLabel",
                                            )}
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
                                    disabled={
                                        verifyMutation.isPending
                                    }
                                >
                                    {verifyMutation.isPending
                                        ? t(
                                              "auth.register.verify.submitting",
                                          )
                                        : t(
                                              "auth.register.verify.submit",
                                          )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={
                                        resendMutation.isPending ||
                                        !pendingUserId
                                    }
                                    onClick={() => {
                                        if (!pendingUserId) return;
                                        resendMutation.mutate(
                                            { userId: pendingUserId },
                                            {
                                                onSuccess: () => {
                                                    toast.success(
                                                        t(
                                                            "auth.register.verify.resendSuccess",
                                                        ),
                                                    );
                                                },
                                                onError: (
                                                    error: unknown,
                                                ) => {
                                                    toast.error(
                                                        getAuthApiErrorMessage(
                                                            error,
                                                            t(
                                                                "auth.register.verify.resendError",
                                                            ),
                                                        ),
                                                    );
                                                },
                                            },
                                        );
                                    }}
                                >
                                    {resendMutation.isPending
                                        ? t(
                                              "auth.register.verify.resending",
                                          )
                                        : t(
                                              "auth.register.verify.resendNewCode",
                                          )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        {t("auth.register.verify.hint")}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">
                    {t("auth.register.title")}
                </CardTitle>
                <CardDescription>
                    {t("auth.register.subtitle")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitRegister)}
                        className="space-y-4"
                    >
                        {/* Two Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("auth.register.name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "auth.register.namePlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
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
                                                type="email"
                                                placeholder={t(
                                                    "auth.register.emailPlaceholder",
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
                                            {t(
                                                "auth.register.password",
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder={t(
                                                    "auth.register.passwordPlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "auth.register.confirmPassword",
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder={t(
                                                    "auth.register.confirmPasswordPlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending
                                ? t("auth.register.submitting")
                                : t("auth.register.submit")}
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
                                {t("auth.register.orContinueWith")}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <GoogleLoginButton />
                    </div>
                </div>

                <div className="mt-6 text-center text-sm">
                    {t("auth.register.haveAccount")}{" "}
                    <button
                        type="button"
                        onClick={() => navigate({ to: "/login" })}
                        className="cursor-pointer text-primary/90 hover:text-primary underline underline-offset-4"
                    >
                        {t("auth.register.loginHere")}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
