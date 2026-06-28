Feedback components: `Alert` (inline callouts), `Spinner`, `ProgressBar`.

```jsx
<Alert tone="brand" title="Emergência 24h">Ligue (12) 99715-1128 a qualquer hora.</Alert>
<Alert tone="success" title="Orçamento enviado">Retornaremos em instantes.</Alert>
<Spinner tone="brand" />
<ProgressBar value={72} label="Cobertura da equipe" showValue />
```

`Alert` tones: info · success · warning · danger · brand. `ProgressBar` tones: brand (gradient) · secondary · accent.
