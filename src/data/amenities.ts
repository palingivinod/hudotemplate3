/**
 * Villa features, grouped so the section reads as specification rather than a
 * marketing list. Provision varies by residence — the section states this
 * once, and `AMENITIES_NOTE` is the single place to edit that wording.
 */
export interface AmenityGroup {
  index: string;
  title: string;
  copy: string;
  items: string[];
}

export const AMENITY_GROUPS: AmenityGroup[] = [
  {
    index: '01',
    title: 'Outdoor living',
    copy: 'The garden is planned with the house, not fitted around it once built.',
    items: [
      'Private swimming pool',
      'Landscaped garden',
      'Outdoor entertaining deck',
      'Shaded terrace',
    ],
  },
  {
    index: '02',
    title: 'Interior spaces',
    copy: 'Rooms sized for daily use, with storage and services planned in from the start.',
    items: ['Premium kitchen', 'Luxury bathrooms', 'Home office', 'Home theatre'],
  },
  {
    index: '03',
    title: 'Wellness and leisure',
    copy: 'Space for routine kept separate from the social core of the house.',
    items: ['Private gym', 'Quiet reading room', 'Pool deck', 'Garden seating'],
  },
  {
    index: '04',
    title: 'Systems and security',
    copy: 'Infrastructure specified at design stage so nothing is surface-mounted later.',
    items: [
      'Smart home systems',
      'Gated access and surveillance',
      'Private covered parking',
      'Large-format glazing',
    ],
  },
];

export const AMENITIES_NOTE =
  'Features are indicative of the collection. Provision for a specific residence is confirmed on enquiry.';
