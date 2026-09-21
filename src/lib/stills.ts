/**
 * Editorial stills, derived at build time from the original HODU frame
 * sequence (see scripts/build-assets.mjs). Every image on the page therefore
 * comes from the supplied villa footage rather than stock photography.
 */
export type StillWidth = 800 | 1280 | 1920;

export function still(name: string, width: StillWidth = 1280): string {
  return `/stills/${name}-${width}.webp`;
}
