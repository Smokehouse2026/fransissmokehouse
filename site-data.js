/* ═══════════════════════════════════════════════════════════════
   MENU-DATA.JS — The Francis Smokehouse & Specialty Meats
   ═══════════════════════════════════════════════════════════════

   This is the ONLY file you need to edit to update the menu.
   The menu page reads everything from here automatically.

   IMAGE PATHS
   ───────────
   All images live in your Images/menu/ folder on the server.
   Recommended size: 800×540px, JPG, compressed for web (~120–200 KB).
   If an image is missing or the path is wrong the card shows an
   emoji placeholder — nothing breaks.

   PRICES
   ──────
   Use a number (e.g.  16.66) — NOT a string with a dollar sign.
   Use  null  when price is market / ask-server.

   ADDING A NEW CATEGORY
   ─────────────────────
   Copy one of the objects below, give it a unique key, and add
   your items. A new tab appears automatically.

   HIDING AN ITEM
   ──────────────
   Set  hidden: true  on any item and it won't appear on the page.

═══════════════════════════════════════════════════════════════ */


/* ── RESTAURANT INFO ─────────────────────────────────────── */
var SITE_INFO = {
  name:        "The Francis Smokehouse",
  tagline:     "& Specialty Meats",
  address:     "6779 US Highway 61",
  city:        "St. Francisville",
  state:       "LA",
  zip:         "70775",
  phone:       "(225) 245-5046",
  email:       "francissmokehouse@att.net",
  facebook:    "https://www.facebook.com/1547733028788117/",
  cash_note:   "We offer a 4% cash discount",
  ratings: {
    google:      { stars: "4.7", label: "Google" },
    tripadvisor: { stars: "4.5", label: "TripAdvisor" }
  }
};


/* ── HOURS ───────────────────────────────────────────────── */
var HOURS_CFG = {
  weekday: { open: 10, close: 18, label: "Mon–Sat 10am – 6pm"  },
  sunday:  { open: 10, close: 15, label: "Sun 10am – 3pm"       }
};


/* ── TODAY'S SPECIAL ─────────────────────────────────────── */
/*
   Set  date: ""  to show every day.
   Set  date: "2025-08-14"  to show only on that date.
   Set  hidden: true  to hide the special entirely.
*/
var SITE_SPECIAL = {
  name:   "Backyard BBQ Plate",
  price:  15.02,
  desc:   "BBQ chicken, BBQ smoked sausage, brisket dirty rice, green beans & potato salad",
  type:   "Lunch Special",
  sides:  "",
  note:   "",
  image:  "Images/menu/special-backyard-bbq.jpg",
  date:   "",       /* "" = show every day  |  "YYYY-MM-DD" = show only that day */
  hidden: false
};


