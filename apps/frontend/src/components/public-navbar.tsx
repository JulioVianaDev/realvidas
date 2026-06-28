import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export function PublicNavbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Serviços", href: "#servicos" },
        { label: "Quem somos", href: "#sobre" },
        { label: "Associe-se", href: "#planos" },
        { label: "Fale Conosco", href: "#contato" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
            <div className="container mx-auto ">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center  gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate({ to: "/" })}
                    >
                        <img
                            src="/dalia.png"
                            alt="realvidas"
                            className="w-9 h-9"
                        />
                        <span className="font-baskerville font-bold text-md text-gradient-primary">
                            realvidas
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (item.href?.startsWith("#")) {
                                        const element =
                                            document.querySelector(
                                                item.href,
                                            );
                                        element?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="text-muted-foreground cursor-pointer hover:text-primary transition-colors font-medium"
                            >
                                <h1>{item.label}</h1>
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <ModeToggle />
                        <Button
                            variant="primary"
                            onClick={() => navigate({ to: "/login" })}
                        >
                            {t("landing.nav.login")}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden justify-center items-center gap-2">
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t ">
                        <div className="flex flex-col gap-4  p-2">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (
                                            item.href?.startsWith("#")
                                        ) {
                                            const element =
                                                document.querySelector(
                                                    item.href,
                                                );
                                            element?.scrollIntoView({
                                                behavior: "smooth",
                                            });
                                        }
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-center border border-accent-accent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t">
                                <Button
                                    variant="primaryOutline"
                                    onClick={() => {
                                        navigate({ to: "/login" });
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full"
                                >
                                    {t("landing.nav.login")}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        navigate({ to: "/register" });
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full"
                                >
                                    {t("landing.nav.getStarted")}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
