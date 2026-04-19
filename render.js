/* ═══════════════════════════════════════════════════════════════════════════
   THE FRANCIS SMOKEHOUSE — Universal Site Renderer (render.js)
   ═══════════════════════════════════════════════════════════════════════════

   WHAT THIS DOES:
     Reads pages/sections/items from Supabase and renders them into any
     mount point on any page. The LIVE site uses this. The WYSIWYG editor
     ALSO uses this (in edit mode). Same code = same output.

   HOW TO USE ON A LIVE SITE:
     <link rel="stylesheet" href="render.css">  (or inline)
     <div id="fs-root" data-page-slug="menu"></div>
     <script src="render.js" defer></script>
     <script>
       window.FrancisRender.mount({
         root: '#fs-root',
         pageSlug: 'menu',
         editMode: false
       });
     </script>

   HOW THE EDITOR USES IT:
     Same mount call with editMode: true. Every editable element gets
     data-edit-* attributes so the editor can wire handlers to them.

   TEMPLATES (matches cms-schema.sql):
     home_nav            - home page: nav grid + thermometer + hero
     menu_tabs           - menu page: tabbed categories with plate builder
     items_grid_page     - market-style: single page of items grid sections
     hero_with_sections  - catering, gift, findus: hero + assorted sections
     story_chapters      - about page: chapter-style narrative

   SECTION KINDS (matches cms-schema.sql):
     items_grid, steps, stats, quote_list, rich_text, value_list, contact_form

   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ─── CONFIG ────────────────────────────────────────────────────────────── */
  const SB_URL = 'https://vncecutxggodthugxgeu.supabase.co';
  const SB_KEY = 'sb_publishable_4cC-iVqs9qE3xmADrXnCNA_DChq4xBL';
  const sbHeaders = {
    apikey: SB_KEY,
    Authorization: 'Bearer ' + SB_KEY,
  };

  /* ─── UTILS ─────────────────────────────────────────────────────────────── */
  const esc  = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const escA = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Allow &, <, >, <em>...</em>, <strong>...</strong>, <br> for title-style fields
  const richText = s => {
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/&lt;(\/?)(em|strong|br)&gt;/g, '<$1$2>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>');
  };
  const fmtPrice = p => {
    if (p == null || p === '') return '';
    const n = Number(p);
    return isNaN(n) ? String(p) : '$' + n.toFixed(2);
  };

  // Edit-mode data attributes — editor binds click handlers to these
  const editAttr = (scope, id, key) => `data-edit-scope="${scope}" data-edit-id="${id}" data-edit-key="${escA(key)}"`;

  /* ─── DATA LOADING ──────────────────────────────────────────────────────── */
  async function sbGet(table, qs = '?select=*') {
    const r = await fetch(SB_URL + '/rest/v1/' + table + qs, { headers: sbHeaders });
    if (!r.ok) throw new Error(table + ' ' + r.status);
    return r.json();
  }

  async function loadAll() {
    const [pages, sections, items, settings] = await Promise.all([
      sbGet('pages', '?select=*&order=order_idx.asc'),
      sbGet('sections', '?select=*&order=order_idx.asc'),
      sbGet('items', '?select=*&order=order_idx.asc&visible=eq.true'),
      sbGet('cms_settings'),
    ]);
    const settingsMap = {};
    settings.forEach(r => { settingsMap[r.key] = r.value; });
    return { pages, sections, items, settings: settingsMap };
  }

  // Fallback for editor to load EVEN hidden items
  async function loadAllWithHidden() {
    const [pages, sections, items, settings] = await Promise.all([
      sbGet('pages', '?select=*&order=order_idx.asc'),
      sbGet('sections', '?select=*&order=order_idx.asc'),
      sbGet('items', '?select=*&order=order_idx.asc'),
      sbGet('cms_settings'),
    ]);
    const settingsMap = {};
    settings.forEach(r => { settingsMap[r.key] = r.value; });
    return { pages, sections, items, settings: settingsMap };
  }

  /* ─── PUBLIC API ────────────────────────────────────────────────────────── */
  const FrancisRender = {
    SB_URL, SB_KEY,
    loadAll, loadAllWithHidden,
    mount,
    renderPage,
    // Section kind renderers (exposed so editor can re-render a single section)
    renderSection,
    // Utility helpers (exposed for editor)
    esc, escA, richText, fmtPrice, editAttr,
  };

  global.FrancisRender = FrancisRender;

  /* ═══════════════════════════════════════════════════════════════════════
     MOUNT — top-level entry point
     ═══════════════════════════════════════════════════════════════════════ */
  async function mount(opts) {
    const root = typeof opts.root === 'string' ? document.querySelector(opts.root) : opts.root;
    if (!root) throw new Error('FrancisRender.mount: root not found');
    const pageSlug = opts.pageSlug || root.dataset.pageSlug;
    const editMode = !!opts.editMode;

    // Loading skeleton
    root.innerHTML = '<div class="fs-loading"><div class="fs-loading-inner"><div class="fs-loading-flame"></div><div class="fs-loading-txt">Loading…</div></div></div>';

    let data;
    try {
      data = editMode ? await loadAllWithHidden() : await loadAll();
    } catch (err) {
      console.error('FrancisRender load error:', err);
      root.innerHTML = '<div class="fs-err">Unable to load site content. <a href="javascript:location.reload()">Retry</a></div>';
      return null;
    }

    const page = data.pages.find(p => p.slug === pageSlug);
    if (!page) {
      root.innerHTML = '<div class="fs-err">Page not found: ' + esc(pageSlug) + '</div>';
      return null;
    }

    root.innerHTML = renderPage(page, data, { editMode });
    root.dataset.editMode = editMode ? '1' : '0';

    // Wire up any template-specific interactions (tabs, accordions, etc.)
    wireInteractions(root, page, data, { editMode });

    return { root, page, data };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER PAGE — dispatches by template
     ═══════════════════════════════════════════════════════════════════════ */
  function renderPage(page, data, ctx) {
    const sections = data.sections
      .filter(s => s.page_id === page.id)
      .sort((a, b) => a.order_idx - b.order_idx);

    const template = page.template || 'hero_with_sections';
    ctx = ctx || {};

    let body;
    switch (template) {
      case 'home_nav':           body = tmplHomeNav(page, sections, data, ctx); break;
      case 'menu_tabs':          body = tmplMenuTabs(page, sections, data, ctx); break;
      case 'items_grid_page':    body = tmplItemsGridPage(page, sections, data, ctx); break;
      case 'story_chapters':     body = tmplStoryChapters(page, sections, data, ctx); break;
      case 'hero_with_sections':
      default:                   body = tmplHeroWithSections(page, sections, data, ctx); break;
    }

    // Wrap in page container with edit-mode markers
    const editClass = ctx.editMode ? ' fs-edit-mode' : '';
    return '<div class="fs-page fs-page--' + template + editClass + '" data-page-id="' + page.id + '" data-page-slug="' + escA(page.slug) + '">' + body + '</div>';
  }

  /* ═══════════════════════════════════════════════════════════════════════
     TEMPLATES — one function per template
     ═══════════════════════════════════════════════════════════════════════ */

  /* ── home_nav: navigation grid + thermometer + hero ── */
  function tmplHomeNav(page, sections, data, ctx) {
    const s = page.settings || {};
    const info = data.settings.site_info || {};
    const hours = data.settings.site_hours || {};
    const ratings = data.settings.site_ratings || {};

    let html = '';

    // Hero
    html += '<section class="fs-hero">';
    html += '<div class="fs-hero-inner">';
    if (s.hero_eyebrow) {
      html += '<div class="fs-eyebrow" ' + editAttr('page_settings', page.id, 'hero_eyebrow') + '>' + esc(s.hero_eyebrow) + '</div>';
    }
    html += '<h1 class="fs-hero-title" ' + editAttr('page_settings', page.id, 'hero_title') + '>' + richText(s.hero_title || 'The Francis Smokehouse') + '</h1>';
    if (s.hero_subtitle) {
      html += '<p class="fs-hero-sub" ' + editAttr('page_settings', page.id, 'hero_subtitle') + '>' + esc(s.hero_subtitle) + '</p>';
    }

    // Live thermometer widget (visual hook of the home page)
    html += '<div class="fs-thermo">';
    html += '  <div class="fs-thermo-tube"><div class="fs-thermo-fill" style="height:60%"></div><div class="fs-thermo-bulb"></div></div>';
    html += '  <div class="fs-thermo-readout"><div class="fs-thermo-label">PIT TEMP · LIVE</div><div class="fs-thermo-big"><span class="fs-thermo-num">225</span>°F</div><div class="fs-thermo-sub">Holding steady. Post oak &amp; hickory.</div></div>';
    html += '</div>';
    html += '</div></section>';

    // Nav grid — each section becomes a nav card
    html += '<nav class="fs-home-nav" role="navigation">';
    sections.forEach((sec, idx) => {
      const linkSlug = (sec.settings || {}).link_slug || sec.slug;
      const imgSrc = (sec.settings || {}).image || '';
      html += '<a class="fs-nav-card" href="' + escA(linkSlug ? '/' + linkSlug : '#') + '" data-section-id="' + sec.id + '">';
      html +=   '<div class="fs-nav-num">' + String(idx + 1).padStart(2, '0') + '</div>';
      if (imgSrc) html += '<div class="fs-nav-img"><img src="' + escA(imgSrc) + '" alt=""></div>';
      html +=   '<div class="fs-nav-body">';
      html +=     '<div class="fs-nav-icon" ' + editAttr('section', sec.id, 'icon') + '>' + esc(sec.icon || '•') + '</div>';
      html +=     '<h3 class="fs-nav-title" ' + editAttr('section', sec.id, 'title') + '>' + esc(sec.title) + '</h3>';
      if (sec.subtitle) {
        html +=   '<p class="fs-nav-sub" ' + editAttr('section', sec.id, 'subtitle') + '>' + esc(sec.subtitle) + '</p>';
      }
      html +=   '</div>';
      html +=   '<div class="fs-nav-arrow">→</div>';
      html += '</a>';
    });
    html += '</nav>';

    // Info strip — hours, ratings, phone
    html += '<section class="fs-info-strip">';
    if (info.phone) html += '<div class="fs-info-cell"><span class="fs-info-lbl">Call</span><a class="fs-info-val" href="tel:' + escA(info.phone.replace(/[^0-9]/g, '')) + '">' + esc(info.phone) + '</a></div>';
    if (info.address) html += '<div class="fs-info-cell"><span class="fs-info-lbl">Find Us</span><span class="fs-info-val">' + esc(info.address) + '</span></div>';
    if (hours.mon_sat) html += '<div class="fs-info-cell"><span class="fs-info-lbl">Hours</span><span class="fs-info-val">Mon–Sat ' + esc(hours.mon_sat) + ' · Sun ' + esc(hours.sun || 'Closed') + '</span></div>';
    if (ratings.google) html += '<div class="fs-info-cell"><span class="fs-info-lbl">Rated</span><span class="fs-info-val">★ ' + esc(ratings.google) + ' Google · ' + esc(ratings.tripadvisor || '') + '</span></div>';
    html += '</section>';

    return html;
  }

  /* ── menu_tabs: tabbed category menu (THE big one — 8 categories) ── */
  function tmplMenuTabs(page, sections, data, ctx) {
    const s = page.settings || {};

    let html = '';

    // Header
    html += '<header class="fs-menu-header">';
    html += '<h1 class="fs-menu-title" ' + editAttr('page', page.id, 'title') + '>' + esc(page.title) + '</h1>';
    if (s.header_subtitle) {
      html += '<div class="fs-menu-subtitle" ' + editAttr('page_settings', page.id, 'header_subtitle') + '>' + esc(s.header_subtitle) + '</div>';
    }
    html += '</header>';

    // Tab bar
    html += '<div class="fs-tabs-wrap"><div class="fs-tabs" role="tablist">';
    sections.forEach((sec, idx) => {
      const active = idx === 0 ? ' fs-tab--active' : '';
      html += '<button class="fs-tab' + active + '" data-tab-id="' + sec.id + '" role="tab">';
      html +=   '<span class="fs-tab-icon" ' + editAttr('section', sec.id, 'icon') + '>' + esc(sec.icon || '•') + '</span>';
      html +=   '<span class="fs-tab-name" ' + editAttr('section', sec.id, 'title') + '>' + esc(sec.title) + '</span>';
      html += '</button>';
    });
    html += '</div></div>';

    // Panels
    html += '<div class="fs-tab-panels">';
    sections.forEach((sec, idx) => {
      const active = idx === 0 ? ' fs-panel--active' : '';
      html += '<div class="fs-panel' + active + '" data-panel-id="' + sec.id + '" role="tabpanel">';
      html += renderSection(sec, data, ctx);
      html += '</div>';
    });
    html += '</div>';

    return html;
  }

  /* ── items_grid_page: market-style page, all items in a grid ── */
  function tmplItemsGridPage(page, sections, data, ctx) {
    const s = page.settings || {};

    let html = '';

    // Hero
    html += '<section class="fs-market-hero">';
    html += '<div class="fs-hero-inner">';
    if (s.hero_eyebrow) html += '<div class="fs-eyebrow" ' + editAttr('page_settings', page.id, 'hero_eyebrow') + '>' + esc(s.hero_eyebrow) + '</div>';
    html += '<h1 class="fs-market-title" ' + editAttr('page_settings', page.id, 'hero_title') + '>' + richText(s.hero_title || page.title) + '</h1>';
    if (s.hero_lead) html += '<p class="fs-hero-lead" ' + editAttr('page_settings', page.id, 'hero_lead') + '>' + esc(s.hero_lead) + '</p>';
    html += '</div>';
    html += '</section>';

    // All sections stacked
    html += '<div class="fs-sections">';
    sections.forEach(sec => {
      html += renderSection(sec, data, ctx);
    });
    html += '</div>';

    return html;
  }

  /* ── story_chapters: about page, chapter-style narrative ── */
  function tmplStoryChapters(page, sections, data, ctx) {
    const s = page.settings || {};
    let html = '';

    html += '<section class="fs-story-intro">';
    html += '<div class="fs-story-inner">';
    if (s.hero_eyebrow) html += '<div class="fs-eyebrow" ' + editAttr('page_settings', page.id, 'hero_eyebrow') + '>' + esc(s.hero_eyebrow) + '</div>';
    html += '<h1 class="fs-story-title" ' + editAttr('page_settings', page.id, 'hero_title') + '>' + richText(s.hero_title || page.title) + '</h1>';
    if (s.hero_lead) html += '<p class="fs-story-lead" ' + editAttr('page_settings', page.id, 'hero_lead') + '>' + esc(s.hero_lead) + '</p>';
    html += '</div></section>';

    html += '<div class="fs-chapters">';
    sections.forEach((sec, i) => {
      html += '<section class="fs-chapter fs-chapter--' + (i % 2 === 0 ? 'l' : 'r') + '" data-section-id="' + sec.id + '">';
      html += '<div class="fs-chapter-num">Chapter ' + (i + 1) + '</div>';
      html += renderSection(sec, data, ctx);
      html += '</section>';
    });
    html += '</div>';

    return html;
  }

  /* ── hero_with_sections: generic — hero + all sections stacked ── */
  function tmplHeroWithSections(page, sections, data, ctx) {
    const s = page.settings || {};
    let html = '';

    html += '<section class="fs-hero fs-hero--generic">';
    html += '<div class="fs-hero-inner">';
    if (s.hero_eyebrow) html += '<div class="fs-eyebrow" ' + editAttr('page_settings', page.id, 'hero_eyebrow') + '>' + esc(s.hero_eyebrow) + '</div>';
    html += '<h1 class="fs-hero-title" ' + editAttr('page_settings', page.id, 'hero_title') + '>' + richText(s.hero_title || page.title) + '</h1>';
    if (s.hero_subtitle) html += '<p class="fs-hero-sub" ' + editAttr('page_settings', page.id, 'hero_subtitle') + '>' + esc(s.hero_subtitle) + '</p>';
    if (s.hero_lead) html += '<p class="fs-hero-lead" ' + editAttr('page_settings', page.id, 'hero_lead') + '>' + esc(s.hero_lead) + '</p>';
    html += '</div></section>';

    html += '<div class="fs-sections">';
    sections.forEach(sec => { html += renderSection(sec, data, ctx); });
    html += '</div>';

    return html;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SECTION KINDS — one function per section kind
     ═══════════════════════════════════════════════════════════════════════ */
  function renderSection(section, data, ctx) {
    const items = data.items
      .filter(it => it.section_id === section.id)
      .sort((a, b) => a.order_idx - b.order_idx);

    const kind = section.kind || 'items_grid';
    let body;
    switch (kind) {
      case 'steps':        body = sectionSteps(section, items, ctx); break;
      case 'stats':        body = sectionStats(section, items, ctx); break;
      case 'quote_list':   body = sectionQuotes(section, items, ctx); break;
      case 'rich_text':    body = sectionRichText(section, items, ctx); break;
      case 'value_list':   body = sectionValues(section, items, ctx); break;
      case 'contact_form': body = sectionContactForm(section, items, ctx); break;
      case 'items_grid':
      default:             body = sectionItemsGrid(section, items, ctx); break;
    }

    return '<section class="fs-section fs-section--' + kind + '" data-section-id="' + section.id + '" data-section-kind="' + kind + '">' + body + '</section>';
  }

  /* Section header (title, subtitle, icon) — shared by most kinds */
  function sectionHeader(section) {
    const ss = section.settings || {};
    let html = '<header class="fs-sec-head">';
    if (ss.eyebrow) html += '<div class="fs-eyebrow" ' + editAttr('section_settings', section.id, 'eyebrow') + '>' + esc(ss.eyebrow) + '</div>';
    html += '<div class="fs-sec-head-row">';
    if (section.icon) html += '<span class="fs-sec-icon" ' + editAttr('section', section.id, 'icon') + '>' + esc(section.icon) + '</span>';
    html += '<h2 class="fs-sec-title" ' + editAttr('section', section.id, 'title') + '>' + esc(section.title) + '</h2>';
    html += '</div>';
    if (section.subtitle) html += '<p class="fs-sec-sub" ' + editAttr('section', section.id, 'subtitle') + '>' + esc(section.subtitle) + '</p>';
    if (ss.subtitle && !section.subtitle) html += '<p class="fs-sec-sub" ' + editAttr('section_settings', section.id, 'subtitle') + '>' + esc(ss.subtitle) + '</p>';
    if (ss.desc || ss.intro) html += '<p class="fs-sec-desc" ' + editAttr('section_settings', section.id, ss.desc ? 'desc' : 'intro') + '>' + esc(ss.desc || ss.intro) + '</p>';
    html += '</header>';
    return html;
  }

  /* ── items_grid — cards with img, name, price, desc ── */
  function sectionItemsGrid(section, items, ctx) {
    let html = sectionHeader(section);
    html += '<div class="fs-grid">';
    if (items.length === 0) {
      html += ctx.editMode
        ? '<div class="fs-empty">No items yet — click + to add one.</div>'
        : '<div class="fs-empty">Coming soon.</div>';
    }
    items.forEach(it => {
      const d = it.data || {};
      const sold = d.soldOut || d.sold_out;
      html += '<article class="fs-card' + (sold ? ' fs-card--sold' : '') + '" data-item-id="' + it.id + '">';
      // Image
      if (d.img || d.image) {
        html += '<div class="fs-card-img" ' + editAttr('item_data', it.id, d.img !== undefined ? 'img' : 'image') + '>';
        html += '<img src="' + escA(d.img || d.image) + '" alt="' + escA(d.name || d.title || '') + '" loading="lazy" onerror="this.style.display=\'none\'">';
        if (d.badge) html += '<span class="fs-badge fs-badge--' + escA(d.badgeStyle || 'pop') + '" ' + editAttr('item_data', it.id, 'badge') + '>' + esc(d.badge) + '</span>';
        html += '</div>';
      }
      html += '<div class="fs-card-body">';
      html += '<h3 class="fs-card-name" ' + editAttr('item_data', it.id, d.name !== undefined ? 'name' : 'title') + '>' + esc(d.name || d.title || '(unnamed)') + '</h3>';
      if (d.desc)  html += '<p class="fs-card-desc" ' + editAttr('item_data', it.id, 'desc') + '>' + esc(d.desc) + '</p>';
      if (d.pairs) html += '<p class="fs-card-pairs" ' + editAttr('item_data', it.id, 'pairs') + '><em>Pairs with:</em> ' + esc(d.pairs) + '</p>';
      if (d.note)  html += '<p class="fs-card-note" ' + editAttr('item_data', it.id, 'note') + '>' + esc(d.note) + '</p>';
      // Price row
      if (d.price != null && d.price !== '') {
        html += '<div class="fs-card-price-row">';
        html += '<span class="fs-card-price" ' + editAttr('item_data', it.id, 'price') + '>' + fmtPrice(d.price) + '</span>';
        if (d.priceLg) html += '<span class="fs-card-price-lg" ' + editAttr('item_data', it.id, 'priceLg') + '>Lg ' + fmtPrice(d.priceLg) + '</span>';
        if (d.priceUnit) html += '<span class="fs-card-price-unit" ' + editAttr('item_data', it.id, 'priceUnit') + '>' + esc(d.priceUnit) + '</span>';
        html += '</div>';
      }
      if (sold) html += '<div class="fs-sold-flag">Sold out</div>';
      html += '</div>';
      html += '</article>';
    });
    html += '</div>';
    return html;
  }

  /* ── steps — numbered list ── */
  function sectionSteps(section, items, ctx) {
    let html = sectionHeader(section);
    html += '<ol class="fs-steps">';
    items.forEach((it, i) => {
      const d = it.data || {};
      html += '<li class="fs-step" data-item-id="' + it.id + '">';
      html += '<span class="fs-step-num">' + String(i + 1).padStart(2, '0') + '</span>';
      html += '<div class="fs-step-body">';
      html += '<h3 class="fs-step-title" ' + editAttr('item_data', it.id, 'title') + '>' + esc(d.title || '(step)') + '</h3>';
      if (d.desc) html += '<p class="fs-step-desc" ' + editAttr('item_data', it.id, 'desc') + '>' + esc(d.desc) + '</p>';
      html += '</div>';
      html += '</li>';
    });
    html += '</ol>';
    return html;
  }

  /* ── stats — big numbers + labels ── */
  function sectionStats(section, items, ctx) {
    let html = sectionHeader(section);
    html += '<div class="fs-stats">';
    items.forEach(it => {
      const d = it.data || {};
      html += '<div class="fs-stat" data-item-id="' + it.id + '">';
      html += '<div class="fs-stat-num" ' + editAttr('item_data', it.id, 'num') + '>' + esc(d.num || '—') + '</div>';
      html += '<div class="fs-stat-lbl" ' + editAttr('item_data', it.id, 'label') + '>' + esc(d.label || '') + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* ── quote_list — reviews / testimonials ── */
  function sectionQuotes(section, items, ctx) {
    let html = sectionHeader(section);
    html += '<div class="fs-quotes">';
    items.forEach(it => {
      const d = it.data || {};
      html += '<figure class="fs-quote" data-item-id="' + it.id + '">';
      if (d.stars) html += '<div class="fs-quote-stars" ' + editAttr('item_data', it.id, 'stars') + '>' + esc(d.stars) + '</div>';
      html += '<blockquote class="fs-quote-text" ' + editAttr('item_data', it.id, 'text') + '>' + esc(d.text || '') + '</blockquote>';
      if (d.source) html += '<figcaption class="fs-quote-src" ' + editAttr('item_data', it.id, 'source') + '>— ' + esc(d.source) + '</figcaption>';
      html += '</figure>';
    });
    html += '</div>';
    return html;
  }

  /* ── rich_text — prose section (for hero-ish chapter content) ── */
  function sectionRichText(section, items, ctx) {
    const ss = section.settings || {};
    let html = '<div class="fs-rich">';
    if (ss.eyebrow) html += '<div class="fs-eyebrow" ' + editAttr('section_settings', section.id, 'eyebrow') + '>' + esc(ss.eyebrow) + '</div>';
    if (ss.title)   html += '<h2 class="fs-rich-title" ' + editAttr('section_settings', section.id, 'title') + '>' + richText(ss.title) + '</h2>';
    else if (section.title) html += '<h2 class="fs-rich-title" ' + editAttr('section', section.id, 'title') + '>' + esc(section.title) + '</h2>';
    if (ss.lead) html += '<p class="fs-rich-lead" ' + editAttr('section_settings', section.id, 'lead') + '>' + esc(ss.lead) + '</p>';
    if (ss.body) html += '<div class="fs-rich-body" ' + editAttr('section_settings', section.id, 'body') + '>' + richText(ss.body) + '</div>';
    if (ss.quote) {
      html += '<blockquote class="fs-rich-quote">';
      html += '<span ' + editAttr('section_settings', section.id, 'quote') + '>' + esc(ss.quote) + '</span>';
      if (ss.quote_src) html += '<cite ' + editAttr('section_settings', section.id, 'quote_src') + '>— ' + esc(ss.quote_src) + '</cite>';
      html += '</blockquote>';
    }
    if (ss.image)   html += '<div class="fs-rich-img" ' + editAttr('section_settings', section.id, 'image') + '><img src="' + escA(ss.image) + '" alt="" loading="lazy"></div>';
    if (ss.address) html += '<div class="fs-rich-addr" ' + editAttr('section_settings', section.id, 'address') + '>' + esc(ss.address) + '</div>';
    html += '</div>';
    return html;
  }

  /* ── value_list — icon + title + desc blocks ── */
  function sectionValues(section, items, ctx) {
    let html = sectionHeader(section);
    html += '<div class="fs-values">';
    items.forEach(it => {
      const d = it.data || {};
      html += '<div class="fs-value" data-item-id="' + it.id + '">';
      if (d.icon) html += '<div class="fs-value-icon" ' + editAttr('item_data', it.id, 'icon') + '>' + esc(d.icon) + '</div>';
      html += '<h3 class="fs-value-title" ' + editAttr('item_data', it.id, 'title') + '>' + esc(d.title || '') + '</h3>';
      if (d.desc) html += '<p class="fs-value-desc" ' + editAttr('item_data', it.id, 'desc') + '>' + esc(d.desc) + '</p>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* ── contact_form — simple form (submission stub) ── */
  function sectionContactForm(section, items, ctx) {
    const ss = section.settings || {};
    let html = '<div class="fs-form-wrap">';
    if (ss.title) html += '<h2 class="fs-form-title" ' + editAttr('section_settings', section.id, 'title') + '>' + richText(ss.title) + '</h2>';
    if (ss.subtitle) html += '<p class="fs-form-sub" ' + editAttr('section_settings', section.id, 'subtitle') + '>' + esc(ss.subtitle) + '</p>';
    if (ctx.editMode) {
      // In the editor, don't show a real form — show a placeholder
      html += '<div class="fs-form-placeholder">[ Contact form will render here on the live site ]</div>';
    } else {
      html += '<form class="fs-form" data-form-email-to="' + escA(ss.email_to || '') + '" onsubmit="return window.FrancisRender.handleFormSubmit(event)">';
      html += '  <label>Name<input type="text" name="name" required></label>';
      html += '  <label>Email<input type="email" name="email" required></label>';
      html += '  <label>Phone<input type="tel" name="phone"></label>';
      html += '  <label>Message<textarea name="message" rows="4" required></textarea></label>';
      html += '  <button type="submit">Send</button>';
      html += '</form>';
      html += '<div class="fs-form-success" hidden><h3 ' + editAttr('section_settings', section.id, 'success_title') + '>' + richText(ss.success_title || 'Thanks!') + '</h3><p ' + editAttr('section_settings', section.id, 'success_sub') + '>' + esc(ss.success_sub || 'We\'ll be in touch soon.') + '</p></div>';
    }
    html += '</div>';
    return html;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INTERACTIONS — wire up tabs, form submission, etc. (non-editor-specific)
     ═══════════════════════════════════════════════════════════════════════ */
  function wireInteractions(root, page, data, ctx) {
    // Tabs (menu_tabs template)
    const tabs = root.querySelectorAll('.fs-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tabId;
        root.querySelectorAll('.fs-tab').forEach(t => t.classList.toggle('fs-tab--active', t.dataset.tabId === tabId));
        root.querySelectorAll('.fs-panel').forEach(p => p.classList.toggle('fs-panel--active', p.dataset.panelId === tabId));
      });
    });

    // Home thermometer live updates
    const thermoNum = root.querySelector('.fs-thermo-num');
    const thermoFill = root.querySelector('.fs-thermo-fill');
    if (thermoNum && thermoFill) {
      const update = () => {
        const t = Math.round(225 + (Math.random() - 0.5) * 8);
        thermoNum.textContent = t;
        thermoFill.style.height = Math.max(20, Math.min(90, ((t - 75) / (350 - 75)) * 100)) + '%';
      };
      setInterval(update, 3200);
    }
  }

  // Contact form submission stub
  FrancisRender.handleFormSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    form.querySelector('.fs-form-success')?.removeAttribute('hidden');
    form.reset();
    // TODO: POST to Apps Script relay (same pattern as Hot Headz)
    return false;
  };

})(typeof window !== 'undefined' ? window : this);
