import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
    Loader2,
    AlertCircle,
    CheckCircle2,
    Mail,
    ArrowLeft,
} from "lucide-react";
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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useUserStore } from "@/zustand/user.store";
import { toast } from "sonner";
import { getAuthApiErrorMessage } from "@/utils/auth-api-error";
import {
    useConfirmEmailFromLinkMutation,
    useResendVerificationFromLinkMutation,
    useVerificationLinkContextMutation,
    useVerifyRegistrationCodeMutation,
} from "@/hooks/query/auth/auth.query";
import { IAuthLoginResponse } from "@global-types/responses/auth.response";

export const Route = createFileRoute("/_public/welcome/")({
    component: WelcomePage,
    validateSearch: (search: Record<string, unknown>) => ({
        token:
            typeof search.token === "string"
                ? search.token
                : undefined,
    }),
});

type LinkContext = {
    userId: string;
    email: string;
};

function getHttpStatus(error: unknown): number | undefined {
    if (
        !error ||
        typeof error !== "object" ||
        !("response" in error)
    ) {
        return undefined;
    }
    const ax = error as AxiosError<{ statusCode?: number }>;
    return ax.response?.status ?? ax.response?.data?.statusCode;
}

function confirmAttemptStorageKey(linkToken: string): string {
    return `realvidas:welcome-confirm-attempt:${linkToken.slice(-32)}`;
}

