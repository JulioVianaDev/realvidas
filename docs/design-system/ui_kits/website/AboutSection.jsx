/* AboutSection — "Quem somos" + padrões de segurança (safety standards). */
const { Stat, Icon, Card } = window.RealVidasDesignSystem_066fed;

const STANDARDS = [
  "Equipe profissional e experiente",
  "Treinamentos seguindo protocolos internacionais de resgate",
  "Ambulâncias com tecnologia de última geração",
  "Normas de segurança para remoção de pacientes",
  "Certificações de atendimento ao trauma",
  "Atendimento personalizado, ágil e humanizado",
];

function AboutSection() {
  return (
    <section style={{ background: "var(--bg-subtle)", padding: "clamp(3rem,6vw,5rem) var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "var(--space-12)", alignItems: "center" }} className="rv-about-grid">
        {/* image placeholder */}
        <div style={{ position: "relative", aspectRatio: "5/4", borderRadius: "var(--radius-2xl)", overflow: "hidden", background: "var(--grad-institutional)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ color: "rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
            <Icon name="users" size={56} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Foto da equipe</span>
          </div>
          <div style={{ position: "absolute", bottom: "var(--space-5)", left: "var(--space-5)", right: "var(--space-5)", display: "flex", gap: "var(--space-6)", background: "rgba(255,255,255,0.96)", borderRadius: "var(--radius-lg)", padding: "var(--space-4) var(--space-5)", boxShadow: "var(--shadow-md)" }}>
            <Stat value="24h" label="Atendimento" icon={<Icon name="clock" size={22} />} />
            <Stat value="+10" label="Anos de atuação" accent="secondary" icon={<Icon name="shield" size={22} />} />
            <Stat value="6" label="Certificações" accent="accent" icon={<Icon name="star" size={22} />} />
          </div>
        </div>

        <div>
          <span className="rv-eyebrow">Quem somos</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", color: "var(--text-strong)", margin: "var(--space-3) 0 var(--space-4)" }}>Oriunda da consultoria e do treinamento em saúde</h2>
          <p className="rv-body" style={{ color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>
            A Real Vidas foi criada para prestar serviços de altíssima qualidade no atendimento e remoção de pacientes de urgência e emergência — com equipe treinada constantemente e técnicas atualizadas de resgate.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }} className="rv-std-grid">
            {STANDARDS.map((t) => (
              <div key={t} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}><Icon name="check-circle" size={18} /></span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.AboutSection = AboutSection;
