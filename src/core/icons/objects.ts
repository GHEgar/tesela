import { arc, bend, chain, chordAngle, circleBody, clearArc, line, part, rect, rectBody, ring } from '../draw.js';
import { polar } from '../geometry.js';
import type { IconDefinition, Point } from '../geometry.js';

const lid = 10.52;
const lidAngle = (Math.atan2(4.52, 9.5) * 180) / Math.PI;
const eyeBody: Point[] = [
    ...Array.from({ length: 19 }, (_, i) => polar([12, 16.52], lid, 180 + lidAngle + (180 - 2 * lidAngle) * i / 18)),
    ...Array.from({ length: 19 }, (_, i) => polar([12, 7.48], lid, lidAngle + (180 - 2 * lidAngle) * i / 18)),
];

export const table: IconDefinition = {
    name: 'table',
    label: 'Table',
    build: (gap) => ({
        strokes: [
            chain([3.5, 5], [20.5, 5], [20.5, 19]),
            chain([20.5, 19], [3.5, 19], [3.5, 5]),
            [line(9.2, 10 + gap, 9.2, 19)],
            [line(14.8, 10 + gap, 14.8, 19)],
        ],
        detail: line(3.5 + gap, 10, 20.5 - gap, 10),
        body: rectBody(3.5, 5, 20.5, 19),
    }),
};

export const eye: IconDefinition = {
    name: 'eye',
    label: 'Eye',
    build: (gap) => ({
        strokes: [[
            arc(12, 16.52, lid, 180 + lidAngle, 270),
            arc(12, 16.52, lid, 270, 360 - lidAngle),
            arc(12, 7.48, lid, lidAngle, 90),
            arc(12, 7.48, lid, 90, 180 - lidAngle),
        ]],
        detail: ring(12, 12, Math.min(3, lid - 4.52 - gap - 0.05)),
        body: eyeBody,
    }),
};

export const eyeOff: IconDefinition = {
    name: 'eyeOff',
    label: 'Eye off',
    build: (gap) => {
        const slash = line(4, 4, 20, 20);
        const [upperLeft, upperRight] = clearArc(12, 16.52, lid, 180 + lidAngle, 360 - lidAngle, slash, gap);
        const [lowerRight, lowerLeft] = clearArc(12, 7.48, lid, lidAngle, 180 - lidAngle, slash, gap);
        return {
            strokes: [[upperRight, lowerRight], [lowerLeft, upperLeft]],
            detail: slash,
            body: eyeBody,
        };
    },
};

export const pin: IconDefinition = {
    name: 'pin',
    label: 'Location',
    freeAngles: true,
    build: (gap) => {
        const tip = 21.5 - gap / Math.sin(Math.PI / 6);
        const reach = (tip - 13) * Math.tan(Math.PI / 6);
        return {
            strokes: [[line(12, 21.5, 6.8, 12.5), arc(12, 9.5, 6, 150, 270), arc(12, 9.5, 6, 270, 390), line(17.2, 12.5, 12, 21.5)]],
            detail: chain([12 - reach, 13], [12, tip], [12 + reach, 13]),
            body: [...Array.from({ length: 25 }, (_, i) => polar([12, 9.5], 6, 150 + i * 10)), [12, 21.5]],
        };
    },
};

export const user: IconDefinition = {
    name: 'user',
    label: 'User',
    build: (gap) => {
        const from = -60;
        const span = 50;
        const start = from + span + chordAngle(gap, 4);
        const step = (360 - span - 2 * chordAngle(gap, 4)) / 3;
        return {
            strokes: [
                [0, 1, 2].map((i) => arc(12, 8, 4, start + step * i, start + step * (i + 1))),
                [arc(12, 20 + gap, 8, 200, 340)],
            ],
            detail: arc(12, 8, 4, from, from + span),
            body: circleBody(12, 8, 4),
        };
    },
};

export const documentIcon: IconDefinition = {
    name: 'document',
    label: 'Document',
    build: (gap) => ({
        strokes: [[line(14, 3, 6, 3), line(6, 3, 6, 21), line(6, 21, 19, 21), line(19, 21, 19, 8)]],
        detail: part(14, 3, 19, 8, gap, -gap),
        body: [[6, 3], [14, 3], [19, 8], [19, 21], [6, 21]],
    }),
};

export const folder: IconDefinition = {
    name: 'folder',
    label: 'Folder',
    build: (gap) => ({
        strokes: [rect(3, 8, 21, 20)],
        detail: chain([3, 8 - gap], [3, 4], [9, 4], [13 - gap, 8 - gap]),
        body: rectBody(3, 8, 21, 20),
    }),
};

