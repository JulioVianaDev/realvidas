/* Footer + the recurring EmergencyCTA band above it. */
const { Logo, EmergencyCTA, Icon } = window.RealVidasDesignSystem_066fed;

function Footer({ onNavigate }) {
  return (
    <>
      <div style={{ background: "var(--bg-canvas)", padding: "0 var(--gutter) clamp(2rem,5vw,4rem)" }}>
        <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto" }}>
          <EmergencyCTA />
        </div>
      </div>

      <footer style={{ background: "var(--secondary)", color: "rgba(255,255,255,0.82)" }}>
        <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", padding: "clamp(2.5rem,5vw,3.5rem) var(--gutter)", display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr", gap: "var(--space-10)" }} className="rv-footer-grid">
          <div>
            <Logo variant="full" tone="mono" size={40} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)", maxWidth: 320 }}>
              Serviços de altíssima qualidade no atendimento e remoção de pacientes de urgência e emergência.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", color: "#fff", fontSize: "var(--text-sm)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>Navegação</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[["inicio", "Início"], ["servicos", "Serviços"], ["planos", "Associe-se"], ["contato", "Fale Conosco"]].map(([id, l]) => (
                <button key={id} onClick={() => onNavigate(id)} style={{ textAlign: "left", border: "none", background: "transparent", color: "rgba(255,255,255,0.82)", cursor: "pointer", padding: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-bold)", color: "#fff", fontSize: "var(--text-sm)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>Contato</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--text-sm)" }}>
              <a href="tel:+5512997151128" style={{ color: "#fff", display: "inline-flex", gap: 8, alignItems: "center", textDecoration: "none", fontWeight: "var(--fw-semibold)" }}><Icon name="phone" size={16} />(12) 99715-1128</a>
              <a href="tel:+551235221128" style={{ color: "rgba(255,255,255,0.82)", display: "inline-flex", gap: 8, alignItems: "center", textDecoration: "none" }}><Icon name="phone" size={16} />(12) 3522-1128</a>
              <a href="mailto:faleconosco@realvidas.com.br" style={{ color: "rgba(255,255,255,0.82)", display: "inline-flex", gap: 8, alignItems: "center", textDecoration: "none" }}><Icon name="mail" size={16} />faleconosco@realvidas.com.br</a>
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon name="map-pin" size={16} />Pindamonhangaba · SP</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.16)" }}>
          <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", padding: "var(--space-4) var(--gutter)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)" }}>
            <span>© 2026 Real Vidas · Remoções e Emergências 24h</span>
            <span>Recriação de UI para o design system</span>
          </div>
        </div>
      </footer>
    </>
  );
}
window.Footer = Footer;
