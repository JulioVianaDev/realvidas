import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useUserStore } from "@/zustand/user.store";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Building2, Info, Percent, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/inicio/")({
    component: Inicio,
    loader: async () => ({
        title: "Dashboard",
    }),
});

function Inicio() {
    const { t } = useTranslation();
    const { userAuth, user } = useUserStore();

    if (!userAuth) {
        return null;
    }

    const isAdmin = userAuth.role === "ADMIN";
    const hasTenantMembership =
        user?.hasTenantMembership === true ||
        Boolean(user?.currentTenantViewId);

    if (!isAdmin && hasTenantMembership !== true) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("pages.inicio.setup.title")}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t("pages.inicio.setup.subtitle")}
                    </p>
                </div>

                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>
                        {t("pages.inicio.setup.flexibilityTitle")}
                    </AlertTitle>
                    <AlertDescription>
                        {t("pages.inicio.setup.flexibilityBody")}
                    </AlertDescription>
                </Alert>

                <div className="grid gap-6">
                    <Card className="flex flex-col border-primary/20">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <Building2 className="h-5 w-5" />
                                <CardTitle>
                                    {t(
                                        "pages.inicio.setup.company.title",
                                    )}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-left leading-relaxed">
                                {t(
                                    "pages.inicio.setup.company.description",
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                                <li>
                                    {t(
                                        "pages.inicio.setup.company.point1",
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "pages.inicio.setup.company.point2",
                                    )}
                                </li>
                                <li>
                                    {t(
                                        "pages.inicio.setup.company.point3",
                                    )}
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant="secondary"
                                asChild
                            >
                                <Link to="/startup">
                                    {t(
                                        "pages.inicio.setup.company.cta",
                                    )}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">
                    {t("pages.inicio.readyBadge")}
                </span>
            </div>
            <h1 className="text-2xl font-semibold">
                {t("pages.inicio.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">
                {t("pages.inicio.placeholder")}
            </p>
        </div>
    );
}