/* ── FULL MENU ───────────────────────────────────────────── */
/*
   Each top-level key becomes a tab.
   Order here = order of tabs on the page.

   Per-category fields
   ───────────────────
   title      Tab label and section heading
   subtitle   Shown under the heading (e.g. "With Two Sides")
   icon       Emoji shown on the tab
   hero       Path to a wide banner image for this category (optional)

   Per-item fields
   ───────────────
   name       Item name (required)
   price      Number or null
   priceLg    Second price shown smaller (e.g. large size)
   img        Path to item photo  (leave "" if none yet)
   desc       One-line description shown under the name
   note       Fine print (e.g. "+ 2 Sides", "Bone-in")
   badge      Short tag text  (e.g. "Most Ordered")
   badgeStyle "pop" | "sig" | "new"  (orange/amber/green)
   hidden     true to remove from page without deleting
*/
var MENU = {

  /* ── BBQ PLATES ─────────────────────────────────────── */
  bbq_plates: {
    title:    "BBQ Plates",
    subtitle: "With Two Sides",
    icon:     "🔥",
    hero:     "Images/menu/bbq-plates-hero.jpg",
    items: [
      {
        name:       "Brisket",
        price:      16.66,
        img:        "Images/menu/brisket-plate.jpg",
        desc:       "Slow-smoked beef brisket, sliced to order. Bark-crusted, smoke-ringed, impossibly tender.",
        badge:      "Most Ordered",
        badgeStyle: "pop"
      },
      {
        name:  "Full Rack of Ribs",
        price: 33.32,
        img:   "Images/menu/full-rack-ribs.jpg",
        desc:  "Pork spare ribs, rubbed and smoked until fall-off-the-bone tender.",
        badge: "Fan Favorite",
        badgeStyle: "pop"
      },
      {
        name:  "½ Rack of Ribs",
        price: 18.74,
        img:   "Images/menu/half-rack-ribs.jpg",
        desc:  "Half rack of our signature smoked pork spare ribs."
      },
      {
        name:  "Pulled Pork",
        price: 15.62,
        img:   "Images/menu/pulled-pork-plate.jpg",
        desc:  "Pork shoulder smoked until it pulls apart like silk. House sauce on the side."
      },
      {
        name:  "½ Chicken Plate",
        price: 15.62,
        img:   "Images/menu/half-chicken-plate.jpg",
        desc:  "Half chicken, brined and smoked whole, juicy straight through to the bone."
      },
      {
        name:       "Smoked Wings",
        price:      13.53,
        img:        "Images/menu/smoked-wings.jpg",
        desc:       "Whole wings smoked low, finished hot. Crispy skin. Smoke all the way through.",
        badge:      "Try It",
        badgeStyle: "new"
      }
    ]
  },

  /* ── BURGERS & SANDWICHES ───────────────────────────── */
  burgers_sandwiches: {
    title:    "Burgers & Sandwiches",
    subtitle: "With One Side",
    icon:     "🍔",
    hero:     "Images/menu/burgers-hero.jpg",
    items: [
      {
        name:       "Ribeye Po-Boy",
        price:      16.66,
        img:        "Images/menu/ribeye-poboy.jpg",
        desc:       "Shaved ribeye on French bread, dressed. A house signature.",
        badge:      "Signature",
        badgeStyle: "sig"
      },
      {
        name:  "Brisket Sandwich",
        price: 13.53,
        img:   "Images/menu/brisket-sandwich.jpg",
        desc:  "Sliced smoked brisket piled high. Simple. Perfect.",
        badge: "Best Seller",
        badgeStyle: "pop"
      },
      {
        name:  "Pulled Pork Sandwich",
        price: 12.49,
        img:   "Images/menu/pulled-pork-sandwich.jpg",
        desc:  "House-smoked pulled pork on a toasted bun."
      },
      {
        name:  "Chicken Sandwich",
        price: 12.49,
        img:   "Images/menu/chicken-sandwich.jpg",
        desc:  "Smoked chicken breast on a brioche bun with house slaw."
      },
      {
        name:  "Hamburger",
        price: 11.45,
        img:   "Images/menu/hamburger.jpg",
        desc:  "Hand-formed beef patty. Toasted bun. Dressed."
      },
      {
        name:  "Cheeseburger",
        price: 12.49,
        img:   "Images/menu/cheeseburger.jpg",
        desc:  "American cheese. The classic."
      },
      {
        name:       "Bacon Cheeseburger",
        price:      13.53,
        img:        "Images/menu/bacon-cheeseburger.jpg",
        desc:       "Smoked bacon, American cheese, dressed.",
        badge:      "Top Pick",
        badgeStyle: "pop"
      },
      {
        name:  "Shrimp Po-Boy",
        price: 13.53,
        img:   "Images/menu/shrimp-poboy.jpg",
        desc:  "Gulf shrimp, fried golden, dressed on French bread."
      },
      {
        name:  "Catfish Po-Boy",
        price: 13.53,
        img:   "Images/menu/catfish-poboy.jpg",
        desc:  "Cornmeal-crusted catfish, fried to order, dressed."
      },
      {
        name:  "Catfish Plate",
        price: 13.53,
        img:   "Images/menu/catfish-plate.jpg",
        desc:  "Fried catfish served as a plate.",
        note:  "+ 2 Sides"
      }
    ]
  },

  /* ── FRIED CHICKEN ──────────────────────────────────── */
  fried_chicken: {
    title:    "Fried Chicken",
    subtitle: "With Roll & 1 Side",
    icon:     "🍗",
    hero:     "Images/menu/fried-chicken-hero.jpg",
    items: [
      {
        name:  "2 Pc. Tender",
        price: 8.32,
        img:   "Images/menu/chicken-tenders-2pc.jpg",
        desc:  "Two crispy fried chicken tenders."
      },
      {
        name:  "3 Pc. Tender",
        price: 10.41,
        img:   "Images/menu/chicken-tenders-3pc.jpg",
        desc:  "Three crispy fried chicken tenders."
      },
      {
        name:  "4 Pc. Tender",
        price: 12.49,
        img:   "Images/menu/chicken-tenders-4pc.jpg",
        desc:  "Four crispy fried chicken tenders."
      },
      {
        name:  "2 Pc. Mix",
        price: 7.28,
        img:   "Images/menu/chicken-mix-2pc.jpg",
        desc:  "Two pieces of mixed fried chicken."
      },
      {
        name:  "3 Pc. Mix",
        price: 8.32,
        img:   "Images/menu/chicken-mix-3pc.jpg",
        desc:  "Three pieces of mixed fried chicken."
      },
      {
        name:  "4 Pc. Mix",
        price: 9.36,
        img:   "Images/menu/chicken-mix-4pc.jpg",
        desc:  "Four pieces of mixed fried chicken."
      }
    ]
  },

  /* ── SALADS ─────────────────────────────────────────── */
  salads: {
    title:    "Salads",
    subtitle: "Ranch & Roasted Garlic Balsamic",
    icon:     "🥗",
    hero:     "Images/menu/salads-hero.jpg",
    items: [
      {
        name:  "Grilled Chicken Salad",
        price: 11.45,
        img:   "Images/menu/grilled-chicken-salad.jpg"
      },
      {
        name:  "Fried Chicken Salad",
        price: 11.45,
        img:   "Images/menu/fried-chicken-salad.jpg"
      },
      {
        name:  "Grilled Shrimp Salad",
        price: 12.49,
        img:   "Images/menu/grilled-shrimp-salad.jpg"
      },
      {
        name:  "Fried Shrimp Salad",
        price: 12.49,
        img:   "Images/menu/fried-shrimp-salad.jpg"
      },
      {
        name:  "Pulled Pork Salad",
        price: 11.45,
        img:   "Images/menu/pulled-pork-salad.jpg"
      },
      {
        name:  "Chopped Brisket Salad",
        price: 12.49,
        img:   "Images/menu/brisket-salad.jpg"
      }
    ]
  },

  /* ── SIDES & EXTRAS ─────────────────────────────────── */
  sides: {
    title:    "Sides & Extras",
    subtitle: "Small & Large",
    icon:     "🫘",
    hero:     "Images/menu/sides-hero.jpg",
    items: [
      {
        name:       "Corn Pudding",
        price:      3.39,
        priceLg:    10.94,
        img:        "Images/menu/corn-pudding.jpg",
        desc:       "Creamy, sweet Southern corn pudding. Our most-loved side.",
        badge:      "Most Loved",
        badgeStyle: "pop"
      },
      {
        name:    "Baked Beans",
        price:   3.39,
        priceLg: 10.94,
        img:     "Images/menu/baked-beans.jpg",
        desc:    "Slow-cooked with smoked meat drippings and brown sugar."
      },
      {
        name:    "Potato Salad",
        price:   3.39,
        priceLg: 10.94,
        img:     "Images/menu/potato-salad.jpg",
        desc:    "Classic Southern-style creamy potato salad."
      },
      {
        name:    "Cole Slaw",
        price:   3.39,
        priceLg: 10.94,
        img:     "Images/menu/cole-slaw.jpg",
        desc:    "House-made with a tangy, slightly sweet dressing."
      },
      {
        name:    "French Fry",
        price:   3.39,
        priceLg: 10.94,
        img:     "Images/menu/french-fry.jpg",
        desc:    "Golden, crispy, seasoned fries."
      },
      {
        name:       "Sweet Potato Waffle Fries",
        price:      3.39,
        priceLg:    10.94,
        img:        "Images/menu/waffle-fries.jpg",
        desc:       "Sweet potato waffle-cut fries, lightly seasoned.",
        badge:      "House Pick",
        badgeStyle: "sig"
      },
      {
        name:    "Mac & Cheese",
        price:   4.43,
        priceLg: 13.53,
        img:     "Images/menu/mac-cheese.jpg",
        desc:    "Creamy Southern mac & cheese."
      }
    ]
  },

  /* ── COMBOS ─────────────────────────────────────────── */
  combos: {
    title:    "Combos",
    subtitle: "2 Meats · 2 Sides · Garlic Toast · BBQ Sauce",
    icon:     "🍽️",
    hero:     "Images/menu/combos-hero.jpg",
    items: [
      {
        name:  "2-Meat Combo Plate",
        price: 20.82,
        img:   "Images/menu/combo-plate.jpg",
        desc:  "Choose any two: Ribs (3 bones), ½ Chicken, Pulled Pork, Smoked Wings, or Brisket."
      }
    ]
  },

  /* ── BY THE POUND ───────────────────────────────────── */
  by_the_pound: {
    title:    "By the Pound",
    subtitle: "Bulk Smoked Meats",
    icon:     "⚖️",
    hero:     "Images/menu/by-the-pound-hero.jpg",
    items: [
      {
        name:  "Brisket",
        price: 19.78,
        img:   "Images/menu/brisket-bulk.jpg"
      },
      {
        name:  "Pulled Pork",
        price: 13.53,
        img:   "Images/menu/pulled-pork-bulk.jpg"
      },
      {
        name:  "Baby Back Ribs",
        price: 13.53,
        img:   "Images/menu/baby-back-ribs-bulk.jpg"
      },
      {
        name:  "½ Chicken",
        price: 8.32,
        img:   "Images/menu/half-chicken-bulk.jpg"
      },
      {
        name:  "Smoked Wings",
        price: 11.45,
        img:   "Images/menu/smoked-wings-bulk.jpg"
      }
    ]
  },

  /* ── DESSERTS ───────────────────────────────────────── */
  desserts: {
    title:    "The Scoop",
    subtitle: "Desserts — made in-house daily",
    icon:     "🍮",
    hero:     "Images/menu/desserts-hero.jpg",
    items: [
      {
        name:  "Bread Pudding",
        price: null,
        img:   "Images/menu/bread-pudding.jpg",
        desc:  "House-made Louisiana bread pudding."
      },
      {
        name:  "Blueberry Cheesecake",
        price: null,
        img:   "Images/menu/blueberry-cheesecake.jpg"
      },
      {
        name:  "Creole Cream Cheesecake",
        price: null,
        img:   "Images/menu/creole-cheesecake.jpg"
      },
      {
        name:  "Milky Way Pie",
        price: null,
        img:   "Images/menu/milky-way-pie.jpg"
      }
    ]
  }

};  /* end MENU */
