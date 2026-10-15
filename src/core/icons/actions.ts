import { arc, chain, circleBody, line, mirrorX, mirrorY, split, toward } from '../draw.js';
import { polar } from '../geometry.js';
import type { IconDefinition, IconGeometry, Line, Point, Segment } from '../geometry.js';

const LENS: Point = [10.5, 10.5];
const handle = line(...polar(LENS, 7, 45), 20.5, 20.5);
const reach = (gap: number): number => Math.min(2.5, 4.9 - 1.2 * gap);

const glint = (gap: number, arm: number): Segment => {
    const r = Math.min(4.8, 6.9 - gap);
    let s = 25;
    while (s > 1 && Math.hypot(...polar([arm, 0], r, 225 - s)) < gap) s -= 0.5;
    return arc(...LENS, r, 225 - s, 225 + s);
};

const hook = (base: Point, dx: number, size: number, gap: number): { head: Line[]; detail: Line } => {
    const s = Math.max(size, gap * Math.SQRT2);
    const tip: Point = [base[0] + dx * s, base[1]];
    const outer: Point = [base[0], base[1] - s];
    return { head: chain(base, [base[0], base[1] + s], tip), detail: line(...outer, ...toward(outer, tip, s * Math.SQRT2 - gap)) };
};

const download = (gap: number): IconGeometry => ({
    strokes: [[line(12, 3.5, 12, 10.5), line(12, 10.5, 16.5, 10.5), line(16.5, 10.5, 12, 15), line(12, 15, 7.5, 10.5)]],
    detail: line(4.5, 16 + gap, 19.5, 16 + gap),
});

const undo = (gap: number): IconGeometry => {
    const { head, detail } = hook([8.5, 9], -1, 4, gap);
    return { strokes: [[arc(15, 14.5, 5.5, 90, 0), arc(15, 14.5, 5.5, 0, -90), line(15, 9, 8.5, 9), ...head]], detail };
};

export const search: IconDefinition = {
    name: 'search',
    label: 'Search',
    build: (gap) => ({
        strokes: [[arc(...LENS, 7, 45, 165)], [arc(...LENS, 7, 165, 285)], [arc(...LENS, 7, 285, 405)], [handle]],
        detail: glint(gap, 0),
        body: circleBody(...LENS, 7),
    }),
};

export const zoomOut: IconDefinition = {
    name: 'zoomOut',
    label: 'Zoom out',
    build: (gap) => {
        const a = reach(gap);
        return {
            strokes: [[arc(...LENS, 7, 45, 225)], [arc(...LENS, 7, 225, 405)], [handle], [line(10.5 - a, 10.5, 10.5 + a, 10.5)]],
            detail: glint(gap, a),
            body: circleBody(...LENS, 7),
        };
    },
};

export const zoomIn: IconDefinition = {
    name: 'zoomIn',
    label: 'Zoom in',
    build: (gap) => {
        const a = reach(gap);
        return {
            strokes: [
                [arc(...LENS, 7, 45, 225), arc(...LENS, 7, 225, 405)],
                [handle],
                [line(10.5 - a, 10.5, 10.5 + a, 10.5)],
                [line(10.5, 10.5 - a, 10.5, 10.5 + a)],
            ],
            detail: glint(gap, a),
            body: circleBody(...LENS, 7),
        };
    },
};

export const close: IconDefinition = {
    name: 'close',
    label: 'Close',
    build: (gap) => ({
        strokes: [[line(12, 12, 18, 6)], [line(12, 12, 6, 18)], [line(12, 12, 15, 15)], [line(15, 15, 18, 18)]],
        detail: line(6, 6, ...toward([12, 12], [6, 6], gap)),
    }),
};

export const plus: IconDefinition = {
    name: 'plus',
    label: 'Add',
    build: (gap) => ({
        strokes: [[line(12, 5, 12, 12)], [line(12, 12, 12, 19)], [line(12, 12, 15.5, 12)], [line(15.5, 12, 19, 12)]],
        detail: line(5, 12, 12 - gap, 12),
    }),
};

export const minus: IconDefinition = {
    name: 'minus',
    label: 'Remove',
    build: (gap) => ({
        strokes: [[line(8 + gap, 12, 12, 12), ...split(12, 12, 19, 12, 3)]],
        detail: line(5, 12, 8, 12),
    }),
};

export const filter: IconDefinition = {
    name: 'filter',
    label: 'Filter',
    build: (gap) => ({
        strokes: [[line(10, 20, 10, 11.5), line(10, 11.5, 3.5, 5), line(3.5, 5, 20.5, 5), line(20.5, 5, 14, 11.5)]],
        detail: line(14, 11.5 + gap, 14, 18),
        body: [[3.5, 5], [20.5, 5], [14, 11.5], [10, 11.5]],
    }),
};

