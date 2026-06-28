import { Column, Img, Link, Row, Section, Text } from "@react-email/components";
import { themes, type Theme } from "../theme";
import { DEFAULT_APP_BASE_URL } from "../constants";
import { getHeaderFooterMessages } from "./header-footer.messages";

export interface FooterProps {
    language?: "en-US" | "pt-BR";
    theme?: Theme;
    /** Base URL for logo and social links */
    baseUrl?: string;
    /** Optional: social icon URLs (e.g. twitter, facebook, linkedin). If not provided, uses baseUrl for placeholder. */
    socialLinks?: { href: string; imgSrc: string; alt: string }[];
}

function normalizeTheme(theme: Theme | undefined): Theme {
    if (theme == null) return "light";
    if (String(theme).toLowerCase() === "dark") return "dark";
    return "light";
}

export function Footer({
    language = "en-US",
    theme = "light",
    baseUrl = DEFAULT_APP_BASE_URL,
    socialLinks,
}: FooterProps) {
    const t = getHeaderFooterMessages(language);
    const resolvedTheme = normalizeTheme(theme);
    const s = themes[resolvedTheme];

    const defaultSocial = [
        { href: baseUrl, imgSrc: `${baseUrl}/dalia.png`, alt: t.logoAlt },
        { href: baseUrl, imgSrc: `${baseUrl}/dalia.png`, alt: t.logoAlt },
        { href: baseUrl, imgSrc: `${baseUrl}/dalia.png`, alt: t.logoAlt },
    ];
    const links = socialLinks ?? defaultSocial;

    return (
        <>
            <Section style={{ marginBottom: "32px", padding: "0 8px" }}>
                <Row>
                    <Column
                        style={{
                            width: "10%",
                            verticalAlign: "middle",
                        }}
                    >
                        <Img
                            src={`${baseUrl}/dalia.png`}
                            width={42}
                            height={42}
                            alt={t.logoAlt}
                            style={{
                                borderRadius: "6px",
                                display: "block",
                            }}
                        />
                    </Column>
                    <Column
                        style={{
                            width: "56%",
                            verticalAlign: "middle",
                            paddingLeft: "8px",
                        }}
                    >
                        <Text
                            style={{
                                margin: 0,
                                fontFamily: '"Libre Baskerville", Georgia, serif',
                                fontWeight: 700,
                                fontSize: "16px",
                                color: s.styles.primaryBackground,
                            }}
                        >
                            {t.brandName}
                        </Text>
                    </Column>
                    {links.map((item, i) => (
                        <Column
                            key={i}
                            style={{
                                width: i < links.length - 1 ? "11%" : "12%",
                                textAlign: "right",
                                verticalAlign: "middle",
                            }}
                        >
                            <Link href={item.href}>
                                <Img
                                    src={item.imgSrc}
                                    width={32}
                                    height={32}
                                    alt={item.alt}
                                    style={{
                                        borderRadius: "6px",
                                        display: "block",
                                        marginLeft: "auto",
                                    }}
                                />
                            </Link>
                        </Column>
                    ))}
                </Row>
            </Section>

            <Section>
                <Link
                    href={`${baseUrl}/blog`}
                    style={{ ...s.link, textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.blog}
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    href={`${baseUrl}/policies`}
                    style={{ ...s.link, textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.policies}
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    href={`${baseUrl}/help`}
                    style={{ ...s.link, textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.helpCenter}
                </Link>
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link
                    href={`${baseUrl}/community`}
                    style={{ ...s.link, textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.community}
                </Link>
                <Text
                    style={{
                        ...s.subtext,
                        fontSize: "12px",
                        lineHeight: "15px",
                        textAlign: "left",
                        marginTop: "8px",
                        marginBottom: "50px",
                    }}
                >
                    © {new Date().getFullYear()} {t.companyName}. <br />
                    {t.address} <br />
                    <br />
                    {t.rightsReserved}
                </Text>
            </Section>
        </>
    );
}
