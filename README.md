# tesela

A mosaic-identity icon set. Every icon is exactly five lines: four main strokes drawn in a single
brushstroke and one loose **detail**, computed five tones away from the main color. Icons come in a line
and a tiled variant, and morph into each other: the detail travels, the new brushstroke draws itself.

- Framework-free core: geometry, rules, SVG strings.
- React components with `IconTransition`.
- An SVG sprite with `<symbol>`s.
- Colors derive from `currentColor` with CSS relative color, with a `color-mix` fallback.

```bash
npm install tesela
```

```tsx
import { Search, IconTransition } from 'tesela/react';
import { menu, close } from 'tesela';

<Search size={20} title="Search" />
<Search variant="tiled" stroke={2} />
<IconTransition icon={open ? close : menu} duration={560} />
```

```ts
import { renderIcon, search } from 'tesela';

renderIcon(search, { size: 24, stroke: 1.5, junta: 0.5, variant: 'line', seams: true });
```

```html
<svg width="24" height="24"><use href="tesela/sprite.svg#search" /></svg>
<svg width="24" height="24"><use href="tesela/sprite.svg#search-tiled" /></svg>
```

## Props

| Prop | Default | |
|---|---|---|
| `size` | `24` | Width and height |
| `stroke` | `1.5` | Stroke width, 1 to 2.5 |
| `junta` | `0.5` | Visible gap between the detail and the strokes |
| `variant` | `'line'` | `'line'` or `'tiled'` |
| `seams` | `true` | Thin marks where main strokes meet |
| `detailDirection` | inherited | `'darker'` or `'lighter'`; sets `--tesela-dir` |
| `title` | — | Accessible name; without it the icon is `aria-hidden` |

The detail goes darker by default. For dark themes set `--tesela-dir: -1` on any ancestor, or pass
`detailDirection="lighter"`.

## Rules

Every icon passes `validate()`: four main segments, one brushstroke (crosses take two), the detail at
least stroke + junta away from every stroke, lines at 0, 45 or 90° unless marked, and inside the 24 × 24
box, for strokes from 1 to 2.5 and juntas from 0.25 to 1.5.

## Development

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run demo
```

## License

AGPL-3.0-only
