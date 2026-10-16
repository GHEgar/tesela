import { chain, line, part, ring, toward } from '../draw.js';
import { polar } from '../geometry.js';
import type { IconDefinition, Point, Segment } from '../geometry.js';

const SHEET: Point[] = [[14, 3], [6, 3], [6, 21], [19, 21], [19, 8]];
const BODY: Point[] = [[6, 3], [14, 3], [19, 8], [19, 21], [6, 21]];

const sheet = (name: string, label: string, inner: Segment[][], freeAngles = false): IconDefinition => ({
    name,
    label,
    nudge: [-0.2, -0.7],
    ...(freeAngles ? { freeAngles } : {}),
    build: (gap) => ({ strokes: [chain(...SHEET), ...inner], detail: part(14, 3, 19, 8, gap, -gap), body: BODY }),
});

const vertex: [Point, Point, Point] = [[9.5, 17.5], [12.5, 14.5], [15.5, 14.5]];
const [va, vb, vc] = vertex;
const hex = [0, 1, 2, 3, 4, 5].map((i) => polar([12.5, 15], 3.6, 270 + i * 60));
const h = (i: number): Point => hex[i] ?? [12.5, 15];
const frame = chain([9, 11], [16, 11], [16, 18.5], [9, 18.5], [9, 11]);

export const fileImage = sheet('fileImage', 'Image file', [chain([8.5, 18.5], [12, 15], [15.5, 18.5]), ring(14.5, 11.5, 1.5)]);
export const fileVideo = sheet('fileVideo', 'Video file', [chain([10.5, 11], [14.5, 15], [10.5, 19], [10.5, 11])]);
export const fileText = sheet('fileText', 'Text file', [[line(9, 11.5, 13, 11.5)], [line(9, 15, 16, 15)], [line(9, 18.5, 16, 18.5)]]);
export const fileTable = sheet('fileTable', 'Table file', [frame, [line(9, 13.5, 16, 13.5)], [line(12.5, 13.5, 12.5, 18.5)]]);
export const fileVector = sheet('fileVector', 'Vector file', [
    chain(toward(va, vb, 1.4), vb, toward(vc, vb, 1.4)),
    ring(...va, 1.4),
    ring(...vc, 1.4),
], true);
export const fileRaster = sheet('fileRaster', 'Raster file', [frame, [line(9, 14.75, 16, 14.75)], [line(12.5, 11, 12.5, 18.5)]]);
export const file3d = sheet('file3d', '3D file', [chain(...hex, h(0)), chain(h(5), [12.5, 15], h(3)), [line(12.5, 15, ...h(1))]], true);
export const fileArchive = sheet('fileArchive', 'Archive file', [
    chain([11, 3], [12, 4.5], [11, 6], [12, 7.5], [11, 9], [12, 10.5], [11, 12]),
    chain([9.5, 13.5], [13.5, 13.5], [13.5, 18.5], [9.5, 18.5], [9.5, 13.5]),
], true);
export const fileCode = sheet('fileCode', 'Code file', [chain([11, 12], [8.5, 14.5], [11, 17]), chain([14, 12], [16.5, 14.5], [14, 17])]);

export const files = [fileImage, fileVideo, fileText, fileTable, fileVector, fileRaster, file3d, fileArchive, fileCode];
