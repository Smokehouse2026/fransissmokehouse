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

/* Storage bucket name (created in Supabase Storage — see SETUP.md) */
const SB_BUCKET = "menu-images";

/* ═══════════════════════════════════════════════════════════
   Below this line: don't edit unless you know what you're doing
═══════════════════════════════════════════════════════════ */

const SB_HEADERS = {
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
   STORAGE — upload & delete image files
═══════════════════════════════════════════════════════════ */

/**
 * Upload a File/Blob to the storage bucket.
 * Returns { path, url } where url is the public URL.
 * folder is optional — e.g. "menu", "market", "special".
 */
async function sbUpload(file, folder = 'menu') {
  if (!file) throw new Error('sbUpload: no file given');
  // sanitize filename — strip path, replace non-safe chars
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const path = `${folder}/${stamp}_${safe}`;

  const r = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
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

/**
 * Delete a file from the storage bucket by its public URL or storage path.
 * Safe to call on URLs that aren't from our bucket — just no-ops.
 */
async function sbDeleteFile(urlOrPath) {
  if (!urlOrPath) return;
  let path = urlOrPath;
  // Extract the path from a public URL
  const publicPrefix = `${SUPABASE_URL}/storage/v1/object/public/${SB_BUCKET}/`;
  if (path.startsWith(publicPrefix)) {
    path = path.slice(publicPrefix.length);
  } else if (path.startsWith('http')) {
    // External URL — not ours, skip
    return;
  }
  const r = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${SB_BUCKET}/${path}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  );
  // 200 OK or 404 (already gone) — both fine. Anything else, log but don't throw.
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
 * { url, crop:{x,y,zoom,rotation} } objects.
 */
function normalizeImages(images, legacyImg) {
  if (Array.isArray(images) && images.length) {
    return images.map(im => ({
      url: im.url || im,
      crop: im.crop || { x: 0, y: 0, zoom: 1, rotation: 0 }
    }));
  }
  if (legacyImg) {
    return [{ url: legacyImg, crop: { x: 0, y: 0, zoom: 1, rotation: 0 } }];
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
