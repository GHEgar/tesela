import { mkdirSync, writeFileSync } from 'node:fs';
import { icons, renderIcon } from '../dist/core/index.js';

const symbol = (name: string, svg: string): string =>
    svg
        .replace(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" /, `<symbol id="${name}" `)
        .replace(/ aria-hidden="true">/, '>')
        .replace(/<\/svg>$/, '</symbol>');

const symbols = icons.flatMap((icon) => [
    symbol(icon.name, renderIcon(icon)),
    ...(icon.build(2).body
        ? (['tiled', 'filled', 'duotone'] as const).map((variant) => symbol(`${icon.name}-${variant}`, renderIcon(icon, { variant })))
        : []),
]);

mkdirSync('dist', { recursive: true });
writeFileSync('dist/sprite.svg', `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>\n`);
process.stdout.write(`sprite.svg: ${symbols.length} symbols\n`);
