/* ═══════════════════════════════════════════════════════════
   SUPABASE.JS — One file shared across menu, market, editor
   ═══════════════════════════════════════════════════════════

   👉 PASTE YOUR PROJECT URL AND ANON KEY BELOW.
   Find them at:  Supabase Dashboard → Project Settings → API
   The anon key is SAFE to expose publicly — that's its purpose.
*/

const SUPABASE_URL      = "https://ydosjnjuemgfahjilavq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3Nqbmp1ZW1nZmFoamlsYXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTYyMzYsImV4cCI6MjA5MzM3MjIzNn0.0qdt6LnHjAtiS-EqLMvrFcTfm1fw2lEhZdNT6Ko7MNI";

/* ═══ EDITOR PASSWORD ═══════════════════════════════════════
   Change this to whatever you & Jenna want.
   It's only as secret as the people who know it.
*/
const EDITOR_PASSWORD = "2172";

/* ═══════════════════════════════════════════════════════════
   Below this line: don't edit unless you know what you're doing
═══════════════════════════════════════════════════════════ */

/* Headers — works with both legacy anon JWT and new sb_publishable_ keys.
   Legacy keys (eyJ...) need Bearer auth; new keys don't. */
const _isLegacyKey = SUPABASE_ANON_KEY.startsWith('eyJ');
const SB_HEADERS = _isLegacyKey ? {
  apikey:        SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type':'application/json',
  Prefer:        'return=representation'
} : {
  apikey:        SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type':'application/json',
  Prefer:        'return=representation'
};

/* Generic REST helpers (no SDK needed — keeps it lightweight) */
async function sbSelect(table, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const r = await fetch(url, { headers: SB_HEADERS });
  if (!r.ok) throw new Error(`Supabase select ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbInsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: SB_HEADERS, body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase insert ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpdate(table, match, patch) {
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'PATCH', headers: SB_HEADERS, body: JSON.stringify(patch)
  });
  if (!r.ok) throw new Error(`Supabase update ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...SB_HEADERS, Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase upsert ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbDelete(table, match) {
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'DELETE', headers: SB_HEADERS
  });
  if (!r.ok) throw new Error(`Supabase delete ${table}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

/* ═══════════════════════════════════════════════════════════
   LOAD MENU (categories + items grouped + special + scarcity)
   Uses localStorage cache for instant render; refreshes in background.
═══════════════════════════════════════════════════════════ */
async function loadMenuData() {
  const [cats, items, special, scarcity] = await Promise.all([
    sbSelect('menu_categories', 'order=sort_order.asc'),
    sbSelect('menu_items',      'order=sort_order.asc'),
    sbSelect('daily_special',   'id=eq.current'),
    sbSelect('scarcity',        '')
  ]);

  // Group items into their categories
  const MENU = {};
  cats.filter(c => !c.hidden).forEach(c => {
    MENU[c.id] = {
      title: c.title, subtitle: c.subtitle, icon: c.icon,
      items: items
        .filter(i => i.category_id === c.id && !i.hidden)
        .map(i => ({
          name: i.name, price: i.price, priceLg: i.price_lg,
          img: i.img, desc: i.description, note: i.note,
          pairs: i.pairs, badge: i.badge, badgeStyle: i.badge_style
        }))
    };
  });

  const SITE_SPECIAL = special[0] ? {
    name: special[0].name, price: special[0].price, desc: special[0].description,
    type: special[0].type, image: special[0].image, hidden: special[0].hidden
  } : { hidden: true };

  const sold = scarcity.find(s => s.id==='sold_out')?.items || [];
  const fast = scarcity.find(s => s.id==='selling_fast')?.items || [];

  return { MENU, SITE_SPECIAL, SOLD_OUT: sold, SELLING_FAST: fast };
}

/* ═══════════════════════════════════════════════════════════
   LOAD MARKET (categories + items grouped)
═══════════════════════════════════════════════════════════ */
async function loadMarketData() {
  const [cats, items] = await Promise.all([
    sbSelect('market_categories', 'order=sort_order.asc'),
    sbSelect('market_items',      'order=sort_order.asc')
  ]);
  const MARKET = {};
  cats.filter(c => !c.hidden).forEach(c => {
    MARKET[c.id] = {
      title: c.title, subtitle: c.subtitle, icon: c.icon,
      items: items
        .filter(i => i.category_id === c.id && !i.hidden)
        .map(i => ({
          name: i.name, price: i.price, unit: i.unit,
          img: i.img, desc: i.description, note: i.note,
          badge: i.badge, badgeStyle: i.badge_style
        }))
    };
  });
  return { MARKET };
}

/* ═══════════════════════════════════════════════════════════
   CACHE HELPERS — localStorage so pages render instantly,
   then refresh in background.
═══════════════════════════════════════════════════════════ */
function cacheGet(key) {
  try { return JSON.parse(localStorage.getItem(`francis_${key}`) || 'null'); }
  catch { return null; }
}
function cacheSet(key, val) {
  try { localStorage.setItem(`francis_${key}`, JSON.stringify(val)); } catch {}
}

/* High-level: get data from cache instantly if it exists, then refresh in background */
async function loadCachedThenRefresh(cacheKey, loader, onRefresh) {
  const cached = cacheGet(cacheKey);
  // Fire off network request immediately
  const networkPromise = loader().then(fresh => {
    cacheSet(cacheKey, fresh);
    if (onRefresh && cached) onRefresh(fresh);
    return fresh;
  });
  // Return cached if we have it, otherwise wait for network
  return cached || networkPromise;
}
