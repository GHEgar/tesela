import { arc, bend, chain, chordAngle, circleBody, line, mirrorX, rect, rectBody, rotate, toward } from '../draw.js';
import { endOf, round, startOf, toDegrees, unit } from '../geometry.js';
import type { Arc, IconDefinition, IconGeometry, Point, Segment } from '../geometry.js';

const verticalArrows = (gap: number): IconGeometry => ({
    strokes: [chain([12, 15], [12, 7], [16.5, 7], [12, 2.5], [7.5, 7]), [line(12, 21.5, 16.5, 17)]],
    detail: line(7.5, 17, ...toward([12, 21.5], [7.5, 17], gap)),
});

const fillet = (a: Point, b: Point, c: Point, r: number): Arc => {
    const u1 = unit(a[0] - b[0], a[1] - b[1]);
    const u2 = unit(c[0] - b[0], c[1] - b[1]);
    const half = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2;
    const t = Math.min(r / Math.tan(half), 2.4);
    const radius = t * Math.tan(half);
    const bisector = unit(u1[0] + u2[0], u1[1] + u2[1]);
    const reach = Math.hypot(t, radius);
    const center: Point = [round(b[0] + bisector[0] * reach), round(b[1] + bisector[1] * reach)];
    const angle = (u: Point): number => toDegrees(Math.atan2(b[1] + u[1] * t - center[1], b[0] + u[0] * t - center[0]));
    const start = angle(u1);
    let end = angle(u2);
    const clockwise = u1[0] * u2[1] - u1[1] * u2[0] <= 0;
    if (clockwise && end < start) end += 360;
    if (!clockwise && end > start) end -= 360;
    return arc(center[0], center[1], round(radius), start, end);
};

const rotation = (gap: number): IconGeometry => {
    const h = Math.max(3.5, gap * Math.SQRT2);
    const cx = 12 - (h - 3.5);
    const e = cx + 7;
    return {
        strokes: [[arc(cx, 13, 7, 180, 360), line(e, 13, e - h, 13), line(e - h, 13, e, 13 + h)]],
        detail: line(e + h, 13, ...toward([e, 13 + h], [e + h, 13], gap)),
    };
};

export const rectangle: IconDefinition = {
    name: 'rectangle',
    label: 'Rectangle',
    build: (gap) => ({
        strokes: [chain([20, 6], [4, 6], [4, 18], [20, 18])],
        detail: line(20, 6 + gap, 20, 18 - gap),
        body: rectBody(4, 6, 20, 18),
    }),
};

export const angle: IconDefinition = {
    name: 'angle',
    label: 'Angle',
    nudge: [0.25, -1.75],
    freeAngles: true,
    build: (gap) => {
        const off = toDegrees(Math.asin(gap / 11));
        return {
            strokes: [chain([21, 19.5], [4, 19.5], [4 + 17 * Math.cos(Math.PI / 3), 19.5 - 17 * Math.sin(Math.PI / 3)])],
            detail: arc(4, 19.5, 11, -60 + off, -off),
        };
    },
};

export const freehand: IconDefinition = {
    name: 'freehand',
    label: 'Freehand',
    nudge: [0.5, 1.25],
    freeAngles: true,
    build: (gap) => {
        const points: Point[] = [[12, 4], [4, 4], [19, 12.5], [6.5, 10], [14, 16.5], [7, 15.5], [6.1, 19]];
        const path: Segment[] = [];
        let at: Point = [12, 4];
        points.slice(1, -1).forEach((b, i) => {
            const turn = fillet(points[i] ?? b, b, points[i + 2] ?? b, 2);
            const to = startOf(turn);
            path.push(i ? line(...at, ...to) : bend(at, to, 16, false), turn);
            at = endOf(turn);
        });
        path.push(line(...at, 6.1, 19));
        const u = unit(15, 8.5);
        const s: Point = [12 + gap + 2.6, 5.2];
        return { strokes: [path], detail: line(s[0], s[1], s[0] + u[0] * 2.5, s[1] + u[1] * 2.5) };
    },
};

export const rotateRight: IconDefinition = { name: 'rotateRight', label: 'Rotate right', nudge: [-2, 1.25], build: rotation };

export const rotateLeft: IconDefinition = {
    name: 'rotateLeft',
    label: 'Rotate left',
    nudge: [2, 1.25],
    build: (gap) => mirrorX(rotation(gap)),
};

export const crop: IconDefinition = {
    name: 'crop',
    label: 'Crop',
    build: (gap) => ({
        strokes: [[line(6, 2, 6, 18)], [line(6, 18, 22, 18)], [line(6 + gap, 6, 18, 6)], [line(18, 6, 18, 22)]],
        detail: line(2, 6, 6 - gap, 6),
        body: rectBody(6, 6, 18, 18),
    }),
};

