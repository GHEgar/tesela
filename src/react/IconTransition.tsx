import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cubicPath, lerpCubic, resolveIcon } from 'tesela';
import type { IconDefinition } from 'tesela';
import { Fill, partsFor, Seams, SvgFrame, Tiles } from './IconSvg.js';
import type { IconProps } from './IconSvg.js';

export interface IconTransitionProps extends IconProps {
    readonly icon: IconDefinition;
    readonly duration?: number;
}

interface Track {
    readonly icon: IconDefinition;
    readonly from: IconDefinition | null;
}

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ease = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const animate = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions): void => {
    if (typeof (el as Element & { animate?: unknown }).animate === 'function') el.animate(keyframes, options);
};

export function IconTransition({ icon, duration = 560, ...props }: IconTransitionProps): ReactNode {
    const [track, setTrack] = useState<Track>({ icon, from: null });
    const current = track.icon === icon ? track : { icon, from: prefersReducedMotion() ? null : track.icon };
    if (current !== track) setTrack(current);
    const { stroke, junta } = props;
    const parts = partsFor(icon, props);
    const fromParts = current.from ? partsFor(current.from, props) : null;
    const entering = new Set(fromParts ? parts.strokes.filter((d) => !fromParts.strokes.includes(d)) : []);
    const leaving = fromParts ? fromParts.strokes.filter((d) => !parts.strokes.includes(d)) : [];
    const detailRef = useRef<SVGPathElement>(null);
    const strokesRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!track.from) return undefined;
        const options = { ...(stroke === undefined ? {} : { stroke }), ...(junta === undefined ? {} : { junta }) };
        const from = resolveIcon(track.from, options).detail;
        const to = resolveIcon(track.icon, options).detail;
        strokesRef.current?.querySelectorAll('[data-enter]').forEach((el) => animate(el, [
            { strokeDasharray: '1 2', strokeDashoffset: 1, opacity: 0 },
            { strokeDasharray: '1 2', strokeDashoffset: 0.92, opacity: 1, offset: 0.08 },
            { strokeDasharray: '1 2', strokeDashoffset: 0, opacity: 1 },
        ], { duration, delay: duration * 0.2, easing: 'ease', fill: 'backwards' }));
        strokesRef.current?.querySelectorAll('[data-leave]').forEach((el) => animate(el, [
            { opacity: 1 },
            { opacity: 0 },
        ], { duration: duration * 0.6, easing: 'ease', fill: 'forwards' }));
        let frame = 0;
        let start = -1;
        const step = (now: number): void => {
            if (start < 0) start = now;
            const t = ease(Math.min(1, (now - start) / duration));
            detailRef.current?.setAttribute('d', cubicPath(lerpCubic(from, to, t)));
            if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        const timer = setTimeout(() => setTrack({ icon: track.icon, from: null }), duration);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [track, duration, stroke, junta]);

    return (
        <SvgFrame parts={parts} props={props}>
            <Fill parts={parts} />
            <Tiles parts={parts} />
            <g ref={strokesRef}>
                {leaving.map((d) => <path key={`out-${d}`} d={d} data-leave="" />)}
                {parts.strokes.map((d) => (
                    <path key={d} d={d} pathLength={1} {...(entering.has(d) ? { 'data-enter': '' } : {})} />
                ))}
            </g>
            <Seams parts={parts} />
            <path ref={detailRef} d={parts.detail.d} stroke={parts.detail.attribute} style={{ stroke: parts.detail.style }} />
        </SvgFrame>
    );
}
