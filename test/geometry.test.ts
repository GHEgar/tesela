import { describe, expect, it } from 'vitest';
import { arc, line, mirrorX, resolveIcon, rotate, search, strokePath, toCubic } from 'tesela';

describe('geometría', () => {
    it('encadena rectas y arcos en un solo path', () => {
        expect(strokePath([line(0, 0, 10, 0), arc(10, 5, 5, 270, 360)])).toBe('M0 0L10 0A5 5 0 0 1 15 5');
    });

    it('la cúbica de una recta va en tercios', () => {
        expect(toCubic(line(0, 0, 3, 6))).toEqual([0, 0, 1, 2, 2, 4, 3, 6]);
    });

    it('la cúbica de un arco de 90° pasa cerca del arco', () => {
        const c = toCubic(arc(0, 0, 10, 0, 90));
        const t = 0.5;
        const x = (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[2] + 3 * (1 - t) * t ** 2 * c[4] + t ** 3 * c[6];
        const y = (1 - t) ** 3 * c[1] + 3 * (1 - t) ** 2 * t * c[3] + 3 * (1 - t) * t ** 2 * c[5] + t ** 3 * c[7];
        expect(Math.hypot(x, y)).toBeCloseTo(10, 1);
    });

    it('espejo y giro conservan la cantidad de trazos', () => {
        const g = search.build(2);
        expect(mirrorX(g).strokes.flat()).toHaveLength(4);
        expect(rotate(g, 1).strokes.flat()).toHaveLength(4);
        expect(rotate(g, 4)).toEqual(g);
    });

    it('memoiza por trazo y junta', () => {
        expect(resolveIcon(search)).toBe(resolveIcon(search, { stroke: 1.5, junta: 0.5 }));
        expect(resolveIcon(search, { stroke: 2 })).not.toBe(resolveIcon(search));
    });

    it('el teselado no pisa ningún trazo', () => {
        const resolved = resolveIcon(search);
        expect(resolved.tiles.length).toBeGreaterThan(10);
    });
});
