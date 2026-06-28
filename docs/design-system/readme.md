# Real Vidas — Design System

A dual-theme (light + dark) design system for **Real Vidas**, a 24h medical
emergency, patient-removal and UTI-ambulance company based in **Pindamonhangaba,
São Paulo, Brazil** (realvidas.com.br). Tagline: *“Sua vida, nossa missão.”*

> **Source of truth & caveat.** This system was reconstructed from the public
> marketing site **https://realvidas.com.br/** (services, copy, plans, structure).
> The site's own images and logo are **hotlink-protected**, so the official logo
> files, exact brand hex values, and product photography **could not be imported**.
> The mark, palette and type here are a faithful, professional reconstruction —
> see *Caveats* at the bottom. Fonts are real Google Fonts (self-hosted woff2).

---

## 1. Company & product context

Real Vidas provides emergency medical services and patient logistics across the
Vale do Paraíba region. The single product surface is a **marketing website** that
sells services and memberships and captures removal quotes.

**Services** (the site's services grid):
- Transporte terrestre de pacientes (ambulance types A–D)
- Transporte aéreo de pacientes em UTI (air ambulance)
- Resgate 24 horas
- Cobertura de eventos (UTI móvel)
- Montagem e gestão de postos médicos
- Educação continuada em saúde
- Elaboração e execução de planos de emergência (PAE)
- Equipes de bombeiros profissionais
- Certificações: PHTLS · ACLS · ATLS · PALS · AMLS · BLS

**Membership plans (Associe-se):** Ouro (24h) · Prata (12h) · Bronze (08h) ·
Remoções particulares / Serviços personalizados.

**Contact:** (12) 3522-1128 · (12) 99715-1128 (WhatsApp) ·
faleconosco@realvidas.com.br · Pindamonhangaba/SP.

**Sources referenced** (store for whoever has access):
- Website: https://realvidas.com.br/ (+ /servicos/, /associe-se/, /fale-conosco/)
- No Figma, codebase, or brand manual was provided.

---

## 2. Content fundamentals (voice & tone)

The brand voice is **reassuring, confident and direct** — urgency without alarm,
warmth without fluff. It must feel trustworthy in a literal life-or-death context.

- **Language:** Brazilian Portuguese (pt-BR). Keep copy in Portuguese.
- **Person:** institutional **“nós”** for the company (“nossa equipe”, “contamos
  com…”), and **“você”** for the customer. Warm but professional.
- **Casing:** Title/sentence case for headings. The site uses **ALL CAPS** for
  punchy banner headlines (“REMOÇÕES E EMERGÊNCIAS 24H”, “UTI MÓVEL PARA EVENTOS”)
  and for eyebrows — use sparingly, never for body copy.
- **Signature lines:** *“Sua vida, nossa missão.”* · *“Pensou em Remoções ou
  Emergências? Fale com a Real Vidas!”* · *“Atendimento 24 horas.”*
- **Numbers as proof:** 24h, +10 anos, certifications. Concrete, never inflated.
- **Tone words:** segurança, agilidade, humanização, excelência, confiança.
- **No emoji.** No slang. No exclamation-heavy hype except the one CTA line above.
- **CTAs are action-first:** “Solicite um orçamento”, “Ver planos”, “Saiba mais”,
  “Conheça em detalhes”, “Falar no WhatsApp”.

Example (good): *“Transferência segura e eficiente de pacientes em ambulâncias
totalmente equipadas, com acompanhamento de enfermagem treinado.”*

---

## 3. Visual foundations

**Colour vibe.** Two brand hues from the logo drive everything:
- **Laranja (`--brand`, orange `#e98b2e`)** — the energetic “REAL” mark; primary
  CTAs, emphasis, accent stripes, the emergency gradient.
- **Azul royal (`--secondary`, blue `#2e4a90`)** — the “VIDAS” mark; trust, the
  contact strip, footer, hero gradients, institutional surfaces.
- **Verde (`--accent`/`--success`, green `#0ea15f`)** — reserved for success only
  (“disponível”, check marks, switches). **Vermelho** is danger/errors only.
  confirmations, toggles.

**Dual theme.** Light is default on `:root`; dark is `[data-theme="dark"]` on
`<html>`. Brand/secondary/accent brighten one step in dark for legibility; shadows
deepen. The `ThemeToggle` component flips it and persists to `localStorage`.

**Typography.**
- **Montserrat** (variable, 400–800) — display, headings, UI labels, buttons.
  Geometric, confident, slightly condensed feel. Headings use extrabold (800)/bold.
- **Source Sans 3** (variable) — body, long-form, forms. Humanist, very legible.
- Tracking tightens on large display; eyebrows are uppercase with `0.14em`.

**Backgrounds.** Solid surfaces, not busy. The hero & footer use **brand
gradients** (`--grad-institutional` blue, `--grad-emergency` orange) with a faint
**ECG/heartbeat line motif** as the one signature texture. No photographic
backgrounds shipped (placeholders provided). No noise/grain.

**Imagery.** Where photography belongs (hero, “quem somos”), the kit shows a
**gradient placeholder** labelled in Portuguese. Real photos should be warm,
human, documentary (equipe, ambulâncias, atendimento) — not stocky.

**Corners & cards.** Friendly but not bubbly. Radii: inputs/buttons `--radius-md`
(10px), cards `--radius-lg` (14px), plans/hero `--radius-xl`/`2xl`. Cards are
white (`--surface`) with a soft **navy-tinted shadow** (`--shadow-sm/md`); the
outlined variant uses a 1px `--border`. Service cards add a brand **accent
stripe** and lift + icon-fill on hover.

**Borders & shadows.** 1px hairlines in `--border`; a 3px brand accent for
stripes/alerts. Five-step shadow scale, all tinted with the theme's shadow colour
and scaled by `--shadow-strength` (lighter in light, deeper in dark). A special
`--shadow-brand` glow for emergency CTAs. Inputs use a subtle inner shadow.

**Motion.** Crisp and confident — **no bounce**. Entrances `--ease-out`, state
changes `--ease-in-out`; durations 140–360ms. Hovers: buttons/cards **lift -1/-3px**
+ shadow, brand fills deepen one step. Press: rely on translate, no harsh scale.
Live/“24h” status uses a `rv-ping` pulse and a pulsing badge dot. All motion is
disabled under `prefers-reduced-motion`.

**Transparency & blur.** Used sparingly: the hero's glass placeholder card uses
`backdrop-filter: blur(--blur-sm)` over a gradient; overlays would use `--blur-md`.

**Focus.** 2px `--ring` (blue) outline with offset; inputs get a 3px ring halo.

---

## 4. Iconography

- **System:** **Lucide** geometry (ISC/MIT) — 24×24, 2px round strokes,
  `currentColor` — re-implemented in a single `Icon` component
  (`components/icon/Icon.jsx`) so no runtime CDN dependency. A curated medical/UI
  set: phone, mail, map-pin, clock, heart-pulse, activity, shield(-check), truck,
  plane, flame, graduation-cap, calendar, file-text, credit-card, users, star,
  search, alert-triangle, info, check(-circle), chevrons, arrow-right, send…
- **Brand glyph:** the **WhatsApp** mark is included as a *filled* path (the brand
  leans heavily on WhatsApp for contact). Phone & WhatsApp recur everywhere.
- **No emoji**, no Unicode-as-icon. Use `<Icon name="…" />`; colour via
  `currentColor`. To add icons, extend the `STROKE`/`FILL` maps with Lucide paths.
- The **logo** (`assets/logo/realvidas-logo.webp`, transparent) is the official
  orange + blue lockup; the `Logo` component embeds it (and offers a white
  typographic `mono` variant for dark surfaces).

---

## 5. Index / manifest

**Foundations**
- `styles.css` — the single entry point consumers link (only `@import`s).
- `tokens/` — `fonts.css`, `colors.css` (raw ramps), `semantic.css` (light+dark
  roles), `typography.css`, `spacing.css`, `elevation.css`, `keyframes.css`,
  `base.css`.
- `assets/fonts/` — Montserrat + Source Sans 3 variable woff2.
- `assets/logo/` — `realvidas-mark.svg`, `realvidas-mark-mono.svg`.

**Components** (`window.RealVidasDesignSystem_<id>`)
- actions/ — `Button`, `IconButton`, `ThemeToggle`
- icon/ — `Icon`
- forms/ — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Field`
- display/ — `Card`, `Badge`, `Tag`, `Avatar`, `Stat`
- feedback/ — `Alert`, `Spinner`, `ProgressBar`
- navigation/ — `Tabs`, `Breadcrumb`
- brand/ — `Logo`, `ServiceCard`, `PlanCard`, `EmergencyCTA`

**UI kits**
- `ui_kits/website/` — click-through recreation of the Real Vidas site
  (Início · Serviços · A Empresa · Associe-se · Fale Conosco), with an
  interactive quote form. Open `ui_kits/website/index.html`.

**Specimen cards** — `guidelines/*.card.html` (Colors, Type, Spacing, Brand) and
each component directory's `*.card.html` populate the Design System tab.

---

## Caveats / help us make it perfect

1. **Photography is placeholder** (the site blocks hotlinking). Please upload any
   brand **photography** (frota, equipe, atendimento) so we can replace the
   gradient image slots. The official **logo** is now in use.
2. **Colours are taken from the logo** (orange `#e98b2e` + royal blue). If you
   have an exact brand manual/hex set, share it and the palette will be retuned.
3. **Fonts are substitutes** — Montserrat + Source Sans 3 (Google Fonts), chosen
   to match the site's modern geometric look. If the brand uses specific
   typefaces, send the files and we'll swap them in.
