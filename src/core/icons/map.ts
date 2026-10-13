import { arc, circleBody, line, part, rect, rectBody, ring } from '../draw.js';
import type { IconDefinition } from '../geometry.js';

export const layers: IconDefinition = {
    name: 'layers',
    label: 'Capas',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 4, 20, 9), line(20, 9, 12, 14), line(12, 14, 4, 9), line(4, 9, 12, 4)]],
        detail: arc(12, 6.3 + gap, 8, 45, 135),
        body: [[12, 4], [20, 9], [12, 14], [4, 9]],
    }),
};

export const basemap: IconDefinition = {
    name: 'basemap',
    label: 'Mapa base',
    build: (gap) => ({
        strokes: [rect(3, 5, 21, 19)],
        detail: line(12, 5 + gap, 12, 19 - gap),
        body: rectBody(3, 5, 21, 19),
    }),
};

export const ruler: IconDefinition = {
    name: 'ruler',
    label: 'Regla',
    build: (gap) => ({
        strokes: [rect(2.5, 8, 21.5, 16)],
        detail: line(12, 8 + gap, 12, 12.5),
        body: rectBody(2.5, 8, 21.5, 16),
    }),
};

export const point: IconDefinition = {
    name: 'point',
    label: 'Punto',
    build: (gap) => {
        const half = Math.max(0.4, 5 - gap - 0.2);
        return {
            strokes: [ring(12, 12, 5)],
            detail: line(12, 12 - half, 12, 12 + half),
            body: circleBody(12, 12, 5),
        };
    },
};

export const polyline: IconDefinition = {
    name: 'polyline',
    label: 'Línea',
    build: (gap) => ({
        strokes: [[line(3, 20, 7, 16), line(7, 16, 11, 16), line(11, 16, 15, 12), line(15, 12, 15, 8)]],
        detail: part(15, 8, 21, 2, gap),
    }),
};

export const polygon: IconDefinition = {
    name: 'polygon',
    label: 'Polígono',
    build: (gap) => ({
        strokes: [[line(4, 10, 10, 4), line(10, 4, 20, 4), line(20, 4, 20, 20), line(20, 20, 4, 20)]],
        detail: line(4, 20 - gap, 4, 10 + gap),
        body: [[4, 10], [10, 4], [20, 4], [20, 20], [4, 20]],
    }),
};

export const circle: IconDefinition = {
    name: 'circle',
    label: 'Círculo',
    build: (gap) => {
        const end = 360 - (Math.asin(Math.min(1, gap / 8)) * 180) / Math.PI - 0.5;
        const start = 300 + (Math.asin(Math.min(1, gap / 16)) * 360) / Math.PI;
        return {
            strokes: [[line(12, 12, 20, 12), arc(12, 12, 8, 0, 100), arc(12, 12, 8, 100, 200), arc(12, 12, 8, 200, 300)]],
            detail: arc(12, 12, 8, start, end),
            body: circleBody(12, 12, 8),
        };
    },
};

export const drone: IconDefinition = {
    name: 'drone',
    label: 'Dron',
    build: (gap) => ({
        strokes: [[line(2.5, 7, 8.5, 7), line(8.5, 7, 8.5, 12), line(8.5, 12, 15.5, 12), line(15.5, 12, 15.5, 7)]],
        detail: line(15.5 + gap, 7, 21.5, 7),
    }),
};

export const stats: IconDefinition = {
    name: 'stats',
    label: 'Numeralia',
    build: (gap) => ({
        strokes: [[line(4, 20, 4, 14), line(4, 14, 10, 14), line(10, 14, 10, 8), line(10, 8, 16, 8)]],
        detail: line(16, 8 - gap, 16, 3),
    }),
};

export const cube: IconDefinition = {
    name: 'cube',
    label: 'Cubo',
    build: (gap) => ({
        strokes: [rect(4, 8, 16, 20)],
        detail: part(16, 8, 21, 3, gap),
        body: rectBody(4, 8, 16, 20),
    }),
};

export const compass: IconDefinition = {
    name: 'compass',
    label: 'Norte',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 3, 18, 12), line(18, 12, 12, 21), line(12, 21, 6, 12), line(6, 12, 12, 3)]],
        detail: line(12, 12 - gap, 12, Math.min(11.5 - gap, 3 + 1.85 * gap)),
        body: [[12, 3], [18, 12], [12, 21], [6, 12]],
    }),
};

export const hummingbird: IconDefinition = {
    name: 'hummingbird',
    label: 'Colibrí',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[arc(15, 8, 2.5, 200, 380), line(17.35, 8.86, 6, 20), line(6, 20, 4, 15.5), line(4, 15.5, 12.65, 7.14)]],
        detail: line(17.7 + gap, 7.2, 22.5, 6),
        body: [[12.65, 7.14], [15, 5.5], [17.35, 8.86], [6, 20], [4, 15.5]],
    }),
};

export const mapIcons = [layers, basemap, ruler, point, polyline, polygon, circle, drone, stats, cube, compass];
export const brand = [hummingbird];
