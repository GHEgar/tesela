import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { icons, validate } from 'tesela';
import type { Variant } from 'tesela';
import { IconSvg } from 'tesela/react';
import { Motion } from './Motion.js';

const HUES = [
    { id: 'slate', h: 250, c: 0.035 },
    { id: 'petrol', h: 205, c: 0.11 },
    { id: 'indigo', h: 268, c: 0.17 },
    { id: 'crimson', h: 22, c: 0.17 },
    { id: 'jade', h: 162, c: 0.12 },
    { id: 'ochre', h: 72, c: 0.13 },
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
    const [hue, setHue] = useState('petrol');
    const set = (patch: Partial<Settings>): void => setSettings((s) => ({ ...s, ...patch }));
    const selected = HUES.find((h) => h.id === hue) ?? HUES[1];
    const color: CSSProperties = { color: `oklch(0.57 ${selected?.c ?? 0.11} ${selected?.h ?? 205})` };
    const problems = useMemo(() => validate(icons), []);

    return (
        <div className="wrap">
            <header>
                <h1>tesela <span>· catalog</span></h1>
                <p>Five exact lines: four main strokes in a single brushstroke and a loose detail five tones off the main one.</p>
            </header>

            <div className="controls">
                <label className="ctl">
                    Stroke
                    <input type="range" min={1} max={2.5} step={0.1} value={settings.stroke} onChange={(e) => set({ stroke: Number(e.target.value) })} />
                    <output>{settings.stroke.toFixed(1)}</output>
                </label>
                <label className="ctl">
                    Joint
                    <input type="range" min={0.25} max={1.5} step={0.25} value={settings.junta} onChange={(e) => set({ junta: Number(e.target.value) })} />
                    <output>{settings.junta.toFixed(2)}</output>
                </label>
                <Seg label="Variant" value={settings.variant} options={[['line', 'line'], ['tiled', 'tiled']]} onChange={(variant) => set({ variant })} />
                <Seg label="Seams" value={settings.seams} options={[[true, 'marked'], [false, 'unmarked']]} onChange={(seams) => set({ seams })} />
                <Seg label="Size" value={settings.size} options={[[16, '16'], [24, '24'], [32, '32'], [48, '48']]} onChange={(size) => set({ size })} />
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
                                <span>{icon.name}</span>
                            </div>
                        ))}
                    </div>
                    <p className={problems.length ? 'review bad' : 'review'}>
                        {problems.length
                            ? problems.map((p) => `${p.name}: ${p.problem}`).join(' · ')
                            : `${icons.length} icons. All of them follow the rules with strokes from 1 to 2.5 and joints from 0.25 to 1.5.`}
                    </p>
                </div>
            </section>

            <section>
                <h2>Motion</h2>
                <div className="icon-color" style={color}>
                    <Motion settings={settings} />
                </div>
            </section>
        </div>
    );
}
