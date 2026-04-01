/* ═══════════════════════════════════════════════════════════
   SITE-DATA.JS — The Francis Smokehouse
   ═══════════════════════════════════════════════════════════
   Edit this file to update menu items, prices, and specials.
   The menu page reads from this file automatically.
   ═══════════════════════════════════════════════════════════ */

/* ── TODAY'S SPECIAL ──────────────────────────────────────
   Change this every morning. Set hidden:true to hide it.
   The "date" field is optional — if set, the special only
   shows on that date (YYYY-MM-DD). Leave blank to always show.
   ──────────────────────────────────────────────────────── */
var SITE_SPECIAL = {
  name: "Backyard BBQ Plate",
  price: "$15.02",
  desc: "BBQ chicken, BBQ smoked sausage, brisket dirty rice, green beans & potato salad",
  type: "Lunch Special",
  date: "",       // e.g. "2025-07-04" — leave blank to show every day
  hidden: false
};

/* ── SPECIALS ROTATION (optional) ─────────────────────────
   If you want multiple specials on different days,
   add them here with a date. The first visible match wins.
   ──────────────────────────────────────────────────────── */
var SITE_SPECIALS = [
  // { name: "Crawfish Plate", price: "$14.99", desc: "1lb boiled crawfish, corn, potatoes", type: "Friday Special", date: "2025-07-11", hidden: false },
];

/* ── HOURS CONFIG ─────────────────────────────────────── */
var HOURS_CFG = {
  weekday: { open: 10, close: 18 },   // 10am–6pm
  sunday:  { open: 10, close: 15 }    // 10am–3pm
};

/* ═══════════════════════════════════════════════════════════
   FULL MENU
   ═══════════════════════════════════════════════════════════ */

