export type DetailDirection = 'darker' | 'lighter';
export type ColorMode = 'auto' | 'relative' | 'mix';

export interface Tone {
    readonly attribute: string;
    readonly style: string | undefined;
}

const STEP = 0.072;

export const toneOffsets = { seam: 2, tiles: [1, 2, 3, 4, 5], detail: 5 } as const;

let relativeSupport: boolean | undefined;

export const supportsRelativeColor = (): boolean | undefined => {
    if (relativeSupport !== undefined) return relativeSupport;
    if (typeof document === 'undefined' || typeof CSS === 'undefined' || !document.body) return undefined;
    if (!CSS.supports('color', 'oklch(from currentColor calc(l - 0.3) c h)')) {
        relativeSupport = false;
        return false;
    }
    const outer = document.createElement('span');
    const inner = document.createElement('span');
    outer.style.color = 'rgb(200, 0, 0)';
    inner.style.color = 'oklch(from currentColor calc(l - 0.3) c h)';
    outer.appendChild(inner);
    document.body.appendChild(outer);
    const base = getComputedStyle(outer).color;
    const derived = getComputedStyle(inner).color;
    outer.remove();
    relativeSupport = derived !== '' && derived !== base;
    return relativeSupport;
};

export const resetColorSupport = (): void => {
    relativeSupport = undefined;
};

export const tone = (steps: number, direction?: DetailDirection, mode: ColorMode = 'relative'): Tone => {
    const offset = Math.round(steps * STEP * 1000) / 1000;
    const mix = Math.round(steps * 12);
    const relative = mode === 'relative' || (mode === 'auto' && supportsRelativeColor() !== false);
    return {
        attribute: `color-mix(in oklch, currentColor, ${direction === 'lighter' ? 'white' : 'black'} ${mix}%)`,
        style: relative ? `oklch(from currentColor calc(l - ${offset} * var(--tesela-dir, 1)) c h)` : undefined,
    };
};

export const directionStyle = (direction: DetailDirection): string =>
    direction === 'lighter' ? '--tesela-dir:-1' : '--tesela-dir:1';
