import type { ReactNode } from 'react';
import { getIcon } from 'tesela';
import { IconSvg } from './IconSvg.js';
import type { IconProps } from './IconSvg.js';

export function Icon({ name, ...props }: IconProps & { readonly name: string }): ReactNode {
    const definition = getIcon(name);
    return definition ? <IconSvg definition={definition} {...props} /> : null;
}
