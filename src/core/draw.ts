import { distanceToSegment, polar, round, toDegrees } from './geometry.js';
import type { Arc, IconGeometry, Line, Point, Segment } from './geometry.js';

export const line = (x1: number, y1: number, x2: number, y2: number): Line =>
    ({ kind: 'line', from: [round(x1), round(y1)], to: [round(x2), round(y2)] });

export const arc = (cx: number, cy: number, radius: number, start: number, end: number): Arc =>
    ({ kind: 'arc', center: [cx, cy], radius, start: round(start), end: round(end) });

export const part = (x1: number, y1: number, x2: number, y2: number, from: number, to?: number): Line => {
    const length = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / length;
    const uy = (y2 - y1) / length;
    const end = to === undefined ? length : to < 0 ? length + to : to;
    return line(x1 + ux * from, y1 + uy * from, x1 + ux * end, y1 + uy * end);
};

export const split = (x1: number, y1: number, x2: number, y2: number, pieces: number): Line[] =>
    Array.from({ length: pieces }, (_, i) => line(
        x1 + (x2 - x1) * i / pieces,
        y1 + (y2 - y1) * i / pieces,
        x1 + (x2 - x1) * (i + 1) / pieces,
        y1 + (y2 - y1) * (i + 1) / pieces,
    ));

export const chordAngle = (gap: number, radius: number): number =>
    toDegrees(2 * Math.asin(Math.min(1, gap / (2 * radius))));

export const clearArc = (cx: number, cy: number, radius: number, start: number, end: number, avoid: Line, gap: number): [Arc, Arc] => {
    const steps = Math.ceil(Math.abs(end - start) * 4);
    let first = -1;
    let last = -1;
    for (let i = 0; i <= steps; i++) {
        const p = polar([cx, cy], radius, start + (end - start) * i / steps);
        if (distanceToSegment(p, avoid.from, avoid.to) < gap) {
            if (first < 0) first = i;
            last = i;
        }
    }
    const at = (i: number): number => start + (end - start) * i / steps;
    return [arc(cx, cy, radius, start, at(first - 1)), arc(cx, cy, radius, at(last + 1), end)];
};

const mapPoint = (p: Point, f: (p: Point) => Point): Point => {
    const [x, y] = f(p);
    return [round(x), round(y)];
};

const mapSegment = (segment: Segment, f: (p: Point) => Point, angle: (a: number) => number): Segment =>
    segment.kind === 'line'
        ? { kind: 'line', from: mapPoint(segment.from, f), to: mapPoint(segment.to, f) }
        : { ...segment, center: mapPoint(segment.center, f), start: round(angle(segment.start)), end: round(angle(segment.end)) };

const mapGeometry = (geometry: IconGeometry, f: (p: Point) => Point, angle: (a: number) => number): IconGeometry => ({
    strokes: geometry.strokes.map((stroke) => stroke.map((s) => mapSegment(s, f, angle))),
    detail: mapSegment(geometry.detail, f, angle),
    ...(geometry.body ? { body: geometry.body.map((p) => mapPoint(p, f)) } : {}),
});

export const mirrorX = (geometry: IconGeometry): IconGeometry =>
    mapGeometry(geometry, ([x, y]) => [24 - x, y], (a) => 180 - a);

export const mirrorY = (geometry: IconGeometry): IconGeometry =>
    mapGeometry(geometry, ([x, y]) => [x, 24 - y], (a) => -a);

export const rotate = (geometry: IconGeometry, quarterTurns: number): IconGeometry => {
    let result = geometry;
    for (let i = 0; i < ((quarterTurns % 4) + 4) % 4; i++) {
        result = mapGeometry(result, ([x, y]) => [24 - y, x], (a) => a + 90);
    }
    return result;
};

export const circleBody = (cx: number, cy: number, radius: number): Point[] =>
    Array.from({ length: 36 }, (_, i) => polar([cx, cy], radius, i * 10));

export const rect = (x1: number, y1: number, x2: number, y2: number): Line[] =>
    [line(x1, y1, x2, y1), line(x2, y1, x2, y2), line(x2, y2, x1, y2), line(x1, y2, x1, y1)];

export const rectBody = (x1: number, y1: number, x2: number, y2: number): Point[] =>
    [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

export const ring = (cx: number, cy: number, radius: number): Arc[] =>
    [0, 90, 180, 270].map((a) => arc(cx, cy, radius, a, a + 90));
