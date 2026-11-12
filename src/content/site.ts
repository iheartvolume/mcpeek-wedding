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
  /* --- Our Story --------------------------------------------------------
     Photos: put the image files in src/assets/photos/ and type just the
     file name below. They are resized and compressed automatically.
     Each section's "body" is a list of paragraphs (text in quotes) and
     photo rows ({ photos: [...] }), shown in the order written.
     "alt" describes the photo for screen readers; "caption" is optional
     and shows under the photo. Keep numbers out of titles (script font). */
  story: {
    title: "Our Story",
    intro: "",
    headerPhoto: {
      file: "01-header-chicago-skyline.jpg",
      alt: "Katie and Philip with the Chicago skyline",
      caption: "",
    },
    milestones: [
      {
        when: "December 2022",
        title: "How We Met",
        body: [
          "We met on a dating app in December 2022, though it took a little while to get going. Phil was in the middle of his busiest season as a church musician, so after a few messages he told Katie he’d write back after Christmas. Katie was interested enough that she told her family about him over the holidays, and then spent a little while wondering whether he’d actually follow through. He did.",
          "Somewhere in those early messages, we also found out we have the same favorite episode of one of our favorite shows, The West Wing: “The Supremes,” from Season 5. It felt like a very good sign.",
        ],
      },
      {
        when: "January 2023",
        title: "Our First Date",
        body: [
          "Our first date was at Barnes & Noble. We got coffee and hot chocolate from the cafe, wandered the shelves looking at books, and then found a spot to sit and talk. We had a lot in common, and the conversation came easily. Phil has since admitted he could tell Katie was nervous. It didn’t scare him off.",
          {
            photos: [
              { file: "01a-first-date-barnes-and-noble.jpg", alt: "The Barnes & Noble where we had our first date", caption: "" },
            ],
          },
          "By our seventh date, we were at the United Center watching the Blackhawks beat the Vegas Golden Knights in a shootout. That was February 2023, just over a month after the bookstore, and it’s the earliest photo we have of the two of us together. (Katie is still salty about a waved-off buzzer-beater in the third period. We’ll leave it there.)",
          {
            photos: [
              { file: "02-first-date-blackhawks-game.jpg", alt: "Katie and Philip at a Blackhawks game at the United Center", caption: "" },
            ],
          },
        ],
      },
      {
        when: "",
        title: "Our Adventures",
        body: [
          "Katie’s job means we get to travel often, and we’re lucky to take full advantage. We’ve wandered the canals of Haarlem, found a wall of love quotes in a Dublin alley, stood in front of the Gulf of Mexico tank at the aquarium in New Orleans, and made more than one trip to Las Vegas.",
          {
            photos: [
              { file: "03-travel-haarlem-netherlands.jpg", alt: "Katie and Philip in Haarlem, Netherlands", caption: "Haarlem, Netherlands" },
              { file: "04-travel-love-lane-dublin.jpg", alt: "Katie and Philip at the wall of love quotes on Love Lane in Dublin", caption: "Love Lane, Dublin" },
              { file: "05-travel-audubon-aquarium-new-orleans.jpg", alt: "Katie and Philip in front of the Gulf of Mexico tank at the Audubon Aquarium", caption: "Audubon Aquarium, New Orleans" },
            ],
          },
          "Closer to home, we love the Morton Arboretum. We’ve watched the leaves turn there in the fall, and we go back after dark for Illumination, which has become one of our favorite holiday traditions.",
          {
            photos: [
              { file: "06-local-morton-arboretum-illumination.jpg", alt: "Katie and Philip among the lights at Illumination", caption: "Illumination at the Morton Arboretum" },
              { file: "07-local-morton-arboretum-fall.jpg", alt: "Katie and Philip with fall leaves at the Morton Arboretum", caption: "" },
            ],
          },
          "But most of our local adventures involve live music. In nearly four years together, we’ve been to more than 50 concerts, pop and classical, from Ravinia to the Riviera. Blues Traveler is practically our house band. Phil sang “Run Around” at karaoke on our second date, and we’ve seen them live at least twice since.",
          {
            photos: [
              { file: "08-concerts-blues-traveler-riviera.jpg", alt: "Katie and Philip at a Blues Traveler concert at the Riviera Theatre", caption: "The Riviera Theatre, Chicago" },
            ],
          },
          "Our camera roll is mostly selfies of the two of us out doing things, and we wouldn’t change that.",
          {
            photos: [
              { file: "09-renaissance-faire.jpg", alt: "Katie and Philip at a Renaissance faire", caption: "" },
            ],
          },
        ],
      },
      {
        when: "",
        title: "The Proposal",
        body: [
          "We both knew it was coming. Katie had picked out the ring, so there were no surprises there, and Phil kept the location to himself. He chose a forest preserve neither of us had ever been to, for one reason: it would look beautiful at sunset. Once we got there, it was pretty clear what was about to happen. We walked a little way, found a scenic spot, and Phil got down on one knee. Katie said yes. It was low-key and happy, just like us.",
          {
            photos: [
              { file: "10-proposal-ring-sunset.jpg", alt: "Katie’s engagement ring at sunset", caption: "" },
            ],
          },
        ],
      },
    ],
    closingPhoto: {
      file: "11-closing-nose-to-nose.jpg",
      alt: "Katie and Philip nose to nose",
      caption: "",
    },
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
