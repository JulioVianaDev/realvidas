The core Real Vidas action button. Emergency/primary CTAs use `primary` (brand red) or `whatsapp`; institutional/secondary actions use `secondary` (navy). Renders an `<a>` when `href` is set.

```jsx
<Button variant="primary" leftIcon={<Icon name="phone" />}>Solicite um orçamento</Button>
<Button variant="whatsapp" leftIcon={<Icon name="whatsapp" />}>WhatsApp 24h</Button>
<Button variant="outline" size="sm" rightIcon={<Icon name="arrow-right" />}>Ver planos</Button>
```

Variants: `primary` `secondary` `accent` `outline` `ghost` `danger` `whatsapp`. Sizes: `sm` `md` `lg`. Props: `leftIcon` `rightIcon` `fullWidth` `loading` `disabled` `href`.
