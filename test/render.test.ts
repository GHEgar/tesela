import { describe, expect, it } from 'vitest';
import { icons, renderIcon, search, spinner } from 'tesela';

describe('renderIcon', () => {
    it('sin título es decorativo', () => {
        const svg = renderIcon(search);
        expect(svg).toContain('aria-hidden="true"');
        expect(svg).not.toContain('<title>');
    });

    it('con título es una imagen con nombre', () => {
        const svg = renderIcon(search, { title: 'Buscar <todo>' });
        expect(svg).toContain('role="img"');
        expect(svg).toContain('<title>Buscar &lt;todo&gt;</title>');
    });

    it('el detalle usa color relativo con respaldo', () => {
        const svg = renderIcon(search);
        expect(svg).toContain('oklch(from currentColor calc(l - 0.36 * var(--tesela-dir, 1)) c h)');
        expect(svg).toContain('color-mix(in oklch, currentColor, black 60%)');
    });

    it('la variante teselada agrega rombos y la de línea no', () => {
        expect(renderIcon(search, { variant: 'tiled' })).toContain('<polygon');
        expect(renderIcon(search)).not.toContain('<polygon');
    });

    it('sin uniones no dibuja marcas', () => {
        const count = (svg: string): number => svg.split('<path').length - 1;
        expect(count(renderIcon(search, { seams: false }))).toBeLessThan(count(renderIcon(search)));
    });

    it('el spinner gira', () => {
        expect(renderIcon(spinner)).toContain('animateTransform');
    });

    it('cada ícono tiene un solo detalle', () => {
        for (const icon of icons) {
            expect(renderIcon(icon, { seams: false }).match(/style="stroke:/g)).toHaveLength(1);
        }
    });
});
