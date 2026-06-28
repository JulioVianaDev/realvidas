Brand-specific Real Vidas patterns: `Logo`, `ServiceCard`, `PlanCard`, `EmergencyCTA`.

```jsx
<Logo variant="full" size={44} />
<Logo variant="mark" tone="mono" />            {/* on dark/brand surfaces */}

<ServiceCard icon={<Icon name="truck" size={26} />} title="Transporte terrestre"
  description="Remoção segura em ambulâncias equipadas." href="#" />

<PlanCard tier="ouro" name="Plano Ouro" coverage="24 horas de cobertura" featured
  features={["Atendimento 24h","UTI móvel","Cobertura de eventos"]} />

<EmergencyCTA phone="(12) 99715-1128" />
```

`Logo` placeholder — replace with official files. `PlanCard` tiers: ouro/prata/bronze/custom; `featured` highlights. `EmergencyCTA` is the recurring red call band.
