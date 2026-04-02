/* ═══════════════════════════════════════════════════════════════
   SITE-DATA.JS — The Francis Smokehouse & Specialty Meats
   ═══════════════════════════════════════════════════════════════

   This is the ONLY file you need to edit to update the menu.
   The menu page reads everything from here automatically.

   IMAGE PATHS
   ───────────
   Images use full URLs so they never fail regardless of where
   the page is opened. Upload photos to your Images/ folder and
   the URL will be:  https://www.thefrancismokehouse.com/Images/YourFile.jpg
   Recommended size: 800×540px, JPG, under 200KB.
   Leave img as "" if you haven't uploaded a photo yet —
   the card shows an emoji placeholder instead.

   PRICES
   ──────
   Use a plain number  e.g.  16.66
   Use  null  when the price is market rate / ask your server.

   ADDING A NEW CATEGORY
   ─────────────────────
   Copy any category block below, give it a new unique key,
   fill in your items. A new tab appears on the page automatically.

   HIDING AN ITEM WITHOUT DELETING IT
   ────────────────────────────────────
   Add  hidden: true  to any item and it won't show on the page.

═══════════════════════════════════════════════════════════════ */


/* ── RESTAURANT INFO ─────────────────────────────────────── */
var SITE_INFO = {
  name:      "The Francis Smokehouse",
  tagline:   "& Specialty Meats",
  address:   "6779 US Highway 61",
  city:      "St. Francisville",
  state:     "LA",
  zip:       "70775",
  phone:     "(225) 245-5046",
  email:     "francissmokehouse@att.net",
  facebook:  "https://www.facebook.com/1547733028788117/",
  cash_note: "We offer a 4% cash discount",
  ratings: {
    google:      { stars: "4.7", label: "Google" },
    tripadvisor: { stars: "4.5", label: "TripAdvisor" }
  }
};


/* ── HOURS ───────────────────────────────────────────────── */
var HOURS_CFG = {
  weekday: { open: 10, close: 18, label: "Mon–Sat 10am – 6pm" },
  sunday:  { open: 10, close: 15, label: "Sun 10am – 3pm"     }
};


/* ── TODAY'S SPECIAL ─────────────────────────────────────── */
/*
   date: ""            → show every day
   date: "2025-08-14"  → show only on that date
   hidden: true        → hide entirely
*/
var SITE_SPECIAL = {
  name:   "Backyard BBQ Plate",
  price:  15.02,
  desc:   "BBQ chicken, BBQ smoked sausage, brisket dirty rice, green beans & potato salad",
  type:   "Lunch Special",
  sides:  "",
  note:   "",
  image:  "https://www.thefrancismokehouse.com/Images/BackyardBBQPlate.jpg",
  date:   "",
  hidden: false
};


