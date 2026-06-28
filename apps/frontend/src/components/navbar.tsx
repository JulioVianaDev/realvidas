/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lJwnQlHSEBA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import type { MouseEvent as ReactMouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUserStore } from "@/zustand/user.store";
import { useTheme } from "next-themes";
import {
    BadgeCheck,
    Bell,
    CreditCard,
    LogOut,
    Sparkles,
    ChevronDown,
    Moon,
    Sun,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/contexts/TranslationsContext";
import { usePatchMyUiPreferencesMutation } from "@/hooks/query/user/user.query";

export default function Navbar() {
    const { t } = useTranslation();
    const { userAuth, setUserAuth, user } = useUserStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const patchUiPreferences = usePatchMyUiPreferencesMutation();

    useEffect(() => {
        function handleClickOutside(event: Event) {
            const target = event.target as Node;
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, []);

    if (!userAuth) return null;

    const handleThemeToggle = (
        event: ReactMouseEvent<HTMLDivElement>,
    ) => {
        const root = document.documentElement;
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const nextTheme = theme === "dark" ? "light" : "dark";

        const applyTheme = () => {
            setTheme(nextTheme);
            patchUiPreferences.mutate({ theme: nextTheme });
        };

        if (
            typeof (document as any).startViewTransition !==
                "function" ||
            prefersReducedMotion
        ) {
            applyTheme();
            return;
        }

        const { clientX, clientY } = event;
        root.style.setProperty("--x", `${clientX}px`);
        root.style.setProperty("--y", `${clientY}px`);

        (document as any).startViewTransition(() => {
            applyTheme();
        });
    };

    // User display data with fallbacks
    const displayName = user?.name || "Test User";
    const displayEmail = user?.email || "test@example.com";
    const displayImage = user?.imageUrl || "";
    const userInitials = displayName.substring(0, 2).toUpperCase();
    const handleLogout = () => {
        console.log("Logout clicked");
        setUserAuth(null);
        navigate({ to: "/login" });
    };
    return (
        <header
            className={`sticky top-0 z-4 flex justify-between h-24 w-full items-center px-4 md:px-6 border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary`}
        >
            <div
                className="flex  items-center  gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate({ to: "/" })}
            >
                <img
                    src="/logo2.webp"
                    alt="realvidas"
                    className="w-90 h-20"
                />
            </div>
            <div className="flex items-center">
                <div className="flex items-center gap-4">
                    <div
                        className="relative"
                        ref={dropdownRef}
                    >
                        <Button
                            variant="ghost"
                            className="flex hover:bg-pink-200 dark:hover:bg-secondary-foreground/10 dark:hover:text-white items-center gap-3 h-auto p-2 "
                            onClick={() =>
                                setIsDropdownOpen(!isDropdownOpen)
                            }
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={displayImage}
                                    alt={displayName}
                                />
                                <AvatarFallback>
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm font-medium truncate max-w-32">
                                    {displayName}
                                </span>
                                <span className="text-xs text-muted-foreground truncate max-w-32">
                                    {displayEmail}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-background border rounded-md shadow-lg z-50">
                                <div className="p-0 font-normal">
                                    <div className="flex items-center gap-3 px-2 py-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={displayImage}
                                                alt={displayName}
                                            />
                                            <AvatarFallback>
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">
                                                {displayName}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {displayEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <div
                                        className="cursor-pointer flex items-center p-2 hover:bg-muted"
                                        onClick={() =>
                                            console.log(
                                                "Account clicked",
                                            )
                                        }
                                    >
                                        <BadgeCheck className="mr-2 h-4 w-4" />
                                        {t("navbar.accountSettings")}
                                    </div>

                                    <div
                                        className="cursor-pointer flex items-center p-2 hover:bg-muted"
                                        onClick={() =>
                                            console.log(
                                                "Notifications clicked",
                                            )
                                        }
                                    >
                                        <Bell className="mr-2 h-4 w-4" />
                                        {t("navbar.notifications")}
                                    </div>

                                    <div
                                        className="cursor-pointer flex items-center p-2 hover:bg-muted"
                                        onClick={() =>
                                            console.log(
                                                "Billing clicked",
                                            )
                                        }
                                    >
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {t("navbar.billing")}
                                    </div>

                                    <div
                                        className="cursor-pointer flex items-center p-2 hover:bg-muted"
                                        onClick={() =>
                                            console.log(
                                                "Upgrade clicked",
                                            )
                                        }
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {t("navbar.upgradeToPro")}
                                    </div>
                                </div>
                                <hr />
                                <div
                                    className="cursor-pointer flex items-center p-2 hover:bg-muted"
                                    onClick={handleThemeToggle}
                                >
                                    {theme === "dark" ? (
                                        <Sun className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Moon className="mr-2 h-4 w-4" />
                                    )}
                                    {theme === "dark"
                                        ? t("navbar.lightMode")
                                        : t("navbar.darkMode")}
                                </div>
                                <hr />
                                <div
                                    className="cursor-pointer flex items-center p-2 text-destructive hover:bg-destructive/10"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t("navbar.logout")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
