import { actions } from './actions.js';
import { brand, mapIcons } from './map.js';
import { navigation } from './navigation.js';
import { objects } from './objects.js';
import { status } from './status.js';
import type { IconDefinition } from '../geometry.js';

export * from './actions.js';
export * from './map.js';
export * from './navigation.js';
export * from './objects.js';
export * from './status.js';

export const icons: readonly IconDefinition[] = [...navigation, ...actions, ...status, ...objects, ...mapIcons, ...brand];

export const iconNames = icons.map((icon) => icon.name);

export const getIcon = (name: string): IconDefinition | undefined => icons.find((icon) => icon.name === name);
