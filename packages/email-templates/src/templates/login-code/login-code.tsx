import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { themes, type Theme } from "../../theme";
import { DEFAULT_APP_BASE_URL } from "../../constants";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
    getLoginCodeMessages,
    type LoginCodeLocale,
} from "./login-code.message";

export type LoginCodeTheme = Theme;

export interface LoginAuthCodeEmailProps {
    validationCode?: string;
    language?: LoginCodeLocale;
    /** CTA button link (e.g. welcome URL with token) */
    loginUrl?: string;
    /** Site origin for logo/footer assets (e.g. https://realvidas.io) */
    baseUrl?: string;
    theme?: LoginCodeTheme;
}

const htmlLangFromLocale = (locale: LoginCodeLocale): string => {
    return locale === "pt-BR" ? "pt" : "en";
};

function normalizeTheme(theme: LoginCodeTheme | undefined): Theme {
    if (theme == null) return "light";
    if (String(theme).toLowerCase() === "dark") return "dark";
    return "light";
}

export const LoginAuthCodeEmail = ({
    validationCode,
    language = "en-US",
    loginUrl = DEFAULT_APP_BASE_URL,
    baseUrl = DEFAULT_APP_BASE_URL,
    theme = "light",
}: LoginAuthCodeEmailProps) => {
    const messages = getLoginCodeMessages(language);
    const resolvedTheme = normalizeTheme(theme);
    const s = themes[resolvedTheme]; // inline-only styles, resolved at render time (Gmail-safe)

    const emailContent = (
        <>
            <Body style={s.body}>
                <Preview>{messages.preview}</Preview>
                <Container style={s.container}>
                    <Header
                        language={language}
                        theme={resolvedTheme}
                        baseUrl={baseUrl}
                    />
                    <Heading style={s.heading}>
                        {messages.heading}
                    </Heading>
                    <div style={{ margin: "14px 0" }}>
                        <code style={s.code}>{validationCode}</code>
                    </div>
                    <Text style={s.subtext}>{messages.bodyText}</Text>
                    <Section
                        style={{
                            padding: "27px 0 0 0",
                            margin: "14px 0",
                        }}
                    >
                        <Button
                            style={s.button}
                            href={loginUrl}
                        >
                            {messages.button}
                        </Button>
                    </Section>
                    <Hr style={s.hr} />
                    <Footer
                        language={language}
                        theme={resolvedTheme}
                        baseUrl={baseUrl}
                    />
                </Container>
            </Body>
        </>
    );

    return (
        <Html lang={htmlLangFromLocale(language)}>
            <Head>
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Libre+Baskerville:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            {/* Inline-only: no Tailwind. Gmail keeps inline styles. */}
            {emailContent}
        </Html>
    );
};

LoginAuthCodeEmail.PreviewProps = {
    validationCode: "tt226-5398x",
    language: "en-US",
    theme: "light",
} as LoginAuthCodeEmailProps;

export default LoginAuthCodeEmail;
