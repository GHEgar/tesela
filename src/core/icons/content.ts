import { arc, bend, chain, clearArc, circleBody, line, mirrorY, rect, rectBody, split, toward } from '../draw.js';
import { polar, sampleSegment } from '../geometry.js';
import type { IconDefinition, IconGeometry, Point } from '../geometry.js';

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
    freeAngles: true,
    build: () => ({
        strokes: [[line(7, 2, 12, 10), arc(12, 15, 5, 270, 450), arc(12, 15, 5, 450, 630), line(12, 10, 17, 2)]],
        detail: line(12, 13.5, 12, 16.5),
        body: circleBody(12, 15, 5),
    }),
};

export const lineChart: IconDefinition = {
    name: 'lineChart',
    label: 'Line chart',
    build: (gap) => ({
        strokes: [[line(4, 18, 8, 14), line(8, 14, 11, 17), line(11, 17, 16, 12), line(16, 12, 20, 12)]],
        detail: line(4, 18 + gap, 20, 18 + gap),
    }),
};

export const hexbin: IconDefinition = {
    name: 'hexbin',
    label: 'Hexbin',
    freeAngles: true,
    build: (gap) => {
        const p = [0, 1, 2, 3, 4, 5].map((i) => polar([12, 12], 9, 270 + i * 60));
        const [t, tr, br, b, bl, tl] = p as [Point, Point, Point, Point, Point, Point];
        return {
            strokes: [[line(...br, ...b), line(...b, ...bl), line(...bl, ...tl), line(...tl, ...t)]],
            detail: line(...tr, br[0], br[1] - gap),
            body: p,
        };
    },
};

export const raster: IconDefinition = {
    name: 'raster',
    label: 'Raster',
    build: (gap) => ({
        strokes: [rect(3, 4, 21, 20)],
        detail: arc(12, 22.8 - gap, 6, 210, 330),
        body: rectBody(3, 4, 21, 20),
    }),
};

export const microphone: IconDefinition = {
    name: 'microphone',
    label: 'Microphone',
    build: (gap) => ({
        strokes: [[line(9, 6, 9, 12), arc(12, 12, 3, 180, 0), line(15, 12, 15, 6), arc(12, 6, 3, 0, -180)]],
        detail: arc(12, 12, 3 + gap, 0, 180),
        body: [[9, 6], [9, 12], [12, 15], [15, 12], [15, 6], [12, 3]],
    }),
};

export const diagram: IconDefinition = {
    name: 'diagram',
    label: 'Diagram',
    build: (gap) => ({
        strokes: [[line(5, 20, 5, 12), line(5, 12, 12, 12), line(12, 12, 19, 12), line(19, 12, 19, 20)]],
        detail: line(12, 12 - gap, 12, 4),
    }),
};

export const plug: IconDefinition = {
    name: 'plug',
    label: 'Plug',
    build: (gap) => ({
        strokes: [[line(8, 3, 8, 9), arc(12, 9, 4, 180, 90), arc(12, 9, 4, 90, 0), line(16, 9, 16, 3)]],
        detail: line(12, 13 + gap, 12, 21.5),
        body: [[8, 9], ...Array.from({ length: 9 }, (_, i) => polar([12, 9], 4, 180 - i * 22.5)).slice(1)],
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
    build: (gap) => ({
        strokes: [[line(18, 6, 6, 6), line(6, 6, 12, 12), line(12, 12, 6, 18), line(6, 18, 18, 18)]],
        detail: line(18, 6 + gap, 18, 8 + gap),
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
    freeAngles: true,
    build: (gap) => {
        const reach = gap / Math.sin(Math.atan2(16, 7));
        const legs = [...split(5, 20, 12, 4, 2), ...split(12, 4, 19, 20, 2)];
        return {
            strokes: [legs],
            detail: line(7.4 + reach, 14.5, 16.6 - reach, 14.5),
            body: [[5, 20], [12, 4], [19, 20]],
        };
    },
};

export const apps: IconDefinition = {
    name: 'apps',
    label: 'Apps',
    build: () => {
        const bulge = (cx: number, cy: number, a: number) => arc(cx, cy, 20, a - 23.58, a + 23.58);
        const edges = [bulge(12, 22.33, 270), bulge(1.67, 12, 360), bulge(12, 1.67, 450), bulge(22.33, 12, 540)];
        return {
            strokes: [edges],
            detail: line(11, 12, 13, 12),
            body: edges.flatMap((s) => sampleSegment(s).slice(1)),
        };
    },
};

export const shareNodes: IconDefinition = {
    name: 'shareNodes',
    label: 'Share',
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

export const content = [
    ranking, lineChart, hexbin, raster, microphone, diagram, plug, star, formula, thumbUp, thumbDown, offline,
    translate, apps, shareNodes, bell,
];