function WelcomePage() {
    const { token } = Route.useSearch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const setUserAuth = useUserStore((s) => s.setUserAuth);
    const autoConfirmStarted = useRef(false);

    const [linkContext, setLinkContext] =
        useState<LinkContext | null>(null);
    const [pageState, setPageState] = useState<
        "loading" | "ready" | "invalid" | "success"
    >("loading");
    /** True when token exists but userId/email unknown until resend succeeds */
    const [awaitingResendForContext, setAwaitingResendForContext] =
        useState(false);

    const resendMutation = useResendVerificationFromLinkMutation();
    const confirmMutation = useConfirmEmailFromLinkMutation();
    const linkContextMutation = useVerificationLinkContextMutation();
    const verifyMutation = useVerifyRegistrationCodeMutation();

    const verifySchema = useMemo(
        () =>
            z.object({
                code: z.string().regex(/^\d{6}$/, {
                    message: t("auth.register.verify.codeInvalid"),
                }),
            }),
        [t],
    );

    const codeForm = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    });

    const applyAuthAndRedirect = (data: IAuthLoginResponse) => {
        setUserAuth({
            id: data.id,
            token: data.token,
            role: data.role,
            email: data.email,
            emailConfirmed: data.emailConfirmed,
        });
        setPageState("success");
        toast.success(t("auth.welcomePage.confirmed"));
        navigate({ to: "/" });
    };

    const tryAutoConfirmFromLink = (linkToken: string) => {
        if (typeof window === "undefined") return;
        const attemptKey = confirmAttemptStorageKey(linkToken);
        if (sessionStorage.getItem(attemptKey)) return;
        sessionStorage.setItem(attemptKey, "1");

        confirmMutation.mutate(
            { token: linkToken },
            {
                onSuccess: applyAuthAndRedirect,
                onError: (err) => {
                    const status = getHttpStatus(err);
                    if (status === 400 || status === 401) {
                        toast.error(
                            getAuthApiErrorMessage(
                                err,
                                t("auth.welcomePage.expiredTitle"),
                            ),
                        );
                        return;
                    }
                    toast.error(
                        getAuthApiErrorMessage(
                            err,
                            t("auth.welcomePage.invalidLink"),
                        ),
                    );
                },
            },
        );
    };

    useEffect(() => {
        if (!token) {
            setPageState("invalid");
            setLinkContext(null);
            return;
        }

        setPageState("loading");
        setLinkContext(null);
        setAwaitingResendForContext(false);
        codeForm.reset({ code: "" });

        linkContextMutation.mutate(
            { token },
            {
                onSuccess: (ctx) => {
                    setLinkContext(ctx);
                    setAwaitingResendForContext(false);
                    setPageState("ready");
                    if (!autoConfirmStarted.current) {
                        autoConfirmStarted.current = true;
                        tryAutoConfirmFromLink(token);
                    }
                },
                onError: (err) => {
                    const status = getHttpStatus(err);
                    if (status === 404 || status === 501) {
                        setLinkContext(null);
                        setAwaitingResendForContext(true);
                        setPageState("ready");
                        return;
                    }
                    setLinkContext(null);
                    setAwaitingResendForContext(false);
                    setPageState("invalid");
                },
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when token changes only
    }, [token]);

    const onSubmitCode = (data: z.infer<typeof verifySchema>) => {
        if (!linkContext?.userId) return;
        verifyMutation.mutate(
            { userId: linkContext.userId, code: data.code },
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

    const handleResendNewCode = () => {
        if (!token) return;
        resendMutation.mutate(
            { token },
            {
                onSuccess: (data) => {
                    if (data.userId && data.email) {
                        setLinkContext({
                            userId: data.userId,
                            email: data.email,
                        });
                        setAwaitingResendForContext(false);
                    }
                    codeForm.reset({ code: "" });
                    toast.success(
                        t("auth.register.verify.resendSuccess"),
                    );
                },
                onError: (err) => {
                    toast.error(
                        getAuthApiErrorMessage(
                            err,
                            t("auth.register.verify.resendError"),
                        ),
                    );
                },
            },
        );
    };

    const isSubmitting =
        verifyMutation.isPending ||
        resendMutation.isPending ||
        confirmMutation.isPending;

    const showNoToken = !token;
    const showInvalid = pageState === "invalid" && !showNoToken;
    const showReady = pageState === "ready";
    const showLoading = pageState === "loading" && Boolean(token);
    const showSuccess = pageState === "success";
    const canEnterCode = Boolean(linkContext?.userId);

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center px-4 pt-16">
            <Button
                variant="ghost"
                className="absolute left-4 top-4 gap-2"
                onClick={() => navigate({ to: "/" })}
            >
                <ArrowLeft className="h-4 w-4" />
                {t("common.backToHome")}
            </Button>

            <Card className="w-full max-w-lg border-border/60 shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {showLoading ||
                        (showReady && confirmMutation.isPending) ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : showSuccess ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : showInvalid || showNoToken ? (
                            <AlertCircle className="h-6 w-6 text-primary" />
                        ) : (
                            <Mail className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {showInvalid || showNoToken
                            ? t("auth.welcomePage.expiredTitle")
                            : t("auth.verifyEmailPage.title")}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {showNoToken
                            ? t("auth.welcomePage.noToken")
                            : showInvalid
                              ? t("auth.welcomePage.invalidLink")
                              : showReady && linkContext?.email
                                ? t("auth.verifyEmailPage.subtitle", {
                                      email: linkContext.email,
                                  })
                                : showReady &&
                                    awaitingResendForContext
                                  ? t(
                                        "auth.welcomePage.expiredDetail",
                                    )
                                  : t("auth.welcomePage.loading")}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {showNoToken && (
                        <Button
                            className="mt-2 w-full"
                            onClick={() => navigate({ to: "/" })}
                        >
                            {t("auth.welcomePage.goHome")}
                        </Button>
                    )}

                    {showInvalid && (
                        <div className="flex flex-col gap-2">
                            <p className="text-center text-sm text-muted-foreground">
                                {t("auth.welcomePage.expiredDetail")}
                            </p>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    navigate({ to: "/register" })
                                }
                            >
                                {t("auth.welcomePage.goRegister")}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate({ to: "/" })}
                            >
                                {t("auth.welcomePage.goHome")}
                            </Button>
                        </div>
                    )}

                    {showLoading && (
                        <p className="text-center text-sm text-muted-foreground">
                            {t("auth.welcomePage.loading")}
                        </p>
                    )}

                    {showReady && (
                        <>
                            {awaitingResendForContext &&
                                !canEnterCode && (
                                    <p className="mb-4 text-center text-sm text-muted-foreground">
                                        {t(
                                            "auth.welcomePage.expiredHint",
                                        )}
                                    </p>
                                )}
                            {canEnterCode && (
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
                                                            maxLength={
                                                                6
                                                            }
                                                            pattern="^[0-9]+$"
                                                            inputMode="numeric"
                                                            value={
                                                                field.value
                                                            }
                                                            onChange={(
                                                                v,
                                                            ) =>
                                                                field.onChange(
                                                                    v,
                                                                )
                                                            }
                                                        >
                                                            <InputOTPGroup>
                                                                {Array.from(
                                                                    {
                                                                        length: 6,
                                                                    },
                                                                ).map(
                                                                    (
                                                                        _,
                                                                        i,
                                                                    ) => (
                                                                        <InputOTPSlot
                                                                            key={
                                                                                i
                                                                            }
                                                                            index={
                                                                                i
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {verifyMutation.isPending
                                                ? t(
                                                      "auth.register.verify.submitting",
                                                  )
                                                : t(
                                                      "auth.register.verify.submit",
                                                  )}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                            <div
                                className={
                                    canEnterCode
                                        ? "mt-2 flex flex-col gap-2"
                                        : "flex flex-col gap-2"
                                }
                            >
                                <Button
                                    type="button"
                                    variant={
                                        canEnterCode
                                            ? "outline"
                                            : "default"
                                    }
                                    className="w-full"
                                    disabled={isSubmitting || !token}
                                    onClick={handleResendNewCode}
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
                            {canEnterCode && (
                                <p className="mt-4 text-center text-sm text-muted-foreground">
                                    {t(
                                        "auth.verifyEmailPage.footerHint",
                                    )}
                                </p>
                            )}
                        </>
                    )}

                    {showSuccess && (
                        <p className="text-center text-sm text-muted-foreground">
                            {t("auth.welcomePage.redirecting")}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
