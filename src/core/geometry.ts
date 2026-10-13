export type Point = readonly [number, number];

export interface Line {
    readonly kind: 'line';
    readonly from: Point;
    readonly to: Point;
}

export interface Arc {
    readonly kind: 'arc';
    readonly center: Point;
    readonly radius: number;
    readonly start: number;
    readonly end: number;
}

export type Segment = Line | Arc;

export type Cubic = readonly [number, number, number, number, number, number, number, number];

export interface IconGeometry {
    readonly strokes: readonly (readonly Segment[])[];
    readonly detail: Segment;
    readonly body?: readonly Point[];
}

export interface IconDefinition {
    readonly name: string;
    readonly label: string;
    readonly build: (gap: number) => IconGeometry;
    readonly cross?: boolean;
    readonly freeAngles?: boolean;
    readonly spin?: boolean;
}

export const round = (value: number): number => Math.round(value * 100) / 100;
export const toRadians = (degrees: number): number => degrees * Math.PI / 180;
export const toDegrees = (radians: number): number => radians * 180 / Math.PI;

export const polar = (center: Point, radius: number, angle: number): Point => [
    round(center[0] + radius * Math.cos(toRadians(angle))),
    round(center[1] + radius * Math.sin(toRadians(angle))),
];

export const startOf = (segment: Segment): Point =>
    segment.kind === 'line' ? segment.from : polar(segment.center, segment.radius, segment.start);

export const endOf = (segment: Segment): Point =>
    segment.kind === 'line' ? segment.to : polar(segment.center, segment.radius, segment.end);

export const samePoint = (a: Point, b: Point, tolerance = 0.02): boolean =>
    Math.abs(a[0] - b[0]) < tolerance && Math.abs(a[1] - b[1]) < tolerance;

const arcTo = (arc: Arc): string => {
    const [x, y] = endOf(arc);
    const large = Math.abs(arc.end - arc.start) > 180 ? 1 : 0;
    const sweep = arc.end > arc.start ? 1 : 0;
    return `A${arc.radius} ${arc.radius} 0 ${large} ${sweep} ${x} ${y}`;
};

const continueTo = (segment: Segment): string =>
    segment.kind === 'line' ? `L${segment.to[0]} ${segment.to[1]}` : arcTo(segment);

export const strokePath = (segments: readonly Segment[]): string => {
    const first = segments[0];
    if (!first) return '';
    const [x, y] = startOf(first);
    return `M${x} ${y}${segments.map(continueTo).join('')}`;
};

export const toCubic = (segment: Segment): Cubic => {
    if (segment.kind === 'line') {
        const [x1, y1] = segment.from;
        const [x2, y2] = segment.to;
        return [x1, y1, x1 + (x2 - x1) / 3, y1 + (y2 - y1) / 3, x1 + 2 * (x2 - x1) / 3, y1 + 2 * (y2 - y1) / 3, x2, y2];
    }
    const { center, radius, start, end } = segment;
    const k = 4 / 3 * Math.tan(toRadians(end - start) / 4) * radius;
    const [x0, y0] = polar(center, radius, start);
    const [x3, y3] = polar(center, radius, end);
    return [
        x0, y0,
        x0 - k * Math.sin(toRadians(start)), y0 + k * Math.cos(toRadians(start)),
        x3 + k * Math.sin(toRadians(end)), y3 - k * Math.cos(toRadians(end)),
        x3, y3,
    ];
};

export const cubicPath = (c: Cubic): string =>
    `M${round(c[0])} ${round(c[1])}C${round(c[2])} ${round(c[3])} ${round(c[4])} ${round(c[5])} ${round(c[6])} ${round(c[7])}`;

export const lerpCubic = (a: Cubic, b: Cubic, t: number): Cubic =>
    a.map((value, i) => value + ((b[i] ?? value) - value) * t) as unknown as Cubic;

export const sampleCubic = (c: Cubic, steps = 16): Point[] =>
    Array.from({ length: steps + 1 }, (_, i) => {
        const t = i / steps;
        const u = 1 - t;
        const a = u * u * u;
        const b = 3 * u * u * t;
        const d = 3 * u * t * t;
        const e = t * t * t;
        return [a * c[0] + b * c[2] + d * c[4] + e * c[6], a * c[1] + b * c[3] + d * c[5] + e * c[7]] as const;
    });

export const sampleSegment = (segment: Segment): Point[] => {
    if (segment.kind === 'line') return [segment.from, segment.to];
    const steps = Math.max(2, Math.ceil(Math.abs(segment.end - segment.start) / 4));
    return Array.from({ length: steps + 1 }, (_, i) =>
        polar(segment.center, segment.radius, segment.start + (segment.end - segment.start) * i / steps));
};

export const distanceToSegment = (p: Point, a: Point, b: Point): number => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length)) : 0;
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};

export const distanceToPolyline = (p: Point, points: readonly Point[]): number => {
    let best = Infinity;
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (a && b) best = Math.min(best, distanceToSegment(p, a, b));
    }
    return best;
};

export const unit = (x: number, y: number): Point => {
    const length = Math.hypot(x, y) || 1;
    return [x / length, y / length];
};

export const outwardTangents = (segment: Segment): [Point, Point] => {
    const c = toCubic(segment);
    const s: Point = c[2] === c[0] && c[3] === c[1] ? [c[4], c[5]] : [c[2], c[3]];
    const e: Point = c[4] === c[6] && c[5] === c[7] ? [c[2], c[3]] : [c[4], c[5]];
    return [unit(c[0] - s[0], c[1] - s[1]), unit(c[6] - e[0], c[7] - e[1])];
};

export const insidePolygon = (p: Point, polygon: readonly Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[i];
        const b = polygon[j];
        if (!a || !b) continue;
        if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
};
