# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado con
[SemVer](https://semver.org/lang/es/).

## [No publicado]

## [0.1.0] - 2026-10-13

Primera versión: la identidad de cinco líneas llevada a un paquete.

### Agregado

- 60 íconos en seis grupos: navegación, acciones, estado, objetos, mapa y el colibrí.
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
