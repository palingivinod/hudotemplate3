/**
 * Available HODU private villas — buyer information cards.
 * Specs are indicative until confirmed in writing.
 */
export interface VillaSpec {
  label: string;
  value: string;
}

export interface Villa {
  index: string;
  name: string;
  location: string;
  image: string;
  summary: string;
  specs: VillaSpec[];
  highlights: string[];
  status: string;
  specsConfirmed: boolean;
}

export const VILLAS: Villa[] = [
  {
    index: '01',
    name: 'HODU Signature Villa',
    location: 'Vijayawada, Andhra Pradesh',
    image: 'villa-signature',
    summary:
      'A four-bedroom private villa planned around a double-height living hall, a private garden and a west-facing outlook.',
    specs: [
      { label: 'Bedrooms', value: '4 Bedroom Private Villa' },
      { label: 'Built-up area', value: '4,500+ sq.ft.' },
      { label: 'Plot area', value: '6,000+ sq.ft.' },
      { label: 'Levels', value: 'Ground + 1' },
    ],
    highlights: ['Private Pool', 'Landscaped Garden', 'Smart Home'],
    status: 'Enquiries open',
    specsConfirmed: false,
  },
  {
    index: '02',
    name: 'Courtyard Villa',
    location: 'Benz Circle, Vijayawada',
    image: 'project-02',
    summary:
      'A private villa planned inward around a shaded courtyard so principal rooms draw light and privacy from the centre of the plot.',
    specs: [
      { label: 'Bedrooms', value: '4 Bedroom Private Villa' },
      { label: 'Built-up area', value: '4,200+ sq.ft.' },
      { label: 'Plot area', value: '5,400+ sq.ft.' },
      { label: 'Levels', value: 'Ground + 1' },
    ],
    highlights: ['Private Courtyard', 'Home Office', 'Covered Parking'],
    status: 'Enquiries open',
    specsConfirmed: false,
  },
  {
    index: '03',
    name: 'Garden Villa',
    location: 'Mangalagiri, Vijayawada',
    image: 'project-03',
    summary:
      'A contemporary private villa with a generous garden edge, double-height entrance and living spaces opening to outdoor seating.',
    specs: [
      { label: 'Bedrooms', value: '5 Bedroom Private Villa' },
      { label: 'Built-up area', value: '5,100+ sq.ft.' },
      { label: 'Plot area', value: '6,800+ sq.ft.' },
      { label: 'Levels', value: 'Ground + 1' },
    ],
    highlights: ['Private Garden', 'Double-Height Entry', 'Outdoor Living'],
    status: 'In planning',
    specsConfirmed: false,
  },
  {
    index: '04',
    name: 'Evening Villa',
    location: 'Patamata, Vijayawada',
    image: 'final-cta',
    summary:
      'Oriented for the end of the day, with deep western shading, a lit water edge and entertaining spaces that open to the private garden.',
    specs: [
      { label: 'Bedrooms', value: '4 Bedroom Private Villa' },
      { label: 'Built-up area', value: '4,800+ sq.ft.' },
      { label: 'Plot area', value: '6,200+ sq.ft.' },
      { label: 'Levels', value: 'Ground + 1' },
    ],
    highlights: ['Private Pool', 'Entertaining Terrace', 'Landscape Lighting'],
    status: 'In planning',
    specsConfirmed: false,
  },
];

export const SPECS_DISCLAIMER =
  'Areas, configurations and availability shown are indicative and confirmed in writing on enquiry.';
