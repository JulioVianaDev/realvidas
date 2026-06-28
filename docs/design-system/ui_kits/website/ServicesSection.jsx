/* ServicesSection — the nine Real Vidas services as ServiceCards. */
const { ServiceCard, Icon } = window.RealVidasDesignSystem_066fed;

const SERVICES = [
  { icon: "truck", title: "Transporte terrestre de pacientes", description: "Transferência segura e eficiente em ambulâncias equipadas — emergências, acidentes e remoções hospitalares." },
  { icon: "plane", title: "Transporte aéreo em UTI", description: "Aeronaves com suporte avançado de vida e tripulação de médicos e enfermeiros especializados." },
  { icon: "heart-pulse", title: "Resgate 24 horas", description: "Atendimento de emergência médica disponível 24h por dia, todos os dias da semana." },
  { icon: "users", title: "Cobertura de eventos", description: "Atendimento imediato por profissional especializado em qualquer situação de urgência." },
  { icon: "shield-check", title: "Postos médicos", description: "Montagem e gestão de ambulatórios pontuais ou permanentes para sua empresa." },
  { icon: "graduation-cap", title: "Educação continuada", description: "Capacitação atualizada para técnicos, enfermeiros e médicos." },
  { icon: "file-text", title: "Planos de emergência", description: "Elaboração e execução de PAE com procedimentos estruturados de resposta." },
  { icon: "flame", title: "Bombeiros profissionais", description: "Equipes civis para proteção de pessoas e patrimônios contra riscos de acidentes." },
  { icon: "star", title: "Certificações", description: "PHTLS · ACLS · ATLS · PALS · AMLS · BLS — treinamento e atualização." },
];

function ServicesSection({ compact }) {
  return (
    <section style={{ background: "var(--bg-canvas)", padding: "clamp(3rem,6vw,5rem) var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto var(--space-12)" }}>
          <span className="rv-eyebrow">O que fazemos</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", color: "var(--text-strong)", margin: "var(--space-3) 0 var(--space-3)" }}>Serviços de emergência e remoção</h2>
          <p className="rv-lead" style={{ margin: 0 }}>Estrutura completa para urgência e emergência médica, com equipe treinada e equipamentos de última geração.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          {(compact ? SERVICES.slice(0, 6) : SERVICES).map((s) => (
            <ServiceCard key={s.title} icon={<Icon name={s.icon} size={26} />} title={s.title} description={s.description} href="#" />
          ))}
        </div>
      </div>
    </section>
  );
}
window.ServicesSection = ServicesSection;
