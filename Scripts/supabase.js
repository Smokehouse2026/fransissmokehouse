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

/** Map old table names to the renamed ones. Lets editor.html and the loaders
 *  keep using the original names; we translate at request time. Any name not
 *  in the map is passed through unchanged. */
const TABLE_RENAMES = {
  daily_special: 'menu_daily_special',
  scarcity:      'menu_scarcity',
  homepage:      'site_homepage',
  business:      'site_business',
  editor_users:  'site_editor_users'
};
function resolveTable(name){ return TABLE_RENAMES[name] || name; }

/** Fetch list of staff users (reads from the site_editor_users view).
 *  Only works if you're logged in. Returns [] on error so the UI doesn't crash. */
async function sbListUsers(){
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${resolveTable('editor_users')}?select=*`, {
      headers: sbHeaders()
    });
    if (!r.ok) return [];
    return r.json();
  } catch { return []; }
}

/* Keep the old SB_HEADERS constant working for any code that imported it. */
const SB_HEADERS = new Proxy({}, {
  get(_, prop) { return sbHeaders()[prop]; },
  ownKeys() { return Object.keys(sbHeaders()); },
  getOwnPropertyDescriptor() { return { enumerable: true, configurable: true }; }
});

/* Generic REST helpers (no SDK needed — keeps it lightweight) */
async function sbSelect(name, query = '') {
  const table = resolveTable(name);
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const r = await fetch(url, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Supabase select ${name}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbInsert(name, row) {
  const table = resolveTable(name);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: sbHeaders(), body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase insert ${name}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpdate(name, match, patch) {
  const table = resolveTable(name);
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(patch)
  });
  if (!r.ok) throw new Error(`Supabase update ${name}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbUpsert(name, row) {
  const table = resolveTable(name);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: sbHeaders({ Prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase upsert ${name}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function sbDelete(name, match) {
  const table = resolveTable(name);
  const q = Object.entries(match).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${q}`, {
    method: 'DELETE', headers: sbHeaders()
  });
  if (!r.ok) throw new Error(`Supabase delete ${name}: ${r.status} ${await r.text()}`);
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

/** Merge fetched data with the empty shape so all keys exist.
 *  Preserves any extra fields the editor may not know about (hours_label,
 *  ratings, cash_note, etc.) so saving doesn't strip them. */
function mergeHomepage(fetched) {
  const empty = emptyHomepage();
  const f = fetched || {};
  return {
    // Start with everything in fetched so unknown fields survive a round-trip
    ...f,
    // Then override the structural keys to guarantee shape
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

/** Clear the cached homepage in localStorage so the next page load fetches fresh. */
function invalidateHomepageCache() {
  try { localStorage.removeItem('francis_homepage'); } catch {}
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
  const result = await sbUpsert('homepage', { id: 'current', data });
  // Make sure any cached homepage on the live site / other pages doesn't
  // serve stale data after a save.
  invalidateHomepageCache();
  return result;
}

/* ═══════════════════════════════════════════════════════════
   BUSINESS INFO — phone, address, hours, email, socials.
   Shared across every page. Single row.
═══════════════════════════════════════════════════════════ */

/** Empty shape so callers can always read fields without "undefined" crashes. */
function emptyBusiness() {
  return {
    name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    cash_note: '',
    hours_label: '',
    hours: { mon:'', tue:'', wed:'', thu:'', fri:'', sat:'', sun:'' },
    socials: { facebook:'', instagram:'' },
    ratings: {},
    custom_fields: []
  };
}

/** Same shape-merging pattern as homepage: preserve extra fields. */
function mergeBusiness(fetched) {
  const empty = emptyBusiness();
  const f = fetched || {};
  return {
    ...f,
    name:         f.name         ?? empty.name,
    phone:        f.phone        ?? empty.phone,
    address_line: f.address_line ?? empty.address_line,
    city:         f.city         ?? empty.city,
    state:        f.state        ?? empty.state,
    zip:          f.zip          ?? empty.zip,
    email:        f.email        ?? empty.email,
    cash_note:    f.cash_note    ?? empty.cash_note,
    hours_label:  f.hours_label  ?? empty.hours_label,
    hours:        { ...empty.hours,   ...(f.hours   || {}) },
    socials:      { ...empty.socials, ...(f.socials || {}) },
    ratings:      f.ratings      ?? empty.ratings,
    custom_fields: Array.isArray(f.custom_fields) ? f.custom_fields : []
  };
}

/** Load business info from Supabase. Returns merged shape. */
async function loadBusiness() {
  try {
    const rows = await sbSelect('business', 'id=eq.current');
    if (rows && rows.length && rows[0].data) {
      return mergeBusiness(rows[0].data);
    }
  } catch (e) {
    console.warn('loadBusiness failed:', e.message);
  }
  return mergeBusiness(null);
}

async function saveBusiness(data) {
  const result = await sbUpsert('business', { id: 'current', data });
  invalidateBusinessCache();
  return result;
}

function invalidateBusinessCache() {
  try { localStorage.removeItem('francis_business'); } catch {}
}

/** Build a one-line address string from the parts (used in footers). */
function formatBusinessAddress(b) {
  if (!b) return '';
  const parts = [b.address_line, b.city, b.state].filter(Boolean);
  return parts.join(', ');
}

/** Format hours nicely. If hours_label is set, use it. Otherwise build from per-day. */
function formatBusinessHours(b) {
  if (!b) return '';
  if (b.hours_label) return b.hours_label;
  // Could expand later to render per-day rows
  return '';
}

/** Apply business info into a page's footer. Pages call this from their boot script.
 *  Selects: #footer-phone, #footer-address, #footer-email, #footer-hours,
 *           #footer-facebook, #footer-instagram, #footer-cash-note
 *  Any of these can be missing — the function only updates what it finds. */
function applyBusinessToFooter(b) {
  if (!b) return;
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
  const setHref = (id, val) => { const el = document.getElementById(id); if (el && val) el.href = val; };
  const showHide = (id, show) => { const el = document.getElementById(id); if (el) el.style.display = show ? '' : 'none'; };

  setText('footer-phone',     b.phone);
  setText('footer-address',   formatBusinessAddress(b));
  setText('footer-email',     b.email);
  setText('footer-hours',     formatBusinessHours(b));
  setText('footer-cash-note', b.cash_note);

  // Phone "tel:" link version
  const phoneLink = document.getElementById('footer-phone-link');
  if (phoneLink && b.phone) phoneLink.href = 'tel:' + b.phone.replace(/[^0-9+]/g, '');

  // Socials — hide the whole link if URL is empty
  const fb = document.getElementById('footer-facebook');
  if (fb) {
    if (b.socials?.facebook) { fb.href = b.socials.facebook; fb.style.display = ''; }
    else fb.style.display = 'none';
  }
  const ig = document.getElementById('footer-instagram');
  if (ig) {
    if (b.socials?.instagram) { ig.href = b.socials.instagram; ig.style.display = ''; }
    else ig.style.display = 'none';
  }
}
