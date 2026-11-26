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

  // The reception follows the ceremony at the church.
  reception: {
    venue: "Trinity Lutheran Church",
    address: "3637 Golf Rd, Evanston, IL 60203",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Trinity+Lutheran+Church+3637+Golf+Rd+Evanston+IL+60203",
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
      alt: "Katie and Philip standing together on the lakefront, with the Chicago skyline glowing at sunset behind them",
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
              { file: "01a-first-date-barnes-and-noble.jpg", alt: "Inside a Barnes & Noble, with café tables in front of shelves of new books", caption: "" },
            ],
          },
          "By our seventh date, we were at the United Center watching the Blackhawks beat the Vegas Golden Knights in a shootout. That was February 2023, just over a month after the bookstore, and it’s the earliest photo we have of the two of us together. (Katie is still salty about a waved-off buzzer-beater in the third period. We’ll leave it there.)",
          {
            photos: [
              { file: "02-first-date-blackhawks-game.jpg", alt: "Katie and Philip in Blackhawks jerseys, taking a selfie in the stands at the United Center", caption: "" },
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
              { file: "03-travel-haarlem-netherlands.jpg", alt: "Katie and Philip in sunglasses beside a canal in Haarlem, with tall brick canal houses behind them", caption: "Haarlem, Netherlands" },
              { file: "04-travel-love-lane-dublin.jpg", alt: "Katie and Philip in front of a colorful tiled wall of hearts and love quotes on Love Lane in Dublin", caption: "Love Lane, Dublin" },
              { file: "05-travel-audubon-aquarium-new-orleans.jpg", alt: "Katie and Philip in front of the huge blue Gulf of Mexico tank at the Audubon Aquarium", caption: "Audubon Aquarium, New Orleans" },
              { file: "05a-travel-las-vegas.jpg", alt: "Katie and Philip taking a selfie under the retro Las Vegas sign at Harry Reid International Airport", caption: "Las Vegas" },
            ],
          },
          "Closer to home, we love the Morton Arboretum. We’ve watched the leaves turn there in the fall, and we go back after dark for Illumination, which has become one of our favorite holiday traditions.",
          {
            photos: [
              { file: "06-local-morton-arboretum-illumination.jpg", alt: "Katie and Philip bundled up in winter coats between two trees strung with colorful lights at Illumination", caption: "Illumination at the Morton Arboretum" },
              { file: "07-local-morton-arboretum-fall.jpg", alt: "Katie and Philip relaxing in orange Adirondack chairs on the lawn at the Morton Arboretum, with autumn trees behind them", caption: "" },
            ],
          },
          "But most of our local adventures involve live music. In nearly four years together, we’ve been to more than 50 concerts, pop and classical, from Ravinia to the Riviera. Blues Traveler is practically our house band. Phil sang “Run Around” at karaoke on our second date, and we’ve seen them live at least twice since.",
          {
            photos: [
              { file: "08-concerts-blues-traveler-riviera.jpg", alt: "Katie and Philip under the Riviera Theatre marquee announcing Blues Traveler’s 30 Years of Four tour", caption: "The Riviera Theatre, Chicago" },
            ],
          },
          "Our camera roll is mostly selfies of the two of us out doing things, and we wouldn’t change that.",
          {
            photos: [
              { file: "09-renaissance-faire.jpg", alt: "Katie and Philip at the Renaissance faire, both wearing flowers in their hair", caption: "" },
            ],
          },
        ],
      },
      {
        when: "September 2026",
        title: "The Proposal",
        body: [
          "We both knew it was coming. Katie had picked out the ring, so there were no surprises there, and Phil kept the location to himself. He chose a forest preserve neither of us had ever been to, for one reason: it would look beautiful at sunset. Once we got there, it was pretty clear what was about to happen. We walked a little way, found a scenic spot, and Phil got down on one knee. Katie said yes. It was low-key and happy, just like us.",
          {
            photos: [
              { file: "10-proposal-ring-sunset.jpg", alt: "Katie and Philip cheek to cheek at sunset, with Katie’s hand and engagement ring resting on Philip’s chest", caption: "" },
            ],
          },
        ],
      },
    ],
    // The last stop on the timeline: the wedding day. Its date comes from
    // weddingDate at the top of this file. The photo sits under the text.
    finale: {
      title: "The Next Chapter",
      body: [
        "We’ll say “I do” at Trinity Lutheran Church, surrounded by the people we love most.",
        "We can’t wait to celebrate the next chapter of our story with you.",
      ],
      photo: {
        file: "11-closing-nose-to-nose.jpg",
        alt: "Katie and Philip nose to nose under green trees",
        caption: "",
      },
    },
  },

  /* --- Schedule --------------------------------------------------------
     One card per event, in the order listed.
     - id: stays the same once guests are invited (Phase 2 uses it).
     - date: "YYYY-MM-DD". start / end: 24-hour "HH:MM", Chicago time.
       Leave "" if not known yet; the page shows "To be announced".
     - time: optional wording shown instead of the start/end times.
       The start/end times are still used for the "Happening now" label.
     - end: optional. If blank, the event is treated as running until the
       next event starts, or the end of that day.
     - Leave description or dressCode as "" to hide them.
     - swatches: optional color bar under the attire text.
     - A real address automatically links to Google Maps. Leave address
       "" to hide it. */
  schedule: {
    title: "The Weekend",
    intro: "[A short line about the weekend's events.]",
    labels: {
      now: "Happening now",
      next: "Up next",
      where: "Where",
      attire: "Attire",
      swatches: "Suggested colors",
      mapsHint: "(opens Google Maps in a new tab)",
    },
    events: [
      {
        id: "wedding",
        name: "Ceremony & Reception",
        date: "2027-10-30",
        start: "16:00",
        end: "",
        time: "Ceremony begins at 4:00 PM, reception to follow",
        venue: "Trinity Lutheran Church",
        address: "3637 Golf Rd, Evanston, IL 60203",
        description: "Join us to celebrate our union.",
        dressCode:
          "Think cocktail or semi-formal with a cozy autumn twist. We’d love to see your favorite cozy fall colors. Examples: Rust, navy, mustard, plum, forest green, burgundy, or any other fall colors that speak to you. Please no ivory, cream, or white.",
        // Color bar under the attire text. "color" names a --swatch-… color in tokens.css.
        swatches: [
          { label: "Rust", color: "rust" },
          { label: "Navy", color: "navy" },
          { label: "Mustard", color: "mustard" },
          { label: "Plum", color: "plum" },
          { label: "Forest green", color: "forest" },
          { label: "Burgundy", color: "burgundy" },
        ],
      },
      {
        id: "sunday-service",
        name: "Sunday Service",
        date: "2027-10-31",
        start: "09:30",
        end: "",
        time: "Service begins at 9:30 AM, arrive by 9:20 AM to catch the prelude",
        venue: "Trinity Lutheran Church",
        address: "3637 Golf Rd, Evanston, IL 60203",
        description:
          "Phil will be leading special music at Trinity’s service on Sunday morning, including Katie on saxophone, and we’d love for you to hear it. All are welcome!",
        dressCode:
          "Come as you are! Trinity is relaxed. Nice jeans, a sweater, a casual dress, or slacks are all welcome. It is Reformation Sunday, so red is encouraged (but not required).",
      },
      {
        id: "brunch",
        name: "Farewell Brunch",
        date: "2027-10-31",
        start: "11:30",
        end: "",
        time: "",
        venue: "TBD",
        address: "",
        description:
          "Join us following Trinity’s Sunday morning service for a final send-off event. Additional details closer to the event.",
        dressCode:
          "Totally casual. Whether you’re coming from church or straight from your hotel, come as you are.",
      },
    ],
  },

  /* --- Travel ----------------------------------------------------------
     The page shows, in order: the notice (a highlighted callout), the
     notes card, hotels grouped by town, Getting There with the map, and
     Eat & Explore (hidden while exploreGroups is empty). */
  travel: {
    title: "Travel & Stay",
    intro: "",

    notice: {
      eyebrow: "Please note",
      title: "Football Season",
      text: "Northwestern home games can fill Evanston and Skokie hotels and raise rates. We won’t know whether there is a home game the weekend of October 30 until mid-year.",
      action: "We recommend you book early with free cancellation if possible.",
    },

    notesTitle: "For Out-of-Town Guests",
    notes: [
      {
        heading: "No Room Block",
        text: ["Please choose the hotel that works best for you! The four hotels below are a few of many good options in the area."],
      },
      {
        heading: "Skokie vs. Evanston",
        text: [
          "Trinity Lutheran Church borders Skokie and Evanston, so we’ve suggested hotels in both towns.",
          "Skokie hotels are easier to drive from and have free parking. If you’re driving in, these hotels are close to the highway and more convenient.",
          "Evanston hotels are better for CTA/Metra transit if you want to explore or go into Chicago. Evanston is pretty and walkable, but downtown Evanston driving and parking can be a hassle. Consider rideshare for these hotels.",
        ],
      },
      {
        heading: "Airport",
        text: ["O’Hare is roughly 25 to 40 minutes by car, depending on traffic. We recommend rideshare to and from the airport."],
      },
    ],

    accommodationsTitle: "Where to Stay",
    hotelLabels: {
      parking: "Parking",
      breakfast: "Breakfast",
      location: "Location",
      goodToKnow: "Good to know",
      website: "(opens the hotel’s website in a new tab)",
      maps: "(opens Google Maps in a new tab)",
    },
    hotelGroups: [
      {
        town: "Skokie",
        hotels: [
          {
            name: "DoubleTree by Hilton Hotel Chicago – North Shore Conference Center",
            address: "9599 Skokie Boulevard, Skokie, IL 60077",
            phone: "(847) 679-7000",
            url: "https://www.hilton.com/en/hotels/chiccdt-doubletree-chicago-north-shore-conference-center/",
            parking: "Free on-site parking, plenty of spaces available.",
            breakfast: "Not included. A full breakfast is available for a fee (6:30 to 10:00 AM). The on-site restaurant is Jameson’s Charhouse. There’s a Panera directly across the street as well.",
            location: "Across from Westfield Old Orchard (shops and restaurants). About 10 minutes straight down Golf Rd. to the church by car. Public transportation is less accessible. O’Hare is about 25 minutes by car.",
            goodToKnow: "Indoor and seasonal outdoor pools.",
          },
          {
            name: "Hampton Inn & Suites Chicago-North Shore/Skokie",
            address: "5201 Old Orchard Road, Skokie, IL 60077",
            phone: "(847) 583-1111",
            url: "https://www.hilton.com/en/hotels/chiskhx-hampton-suites-chicago-north-shore-skokie/",
            parking: "Free self-parking.",
            breakfast: "Free hot breakfast every morning.",
            location: "Off I-94, about two blocks from Westfield Old Orchard (shops and restaurants). About 10 minutes to the church by car. Public transportation is less accessible. O’Hare is about 25 minutes by car.",
            goodToKnow: "Indoor pool and fitness center.",
          },
        ],
      },
      {
        town: "Evanston",
        hotels: [
          {
            name: "Hyatt House Chicago/Evanston",
            address: "1515 Chicago Avenue, Evanston, IL",
            phone: "(847) 864-2300",
            url: "https://www.hyatt.com/hyatt-house/en-US/chixe-hyatt-house-chicago-evanston",
            parking: "On-site self-parking is $25 per night. Spaces may be limited.",
            breakfast: "Free full breakfast.",
            location: "Downtown Evanston, about 15 minutes to the church by car. The CTA Purple Line is about a 5-minute walk and Lake Michigan beaches about a 10-minute walk. You can take the CTA Purple Line to the Red Line to go into the city.",
            goodToKnow: "Walkable to downtown Evanston restaurants, Northwestern’s campus, and the lakefront, so you can explore without a car.",
          },
          {
            name: "Hilton Garden Inn Chicago North Shore/Evanston",
            address: "1818 Maple Avenue, Evanston, IL 60201",
            phone: "(847) 475-6400",
            url: "https://www.hilton.com/en/hotels/ordevgi-hilton-garden-inn-chicago-north-shore-evanston/",
            parking: "Covered self-parking is $24 per night with in/out privileges. Spaces may be limited.",
            breakfast: "Not included. There is a paid breakfast buffet, and downtown Evanston has coffee shops.",
            location: "Downtown Evanston, about 15 minutes to the church by car. The Davis Street station (CTA and Metra) is about a 4-minute walk, so it’s easy to get into Chicago for sightseeing.",
            goodToKnow: "Indoor pool, restaurant, and a lobby fireplace. Close to downtown Evanston shops and restaurants.",
          },
        ],
      },
    ],

    gettingThereTitle: "Getting to Trinity",
    gettingThere: [
      { heading: "Parking", text: "There’s plenty of parking both in front of and behind the church." },
    ],

    // Eat & Explore: add groups here later; the section is hidden while empty.
    exploreTitle: "Eat & Explore",
    exploreGroups: [],

    // Map: paste ONLY the src="..." address from a Google My Maps embed code
    // into mapEmbedUrl. Until then, the button below links to the map instead.
    mapEmbedUrl: "",
    mapLink: "https://maps.app.goo.gl/YyJCVYFLQHB35Qmk6",
    mapLinkLabel: "Open our map in Google Maps",
    mapTitle: "Our map of the area",
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
