import { emailColors, emailFonts } from "./theme";

/** Tailwind config for @react-email — uses theme tokens (hex) so emails match frontend. */
const tailwindConfig = {
    important: false,
    prefix: "",
    separator: ":",
    safelist: [],
    blocklist: [],
    presets: [],
    future: {},
    experimental: {},
    darkMode: ["class"],
    corePlugins: [],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: emailColors.border,
                input: emailColors.input,
                ring: emailColors.ring,
                background: emailColors.background,
                foreground: emailColors.foreground,
                primary: {
                    DEFAULT: emailColors.primary,
                    foreground: emailColors["primary-foreground"],
                    light: emailColors["primary-light"],
                },
                secondary: {
                    DEFAULT: emailColors.secondary,
                    foreground: emailColors["secondary-foreground"],
                    warm: emailColors["secondary-warm"],
                },
                destructive: {
                    DEFAULT: emailColors.destructive,
                    foreground: emailColors["destructive-foreground"],
                },
                muted: {
                    DEFAULT: emailColors.muted,
                    foreground: emailColors["muted-foreground"],
                },
                accent: {
                    DEFAULT: emailColors.accent,
                    foreground: emailColors["accent-foreground"],
                    gold: emailColors["accent-gold"],
                },
                popover: {
                    DEFAULT: emailColors.popover,
                    foreground: emailColors["popover-foreground"],
                },
                card: {
                    DEFAULT: emailColors.card,
                    foreground: emailColors["card-foreground"],
                },
                success: emailColors.success,
                info: emailColors.info,
                warning: emailColors.warning,
                /* Dark theme (for .dark wrapper in preview) */
                "dark-background": emailColors.dark.background,
                "dark-foreground": emailColors.dark.foreground,
                "dark-muted": emailColors.dark.muted,
                "dark-muted-foreground": emailColors.dark["muted-foreground"],
                "dark-border": emailColors.dark.border,
                "dark-primary": emailColors.dark.primary,
                "dark-primary-foreground": emailColors.dark["primary-foreground"],
            },
            fontFamily: {
                sans: [emailFonts.sans],
                serif: [emailFonts.serif],
            },
            borderRadius: {
                lg: "0.375rem",
                md: "0.25rem",
                sm: "0.125rem",
            },
        },
    },
    plugins: [],
};

export default tailwindConfig;
