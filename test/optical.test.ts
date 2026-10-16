import { describe, expect, it } from 'vitest';
import { detailSegments, geometryOf, icons, sampleSegment } from 'tesela';
import type { IconDefinition, Point } from 'tesela';

const asymmetric = new Set([
    'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'arrowsVertical', 'arrowsHorizontal', 'expand', 'send', 'check',
    'home', 'filter', 'alert', 'lock', 'document', 'text', 'microphone', 'star', 'bell', 'stop',
]);

const opticalOffset = (icon: IconDefinition): Point => {
    const geometry = geometryOf(icon, 2);
    const box = [Infinity, Infinity, -Infinity, -Infinity];
    let sx = 0;
    let sy = 0;
    let total = 0;
    for (const segment of [...geometry.strokes.flat(), ...detailSegments(geometry)]) {
        const points = sampleSegment(segment);
        points.forEach(([x, y], i) => {
            box[0] = Math.min(box[0] ?? x, x);
            box[1] = Math.min(box[1] ?? y, y);
            box[2] = Math.max(box[2] ?? x, x);
            box[3] = Math.max(box[3] ?? y, y);
            const prev = points[i - 1];
            if (!prev) return;
            const length = Math.hypot(x - prev[0], y - prev[1]);
            sx += (x + prev[0]) / 2 * length;
            sy += (y + prev[1]) / 2 * length;
            total += length;
        });
    }
    const [minX = 12, minY = 12, maxX = 12, maxY = 12] = box;
    const mass: Point = total ? [sx / total, sy / total] : [12, 12];
    return [((minX + maxX) / 2 + mass[0]) / 2 - 12, ((minY + maxY) / 2 + mass[1]) / 2 - 12];
};

describe('centrado óptico', () => {
    it('el centro óptico de cada ícono cae a menos de 0.5 del centro del viewBox', () => {
        const off = icons
            .filter((icon) => !icon.spin && !asymmetric.has(icon.name))
            .map((icon) => ({ name: icon.name, offset: opticalOffset(icon) }))
            .filter(({ offset }) => Math.abs(offset[0]) > 0.5 || Math.abs(offset[1]) > 0.5)
            .map(({ name }) => name);
        expect(off).toEqual([]);
    });

    it('logout y login quedan a menos de 0.25', () => {
        for (const name of ['logout', 'login']) {
            const icon = icons.find((i) => i.name === name);
            expect(icon).toBeDefined();
            if (!icon) continue;
            const [x, y] = opticalOffset(icon);
            expect(Math.abs(x)).toBeLessThanOrEqual(0.25);
            expect(Math.abs(y)).toBeLessThanOrEqual(0.25);
        }
    });
});
