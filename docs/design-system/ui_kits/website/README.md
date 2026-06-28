# UI Kit — Real Vidas site institucional

Click-through recreation of the Real Vidas marketing site (realvidas.com.br), composed entirely from the design-system components.

## Screens / routes (single-page)
- **Início** — rotating hero, services grid, "quem somos" + safety standards, plans.
- **Serviços** — full nine-service grid with page header + breadcrumb.
- **A Empresa** — about section.
- **Associe-se** — membership plans (Bronze / Prata / Ouro / Personalizado).
- **Fale Conosco** — interactive "Solicite seu orçamento" form (validates, shows success).

## Files
- `index.html` — app shell + routing + responsive helpers. Open this.
- `SiteHeader.jsx` · `Hero.jsx` · `ServicesSection.jsx` · `AboutSection.jsx` · `PlansSection.jsx` · `QuoteForm.jsx` · `Footer.jsx` · `FloatingActions.jsx`

Each component reads primitives from `window.RealVidasDesignSystem_066fed` (the compiled bundle) and attaches itself to `window` for the inline app script.

## Notes
- **Imagery is placeholder.** Hero/about use brand-gradient panels labelled “foto …”. Drop in the real ambulance/equipe photography when available.
- Theme toggle in the header switches the whole kit between light and dark.
- Phone/WhatsApp links use the real Real Vidas numbers.
