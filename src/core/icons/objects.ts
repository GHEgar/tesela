import { arc, circleBody, clearArc, line, part, rect, rectBody, ring } from '../draw.js';
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
    label: 'Tabla',
    build: (gap) => ({
        strokes: [rect(3.5, 5, 20.5, 19)],
        detail: line(3.5 + gap, 10, 20.5 - gap, 10),
        body: rectBody(3.5, 5, 20.5, 19),
    }),
};

export const eye: IconDefinition = {
    name: 'eye',
    label: 'Ver',
    build: () => ({
        strokes: [[
            arc(12, 16.52, lid, 180 + lidAngle, 270),
            arc(12, 16.52, lid, 270, 360 - lidAngle),
            arc(12, 7.48, lid, lidAngle, 90),
            arc(12, 7.48, lid, 90, 180 - lidAngle),
        ]],
        detail: line(12, 10, 12, 14),
        body: eyeBody,
    }),
};

export const eyeOff: IconDefinition = {
    name: 'eyeOff',
    label: 'Ocultar',
    build: (gap) => {
        const slash = line(4, 4, 14, 14);
        const [left, right] = clearArc(12, 16.52, lid, 180 + lidAngle, 360 - lidAngle, slash, gap);
        return {
            strokes: [[right, arc(12, 7.48, lid, lidAngle, 90), arc(12, 7.48, lid, 90, 180 - lidAngle), left]],
            detail: slash,
            body: eyeBody,
        };
    },
};

export const pin: IconDefinition = {
    name: 'pin',
    label: 'Ubicación',
    freeAngles: true,
    build: () => ({
        strokes: [[line(12, 21.5, 6.8, 12.5), arc(12, 9.5, 6, 150, 270), arc(12, 9.5, 6, 270, 390), line(17.2, 12.5, 12, 21.5)]],
        detail: line(10.5, 9.5, 13.5, 9.5),
        body: [...Array.from({ length: 25 }, (_, i) => polar([12, 9.5], 6, 150 + i * 10)), [12, 21.5]],
    }),
};

export const user: IconDefinition = {
    name: 'user',
    label: 'Usuario',
    build: (gap) => ({
        strokes: [ring(12, 8, 4)],
        detail: arc(12, 20 + gap, 8, 200, 340),
        body: circleBody(12, 8, 4),
    }),
};

export const documentIcon: IconDefinition = {
    name: 'document',
    label: 'Documento',
    build: (gap) => ({
        strokes: [[line(14, 3, 6, 3), line(6, 3, 6, 21), line(6, 21, 19, 21), line(19, 21, 19, 8)]],
        detail: part(14, 3, 19, 8, gap, -gap),
        body: [[6, 3], [14, 3], [19, 8], [19, 21], [6, 21]],
    }),
};

export const folder: IconDefinition = {
    name: 'folder',
    label: 'Carpeta',
    build: (gap) => ({
        strokes: [rect(3, 8, 21, 20)],
        detail: line(3, 8 - gap, 9, 8 - gap),
        body: rectBody(3, 8, 21, 20),
    }),
};

export const phone: IconDefinition = {
    name: 'phone',
    label: 'Teléfono',
    build: (gap) => ({
        strokes: [rect(7, 3, 17, 21)],
        detail: line(10.5, 21 - gap, 13.5, 21 - gap),
        body: rectBody(7, 3, 17, 21),
    }),
};

export const mail: IconDefinition = {
    name: 'mail',
    label: 'Correo',
    build: (gap) => ({
        strokes: [rect(3, 6, 21, 18)],
        detail: arc(12, gap + 0.2, 8, 50, 130),
        body: rectBody(3, 6, 21, 18),
    }),
};

export const chat: IconDefinition = {
    name: 'chat',
    label: 'Chat',
    build: (gap) => ({
        strokes: [[line(8, 16, 4, 20), line(4, 20, 4, 5), line(4, 5, 20, 5), line(20, 5, 20, 16)]],
        detail: line(8 + gap, 16, 20 - gap, 16),
        body: [[4, 5], [20, 5], [20, 16], [8, 16], [4, 20]],
    }),
};

export const globe: IconDefinition = {
    name: 'globe',
    label: 'Sitio y redes',
    build: () => ({
        strokes: [ring(12, 12, 8)],
        detail: arc(20, 12, 8, 145, 215),
        body: circleBody(12, 12, 8),
    }),
};

export const objects = [table, eye, eyeOff, pin, user, documentIcon, folder, phone, mail, chat, globe];
