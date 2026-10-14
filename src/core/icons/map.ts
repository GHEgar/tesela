import { arc, circleBody, line, part, rect, rectBody, ring } from '../draw.js';
import { polar, unit } from '../geometry.js';
import type { IconDefinition, Point } from '../geometry.js';

export const layers: IconDefinition = {
    name: 'layers',
    label: 'Layers',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 4, 20, 9), line(20, 9, 12, 14), line(12, 14, 4, 9), line(4, 9, 12, 4)]],
        detail: arc(12, 6.3 + gap, 8, 45, 135),
        body: [[12, 4], [20, 9], [12, 14], [4, 9]],
    }),
};

export const basemap: IconDefinition = {
    name: 'basemap',
    label: 'Basemap',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(6, 5, 18, 5), line(18, 5, 21.5, 19), line(21.5, 19, 2.5, 19), line(2.5, 19, 6, 5)]],
        detail: line(12, 5 + gap, 12, 19 - gap),
        body: [[6, 5], [18, 5], [21.5, 19], [2.5, 19]],
    }),
};

export const ruler: IconDefinition = {
    name: 'ruler',
    label: 'Ruler',
    build: (gap) => ({
        strokes: [rect(2.5, 8, 21.5, 16)],
        detail: line(12, 8 + gap, 12, 12.5),
        body: rectBody(2.5, 8, 21.5, 16),
    }),
};

export const point: IconDefinition = {
    name: 'point',
    label: 'Point',
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
    label: 'Line',
    build: (gap) => ({
        strokes: [[line(3, 20, 7, 16), line(7, 16, 11, 16), line(11, 16, 15, 12), line(15, 12, 15, 8)]],
        detail: part(15, 8, 21, 2, gap),
    }),
};

export const polygon: IconDefinition = {
    name: 'polygon',
    label: 'Polygon',
    build: (gap) => ({
        strokes: [[line(4, 10, 10, 4), line(10, 4, 20, 4), line(20, 4, 20, 20), line(20, 20, 4, 20)]],
        detail: line(4, 20 - gap, 4, 10 + gap),
        body: [[4, 10], [10, 4], [20, 4], [20, 20], [4, 20]],
    }),
};

export const circle: IconDefinition = {
    name: 'circle',
    label: 'Circle',
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
    label: 'Drone',
    build: (gap) => ({
        strokes: [[line(3, 7, 8, 7), line(8, 7, 12, 11), line(12, 11, 16, 7), line(16, 7, 21, 7)]],
        detail: line(9, 11 + gap, 15, 11 + gap),
    }),
};

export const stats: IconDefinition = {
    name: 'stats',
    label: 'Statistics',
    build: (gap) => ({
        strokes: [[line(4, 20, 4, 14), line(4, 14, 10, 14), line(10, 14, 10, 8), line(10, 8, 16, 8)]],
        detail: line(16, 8 - gap, 16, 3),
    }),
};

export const cube: IconDefinition = {
    name: 'cube',
    label: 'Cube',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 12, 4, 7.5), line(4, 7.5, 4, 16.5), line(4, 16.5, 12, 21), line(12, 21, 12, 12)]],
        detail: part(12, 12, 20, 7.5, gap),
        body: [[12, 12], [4, 7.5], [4, 16.5], [12, 21]],
    }),
};

export const compass: IconDefinition = {
    name: 'compass',
    label: 'North',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 3, 18, 12), line(18, 12, 12, 21), line(12, 21, 6, 12), line(6, 12, 12, 3)]],
        detail: line(12, 12 - gap, 12, Math.min(11.5 - gap, 3 + 1.85 * gap)),
        body: [[12, 3], [18, 12], [12, 21], [6, 12]],
    }),
};

export const hummingbird: IconDefinition = {
    name: 'hummingbird',
    label: 'Hummingbird',
    freeAngles: true,
    build: (gap) => {
        const head: Point = [14.5, 9.5];
        const back = polar(head, 3.5, 220);
        const front = polar(head, 3.5, 345);
        const [dx, dy] = unit(1, -0.3);
        const tip: Point = [22.5, front[1] + (22.5 - front[0]) * dy / dx];
        return {
            strokes: [[line(3, 16.5, 11, 16.5), arc(11, 9.5, 7, 90, 0), arc(14.5, 9.5, 3.5, 360, 220), line(...back, 2.5, 19)]],
            detail: line(front[0] + dx * gap, front[1] + dy * gap, ...tip),
            body: [[3, 16.5], [11, 16.5], polar([11, 9.5], 7, 45), [18, 9.5], polar(head, 3.5, 270), back],
        };
    },
};

export const mapIcons = [layers, basemap, ruler, point, polyline, polygon, circle, drone, stats, cube, compass];
export const brand = [hummingbird];
