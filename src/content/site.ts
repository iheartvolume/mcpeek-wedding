/* ==========================================================================
   SITE CONTENT — the one place for all words, dates, places, and links.
   Edit the text between the quotes. Anything in [square brackets] is a
   placeholder and must be replaced before the site goes live.

   Tips
   - Dates are written YYYY-MM-DD. Times are 24-hour "HH:MM" in Chicago time.
   - Leave a value as "" (empty quotes) to hide it where the site supports that.
   - Script headings cannot show numbers, so keep digits out of titles.
   ========================================================================== */

import type { SiteContent } from "./types";

export const site: SiteContent = {
  /* --- Site settings ----------------------------------------------------- */
  // "pre-wedding" now. "post-wedding" is reserved for a future thank-you page.
  mode: "pre-wedding",

  // Your domain, without https:// (e.g. "katieandphilip.com").
  // Leave "" until the domain is pointed at GitHub Pages.
  domain: "",

  /* --- The couple and the day ------------------------------------------- */
  couple: {
    first: "Katie",
    second: "Philip",
    joiner: "&",
    monogram: "M",
  },
  weddingDate: "2027-10-30",

  ceremony: {
    venue: "Trinity Lutheran Church",
    address: "3637 Golf Rd, Evanston, IL 60203",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Trinity+Lutheran+Church+3637+Golf+Rd+Evanston+IL+60203",
  },

  reception: {
    venue: "[Reception venue]",
    address: "[Reception address]",
    mapsUrl: "",
  },

  // Shown in the footer and on the FAQs page.
  contactEmail: "[contact email]",

  // A short notice shown at the top of the home page. Leave "" to hide it.
  announcement: "",

  /* --- Opening animation (first visit per browser session) ------------ */
  intro: {
    // The wax seal image (transparent PNG, WebP, or SVG) in /public/images.
    sealImage: "/images/seal.webp",
    openLabel: "Open the invitation",
    openHint: "Tap to open",
    skipLabel: "Skip",
  },

  /* --- Falling leaves (home page) --------------------------------------- */
  leaves: {
    pileLabel: "Leaf pile. Press to jump in.",
    // Optional: paths to transparent leaf PNGs in /public/images to use
    // instead of the drawn leaves, e.g. ["/images/leaf-1.png", "/images/leaf-2.png"].
    spriteImages: [],
  },

  /* --- Navigation -------------------------------------------------------- */
  nav: [
    { label: "Home", path: "/" },
    { label: "Our Story", path: "/our-story/" },
    { label: "Schedule", path: "/schedule/" },
    { label: "Travel", path: "/travel/" },
    { label: "Registry", path: "/registry/" },
    { label: "FAQs", path: "/faqs/" },
    { label: "RSVP", path: "/rsvp/" },
  ],

  /* --- Home page ------------------------------------------------------- */
  home: {
    eyebrow: "Together with their families",
    intro: "invite you to celebrate their wedding",
    countdownSuffix: "days to go",
    countdownToday: "Today is the day",
    countdownPast: "Thank you for celebrating with us",
    links: [
      { label: "The Schedule", path: "/schedule/" },
      { label: "Travel & Stay", path: "/travel/" },
      { label: "RSVP", path: "/rsvp/" },
    ],
  },

  /* --- Our Story ------------------------------------------------------- */
  // Photos: put image files in src/assets/photos/ and type just the file
  // name below, e.g. photo: "how-we-met.jpg". They are resized and
  // compressed automatically. Leave "" to show an empty frame.
  story: {
    title: "Our Story",
    intro: "[A sentence or two introducing your story.]",
    milestones: [
      {
        when: "[Year]",
        title: "[How we met]",
        text: "[A few sentences about how you met.]",
        photo: "",
        photoAlt: "[Describe the photo]",
      },
      {
        when: "[Year]",
        title: "[First date]",
        text: "[A few sentences about your first date.]",
        photo: "",
        photoAlt: "[Describe the photo]",
      },
      {
        when: "[Year]",
        title: "[A favorite adventure]",
        text: "[A few sentences about a trip or memory you love.]",
        photo: "",
        photoAlt: "[Describe the photo]",
      },
      {
        when: "[Year]",
        title: "[The proposal]",
        text: "[A few sentences about the proposal.]",
        photo: "",
        photoAlt: "[Describe the photo]",
      },
    ],

    // A photo gallery shown below the timeline. Add or remove entries freely.
    galleryTitle: "Moments",
    gallery: [
      { photo: "", alt: "[Describe the photo]" },
      { photo: "", alt: "[Describe the photo]" },
      { photo: "", alt: "[Describe the photo]" },
      { photo: "", alt: "[Describe the photo]" },
      { photo: "", alt: "[Describe the photo]" },
      { photo: "", alt: "[Describe the photo]" },
    ],
  },

  /* --- Schedule -------------------------------------------------------- */
  // Each event's "id" must stay the same once guests are invited (Phase 2 uses it).
  // Leave date or start/end as "" to show "to be announced".
  schedule: {
    title: "The Weekend",
    intro: "[A short line about the weekend's events.]",
    events: [
      {
        id: "rehearsal-dinner",
        name: "Rehearsal Dinner",
        date: "",
        start: "",
        end: "",
        venue: "[Venue name]",
        address: "[Venue address]",
        dressCode: "[Dress code]",
        notes: "[Notes, e.g. for the wedding party and family]",
      },
      {
        id: "ceremony",
        name: "Ceremony",
        date: "2027-10-30",
        start: "",
        end: "",
        venue: "Trinity Lutheran Church",
        address: "3637 Golf Rd, Evanston, IL 60203",
        dressCode: "[Dress code]",
        notes: "[Notes]",
      },
      {
        id: "reception",
        name: "Reception",
        date: "2027-10-30",
        start: "",
        end: "",
        venue: "[Reception venue]",
        address: "[Reception address]",
        dressCode: "[Dress code]",
        notes: "[Notes]",
      },
      {
        id: "brunch",
        name: "Farewell Brunch",
        date: "",
        start: "",
        end: "",
        venue: "[Venue name]",
        address: "[Venue address]",
        dressCode: "[Dress code]",
        notes: "[Notes]",
      },
    ],
  },

  /* --- Travel ---------------------------------------------------------- */
  travel: {
    title: "Travel & Stay",
    intro: "[A short welcome for out-of-town guests.]",

    accommodationsTitle: "Where to Stay",
    accommodationsIntro:
      "A few nearby hotels we recommend. There is no room block, so please book directly.",
    hotels: [
      {
        name: "[Hotel name]",
        distance: "[Distance to the ceremony]",
        price: "[Price tier, e.g. $$]",
        url: "",
        note: "[Short note]",
      },
      {
        name: "[Hotel name]",
        distance: "[Distance to the ceremony]",
        price: "[Price tier, e.g. $$$]",
        url: "",
        note: "[Short note]",
      },
      {
        name: "[Hotel name]",
        distance: "[Distance to the ceremony]",
        price: "[Price tier, e.g. $$]",
        url: "",
        note: "[Short note]",
      },
    ],

    gettingThereTitle: "Getting There",
    gettingThere: [
      { heading: "Flying into O'Hare", text: "[Notes about O'Hare: distance, typical drive time, transit options.]" },
      { heading: "Flying into Midway", text: "[Notes about Midway: distance, typical drive time, transit options.]" },
      { heading: "Parking at the Church", text: "[Parking notes for Trinity Lutheran Church.]" },
      { heading: "Rideshare & Transit", text: "[Rideshare and public transit notes.]" },
    ],

    exploreTitle: "Eat & Explore",
    exploreGroups: [
      {
        category: "Restaurants",
        items: [
          { name: "[Restaurant name]", note: "[Why you love it]", url: "" },
          { name: "[Restaurant name]", note: "[Why you love it]", url: "" },
        ],
      },
      {
        category: "Coffee & Sweets",
        items: [
          { name: "[Café name]", note: "[Why you love it]", url: "" },
          { name: "[Bakery name]", note: "[Why you love it]", url: "" },
        ],
      },
      {
        category: "Things to Do",
        items: [
          { name: "[Sight or activity]", note: "[Short note]", url: "" },
          { name: "[Sight or activity]", note: "[Short note]", url: "" },
        ],
      },
    ],

    mapTitle: "Map",
    // Paste ONLY the src="..." address from your Google My Maps embed code.
    mapEmbedUrl: "",
    mapPlaceholder: "[Map coming soon]",
  },

  /* --- Registry -------------------------------------------------------- */
  registry: {
    title: "Registry",
    message: "Our registry is coming soon. Your presence is the greatest gift.",
    // Paste the full registry link here; the button appears once it's set.
    url: "",
    buttonLabel: "View our registry",
  },

  /* --- FAQs ------------------------------------------------------------ */
  faqs: {
    title: "Questions & Answers",
    intro: "[A short line inviting guests to reach out with anything else.]",
    items: [
      { q: "What should I wear?", a: "[Dress code details.]" },
      {
        q: "What will the weather be like?",
        a: "Late October in Chicago is crisp and changeable: cool days, chilly evenings, and sometimes wind or rain. Please bring a warm coat and comfortable shoes for walking between the car and the church.",
      },
      { q: "Can I bring my children?", a: "[Kids policy. Your invitation will list everyone who is invited.]" },
      { q: "Can I bring a guest?", a: "[Plus-one policy. Your invitation will show if a guest is included.]" },
      { q: "Where should I park?", a: "[Parking details for the ceremony and reception.]" },
      { q: "Is the venue accessible?", a: "[Accessibility details: step-free entry, seating, restrooms.]" },
      { q: "Who can I contact with questions?", a: "Email us anytime at the address below and we'll get back to you." },
    ],
  },

  /* --- RSVP ------------------------------------------------------------ */
  rsvp: {
    title: "RSVP",
    heading: "RSVP opens soon",
    message: "[A short note about when RSVPs open and how to reply.]",
  },

  /* --- 404 page -------------------------------------------------------- */
  notFound: {
    title: "Page not found",
    heading: "Lost among the leaves",
    message: "We couldn't find that page.",
    linkLabel: "Return home",
  },

  /* --- Footer ---------------------------------------------------------- */
  footer: {
    contactLabel: "Questions? Write to us at",
  },

  /* --- Page titles (browser tab) --------------------------------------- */
  meta: {
    description: "The wedding of Katie and Philip.",
    skipToContent: "Skip to content",
    menuOpen: "Menu",
    menuClose: "Close",
    tba: "To be announced",
  },
};
