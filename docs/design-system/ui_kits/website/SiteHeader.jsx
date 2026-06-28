/* SiteHeader — contact strip + main nav + theme toggle + WhatsApp CTA.
   Drives the single-page kit via onNavigate(pageId). */
const { Logo, Button, IconButton, ThemeToggle, Icon, Badge } = window.RealVidasDesignSystem_066fed;

function SiteHeader({ page, onNavigate }) {
  const [open, setOpen] = React.useState(false);
  const nav = [
    { id: "inicio", label: "Início" },
    { id: "empresa", label: "A Empresa" },
    { id: "servicos", label: "Serviços" },
    { id: "planos", label: "Associe-se" },
    { id: "contato", label: "Fale Conosco" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: "var(--z-header)" }}>
      {/* contact strip */}
      <div style={{ background: "var(--secondary)", color: "#fff" }}>
        <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", padding: "7px var(--gutter)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", fontSize: "var(--text-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", opacity: 0.92 }}>
            <Icon name="map-pin" size={15} /><span>Pindamonhangaba · São Paulo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
            <a href="tel:+5512997151128" style={{ color: "#fff", display: "inline-flex", gap: 6, alignItems: "center", textDecoration: "none", fontWeight: "var(--fw-semibold)" }}><Icon name="phone" size={15} />(12) 99715-1128</a>
            <a href="mailto:faleconosco@realvidas.com.br" style={{ color: "#fff", display: "inline-flex", gap: 6, alignItems: "center", textDecoration: "none", opacity: 0.92 }}><Icon name="mail" size={15} /><span className="rv-hide-sm">faleconosco@realvidas.com.br</span></a>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div style={{ background: "var(--surface)", borderBottom: "var(--border-w) solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", padding: "var(--space-3) var(--gutter)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <button onClick={() => onNavigate("inicio")} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }} aria-label="Início">
            <Logo variant="full" size={40} />
          </button>

          <nav className="rv-nav" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
            {nav.map((n) => {
              const active = n.id === page;
              return (
                <button key={n.id} onClick={() => onNavigate(n.id)} style={{
                  border: "none", background: "transparent", cursor: "pointer", padding: "var(--space-2) 0",
                  fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)", fontSize: "var(--text-base)",
                  color: active ? "var(--brand)" : "var(--text-body)",
                  borderBottom: `2px solid ${active ? "var(--brand)" : "transparent"}`,
                  transition: "color var(--dur-fast) var(--ease-out)",
                }}>{n.label}</button>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <ThemeToggle />
            <div className="rv-hide-sm"><Button variant="whatsapp" leftIcon={<Icon name="whatsapp" size={18} />} href="https://api.whatsapp.com/send?phone=5512997151128">Orçamento</Button></div>
            <div className="rv-show-sm"><IconButton icon={<Icon name={open ? "x" : "menu"} />} label="Menu" variant="outline" onClick={() => setOpen(!open)} /></div>
          </div>
        </div>

        {open && (
          <nav className="rv-show-sm" style={{ borderTop: "var(--border-w) solid var(--border)", padding: "var(--space-2) var(--gutter) var(--space-4)", display: "flex", flexDirection: "column" }}>
            {nav.map((n) => (
              <button key={n.id} onClick={() => { onNavigate(n.id); setOpen(false); }} style={{
                textAlign: "left", border: "none", background: "transparent", cursor: "pointer",
                padding: "var(--space-3) 0", fontFamily: "var(--font-display)", fontWeight: "var(--fw-semibold)",
                fontSize: "var(--text-md)", color: n.id === page ? "var(--brand)" : "var(--text-body)",
                borderBottom: "var(--border-w) solid var(--border-subtle)",
              }}>{n.label}</button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
window.SiteHeader = SiteHeader;
