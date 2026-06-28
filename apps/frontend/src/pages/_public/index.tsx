import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Truck,
    Plane,
    HeartPulse,
    Users,
    ShieldCheck,
    GraduationCap,
    FileText,
    Flame,
    Award,
    Clock,
    Phone,
    Mail,
    MapPin,
    Send,
    CheckCircle2,
    ArrowRight,
    Activity,
    Star,
    type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_public/")({
    component: LandingPage,
});

/* ── Contact constants (realvidas.com.br) ── */
const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5512997151128";
const PHONE_MOBILE = "+5512997151128";
const PHONE_MOBILE_LABEL = "(12) 99715-1128";
const PHONE_LAND = "+551235221128";
const PHONE_LAND_LABEL = "(12) 3522-1128";
const EMAIL = "faleconosco@realvidas.com.br";

function WhatsappIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.305-1.654a12.062 12.062 0 005.683 1.448h.005c6.582 0 11.946-5.335 11.949-11.893A11.821 11.821 0 0020.52 3.449" />
        </svg>
    );
}

const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ── Hero rotating slides ── */
const SLIDES = [
    {
        eyebrow: "Remoções e Emergências 24h",
        title: "Sua vida, nossa missão.",
        body: "Emergências médicas, ambulâncias, remoção de pacientes e atendimento — agilidade e segurança a qualquer hora do dia ou da noite.",
        cta: "Solicite um orçamento",
        ctaTarget: "contato",
        grad: "var(--grad-institutional)",
    },
    {
        eyebrow: "UTI Móvel para Eventos",
        title: "Cobertura de eventos de todos os portes.",
        body: "De encontros empresariais a shows e jogos de futebol — equipe médica preparada para urgência e emergência clínica.",
        cta: "Ver planos",
        ctaTarget: "planos",
        grad: "linear-gradient(160deg, var(--orange-600) 0%, var(--blue-950) 100%)",
    },
];

const STATS = [
    { icon: Clock, value: "24h", label: "Atendimento" },
    { icon: ShieldCheck, value: "+10", label: "Anos de atuação" },
    { icon: Award, value: "6", label: "Certificações" },
    { icon: HeartPulse, value: "100%", label: "Equipe especializada" },
];

const SERVICES: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: Truck,
        title: "Transporte terrestre de pacientes",
        description:
            "Transferência segura e eficiente em ambulâncias equipadas — emergências, acidentes e remoções hospitalares.",
    },
    {
        icon: Plane,
        title: "Transporte aéreo em UTI",
        description:
            "Aeronaves com suporte avançado de vida e tripulação de médicos e enfermeiros especializados.",
    },
    {
        icon: HeartPulse,
        title: "Resgate 24 horas",
        description:
            "Atendimento de emergência médica disponível 24h por dia, todos os dias da semana.",
    },
    {
        icon: Users,
        title: "Cobertura de eventos",
        description:
            "UTI móvel e atendimento imediato por profissionais especializados em qualquer situação de urgência.",
    },
    {
        icon: ShieldCheck,
        title: "Postos médicos",
        description:
            "Montagem e gestão de ambulatórios pontuais ou permanentes para a sua empresa.",
    },
    {
        icon: GraduationCap,
        title: "Educação continuada",
        description:
            "Capacitação atualizada para técnicos, enfermeiros e médicos em saúde.",
    },
    {
        icon: FileText,
        title: "Planos de emergência",
        description:
            "Elaboração e execução de PAE com procedimentos estruturados de resposta.",
    },
    {
        icon: Flame,
        title: "Bombeiros profissionais",
        description:
            "Equipes civis para proteção de pessoas e patrimônios contra riscos de acidentes.",
    },
    {
        icon: Star,
        title: "Certificações",
        description:
            "PHTLS · ACLS · ATLS · PALS · AMLS · BLS — treinamento e atualização constante.",
    },
];

