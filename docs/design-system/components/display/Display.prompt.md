Data-display primitives: `Card`, `Badge`, `Tag`, `Avatar`, `Stat`.

```jsx
<Card variant="elevated" interactive accentBar>
  <Badge tone="brand" dot pulse>24 HORAS</Badge>
  <h3 className="rv-h4">Resgate 24 Horas</h3>
</Card>

<Stat value="24h" label="Cobertura todos os dias" icon={<Icon name="clock" size={26} />} />
<Tag tone="secondary" icon={<Icon name="truck" size={14} />}>Remoção terrestre</Tag>
<Avatar name="Real Vidas" status="online" />
```

`Card` variants: elevated · outlined · soft · brand; `accentBar` for the brand stripe. `Badge` tones include `solid`; use `pulse` for live/24h. `Stat` accent: brand/accent/secondary.
