import { Img, Link } from "@react-email/components";
import { themes, type Theme } from "../theme";
import { DEFAULT_APP_BASE_URL } from "../constants";
import { getHeaderFooterMessages } from "./header-footer.messages";

export interface HeaderProps {
    language?: "en-US" | "pt-BR";
    theme?: Theme;
    /** Base URL for logo and link (e.g. https://realvidas.io) */
    baseUrl?: string;
}

function normalizeTheme(theme: Theme | undefined): Theme {
    if (theme == null) return "light";
    if (String(theme).toLowerCase() === "dark") return "dark";
    return "light";
}

export function Header({
    language = "en-US",
    theme = "light",
    baseUrl = DEFAULT_APP_BASE_URL,
}: HeaderProps) {
    const t = getHeaderFooterMessages(language);
    const resolvedTheme = normalizeTheme(theme);
    const s = themes[resolvedTheme];

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
            }}
        >
            <Link href={baseUrl}>
                <Img
                    src={`${baseUrl}/logo.webp`}
                    width={42}
                    height={42}
                    alt={t.logoAlt}
                    style={{ borderRadius: "6px", display: "block" }}
                />
            </Link>
            <span
                style={{
                    fontFamily: '"Libre Baskerville", Georgia, serif',
                    fontWeight: 700,
                    fontSize: "16px",
                    color: s.styles.primaryBackground,
                }}
            >
                {t.brandName}
            </span>
        </div>
    );
}
