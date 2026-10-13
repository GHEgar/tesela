import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { iconParts } from 'tesela';
import type { DetailDirection, IconDefinition, IconParts, Variant } from 'tesela';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'stroke' | 'children' | 'ref'> {
    readonly size?: number | string;
    readonly stroke?: number;
    readonly junta?: number;
    readonly variant?: Variant;
    readonly seams?: boolean;
    readonly detailDirection?: DetailDirection;
    readonly title?: string;
}

export const partsFor = (definition: IconDefinition, props: IconProps): IconParts => iconParts(definition, {
    ...(props.stroke === undefined ? {} : { stroke: props.stroke }),
    ...(props.junta === undefined ? {} : { junta: props.junta }),
    ...(props.variant === undefined ? {} : { variant: props.variant }),
    ...(props.seams === undefined ? {} : { seams: props.seams }),
});

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
    const { size = 24, stroke: _stroke, junta: _junta, variant: _variant, seams: _seams, detailDirection, title, style, ...rest } = props;
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

export function IconSvg({ definition, ...props }: IconProps & { readonly definition: IconDefinition }): ReactNode {
    const parts = partsFor(definition, props);
    const body = (
        <>
            <Tiles parts={parts} />
            {parts.strokes.map((d) => <path key={d} d={d} />)}
            <Seams parts={parts} />
            <path d={parts.detail.d} stroke={parts.detail.attribute} style={{ stroke: parts.detail.style }} />
        </>
    );
    return (
        <SvgFrame parts={parts} props={props}>
            {parts.spin ? (
                <g>
                    {body}
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                </g>
            ) : body}
        </SvgFrame>
    );
}

export const createIcon = (definition: IconDefinition): ((props: IconProps) => ReactNode) => {
    const Component = (props: IconProps): ReactNode => <IconSvg definition={definition} {...props} />;
    Component.displayName = definition.name.charAt(0).toUpperCase() + definition.name.slice(1);
    return Component;
};
