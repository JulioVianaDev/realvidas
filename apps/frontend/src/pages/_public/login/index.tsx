import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationsContext";

export const Route = createFileRoute("/_public/login/")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="w-full min-h-screen pt-8 flex justify-center items-center relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4 gap-2"
                onClick={() => navigate({ to: "/" })}
            >
                <ArrowLeft className="h-4 w-4" />
                {t("common.backToHome")}
            </Button>
            <div className="max-lg:w-7/8 md:w-2/3 w-full">
                <LoginForm />
            </div>
        </div>
    );
}
