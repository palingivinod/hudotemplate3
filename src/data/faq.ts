/**
 * Homepage FAQ.
 *
 * Answers describe HODU's approach and stay deliberately non-committal on
 * anything contractual — timelines, inclusions and support terms vary per
 * project, so those answers point to the enquiry rather than state figures
 * that would need verifying. Replace with confirmed commercial terms when
 * available.
 */
export interface Faq {
  index: string;
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    index: '01',
    question: 'What types of villas does HODU offer?',
    answer:
      'Private, individually designed luxury villas — typically four and five bedroom residences on their own plots, planned around a central living space, a private garden and a clear separation between social and private areas. HODU does not build apartments or gated towers.',
  },
  {
    index: '02',
    question: 'Where are the villas located?',
    answer:
      'In and around Vijayawada, Andhra Pradesh, including the Benz Circle, Mangalagiri and Patamata areas. Specific plot locations and a site map are shared as part of an enquiry.',
  },
  {
    index: '03',
    question: 'What is the typical villa size?',
    answer:
      'Residences in the current collection are indicatively in the 4,200–5,100 sq.ft. built-up range on plots from around 5,400 sq.ft. Final areas are confirmed in writing per residence.',
  },
  {
    index: '04',
    question: 'Can the interiors be customised?',
    answer:
      'Yes. Layouts, material palettes, joinery and lighting are developed with the client during the design stage. The degree of change possible depends on how far construction has progressed.',
  },
  {
    index: '05',
    question: 'What is included with the villa?',
    answer:
      'Architecture, interiors and landscape are coordinated as one scope, with the material palette, kitchen, bathrooms, lighting and smart-home provision specified at design stage. The exact inclusion list forms part of the agreement for each residence.',
  },
  {
    index: '06',
    question: 'What is the construction timeline?',
    answer:
      'Timelines depend on plot, approvals and the extent of customisation, and are issued as a stage-wise programme after the planning stage rather than quoted upfront.',
  },
  {
    index: '07',
    question: 'How does the booking process work?',
    answer:
      'An enquiry leads to a consultation and site discussion. Once a residence and scope are agreed, booking, documentation and payment stages are set out in writing before work begins.',
  },
  {
    index: '08',
    question: 'Can I schedule a site visit?',
    answer:
      'Yes. Site visits and private viewings are arranged by appointment — submit an enquiry with your preferred timing and the team will confirm.',
  },
  {
    index: '09',
    question: 'What level of after-sales support is provided?',
    answer:
      'Handover includes documentation, a walkthrough of the home’s systems and a defined post-handover support period. The specific terms are confirmed as part of the project agreement.',
  },
];
