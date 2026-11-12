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

export interface Milestone {
  when: string;
  title: string;
  text: string;
  /** File name of a photo in src/assets/photos, e.g. "how-we-met.jpg". "" shows an empty frame. */
  photo: string;
  photoAlt: string;
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
  venue: string;
  address: string;
  dressCode: string;
  notes: string;
}

export interface Hotel {
  name: string;
  distance: string;
  price: string;
  url: string;
  note: string;
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
    milestones: Milestone[];
    galleryTitle: string;
    gallery: { photo: string; alt: string }[];
  };
  schedule: { title: string; intro: string; events: ScheduleEvent[] };
  travel: {
    title: string;
    intro: string;
    accommodationsTitle: string;
    accommodationsIntro: string;
    hotels: Hotel[];
    gettingThereTitle: string;
    gettingThere: { heading: string; text: string }[];
    exploreTitle: string;
    exploreGroups: { category: string; items: ExploreItem[] }[];
    mapTitle: string;
    mapEmbedUrl: string;
    mapPlaceholder: string;
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