export const downloadIcon: IconDefinition = { name: 'download', label: 'Download', build: download };
export const upload: IconDefinition = { name: 'upload', label: 'Upload', build: (gap) => mirrorY(download(gap)) };

export const edit: IconDefinition = {
    name: 'edit',
    label: 'Edit',
    build: (gap) => {
        const k = gap / Math.SQRT2;
        return {
            strokes: [chain([15, 4], [4, 15], [4, 20], [9, 20], [20, 9], [15, 4])],
            detail: line(17.5 - k, 6.5 + k, 8.5, 15.5),
            body: [[15, 4], [4, 15], [4, 20], [9, 20], [20, 9]],
        };
    },
};

export const trash: IconDefinition = {
    name: 'trash',
    label: 'Delete',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(4, 7, 20, 7)], chain([6, 7 + gap], [7, 20], [17, 20], [18, 7 + gap]), [line(10, 11, 10, 16.5)], [line(14, 11, 14, 16.5)]],
        detail: chain([9, 7 - gap], [9, 3], [15, 3], [15, 7 - gap]),
        body: [[6, 7], [18, 7], [17, 20], [7, 20]],
    }),
};

export const copy: IconDefinition = {
    name: 'copy',
    label: 'Copy',
    build: (gap) => ({
        strokes: [chain([9, 9], [20, 9], [20, 20], [9, 20], [9, 9])],
        detail: chain([15, 9 - gap], [15, 4], [4, 4], [4, 15], [9 - gap, 15]),
        body: [[9, 9], [20, 9], [20, 20], [9, 20]],
    }),
};

export const refresh: IconDefinition = {
    name: 'refresh',
    label: 'Refresh',
    build: (gap) => {
        const { head, detail } = hook([12, 5.5], 1, 3.5, gap);
        return {
            strokes: [[arc(12, 13, 7.5, -30, 90), arc(12, 13, 7.5, 90, 270), ...head]],
            detail,
            body: circleBody(12, 13, 7.5),
        };
    },
};

export const undoIcon: IconDefinition = { name: 'undo', label: 'Undo', build: undo };
export const redo: IconDefinition = { name: 'redo', label: 'Redo', build: (gap) => mirrorX(undo(gap)) };

export const history: IconDefinition = {
    name: 'history',
    label: 'History',
    freeAngles: true,
    build: (gap) => {
        const e = polar([12, 13], 7.5, 210);
        const at = (deg: number): Point => [e[0] + 3 * Math.cos(deg * Math.PI / 180), e[1] + 3 * Math.sin(deg * Math.PI / 180)];
        return {
            strokes: [
                [arc(12, 13, 7.5, 300, 420)],
                [arc(12, 13, 7.5, 420, 570)],
                chain(e, at(30), at(-60), at(210)),
                [line(12, 13, ...polar([12, 13], 3.6, 60))],
            ],
            detail: line(12 + (gap + 0.25) * 2 / Math.sqrt(3), 13, 16.2, 13),
            body: circleBody(12, 13, 7.5),
        };
    },
};

export const send: IconDefinition = {
    name: 'send',
    label: 'Send',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(4, 4, 20, 12), line(20, 12, 4, 20), line(4, 20, 8, 12), line(8, 12, 4, 4)]],
        detail: line(8 + gap, 12, 19.9 - 2.24 * gap, 12),
        body: [[4, 4], [20, 12], [4, 20], [8, 12]],
    }),
};

export const share: IconDefinition = {
    name: 'share',
    label: 'Share',
    build: () => ({
        strokes: [[line(10, 5, 5, 5), line(5, 5, 5, 19), line(5, 19, 19, 19), line(19, 19, 19, 14)]],
        detail: line(12, 12, 20, 4),
    }),
};

export const link: IconDefinition = {
    name: 'link',
    label: 'Link',
    build: (gap) => {
        const x = 8.5 + gap;
        const right = Math.max(14, x + gap);
        return {
            strokes: [[
                line(8.5, 17.5, 8.5, 6),
                arc((8.5 + right) / 2, 6, (right - 8.5) / 2, 180, 360),
                line(right, 6, right, 15.5),
                arc((x + right) / 2, 15.5, (right - x) / 2, 0, 180),
            ]],
            detail: line(x, 15.5 - gap, x, 8.5),
        };
    },
};

export const settings: IconDefinition = {
    name: 'settings',
    label: 'Settings',
    build: (gap) => ({
        strokes: [[line(4, 8, 6.49, 8)], [arc(9, 8, 2.5, 0, 180), arc(9, 8, 2.5, 180, 360)], [line(11.5, 8, 20, 8)], [line(4, 16, 14.5 - gap, 16)]],
        detail: [arc(17, 16, 2.5, 0, 180), arc(17, 16, 2.5, 180, 360)],
    }),
};

export const actions = [
    search, zoomIn, zoomOut, close, plus, minus, filter, downloadIcon, upload, edit, trash, copy, refresh,
    undoIcon, redo, history, send, share, link, settings,
];