export const columns: IconDefinition = {
    name: 'columns',
    label: 'Columns',
    build: (gap) => ({
        strokes: [rect(3, 5, 7, 19), rect(10, 5, 14, 19), chain([17, 12], [17, 5], [21, 5]), chain([17, 12], [17, 19], [21, 19])],
        detail: line(21, 5 + gap, 21, 19 - gap),
        body: rectBody(3, 5, 21, 19),
    }),
};

export const text: IconDefinition = {
    name: 'text',
    label: 'Text',
    build: (gap) => ({
        strokes: [chain([5, 7], [5, 4], [12, 4]), chain([12, 4], [19, 4], [19, 7]), [line(12, 4, 12, 11)], [line(12, 11, 12, 17.5)]],
        detail: line(9, 18 + gap, 15, 18 + gap),
    }),
};

export const opacity: IconDefinition = {
    name: 'opacity',
    label: 'Opacity',
    build: (gap) => {
        const inner = 5.4;
        const g = chordAngle(gap, inner);
        return {
            strokes: [[arc(12, 12, 8.5, 0, 120)], [arc(12, 12, 8.5, 120, 240)], [arc(12, 12, 8.5, 240, 360)], [arc(12, 12, inner, 72 + g, 288 - g)]],
            detail: arc(12, 12, inner, -72, 72),
            body: circleBody(12, 12, 8.5),
        };
    },
};

export const swipe: IconDefinition = {
    name: 'swipe',
    label: 'Swipe',
    build: (gap) => {
        const g = chordAngle(gap, 3);
        return {
            strokes: [rect(3, 5, 21, 19), [line(12, 3, 12, 9)], [line(12, 15, 12, 21)], [arc(12, 12, 3, 90, 270)]],
            detail: arc(12, 12, 3, 270 + g, 450 - g),
            body: rectBody(3, 5, 21, 19),
        };
    },
};

export const arrowsVertical: IconDefinition = { name: 'arrowsVertical', label: 'Up and down', build: verticalArrows };
export const arrowsHorizontal: IconDefinition = { name: 'arrowsHorizontal', label: 'Left and right', build: (gap) => rotate(verticalArrows(gap), 1) };

export const focus: IconDefinition = {
    name: 'focus',
    label: 'Focus',
    build: () => ({
        strokes: [chain([4, 9], [4, 4], [9, 4]), [line(15, 4, 20, 4)], [line(20, 4, 20, 9)], chain([9, 20], [4, 20], [4, 15])],
        detail: chain([20, 15], [20, 20], [15, 20]),
    }),
};

export const move: IconDefinition = {
    name: 'move',
    label: 'Move',
    build: () => ({
        strokes: [[line(7, 9.5, 4.5, 12)], [line(4.5, 12, 7, 14.5)], chain([9.5, 7], [12, 4.5], [14.5, 7]), chain([9.5, 17], [12, 19.5], [14.5, 17])],
        detail: chain([17, 9.5], [19.5, 12], [17, 14.5]),
    }),
};

export const pointer: IconDefinition = {
    name: 'pointer',
    label: 'Pointer',
    nudge: [1.5, 0.5],
    freeAngles: true,
    build: () => ({
        strokes: [chain([6, 19], [6, 3], [17, 14])],
        detail: line(10, 12.8, 13.2, 20.6),
        body: [[6, 3], [17, 14], [10, 12.8], [6, 19]],
    }),
};

export const stop: IconDefinition = {
    name: 'stop',
    label: 'Stop',
    build: (gap) => ({
        strokes: [[line(6, 6, 18, 6)], [line(18, 6, 18, 18)], [line(18, 18, 12, 18)], [line(12, 18, 6, 18)]],
        detail: line(6, 7.5 + gap, 6, 16.5 - gap),
        body: rectBody(6, 6, 18, 18),
    }),
};

export const undock: IconDefinition = {
    name: 'undock',
    label: 'Undock',
    nudge: [0.75, -0.75],
    build: (gap) => ({
        strokes: [chain([11, 9], [3, 9], [3, 21], [15, 21], [15, 13]), chain([8.5, 15.5], [17, 7], [14, 4], [20, 4])],
        detail: line(20, 10, 20, 4 + gap),
        body: rectBody(3, 9, 15, 21),
    }),
};

export const swap: IconDefinition = {
    name: 'swap',
    label: 'Swap',
    build: (gap) => {
        const h = Math.max(4, gap * Math.SQRT2);
        return {
            strokes: [chain([4, 8], [20 - h, 8], [20 - h, 8 + h], [20, 8], [20 - h, 8 - h]), chain([20, 16], [4 + h, 16], [4 + h, 16 + h], [4, 16])],
            detail: line(4 + h, 16 - h, ...toward([4, 16], [4 + h, 16 - h], gap)),
        };
    },
};

export const tools = [
    crop, columns, text, opacity, swipe, arrowsVertical, arrowsHorizontal, focus, move, pointer, stop, undock, swap,
    rectangle, angle, freehand, rotateRight, rotateLeft,
];
