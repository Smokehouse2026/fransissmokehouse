/* ═══════════════════════════════════════════════════════════
   SITE-DATA.JS — The Francis Smokehouse
   ═══════════════════════════════════════════════════════════
   Edit this file to update menu items, prices, images & specials.
   
   IMAGE PATHS: All images go in your Images/menu/ folder.
   Name them exactly as shown, or change the path here.
   Recommended size: 600x400px, JPG, compressed for web.
   ═══════════════════════════════════════════════════════════ */

var SITE_SPECIAL = {
  name: "Backyard BBQ Plate",
  price: "$15.02",
  desc: "BBQ chicken, BBQ smoked sausage, brisket dirty rice, green beans & potato salad",
  type: "Lunch Special",
  image: "Images/menu/special-backyard-bbq.jpg",
  date: "",
  hidden: false
};

var SITE_SPECIALS = [];

var HOURS_CFG = {
  weekday: { open: 10, close: 18 },
  sunday:  { open: 10, close: 15 }
};

/* ═══════════════════════════════════════════════════════════
   MENU — each category has a hero image + items with photos
   ═══════════════════════════════════════════════════════════ */
var MENU = {

  bbq_plates: {
    title: "BBQ Plates",
    subtitle: "With Two Sides",
    icon: "🔥",
    hero: "Images/menu/bbq-plates-hero.jpg",
    color: "#6ddb7a",
    items: [
      { name: "Full Rack of Ribs",  price: 33.32, img: "Images/menu/full-rack-ribs.jpg" },
      { name: "½ Rack of Ribs",     price: 18.74, img: "Images/menu/half-rack-ribs.jpg" },
      { name: "Pulled Pork",        price: 15.62, img: "Images/menu/pulled-pork-plate.jpg" },
      { name: "Brisket",            price: 16.66, img: "Images/menu/brisket-plate.jpg" },
      { name: "½ Chicken Plate",    price: 15.62, img: "Images/menu/half-chicken-plate.jpg" },
      { name: "Smoked Wings",       price: 13.53, img: "Images/menu/smoked-wings.jpg" }
    ]
  },

  burgers_sandwiches: {
    title: "Burgers & Sandwiches",
    subtitle: "With One Side",
    icon: "🍔",
    hero: "Images/menu/burgers-hero.jpg",
    color: "#e87cb0",
    items: [
      { name: "Hamburger",             price: 11.45, img: "Images/menu/hamburger.jpg" },
      { name: "Cheeseburger",          price: 12.49, img: "Images/menu/cheeseburger.jpg" },
      { name: "Bacon Cheeseburger",    price: 13.53, img: "Images/menu/bacon-cheeseburger.jpg" },
      { name: "Pulled Pork Sandwich",  price: 12.49, img: "Images/menu/pulled-pork-sandwich.jpg" },
      { name: "Brisket Sandwich",      price: 13.53, img: "Images/menu/brisket-sandwich.jpg" },
      { name: "Ribeye Po-Boy",         price: 16.66, img: "Images/menu/ribeye-poboy.jpg" },
      { name: "Chicken Sandwich",      price: 12.49, img: "Images/menu/chicken-sandwich.jpg" },
      { name: "Shrimp Po-Boy",         price: 13.53, img: "Images/menu/shrimp-poboy.jpg" },
      { name: "Catfish Plate",         price: 13.53, img: "Images/menu/catfish-plate.jpg", note: "+ 2 Sides" },
      { name: "Catfish Po-Boy",        price: 13.53, img: "Images/menu/catfish-poboy.jpg" }
    ]
  },

  fried_chicken: {
    title: "Fried Chicken",
    subtitle: "With Roll & 1 Side",
    icon: "🍗",
    hero: "Images/menu/fried-chicken-hero.jpg",
    color: "#5ec4d4",
    items: [
      { name: "2 Pc. Tender",  price: 8.32,  img: "Images/menu/chicken-tenders.jpg" },
      { name: "3 Pc. Tender",  price: 10.41, img: "Images/menu/chicken-tenders-3pc.jpg" },
      { name: "4 Pc. Tender",  price: 12.49, img: "Images/menu/chicken-tenders-4pc.jpg" },
      { name: "2 Pc. Mix",     price: 7.28,  img: "Images/menu/chicken-mix-2pc.jpg" },
      { name: "3 Pc. Mix",     price: 8.32,  img: "Images/menu/chicken-mix-3pc.jpg" },
      { name: "4 Pc. Mix",     price: 9.36,  img: "Images/menu/chicken-mix-4pc.jpg" }
    ]
  },

  salads: {
    title: "Salads",
    subtitle: "Ranch & Roasted Garlic Balsamic",
    icon: "🥗",
    hero: "Images/menu/salads-hero.jpg",
    color: "#e87cb0",
    items: [
      { name: "Grilled Chicken Salad",  price: 11.45, img: "Images/menu/grilled-chicken-salad.jpg" },
      { name: "Fried Chicken Salad",    price: 11.45, img: "Images/menu/fried-chicken-salad.jpg" },
      { name: "Grilled Shrimp Salad",   price: 12.49, img: "Images/menu/grilled-shrimp-salad.jpg" },
      { name: "Fried Shrimp Salad",     price: 12.49, img: "Images/menu/fried-shrimp-salad.jpg" },
      { name: "Pulled Pork Salad",      price: 11.45, img: "Images/menu/pulled-pork-salad.jpg" },
      { name: "Chopped Brisket Salad",  price: 12.49, img: "Images/menu/brisket-salad.jpg" }
    ]
  },

  sides: {
    title: "Sides & Extras",
    subtitle: "Small & Large",
    icon: "🫘",
    hero: "Images/menu/sides-hero.jpg",
    color: "#e8d44d",
    items: [
      { name: "Baked Beans",               price: 3.39, img: "Images/menu/baked-beans.jpg", priceLg: 10.94 },
      { name: "Corn Pudding",              price: 3.39, img: "Images/menu/corn-pudding.jpg", priceLg: 10.94 },
      { name: "Potato Salad",              price: 3.39, img: "Images/menu/potato-salad.jpg", priceLg: 10.94 },
      { name: "Cole Slaw",                 price: 3.39, img: "Images/menu/cole-slaw.jpg", priceLg: 10.94 },
      { name: "French Fry",                price: 3.39, img: "Images/menu/french-fry.jpg", priceLg: 10.94 },
      { name: "Sweet Potato Waffle Fries",  price: 3.39, img: "Images/menu/waffle-fries.jpg", priceLg: 10.94 },
      { name: "Mac & Cheese",              price: 4.43, img: "Images/menu/mac-cheese.jpg", priceLg: 13.53 }
    ]
  },

  combos: {
    title: "Combos",
    subtitle: "2 Meats · 2 Sides · Garlic Toast · BBQ Sauce",
    icon: "🍽️",
    hero: "Images/menu/combos-hero.jpg",
    color: "#e8d44d",
    items: [
      { name: "2-Meat Combo Plate", price: 20.82, img: "Images/menu/combo-plate.jpg", note: "Ribs (3), ½ Chicken, Pulled Pork, Smoked Wings, or Brisket" }
    ]
  },

  by_the_pound: {
    title: "By the Pound",
    subtitle: "Bulk Smoked Meats",
    icon: "⚖️",
    hero: "Images/menu/by-the-pound-hero.jpg",
    color: "#6ddb7a",
    items: [
      { name: "Brisket",        price: 19.78, img: "Images/menu/brisket-bulk.jpg" },
      { name: "Pulled Pork",    price: 13.53, img: "Images/menu/pulled-pork-bulk.jpg" },
      { name: "Baby Back Ribs", price: 13.53, img: "Images/menu/baby-back-ribs-bulk.jpg" },
      { name: "½ Chicken",      price: 8.32,  img: "Images/menu/half-chicken-bulk.jpg" },
      { name: "Smoked Wings",   price: 11.45, img: "Images/menu/smoked-wings-bulk.jpg" }
    ]
  },

  desserts: {
    title: "The Scoop",
    subtitle: "Desserts",
    icon: "🍮",
    hero: "Images/menu/desserts-hero.jpg",
    color: "#e87cb0",
    items: [
      { name: "Bread Pudding",           price: null, img: "Images/menu/bread-pudding.jpg" },
      { name: "Blueberry Cheesecake",    price: null, img: "Images/menu/blueberry-cheesecake.jpg" },
      { name: "Creole Cream Cheesecake", price: null, img: "Images/menu/creole-cheesecake.jpg" },
      { name: "Milky Way Pie",           price: null, img: "Images/menu/milky-way-pie.jpg" }
    ]
  }
};

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
    facebook: "https://www.facebook.com/1547733028788117/"
  },
  cash_discount: "We offer a 4% cash discount"
};
