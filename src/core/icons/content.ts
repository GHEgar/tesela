import { arc, bend, chain, clearArc, line, mirrorY, rect, rectBody, toward } from '../draw.js';
import { polar, sampleSegment } from '../geometry.js';
import type { IconDefinition, IconGeometry, Point, Segment } from '../geometry.js';

const ring2 = (cx: number, cy: number, r: number) => [arc(cx, cy, r, 0, 180), arc(cx, cy, r, 180, 360)];

const thumb = (): IconGeometry => ({
    strokes: [[
        line(8, 20, 8, 11), line(8, 11, 11, 4), bend([11, 4], [14, 5], 1.6, true), line(14, 5, 13.2, 10),
        line(13.2, 10, 18.6, 10), bend([18.6, 10], [20.3, 12.2], 1.8, true), line(20.3, 12.2, 19, 18.6),
        bend([19, 18.6], [17.2, 20], 1.8, true), line(17.2, 20, 8, 20),
    ]],
    detail: line(4.5, 11.5, 4.5, 20),
    body: [[8, 20], [8, 11], [11, 4], [14, 5], [13.2, 10], [18.6, 10], [20.3, 12.2], [19, 18.6], [17.2, 20]],
});

export const ranking: IconDefinition = {
    name: 'ranking',
    label: 'Ranking',
    nudge: [0.25, -2.25],
    build: () => ({
        strokes: [chain([9, 20], [9, 7], [15, 7], [15, 20]), chain([9, 12], [3, 12], [3, 20]), chain([15, 15], [21, 15], [21, 20]), [line(3, 20, 21, 20)]],
        detail: line(12, 10, 12, 14),
        body: [[3, 20], [3, 12], [9, 12], [9, 7], [15, 7], [15, 15], [21, 15], [21, 20]],
    }),
};

export const lineChart: IconDefinition = {
    name: 'lineChart',
    label: 'Line chart',
    nudge: [0.75, -1],
    build: (gap) => {
        const d = gap / Math.SQRT2 + 0.1;
        return {
            strokes: [[line(4, 3, 4, 20)], [line(4, 20, 21, 20)], [line(7, 15, 11, 11)], [line(11, 11, 14, 14)]],
            detail: line(14 + d, 14 - d, 20, 8),
        };
    },
};

export const hexbin: IconDefinition = {
    name: 'hexbin',
    label: 'Hexbin',
    freeAngles: true,
    build: (gap) => {
        const o = [0, 1, 2, 3, 4, 5].map((i) => polar([12, 12], 9, 270 + i * 60));
        const v = [0, 1, 2, 3, 4, 5].map((i) => polar([12, 12], 5.5, 270 + i * 60));
        const at = (i: number): Point => o[i % 6] ?? [12, 12];
        const iv = (i: number): Point => v[i] ?? [12, 12];
        const half = 1.6;
        return {
            strokes: [chain(at(0), at(1), at(2)), chain(at(2), at(3), at(4)), chain(at(4), at(5), at(0)),
                chain(toward(iv(0), iv(1), half + gap), iv(1), iv(2), iv(3), iv(4), iv(5), toward(iv(0), iv(5), half + gap))],
            detail: chain(toward(iv(0), iv(5), half), iv(0), toward(iv(0), iv(1), half)),
            body: o,
        };
    },
};

export const raster: IconDefinition = {
    name: 'raster',
    label: 'Raster',
    build: (gap) => {
        const a = 0.1 + gap;
        return {
            strokes: [chain([3, 4], [21, 4], [21, 20]), chain([21, 20], [3, 20], [3, 4]), [line(12, 4, 12, 20)], [line(3, 12, 21, 12)]],
            detail: chain([3 + a, 4 + a], [12 - a, 4 + a], [12 - a, 12 - a], [3 + a, 12 - a], [3 + a, 4 + a]),
            body: rectBody(3, 4, 21, 20),
        };
    },
};

export const microphone: IconDefinition = {
    name: 'microphone',
    label: 'Microphone',
    build: (gap) => {
        const half = Math.max(0.3, 3.5 - gap - 0.05);
        return {
            strokes: [
                [arc(12, 7.5, 3.5, 180, 360), line(15.5, 7.5, 15.5, 11.5), arc(12, 11.5, 3.5, 0, 180), line(8.5, 11.5, 8.5, 7.5)],
                [arc(12, 11.5, 6.5, 180, 0)], [line(12, 18, 12, 21)], [line(8.5, 21, 15.5, 21)],
            ],
            detail: line(12 - half, 9.5, 12 + half, 9.5),
            body: [[8.5, 7.5], [12, 4], [15.5, 7.5], [15.5, 11.5], [12, 15], [8.5, 11.5]],
        };
    },
};

export const diagram: IconDefinition = {
    name: 'diagram',
    label: 'Diagram',
    build: (gap) => ({
        strokes: [ring2(12, 5, 2.5), [line(12, 7.5, 12, 12)], chain([6, 15.5], [6, 12], [18, 12], [18, 15.5 - gap]), ring2(6, 18, 2.5)],
        detail: ring2(18, 18, 2.5),
    }),
};

export const plug: IconDefinition = {
    name: 'plug',
    label: 'Plug',
    build: (gap) => ({
        strokes: [[line(6, 8, 18, 8)], [line(18, 8, 18, 11), arc(12, 11, 6, 0, 180), line(6, 11, 6, 8)], [line(9.5, 3, 9.5, 8)], [line(12, 17, 12, 22)]],
        detail: line(14.5, 3, 14.5, 8 - gap),
        body: [[6, 8], [18, 8], [18, 11], ...Array.from({ length: 9 }, (_, i) => polar([12, 11], 6, i * 22.5)).slice(1), [6, 8]],
    }),
};

