import { arc, chordAngle, circleBody, line, part, split } from '../draw.js';
import type { IconDefinition } from '../geometry.js';

export const check: IconDefinition = {
    name: 'check',
    label: 'Listo',
    build: (gap) => ({
        strokes: [[part(4.5, 12.5, 9.5, 17.5, 2.5 + gap), ...split(9.5, 17.5, 19.5, 7.5, 3)]],
        detail: part(4.5, 12.5, 9.5, 17.5, 0, 2.5),
    }),
};

export const alert: IconDefinition = {
    name: 'alert',
    label: 'Alerta',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(12, 12.5, 12, 3.5), line(12, 3.5, 21, 19.5), line(21, 19.5, 3, 19.5), line(3, 19.5, 12, 3.5)]],
        detail: line(12, 12.5 + gap, 12, Math.min(13.5 + gap, 19.5 - gap)),
        body: [[12, 3.5], [21, 19.5], [3, 19.5]],
    }),
};

export const info: IconDefinition = {
    name: 'info',
    label: 'Información',
    build: (gap) => ({
        strokes: [[arc(12, 12, 8, 90, 210), arc(12, 12, 8, 210, 330), arc(12, 12, 8, 330, 450), line(12, 20, 12, 12.5)]],
        detail: line(12, 11.5 - gap, 12, 12.5 - gap),
        body: circleBody(12, 12, 8),
    }),
};

export const spinner: IconDefinition = {
    name: 'spinner',
    label: 'Cargando',
    spin: true,
    build: (gap) => {
        const g = chordAngle(gap, 8);
        const from = 330 + g;
        const step = (360 - 60 - 2 * g) / 4;
        return {
            strokes: [[0, 1, 2, 3].map((i) => arc(12, 12, 8, from + step * i, from + step * (i + 1)))],
            detail: arc(12, 12, 8, 270, 330),
        };
    },
};

export const lock: IconDefinition = {
    name: 'lock',
    label: 'Candado',
    build: (gap) => ({
        strokes: [[line(5, 11, 19, 11), line(19, 11, 19, 20), line(19, 20, 5, 20), line(5, 20, 5, 11)]],
        detail: arc(12, 11 - gap, 4.5, 180, 360),
        body: [[5, 11], [19, 11], [19, 20], [5, 20]],
    }),
};

export const unlock: IconDefinition = {
    name: 'unlock',
    label: 'Abierto',
    build: (gap) => ({
        strokes: [[line(5, 11, 19, 11), line(19, 11, 19, 20), line(19, 20, 5, 20), line(5, 20, 5, 11)]],
        detail: arc(15, 10 - gap, 4.5, 180, 330),
        body: [[5, 11], [19, 11], [19, 20], [5, 20]],
    }),
};

export const play: IconDefinition = {
    name: 'play',
    label: 'Reproducir',
    build: (gap) => ({
        strokes: [[line(8, 6, 8, 4), line(8, 4, 16, 12), line(16, 12, 8, 20), line(8, 20, 8, 13)]],
        detail: line(8, 6 + gap, 8, 13 - gap),
        body: [[8, 4], [16, 12], [8, 20]],
    }),
};

export const pause: IconDefinition = {
    name: 'pause',
    label: 'Pausa',
    build: () => ({
        strokes: [split(8, 5, 8, 19, 4)],
        detail: line(16, 5, 16, 19),
    }),
};

export const status = [check, alert, info, spinner, lock, unlock, play, pause];
