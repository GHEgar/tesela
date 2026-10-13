export type DetailDirection = 'darker' | 'lighter';

export interface Tone {
    readonly attribute: string;
    readonly style: string;
}

const STEP = 0.072;

export const toneOffsets = { seam: 2, tiles: [1, 2, 3, 4, 5], detail: 5 } as const;

export const tone = (steps: number): Tone => {
    const offset = Math.round(steps * STEP * 1000) / 1000;
    const mix = Math.round(steps * 12);
    return {
        attribute: `color-mix(in oklch, currentColor, black ${mix}%)`,
        style: `oklch(from currentColor calc(l - ${offset} * var(--tesela-dir, 1)) c h)`,
    };
};

export const directionStyle = (direction: DetailDirection): string =>
    direction === 'lighter' ? '--tesela-dir:-1' : '--tesela-dir:1';
