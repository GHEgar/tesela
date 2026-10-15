# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

## [0.3.0] - 2026-10-15

### Agregado

- La animación del spinner: la cabeza (el detalle) da vueltas, en una se come el anillo y en la siguiente lo
  redibuja detrás de ella. Sale en el SVG del core, en el sprite y en React; `orbitOf()` y `IconParts.orbit`
  dan los tiempos.

### Cambiado

- Redibujados 62 íconos con el lenguaje del set:
  - Flechas: la punta queda abierta y uno de sus lados es el detalle.
  - Chevrons: un lado completo es el detalle.
  - Lupas: el detalle es un brillo en el vidrio.
  - Navegación: `menu`, `chevronDown`, `chevronUp`, `chevronLeft`, `chevronRight`, `arrowLeft`, `arrowRight`,
    `home`, `expand` y `collapse`.
  - Acciones: `search`, `zoomIn`, `zoomOut`, `close`, `plus`, `edit`, `trash`, `copy`, `refresh`, `undo`, `redo`,
    `history`, `link` y `settings`.
  - Estado: `check`, `alert`, `info`, `spinner`, `lock`, `unlock` y `play`.
  - Objetos: `table`, `eye`, `eyeOff`, `pin`, `user`, `folder`, `phone`, `mail`, `chat` y `globe`.
  - Mapa: `layers`, `basemap`, `ruler`, `point`, `polyline`, `polygon`, `circle`, `drone`, `stats`, `cube`,
    `compass` y `hummingbird`.
  - Herramientas: `opacity`, `arrowsVertical`, `arrowsHorizontal`, `focus`, `move`, `pointer`, `stop`, `undock`
    y `swap`.
- `validate()` acepta un punto (un tramo de largo cero) como detalle o como trazo.
- Un trazo de largo cero no lleva marca de unión.
- En los íconos con animación de spinner no se dibujan las uniones, porque el anillo aparece y desaparece.

## [0.2.0] - 2026-10-14

### Agregado

- 26 íconos en dos grupos nuevos. Herramientas: `crop`, `columns`, `text`, `opacity`, `swipe`,
  `arrowsVertical`, `arrowsHorizontal`, `focus`, `move`, `undock` y `swap`. Contenido: `ranking`,
  `lineChart`, `hexbin`, `raster`, `microphone`, `diagram`, `plug`, `star`, `formula`, `thumbUp`,
  `thumbDown`, `offline`, `translate`, `apps` y `shareNodes`, y además `pointer`, `stop` y `bell`. Son 90 en
  total.
- Variantes `filled` y `duotone`: el cuerpo del ícono relleno con el color principal o al 25 %. Los
  íconos sin cuerpo se quedan en línea.
- `colorMode` (`'auto'`, `'relative'`, `'mix'`) y `supportsRelativeColor()`: `'auto'` mide en el DOM si el
  navegador deriva de verdad el color desde `currentColor` y, si no, usa solo el respaldo `color-mix`.
  Es el valor por defecto en React.
- El respaldo `color-mix` aclara hacia blanco con `detailDirection: 'lighter'`.
- Símbolos `-filled` y `-duotone` en el sprite.

### Cambiado

- La regla cuenta trazos, no segmentos: un trazo es una línea continua que puede doblar esquinas. Exactamente
  cinco en todo el set: cuatro del ícono y el detalle. `geometryOf` reparte en cuatro trazos las
  definiciones que traen otro número. Sale la marca `cross`.
- El detalle puede tener varios tramos (la punta de `move`, el nodo de `shareNodes`). La transición
  interpola el detalle cuando los dos son de un tramo y si no lo cambia con un fundido.
- Redibujados con la regla nueva: `thumbUp`, `thumbDown`, `star`, `move`, `focus`, `offline`, `swipe`,
  `shareNodes`, `crop`, `columns`, `text`, `opacity`, `arrowsVertical`, `arrowsHorizontal`, `undock`, `swap`,
  `ranking`, `lineChart`, `hexbin`, `raster`, `microphone`, `diagram`, `plug`, `formula`, `translate` y `apps`.
- El demo está en inglés.
- Los `label` de los íconos y los mensajes de `validate()` están en inglés; quien los muestre como nombre accesible verá el texto nuevo.

## [0.1.0] - 2026-10-13

Primera versión: la identidad de cinco líneas llevada a un paquete.

### Agregado

- 61 íconos en seis grupos: navegación, acciones, estado, objetos, mapa y el colibrí.
- Core sin dependencias: geometría de rectas y arcos, herramientas de dibujo (`line`, `arc`, `part`,
  `split`, `clearArc`, espejo y giro), `resolveIcon` con uniones y teselado memoizados por trazo y
  junta, `iconParts` y `renderIcon`.
- `validate`: cinco líneas, un pincelazo (dos en cruces), separación del detalle, ángulos y caja,
  con trazos de 1 a 2.5 y juntas de 0.25 a 1.5.
- Color relativo a `currentColor` para el detalle, las uniones y las teselas, con respaldo
  `color-mix` y dirección por `--tesela-dir`.
- `tesela/react`: un componente por ícono, `Icon` por nombre e `IconTransition` con el detalle
  interpolado, el pincelazo nuevo trazado y movimiento reducido.
- `tesela/sprite.svg` con los símbolos de línea y teselados.
- Catálogo en Vite.
