---
name: realvidas-design
description: Use this skill to generate well-branded interfaces and assets for Real Vidas (24h medical emergency / ambulance / patient removal, Pindamonhangaba-SP), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key entry points:
- `styles.css` — link this one file to get all tokens, fonts and base styles. Dual theme: set `data-theme="light"` (default) or `data-theme="dark"` on `<html>`.
- `tokens/` — color ramps, semantic light/dark roles, type, spacing, elevation, motion.
- `components/` — React primitives (Button, Input, Card, Badge, Logo, ServiceCard, PlanCard, EmergencyCTA, Icon, …). In standalone HTML, load `_ds_bundle.js` and read them off `window.RealVidasDesignSystem_<id>`.
- `ui_kits/website/` — full click-through recreation of the Real Vidas site to copy patterns from.
- `assets/` — self-hosted fonts and the logo mark (placeholder — ask for official files).

Brand in one line: **orange `#e98b2e`** + **royal blue** (from the logo), Montserrat headings / Source Sans 3 body, Portuguese (pt-BR) copy, voice reassuring-but-urgent (“Sua vida, nossa missão”), no emoji, WhatsApp/phone CTAs everywhere. Green is used only for success.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
