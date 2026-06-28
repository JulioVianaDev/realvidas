import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useUserStore } from "@/zustand/user.store";
import { usePatchMyUiPreferencesMutation } from "@/hooks/query/user/user.query";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const userAuth = useUserStore((s) => s.userAuth);
    const patchUiPreferences = usePatchMyUiPreferencesMutation();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const root = document.documentElement;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const nextTheme = theme === "dark" ? "light" : "dark";

        const applyTheme = () => {
            setTheme(nextTheme);
            if (userAuth?.token) {
                patchUiPreferences.mutate({ theme: nextTheme });
            }
        };

        if (typeof (document as any).startViewTransition !== "function" || prefersReducedMotion) {
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

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className="w-9 h-9 hover:bg-primary/10"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-secondary" />
            ) : (
                <Moon className="h-4 w-4 text-primary" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