var MENU = {

  /* ── BBQ PLATES (with two sides) ────────────────────── */
  bbq_plates: {
    title: "BBQ Plates",
    subtitle: "With Two Sides",
    icon: "🔥",
    items: [
      { name: "Full Rack of Ribs",  price: 33.32 },
      { name: "½ Rack of Ribs",     price: 18.74 },
      { name: "Pulled Pork",        price: 15.62 },
      { name: "Brisket",            price: 16.66 },
      { name: "½ Chicken Plate",    price: 15.62 },
      { name: "Smoked Wings",       price: 13.53 }
    ]
  },

  /* ── BURGERS & SANDWICHES (with one side) ───────────── */
  burgers_sandwiches: {
    title: "Burgers & Sandwiches",
    subtitle: "With One Side · Dressed with Lettuce & Tomato",
    icon: "🍔",
    items: [
      { name: "Hamburger",             price: 11.45 },
      { name: "Cheeseburger",          price: 12.49 },
      { name: "Bacon Cheeseburger",    price: 13.53 },
      { name: "Pulled Pork Sandwich",  price: 12.49 },
      { name: "Brisket Sandwich",      price: 13.53 },
      { name: "Ribeye Po-Boy",         price: 16.66 },
      { name: "Chicken Sandwich",      price: 12.49 },
      { name: "Shrimp Po-Boy",         price: 13.53 },
      { name: "Catfish Plate + 2 Sides", price: 13.53 },
      { name: "Catfish Po-Boy",        price: 13.53 }
    ],
    note: "We do not cut sandwiches in ½"
  },

  /* ── FRIED CHICKEN (with roll & 1 side) ─────────────── */
  fried_chicken: {
    title: "Fried Chicken",
    subtitle: "With Roll & 1 Side",
    icon: "🍗",
    note: "Sauces: BBQ, Ranch, Honey Mustard, Geaux Sauce",
    columns: ["Tender", "Mix", "Dark", "White"],
    items: [
      { name: "2 Pc.", prices: { tender: 8.32, mix: 7.28, dark: 7.28, white: 7.28 } },
      { name: "3 Pc.", prices: { tender: 10.41, mix: 8.32, dark: 8.32, white: 8.32 } },
      { name: "4 Pc.", prices: { tender: 12.49, mix: 9.36, dark: 9.36, white: 9.36 } }
    ]
  },

  /* ── CHICKEN LIVER PLATE ────────────────────────────── */
  chicken_liver: {
    title: "Chicken Liver Plate",
    subtitle: "1# Fried Liver with Side of Choice & Bread",
    icon: "🍖",
    items: [
      { name: "Chicken Liver Plate", price: 13.53 }
    ]
  },

  /* ── SALADS ─────────────────────────────────────────── */
  salads: {
    title: "Salads",
    subtitle: "Dressings: Ranch & Roasted Garlic Balsamic",
    icon: "🥗",
    items: [
      { name: "Grilled / Fried Chicken Salad", price: 11.45 },
      { name: "Grilled / Fried Shrimp Salad",  price: 12.49 },
      { name: "Pulled Pork Salad",              price: 11.45 },
      { name: "Chopped Brisket Salad",          price: 12.49 }
    ]
  },

  /* ── SIDES ──────────────────────────────────────────── */
  sides: {
    title: "Sides",
    subtitle: "Small & Large",
    icon: "🫘",
    columns: ["Sm", "Lg"],
    items: [
      { name: "Baked Beans",              prices: { sm: 3.39, lg: 10.94 } },
      { name: "Corn Pudding",             prices: { sm: 3.39, lg: 10.94 } },
      { name: "Potato Salad",             prices: { sm: 3.39, lg: 10.94 } },
      { name: "Cole Slaw",                prices: { sm: 3.39, lg: 10.94 } },
      { name: "French Fry",               prices: { sm: 3.39, lg: 10.94 } },
      { name: "Sweet Potato Waffle Fries", prices: { sm: 3.39, lg: 10.94 } },
      { name: "Mac & Cheese",             prices: { sm: 4.43, lg: 13.53 } }
    ]
  },

  /* ── COMBOS ─────────────────────────────────────────── */
  combos: {
    title: "Combos",
    subtitle: "Choose 2 Meats + 2 Sides, Garlic Toast, 1 BBQ Sauce",
    icon: "🍽️",
    note: "Meat choices: Ribs (3), ½ Chicken, Pulled Pork, Smoked Wings, Brisket",
    items: [
      { name: "2-Meat Combo Plate", price: 20.82 }
    ]
  },

  /* ── ADDITIONS ──────────────────────────────────────── */
  additions: {
    title: "Additions",
    subtitle: "Add to any sandwich or burger",
    icon: "➕",
    items: [
      { name: "Onion",              price: 0,    note: "Free" },
      { name: "Grilled Onions",     price: 1.04 },
      { name: "Jalapeños",          price: 1.04 },
      { name: "Bacon",              price: 1.04 },
      { name: "Fried Egg",          price: 1.04 },
      { name: "Mushrooms",          price: 1.04 },
      { name: "Green Peppers",      price: 1.04 },
      { name: "Pickles",            price: 0,    note: "Free" },
      { name: "American Cheese",    price: 1.04 },
      { name: "Pepper Jack Cheese", price: 1.04 },
      { name: "Provolone Cheese",   price: 1.04 },
      { name: "Extra Sauces",       price: 0.52 }
    ]
  },

  /* ── BY THE POUND ───────────────────────────────────── */
  by_the_pound: {
    title: "By the Pound",
    subtitle: "Bulk smoked meats",
    icon: "⚖️",
    items: [
      { name: "Brisket",       price: 19.78 },
      { name: "Pulled Pork",   price: 13.53 },
      { name: "Baby Back Ribs", price: 13.53 },
      { name: "½ Chicken",     price: 8.32 },
      { name: "Smoked Wings",  price: 11.45 },
      { name: "Pack of Buns",  price: 8.32 }
    ]
  },

  /* ── SAUCES ─────────────────────────────────────────── */
  sauces: {
    title: "Sauces",
    subtitle: "House-made",
    icon: "🫙",
    items: [
      { name: "Sauce — Quart",  price: 11.45 },
      { name: "Sauce — Pint",   price: 7.28 }
    ]
  },

  /* ── THE SCOOP (Desserts) ───────────────────────────── */
  desserts: {
    title: "The Scoop",
    subtitle: "Have Some Dessert Today!",
    icon: "🍮",
    items: [
      { name: "Bread Pudding",           price: null },
      { name: "Blueberry Cheesecake",    price: null },
      { name: "Creole Cream Cheesecake", price: null },
      { name: "Milky Way Pie",           price: null }
    ]
  }

};

/* ── RESTAURANT INFO ──────────────────────────────────── */
var SITE_INFO = {
  name: "The Francis Smokehouse",
  tagline: "& Specialty Meats",
  established: 2015,
  address: "6779 US Highway 61",
  city: "St. Francisville",
  state: "LA",
  zip: "70775",
  phone: "(225) 245-5046",
  hours: {
    weekday: "Mon–Sat 10am – 6pm",
    sunday: "Sun 10am – 3pm"
  },
  social: {
    facebook: "https://www.facebook.com/1547733028788117/",
    tripadvisor: "https://www.tripadvisor.ca/Restaurant_Review-g40411-d7851018-Reviews-The_Francis_Smokehouse-Saint_Francisville_Louisiana.html",
    google_maps: "https://www.google.com/maps/search/?api=1&query=The+Francis+Smokehouse%2C+St+Francisville%2C+LA"
  },
  cash_discount: "We offer a 4% cash discount"
};
