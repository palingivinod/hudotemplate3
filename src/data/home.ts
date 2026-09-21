/**
 * Homepage content — HODU private villa builder IA.
 * One idea per section. Villa language throughout.
 */

export const STORY_CARDS = [
  {
    index: '01',
    title: 'Villa Planning',
    copy: 'Plot, orientation and lifestyle requirements settled before design begins.',
  },
  {
    index: '02',
    title: 'Integrated Design',
    copy: 'Architecture, interiors and landscape developed as one coordinated scope.',
  },
  {
    index: '03',
    title: 'Construction',
    copy: 'Structured execution with site supervision and stage-wise quality reviews.',
  },
  {
    index: '04',
    title: 'Handover',
    copy: 'Final inspection, documentation and a clear walkthrough of the completed villa.',
  },
];

export const PHILOSOPHY_CARDS = [
  {
    index: '01',
    title: 'Thoughtful Planning',
    copy: 'Spatial flow shaped by how the household actually lives day to day.',
  },
  {
    index: '02',
    title: 'Natural Light',
    copy: 'Orientation and openings planned for daylight, shade and climate.',
  },
  {
    index: '03',
    title: 'Privacy',
    copy: 'Rooms, gardens and terraces arranged for seclusion on the plot.',
  },
  {
    index: '04',
    title: 'Connected Spaces',
    copy: 'Living areas open to garden and pool without losing enclosure.',
  },
];

export const PROCESS_CARDS = [
  {
    index: '01',
    title: 'Consultation',
    copy: 'Understanding requirements, lifestyle and expectations.',
  },
  {
    index: '02',
    title: 'Site & Planning',
    copy: 'Understanding the plot, orientation and spatial requirements.',
  },
  {
    index: '03',
    title: 'Design',
    copy: 'Architecture, interiors and landscape planning.',
  },
  {
    index: '04',
    title: 'Construction',
    copy: 'Structured execution and site supervision.',
  },
  {
    index: '05',
    title: 'Inspection',
    copy: 'Quality checks, finishing and systems review.',
  },
  {
    index: '06',
    title: 'Handover',
    copy: 'Final walkthrough, documentation and handover.',
  },
];

export const QUALITY_CARDS = [
  {
    index: '01',
    title: 'Materials',
    copy: 'Stone, timber, glass and metal selected for performance and longevity.',
  },
  {
    index: '02',
    title: 'Structure',
    copy: 'Buildable detailing reviewed against drawings on site.',
  },
  {
    index: '03',
    title: 'Finishes',
    copy: 'Joinery, surfaces and edges checked before handover.',
  },
  {
    index: '04',
    title: 'Services',
    copy: 'Electrical, plumbing and HVAC coordinated with the architecture.',
  },
  {
    index: '05',
    title: 'Smart Home',
    copy: 'Automation and security planned into the villa, not added later.',
  },
  {
    index: '06',
    title: 'Inspection',
    copy: 'Stage reviews and snagging before keys are handed over.',
  },
];

export const WHY_CARDS = [
  {
    title: 'Integrated Design',
    copy: 'Architecture, interiors and landscape coordinated together.',
  },
  {
    title: 'Structured Process',
    copy: 'Clear stages from consultation through handover.',
  },
  {
    title: 'Quality Focus',
    copy: 'Materials and workmanship reviewed throughout construction.',
  },
  {
    title: 'Long-Term Thinking',
    copy: 'Planning and materials considered for durability and everyday use.',
  },
];

export const LOCATION_CARDS = [
  {
    title: 'Connectivity',
    items: ['NH-16', 'City road network'],
  },
  {
    title: 'Travel',
    items: ['Vijayawada International Airport', 'Vijayawada Junction'],
  },
  {
    title: 'Everyday Life',
    items: ['Schools', 'Hospitals', 'Retail', 'Dining'],
  },
];

/* Prefer LOCATION_INFO_CARDS from data/location.ts for the Location section. */

/* Legacy aliases kept so older imports do not break mid-refactor. */
export const ABOUT_MARKERS = STORY_CARDS.map(({ title, copy }) => ({ title, copy }));
export const ARCH_PRINCIPLES = PHILOSOPHY_CARDS;
export const FEATURE_CARDS = QUALITY_CARDS.map((c) => ({
  index: c.index,
  title: c.title,
  items: [c.copy],
}));
export const MATERIAL_CARDS = [
  { name: 'Natural Stone', swatch: 'stone', copy: 'Durability, texture and timeless character.' },
  { name: 'Natural Wood', swatch: 'timber', copy: 'Warmth across joinery, ceilings and screens.' },
  { name: 'Architectural Glass', swatch: 'glass', copy: 'Natural light and connection with the garden.' },
  { name: 'Metal & Detail', swatch: 'metal', copy: 'Frames, shading and architectural detailing.' },
];
export const INTERIOR_SHOTS: Array<{
  index: string;
  label: string;
  caption: string;
  image: string;
  alt: string;
}> = [];