const STANDARDS = [
    "Equipe profissional e experiente",
    "Treinamentos seguindo protocolos internacionais de resgate",
    "Ambulâncias com tecnologia de última geração",
    "Normas de segurança para remoção de pacientes",
    "Certificações de atendimento ao trauma",
    "Atendimento personalizado, ágil e humanizado",
];

const PLANS = [
    {
        tier: "Bronze",
        tierClass: "bg-bronze",
        name: "Plano Bronze",
        coverage: "08 horas de cobertura",
        features: [
            "Remoções simples",
            "Enfermagem a bordo",
            "Agendamento por WhatsApp",
        ],
        featured: false,
    },
    {
        tier: "Prata",
        tierClass: "bg-prata",
        name: "Plano Prata",
        coverage: "12 horas de cobertura",
        features: [
            "Tudo do Bronze",
            "Remoção emergencial",
            "Equipe de plantão",
        ],
        featured: false,
    },
    {
        tier: "Ouro",
        tierClass: "bg-ouro",
        name: "Plano Ouro",
        coverage: "24 horas de cobertura",
        features: [
            "Tudo do Prata",
            "UTI móvel 24h",
            "Cobertura de eventos",
            "Atendimento prioritário",
        ],
        featured: true,
    },
    {
        tier: "Particular",
        tierClass: "bg-secondary",
        name: "Remoções particulares",
        coverage: "Emergência e hora marcada",
        features: [
            "Sob demanda",
            "Orçamento personalizado",
            "Pagamento em até 12x",
        ],
        featured: false,
    },
];

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
            {children}
        </span>
    );
}

