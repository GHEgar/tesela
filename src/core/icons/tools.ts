import { arc, chain, chordAngle, circleBody, line, part, rect, rectBody, ring, rotate, toward } from '../draw.js';
import type { IconDefinition, IconGeometry, Point } from '../geometry.js';

const verticalArrows = (gap: number): IconGeometry => ({
    strokes: [[line(6, 9, 12, 3), line(12, 3, 12, 12), line(12, 12, 12, 21), line(12, 21, 18, 15)]],
    detail: part(12, 3, 18, 9, gap * Math.SQRT2),
});

export const crop: IconDefinition = {
    name: 'crop',
    label: 'Crop',
    build: (gap) => ({
        strokes: [[line(2, 6, 18, 6), line(18, 6, 18, 18), line(18, 18, 6, 18), line(6, 18, 6, 2)]],
        detail: line(18 + gap, 18, 22, 18),
        body: rectBody(6, 6, 18, 18),
    }),
};

export const columns: IconDefinition = {
    name: 'columns',
    label: 'Columns',
    build: (gap) => ({
        strokes: [rect(3.5, 5, 20.5, 19)],
        detail: line(12, 5 + gap, 12, 19 - gap),
        body: rectBody(3.5, 5, 20.5, 19),
    }),
};

export const text: IconDefinition = {
    name: 'text',
    label: 'Text',
    build: (gap) => ({
        strokes: [[line(5, 8, 5, 4), line(5, 4, 12, 4), line(12, 4, 19, 4), line(19, 4, 19, 8)]],
        detail: line(12, 4 + gap, 12, 20),
    }),
};

export const opacity: IconDefinition = {
    name: 'opacity',
    label: 'Opacity',
    build: (gap) => ({
        strokes: [ring(12, 12, 8)],
        detail: arc(12, 12, 7.8 - gap, 270, 450),
        body: circleBody(12, 12, 8),
    }),
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
        strokes: [chain([4, 9], [4, 4], [9, 4]), chain([15, 4], [20, 4], [20, 9]), chain([20, 15], [20, 20], [15, 20]), chain([9, 20], [4, 20], [4, 15])],
        detail: line(11.5, 12, 12.5, 12),
    }),
};

export const move: IconDefinition = {
    name: 'move',
    label: 'Move',
    complex: true,
    build: () => ({
        strokes: [
            chain([5.5, 9], [2.5, 12], [5.5, 15]), [line(2.5, 12, 7, 12)],
            chain([9, 5.5], [12, 2.5], [15, 5.5]), [line(12, 2.5, 12, 7)],
            chain([9, 18.5], [12, 21.5], [15, 18.5]), [line(12, 21.5, 12, 17)],
        ],
        detail: chain([18.5, 9], [21.5, 12], [18.5, 15]),
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
        strokes: [rect(3, 9, 15, 21)],
        detail: part(15, 9, 21, 3, gap),
        body: rectBody(3, 9, 15, 21),
    }),
};

export const swap: IconDefinition = {
    name: 'swap',
    label: 'Swap',
    build: (gap) => ({
        strokes: [[line(15, 4.5, 18.5, 8), line(18.5, 8, 5.5, 8), line(5.5, 8, 5.5, 16), line(5.5, 16, 18.5, 16)]],
        detail: part(18.5, 16, 14, 20.5, gap * Math.SQRT2),
    }),
};

export const tools = [crop, columns, text, opacity, swipe, arrowsVertical, arrowsHorizontal, focus, move, pointer, stop, undock, swap];
