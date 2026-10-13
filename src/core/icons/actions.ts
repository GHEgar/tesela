import { arc, chordAngle, circleBody, line, mirrorX, mirrorY, part, split } from '../draw.js';
import { polar } from '../geometry.js';
import type { IconDefinition, IconGeometry } from '../geometry.js';

const lens = polar([10.5, 10.5], 6.5, 45);

const download = (gap: number): IconGeometry => ({
    strokes: [[line(12, 3.5, 12, 10.5), line(12, 10.5, 16.5, 10.5), line(16.5, 10.5, 12, 15), line(12, 15, 7.5, 10.5)]],
    detail: line(4.5, 16 + gap, 19.5, 16 + gap),
});

const undo = (gap: number): IconGeometry => {
    const t = gap * Math.SQRT2;
    return {
        strokes: [[line(9.5, 5.5, 6, 9), line(6, 9, 15, 9), arc(15, 14.5, 5.5, 270, 360), arc(15, 14.5, 5.5, 0, 90)]],
        detail: part(6, 9, 12, 15, t, t + 2.5),
    };
};

export const search: IconDefinition = {
    name: 'search',
    label: 'Buscar',
    build: (gap) => {
        const g = chordAngle(gap, 6.5);
        return {
            strokes: [[line(20, 20, ...lens), arc(10.5, 10.5, 6.5, 45, 135), arc(10.5, 10.5, 6.5, 135, 225), arc(10.5, 10.5, 6.5, 225, 300)]],
            detail: arc(10.5, 10.5, 6.5, 300 + g, 405 - g),
            body: circleBody(10.5, 10.5, 6.5),
        };
    },
};

export const zoomOut: IconDefinition = {
    name: 'zoomOut',
    label: 'Alejar',
    build: () => ({
        strokes: [[line(20, 20, ...lens), arc(10.5, 10.5, 6.5, 45, 165), arc(10.5, 10.5, 6.5, 165, 285), arc(10.5, 10.5, 6.5, 285, 405)]],
        detail: line(8, 10.5, 13, 10.5),
        body: circleBody(10.5, 10.5, 6.5),
    }),
};

export const zoomIn: IconDefinition = {
    name: 'zoomIn',
    label: 'Acercar',
    build: () => ({
        strokes: [[line(20, 20, ...lens), arc(10.5, 10.5, 6.5, 45, 165), arc(10.5, 10.5, 6.5, 165, 285), arc(10.5, 10.5, 6.5, 285, 405)]],
        detail: line(10.5, 8, 10.5, 13),
        body: circleBody(10.5, 10.5, 6.5),
    }),
};

export const close: IconDefinition = {
    name: 'close',
    label: 'Cerrar',
    cross: true,
    build: (gap) => ({
        strokes: [[part(6, 6, 12, 12, 3 + gap), line(12, 12, 18, 18)], [line(18, 6, 12, 12), line(12, 12, 6, 18)]],
        detail: part(6, 6, 12, 12, 0, 3),
    }),
};

export const plus: IconDefinition = {
    name: 'plus',
    label: 'Agregar',
    cross: true,
    build: (gap) => ({
        strokes: [[line(8 + gap, 12, 12, 12), line(12, 12, 19, 12)], [line(12, 5, 12, 12), line(12, 12, 12, 19)]],
        detail: line(5, 12, 8, 12),
    }),
};

export const minus: IconDefinition = {
    name: 'minus',
    label: 'Quitar',
    build: (gap) => ({
        strokes: [[line(8 + gap, 12, 12, 12), ...split(12, 12, 19, 12, 3)]],
        detail: line(5, 12, 8, 12),
    }),
};

export const filter: IconDefinition = {
    name: 'filter',
    label: 'Filtro',
    build: (gap) => ({
        strokes: [[line(10, 20, 10, 11.5), line(10, 11.5, 3.5, 5), line(3.5, 5, 20.5, 5), line(20.5, 5, 14, 11.5)]],
        detail: line(14, 11.5 + gap, 14, 18),
        body: [[3.5, 5], [20.5, 5], [14, 11.5], [10, 11.5]],
    }),
};

export const downloadIcon: IconDefinition = { name: 'download', label: 'Descargar', build: download };
export const upload: IconDefinition = { name: 'upload', label: 'Subir', build: (gap) => mirrorY(download(gap)) };

export const edit: IconDefinition = {
    name: 'edit',
    label: 'Editar',
    build: (gap) => {
        const o = gap / Math.SQRT2;
        return {
            strokes: [[line(15, 4, 4, 15), line(4, 15, 4, 20), line(4, 20, 9, 20), line(9, 20, 20, 9)]],
            detail: line(15 + o, 4 - o, 20 + o, 9 - o),
            body: [[15, 4], [4, 15], [4, 20], [9, 20], [20, 9]],
        };
    },
};

