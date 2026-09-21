/**
 * Location section — connectivity and place for HODU private villas.
 * Times shown are approximate city-centre references and confirmed on enquiry.
 */

export const LOCATION_CITY = 'Vijayawada, Andhra Pradesh';

export const LOCATION_INTRO =
  'HODU builds private villas in and around Vijayawada — connected to major roads, rail and air, with schools, hospitals, retail and everyday conveniences within reach.';

export interface LocationDetail {
  label: string;
  note: string;
}

export interface LocationInfoCard {
  index: string;
  title: string;
  details: LocationDetail[];
}

export const LOCATION_INFO_CARDS: LocationInfoCard[] = [
  {
    index: '01',
    title: 'Connectivity',
    details: [
      { label: 'NH-16', note: 'Easy access to major cities' },
      { label: 'City road network', note: 'Well connected to key areas' },
    ],
  },
  {
    index: '02',
    title: 'Travel',
    details: [
      { label: 'Vijayawada International Airport', note: '~25–30 mins' },
      { label: 'Vijayawada Junction', note: '~15–20 mins' },
    ],
  },
  {
    index: '03',
    title: 'Everyday Life',
    details: [
      { label: 'Schools', note: 'Within the city network' },
      { label: 'Hospitals', note: 'Established care nearby' },
      { label: 'Retail', note: 'Daily essentials close by' },
      { label: 'Dining', note: 'City dining within reach' },
    ],
  },
];

export const LOCATION_STRIP = {
  eyebrow: 'Prime Location',
  title: 'Close to the city. Connected to a better life.',
  copy:
    "Enjoy the convenience of city life with the comfort of a private villa. HODU's locations offer excellent connectivity, essential amenities and a peaceful environment.",
  stats: [
    { value: '25–30 mins', label: 'Airport' },
    { value: '15–20 mins', label: 'Railway Station' },
    { value: 'NH-16', label: 'Easy Access' },
  ],
};

/** @deprecated Use LOCATION_INFO_CARDS */
export const LOCATION_GROUPS = LOCATION_INFO_CARDS.map((card) => ({
  index: card.index,
  title: card.title,
  copy: '',
  items: card.details.map((d) => d.label),
}));

export const DISTANCE_NOTE =
  'Drive times are approximate from central Vijayawada and confirmed with a site map on enquiry.';
