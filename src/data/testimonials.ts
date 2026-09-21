/**
 * Client testimonials.
 *
 * INTENTIONALLY EMPTY. No verified HODU testimonials exist, and inventing
 * client names or quotes would be a fabrication. `TestimonialsSection` renders
 * nothing while this array is empty — add real, attributable entries here and
 * the section appears automatically, no component changes needed.
 */
export interface Testimonial {
  quote: string;
  /** Attribution as the client has agreed to it being published. */
  name: string;
  /** e.g. "HODU Signature Villa, 2026". */
  context: string;
}

export const TESTIMONIALS: Testimonial[] = [];
