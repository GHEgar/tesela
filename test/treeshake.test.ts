import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { describe, expect, it } from 'vitest';
import { iconNames } from 'tesela';

const at = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

const bundle = async (): Promise<string> => {
    const result = await build({
        configFile: false,
        logLevel: 'silent',
        resolve: {
            alias: [
                { find: /^tesela\/react$/, replacement: at('../src/react/index.ts') },
                { find: /^tesela$/, replacement: at('../src/core/index.ts') },
            ],
        },
        build: {
            write: false,
            minify: false,
            lib: { entry: at('./fixtures/dos-iconos.ts'), formats: ['es'], fileName: 'bundle' },
            rolldownOptions: { external: [/^react/] },
        },
    });
    const outputs = Array.isArray(result) ? result : [result];
    return outputs.flatMap((o) => ('output' in o ? o.output : [])).map((c) => ('code' in c ? c.code : '')).join('');
};

describe('tree-shaking', () => {
    it('dos íconos de tesela/react dejan fuera las definiciones que no se usan', async () => {
        const code = await bundle();
        const kept = iconNames.filter((name) => code.includes(`name: "${name}"`));
        expect(kept.sort()).toEqual(['layers', 'search']);
    }, 30000);
});
