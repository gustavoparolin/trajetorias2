# Prompt para geração de logomarca — NanoBanana

## Contexto do sistema
**Trajetórias 2.0** é o sistema de Gestão de Trajetórias Profissionais do Instituto Serzedello Corrêa (ISC),
a Escola Superior do Tribunal de Contas da União (TCU), Brasil.
O sistema guia servidores públicos ao longo de trajetórias de desenvolvimento profissional —
avaliando competências, registrando evidências e certificando níveis de domínio (Fundamental → Profissional → Especialista).

## Referência visual (ISC/TCU)
A identidade do ISC usa três formas geométricas entrelaçadas representando as letras I, S e C,
em três cores institucionais:
- **Azul-marinho profundo** (#1A237E ou similar) — solidez, instituição pública
- **Dourado/Amarelo** (#F0B400 ou similar) — excelência, destaque
- **Verde** (#006C3A ou similar) — crescimento, aprendizagem

## Conceito da logomarca Trajetórias 2.0

### Ideia central
Uma **trajetória ascendente** composta por elementos geométricos modulares — como degraus, blocos ou nós
conectados — que sugere progressão, evolução e caminho. A forma deve remeter tanto a um gráfico de
evolução quanto a um caminho/estrada visto de cima.

### Metáforas visuais para explorar
- **Setas ou nós conectados em diagonal ascendente** (tipo roadmap visual)
- **Blocos empilhados em escada** (Fundamental → Profissional → Especialista)
- **Três pontos conectados por linha curva** (os 3 níveis da trajetória)
- **Letra T estilizada** formada por elementos de trajetória (o T de Trajetórias)

### Estilo visual
- **Geométrico e limpo** — sem sombras, sem gradientes complexos, vetorial puro
- **Monograma ou símbolo simples** que funciona pequeno (favicon 32px) e grande
- Pode ter versão com nome "Trajetórias 2.0" ao lado do símbolo (horizontal) e versão só com ícone
- **Modernidade institucional**: profissional como o ISC, mas com energia de sistema digital moderno

### Paleta de cores (usar 2 ou 3 das opções abaixo)
| Cor | Hex | Papel |
|-----|-----|-------|
| Azul-marinho | `#1A237E` | Cor principal — solidez/TCU |
| Azul médio | `#2563EB` | Tecnologia/sistema |
| Dourado | `#F0B400` | Destaque/progressão |
| Verde | `#006C3A` | Crescimento/aprendizagem |
| Branco | `#FFFFFF` | Contraste em fundos escuros |

### O que NÃO fazer
- Não copiar as 3 formas entrelaçadas do ISC (já é a marca deles)
- Não usar gradientes difusos ou efeitos 3D
- Não usar pessoas, rostos ou elementos figurativos
- Não usar mais de 3 cores

## Prompt direto para NanoBanana

```
Create a minimalist geometric logo for "Trajetórias 2.0", a professional career trajectory 
management system from a Brazilian public institution (ISC/TCU).

The logo should represent upward progression and professional development milestones.
Concept: three connected nodes or geometric blocks arranged in an ascending diagonal path,
forming a subtle letter T shape. Clean vector style, no gradients, no shadows.

Color palette: deep navy blue (#1A237E), gold (#F0B400), and dark green (#006C3A).
The mark should work at 32px (favicon) and at large sizes.

Style: institutional yet modern, similar to the ISC logo aesthetic (interlocking geometric 
shapes for I, S, C letters in blue/gold/green) but unique. Think: professional trajectory,
career steps, upward path, Brazilian public service excellence.

Deliver: symbol only version + horizontal version with text "Trajetórias 2.0" in Inter font.
Background: transparent. Format: SVG.
```

## Variações para pedir
1. **Versão símbolo** — só o ícone (para favicon e app icon)
2. **Versão horizontal** — ícone + "Trajetórias 2.0" à direita (para header)
3. **Versão dark** — para usar em fundos escuros (navy/preto)
4. **Versão light** — para usar em fundos brancos

## Notas de uso
- Salvar os arquivos SVG em `assets/logo/`
- Nomear: `logo-t2-icon.svg`, `logo-t2-horizontal.svg`, `logo-t2-dark.svg`, `logo-t2-light.svg`
- Gerar PNG 512x512 e 192x192 para PWA manifest
