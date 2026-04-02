/* ═══════════════════════════════════════════════════════════════
   MARKET-DATA.JS — The Francis Smokehouse Market
   ═══════════════════════════════════════════════════════════════

   This is the ONLY file you need to edit to update the market page.
   The market page reads everything from here automatically.

   IMAGE PATHS
   ───────────
   Images use full URLs so they load from anywhere.
   Upload photos to your Images/ folder — the URL will be:
     https://www.thefrancismokehouse.com/Images/YourFile.jpg
   Recommended size: 800×800px square, JPG, under 200KB.
   Leave img as "" if no photo yet — card shows an emoji instead.

   PRICES
   ──────
   price      Plain number e.g.  12.50
   priceUnit  Label shown after price e.g.  "/ lb"  or  "each"
   Use  null  for market rate / price at counter.

   ADDING A NEW CATEGORY
   ─────────────────────
   Copy any category block, give it a new unique key,
   fill in your items. A new section appears automatically.

   HIDING AN ITEM WITHOUT DELETING IT
   ────────────────────────────────────
   Add  hidden: true  to any item and it disappears from the page.

   SOLD OUT
   ────────
   Add  soldOut: true  to any item to show a "Sold Out" badge.

═══════════════════════════════════════════════════════════════ */


/* ── MARKET CATEGORIES & ITEMS ───────────────────────────── */
/*
   CATEGORY FIELDS
   ───────────────
   title      Heading shown on the page
   subtitle   Smaller text under heading  (e.g. "Priced per pound")
   icon       Emoji shown next to the section title
   desc       Optional short paragraph describing the category

   ITEM FIELDS
   ───────────
   name       Item name  (required)
   price      Number or null
   priceUnit  String shown after price  e.g. "/ lb"  "each"  "/ link"
   img        Full URL — https://www.thefrancismokehouse.com/Images/FileName.jpg
   desc       Short description
   note       Fine-print line  (e.g. "Sold frozen")
   badge      Short badge label  (e.g. "House Made")
   badgeStyle "pop" = orange  ·  "sig" = amber  ·  "new" = green
   soldOut    true to show Sold Out overlay
   hidden     true to hide without deleting
*/
var MARKET = {

  /* ── BOUDIN ─────────────────────────────────────────────── */
  boudin: {
    title:    "Boudin",
    subtitle: "House-Made Daily",
    icon:     "🌭",
    desc:     "Made fresh in-house every day. Links, balls, and specialty varieties.",
    items: [
      {
        name:       "Classic Pork Boudin",
        price:      null,
        priceUnit:  "/ lb",
        img:        "https://www.thefrancismokehouse.com/Images/ClassicBoudin.jpg",
        desc:       "Traditional Louisiana pork and rice boudin. Mild seasoning, perfect smoke.",
        badge:      "House Made",
        badgeStyle: "sig"
      },
      {
        name:       "Pepper Jack Boudin",
        price:      null,
        priceUnit:  "/ lb",
        img:        "https://www.thefrancismokehouse.com/Images/PepperJackBoudin.jpg",
        desc:       "Classic boudin stuffed with creamy pepper jack cheese.",
        badge:      "Best Seller",
        badgeStyle: "pop"
      },
      {
        name:  "Boudin Balls",
        price: null,
        priceUnit: "/ dozen",
        img:   "https://www.thefrancismokehouse.com/Images/BoudinBalls.jpg",
        desc:  "Fried crispy on the outside, soft and smoky on the inside."
      },
      {
        name:  "Smoked Boudin",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/SmokedBoudin.jpg",
        desc:  "Boudin links run through the smoker for an extra layer of flavor."
      }
    ]
  },

  /* ── SAUSAGE ─────────────────────────────────────────────── */
  sausage: {
    title:    "Sausage",
    subtitle: "House-Made & Smoked",
    icon:     "🔥",
    desc:     "All sausages made in-house and smoked on-site.",
    items: [
      {
        name:       "Smoked Sausage",
        price:      null,
        priceUnit:  "/ lb",
        img:        "https://www.thefrancismokehouse.com/Images/SmokedSausage.jpg",
        desc:       "Classic smoked pork sausage. Great on the grill or sliced into a plate.",
        badge:      "House Made",
        badgeStyle: "sig"
      },
      {
        name:  "Hot Sausage",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/HotSausage.jpg",
        desc:  "Pork sausage with a kick. Good heat, great flavor."
      },
      {
        name:  "Andouille",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/Andouille.jpg",
        desc:  "Double-smoked andouille. The backbone of any gumbo or jambalaya."
      }
    ]
  },

  /* ── SMOKED MEATS ────────────────────────────────────────── */
  smoked_meats: {
    title:    "Smoked Meats",
    subtitle: "By the Pound",
    icon:     "🥩",
    desc:     "Same meats from the pit — packaged to take home.",
    items: [
      {
        name:       "Brisket",
        price:      null,
        priceUnit:  "/ lb",
        img:        "https://www.thefrancismokehouse.com/Images/BrisketBulk.jpg",
        desc:       "Sliced to order. Bark-crusted, smoke-ringed.",
        badge:      "Most Ordered",
        badgeStyle: "pop"
      },
      {
        name:  "Pulled Pork",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/PulledPorkBulk.jpg",
        desc:  "House-smoked pulled pork, packed and ready to go."
      },
      {
        name:  "Smoked Wings",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/SmokedWingsBulk.jpg",
        desc:  "Whole wings smoked low and slow."
      },
      {
        name:  "Baby Back Ribs",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/BabyBackRibs.jpg",
        desc:  "Half rack or full rack available. Ask at the counter."
      },
      {
        name:  "½ Chicken",
        price: null,
        priceUnit: "each",
        img:   "https://www.thefrancismokehouse.com/Images/HalfChickenBulk.jpg",
        desc:  "Brined and smoked whole, cut to order."
      }
    ]
  },

  /* ── SPECIALTY ITEMS ─────────────────────────────────────── */
  specialty: {
    title:    "Specialty Items",
    subtitle: "In-Store Only",
    icon:     "⭐",
    desc:     "House-made specialty products available while supplies last.",
    items: [
      {
        name:  "Tasso Ham",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/TassoHam.jpg",
        desc:  "Heavily seasoned and smoked Cajun tasso. Essential for cooking."
      },
      {
        name:  "Smoked Turkey",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/SmokedTurkey.jpg",
        desc:  "Whole smoked turkey. Seasonal — call ahead to order.",
        note:  "Seasonal · Call ahead"
      },
      {
        name:  "Cracklins",
        price: null,
        priceUnit: "/ lb",
        img:   "https://www.thefrancismokehouse.com/Images/Cracklins.jpg",
        desc:  "Fresh fried pork cracklins. Made in small batches.",
        badge:      "Fan Favorite",
        badgeStyle: "pop"
      }
    ]
  },

  /* ── SIDES TO GO ─────────────────────────────────────────── */
  sides_to_go: {
    title:    "Sides To Go",
    subtitle: "Family-Size Portions",
    icon:     "🫙",
    desc:     "The same sides from the restaurant, packed in family-size containers.",
    items: [
      {
        name:  "Corn Pudding",
        price: null,
        priceUnit: "/ quart",
        img:   "https://www.thefrancismokehouse.com/Images/CornPudding.jpg",
        desc:  "Our most-loved side. Creamy, sweet Southern corn pudding.",
        badge:      "Most Loved",
        badgeStyle: "pop"
      },
      {
        name:  "Baked Beans",
        price: null,
        priceUnit: "/ quart",
        img:   "https://www.thefrancismokehouse.com/Images/BakedBeans.jpg",
        desc:  "Slow-cooked with smoked meat drippings."
      },
      {
        name:  "Potato Salad",
        price: null,
        priceUnit: "/ quart",
        img:   "https://www.thefrancismokehouse.com/Images/PotatoSalad.jpg",
        desc:  "Classic Southern-style creamy potato salad."
      },
      {
        name:  "Mac & Cheese",
        price: null,
        priceUnit: "/ quart",
        img:   "https://www.thefrancismokehouse.com/Images/MacCheese.jpg",
        desc:  "Creamy Southern mac & cheese."
      }
    ]
  }

}; /* end MARKET */
