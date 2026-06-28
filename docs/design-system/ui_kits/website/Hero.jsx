/* Hero — rotating institutional banner (two slides), navy gradient + ECG motif.
   Image placeholders mark where the brand photography (ambulances, equipe) goes. */
const { Button, Icon, Badge } = window.RealVidasDesignSystem_066fed;

const SLIDES = [
  {
    eyebrow: "Remoções e emergências 24h",
    title: "Sua vida, nossa missão.",
    body: "Emergências médicas, ambulâncias, remoção de pacientes e atendimento domiciliar — agilidade e segurança a qualquer hora.",
    primary: "Solicite um orçamento",
    grad: "var(--grad-institutional)",
  },
  {
    eyebrow: "UTI móvel para eventos",
    title: "Cobertura de eventos de todos os portes.",
    body: "De encontros empresariais a shows e jogos de futebol — equipe médica preparada para urgência e emergência clínica.",
    primary: "Ver planos",
    grad: "linear-gradient(160deg, var(--orange-600) 0%, var(--blue-950) 100%)",
  },
];

function Hero({ onNavigate }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];

  return (
    <section style={{ position: "relative", background: s.grad, color: "#fff", overflow: "hidden", transition: "background var(--dur-slower) var(--ease-in-out)" }}>
      {/* ECG motif */}
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
        <path d="M0 160 H360 L410 60 L470 250 L520 120 L560 160 H1200" fill="none" stroke="#fff" strokeWidth="3" />
      </svg>
      <div style={{ position: "relative", maxWidth: "var(--container-xl)", margin: "0 auto", padding: "clamp(3rem,7vw,6rem) var(--gutter)", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "var(--space-12)", alignItems: "center" }} className="rv-hero-grid">
        <div>
          <Badge tone="solid" dot pulse style={{ marginBottom: "var(--space-5)" }}>{s.eyebrow}</Badge>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "clamp(2.25rem,5vw,3.75rem)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", margin: 0, color: "#fff", textWrap: "balance" }}>{s.title}</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-md)", lineHeight: "var(--leading-relaxed)", color: "rgba(255,255,255,0.9)", margin: "var(--space-5) 0 var(--space-8)", maxWidth: 520 }}>{s.body}</p>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" leftIcon={<Icon name="whatsapp" size={20} />} href="https://api.whatsapp.com/send?phone=5512997151128">{s.primary}</Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate("servicos")} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }} rightIcon={<Icon name="arrow-right" size={18} />}>Nossos serviços</Button>
          </div>
          {/* slide dots */}
          <div style={{ display: "flex", gap: 8, marginTop: "var(--space-8)" }}>
            {SLIDES.map((_, idx) => (
              <button key={idx} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} style={{
                width: idx === i ? 28 : 10, height: 10, borderRadius: "var(--radius-pill)", border: "none",
                background: idx === i ? "#fff" : "rgba(255,255,255,0.45)", cursor: "pointer",
                transition: "width var(--dur-base) var(--ease-out)",
              }} />
            ))}
          </div>
        </div>

        {/* image placeholder card */}
        <div className="rv-hide-md" style={{ position: "relative", aspectRatio: "4/3", borderRadius: "var(--radius-2xl)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(var(--blur-sm))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", color: "rgba(255,255,255,0.78)" }}>
          <Icon name="truck" size={64} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: "var(--text-sm)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Foto da frota / equipe</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", opacity: 0.7 }}>placeholder — inserir imagem real</span>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
