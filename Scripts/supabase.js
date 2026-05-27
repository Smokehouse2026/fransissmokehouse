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
   REMOVED — replaced by real Supabase Auth (email + password).
   Add user accounts in Supabase Dashboard → Authentication → Users.
   See AUTH_SETUP.md for setup instructions.
*/

/* Storage bucket name (created in Supabase Storage — see SETUP.md) */
const SB_BUCKET = "menu-images";

/* ═══════════════════════════════════════════════════════════
   Below this line: don't edit unless you know what you're doing
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   AUTH (Supabase email + password)
═══════════════════════════════════════════════════════════ */
const SB_AUTH_KEY = 'francis_sb_session';   // localStorage key

/** Load the current session from localStorage, or null. */
function sbGetSession(){
  try {
    const raw = localStorage.getItem(SB_AUTH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // expires_at is a unix timestamp (seconds). Treat expired sessions as no session.
    if (s.expires_at && (s.expires_at * 1000) < Date.now()) return null;
    return s;
  } catch { return null; }
}

function sbSaveSession(session){
  if (session) localStorage.setItem(SB_AUTH_KEY, JSON.stringify(session));
  else localStorage.removeItem(SB_AUTH_KEY);
}

/** Sign in with email + password. Returns session on success, throws on failure. */
async function sbSignIn(email, password){
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error_description || data.msg || data.message || `Sign in failed (${r.status})`);
  // data: { access_token, refresh_token, expires_in, expires_at, user, ... }
  sbSaveSession(data);
  return data;
}

/** Sign out — revoke server-side token and clear local storage. */
async function sbSignOut(){
  const s = sbGetSession();
  if (s) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${s.access_token}` }
      });
    } catch { /* best-effort */ }
  }
  sbSaveSession(null);
}

/** Get current user info (email, id) from local session — no network. */
function sbCurrentUser(){
  const s = sbGetSession();
  return s?.user || null;
}

/** Build headers dynamically: use the session token if logged in, else anon. */
function sbHeaders(extra){
  const s = sbGetSession();
  const token = s?.access_token || SUPABASE_ANON_KEY;
  return Object.assign({
    apikey:        SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
    'Content-Type':'application/json',
    Prefer:        'return=representation'
  }, extra || {});
}

/** Fetch list of staff users (reads from the editor_users view created in AUTH_SETUP.md).
 *  Only works if you're logged in. Returns [] on error so the UI doesn't crash. */
async function sbListUsers(){
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/editor_users?select=*`, {
      headers: sbHeaders()
    });
    if (!r.ok) return [];
    return r.json();
  } catch { return []; }
}

/* Keep the old SB_HEADERS constant working for any code that imported it.
 * It returns the *current* headers each time it's read. */
const SB_HEADERS = new Proxy({}, {
  get(_, prop) { return sbHeaders()[prop]; },
  ownKeys() { return Object.keys(sbHeaders()); },
  getOwnPropertyDescriptor() { return { enumerable: true, configurable: true }; }
});