export const star: IconDefinition = {
    name: 'star',
    label: 'Star',
    freeAngles: true,
    build: (gap) => {
        const v = Array.from({ length: 10 }, (_, i) => polar([12, 12.8], i % 2 ? 4 : 9.8, -90 + i * 36));
        const top = polar([12, 12.8], 9.8, -90);
        const right = polar([12, 12.8], 4, -54);
        return {
            strokes: [chain(...v.slice(1))],
            detail: line(...top, ...toward(right, top, gap)),
            body: v,
        };
    },
};

export const formula: IconDefinition = {
    name: 'formula',
    label: 'Formula',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(18, 4, 6, 4)], [line(6, 4, 12, 12)], [line(12, 12, 6, 20)], chain([6, 20], [18, 20], [18, 17])],
        detail: line(18, 4 + gap, 18, 6.5 + gap),
    }),
};

export const thumbUp: IconDefinition = { name: 'thumbUp', label: 'Thumb up', freeAngles: true, build: thumb };
export const thumbDown: IconDefinition = { name: 'thumbDown', label: 'Thumb down', freeAngles: true, build: () => mirrorY(thumb()) };

export const offline: IconDefinition = {
    name: 'offline',
    label: 'Offline',
    build: (gap) => {
        const slash = line(3.5, 3.5, 20.5, 20.5);
        const [left, right] = clearArc(12, 20, 12, 225, 315, slash, gap + 0.1);
        const l = polar([12, 20], 12, 225);
        const r = polar([12, 20], 12, 315);
        const along = (t: number): Point => [12 + t / Math.SQRT2, 20 - t / Math.SQRT2];
        const cross = 4 * Math.SQRT2;
        return {
            strokes: [chain(l, [12, 20], along(cross - gap)), chain(along(cross + gap), r), [left], [right]],
            detail: slash,
            body: [[12, 20], ...Array.from({ length: 10 }, (_, i) => polar([12, 20], 12, 225 + i * 10))],
        };
    },
};

export const translate: IconDefinition = {
    name: 'translate',
    label: 'Translate',
    nudge: [0, -1.5],
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(4.5, 6 + gap, 10, 16)], [line(9.5, 6 + gap, 4, 16)], chain([12.5, 21], [16.75, 11], [21, 21]), [line(13.56, 18.5, 19.94, 18.5)]],
        detail: line(3, 6, 11, 6),
    }),
};

export const apps: IconDefinition = {
    name: 'apps',
    label: 'Apps',
    build: () => ({
        strokes: [rect(3, 3, 10, 10), rect(14, 3, 21, 10), chain([3, 14], [10, 14], [10, 21]), chain([10, 21], [3, 21], [3, 14])],
        detail: ring2(17.5, 17.5, 3.5),
        body: rectBody(3, 3, 21, 21),
    }),
};

export const shareNodes: IconDefinition = {
    name: 'shareNodes',
    label: 'Share',
    nudge: [-0.75, 0],
    freeAngles: true,
    build: (gap) => {
        const r = 2.6;
        const angle = (from: Point, to: Point): number => (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
        const left: Point = [6, 12];
        const top: Point = [18, 5.5];
        const bottom: Point = [18, 18.5];
        const up = angle(left, top);
        const down = angle(left, bottom);
        const a = polar(left, r, up);
        const b = polar(left, r, down);
        const edge = polar(top, r, angle(top, left));
        const end = toward(bottom, b, r + gap);
        return {
            strokes: [
                [line(...edge, ...a), arc(6, 12, r, up, down - 360), line(...b, ...end)],
                [arc(18, 5.5, r, 0, 180), arc(18, 5.5, r, 180, 360)],
            ],
            detail: [arc(18, 18.5, r, 0, 180), arc(18, 18.5, r, 180, 360)],
        };
    },
};

export const bell: IconDefinition = {
    name: 'bell',
    label: 'Notifications',
    build: () => ({
        strokes: [[line(6, 17, 6, 10.5), arc(12, 10.5, 6, 180, 360), line(18, 10.5, 18, 17), line(18, 17, 6, 17)], [line(12, 4.5, 12, 3)]],
        detail: arc(12, 20, 2, 180, 0),
        body: [[6, 17], [6, 10.5], ...Array.from({ length: 9 }, (_, i) => polar([12, 10.5], 6, 180 + i * 22.5)).slice(1), [18, 17]],
    }),
};

const fourPoint = (cx: number, cy: number, r: number): Segment[] => [
    arc(cx + r, cy - r, r, 180, 90),
    arc(cx + r, cy + r, r, 270, 180),
    arc(cx - r, cy + r, r, 360, 270),
    arc(cx - r, cy - r, r, 90, 0),
];

export const sparkle: IconDefinition = {
    name: 'sparkle',
    label: 'AI',
    build: () => ({
        strokes: [fourPoint(10.5, 13.5, 8)],
        detail: fourPoint(18.5, 5.5, 2.5),
        body: fourPoint(10.5, 13.5, 8).flatMap((s) => sampleSegment(s).slice(1)),
    }),
};

export const content = [
    ranking, lineChart, hexbin, raster, microphone, diagram, plug, star, formula, thumbUp, thumbDown, offline,
    translate, apps, shareNodes, bell, sparkle,
];
