import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { themes, type Theme } from '../../theme';
import { DEFAULT_APP_BASE_URL } from '../../constants';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import {
    getResetPasswordMessages,
    type ResetPasswordLocale,
} from './reset-password.messages';

export type ResetPasswordTheme = Theme;

export interface ResetPasswordEmailProps {
    resetUrl: string;
    userName?: string;
    language?: ResetPasswordLocale;
    theme?: ResetPasswordTheme;
    /** Base URL for logo, footer links, and branding assets */
    baseUrl?: string;
}

const htmlLangFromLocale = (locale: ResetPasswordLocale): string => {
    return locale === 'pt-BR' ? 'pt' : 'en';
};

function normalizeTheme(theme: ResetPasswordTheme | undefined): Theme {
    if (theme == null) return 'light';
    if (String(theme).toLowerCase() === 'dark') return 'dark';
    return 'light';
}

export const ResetPasswordEmail = ({
    resetUrl,
    userName,
    language = 'en-US',
    theme = 'light',
    baseUrl = DEFAULT_APP_BASE_URL,
}: ResetPasswordEmailProps) => {
    const messages = getResetPasswordMessages(language);
    const resolvedTheme = normalizeTheme(theme);
    const s = themes[resolvedTheme];
    const safeName = userName ?? messages.defaultUserName;

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
                    <Heading style={s.heading}>{messages.heading}</Heading>
                    <Text style={s.subtext}>
                        {messages.greeting}{' '}
                        <span
                            style={{
                                color: s.styles.primaryBackground,
                                fontWeight: 600,
                            }}
                        >
                            {safeName}
                        </span>
                        , {messages.intro}
                    </Text>
                    <Section
                        style={{ padding: '27px 0 0 0', margin: '14px 0' }}
                    >
                        <Button style={s.button} href={resetUrl}>
                            {messages.button}
                        </Button>
                    </Section>
                    <Text
                        style={{
                            ...s.subtext,
                            fontSize: '13px',
                            marginTop: '24px',
                        }}
                    >
                        {messages.ignore}
                    </Text>
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
            {emailContent}
        </Html>
    );
};

ResetPasswordEmail.PreviewProps = {
    resetUrl: `${DEFAULT_APP_BASE_URL}/reset-password?token=preview`,
    userName: 'Maria',
    language: 'pt-BR',
    theme: 'light',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
