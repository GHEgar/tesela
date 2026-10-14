import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { close, menu, resetColorSupport, supportsRelativeColor } from 'tesela';
import { Icon, IconTransition, Search } from 'tesela/react';

describe('componentes', () => {
    it('Search pinta un svg decorativo con su tamaño', () => {
        const { container } = render(<Search size={20} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('20');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('con title es role img', () => {
        const { getByRole } = render(<Search title="Buscar" />);
        expect(getByRole('img').textContent).toBe('Buscar');
    });

    it('Icon por nombre y nada si no existe', () => {
        expect(render(<Icon name="menu" />).container.querySelector('svg')).not.toBeNull();
        expect(render(<Icon name="nope" />).container.innerHTML).toBe('');
    });

    it('detailDirection pone la variable de dirección', () => {
        const { container } = render(<Search detailDirection="lighter" />);
        expect(container.querySelector('svg')?.getAttribute('style')).toContain('--tesela-dir: -1');
    });

    it('la transición mantiene un solo detalle y saca los trazos viejos', () => {
        const { container, rerender } = render(<IconTransition icon={menu} seams={false} />);
        rerender(<IconTransition icon={close} seams={false} />);
        expect(container.querySelectorAll('[data-leave]').length).toBeGreaterThan(0);
        expect(container.querySelectorAll('[data-enter]').length).toBeGreaterThan(0);
        expect(container.querySelectorAll('path[stroke^="color-mix"]')).toHaveLength(1);
    });

    it('al terminar quedan solo los trazos del ícono nuevo', async () => {
        const { container, rerender } = render(<IconTransition icon={menu} seams={false} duration={10} />);
        rerender(<IconTransition icon={close} seams={false} duration={10} />);
        await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
        expect(container.querySelectorAll('[data-leave]')).toHaveLength(0);
    });

    it('auto detecta el color relativo en el DOM y sin soporte deja el respaldo', () => {
        resetColorSupport();
        const supported = supportsRelativeColor();
        const { container } = render(<Search seams={false} />);
        const detail = container.querySelector('path[stroke^="color-mix"]');
        expect(detail?.getAttribute('style') ?? '').toContain(supported ? 'oklch(from' : '');
        if (!supported) expect(detail?.getAttribute('style') ?? '').not.toContain('oklch(from');
    });
});
