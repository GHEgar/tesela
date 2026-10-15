import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { iconParts } from 'tesela';
import type { ColorMode, DetailDirection, IconDefinition, IconParts, Variant } from 'tesela';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'stroke' | 'children' | 'ref'> {
    readonly size?: number | string;
    readonly stroke?: number;
    readonly junta?: number;
    readonly variant?: Variant;
    readonly seams?: boolean;
    readonly detailDirection?: DetailDirection;
    readonly colorMode?: ColorMode;
    readonly title?: string;
}

export const partsFor = (definition: IconDefinition, props: IconProps): IconParts => iconParts(definition, {
    ...(props.stroke === undefined ? {} : { stroke: props.stroke }),
    ...(props.junta === undefined ? {} : { junta: props.junta }),
    ...(props.variant === undefined ? {} : { variant: props.variant }),
    ...(props.seams === undefined ? {} : { seams: props.seams }),
    ...(props.detailDirection === undefined ? {} : { detailDirection: props.detailDirection }),
    colorMode: props.colorMode ?? 'auto',
});

export const Fill = ({ parts }: { readonly parts: IconParts }): ReactNode => parts.fill ? (
    <polygon points={parts.fill.points} fill="currentColor" fillOpacity={parts.fill.opacity} stroke="none" />
) : null;

export const Tiles = ({ parts }: { readonly parts: IconParts }): ReactNode => parts.tiles.length ? (
    <g stroke="none">
        {parts.tiles.map((t) => <polygon key={t.points} points={t.points} fill={t.attribute} style={{ fill: t.style }} />)}
    </g>
) : null;

export const Seams = ({ parts }: { readonly parts: IconParts }): ReactNode => parts.seams.map((s) => (
    <path key={s.d} d={s.d} stroke={s.attribute} style={{ stroke: s.style }} strokeWidth={s.width} strokeLinecap="butt" />
));

interface SvgFrameProps {
    readonly parts: IconParts;
    readonly props: IconProps;
    readonly children: ReactNode;
}

export function SvgFrame({ parts, props, children }: SvgFrameProps): ReactNode {
    const { size = 24, stroke: _stroke, junta: _junta, variant: _variant, seams: _seams, detailDirection, colorMode: _colorMode, title, style, ...rest } = props;
    const direction: CSSProperties = detailDirection
        ? ({ '--tesela-dir': detailDirection === 'lighter' ? -1 : 1 } as CSSProperties)
        : {};
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={parts.svg['stroke-width']}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ ...direction, ...style }}
            {...(title ? { role: 'img' } : { 'aria-hidden': true })}
            {...rest}
        >
            {title ? <title>{title}</title> : null}
            {children}
        </svg>
    );
}

const Turn = ({ lap }: { readonly lap: number }): ReactNode => (
    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur={`${lap}s`} repeatCount="indefinite" />
);

const Strokes = ({ parts }: { readonly parts: IconParts }): ReactNode => parts.strokes.map((d, i) => {
    const o = parts.orbit?.strokes[i];
    if (!o || !parts.orbit) return <path key={d} d={d} />;
    const dur = `${parts.orbit.lap * 2}s`;
    return (
        <path key={d} d={d} pathLength={o.length}>
            <animate attributeName="stroke-dasharray" values={o.dasharray} keyTimes={o.keyTimes} dur={dur} repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" values={o.dashoffset} keyTimes={o.keyTimes} dur={dur} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" keyTimes={o.opacityTimes} calcMode="discrete" dur={dur} repeatCount="indefinite" />
        </path>
    );
});

export function IconSvg({ definition, ...props }: IconProps & { readonly definition: IconDefinition }): ReactNode {
    const parts = partsFor(definition, props);
    const lap = parts.orbit?.lap ?? 1;
    const detail = <path d={parts.detail.d} stroke={parts.detail.attribute} style={{ stroke: parts.detail.style }} />;
    const body = (
        <>
            <Fill parts={parts} />
            <Tiles parts={parts} />
            <Strokes parts={parts} />
            <Seams parts={parts} />
            {parts.orbit ? <g>{detail}<Turn lap={lap} /></g> : detail}
        </>
    );
    return (
        <SvgFrame parts={parts} props={props}>
            {parts.spin && !parts.orbit ? <g>{body}<Turn lap={lap} /></g> : body}
        </SvgFrame>
    );
}

export const createIcon = (definition: IconDefinition): ((props: IconProps) => ReactNode) => {
    const Component = (props: IconProps): ReactNode => <IconSvg definition={definition} {...props} />;
    Component.displayName = definition.name.charAt(0).toUpperCase() + definition.name.slice(1);
    return Component;
};
