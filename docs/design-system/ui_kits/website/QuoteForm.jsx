/* QuoteForm — "Solicite seu orçamento". Interactive: validates required
   fields and shows a success Alert on submit. */
const { Field, Input, Select, Textarea, Checkbox, Button, Alert, Icon, Card } = window.RealVidasDesignSystem_066fed;

const UF = ["SP", "RJ", "MG", "ES", "PR"].map((v) => ({ value: v, label: v }));

function QuoteForm() {
  const [sent, setSent] = React.useState(false);
  const [errs, setErrs] = React.useState({});
  const [form, setForm] = React.useState({ nome: "", email: "", tel: "", cidadeO: "", ufO: "SP", endO: "", data: "", hora: "", cidadeD: "", ufD: "SP", endD: "", obs: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const req = ["nome", "email", "tel", "cidadeO", "cidadeD"];
    const next = {};
    req.forEach((k) => { if (!form[k].trim()) next[k] = "Campo obrigatório"; });
    setErrs(next);
    if (Object.keys(next).length === 0) { setSent(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  return (
    <section style={{ background: "var(--bg-subtle)", padding: "clamp(3rem,6vw,5rem) var(--gutter)" }}>
      <div style={{ maxWidth: "var(--container-lg)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto var(--space-8)" }}>
          <span className="rv-eyebrow">Fale conosco</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: "var(--text-2xl)", color: "var(--text-strong)", margin: "var(--space-3) 0 var(--space-3)" }}>Solicite seu orçamento</h2>
          <p className="rv-lead" style={{ margin: 0 }}>Para remoções, preencha os dados abaixo. Para outros serviços, fale com a gente pelo WhatsApp.</p>
        </div>

        <Card variant="elevated" padding="clamp(1.5rem,4vw,2.5rem)">
          {sent && <Alert tone="success" title="Orçamento enviado!" style={{ marginBottom: "var(--space-6)" }}>Recebemos sua solicitação. Nossa equipe retornará em instantes pelo telefone ou WhatsApp informado.</Alert>}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div className="rv-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
              <Field label="Seu nome" htmlFor="q-nome" required error={errs.nome}><Input id="q-nome" value={form.nome} onChange={set("nome")} invalid={!!errs.nome} placeholder="Nome completo" /></Field>
              <Field label="E-mail" htmlFor="q-email" required error={errs.email}><Input id="q-email" type="email" value={form.email} onChange={set("email")} invalid={!!errs.email} placeholder="voce@email.com" /></Field>
              <Field label="Telefone / Celular" htmlFor="q-tel" required error={errs.tel}><Input id="q-tel" value={form.tel} onChange={set("tel")} invalid={!!errs.tel} leftIcon={<Icon name="phone" size={16} />} placeholder="(12) 99715-1128" /></Field>
            </div>

            <div>
              <div className="rv-eyebrow" style={{ color: "var(--secondary)", marginBottom: "var(--space-3)" }}>Origem</div>
              <div className="rv-form-grid3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 3fr", gap: "var(--space-4)" }}>
                <Field label="Cidade" htmlFor="q-co" required error={errs.cidadeO}><Input id="q-co" value={form.cidadeO} onChange={set("cidadeO")} invalid={!!errs.cidadeO} placeholder="Pindamonhangaba" /></Field>
                <Field label="Estado" htmlFor="q-ufo"><Select id="q-ufo" options={UF} value={form.ufO} onChange={set("ufO")} /></Field>
                <Field label="Endereço completo" htmlFor="q-eo"><Input id="q-eo" value={form.endO} onChange={set("endO")} placeholder="Rua, nº, bairro" /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
                <Field label="Data para remoção" htmlFor="q-data"><Input id="q-data" type="date" value={form.data} onChange={set("data")} /></Field>
                <Field label="Hora" htmlFor="q-hora"><Input id="q-hora" type="time" value={form.hora} onChange={set("hora")} /></Field>
              </div>
            </div>

            <div>
              <div className="rv-eyebrow" style={{ color: "var(--secondary)", marginBottom: "var(--space-3)" }}>Destino</div>
              <div className="rv-form-grid3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 3fr", gap: "var(--space-4)" }}>
                <Field label="Cidade" htmlFor="q-cd" required error={errs.cidadeD}><Input id="q-cd" value={form.cidadeD} onChange={set("cidadeD")} invalid={!!errs.cidadeD} placeholder="São José dos Campos" /></Field>
                <Field label="Estado" htmlFor="q-ufd"><Select id="q-ufd" options={UF} value={form.ufD} onChange={set("ufD")} /></Field>
                <Field label="Endereço completo" htmlFor="q-ed"><Input id="q-ed" value={form.endD} onChange={set("endD")} placeholder="Hospital, unidade…" /></Field>
              </div>
            </div>

            <Field label="Observações extras" htmlFor="q-obs"><Textarea id="q-obs" rows={3} value={form.obs} onChange={set("obs")} placeholder="Condição do paciente, necessidade de UTI, acompanhantes…" /></Field>

            <Checkbox label="Autorizo o contato pelo WhatsApp informado." defaultChecked />

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <Button type="submit" variant="primary" size="lg" leftIcon={<Icon name="send" size={18} />}>Enviar solicitação</Button>
              <Button type="button" variant="whatsapp" size="lg" leftIcon={<Icon name="whatsapp" size={20} />} href="https://api.whatsapp.com/send?phone=5512997151128">Falar no WhatsApp</Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
window.QuoteForm = QuoteForm;
