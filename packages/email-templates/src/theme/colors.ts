/**
 * Email design tokens — hex equivalents of apps/frontend/src/index.css :root palette.
 * Email clients don't support CSS variables or oklch(), so we use literal hex values
 * that match the frontend for consistent branding.
 */
export const emailColors = {
    /* ── Core palette (light theme for emails) ── */
    background: "#f7f5f2",
    foreground: "#212121",
    card: "#f7f5f2",
    "card-foreground": "#2d2d3a",
    popover: "#f7f5f2",
    "popover-foreground": "#212121",

    primary: "#8f3224",
    "primary-foreground": "#ffffff",
    "primary-light": "#e24d36",

    secondary: "#edbe5e",
    "secondary-foreground": "#7a541f",

    muted: "#ebe6e1",
    "muted-foreground": "#756957",

    accent: "#f4d372",
    "accent-foreground": "#7a2b1f",

    destructive: "#ad321f",
    "destructive-foreground": "#ffffff",

    border: "#e4dbcd",
    input: "#e4dbcd",
    ring: "#8f3224",

    /* ── Semantic ── */
    success: "#2da873",
    info: "#3b7ddb",
    warning: "#d4a02a",
    "secondary-warm": "#d4b55e",
    "accent-gold": "#e8d46a",

    /* ── Dark palette (for .dark wrapper in preview) ── */
    dark: {
        background: "#251e18",
        foreground: "#f4f3f1",
        muted: "#302821",
        "muted-foreground": "#c9c1b6",
        border: "#52473d",
        primary: "#df3920",
        "primary-foreground": "#f7f5f2",
    },
} as const;

export type EmailColorKey = keyof typeof emailColors;
