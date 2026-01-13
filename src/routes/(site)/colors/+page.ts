import type { PageLoadEvent } from './$types';
import type { Color } from './colors';

export async function load({ fetch }: PageLoadEvent) {
  console.log('load started');
  const r = await fetch('/global-colors.json');
  console.log('fetched', r.status);
  const colors: Color[] = await r.json();
  console.log('parsed');
  return { colors };
}
