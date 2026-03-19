// ═══════════════════════════════════════════════════════════════
//  THE FRANCIS SMOKEHOUSE — SITE DATA
//  6779 US Highway 61 · St. Francisville, LA · (225) 245-5046
//  ─────────────────────────────────────────────────────────────
//
//  This single file powers both the homepage specials wheel
//  and the full interactive menu wheel.
//
//  ── TO UPDATE DAILY SPECIALS ────────────────────────────────
//    • Change "date" to today's date (YYYY-MM-DD)
//    • Update name, price, desc for each item you want shown
//    • Items with a different date are hidden automatically
//    • Add or remove items freely — the wheel adjusts
//
//  ── TO UPDATE THE FULL MENU ─────────────────────────────────
//    • Find the category you want to edit in MENU below
//    • Add/remove items inside that category's "items" array
//    • Update name, price, and desc as needed
//
// ═══════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
//  DAILY SPECIALS  ← EDIT HERE EVERY DAY
// ─────────────────────────────────────────────────────────────
const SPECIALS = [
  {
    "date":  "2026-03-19",
    "name":  "Blackened Lemon Fish",
    "price": "$28",
    "desc":  "Blackened fillet with cream spinach and grilled crawfish tails. Elegant Southern seafood at its absolute peak."
  },
  {
    "date":  "2026-03-19",
    "name":  "Thai Chili Wings",
    "price": "$16",
    "desc":  "Smoked wings tossed in sweet Thai chili sauce. A bold East-meets-South mashup that works surprisingly, undeniably well."
  },
  {
    "date":  "2026-03-19",
    "name":  "Eggplant Pirogue",
    "price": "$26",
    "desc":  "Eggplant hollowed into a pirogue and filled with a rich Cajun seafood stuffing. A true Louisiana original."
  },
  {
    "date":  "2026-03-19",
    "name":  "BBQ Shrimp & Pork Chop",
    "price": "$26",
    "desc":  "Jack Daniel's BBQ shrimp alongside a 14oz bone-in pork chop with mac and cheese and green beans."
  },
  {
    "date":  "2026-03-19",
    "name":  "Grilled Salmon",
    "price": "$28",
    "desc":  "Grilled salmon topped with lump crabmeat and avocado cream sauce. Rich, luxurious, and worth every cent."
  },
  {
    "date":  "2026-03-19",
    "name":  "Miss Mud Pie",
    "price": "$7",
    "desc":  "The house dessert special. Chocolate, cream, crunch. We will let it speak for itself."
  }
];