export const trash: IconDefinition = {
    name: 'trash',
    label: 'Eliminar',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(4, 7, 20, 7), line(20, 7, 18, 20), line(18, 20, 6, 20), line(6, 20, 4, 7)]],
        detail: line(9, 7 - gap, 15, 7 - gap),
        body: [[4, 7], [20, 7], [18, 20], [6, 20]],
    }),
};

export const copy: IconDefinition = {
    name: 'copy',
    label: 'Copiar',
    build: (gap) => ({
        strokes: [[line(9, 9, 20, 9), line(20, 9, 20, 20), line(20, 20, 9, 20), line(9, 20, 9, 9)]],
        detail: arc(14.5, 14.5, 5.5 * Math.SQRT2 + gap, 180, 270),
        body: [[9, 9], [20, 9], [20, 20], [9, 20]],
    }),
};

export const refresh: IconDefinition = {
    name: 'refresh',
    label: 'Recargar',
    build: (gap) => {
        const g = chordAngle(gap, 7);
        return {
            strokes: [[arc(12, 12, 7, 60 + g, 130), arc(12, 12, 7, 130, 200), arc(12, 12, 7, 200, 270), line(12, 5, 8.5, 1.5)]],
            detail: arc(12, 12, 7, 0, 60),
            body: circleBody(12, 12, 7),
        };
    },
};

export const undoIcon: IconDefinition = { name: 'undo', label: 'Deshacer', build: undo };
export const redo: IconDefinition = { name: 'redo', label: 'Rehacer', build: (gap) => mirrorX(undo(gap)) };

export const history: IconDefinition = {
    name: 'history',
    label: 'Historial',
    build: (gap) => ({
        strokes: [[arc(12, 12, 7.5, 300, 200), arc(12, 12, 7.5, 200, 100), arc(12, 12, 7.5, 100, 0), line(19.5, 12, 22, 14.5)]],
        detail: line(12, 13, 12, 5 + gap),
        body: circleBody(12, 12, 7.5),
    }),
};

export const send: IconDefinition = {
    name: 'send',
    label: 'Enviar',
    freeAngles: true,
    build: (gap) => ({
        strokes: [[line(4, 4, 20, 12), line(20, 12, 4, 20), line(4, 20, 8, 12), line(8, 12, 4, 4)]],
        detail: line(8 + gap, 12, 19.9 - 2.24 * gap, 12),
        body: [[4, 4], [20, 12], [4, 20], [8, 12]],
    }),
};

export const share: IconDefinition = {
    name: 'share',
    label: 'Compartir',
    build: () => ({
        strokes: [[line(10, 5, 5, 5), line(5, 5, 5, 19), line(5, 19, 19, 19), line(19, 19, 19, 14)]],
        detail: line(12, 12, 20, 4),
    }),
};

export const link: IconDefinition = {
    name: 'link',
    label: 'Enlace',
    build: (gap) => {
        const outer = 10.5 - gap;
        const radius = (15.5 - outer) / 2;
        return {
            strokes: [[line(10.5, 8, 10.5, 15.5), arc(13, 15.5, 2.5, 180, 0), line(15.5, 15.5, 15.5, 6), arc(outer + radius, 6, radius, 0, -180)]],
            detail: line(outer, 6 + gap, outer, 17.5),
        };
    },
};

export const settings: IconDefinition = {
    name: 'settings',
    label: 'Configuración',
    build: (gap) => {
        const w = 1.6;
        const r = 4.5;
        const reach = 10 * Math.SQRT2 - Math.sqrt(r * r - w * w);
        const at = (t: number, n: number): [number, number] => [5 + (t + n) / Math.SQRT2, 19 + (n - t) / Math.SQRT2];
        const side = 180 - (Math.asin(w / r) * 180) / Math.PI;
        const g = chordAngle(gap, r);
        return {
            strokes: [[
                line(...at(reach, w), ...at(0, w)),
                arc(5, 19, w, 45, 225),
                line(...at(0, -w), ...at(reach, -w)),
                arc(15, 9, r, 315 - side + 360, 640),
            ]],
            detail: arc(15, 9, r, 350, 315 + side - g),
        };
    },
};

export const actions = [
    search, zoomIn, zoomOut, close, plus, minus, filter, downloadIcon, upload, edit, trash, copy, refresh,
    undoIcon, redo, history, send, share, link, settings,
];
