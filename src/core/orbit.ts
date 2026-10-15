import { chordAngle } from './draw.js';
import { detailSegments, round } from './geometry.js';
import type { IconGeometry } from './geometry.js';

export interface OrbitStroke {
    readonly length: number;
    readonly keyTimes: string;
    readonly dasharray: string;
    readonly dashoffset: string;
    readonly opacityTimes: string;
}

export interface Orbit {
    readonly lap: number;
    readonly strokes: readonly OrbitStroke[];
}

const LAP = 1;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const times = (...values: number[]): string => values.map((v) => String(round(v * 10000) / 10000)).join(';');

export const orbitOf = (geometry: IconGeometry, gap: number): Orbit | null => {
    const details = detailSegments(geometry);
    const head = details[0];
    if (details.length !== 1 || head?.kind !== 'arc' || head.end <= head.start) return null;
    const span = head.end - head.start;
    const g = chordAngle(gap, head.radius);
    const strokes: OrbitStroke[] = [];
    for (const chain of geometry.strokes) {
        const s = chain[0];
        if (chain.length !== 1 || s?.kind !== 'arc' || s.end <= s.start || s.radius !== head.radius) return null;
        if (s.center[0] !== head.center[0] || s.center[1] !== head.center[1]) return null;
        const a = (((s.start - head.start) % 360) + 360) % 360;
        const length = round(s.end - s.start);
        const b = a + length;
        const t1 = clamp((a - span - g) / 720, 0, 0.5);
        const t2 = clamp((b - span - g) / 720, 0, 0.5);
        const t3 = clamp(0.5 + (a + g) / 720, 0.5, 1);
        const t4 = clamp(0.5 + (b + g) / 720, 0.5, 1);
        const full = `${length} ${length + 1}`;
        const none = `0 ${length + 1}`;
        strokes.push({
            length,
            keyTimes: times(0, t1, t2, t3, t4, 1),
            dasharray: [full, full, none, none, full, full].join(';'),
            dashoffset: ['0', '0', String(-length), '0', '0', '0'].join(';'),
            opacityTimes: times(0, t2, t3),
        });
    }
    return { lap: LAP, strokes };
};
