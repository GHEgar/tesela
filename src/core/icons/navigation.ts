import { line, mirrorX, mirrorY, part, rotate, split } from '../draw.js';
import type { IconDefinition, IconGeometry } from '../geometry.js';

const chevron = (gap: number): IconGeometry => {
    const rest = part(6, 9, 12, 15, 2.5 + gap);
    return {
        strokes: [[...split(rest.from[0], rest.from[1], 12, 15, 2), ...split(12, 15, 18, 9, 2)]],
        detail: part(6, 9, 12, 15, 0, 2.5),
    };
};

const arrow = (gap: number): IconGeometry => ({
    strokes: [[line(7.5 + gap, 12, 15, 12), line(15, 12, 15, 16.5), line(15, 16.5, 19.5, 12), line(19.5, 12, 15, 7.5)]],
    detail: line(4.5, 12, 7.5, 12),
});

export const menu: IconDefinition = {
    name: 'menu',
    label: 'Menú',
    build: (gap) => ({
        strokes: [[line(20, 6, 4, 6), line(4, 6, 4, 12), line(4, 12, 4, 18), line(4, 18, 20, 18)]],
        detail: line(4 + gap, 12, 17, 12),
    }),
};

export const chevronDown: IconDefinition = { name: 'chevronDown', label: 'Abrir', build: chevron };
export const chevronUp: IconDefinition = { name: 'chevronUp', label: 'Contraer', build: (gap) => mirrorY(chevron(gap)) };
export const chevronLeft: IconDefinition = { name: 'chevronLeft', label: 'Anterior', build: (gap) => rotate(chevron(gap), 1) };
export const chevronRight: IconDefinition = { name: 'chevronRight', label: 'Siguiente', build: (gap) => mirrorX(rotate(chevron(gap), 1)) };
export const arrowRight: IconDefinition = { name: 'arrowRight', label: 'Avanzar', build: arrow };
export const arrowLeft: IconDefinition = { name: 'arrowLeft', label: 'Volver', build: (gap) => mirrorX(arrow(gap)) };

export const home: IconDefinition = {
    name: 'home',
    label: 'Inicio',
    build: (gap) => ({
        strokes: [[line(6, 20, 6, 11), line(6, 11, 12, 5), line(12, 5, 18, 11), line(18, 11, 18, 20)]],
        detail: line(6 + gap, 20, 18 - gap, 20),
        body: [[6, 20], [6, 11], [12, 5], [18, 11], [18, 20]],
    }),
};

export const expand: IconDefinition = {
    name: 'expand',
    label: 'Ampliar',
    build: (gap) => ({
        strokes: [[line(20, 10, 20, 4), line(20, 4, 12, 12), line(12, 12, 4, 20), line(4, 20, 4, 14)]],
        detail: line(12, 4, 20 - gap * Math.SQRT2, 4),
    }),
};

export const collapse: IconDefinition = {
    name: 'collapse',
    label: 'Reducir',
    build: (gap) => ({
        strokes: [[line(14, 4, 14, 10), line(14, 10, 12, 12), line(12, 12, 10, 14), line(10, 14, 10, 20)]],
        detail: line(14 + gap * Math.SQRT2, 10, 21, 10),
    }),
};

export const navigation = [
    menu, chevronDown, chevronUp, chevronLeft, chevronRight, arrowLeft, arrowRight, home, expand, collapse,
];
