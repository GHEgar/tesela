import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { icons, validate } from 'tesela';
import type { Variant } from 'tesela';
import { IconSvg } from 'tesela/react';
import { Motion } from './Motion.js';

const HUES = [
    { id: 'pizarra', h: 250, c: 0.035 },
    { id: 'petróleo', h: 205, c: 0.11 },
    { id: 'añil', h: 268, c: 0.17 },
    { id: 'grana', h: 22, c: 0.17 },
    { id: 'jade', h: 162, c: 0.12 },
    { id: 'ocre', h: 72, c: 0.13 },
];

export interface Settings {
    readonly stroke: number;
    readonly junta: number;
    readonly seams: boolean;
    readonly variant: Variant;
    readonly size: number;
}

interface SegProps<T extends string | number | boolean> {
    readonly label: string;
    readonly value: T;
    readonly options: readonly (readonly [T, string])[];
    readonly onChange: (value: T) => void;
}

function Seg<T extends string | number | boolean>({ label, value, options, onChange }: SegProps<T>): ReactNode {
    return (
        <div className="ctl">
            {label}
            <div className="seg">
                {options.map(([v, text]) => (
                    <button key={String(v)} type="button" aria-pressed={v === value} onClick={() => onChange(v)}>{text}</button>
                ))}
            </div>
        </div>
    );
}

export function App(): ReactNode {
    const [settings, setSettings] = useState<Settings>({ stroke: 1.5, junta: 0.5, seams: true, variant: 'line', size: 32 });
    const [hue, setHue] = useState('petróleo');
    const set = (patch: Partial<Settings>): void => setSettings((s) => ({ ...s, ...patch }));
    const selected = HUES.find((h) => h.id === hue) ?? HUES[1];
    const color: CSSProperties = { color: `oklch(0.57 ${selected?.c ?? 0.11} ${selected?.h ?? 205})` };
    const problems = useMemo(() => validate(icons), []);

    return (
        <div className="wrap">
            <header>
                <h1>tesela <span>· catálogo</span></h1>
                <p>Cinco líneas exactas: cuatro trazos principales de un pincelazo y un detalle suelto a cinco tonos del principal.</p>
            </header>

            <div className="controls">
                <label className="ctl">
                    Trazo
                    <input type="range" min={1} max={2.5} step={0.1} value={settings.stroke} onChange={(e) => set({ stroke: Number(e.target.value) })} />
                    <output>{settings.stroke.toFixed(1)}</output>
                </label>
                <label className="ctl">
                    Junta
                    <input type="range" min={0.25} max={1.5} step={0.25} value={settings.junta} onChange={(e) => set({ junta: Number(e.target.value) })} />
                    <output>{settings.junta.toFixed(2)}</output>
                </label>
                <Seg label="Variante" value={settings.variant} options={[['line', 'línea'], ['tiled', 'teselado']]} onChange={(variant) => set({ variant })} />
                <Seg label="Uniones" value={settings.seams} options={[[true, 'marcadas'], [false, 'sin marca']]} onChange={(seams) => set({ seams })} />
                <Seg label="Tamaño" value={settings.size} options={[[16, '16'], [24, '24'], [32, '32'], [48, '48']]} onChange={(size) => set({ size })} />
                <div className="ctl">
                    Color
                    <div className="hues">
                        {HUES.map((h) => (
                            <button key={h.id} type="button" aria-label={h.id} aria-pressed={h.id === hue} style={{ background: `oklch(0.57 ${h.c} ${h.h})` }} onClick={() => setHue(h.id)} />
                        ))}
                    </div>
                </div>
            </div>

            <section>
                <h2>Set</h2>
                <div className="panel">
                    <div className="grid icon-color" style={color}>
                        {icons.map((icon) => (
                            <div key={icon.name} className="cell">
                                <IconSvg definition={icon} {...settings} title={icon.label} />
                                {icon.name}
                            </div>
                        ))}
                    </div>
                    <p className={problems.length ? 'review bad' : 'review'}>
                        {problems.length
                            ? problems.map((p) => `${p.name}: ${p.problem}`).join(' · ')
                            : `${icons.length} íconos. Todos cumplen las reglas con trazo de 1 a 2.5 y junta de 0.25 a 1.5.`}
                    </p>
                </div>
            </section>

            <section>
                <h2>Movimiento</h2>
                <div className="icon-color" style={color}>
                    <Motion settings={settings} />
                </div>
            </section>
        </div>
    );
}
