/** The six stages from first conversation to handover. */
export interface ProcessStep {
  index: string;
  title: string;
  copy: string;
  /** Two or three concrete deliverables, so the stage is not just a label. */
  detail: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: '01',
    title: 'Consultation',
    copy: 'Understanding the client’s requirements — how the household lives, what the residence has to accommodate, and the budget it sits within.',
    detail: ['Brief and requirement study', 'Site and plot review', 'Indicative budget range'],
  },
  {
    index: '02',
    title: 'Planning',
    copy: 'Site analysis, spatial planning and project development, establishing orientation, privacy lines and the relationship between house and garden.',
    detail: ['Orientation and sun study', 'Spatial plan options', 'Approvals roadmap'],
  },
  {
    index: '03',
    title: 'Design',
    copy: 'Architecture, interiors and landscape coordinated as one set of drawings rather than three separate packages handed over in sequence.',
    detail: ['Architectural drawings', 'Interior and material palette', 'Landscape layout'],
  },
  {
    index: '04',
    title: 'Construction',
    copy: 'Structured execution with attention to quality and detail, with the design team reviewing work as it is built rather than only at completion.',
    detail: ['Stage-wise execution', 'Material approvals on site', 'Progress reviews'],
  },
  {
    index: '05',
    title: 'Inspection',
    copy: 'Reviewing workmanship and project completion — finishes, services, water-proofing and the details that only show themselves under use.',
    detail: ['Snag list and rectification', 'Services commissioning', 'Final quality review'],
  },
  {
    index: '06',
    title: 'Handover',
    copy: 'Delivering the completed residence with the documentation, warranties and guidance needed to run and maintain the house.',
    detail: ['Documentation handover', 'Systems walkthrough', 'Post-handover support'],
  },
];