/* ── FULL MENU ───────────────────────────────────────────── */
/*
   CATEGORY FIELDS
   ───────────────
   title      Text shown on the tab and as the section heading
   subtitle   Smaller text under the heading  (e.g. "With Two Sides")
   icon       Emoji on the tab button

   ITEM FIELDS
   ───────────
   name       Item name  (required)
   price      Number, or null for "Ask"
   priceLg    Optional second price  (e.g. large size)
   img        Full URL to photo — https://www.thefrancismokehouse.com/Images/FileName.jpg
              Leave ""  if no photo yet
   desc       Short description shown under the name
   note       Fine-print line  (e.g. "+ 2 Sides")
   badge      Short badge label  (e.g. "Most Ordered")
   badgeStyle "pop" = orange · "sig" = amber · "new" = green
   hidden     true to hide without deleting
*/
var MENU = {

  /* ── BBQ PLATES ─────────────────────────────────────── */
  bbq_plates: {
    title:    "BBQ Plates",
    subtitle: "With Two Sides",
    icon:     "🔥",
    items: [
      {
        name:       "Brisket",
        price:      16.66,
        img:        "https://www.thefrancismokehouse.com/Images/Brisket.jpg",
        desc:       "Slow-smoked beef brisket, sliced to order. Bark-crusted, smoke-ringed, impossibly tender.",
        badge:      "Most Ordered",
        badgeStyle: "pop"
      },
      {
        name:       "Full Rack of Ribs",
        price:      33.32,
        img:        "https://www.thefrancismokehouse.com/Images/FullRackRibs.jpg",
        desc:       "Pork spare ribs, rubbed and smoked until fall-off-the-bone tender.",
        badge:      "Fan Favorite",
        badgeStyle: "pop"
      },
      {
        name:  "½ Rack of Ribs",
        price: 18.74,
        img:   "https://www.thefrancismokehouse.com/Images/HalfRackRibs.jpg",
        desc:  "Half rack of our signature smoked pork spare ribs."
      },
      {
        name:  "Pulled Pork",
        price: 15.62,
        img:   "https://www.thefrancismokehouse.com/Images/PulledPork.jpg",
        desc:  "Pork shoulder smoked until it pulls apart like silk. House sauce on the side."
      },
      {
        name:  "½ Chicken Plate",
        price: 15.62,
        img:   "https://www.thefrancismokehouse.com/Images/HalfChicken.jpg",
        desc:  "Half chicken, brined and smoked whole, juicy straight through to the bone."
      },
      {
        name:       "Smoked Wings",
        price:      13.53,
        img:        "https://www.thefrancismokehouse.com/Images/SmokedWings.jpg",
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
    items: [
      {
        name:       "Ribeye Po-Boy",
        price:      16.66,
        img:        "https://www.thefrancismokehouse.com/Images/RibeyePoBoy.jpg",
        desc:       "Shaved ribeye on French bread, dressed. A house signature.",
        badge:      "Signature",
        badgeStyle: "sig"
      },
      {
        name:       "Brisket Sandwich",
        price:      13.53,
        img:        "https://www.thefrancismokehouse.com/Images/BrisketSandwich.jpg",
        desc:       "Sliced smoked brisket piled high. Simple. Perfect.",
        badge:      "Best Seller",
        badgeStyle: "pop"
      },
      {
        name:  "Pulled Pork Sandwich",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/PorkSandwich.jpg",
        desc:  "House-smoked pulled pork on a toasted bun."
      },
      {
        name:  "Chicken Sandwich",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenSandwich.jpg",
        desc:  "Smoked chicken breast on a brioche bun with house slaw."
      },
      {
        name:  "Hamburger",
        price: 11.45,
        img:   "https://www.thefrancismokehouse.com/Images/Hamburger.jpg",
        desc:  "Hand-formed beef patty. Toasted bun. Dressed."
      },
      {
        name:  "Cheeseburger",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/Cheeseburger.jpg",
        desc:  "American cheese. The classic."
      },
      {
        name:       "Bacon Cheeseburger",
        price:      13.53,
        img:        "https://www.thefrancismokehouse.com/Images/BaconCheeseBurger.jpg",
        desc:       "Smoked bacon, American cheese, dressed.",
        badge:      "Top Pick",
        badgeStyle: "pop"
      },
      {
        name:  "Shrimp Po-Boy",
        price: 13.53,
        img:   "https://www.thefrancismokehouse.com/Images/ShrimpPoBoy.jpg",
        desc:  "Gulf shrimp, fried golden, dressed on French bread."
      },
      {
        name:  "Catfish Po-Boy",
        price: 13.53,
        img:   "https://www.thefrancismokehouse.com/Images/CatfishPoBoy.jpg",
        desc:  "Cornmeal-crusted catfish, fried to order, dressed."
      },
      {
        name:  "Catfish Plate",
        price: 13.53,
        img:   "https://www.thefrancismokehouse.com/Images/CatfishPlate.jpg",
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
    items: [
      {
        name:  "2 Pc. Tender",
        price: 8.32,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenTenders2pc.jpg",
        desc:  "Two crispy fried chicken tenders."
      },
      {
        name:  "3 Pc. Tender",
        price: 10.41,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenTenders3pc.jpg",
        desc:  "Three crispy fried chicken tenders."
      },
      {
        name:  "4 Pc. Tender",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenTenders4pc.jpg",
        desc:  "Four crispy fried chicken tenders."
      },
      {
        name:  "2 Pc. Mix",
        price: 7.28,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenMix2pc.jpg",
        desc:  "Two pieces of mixed fried chicken."
      },
      {
        name:  "3 Pc. Mix",
        price: 8.32,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenMix3pc.jpg",
        desc:  "Three pieces of mixed fried chicken."
      },
      {
        name:  "4 Pc. Mix",
        price: 9.36,
        img:   "https://www.thefrancismokehouse.com/Images/ChickenMix4pc.jpg",
        desc:  "Four pieces of mixed fried chicken."
      }
    ]
  },

  /* ── SALADS ─────────────────────────────────────────── */
  salads: {
    title:    "Salads",
    subtitle: "Ranch & Roasted Garlic Balsamic",
    icon:     "🥗",
    items: [
      {
        name:  "Grilled Chicken Salad",
        price: 11.45,
        img:   "https://www.thefrancismokehouse.com/Images/GrilledChickenSalad.jpg"
      },
      {
        name:  "Fried Chicken Salad",
        price: 11.45,
        img:   "https://www.thefrancismokehouse.com/Images/FriedChickenSalad.jpg"
      },
      {
        name:  "Grilled Shrimp Salad",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/GrilledShrimpSalad.jpg"
      },
      {
        name:  "Fried Shrimp Salad",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/FriedShrimpSalad.jpg"
      },
      {
        name:  "Pulled Pork Salad",
        price: 11.45,
        img:   "https://www.thefrancismokehouse.com/Images/PulledPorkSalad.jpg"
      },
      {
        name:  "Chopped Brisket Salad",
        price: 12.49,
        img:   "https://www.thefrancismokehouse.com/Images/BrisketSalad.jpg"
      }
    ]
  },

  /* ── SIDES & EXTRAS ─────────────────────────────────── */
  sides: {
    title:    "Sides & Extras",
    subtitle: "Small & Large",
    icon:     "🫘",
    items: [
      {
        name:       "Corn Pudding",
        price:      3.39,
        priceLg:    10.94,
        img:        "https://www.thefrancismokehouse.com/Images/CornPudding.jpg",
        desc:       "Creamy, sweet Southern corn pudding. Our most-loved side.",
        badge:      "Most Loved",
        badgeStyle: "pop"
      },
      {
        name:    "Baked Beans",
        price:   3.39,
        priceLg: 10.94,
        img:     "https://www.thefrancismokehouse.com/Images/BakedBeans.jpg",
        desc:    "Slow-cooked with smoked meat drippings and brown sugar."
      },
      {
        name:    "Potato Salad",
        price:   3.39,
        priceLg: 10.94,
        img:     "https://www.thefrancismokehouse.com/Images/PotatoSalad.jpg",
        desc:    "Classic Southern-style creamy potato salad."
      },
      {
        name:    "Cole Slaw",
        price:   3.39,
        priceLg: 10.94,
        img:     "https://www.thefrancismokehouse.com/Images/ColeSlaw.jpg",
        desc:    "House-made with a tangy, slightly sweet dressing."
      },
      {
        name:    "French Fry",
        price:   3.39,
        priceLg: 10.94,
        img:     "https://www.thefrancismokehouse.com/Images/FrenchFry.jpg",
        desc:    "Golden, crispy, seasoned fries."
      },
      {
        name:       "Sweet Potato Waffle Fries",
        price:      3.39,
        priceLg:    10.94,
        img:        "https://www.thefrancismokehouse.com/Images/WaffleFries.jpg",
        desc:       "Sweet potato waffle-cut fries, lightly seasoned.",
        badge:      "House Pick",
        badgeStyle: "sig"
      },
      {
        name:    "Mac & Cheese",
        price:   4.43,
        priceLg: 13.53,
        img:     "https://www.thefrancismokehouse.com/Images/MacCheese.jpg",
        desc:    "Creamy Southern mac & cheese."
      }
    ]
  },

  /* ── COMBOS ─────────────────────────────────────────── */
  combos: {
    title:    "Combos",
    subtitle: "2 Meats · 2 Sides · Garlic Toast · BBQ Sauce",
    icon:     "🍽️",
    items: [
      {
        name:  "2-Meat Combo Plate",
        price: 20.82,
        img:   "https://www.thefrancismokehouse.com/Images/ComboPlate.jpg",
        desc:  "Choose any two: Ribs (3 bones), ½ Chicken, Pulled Pork, Smoked Wings, or Brisket."
      }
    ]
  },

  /* ── BY THE POUND ───────────────────────────────────── */
  by_the_pound: {
    title:    "By the Pound",
    subtitle: "Bulk Smoked Meats",
    icon:     "⚖️",
    items: [
      {
        name:  "Brisket",
        price: 19.78,
        img:   "https://www.thefrancismokehouse.com/Images/BrisketBulk.jpg"
      },
      {
        name:  "Pulled Pork",
        price: 13.53,
        img:   "https://www.thefrancismokehouse.com/Images/PulledPorkBulk.jpg"
      },
      {
        name:  "Baby Back Ribs",
        price: 13.53,
        img:   "https://www.thefrancismokehouse.com/Images/BabyBackRibs.jpg"
      },
      {
        name:  "½ Chicken",
        price: 8.32,
        img:   "https://www.thefrancismokehouse.com/Images/HalfChickenBulk.jpg"
      },
      {
        name:  "Smoked Wings",
        price: 11.45,
        img:   "https://www.thefrancismokehouse.com/Images/SmokedWingsBulk.jpg"
      }
    ]
  },

  /* ── DESSERTS ───────────────────────────────────────── */
  desserts: {
    title:    "The Scoop",
    subtitle: "Desserts — made in-house daily",
    icon:     "🍮",
    items: [
      {
        name:  "Bread Pudding",
        price: null,
        img:   "https://www.thefrancismokehouse.com/Images/BreadPudding.jpg",
        desc:  "House-made Louisiana bread pudding."
      },
      {
        name:  "Blueberry Cheesecake",
        price: null,
        img:   "https://www.thefrancismokehouse.com/Images/BlueberryCheesecake.jpg"
      },
      {
        name:  "Creole Cream Cheesecake",
        price: null,
        img:   "https://www.thefrancismokehouse.com/Images/CreoleCheesecake.jpg"
      },
      {
        name:  "Milky Way Pie",
        price: null,
        img:   "https://www.thefrancismokehouse.com/Images/MilkyWayPie.jpg"
      }
    ]
  }

}; /* end MENU */
