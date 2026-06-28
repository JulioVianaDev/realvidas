/* FloatingActions — fixed WhatsApp + call bubbles (bottom-right). */
const { IconButton, Icon } = window.RealVidasDesignSystem_066fed;

function FloatingActions() {
  return (
    <div style={{ position: "fixed", right: "var(--space-5)", bottom: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-3)", zIndex: "var(--z-sticky)" }}>
      <a href="tel:+5512997151128" aria-label="Ligar" style={{ textDecoration: "none" }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: "var(--radius-pill)", background: "var(--brand)", color: "#fff", boxShadow: "var(--shadow-brand)" }}>
          <Icon name="phone" size={22} />
        </span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=5512997151128" aria-label="WhatsApp" style={{ textDecoration: "none", position: "relative" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "var(--radius-pill)", background: "#25D366", animation: "rv-ping 2s var(--ease-out) infinite" }} />
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "var(--radius-pill)", background: "#25D366", color: "#04301a", boxShadow: "var(--shadow-lg)" }}>
          <Icon name="whatsapp" size={26} />
        </span>
      </a>
    </div>
  );
}
window.FloatingActions = FloatingActions;
