import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getIcon } from 'tesela';
import type { IconDefinition } from 'tesela';
import { IconTransition } from 'tesela/react';
import type { Settings } from './App.js';

const CYCLE = ['search', 'download', 'table', 'pin', 'alert', 'home', 'filter', 'eye', 'check', 'menu', 'play', 'settings', 'user', 'mail'];
const PAIRS: readonly (readonly [string, string])[] = [
    ['menu', 'close'], ['play', 'pause'], ['chevronDown', 'chevronUp'], ['eye', 'eyeOff'], ['plus', 'minus'],
    ['download', 'check'], ['lock', 'unlock'], ['undo', 'redo'], ['expand', 'collapse'], ['zoomIn', 'zoomOut'],
];

const icon = (name: string): IconDefinition => {
    const found = getIcon(name);
    if (!found) throw new Error(`Ícono desconocido: ${name}`);
    return found;
};

function Pair({ pair, settings }: { readonly pair: readonly [string, string]; readonly settings: Settings }): ReactNode {
    const [second, setSecond] = useState(false);
    const [a, b] = pair;
    return (
        <button type="button" className="pair" onClick={() => setSecond((s) => !s)} aria-label={`${a} a ${b}`}>
            <IconTransition icon={icon(second ? b : a)} {...settings} size={36} />
            <span>{a} ⇄ {b}</span>
        </button>
    );
}

export function Motion({ settings }: { readonly settings: Settings }): ReactNode {
    const [current, setCurrent] = useState('search');
    const [auto, setAuto] = useState(false);

    useEffect(() => {
        if (!auto) return undefined;
        const timer = setInterval(() => {
            setCurrent((name) => CYCLE[(CYCLE.indexOf(name) + 1) % CYCLE.length] ?? 'search');
        }, 1600);
        return () => clearInterval(timer);
    }, [auto]);

    return (
        <div className="lab">
            <div className="panel stage">
                <div className="big">
                    <IconTransition icon={icon(current)} {...settings} size={180} />
                </div>
                <div className="chips">
                    {CYCLE.map((name) => (
                        <button key={name} type="button" aria-pressed={name === current} onClick={() => { setAuto(false); setCurrent(name); }}>{name}</button>
                    ))}
                </div>
                <button type="button" className="pair" onClick={() => setAuto((a) => !a)}>{auto ? 'Detener ciclo' : 'Ciclo automático'}</button>
            </div>
            <div className="panel">
                <p>Los pares que cambian en la interfaz. Tócalos.</p>
                <div className="pairs">
                    {PAIRS.map((pair) => <Pair key={pair.join('-')} pair={pair} settings={settings} />)}
                </div>
            </div>
        </div>
    );
}
