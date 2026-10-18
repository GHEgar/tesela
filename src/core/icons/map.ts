import { arc, chain, chordAngle, circleBody, line, part, rect, rectBody, ring, toward } from '../draw.js';
import { distanceToSegment, endOf, polar, toDegrees } from '../geometry.js';
import type { IconDefinition, Point, Segment } from '../geometry.js';

type Edge = readonly [Point, Point];

const disc = (cx: number, cy: number, r: number): Segment[] => [arc(cx, cy, r, 0, 180), arc(cx, cy, r, 180, 360)];

const angleOf = (from: Point, to: Point): number => toDegrees(Math.atan2(to[1] - from[1], to[0] - from[0]));

const clearUntil = (from: Point, to: Point, edges: readonly Edge[], gap: number): Point => {
    const at = (t: number): Point => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
    const ok = (t: number): boolean => edges.every(([a, b]) => distanceToSegment(at(t), a, b) >= gap);
    let t = 0;
    while (t < 1 && ok(Math.min(1, t + 0.002))) t = Math.min(1, t + 0.002);
    return at(t);
};

const edgesOf = (t: readonly Point[]): Edge[] =>
    t.map((p, i) => [p, t[(i + 1) % t.length] ?? p] as const);

export const layers: IconDefinition = {
    name: 'layers',
    label: 'Layers',
    nudge: [0, -1.25],
    freeAngles: true,
    build: (gap) => {
        const d = 1 + 1.25 * gap;
        const top = 7.5 - d;
        const tri = (y: number): [Point, Point, Point] => [[12, y], [20.5, y + 10], [3.5, y + 10]];
        const [back, middle, front] = [tri(top), tri(top + d), tri(top + 2 * d)];
        const clip = ([apex, right, left]: [Point, Point, Point], edges: Edge[]): Segment[] =>
            chain(clearUntil(left, right, edges, gap), left, apex, right, clearUntil(right, left, edges, gap));
        const [a, b, c] = front;
        const inner = 12 + 8.5 * (10 - d) / 10;
        const side = (y: number): Point[] => [[20.5, y + 10], [inner, y + 10]];
        const right = [...side(top), ...side(top + d), [20.5, top + 2 * d + 10] as Point];
        return {
            strokes: [clip(middle, edgesOf(front)), clip(back, [...edgesOf(front), ...edgesOf(middle)])],
            detail: chain(b, a, c, b),
            body: [[12, top], ...right, ...right.map(([x, y]): Point => [24 - x, y]).reverse()],
        };
    },
};

export const basemap: IconDefinition = {
    name: 'basemap',
    label: 'Basemap',
    freeAngles: true,
    build: (gap) => {
        const outline: Point[] = [[3, 6], [9, 4], [15, 6], [21, 4], [21, 18], [15, 20], [9, 18], [3, 20]];
        return {
            strokes: [chain(...outline, [3, 6]), [line(9, 4, 9, 18)]],
            detail: line(15, 6 + gap, 15, 20 - gap * Math.hypot(1, 3) / 3),
            body: outline,
        };
    },
};

export const ruler: IconDefinition = {
    name: 'ruler',
    label: 'Ruler',
    build: (gap) => ({
        strokes: [rect(2.5, 8, 21.5, 16), [line(6, 8, 6, 11)], [line(10, 8, 10, 12.5)], [line(14, 8, 14, 11)]],
        detail: line(18, 8 + gap, 18, 12.5),
        body: rectBody(2.5, 8, 21.5, 16),
    }),
};

export const point: IconDefinition = {
    name: 'point',
    label: 'Point',
    build: () => ({
        strokes: [ring(12, 12, 5)],
        detail: line(12, 12, 12, 12),
        body: circleBody(12, 12, 5),
    }),
};

