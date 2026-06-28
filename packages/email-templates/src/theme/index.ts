export { emailColors, type EmailColorKey } from "./colors";
export { themes, type Theme, type ThemeTokens } from "./themes";

/** Font stack matching frontend index.css — Poppins, Libre Baskerville */
export const emailFonts = {
    sans: '"Poppins", Inter, system-ui, sans-serif',
    serif: '"Libre Baskerville", Georgia, serif',
} as const;