export const phone: IconDefinition = {
    name: 'phone',
    label: 'Phone',
    build: (gap) => ({
        strokes: [rect(7, 3, 17, 21), [line(12, 3.75 + gap, 12, 3.75 + gap)]],
        detail: line(10.5, 21 - gap, 13.5, 21 - gap),
        body: rectBody(7, 3, 17, 21),
    }),
};

export const mail: IconDefinition = {
    name: 'mail',
    label: 'Mail',
    freeAngles: true,
    build: (gap) => ({
        strokes: [rect(3, 6, 21, 18)],
        detail: chain([3.2 + gap, 6.2 + gap], [12, 13], [20.8 - gap, 6.2 + gap]),
        body: rectBody(3, 6, 21, 18),
    }),
};

export const chat: IconDefinition = {
    name: 'chat',
    label: 'Chat',
    build: () => ({
        strokes: [[line(8, 16, 4, 20)], [line(4, 20, 4, 5)], [line(4, 5, 20, 5)], [line(20, 5, 20, 16), line(20, 16, 8, 16)]],
        detail: line(8, 10.5, 16, 10.5),
        body: [[4, 5], [20, 5], [20, 16], [8, 16], [4, 20]],
    }),
};

export const globe: IconDefinition = {
    name: 'globe',
    label: 'Web and social',
    nudge: [-1, -0.25],
    build: (gap) => {
        const holder = 6.5 + gap;
        const reach = 6 - gap;
        const bulge = reach * 0.4;
        return {
            strokes: [
                ring(12, 9.5, 6),
                [arc(12, 9.5, holder, -40, 90), arc(12, 9.5, holder, 90, 140)],
                [line(12, 9.5 + holder, 12, 21)],
                [line(8, 21, 16, 21)],
            ],
            detail: bend([12, 9.5 - reach], [12, 9.5 + reach], (reach * reach + bulge * bulge) / (2 * bulge), true),
            body: circleBody(12, 9.5, 6),
        };
    },
};

const MOON: Point = [16.5, 7.5];
const BITE = Math.hypot(4.5, 4.5);

export const calendar: IconDefinition = {
    name: 'calendar',
    label: 'Calendar',
    build: () => ({
        strokes: [rect(3.5, 5, 20.5, 21), [line(3.5, 10, 20.5, 10)], [line(8, 3, 8, 7)], [line(16, 3, 16, 7)]],
        detail: chain([7, 14], [10, 14], [10, 17], [7, 17], [7, 14]),
        body: rectBody(3.5, 5, 20.5, 21),
    }),
};

export const gamepad: IconDefinition = {
    name: 'gamepad',
    label: 'Game',
    build: () => ({
        strokes: [
            [line(7.5, 6.5, 16.5, 6.5), arc(16.5, 12, 5.5, 270, 450), line(16.5, 17.5, 7.5, 17.5), arc(7.5, 12, 5.5, 90, 270)],
            [line(5, 12, 10, 12)],
            [line(7.5, 9.5, 7.5, 14.5)],
            [line(15.25, 13.25, 15.25, 13.25)],
        ],
        detail: line(17.75, 10.75, 17.75, 10.75),
        body: [
            ...Array.from({ length: 19 }, (_, i) => polar([16.5, 12], 5.5, 270 + i * 10)),
            ...Array.from({ length: 19 }, (_, i) => polar([7.5, 12], 5.5, 90 + i * 10)),
        ],
    }),
};

export const sun: IconDefinition = {
    name: 'sun',
    label: 'Light mode',
    freeAngles: true,
    build: (gap) => {
        const rays = Array.from({ length: 16 }, (_, i) => polar([12, 12], i % 2 ? 7 : 10.5, -90 + i * 22.5));
        return {
            strokes: [chain(...rays, rays[0] ?? [12, 1.5])],
            detail: ring(12, 12, Math.min(4, 7 - gap - 0.1)),
            body: rays,
        };
    },
};

export const moon: IconDefinition = {
    name: 'moon',
    label: 'Dark mode',
    build: () => ({
        strokes: [[arc(12, 12, 9, 0, 90), arc(12, 12, 9, 90, 180), arc(12, 12, 9, 180, 270), arc(...MOON, BITE, 225, 45)]],
        detail: line(18.5, 5.5, 18.5, 5.5),
        body: [
            ...Array.from({ length: 28 }, (_, i) => polar([12, 12], 9, i * 10)),
            ...Array.from({ length: 17 }, (_, i) => polar(MOON, BITE, 225 - i * 11.25)).slice(1, -1),
        ],
    }),
};

export const objects = [table, eye, eyeOff, pin, user, documentIcon, folder, phone, mail, chat, globe, calendar, gamepad, sun, moon];
