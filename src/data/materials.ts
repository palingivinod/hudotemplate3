/**
 * Material and finish categories. No manufacturers or product names are
 * claimed anywhere — specifications are described by character and purpose.
 * `swatch` keys map to the square crops in scripts/build-assets.mjs.
 */
export interface MaterialCategory {
  name: string;
  swatch: string;
  copy: string;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    name: 'Natural stone',
    swatch: 'stone',
    copy: 'Selected for durability, texture and timeless visual character, used across facades, floors and full-height surfaces.',
  },
  {
    name: 'Natural wood',
    swatch: 'timber',
    copy: 'Warm grain in joinery, ceilings and screens, chosen for stability in local humidity as much as for appearance.',
  },
  {
    name: 'Architectural glass',
    swatch: 'glass',
    copy: 'Large-format glazing that introduces natural light while holding a visual connection to the landscape.',
  },
  {
    name: 'Metalwork',
    swatch: 'metal',
    copy: 'Slim structural frames, railings and shading elements finished to resist weathering at the building edge.',
  },
  {
    name: 'Flooring',
    swatch: 'flooring',
    copy: 'Continuous large-format flooring that runs from inside to terrace, reducing visual joints and thresholds.',
  },
  {
    name: 'Lighting',
    swatch: 'lighting',
    copy: 'Layered architectural lighting — recessed, concealed and task — designed with the ceiling rather than added later.',
  },
  {
    name: 'Kitchen finishes',
    swatch: 'kitchen',
    copy: 'Full-height storage, stone worktops and integrated appliance housings planned around how the kitchen is actually used.',
  },
  {
    name: 'Bathroom fixtures',
    swatch: 'bathroom',
    copy: 'Concealed plumbing, stone-clad wet areas and fittings specified for serviceability over the long term.',
  },
];

/** The four interior principles that sit alongside the palette. */
export const SPATIAL_PRINCIPLES = [
  'Open living',
  'Private retreats',
  'Indoor / outdoor connection',
  'Natural light',
];

export const MATERIAL_VALUES = [
  { title: 'Natural and authentic', icon: 'leaf' },
  { title: 'Timeless quality', icon: 'facet' },
  { title: 'Designed for living', icon: 'rings' },
  { title: 'In harmony with nature', icon: 'sun' },
];
