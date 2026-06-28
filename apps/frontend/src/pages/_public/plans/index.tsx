import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/TranslationsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Users, Bot, Share2, Zap, Database, Sparkles, Shield, BarChart3, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/public-navbar";

export const Route = createFileRoute("/_public/plans/")({
  component: RouteComponent,
});

function RouteComponent() {
    const { t, language } = useTranslation();

    const plans = [
        {
            id: "starter",
            name: t("plans.tiers.starter.name"),
            description: t("plans.tiers.starter.description"),
            price: t("plans.tiers.starter.price"),
            period: t("plans.tiers.starter.period"),
            popular: false,
            features: [
                { icon: Calendar, value: "1", label: t("plans.features.calendars") },
                { icon: Users, value: "1", label: t("plans.features.users") },
                { icon: Bot, value: "1", label: t("plans.features.aiAgents") },
                { icon: Share2, value: "1", label: t("plans.features.socialNetworks") },
                { icon: Zap, value: "2,500", label: t("plans.features.credits") },
                { icon: Database, value: "1GB", label: t("plans.features.storage") },
            ],
        },
        {
            id: "professional",
            name: t("plans.tiers.professional.name"),
            description: t("plans.tiers.professional.description"),
            price: t("plans.tiers.professional.price"),
            period: t("plans.tiers.professional.period"),
            popular: true,
            features: [
                { icon: Calendar, value: "5", label: t("plans.features.calendars_plural") },
                { icon: Users, value: "5", label: t("plans.features.users_plural") },
                { icon: Bot, value: "3", label: t("plans.features.aiAgents_plural") },
                { icon: Share2, value: "4", label: t("plans.features.socialNetworks_plural") },
                { icon: Zap, value: "6,000", label: t("plans.features.credits") },
                { icon: Database, value: "5GB", label: t("plans.features.storage") },
            ],
        },
        {
            id: "business",
            name: t("plans.tiers.business.name"),
            description: t("plans.tiers.business.description"),
            price: t("plans.tiers.business.price"),
            period: t("plans.tiers.business.period"),
            popular: false,
            features: [
                { icon: Calendar, value: "10", label: t("plans.features.calendars_plural") },
                { icon: Users, value: "15", label: t("plans.features.users_plural") },
                { icon: Bot, value: "7", label: t("plans.features.aiAgents_plural") },
                { icon: Share2, value: "10", label: t("plans.features.socialNetworks_plural") },
                { icon: Zap, value: "10,000", label: t("plans.features.credits") },
                { icon: Database, value: "10GB", label: t("plans.features.storage") },
            ],
        },
        {
            id: "custom",
            name: t("plans.tiers.custom.name"),
            description: t("plans.tiers.custom.description"),
            price: t("plans.tiers.custom.price"),
            period: t("plans.tiers.custom.period"),
            popular: false,
            enterprise: true,
            features: [
                { icon: Calendar, value: "∞", label: t("plans.features.calendars_plural") },
                { icon: Users, value: "∞", label: t("plans.features.users_plural") },
                { icon: Bot, value: "∞", label: t("plans.features.aiAgents_plural") },
                { icon: Share2, value: "∞", label: t("plans.features.socialNetworks_plural") },
                { icon: Zap, value: "∞", label: t("plans.features.credits") },
                { icon: Database, value: "∞", label: t("plans.features.storage") },
            ],
        },
    ];

    const benefits = [
        {
            icon: Sparkles,
            title: t("plans.benefits.feature1.title"),
            description: t("plans.benefits.feature1.description"),
        },
        {
            icon: Users,
            title: t("plans.benefits.feature2.title"),
            description: t("plans.benefits.feature2.description"),
        },
        {
            icon: Share2,
            title: t("plans.benefits.feature3.title"),
            description: t("plans.benefits.feature3.description"),
        },
        {
            icon: BarChart3,
            title: t("plans.benefits.feature4.title"),
            description: t("plans.benefits.feature4.description"),
        },
        {
            icon: Shield,
            title: t("plans.benefits.feature5.title"),
            description: t("plans.benefits.feature5.description"),
        },
        {
            icon: Headphones,
            title: t("plans.benefits.feature6.title"),
            description: t("plans.benefits.feature6.description"),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            <PublicNavbar />
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge className="mb-4 px-4 py-1 text-sm" variant="secondary">
                        {t("plans.hero.description")}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {t("plans.hero.title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        {t("plans.hero.subtitle")}
                    </p>
                </motion.div>
            </section>

            {/* Pricing Cards */}
            <section className="container mx-auto px-4 pb-20">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {plans.map((plan) => (
                        <motion.div key={plan.id} variants={itemVariants}>
                            <Card
                                className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                                    plan.popular
                                        ? "border-primary border-2 shadow-lg"
                                        : "border-border"
                                } ${plan.enterprise ? "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-primary/10" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                            {t("plans.cta.popular")}
                                        </Badge>
                                    </div>
                                )}
                                {plan.enterprise && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                                            {t("plans.cta.enterprise")}
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="text-center pb-8 pt-6">
                                    <CardTitle className="text-2xl mb-2">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {plan.description}
                                    </CardDescription>
                                    <div className="mt-6">
                                        <div className="flex items-baseline justify-center gap-1">
                                            {!plan.enterprise && (
                                                <span className="text-2xl font-semibold">
                                                    R$
                                                </span>
                                            )}
                                            <span
                                                className={`font-bold ${plan.enterprise ? "text-3xl" : "text-5xl"}`}
                                            >
                                                {plan.price}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {plan.period}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            return (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-semibold text-foreground">
                                                            {feature.value}
                                                        </span>
                                                        <span className="text-muted-foreground ml-2 text-sm">
                                                            {feature.label}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                                <CardFooter className="pt-6">
                                    <Button
                                        className={`w-full ${
                                            plan.popular
                                                ? "bg-primary hover:bg-primary/90"
                                                : plan.enterprise
                                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                  : ""
                                        }`}
                                        size="lg"
                                        variant={
                                            plan.popular || plan.enterprise
                                                ? "default"
                                                : "outline"
                                        }
                                    >
                                        {plan.enterprise
                                            ? t("plans.cta.contactSales")
                                            : t("plans.cta.getStarted")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("plans.benefits.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("plans.benefits.subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors"
                            >
                                <div className="mb-4 p-3 rounded-full bg-primary/10">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("plans.faq.title")}
                    </h2>
                </motion.div>

                <motion.div
                    className="max-w-3xl mx-auto space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[1, 2, 3, 4].map((num) => (
                        <motion.div
                            key={num}
                            variants={itemVariants}
                        >
                            <Card className="p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold mb-2 flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                    <span>{t(`plans.faq.q${num}`)}</span>
                                </h3>
                                <p className="text-muted-foreground ml-7">
                                    {t(`plans.faq.a${num}`)}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Final CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        {t("plans.testimonials.title")}
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        {t("plans.testimonials.subtitle")}
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                    >
                        {t("plans.cta.getStarted")}
                    </Button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/30 mt-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold mb-4">
                                {t("landing.footer.product")}
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="/#features" className="hover:text-foreground">
                                        {t("landing.footer.features")}
                                    </a>
                                </li>
                                <li>
                                    <a href="/plans" className="hover:text-foreground">
                                        {t("landing.footer.pricing")}
                                    </a>
                                </li>
                                <li>
                                    <a href="/#demos" className="hover:text-foreground">
                                        {t("landing.footer.demos")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">
                                {t("landing.footer.company")}
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="/#about" className="hover:text-foreground">
                                        {t("landing.footer.about")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        {t("landing.footer.contact")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        {t("landing.footer.support")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">
                                {t("landing.footer.legal")}
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        {t("landing.footer.privacy")}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-foreground">
                                        {t("landing.footer.terms")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-pink-500">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    {t("landing.brand.name")}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("landing.brand.tagline")}
                            </p>
                        </div>
                    </div>
                    <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                        &copy; 2025 {t("landing.brand.name")}.{" "}
                        {t("landing.footer.rights")}
                    </div>
                </div>
            </footer>
        </div>
    );
}
