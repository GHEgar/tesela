import { directionStyle, tone, toneOffsets } from './color.js';
import type { DetailDirection } from './color.js';
import { cubicPath } from './geometry.js';
import type { IconDefinition } from './geometry.js';
import { resolveIcon } from './resolve.js';
import type { ResolveOptions } from './resolve.js';

export type Variant = 'line' | 'tiled';

export interface RenderOptions extends ResolveOptions {
    readonly size?: number | string;
    readonly variant?: Variant;
    readonly seams?: boolean;
    readonly detailDirection?: DetailDirection;
    readonly title?: string;
}

export interface Shape {
    readonly d?: string;
    readonly points?: string;
    readonly attribute: string;
    readonly style: string;
    readonly width?: number;
    readonly delay?: number;
}

export interface IconParts {
    readonly svg: Record<string, string>;
    readonly tiles: readonly Shape[];
    readonly strokes: readonly string[];
    readonly seams: readonly Shape[];
    readonly detail: Shape;
    readonly spin: boolean;
}

const escape = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const iconParts = (definition: IconDefinition, options: RenderOptions = {}): IconParts => {
    const resolved = resolveIcon(definition, options);
    const tiled = options.variant === 'tiled';
    const seam = tone(toneOffsets.seam);
    const detail = tone(toneOffsets.detail);
    const svg: Record<string, string> = {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': String(resolved.stroke),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    };
    if (options.size !== undefined) {
        svg.width = String(options.size);
        svg.height = String(options.size);
    }
    if (options.detailDirection) svg.style = directionStyle(options.detailDirection);
    return {
        svg,
        tiles: tiled
            ? resolved.tiles.map((t) => ({ points: t.points, delay: t.delay, ...tone(t.tone) }))
            : [],
        strokes: resolved.strokes,
        seams: options.seams === false
            ? []
            : resolved.seams.map((d) => ({ d, ...seam, width: Math.round(Math.max(0.1, resolved.stroke * 0.08) * 100) / 100 })),
        detail: { d: cubicPath(resolved.detail), ...detail },
        spin: definition.spin === true,
    };
};

export const renderIcon = (definition: IconDefinition, options: RenderOptions = {}): string => {
    const parts = iconParts(definition, options);
    const attributes = Object.entries(parts.svg).map(([k, v]) => `${k}="${escape(v)}"`).join(' ');
    const a11y = options.title ? `role="img"><title>${escape(options.title)}</title>` : 'aria-hidden="true">';
    const tiles = parts.tiles.length
        ? `<g stroke="none">${parts.tiles.map((t) => `<polygon points="${t.points}" fill="${t.attribute}" style="fill:${t.style}"/>`).join('')}</g>`
        : '';
    const strokes = parts.strokes.map((d) => `<path d="${d}"/>`).join('');
    const seams = parts.seams.map((s) => `<path d="${s.d ?? ''}" stroke="${s.attribute}" style="stroke:${s.style}" stroke-width="${s.width ?? 0}" stroke-linecap="butt"/>`).join('');
    const detail = `<path d="${parts.detail.d ?? ''}" stroke="${parts.detail.attribute}" style="stroke:${parts.detail.style}"/>`;
    const body = `${tiles}${strokes}${seams}${detail}`;
    const content = parts.spin
        ? `<g>${body}<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></g>`
        : body;
    return `<svg xmlns="http://www.w3.org/2000/svg" ${attributes} ${a11y}${content}</svg>`;
};
