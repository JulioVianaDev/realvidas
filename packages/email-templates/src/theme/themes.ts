import type { CSSProperties } from "react";
import { emailColors } from "./colors";

const fontSans = '"Poppins", Arial, sans-serif';
const fontSerif = '"Libre Baskerville", Georgia, serif';

/** Inline-only styles for Gmail/compatibility. No Tailwind classes. */
type InlineStyles = {
    body: CSSProperties;
    container: CSSProperties;
    heading: CSSProperties;
    button: CSSProperties;
    text: CSSProperties;
    subtext: CSSProperties;
    code: CSSProperties;
    hr: CSSProperties;
    link: CSSProperties;
};

function makeTheme(isDark: boolean): InlineStyles {
    const bg = isDark ? emailColors.dark.background : emailColors.background;
    const fg = isDark ? emailColors.dark.foreground : emailColors.foreground;
    const muted = isDark ? emailColors.dark.muted : emailColors.muted;
    const mutedFg = isDark ? emailColors.dark["muted-foreground"] : emailColors["muted-foreground"];
    const primary = isDark ? emailColors.dark.primary : emailColors.primary;
    const primaryFg = isDark ? emailColors.dark["primary-foreground"] : emailColors["primary-foreground"];
    const border = isDark ? emailColors.dark.border : emailColors.border;

    return {
        body: {
            backgroundColor: bg,
            color: fg,
            fontFamily: fontSans,
            fontSize: "14px",
            lineHeight: 1.5,
            margin: 0,
            padding: "24px 16px",
        },
        container: {
            maxWidth: "560px",
            margin: "0 auto",
            padding: "0 0 48px 0",
        },
        heading: {
            color: fg,
            fontFamily: fontSerif,
            fontSize: "24px",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: "17px 0 0 0",
            padding: 0,
        },
        button: {
            backgroundColor: primary,
            color: primaryFg,
            display: "inline-block",
            fontFamily: fontSans,
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: 1.5,
            padding: "11px 23px",
            textDecoration: "none",
            borderRadius: "6px",
        },
        text: {
            color: fg,
            fontFamily: fontSans,
            fontSize: "15px",
            lineHeight: 1.4,
            margin: "0 0 15px 0",
        },
        subtext: {
            color: mutedFg,
            fontFamily: fontSans,
            fontSize: "15px",
            lineHeight: 1.4,
            margin: "0 0 15px 0",
        },
        code: {
            backgroundColor: muted,
            color: fg,
            fontFamily: "monospace",
            fontSize: "21px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            padding: "2px 4px",
            borderRadius: "4px",
        },
        hr: {
            border: "none",
            borderTop: `1px solid ${border}`,
            margin: "42px 0 26px 0",
        },
        link: {
            color: mutedFg,
            fontFamily: fontSans,
            fontSize: "14px",
            textDecoration: "none",
        },
    };
}

/**
 * Theme tokens: inline styles only (no classes).
 * Resolved at render time. Gmail-safe.
 */
export const themes = {
    light: {
        ...makeTheme(false),
        /** Extra tokens for elements that need a single color value */
        styles: {
            primaryBackground: emailColors.primary,
            primaryColor: emailColors["primary-foreground"],
        },
    },
    dark: {
        ...makeTheme(true),
        styles: {
            primaryBackground: emailColors.dark.primary,
            primaryColor: emailColors.dark["primary-foreground"],
        },
    },
} as const;

export type Theme = keyof typeof themes;
export type ThemeTokens = (typeof themes)[Theme];
