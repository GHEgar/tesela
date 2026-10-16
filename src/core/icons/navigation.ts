import { chain, line, mirrorX, mirrorY, rotate, split, toward } from '../draw.js';
import type { IconDefinition, IconGeometry, Point } from '../geometry.js';

const turn = (p: Point): Point => [
    12 + (p[0] - 12 - (p[1] - 12)) * Math.SQRT1_2,
    12 + (p[0] - 12 + (p[1] - 12)) * Math.SQRT1_2,
];

const turnedChain = (...points: Point[]) => chain(...points.map(turn));

const turnedLine = (from: Point, to: Point) => {
    const [a, b] = [turn(from), turn(to)];
    return line(a[0], a[1], b[0], b[1]);
};

const chevron = (gap: number): IconGeometry => {
    const [x, y] = toward([12, 15], [6, 9], gap);
    return {
        strokes: [split(12, 15, 18, 9, 4)],
        detail: line(6, 9, x, y),
    };
};

const arrow = (gap: number): IconGeometry => {
    const [x, y] = toward([19.5, 12], [15, 7.5], gap);
    return {
        strokes: [chain([4.5, 12], [15, 12], [15, 16.5], [19.5, 12])],
        detail: line(15, 7.5, x, y),
    };
};

export const menu: IconDefinition = {
    name: 'menu',
    label: 'Menu',
    build: () => ({
        strokes: [[line(4, 6, 12, 6)], [line(12, 6, 20, 6)], [line(4, 14, 20, 14)], [line(4, 18, 20, 18)]],
        detail: line(4, 10, 14, 10),
    }),
};

export const chevronDown: IconDefinition = { name: 'chevronDown', label: 'Show more', build: chevron };
export const chevronUp: IconDefinition = { name: 'chevronUp', label: 'Show less', build: (gap) => mirrorY(chevron(gap)) };
export const chevronLeft: IconDefinition = { name: 'chevronLeft', label: 'Previous', build: (gap) => rotate(chevron(gap), 1) };
export const chevronRight: IconDefinition = { name: 'chevronRight', label: 'Next', build: (gap) => rotate(chevron(gap), 3) };
export const arrowRight: IconDefinition = { name: 'arrowRight', label: 'Forward', build: arrow };
export const arrowLeft: IconDefinition = { name: 'arrowLeft', label: 'Back', build: (gap) => mirrorX(arrow(gap)) };
export const arrowUp: IconDefinition = { name: 'arrowUp', label: 'Arrow up', build: (gap) => rotate(arrow(gap), 3) };
export const arrowDown: IconDefinition = { name: 'arrowDown', label: 'Arrow down', build: (gap) => rotate(arrow(gap), 1) };

export const cornerDownRight: IconDefinition = {
    name: 'cornerDownRight',
    label: 'Subitem',
    build: (gap) => ({
        strokes: [chain([6, 4], [6, 14], [15, 14], [15, 18.5], [19.5, 14])],
        detail: line(15, 9.5, ...toward([19.5, 14], [15, 9.5], gap)),
    }),
};

export const home: IconDefinition = {
    name: 'home',
    label: 'Home',
    build: (gap) => ({
        strokes: [[line(6, 20, 6, 11), line(6, 11, 12, 5), line(12, 5, 18, 11), line(18, 11, 18, 20)]],
        detail: line(6 + gap, 17.75, 18 - gap, 17.75),
        body: [[6, 20], [6, 11], [12, 5], [18, 11], [18, 20]],
    }),
};

export const expand: IconDefinition = {
    name: 'expand',
    label: 'Expand',
    build: (gap) => ({
        strokes: [
            turnedChain([12, 12.5], [12, 7], [16.5, 7], [12, 2.5], [7.5, 7]),
            turnedChain([12, 21.5], [16.5, 17]),
        ],
        detail: turnedLine([7.5, 17], toward([12, 21.5], [7.5, 17], gap)),
    }),
};

export const collapse: IconDefinition = {
    name: 'collapse',
    label: 'Collapse',
    freeAngles: true,
    build: (gap) => {
        const top = 12 - (gap + 1) / 2;
        const bottom = 12 + (gap + 1) / 2;
        return {
            strokes: [
                turnedChain([12, top - 9], [12, top - 4.5], [16, top - 4.5], [12, top], [8, top - 4.5]),
                turnedChain([12, bottom], [16, bottom + 4]),
            ],
            detail: turnedLine([8, bottom + 4], toward([12, bottom], [8, bottom + 4], gap)),
        };
    },
};

const doorArrow = (gap: number, frame: Point[], x0: number, x: number): IconGeometry => ({
    strokes: [chain(...frame), chain([x0, 12], [x, 12], [x, 16.5], [x + 4.5, 12])],
    detail: line(x, 7.5, ...toward([x + 4.5, 12], [x, 7.5], gap)),
});

export const logout: IconDefinition = {
    name: 'logout',
    label: 'Log out',
    build: (gap) => doorArrow(gap, [[13, 7.5], [13, 4], [5, 4], [5, 20], [13, 20], [13, 16.5]], 9.5, 16),
};

export const login: IconDefinition = {
    name: 'login',
    label: 'Log in',
    build: (gap) => doorArrow(gap, [[9, 6.5], [9, 4], [20.5, 4], [20.5, 20], [9, 20], [9, 17.5]], 3, 12.5),
};

export const navigation = [
    menu, chevronDown, chevronUp, chevronLeft, chevronRight, arrowLeft, arrowRight, arrowUp, arrowDown, home, expand,
    collapse, cornerDownRight, logout, login,
];
