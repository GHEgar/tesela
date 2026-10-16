import { arc, chordAngle, circleBody, line, part, split } from '../draw.js';
import type { IconDefinition, Segment } from '../geometry.js';

const lockBody = (): Segment[][] => [
    [line(7, 11, 17, 11), arc(17, 13, 2, 270, 360)],
    [line(19, 13, 19, 18), arc(17, 18, 2, 0, 90)],
    [line(17, 20, 7, 20), arc(7, 18, 2, 90, 180)],
    [line(5, 18, 5, 13), arc(7, 13, 2, 180, 270)],
];

export const check: IconDefinition = {
    name: 'check',
    label: 'Done',
    build: (gap) => ({
        strokes: split(9.5, 17.5, 19.5, 7.5, 4).map((s) => [s]),
        detail: part(4.5, 12.5, 9.5, 17.5, 0, -gap),
    }),
};

export const alert: IconDefinition = {
    name: 'alert',
    label: 'Alert',
    freeAngles: true,
    build: (gap) => {
        const dot = 8.5 + (gap - 2) * Math.hypot(9, 16) / 9;
        return {
            strokes: [
                [line(12, 3.5, 21, 19.5)],
                [line(21, 19.5, 3, 19.5)],
                [line(3, 19.5, 12, 3.5)],
                [line(12, dot + gap + 1, 12, 16.5)],
            ],
            detail: line(12, dot, 12, dot),
            body: [[12, 3.5], [21, 19.5], [3, 19.5]],
        };
    },
};

export const info: IconDefinition = {
    name: 'info',
    label: 'Info',
    build: (gap) => ({
        strokes: [[line(10, 10, 12, 10)], [line(12, 10, 12, 19)], [line(9, 19, 12, 19)], [line(12, 19, 15, 19)]],
        detail: [arc(12, 7.8 - gap, 1.4, 0, 180), arc(12, 7.8 - gap, 1.4, 180, 360)],
    }),
};

const RING = 9;

const statusRing = (gap: number): { arcs: Segment[][]; detail: Segment } => {
    const g = gap / RING * 180 / Math.PI;
    return {
        arcs: [[arc(12, 12, RING, 315 + g, 495)], [arc(12, 12, RING, 495, 645 - g)]],
        detail: arc(12, 12, RING, 285, 315),
    };
};

export const infoCircle: IconDefinition = {
    name: 'infoCircle',
    label: 'Info',
    build: (gap) => {
        const ring = statusRing(gap);
        return {
            strokes: [...ring.arcs, [line(12, 8.9 + gap, 12, 16.5)], [line(12, 7.4, 12, 7.4)]],
            detail: ring.detail,
            body: circleBody(12, 12, RING),
        };
    },
};

export const help: IconDefinition = {
    name: 'help',
    label: 'Help',
    freeAngles: true,
    build: (gap) => {
        const ring = statusRing(gap);
        const a = 40 * Math.PI / 180;
        const end = [12 + 2.7 * Math.cos(a), 9.6 + 2.7 * Math.sin(a)] as const;
        return {
            strokes: [
                ...ring.arcs,
                [arc(12, 9.6, 2.7, 195, 400), line(end[0], end[1], 12, 12.6), line(12, 12.6, 12, 13.2)],
                [line(12, 14.7 + gap, 12, 14.7 + gap)],
            ],
            detail: ring.detail,
            body: circleBody(12, 12, RING),
        };
    },
};

export const checkCircle: IconDefinition = {
    name: 'checkCircle',
    label: 'Done',
    build: (gap) => {
        const ring = statusRing(gap);
        return {
            strokes: [...ring.arcs, [line(7.8, 12.3, 10.6, 15.1)], [line(10.6, 15.1, 16.2, 9.5)]],
            detail: ring.detail,
            body: circleBody(12, 12, RING),
        };
    },
};

export const closeCircle: IconDefinition = {
    name: 'closeCircle',
    label: 'Error',
    build: (gap) => {
        const ring = statusRing(gap);
        return {
            strokes: [...ring.arcs, [line(8.8, 8.8, 15.2, 15.2)], [line(15.2, 8.8, 8.8, 15.2)]],
            detail: ring.detail,
            body: circleBody(12, 12, RING),
        };
    },
};

export const spinner: IconDefinition = {
    name: 'spinner',
    label: 'Loading',
    spin: true,
    build: (gap) => {
        const from = 20;
        const step = (270 - chordAngle(gap, 8) - from) / 4;
        return {
            strokes: [[0, 1, 2, 3].map((i) => arc(12, 12, 8, from + step * i, from + step * (i + 1)))],
            detail: arc(12, 12, 8, 270, 330),
        };
    },
};

export const lock: IconDefinition = {
    name: 'lock',
    label: 'Lock',
    build: (gap) => ({
        strokes: lockBody(),
        detail: arc(12, 11 - gap, 4.5, 180, 360),
        body: [[5, 11], [19, 11], [19, 20], [5, 20]],
    }),
};

export const unlock: IconDefinition = {
    name: 'unlock',
    label: 'Unlock',
    build: (gap) => {
        const t = -Math.min(40 * Math.PI / 180, Math.asin((11 - 1.5 * gap) / 4.5 - 1));
        const turn = t * 180 / Math.PI;
        return {
            strokes: lockBody(),
            detail: arc(7.5 + 4.5 * Math.cos(t), 11 - gap + 4.5 * Math.sin(t), 4.5, 180 + turn, 360 + turn),
            body: [[5, 11], [19, 11], [19, 20], [5, 20]],
        };
    },
};

export const play: IconDefinition = {
    name: 'play',
    label: 'Play',
    build: () => ({
        strokes: [[line(8, 4, 12, 8)], [line(12, 8, 16, 12)], [line(16, 12, 12, 16)], [line(12, 16, 8, 20)]],
        detail: line(8, 9, 8, 15),
        body: [[8, 4], [16, 12], [8, 20]],
    }),
};

export const pause: IconDefinition = {
    name: 'pause',
    label: 'Pause',
    build: () => ({
        strokes: [split(8, 5, 8, 19, 4)],
        detail: line(16, 5, 16, 19),
    }),
};

export const status = [check, checkCircle, alert, info, infoCircle, help, closeCircle, spinner, lock, unlock, play, pause];
