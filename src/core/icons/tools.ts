import { arc, chain, chordAngle, circleBody, line, rect, rectBody, rotate, toward } from '../draw.js';
import type { IconDefinition, IconGeometry, Point } from '../geometry.js';

const verticalArrows = (): IconGeometry => ({
    strokes: [[line(12, 9, 12, 15)], [line(12, 15, 12, 21.5)], [line(8, 17.5, 12, 21.5)], [line(16, 17.5, 12, 21.5)]],
    detail: chain([8, 6.5], [12, 2.5], [16, 6.5]),
});

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
            strokes: [[arc(12, 12, 8.5, 0, 120)], [arc(12, 12, 8.5, 120, 240)], [arc(12, 12, 8.5, 240, 360)], [arc(12, 12, inner, 30 + g, 330 - g)]],
            detail: arc(12, 12, inner, 330, 390),
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
export const arrowsHorizontal: IconDefinition = { name: 'arrowsHorizontal', label: 'Left and right', build: () => rotate(verticalArrows(), 1) };

export const focus: IconDefinition = {
    name: 'focus',
    label: 'Focus',
    build: () => ({
        strokes: [chain([4, 9], [4, 4], [9, 4]), chain([15, 4], [20, 4], [20, 9]), chain([20, 15], [20, 20], [15, 20]), chain([9, 20], [4, 20], [4, 15])],
        detail: line(11.5, 12, 12.5, 12),
    }),
};

export const move: IconDefinition = {
    name: 'move',
    label: 'Move',
    build: () => ({
        strokes: [
            chain([6, 8.5], [2.5, 12], [6, 15.5]),
            chain([8.5, 6], [12, 2.5], [15.5, 6]),
            chain([8.5, 18], [12, 21.5], [15.5, 18]),
            [arc(12, 12, 1.8, 0, 180), arc(12, 12, 1.8, 180, 360)],
        ],
        detail: chain([18, 8.5], [21.5, 12], [18, 15.5]),
    }),
};

export const pointer: IconDefinition = {
    name: 'pointer',
    label: 'Pointer',
    build: (gap) => {
        const bottom: Point = [6, 18.5];
        const notch: Point = [10.5, 14];
        return {
            strokes: [chain([17, 14], [6, 3], bottom)],
            detail: [line(...toward(bottom, notch, gap * Math.SQRT2), ...notch)],
            body: [[6, 3], [17, 14], notch, bottom],
        };
    },
};

export const stop: IconDefinition = {
    name: 'stop',
    label: 'Stop',
    build: (gap) => ({
        strokes: [chain([6, 18], [18, 18], [18, 6], [6, 6])],
        detail: line(6, 6 + gap, 6, 14),
        body: rectBody(6, 6, 18, 18),
    }),
};

export const undock: IconDefinition = {
    name: 'undock',
    label: 'Undock',
    build: (gap) => ({
        strokes: [[line(11, 9, 3, 9)], chain([3, 9], [3, 21], [15, 21]), [line(15, 21, 15, 13)], [line(9, 15, 19.7 - gap, 4.3 + gap)]],
        detail: chain([14.5, 4], [20, 4], [20, 9.5]),
        body: rectBody(3, 9, 15, 21),
    }),
};

export const swap: IconDefinition = {
    name: 'swap',
    label: 'Swap',
    build: () => ({
        strokes: [[line(18, 16, 11, 16)], [line(11, 16, 4, 16)], [line(8, 12, 4, 16)], [line(4, 16, 8, 20)]],
        detail: chain([16, 4], [20, 8], [16, 12]),
    }),
};

export const tools = [crop, columns, text, opacity, swipe, arrowsVertical, arrowsHorizontal, focus, move, pointer, stop, undock, swap];
