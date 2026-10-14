# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

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

- La regla cuenta trazos, no segmentos: un trazo es una línea continua que puede doblar esquinas. Hasta
  cinco contando el detalle, o diez en los íconos `complex`. Sale la marca `cross`; `close` y `plus` ya caben
  en cinco y `move` es `complex`.
- El detalle puede tener varios tramos (la punta de `move`, el nodo de `shareNodes`). La transición
  interpola el detalle cuando los dos son de un tramo y si no lo cambia con un fundido.
- `thumbUp`, `thumbDown`, `star`, `move`, `focus`, `offline`, `swipe` y `shareNodes`, redibujados con la
  regla nueva.
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
