import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { Line, Reveal, TextReveal } from './ui/Reveal';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { scrollToSection } from '../lib/useSmoothScroll';
import { still } from '../lib/stills';
import './contact.css';

const LOCATIONS = [
  'Vijayawada — city',
  'Benz Circle',
  'Mangalagiri',
  'Patamata',
  'Open to suggestions',
];

const VILLA_TYPES = ['4 bedroom villa', '5 bedroom villa', 'Not decided yet'];

const BUDGETS = ['Under ₹3 Cr', '₹3 – 5 Cr', '₹5 – 8 Cr', 'Above ₹8 Cr', 'Prefer to discuss'];

interface Values {
  name: string;
  phone: string;
  email: string;
  location: string;
  villaType: string;
  budget: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: '',
  phone: '',
  email: '',
  location: '',
  villaType: '',
  budget: '',
  message: '',
};

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  const digits = values.phone.replace(/[^\d]/g, '');
  if (digits.length < 7) errors.phone = 'Please enter a contact number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Please tell us a little more (10 characters or more).';
  }
  return errors;
}

/**
 * Section 09 — Final CTA + enquiry.
 * Single conversion block; no separate contact section.
 */
export function ContactSection() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useLayoutEffect(() => {
    const section = bannerRef.current;
    const img = imgRef.current;
    if (!section || !img || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.08 },
        {
          yPercent: 8,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const set = (key: keyof Values) => (event: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const requestSiteVisit = () => {
    setValues((prev) => ({
      ...prev,
      message:
        prev.message.trim().length > 0
          ? prev.message
          : 'I would like to schedule a site visit. My preferred days and times are: ',
    }));
    document.getElementById('enq-name')?.focus();
    formRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = (Object.keys(found) as (keyof Values)[])[0];
      document.getElementById(`enq-${firstKey}`)?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section id="contact" className="contact">
      <div ref={bannerRef} className="contact__banner">
        <div className="contact__media" aria-hidden="true">
          <img
            ref={imgRef}
            src={still('final-cta', 1920)}
            srcSet={`${still('final-cta', 800)} 800w, ${still('final-cta', 1280)} 1280w, ${still('final-cta', 1920)} 1920w`}
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
          <span className="contact__veil" />
        </div>

        <div className="shell contact__banner-inner">
          <TextReveal as="h2" className="contact__banner-title">
            <Line>Find the Villa</Line>
            <Line>That Fits Your Life.</Line>
          </TextReveal>
          <Reveal as="p" className="contact__banner-copy" delay={0.1}>
            Explore available HODU villas or speak with our team about your requirements, location
            and budget.
          </Reveal>
          <Reveal className="contact__banner-actions" delay={0.16} stagger={0.06}>
            <button type="button" className="btn btn--on-dark" onClick={requestSiteVisit}>
              Schedule a Site Visit
              <span className="btn__arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
            <button
              type="button"
              className="btn btn--ghost-dark"
              onClick={() => {
                const form = document.getElementById('enquiry-form');
                if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                else scrollToSection('#contact', -40);
              }}
            >
              Enquire Now
            </button>
          </Reveal>
        </div>
      </div>

      <div className="section section--ivory contact__form-block">
        <div className="shell contact__grid">
          <div className="contact__aside">
            <Reveal as="p" className="eyebrow">
              Enquire
            </Reveal>
            <TextReveal as="h3" className="contact__form-title">
              <Line>Let’s Find Your</Line>
              <Line>
                <em>Villa.</em>
              </Line>
            </TextReveal>
            <Reveal as="p" className="contact__aside-copy" delay={0.1}>
              Tell us what you’re looking for and our team will help you explore the right villa.
            </Reveal>
            <Reveal as="dl" className="contact__details" delay={0.14}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:enquiries@hodu.in">enquiries@hodu.in</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+919999999999">+91 99999 99999</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Vijayawada, Andhra Pradesh</dd>
              </div>
            </Reveal>
          </div>

          <Reveal className="contact__formwrap" delay={0.08}>
            {submitted ? (
              <div className="enq__success" role="status">
                <span className="index-num">Enquiry received</span>
                <p className="h3 enq__success-title">
                  Thank you, {values.name.trim().split(' ')[0]}.
                </p>
                <p className="body">
                  Your enquiry has reached the HODU team. We will be in touch shortly.
                </p>
                <button
                  type="button"
                  className="tlink"
                  onClick={() => {
                    setValues(EMPTY);
                    setSubmitted(false);
                  }}
                >
                  Send another enquiry
                  <span className="btn__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
              </div>
            ) : (
              <form id="enquiry-form" className="enq__form" onSubmit={onSubmit} noValidate ref={formRef}>
                <div className="enq__row">
                  <Field
                    id="enq-name"
                    label="Name"
                    value={values.name}
                    error={errors.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                  <Field
                    id="enq-phone"
                    label="Phone"
                    type="tel"
                    value={values.phone}
                    error={errors.phone}
                    onChange={set('phone')}
                    autoComplete="tel"
                  />
                </div>
                <Field
                  id="enq-email"
                  label="Email"
                  type="email"
                  value={values.email}
                  error={errors.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
                <div className="enq__row">
                  <Select
                    id="enq-location"
                    label="Preferred location"
                    value={values.location}
                    options={LOCATIONS}
                    onChange={set('location')}
                  />
                  <Select
                    id="enq-villaType"
                    label="Villa type"
                    value={values.villaType}
                    options={VILLA_TYPES}
                    onChange={set('villaType')}
                  />
                </div>
                <Select
                  id="enq-budget"
                  label="Budget"
                  value={values.budget}
                  options={BUDGETS}
                  onChange={set('budget')}
                />
                <div className="enq__field">
                  <label className="enq__label" htmlFor="enq-message">
                    Message
                  </label>
                  <textarea
                    id="enq-message"
                    className={`enq__input enq__textarea ${errors.message ? 'has-error' : ''}`}
                    rows={3}
                    value={values.message}
                    onChange={set('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'enq-message-error' : undefined}
                  />
                  {errors.message ? (
                    <p className="enq__error" id="enq-message-error">
                      {errors.message}
                    </p>
                  ) : null}
                </div>
                <button type="submit" className="btn enq__submit" disabled={sending}>
                  {sending ? 'Sending' : 'Request a Private Consultation'}
                  <span className="btn__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </button>
                <p className="enq__note">
                  This is a demonstration build — enquiries are acknowledged locally and are not
                  sent to a server.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (event: { target: { value: string } }) => void;
  type?: string;
  autoComplete?: string;
}

function Field({ id, label, value, error, onChange, type = 'text', autoComplete }: FieldProps) {
  return (
    <div className="enq__field">
      <label className="enq__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`enq__input ${error ? 'has-error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p className="enq__error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (event: { target: { value: string } }) => void;
}

function Select({ id, label, value, options, onChange }: SelectProps) {
  return (
    <div className="enq__field">
      <label className="enq__label" htmlFor={id}>
        {label} <span className="enq__optional">Optional</span>
      </label>
      <select id={id} className="enq__input enq__select" value={value} onChange={onChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
