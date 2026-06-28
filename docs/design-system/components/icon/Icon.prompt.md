Renders a brand icon from the Real Vidas set — Lucide-geometry line icons plus brand glyphs (WhatsApp), all inheriting `currentColor`.

```jsx
<Icon name="heart-pulse" size={24} />
<button style={{ color: "var(--brand)" }}><Icon name="phone" /></button>
```

- `name` — see `IconName` union (phone, mail, map-pin, clock, heart-pulse, activity, shield, whatsapp, …).
- `size` — px, default 20. `strokeWidth` — default 2 (line icons only).
- Color comes from `currentColor`; set `color` on the icon or a parent. WhatsApp is a filled glyph.
