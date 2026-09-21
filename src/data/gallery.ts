/**
 * Visual journey — exterior through to night. `span` drives the editorial
 * composition (wide images break the rhythm), `image` is a still key from
 * scripts/build-assets.mjs.
 */
export interface GalleryShot {
  index: string;
  title: string;
  /** Short factual caption, not marketing copy. */
  caption: string;
  image: string;
  span: 'wide' | 'tall' | 'standard';
  alt: string;
}

export const GALLERY_SHOTS: GalleryShot[] = [
  {
    index: '01',
    title: 'Exterior',
    caption: 'Street elevation and approach',
    image: 'project-01',
    span: 'wide',
    alt: 'Daytime street elevation of a contemporary HODU villa with stone cladding and deep shading',
  },
  {
    index: '02',
    title: 'Entrance',
    caption: 'Arrival court and threshold',
    image: 'architecture-entry',
    span: 'standard',
    alt: 'Villa entrance with full-height glazed doors set into a stone-clad wall',
  },
  {
    index: '03',
    title: 'Living',
    caption: 'Double-height living hall',
    image: 'interior-01',
    span: 'standard',
    alt: 'Living hall with tall glazing opening to the garden and a natural material palette',
  },
  {
    index: '04',
    title: 'Dining',
    caption: 'Dining and gathering',
    image: 'interior-02',
    span: 'tall',
    alt: 'Dining area with timber joinery and concealed lighting',
  },
  {
    index: '05',
    title: 'Kitchen',
    caption: 'Island kitchen and preparation',
    image: 'interior-03',
    span: 'standard',
    alt: 'Kitchen with book-matched stone island and full-height timber storage',
  },
  {
    index: '06',
    title: 'Bedroom',
    caption: 'Principal suite',
    image: 'gallery-bedroom',
    span: 'wide',
    alt: 'Principal bedroom with slatted timber headboard wall and glazing onto a private terrace',
  },
  {
    index: '07',
    title: 'Bathroom',
    caption: 'Stone-clad bathing',
    image: 'gallery-bathroom',
    span: 'standard',
    alt: 'Bathroom with stone vanity, backlit mirror and freestanding bath',
  },
  {
    index: '08',
    title: 'Stair',
    caption: 'Timber and glass stair',
    image: 'gallery-stair',
    span: 'tall',
    alt: 'Cantilevered timber stair treads against plaster with a glass balustrade',
  },
  {
    index: '09',
    title: 'Pool',
    caption: 'Pool terrace at dusk',
    image: 'gallery-pool',
    span: 'standard',
    alt: 'Lit swimming pool on a terrace at dusk with the city beyond',
  },
  {
    index: '10',
    title: 'Garden',
    caption: 'Planted terrace and seating',
    image: 'gallery-garden',
    span: 'standard',
    alt: 'Planted terrace with outdoor seating and low lighting at dusk',
  },
  {
    index: '11',
    title: 'Night exterior',
    caption: 'The villa after dark',
    image: 'gallery-night',
    span: 'wide',
    alt: 'HODU villa lit from within at night, reflected in the pool',
  },
];