export const polyline: IconDefinition = {
    name: 'polyline',
    label: 'Line',
    freeAngles: true,
    build: (gap) => {
        const r = 2;
        const n: Point[] = [[4.5, 19], [9.5, 11.5], [14.5, 15.5], [19.5, 5]];
        const node = (i: number): Point => n[i] ?? [12, 12];
        const strokes: Segment[][] = [];
        const first = angleOf(node(0), node(1));
        const reach = polar(node(1), r, angleOf(node(1), node(0)));
        strokes.push([arc(...node(0), r, first - 300, first), line(...polar(node(0), r, first), ...reach)]);
        for (const i of [1, 2]) {
            const from = angleOf(node(i), node(i - 1));
            const out = angleOf(node(i), node(i + 1));
            let end = out < from ? out + 360 : out;
            if (end - from < 180) end -= 360;
            const exit = polar(node(i), r, out);
            const next = i === 2 ? toward(node(3), exit, r + gap + 1) : polar(node(i + 1), r, angleOf(node(i + 1), node(i)));
            strokes.push([arc(...node(i), r, from, end), line(...exit, ...next)]);
        }
        return { strokes, detail: disc(19.5, 5, r) };
    },
};

export const polygon: IconDefinition = {
    name: 'polygon',
    label: 'Polygon',
    freeAngles: true,
    build: (gap) => {
        const r = 2.2;
        const n: Point[] = [[19, 19], [6, 19], [4.5, 7], [17, 4.5]];
        const node = (i: number): Point => n[(i + n.length) % n.length] ?? [12, 12];
        const center: Point = [n.reduce((s, p) => s + p[0], 0) / n.length, n.reduce((s, p) => s + p[1], 0) / n.length];
        const path: Segment[] = [];
        let at = toward(node(0), node(1), r + gap + 1);
        for (const i of [1, 2, 3]) {
            const from = angleOf(node(i), node(i - 1));
            const out = angleOf(node(i), node(i + 1));
            let cw = out;
            while (cw <= from) cw += 360;
            let ccw = out;
            while (ccw >= from) ccw -= 360;
            const far = (end: number): number => {
                const [x, y] = polar(node(i), r, (from + end) / 2);
                return Math.hypot(x - center[0], y - center[1]);
            };
            const turn = arc(...node(i), r, from, far(cw) > far(ccw) ? cw : ccw);
            const entry = polar(node(i), r, from);
            path.push(line(...at, ...entry), turn);
            at = endOf(turn);
        }
        path.push(line(...at, ...toward(node(0), node(3), r + gap + 1)));
        return { strokes: [path], detail: disc(...node(0), r), body: n };
    },
};

export const circle: IconDefinition = {
    name: 'circle',
    label: 'Circle',
    build: (gap) => {
        const start = -10 + chordAngle(gap, 8);
        const step = (300 - chordAngle(gap, 8) - start) / 4;
        return {
            strokes: [0, 1, 2, 3].map((i) => [arc(12, 12, 8, start + step * i, start + step * (i + 1))]),
            detail: arc(12, 12, 8, -60, -10),
            body: circleBody(12, 12, 8),
        };
    },
};

export const drone: IconDefinition = {
    name: 'drone',
    label: 'Drone',
    build: (gap) => {
        const r = 3.2;
        const end = Math.min(15, 17.5 - Math.sqrt(Math.max(0, (r + gap + 0.05) ** 2 - 5.5 ** 2)));
        return {
            strokes: [disc(6.5, 6.5, r), disc(17.5, 6.5, r), disc(6.5, 17.5, r), [line(12, 24 - end, 12, end)]],
            detail: disc(17.5, 17.5, r),
        };
    },
};

export const stats: IconDefinition = {
    name: 'stats',
    label: 'Statistics',
    nudge: [0.25, -2.25],
    build: (gap) => ({
        strokes: [[line(3, 18, 7, 14)], [line(7, 14, 10, 17)], [line(10, 17, 14, 13)], [line(14, 13, 16, 15)]],
        detail: part(16, 15, 21, 10, Math.max(gap, 1.5 * Math.SQRT2)),
    }),
};

