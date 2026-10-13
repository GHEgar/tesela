import {
    distanceToPolyline, endOf, insidePolygon, outwardTangents, round, sampleCubic, sampleSegment, samePoint,
    startOf, strokePath, toCubic, unit,
} from './geometry.js';
import type { Cubic, IconDefinition, IconGeometry, Point, Segment } from './geometry.js';

export interface ResolveOptions {
    readonly stroke?: number;
    readonly junta?: number;
}

export interface Tile {
    readonly points: string;
    readonly tone: number;
    readonly delay: number;
}

export interface ResolvedIcon {
    readonly name: string;
    readonly stroke: number;
    readonly gap: number;
    readonly geometry: IconGeometry;
    readonly strokes: readonly string[];
    readonly detail: Cubic;
    readonly seams: readonly string[];
    readonly tiles: readonly Tile[];
}

export const defaults = { stroke: 1.5, junta: 0.5 } as const;

const TILE = 2.5;

interface End {
    readonly at: Point;
    readonly out: Point;
}

const seamLines = (segments: readonly Segment[], stroke: number): string[] => {
    const h = stroke / 2;
    const ends: End[] = segments.flatMap((s) => {
        const [a, b] = outwardTangents(s);
        return [{ at: startOf(s), out: a }, { at: endOf(s), out: b }];
    });
    const groups: End[][] = [];
    for (const end of ends) {
        const group = groups.find((g) => g[0] && samePoint(g[0].at, end.at));
        if (group) group.push(end);
        else groups.push([end]);
    }
    const lines: [number, number, number, number][] = [];
    for (const group of groups) {
        const [a, b] = group;
        if (!a || !b) continue;
        const [x, y] = a.at;
        if (group.length === 2) {
            const dot = a.out[0] * b.out[0] + a.out[1] * b.out[1];
            if (dot < -0.999) {
                lines.push([x - a.out[1] * h, y + a.out[0] * h, x + a.out[1] * h, y - a.out[0] * h]);
                continue;
            }
            const m = unit(a.out[0] + b.out[0], a.out[1] + b.out[1]);
            const w = h / Math.sin(Math.acos(Math.max(-1, Math.min(1, dot))) / 2);
            lines.push([x + m[0] * h, y + m[1] * h, x - m[0] * w, y - m[1] * w]);
            continue;
        }
        for (const e of group) {
            const cx = x - e.out[0] * h;
            const cy = y - e.out[1] * h;
            lines.push([cx - e.out[1] * h, cy + e.out[0] * h, cx + e.out[1] * h, cy - e.out[0] * h]);
        }
    }
    return lines.map(([x1, y1, x2, y2]) => `M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`);
};

const tilesFor = (geometry: IconGeometry, detail: Cubic, stroke: number, junta: number): Tile[] => {
    const body = geometry.body;
    if (!body) return [];
    const h = TILE / 2 - 0.3;
    const clear = stroke / 2 + h + junta;
    const paths = [...geometry.strokes.flat().map(sampleSegment), sampleCubic(detail)];
    const out: Tile[] = [];
    for (let row = 0, y = 0; y <= 24; y += TILE / 2, row++) {
        for (let x = (row % 2) * TILE / 2; x <= 24; x += TILE) {
            if (!insidePolygon([x, y], body)) continue;
            if (paths.some((p) => distanceToPolyline([x, y], p) < clear)) continue;
            const hash = ((Math.round(x * 10) * 73856093) ^ (Math.round(y * 10) * 19349663)) >>> 0;
            out.push({
                points: `${round(x)},${round(y - h)} ${round(x + h)},${round(y)} ${round(x)},${round(y + h)} ${round(x - h)},${round(y)}`,
                tone: 1 + (hash % 5),
                delay: round(0.2 + (hash % 97) / 97 * 0.35),
            });
        }
    }
    return out;
};

const cache = new Map<string, ResolvedIcon>();

export const resolveIcon = (definition: IconDefinition, options: ResolveOptions = {}): ResolvedIcon => {
    const stroke = options.stroke ?? defaults.stroke;
    const junta = options.junta ?? defaults.junta;
    const key = `${definition.name}|${stroke}|${junta}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const gap = stroke + junta;
    const geometry = definition.build(gap);
    const detail = toCubic(geometry.detail);
    const resolved: ResolvedIcon = {
        name: definition.name,
        stroke,
        gap,
        geometry,
        strokes: geometry.strokes.map(strokePath),
        detail,
        seams: seamLines(geometry.strokes.flat(), stroke),
        tiles: tilesFor(geometry, detail, stroke, junta),
    };
    cache.set(key, resolved);
    return resolved;
};
