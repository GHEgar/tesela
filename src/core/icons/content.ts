import { arc, clearArc, circleBody, line, mirrorY, rect, rectBody, split } from '../draw.js';
import { polar, sampleSegment } from '../geometry.js';
import type { IconDefinition, IconGeometry, Point } from '../geometry.js';

const thumb = (gap: number): IconGeometry => ({
    strokes: [rect(7, 11, 20, 20)],
    detail: line(9, 11 - gap, 12, 3.5),
    body: rectBody(7, 11, 20, 20),
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
    build: () => {
        const strokes = [arc(22, 2, 10, 180, 90), arc(22, 22, 10, 270, 180), arc(2, 22, 10, 360, 270), arc(2, 2, 10, 90, 0)];
        return {
            strokes: [strokes],
            detail: line(18, 6, 20, 4),
            body: strokes.flatMap((s) => sampleSegment(s).slice(1)),
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
export const thumbDown: IconDefinition = { name: 'thumbDown', label: 'Thumb down', freeAngles: true, build: (gap) => mirrorY(thumb(gap)) };

export const offline: IconDefinition = {
    name: 'offline',
    label: 'Offline',
    build: (gap) => {
        const slash = line(3, 3, 13, 13);
        const [left, right] = clearArc(12, 20, 13, 225, 315, slash, gap);
        const l = polar([12, 20], 13, 225);
        const r = polar([12, 20], 13, 315);
        return {
            strokes: [[right, line(...r, 12, 20), line(12, 20, ...l), left]],
            detail: slash,
            body: [[12, 20], ...Array.from({ length: 10 }, (_, i) => polar([12, 20], 13, 225 + i * 10))],
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
        const top = polar([6, 12], 3, -40);
        const bottom = polar([6, 12], 3, 40);
        return {
            strokes: [[line(19, 5, ...top), arc(6, 12, 3, -40, -180), arc(6, 12, 3, -180, -320), line(...bottom, 19, 19)]],
            detail: line(19, 8 + gap, 19, 16 - gap),
        };
    },
};

export const content = [
    ranking, lineChart, hexbin, raster, microphone, diagram, plug, star, formula, thumbUp, thumbDown, offline,
    translate, apps, shareNodes,
];