export const cube: IconDefinition = {
    name: 'cube',
    label: 'Cube',
    freeAngles: true,
    build: (gap) => {
        const hex = [0, 1, 2, 3, 4, 5].map((i) => polar([12, 12], 9, 270 + i * 60));
        const h = (i: number): Point => hex[i] ?? [12, 12];
        return {
            strokes: [chain(h(0), h(1), h(2)), chain(h(2), h(3), h(4)), chain(h(4), h(5), h(0)), chain(h(5), [12, 12], h(3))],
            detail: line(...toward([12, 12], h(1), gap), ...toward(h(1), [12, 12], gap * 2 / Math.sqrt(3))),
            body: hex,
        };
    },
};

export const compass: IconDefinition = {
    name: 'compass',
    label: 'North',
    freeAngles: true,
    build: (gap) => {
        const o: Point[] = [[12, 2.5], [19, 12], [12, 21.5], [5, 12]];
        const reach = 7 * 9.5 / Math.hypot(7, 9.5);
        const s = Math.min(0.5, 1 - (gap + 0.05) / reach);
        const [i0, i1, i2, i3] = o.map(([x, y]): Point => [12 + (x - 12) * s, 12 + (y - 12) * s]) as [Point, Point, Point, Point];
        const [o0, o1, o2, o3] = o as [Point, Point, Point, Point];
        const h = 1.6;
        return {
            strokes: [chain(o0, o1, o2), chain(o2, o3), chain(o3, o0), chain(toward(i0, i1, h + gap), i1, i2, i3, toward(i0, i3, h + gap))],
            detail: chain(toward(i0, i3, h), i0, toward(i0, i1, h)),
            body: o,
        };
    },
};

export const locate: IconDefinition = {
    name: 'locate',
    label: 'My location',
    build: () => ({
        strokes: [
            [line(12, 2, 12, 5), arc(12, 12, 7, 270, 360), line(19, 12, 22, 12)],
            [line(12, 22, 12, 19), arc(12, 12, 7, 90, 180), line(5, 12, 2, 12)],
            [arc(12, 12, 7, 0, 90)],
            [arc(12, 12, 7, 180, 270)],
        ],
        detail: disc(12, 12, 2.5),
        body: circleBody(12, 12, 7),
    }),
};

export const legend: IconDefinition = {
    name: 'legend',
    label: 'Legend',
    nudge: [1.25, 0],
    build: (gap) => {
        const row = (y: number): Segment[] => chain([7, y], [7, y + 1.75], [3.5, y + 1.75], [3.5, y - 1.75], [7, y - 1.75], [7, y], [20.5, y]);
        return {
            strokes: [row(5.25), [line(7 + gap, 12, 20.5, 12)], row(18.75)],
            detail: chain([3.5, 10.25], [7, 10.25], [7, 13.75], [3.5, 13.75], [3.5, 10.25]),
        };
    },
};

export const hummingbird: IconDefinition = {
    name: 'hummingbird',
    label: 'Hummingbird',
    nudge: [0.75, -1.25],
    freeAngles: true,
    build: (gap) => {
        const head: Point = [14.5, 9.5];
        const back = polar(head, 3.5, 220);
        const front = polar(head, 3.5, 345);
        const tip: Point = [21, 7.8];
        const beak = Math.hypot(tip[0] - front[0], tip[1] - front[1]) - 2;
        return {
            strokes: [
                [line(3, 16.5, 11, 16.5), arc(11, 9.5, 7, 90, 0), arc(14.5, 9.5, 3.5, 360, 220), line(...back, 2.5, 19)],
                [line(7, 16.5, 6.5, 20)],
                [line(10, 16.5, 9.5, 20)],
            ],
            detail: line(...toward(front, tip, gap), ...toward(front, tip, gap + beak)),
            body: [[3, 16.5], [11, 16.5], polar([11, 9.5], 7, 45), [18, 9.5], polar(head, 3.5, 270), back],
        };
    },
};

export const mapIcons = [layers, basemap, ruler, point, polyline, polygon, circle, drone, stats, cube, compass, locate, legend];
export const brand = [hummingbird];