// ─────────────────────────────────────────────────────────────
//  FULL MENU  ← Edit items, prices, and descriptions here
// ─────────────────────────────────────────────────────────────
const MENU=[
  {id:'bbq',label:'BBQ PLATE',icon:'🔥',color:'#C43C10',rimColor:'rgba(232,83,42,.55)',note:'Every plate served with your choice of two sides',
   items:[
    {name:'Full Rack of Ribs',price:'$19.99',desc:'Our crown jewel. Smoked low-and-slow over hardwood for hours until the meat falls clean off the bone. Sweet, smoky, and built for sharing — or not.'},
    {name:'Half Rack of Ribs',price:'$11.99',desc:'Same pit. Same patience. Same fall-off-the-bone tenderness. Half the rack, all the glory.'},
    {name:'Pulled Pork Plate',price:'$9.99',desc:'Pork shoulder smoked low and slow then pulled by hand. Rich, tender, and kissed with our house seasoning.'},
    {name:'Brisket Plate',price:'$10.99',desc:'The one regulars drive miles for. Slow-smoked until it practically melts — fork-tender with a deep, beautiful smoke ring.'},
    {name:'Half Chicken Plate',price:'$9.99',desc:'A half bird with smoke-crisp skin and impossibly juicy meat inside. The pit does all the work.'},
    {name:'Smoked Wings',price:'$7.99',desc:'Pit-seasoned wings, smoked low then finished hot for crispy skin. Tender, smoky, and dangerously snackable.'}
  ]},
  {id:'burgers',label:'BURGERS',icon:'🍔',color:'#8C4A12',rimColor:'rgba(180,100,30,.55)',note:'Includes one side · dressed with lettuce & tomato',
   items:[
    {name:'Hamburger',price:'$6.99',desc:'A straight-up half-pound patty on a toasted bun. Simple, dressed right, no fuss needed.'},
    {name:'Cheeseburger',price:'$7.99',desc:'American or cheddar melted perfectly on our classic half-pound patty. A true Smokehouse staple.'},
    {name:'Bacon Cheeseburger',price:'$8.99',desc:'Thick-cut bacon, melted cheese, and our half-pound patty stacked together. The full picture.'},
    {name:'Chicken Sandwich',price:'$7.99',desc:'Crispy Southern-fried chicken on a toasted bun, dressed clean with lettuce and tomato.'}
  ]},
  {id:'poboys',label:'PO-BOYS',icon:'🥖',color:'#7A5010',rimColor:'rgba(180,130,40,.5)',note:'Includes one side · Louisiana-style dressed',
   items:[
    {name:'Ribeye Po-Boy',price:'$10.99',desc:'Shaved ribeye piled high on toasted French bread, dressed Louisiana-style. Messy in the best possible way.'},
    {name:'Pulled Pork Sub',price:'$7.99',desc:'House-pulled pork on a toasted roll — the same pit-smoked pork from our plates, sandwiched up beautifully.'},
    {name:'Brisket Sandwich',price:'$8.99',desc:'Sliced pit brisket on toasted bread. Smoke-forward, tender, worth every single bite.'},
    {name:'Shrimp Po-Boy',price:'$8.99',desc:'Gulf shrimp battered and golden-fried, loaded onto French bread and dressed right. Classic Louisiana.'},
    {name:'Crawfish Po-Boy',price:'$10.99',desc:'Louisiana crawfish tails, seasoned and fried crisp. This one tastes like the bayou on a good day.'},
    {name:'Catfish Po-Boy',price:'$8.99',desc:'Southern-fried catfish on French bread — dressed, crispy, and unmistakably Louisiana.'}
  ]},
  {id:'sides',label:'SIDES',icon:'🫙',color:'#5A3C14',rimColor:'rgba(150,100,40,.5)',note:'Small $2.75 · Large $6.99 · Made in-house daily',
   items:[
    {name:'Baked Beans',price:'$2.75–$6.99',desc:'Slow-cooked beans in a smoky-sweet sauce. The kind you want a second scoop of without admitting it.'},
    {name:'Corn Pudding',price:'$2.75–$6.99',desc:'A Smokehouse signature that customers rave about. Creamy, sweet, and savory all at once — order the large.'},
    {name:'Potato Salad',price:'$2.75–$6.99',desc:'House-made Southern potato salad. Creamy, simple, and exactly what a great BBQ plate needs alongside it.'},
    {name:'Cole Slaw',price:'$2.75–$6.99',desc:'Crisp and creamy slaw. The right cool contrast to a plate of hot smoked meat.'},
    {name:'French Fries',price:'$2.75–$6.99',desc:'Hot, golden, and seasoned just right. The reliable choice that never disappoints.'},
    {name:'Sweet Potato Waffle Fries',price:'$2.75–$6.99',desc:'Sweet potato waffled and fried — a little sweet, a little crispy, and a lot of fun.'}
  ]},
  {id:'cajun',label:'CAJUN',icon:'🌶',color:'#7A1A0A',rimColor:'rgba(200,60,20,.55)',note:"Deli-style specialty items · ask about daily availability",extra:"Cajun specialties are priced at market rate. Ask your server for today's prices.",
   items:[
    {name:'Steamed Boudin Links',price:'Market',desc:'Classic Louisiana boudin — seasoned rice and pork stuffed in a natural casing and steamed. Ask what is fresh today.'},
    {name:'Boudin Balls',price:'Market',desc:'The item every first-timer orders and every regular comes back for. Deep-fried, crispy outside, creamy boudin inside.'},
    {name:'Pepper Jack Boudin Balls',price:'Market',desc:'Our famous boudin balls with molten pepper jack inside. Spicy, creamy, deeply addictive.'},
    {name:'Boudin Egg Rolls',price:'Market',desc:'Louisiana boudin wrapped in an egg roll skin and fried golden. Cajun-fusion done exactly right.'},
    {name:'Meat Pies',price:'Market',desc:'Old Creole comfort — seasoned meat in a golden pastry shell. A slice of Louisiana culinary history.'},
    {name:'Crawfish Pies',price:'Market',desc:'Gulf Coast crawfish tails in a buttery pastry shell. The flavors of South Louisiana in every bite.'}
  ]},
  {id:'specials',label:'SPECIALS',icon:'⭐',color:'#2A1A6B',rimColor:'rgba(100,80,200,.45)',note:"Chef's rotating specials",extra:'These are dinner specials reflecting seasonal ingredients and chef creativity. Availability varies — call ahead or ask your server.',
   items:[
    {name:'Thai Chili Wings',price:'$16',desc:'Smoked wings tossed in sweet Thai chili sauce. A bold East-meets-South mashup that works surprisingly, undeniably well.'},
    {name:'Eggplant Pirogue',price:'$26',desc:'Eggplant hollowed into a pirogue and filled with a rich Cajun seafood stuffing. A true Louisiana original.'},
    {name:'Blackened Lemon Fish',price:'$28',desc:'Blackened fillet with cream spinach and grilled crawfish tails. Elegant Southern seafood at its absolute peak.'},
    {name:'BBQ Shrimp & Pork Chop',price:'$26',desc:"Jack Daniel's BBQ shrimp alongside a 14oz bone-in pork chop with mac and cheese and green beans."},
    {name:'Grilled Salmon',price:'$28',desc:'Grilled salmon topped with lump crabmeat and avocado cream sauce. Rich, luxurious, and worth every cent.'},
    {name:'Miss Mud Pie',price:'$7',desc:'The house dessert special. Chocolate, cream, crunch. We will let it speak for itself.'}
  ]},
  {id:'desserts',label:'DESSERTS',icon:'🍰',color:'#3A1A08',rimColor:'rgba(180,80,20,.4)',note:'House-made fresh daily',
   items:[
    {name:'Bread Pudding',price:'House-made',desc:'Old-school Louisiana bread pudding baked fresh in-house. Rich, custardy, and deeply comforting.'},
    {name:'Creole Cream Cheesecake',price:'House-made',desc:'A Southern take on cheesecake using Creole cream cheese. Tangy, rich, and unlike any you have tried before.'},
    {name:'Chocolate & Carrot Cake',price:'House-made',desc:'Two classics done right. Moist chocolate or classic carrot — both are worthy finishes to a great meal.'},
    {name:'Strawberry Shortcake',price:'House-made',desc:'Light biscuit, fresh strawberries, and whipped cream. Simple, beautiful, and perfect when done this well.'}
  ]}
];
