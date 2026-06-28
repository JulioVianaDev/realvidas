Real Vidas form controls: `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, all wrapped by `Field` for label + helper/error.

```jsx
<Field label="Telefone / Celular" htmlFor="tel" required hint="Atendimento 24h">
  <Input id="tel" leftIcon={<Icon name="phone" />} placeholder="(12) 99715-1128" />
</Field>

<Field label="Estado de origem" htmlFor="uf">
  <Select id="uf" options={[{value:"SP",label:"São Paulo"},{value:"RJ",label:"Rio de Janeiro"}]} />
</Field>

<Checkbox label="Aceito ser contatado pelo WhatsApp" defaultChecked />
<Switch label="Receber notícias" />
```

Inputs/Select/Textarea take `invalid` for error styling and `size` (sm/md/lg). Focus ring uses `--ring`; invalid uses `--danger`.
