import {
    distanceToPolyline, endOf, sampleCubic, sampleSegment, samePoint, startOf, toCubic,
} from './geometry.js';
import type { IconDefinition, Segment } from './geometry.js';

export interface Problem {
    readonly name: string;
    readonly problem: string;
}

export interface ValidateOptions {
    readonly strokes?: readonly number[];
    readonly juntas?: readonly number[];
}

const angleOk = (s: Segment): boolean => {
    if (s.kind === 'arc') return true;
    const a = Math.atan2(s.to[1] - s.from[1], s.to[0] - s.from[0]) * 180 / Math.PI;
    return Math.abs(((a % 45) + 45) % 45) < 0.5 || Math.abs(((a % 45) + 45) % 45 - 45) < 0.5;
};

const checkOne = (definition: IconDefinition, stroke: number, junta: number): string[] => {
    const gap = stroke + junta;
    const geometry = definition.build(gap);
    const segments = geometry.strokes.flat();
    const problems: string[] = [];
    if (segments.length !== 4) problems.push(`${segments.length} trazos principales en vez de 4`);
    if (geometry.strokes.length > (definition.cross ? 2 : 1)) problems.push(`${geometry.strokes.length} pincelazos`);
    for (const chain of geometry.strokes) {
        for (let i = 1; i < chain.length; i++) {
            const prev = chain[i - 1];
            const next = chain[i];
            if (prev && next && !samePoint(endOf(prev), startOf(next))) problems.push('pincelazo sin encadenar');
        }
    }
    const detail = sampleCubic(toCubic(geometry.detail), 32);
    const paths = segments.map(sampleSegment);
    const near = Math.min(...detail.map((p) => Math.min(...paths.map((s) => distanceToPolyline(p, s)))));
    if (near < gap - 0.05) problems.push(`detalle a ${near.toFixed(2)} con hueco ${gap}`);
    if (geometry.detail.kind === 'arc' && Math.abs(geometry.detail.end - geometry.detail.start) > 180) problems.push('detalle en arco de más de 180°');
    if (geometry.detail.kind === 'line' && Math.hypot(geometry.detail.to[0] - geometry.detail.from[0], geometry.detail.to[1] - geometry.detail.from[1]) < 0.3) problems.push('detalle demasiado corto');
    if (!definition.freeAngles && ![...segments, geometry.detail].every(angleOk)) problems.push('recta fuera de 0, 45 y 90°');
    const half = stroke / 2;
    const all = [...paths.flat(), ...detail];
    if (all.some(([x, y]) => x < half - 0.01 || y < half - 0.01 || x > 24 - half + 0.01 || y > 24 - half + 0.01)) problems.push('se sale de la caja');
    return problems.map((p) => `${p} (trazo ${stroke}, junta ${junta})`);
};

export const validate = (definitions: readonly IconDefinition[], options: ValidateOptions = {}): Problem[] => {
    const strokes = options.strokes ?? [1, 1.5, 2, 2.5];
    const juntas = options.juntas ?? [0.25, 0.5, 1, 1.5];
    const combos = new Set([...strokes.map((s) => `${s}|0.5`), ...juntas.map((j) => `1.5|${j}`)]);
    const out: Problem[] = [];
    for (const definition of definitions) {
        const seen = new Set<string>();
        for (const combo of combos) {
            const [s, j] = combo.split('|').map(Number);
            for (const problem of checkOne(definition, s ?? 1.5, j ?? 0.5)) {
                const kind = problem.replace(/ \(.*\)$/, '').replace(/[\d.]+/g, '#');
                if (seen.has(kind)) continue;
                seen.add(kind);
                out.push({ name: definition.name, problem });
            }
        }
    }
    return out;
};
