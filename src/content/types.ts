/* Shapes of the content in site.ts. You normally don't need to edit this file. */

export type SiteMode = "pre-wedding" | "post-wedding";

export interface Link {
  label: string;
  path: string;
}

export interface Place {
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface Photo {
  /** File name of an image in src/assets/photos, e.g. "how-we-met.jpg". */
  file: string;
  /** Describes the photo for screen readers. */
  alt: string;
  /** Optional line shown under the photo. */
  caption: string;
}

/** A section of Our Story: paragraphs and photo rows, in order. */
export interface Milestone {
  /** Shown above the title, e.g. "December 2022". "" to hide. */
  when: string;
  title: string;
  body: (string | { photos: Photo[] })[];
}

export interface ScheduleEvent {
  /** Stable id, shared with the Phase 2 database. Don't change once set. */
  id: string;
  name: string;
  /** "YYYY-MM-DD", or "" if not announced yet. */
  date: string;
  /** "HH:MM" 24-hour Chicago time, or "". */
  start: string;
  end: string;
  /** Optional wording shown instead of the start/end times. */
  time: string;
  venue: string;
  address: string;
  description: string;
  dressCode: string;
  /** Optional color bar under the attire text; color names a --swatch-… token. */
  swatches?: { label: string; color: string }[];
}

export interface Hotel {
  name: string;
  address: string;
  phone: string;
  url: string;
  parking: string;
  breakfast: string;
  location: string;
  goodToKnow: string;
}

export interface ExploreItem {
  name: string;
  note: string;
  url: string;
}

export interface SiteContent {
  mode: SiteMode;
  domain: string;
  couple: { first: string; second: string; joiner: string; monogram: string };
  weddingDate: string;
  ceremony: Place;
  reception: Place;
  contactEmail: string;
  announcement: string;
  intro: { sealImage: string; openLabel: string; openHint: string; skipLabel: string };
  leaves: { pileLabel: string; spriteImages: string[] };
  nav: Link[];
  home: {
    eyebrow: string;
    intro: string;
    countdownSuffix: string;
    countdownToday: string;
    countdownPast: string;
    links: Link[];
  };
  story: {
    title: string;
    intro: string;
    headerPhoto: Photo;
    milestones: Milestone[];
    finale: { title: string; body: string[]; photo: Photo };
  };
  schedule: {
    title: string;
    intro: string;
    labels: { now: string; next: string; where: string; attire: string; swatches: string; mapsHint: string };
    events: ScheduleEvent[];
  };
  travel: {
    title: string;
    intro: string;
    notice: { eyebrow: string; title: string; text: string; action: string };
    notesTitle: string;
    notes: { heading: string; text: string[] }[];
    accommodationsTitle: string;
    hotelLabels: {
      parking: string;
      breakfast: string;
      location: string;
      goodToKnow: string;
      website: string;
      maps: string;
    };
    hotelGroups: { town: string; hotels: Hotel[] }[];
    gettingThereTitle: string;
    gettingThere: { heading: string; text: string }[];
    exploreTitle: string;
    exploreGroups: { category: string; items: ExploreItem[] }[];
    mapEmbedUrl: string;
    mapLink: string;
    mapLinkLabel: string;
    mapTitle: string;
  };
  registry: { title: string; message: string; url: string; buttonLabel: string };
  faqs: { title: string; intro: string; items: { q: string; a: string }[] };
  rsvp: { title: string; heading: string; message: string };
  notFound: { title: string; heading: string; message: string; linkLabel: string };
  footer: { contactLabel: string };
  meta: {
    description: string;
    skipToContent: string;
    menuOpen: string;
    menuClose: string;
    tba: string;
  };
}