function LandingPage() {
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const id = setInterval(
            () => setSlide((p) => (p + 1) % SLIDES.length),
            6000,
        );
        return () => clearInterval(id);
    }, []);

    const current = SLIDES[slide];

    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />

            {/* ── Hero ── */}
            <section
                id="inicio"
                className="relative overflow-hidden text-white transition-[background] duration-700"
                style={{ background: current.grad }}
            >
                {/* ECG heartbeat motif */}
                <svg
                    viewBox="0 0 1200 300"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
                >
                    <path
                        d="M0 160 H360 L410 60 L470 250 L520 120 L560 160 H1200"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                    />
                </svg>

                <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div
                        key={slide}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                            </span>
                            {current.eyebrow}
                        </span>

                        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
                            {current.title}
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
                            {current.body}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                size="lg"
                                className="bg-orange-500 text-white shadow-brand hover:bg-orange-600"
                                onClick={() => scrollToId(current.ctaTarget)}
                            >
                                <WhatsappIcon className="size-5" />
                                {current.cta}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                onClick={() => scrollToId("servicos")}
                            >
                                Nossos serviços
                                <ArrowRight className="size-4" />
                            </Button>
                        </div>

                        {/* slide dots */}
                        <div className="mt-8 flex gap-2">
                            {SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    aria-label={`Slide ${idx + 1}`}
                                    onClick={() => setSlide(idx)}
                                    className="h-2.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: idx === slide ? 28 : 10,
                                        background:
                                            idx === slide
                                                ? "#fff"
                                                : "rgba(255,255,255,0.45)",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* glass placeholder */}
                    <div className="hidden aspect-[4/3] flex-col items-center justify-center gap-3 rounded-3xl border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm lg:flex">
                        <Truck className="size-16" />
                        <span className="font-display text-sm font-semibold uppercase tracking-wide">
                            Foto da frota / equipe
                        </span>
                        <span className="text-xs opacity-70">
                            Atendimento 24 horas em Pindamonhangaba e região
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <section className="border-y bg-muted/40">
                <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                                className="flex flex-col items-center text-center"
                            >
                                <Icon className="mb-2 size-7 text-orange-500" />
                                <div className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── Services ── */}
            <section
                id="servicos"
                className="py-20 md:py-28"
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        {...reveal}
                        className="mx-auto mb-14 max-w-2xl text-center"
                    >
                        <Eyebrow>O que fazemos</Eyebrow>
                        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                            Serviços de emergência e remoção
                        </h2>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Estrutura completa para urgência e emergência médica,
                            com equipe treinada e equipamentos de última geração.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {SERVICES.map((service, i) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.title}
                                    {...reveal}
                                    transition={{ delay: (i % 3) * 0.08 }}
                                >
                                    <Card className="group h-full border-t-4 border-t-orange-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <CardHeader>
                                            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                                                <Icon className="size-6" />
                                            </div>
                                            <CardTitle className="font-display text-lg">
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {service.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── About ── */}
            <section
                id="sobre"
                className="bg-muted/40 py-20 md:py-28"
            >
                <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-3xl shadow-lg"
                        style={{ background: "var(--grad-institutional)" }}
                    >
                        <div className="flex flex-col items-center gap-2 text-white/80">
                            <Users className="size-14" />
                            <span className="font-display text-sm uppercase tracking-wide">
                                Foto da equipe
                            </span>
                        </div>
                        <div className="absolute inset-x-5 bottom-5 flex justify-around rounded-2xl bg-white/95 p-4 shadow-md">
                            {[
                                { v: "24h", l: "Atendimento" },
                                { v: "+10", l: "Anos" },
                                { v: "6", l: "Certificações" },
                            ].map((s) => (
                                <div
                                    key={s.l}
                                    className="text-center"
                                >
                                    <div className="font-display text-xl font-extrabold text-orange-600">
                                        {s.v}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div {...reveal}>
                        <Eyebrow>Quem somos</Eyebrow>
                        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                            Oriunda da consultoria e do treinamento em saúde
                        </h2>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            A Real Vidas foi criada para prestar serviços de
                            altíssima qualidade no atendimento e remoção de
                            pacientes de urgência e emergência — com equipe
                            treinada constantemente e técnicas atualizadas de
                            resgate.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {STANDARDS.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-2"
                                >
                                    <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-success" />
                                    <span className="text-sm text-foreground">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Plans / Associe-se ── */}
            <section
                id="planos"
                className="py-20 md:py-28"
            >
                <div className="container mx-auto px-4">
                    <motion.div
                        {...reveal}
                        className="mx-auto mb-14 max-w-2xl text-center"
                    >
                        <Eyebrow>Associe-se</Eyebrow>
                        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                            Planos que se adaptam à sua necessidade
                        </h2>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Modelos de serviço e atendimento para diferentes
                            aplicações. Conheça os detalhes e fale com a gente.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {PLANS.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                {...reveal}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Card
                                    className={`relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                        plan.featured
                                            ? "border-2 border-orange-500 shadow-lg"
                                            : ""
                                    }`}
                                >
                                    {plan.featured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-orange-500 px-3 py-1 text-white">
                                                Mais procurado
                                            </Badge>
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <span
                                            className={`mx-auto mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${plan.tierClass}`}
                                        >
                                            {plan.tier}
                                        </span>
                                        <CardTitle className="font-display text-xl">
                                            {plan.name}
                                        </CardTitle>
                                        <CardDescription className="font-semibold text-foreground">
                                            {plan.coverage}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-success" />
                                                    <span className="text-muted-foreground">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            variant={
                                                plan.featured
                                                    ? "primary"
                                                    : "primaryOutline"
                                            }
                                            onClick={() =>
                                                scrollToId("contato")
                                            }
                                        >
                                            Conheça em detalhes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Quote form / Fale conosco ── */}
            <section
                id="contato"
                className="bg-muted/40 py-20 md:py-28"
            >
                <div className="container mx-auto max-w-4xl px-4">
                    <motion.div
                        {...reveal}
                        className="mx-auto mb-10 max-w-xl text-center"
                    >
                        <Eyebrow>Fale conosco</Eyebrow>
                        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                            Solicite seu orçamento
                        </h2>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Para remoções, preencha os dados abaixo. Para outros
                            serviços, fale com a gente pelo WhatsApp.
                        </p>
                    </motion.div>

                    <motion.div {...reveal}>
                        <Card className="shadow-md">
                            <CardContent className="pt-6">
                                <QuoteForm />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* ── Emergency CTA band ── */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="overflow-hidden rounded-3xl p-10 text-center text-white shadow-brand md:p-16"
                        style={{ background: "var(--grad-emergency)" }}
                    >
                        <h2 className="font-display text-2xl font-extrabold md:text-4xl">
                            Pensou em Remoções ou Emergências?
                        </h2>
                        <p className="mt-3 text-lg text-white/90">
                            Fale com a Real Vidas — atendimento 24 horas, todos os
                            dias.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button
                                size="lg"
                                asChild
                                className="bg-white text-orange-600 hover:bg-white/90"
                            >
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <WhatsappIcon className="size-5" />
                                    Falar no WhatsApp
                                </a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                <a href={`tel:${PHONE_MOBILE}`}>
                                    <Phone className="size-5" />
                                    {PHONE_MOBILE_LABEL}
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer
                className="text-white"
                style={{ background: "var(--blue-700)" }}
            >
                <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
                    <div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/dalia.png"
                                alt="Real Vidas"
                                className="size-9"
                            />
                            <span className="font-display text-lg font-bold">
                                Real Vidas
                            </span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
                            Serviços de altíssima qualidade no atendimento e
                            remoção de pacientes de urgência e emergência.
                        </p>
                        <p className="mt-4 font-display text-sm font-semibold italic text-white/90">
                            Sua vida, nossa missão.
                        </p>
                    </div>

                    <div>
                        <div className="mb-4 font-display text-sm font-bold uppercase tracking-wider">
                            Navegação
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-white/80">
                            {[
                                ["inicio", "Início"],
                                ["servicos", "Serviços"],
                                ["sobre", "Quem somos"],
                                ["planos", "Associe-se"],
                                ["contato", "Fale Conosco"],
                            ].map(([id, label]) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToId(id)}
                                    className="text-left transition-colors hover:text-white"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 font-display text-sm font-bold uppercase tracking-wider">
                            Contato
                        </div>
                        <div className="flex flex-col gap-3 text-sm text-white/80">
                            <a
                                href={`tel:${PHONE_MOBILE}`}
                                className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-white/90"
                            >
                                <Phone className="size-4" />
                                {PHONE_MOBILE_LABEL}
                            </a>
                            <a
                                href={`tel:${PHONE_LAND}`}
                                className="inline-flex items-center gap-2 transition-colors hover:text-white"
                            >
                                <Phone className="size-4" />
                                {PHONE_LAND_LABEL}
                            </a>
                            <a
                                href={`mailto:${EMAIL}`}
                                className="inline-flex items-center gap-2 transition-colors hover:text-white"
                            >
                                <Mail className="size-4" />
                                {EMAIL}
                            </a>
                            <span className="inline-flex items-center gap-2">
                                <MapPin className="size-4" />
                                Pindamonhangaba · SP
                            </span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/15">
                    <div className="container mx-auto flex flex-wrap justify-between gap-2 px-4 py-4 text-xs text-white/60">
                        <span>
                            © 2026 Real Vidas · Remoções e Emergências 24h
                        </span>
                        <span>Atendimento 24 horas · Vale do Paraíba</span>
                    </div>
                </div>
            </footer>

            {/* ── Floating actions ── */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
                <a
                    href={`tel:${PHONE_MOBILE}`}
                    aria-label="Ligar"
                    className="flex size-13 items-center justify-center rounded-full bg-orange-500 text-white shadow-brand transition-transform hover:scale-105"
                >
                    <Phone className="size-5" />
                </a>
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="relative flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
                    style={{ background: "#25D366" }}
                >
                    <span
                        className="absolute inset-0 animate-ping rounded-full"
                        style={{ background: "#25D366", opacity: 0.6 }}
                    />
                    <WhatsappIcon className="relative size-7" />
                </a>
            </div>
        </div>
    );
}

type FormState = {
    nome: string;
    email: string;
    tel: string;
    cidadeOrigem: string;
    cidadeDestino: string;
    data: string;
    hora: string;
    obs: string;
};

const EMPTY_FORM: FormState = {
    nome: "",
    email: "",
    tel: "",
    cidadeOrigem: "",
    cidadeDestino: "",
    data: "",
    hora: "",
    obs: "",
};

const REQUIRED_FIELDS: (keyof FormState)[] = [
    "nome",
    "email",
    "tel",
    "cidadeOrigem",
    "cidadeDestino",
];

function QuoteForm() {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>(
        {},
    );
    const [sent, setSent] = useState(false);

    const update =
        (key: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nextErrors: Partial<Record<keyof FormState, boolean>> = {};
        REQUIRED_FIELDS.forEach((key) => {
            if (!form[key].trim()) nextErrors[key] = true;
        });
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length === 0) {
            setSent(true);
            setForm(EMPTY_FORM);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
        >
            {sent && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-success-text">
                    <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-success" />
                    <div>
                        <p className="font-display font-semibold">
                            Orçamento enviado!
                        </p>
                        <p className="text-sm">
                            Recebemos sua solicitação. Nossa equipe retornará em
                            instantes pelo telefone ou WhatsApp informado.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <Field
                    label="Seu nome"
                    htmlFor="q-nome"
                    error={errors.nome}
                >
                    <Input
                        id="q-nome"
                        value={form.nome}
                        onChange={update("nome")}
                        placeholder="Nome completo"
                    />
                </Field>
                <Field
                    label="E-mail"
                    htmlFor="q-email"
                    error={errors.email}
                >
                    <Input
                        id="q-email"
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="voce@email.com"
                    />
                </Field>
                <Field
                    label="Telefone / Celular"
                    htmlFor="q-tel"
                    error={errors.tel}
                >
                    <Input
                        id="q-tel"
                        value={form.tel}
                        onChange={update("tel")}
                        placeholder="(12) 99715-1128"
                    />
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field
                    label="Cidade de origem"
                    htmlFor="q-origem"
                    error={errors.cidadeOrigem}
                >
                    <Input
                        id="q-origem"
                        value={form.cidadeOrigem}
                        onChange={update("cidadeOrigem")}
                        placeholder="Pindamonhangaba"
                    />
                </Field>
                <Field
                    label="Cidade de destino"
                    htmlFor="q-destino"
                    error={errors.cidadeDestino}
                >
                    <Input
                        id="q-destino"
                        value={form.cidadeDestino}
                        onChange={update("cidadeDestino")}
                        placeholder="São José dos Campos"
                    />
                </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Field
                    label="Data para remoção"
                    htmlFor="q-data"
                >
                    <Input
                        id="q-data"
                        type="date"
                        value={form.data}
                        onChange={update("data")}
                    />
                </Field>
                <Field
                    label="Hora"
                    htmlFor="q-hora"
                >
                    <Input
                        id="q-hora"
                        type="time"
                        value={form.hora}
                        onChange={update("hora")}
                    />
                </Field>
            </div>

            <Field
                label="Observações extras"
                htmlFor="q-obs"
            >
                <Textarea
                    id="q-obs"
                    rows={3}
                    value={form.obs}
                    onChange={update("obs")}
                    placeholder="Condição do paciente, necessidade de UTI, acompanhantes…"
                />
            </Field>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="q-authorize"
                    defaultChecked
                />
                <Label
                    htmlFor="q-authorize"
                    className="text-sm font-normal text-muted-foreground"
                >
                    Autorizo o contato pelo WhatsApp informado.
                </Label>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                >
                    <Send className="size-4" />
                    Enviar solicitação
                </Button>
                <Button
                    type="button"
                    size="lg"
                    asChild
                    className="bg-[#25D366] text-white hover:bg-[#1ebe5b]"
                >
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <WhatsappIcon className="size-5" />
                        Falar no WhatsApp
                    </a>
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    htmlFor,
    error,
    children,
}: {
    label: string;
    htmlFor: string;
    error?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {error && (
                <span className="text-xs text-destructive">
                    Campo obrigatório
                </span>
            )}
        </div>
    );
}
