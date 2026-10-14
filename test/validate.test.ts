import { describe, expect, it } from 'vitest';
import { geometryOf, icons, validate } from 'tesela';

describe('reglas de la identidad', () => {
    it('cada ícono cumple con trazos de 1 a 2.5 y juntas de 0.25 a 1.5', () => {
        expect(validate(icons)).toEqual([]);
    });

    it('los nombres no se repiten', () => {
        const names = icons.map((icon) => icon.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('todo el set sale en cuatro trazos principales y un detalle', () => {
        for (const icon of icons) expect(geometryOf(icon, 2).strokes).toHaveLength(4);
    });
});
