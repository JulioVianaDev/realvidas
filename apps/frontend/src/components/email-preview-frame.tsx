import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type EmailPreviewFrameProps = {
    renderKey: string;
    renderHtml: () => string | Promise<string>;
    title?: string;
    className?: string;
    minHeight?: number;
};

export function EmailPreviewFrame({
    renderKey,
    renderHtml,
    title = "Email preview",
    className,
    minHeight = 640,
}: EmailPreviewFrameProps) {
    const [html, setHtml] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setHtml(null);
        setError(null);

        Promise.resolve(renderHtml())
            .then((next) => {
                if (!cancelled) setHtml(next);
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to render email preview",
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, [renderKey, renderHtml]);

    if (error) {
        return (
            <p className="text-sm text-destructive">{error}</p>
        );
    }

    return (
        <iframe
            title={title}
            srcDoc={html ?? undefined}
            className={cn("w-full border-0 bg-white", className)}
            style={{ minHeight }}
            sandbox="allow-same-origin allow-scripts"
        />
    );
}
