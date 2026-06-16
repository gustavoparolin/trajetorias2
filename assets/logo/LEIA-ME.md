# Logomarca — Trajetórias 2.0

## Arquivos disponíveis

| Arquivo | Uso | Dimensões |
|---------|-----|-----------|
| `logo-t2-icon.png` | Ícone / favicon / hero da landing | Quadrado |
| `logo-t2-horizontal.png` | Header, footer, documentos | Horizontal (fundo branco) |

## Descrição visual

O símbolo do Trajetórias 2.0 é composto por três elementos geométricos sobrepostos
que representam caminhos/setas em direções ascendentes:
- **Seta azul-marinho** (vertical para cima) — solidez institucional / TCU
- **Seta verde** (diagonal superior direita) — crescimento / aprendizagem
- **Fita dourada** (horizontal) — excelência / destaque / progressão

A paleta segue exatamente as cores institucionais do ISC/TCU:
- Azul-marinho: `#1A237E`
- Dourado/ouro: `#F0B400`
- Verde: `#006C3A`

## Uso nos componentes

Ambos os arquivos têm **fundo transparente** — funcionam diretamente em fundos claros e escuros.

### Header (fundo escuro #070C1E)
```html
<a href="#" class="logo-badge">
  <img src="assets/logo/logo-t2-horizontal.png" alt="Trajetórias 2.0">
</a>
```
```css
.logo-badge { display: flex; align-items: center; text-decoration: none; }
.logo-badge img { height: 38px; width: auto; }
```

### Hero (fundo escuro — ícone com drop-shadow dourado)
```html
<img src="assets/logo/logo-t2-icon.png" alt="" aria-hidden="true" class="hero-logo">
```
```css
.hero-logo {
  width: 100px; height: 100px; object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(240,180,0,.35)) drop-shadow(0 2px 8px rgba(0,0,0,.5));
}
```

### Footer e outros contextos escuros
```html
<img src="assets/logo/logo-t2-horizontal.png" alt="Trajetórias 2.0" style="height:32px">
```

## Prompt original usado no NanoBanana

> Create a minimalist geometric logo for "Trajetórias 2.0", a professional career trajectory
> management system from a Brazilian public institution (ISC/TCU).
> Three overlapping arrows/geometric shapes in deep navy blue (#1A237E), gold (#F0B400),
> and dark green (#006C3A), representing upward trajectory and professional milestones.
> Clean vector style. Deliver: icon-only version + horizontal version with "Trajetórias 2.0" text.
