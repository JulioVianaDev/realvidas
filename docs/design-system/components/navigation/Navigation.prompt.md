Navigation: `Tabs` (underline or pill) and `Breadcrumb`.

```jsx
<Tabs variant="underline" defaultValue="terrestre" items={[
  { id: "terrestre", label: "Terrestre", icon: <Icon name="truck" size={16} /> },
  { id: "aereo", label: "Aéreo", icon: <Icon name="plane" size={16} /> },
]} onChange={setTab} />

<Breadcrumb items={[{label:"Início",href:"/"},{label:"Serviços",href:"/servicos"},{label:"Resgate 24h"}]} />
```