/* Generic REST helpers (no SDK needed — keeps it lightweight) */
async function sbSelect(table, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const r = await fetch(url, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Supabase select ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbInsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: sbHeaders(), body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase insert ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpdate(table, match, patch) {
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(patch)
  });
  if (!r.ok) throw new Error(`Supabase update ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...sbHeaders(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase upsert ${table}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbDelete(table, match) {
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'DELETE', headers: sbHeaders()
  });
  if (!r.ok) throw new Error(`Supabase delete ${table}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

/* ═══════════════════════════════════════════════════════════
   STORAGE — upload & delete image files
═══════════════════════════════════════════════════════════ */

/**
 * Upload a File/Blob to the storage bucket.
 * Returns { path, url } where url is the public URL.
 * folder is optional — e.g. "menu", "market", "special".
 */
async function sbUpload(file, folder = 'menu') {
  if (!file) throw new Error('sbUpload: no file given');
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const path = `${folder}/${stamp}_${safe}`;

  const s = sbGetSession();
  const token = s?.access_token || SUPABASE_ANON_KEY;

  const r = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false'
      },
      body: file
    }
  );
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Storage upload failed (${r.status}): ${err}`);
  }
  const url = `${SUPABASE_URL}/storage/v1/object/public/${SB_BUCKET}/${path}`;
  return { path, url };
}

async function sbDeleteFile(urlOrPath) {
  if (!urlOrPath) return;
  let path = urlOrPath;
  const publicPrefix = `${SUPABASE_URL}/storage/v1/object/public/${SB_BUCKET}/`;
  if (path.startsWith(publicPrefix)) {
    path = path.slice(publicPrefix.length);
  } else if (path.startsWith('http')) {
    return;
  }
  const s = sbGetSession();
  const token = s?.access_token || SUPABASE_ANON_KEY;
  const r = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}/${path}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!r.ok && r.status !== 404) {
    console.warn(`sbDeleteFile ${path}: ${r.status} ${await r.text()}`);
  }
}

/* ═══════════════════════════════════════════════════════════
   IMAGE HELPERS — normalize old/new image data
═══════════════════════════════════════════════════════════ */

/**
 * Normalize the images field. Accepts the new `images` jsonb array OR
 * the legacy single `img` string. Returns always an array of
 * { url, pos?, fit? } objects. Older `crop:{x,y,zoom,rotation}` records
 * get migrated to `fit:{offsetX,offsetY,scale}` automatically.
 */
function normalizeImages(images, legacyImg) {
  if (Array.isArray(images) && images.length) {
    return images.map(im => {
      const url = im.url || im;
      const out = { url };
      // Pass through pos/fit if present
      if (im.pos) out.pos = im.pos;
      if (im.fit) out.fit = im.fit;
      // Migrate old crop format to fit
      if (!im.fit && im.crop) {
        out.fit = {
          offsetX: im.crop.x || 0,
          offsetY: im.crop.y || 0,
          scale:   im.crop.zoom || 1
        };
      }
      return out;
    });
  }
  if (legacyImg) {
    return [{ url: legacyImg }];
  }
  return [];
}

/* ═══════════════════════════════════════════════════════════
   LOAD MENU (categories + items grouped + special + scarcity)
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
          img: i.img,
          images: normalizeImages(i.images, i.img),
          imageLayout: i.image_layout || 'collage',
          desc: i.description, note: i.note,
          pairs: i.pairs, badge: i.badge, badgeStyle: i.badge_style
        }))
    };
  });

  const sp = special[0];
  const SITE_SPECIAL = sp ? {
    name: sp.name, price: sp.price, desc: sp.description,
    type: sp.type, image: sp.image,
    images: normalizeImages(sp.images, sp.image),
    imageLayout: sp.image_layout || 'collage',
    hidden: sp.hidden
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
          img: i.img,
          images: normalizeImages(i.images, i.img),
          imageLayout: i.image_layout || 'collage',
          desc: i.description, note: i.note,
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

/* ═══════════════════════════════════════════════════════════
   HOMEPAGE — load and save the homepage settings row.
   The whole homepage config lives in one jsonb column.
   NO defaults in JS — all defaults live in the Supabase row.
═══════════════════════════════════════════════════════════ */

/** Minimal structural shape so missing fields don't crash callers.
 *  These are NOT visible defaults — they're empty containers.
 *  cards = []  → truly empty, nothing renders if Supabase is unset. */
function emptyHomepage() {
  return {
    title: '',
    title_em: '',
    tagline: '',
    eyebrow: '',
    cards: [],
    footer: { phone:'', address:'', facebook:'', instagram:'' },
    theme:  { bg:'', text:'', eyebrow:'', ember:'', fire:'', flame:'', glow:'', overlay:'' }
  };
}

/** Merge fetched data with the empty shape so all keys exist. */
function mergeHomepage(fetched) {
  const empty = emptyHomepage();
  const f = fetched || {};
  return {
    title:    f.title    ?? empty.title,
    title_em: f.title_em ?? empty.title_em,
    tagline:  f.tagline  ?? empty.tagline,
    eyebrow:  f.eyebrow  ?? empty.eyebrow,
    cards:    Array.isArray(f.cards)
              ? f.cards.map(c => ({ label:'', sub:'', href:'', image:'', ...c }))
              : empty.cards,
    footer:   { ...empty.footer, ...(f.footer || {}) },
    theme:    { ...empty.theme,  ...(f.theme  || {}) }
  };
}

async function loadHomepage() {
  try {
    const rows = await sbSelect('homepage', 'id=eq.current');
    if (rows && rows.length && rows[0].data) {
      return mergeHomepage(rows[0].data);
    }
  } catch (e) {
    console.warn('loadHomepage failed:', e.message);
  }
  return mergeHomepage(null);
}

async function saveHomepage(data) {
  return await sbUpsert('homepage', { id: 'current', data });
}
