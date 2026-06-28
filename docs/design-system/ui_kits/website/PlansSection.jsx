/* PlansSection — Associe-se: the four membership offerings. */
const { PlanCard, Icon } = window.RealVidasDesignSystem_066fed;

const PLANS = [
  { tier: "bronze", name: "Plano Bronze", coverage: "08 horas de cobertura", features: ["Remoções simples", "Enfermagem a bordo", "Agendamento por WhatsApp"] },
  { tier: "prata", name: "Plano Prata", coverage: "12 horas de cobertura", features: ["Tudo do Bronze", "Remoção emergencial", "Equipe de plantão"] },
  { tier: "ouro", name: "Plano Ouro", coverage: "24 horas de cobertura", featured: true, features: ["Tudo do Prata", "UTI móvel 24h", "Cobertura de eventos", "Atendimento prioritário"] },
  { tier: "custom", name: "Remoções particulares", coverage: "Emergência e hora marcada", features: ["Sob demanda", "Orçamento personalizado", "Pagamento em até 12x"] },
];

function PlansSection() {
  return (
    <section style={{ background: "var(--bg-canvas)", padding: "clamp(3rem,6vw,5rem) var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-12)" }}>
          <span className="rv-eyebrow">Associe-se</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", color: "var(--text-strong)", margin: "var(--space-3) 0 var(--space-3)" }}>Planos que se adaptam à sua necessidade</h2>
          <p className="rv-lead" style={{ margin: 0 }}>Modelos de serviço e atendimento para diferentes aplicações. Conheça os detalhes e fale com a gente.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-5)", alignItems: "stretch" }}>
          {PLANS.map((p) => (
            <PlanCard key={p.name} {...p} cta="Conheça em detalhes" href="#" />
          ))}
        </div>
      </div>
    </section>
  );
}
window.PlansSection = PlansSection;
