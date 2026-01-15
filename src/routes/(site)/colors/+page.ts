import type { Color } from './colors';
import colorsJSON from '$lib/assets/global.json';

export async function load() {
  const colors: Color[] = colorsJSON;
  return { colors };
}
