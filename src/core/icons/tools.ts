import { arc, line, part, rect, rectBody, ring, rotate, circleBody } from '../draw.js';
import type { IconDefinition, IconGeometry } from '../geometry.js';

const arrowsVertical = (gap: number): IconGeometry => ({
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
    build: () => ({
        strokes: [[line(12, 5, 3, 5), line(3, 5, 3, 19), line(3, 19, 12, 19), line(12, 19, 12, 2)]],
        detail: line(21, 5, 21, 19),
        body: rectBody(3, 5, 12, 19),
    }),
};

export const arrowsV: IconDefinition = { name: 'arrowsVertical', label: 'Up and down', build: arrowsVertical };
export const arrowsH: IconDefinition = { name: 'arrowsHorizontal', label: 'Left and right', build: (gap) => rotate(arrowsVertical(gap), 1) };

export const focus: IconDefinition = {
    name: 'focus',
    label: 'Focus',
    build: () => ({
        strokes: [rect(4, 4, 20, 20)],
        detail: line(11, 12, 13, 12),
        body: rectBody(4, 4, 20, 20),
    }),
};

export const move: IconDefinition = {
    name: 'move',
    label: 'Move',
    cross: true,
    build: (gap) => ({
        strokes: [[line(5, 9, 2, 12), line(2, 12, 22, 12)], [line(9, 5, 12, 2), line(12, 2, 12, 22)]],
        detail: part(22, 12, 17, 17, gap * Math.SQRT2),
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

export const tools = [crop, columns, text, opacity, swipe, arrowsV, arrowsH, focus, move, undock, swap];
