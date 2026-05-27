/* ═══════════════════════════════════════════════════════════
   CHROME RENDERER — used by menu.html and market.html.
   Renders chrome_top + chrome_bottom around the existing
   menu/market grid. Also handles edit mode for the editor's
   iframe (?edit=1).

   Requires: supabase.js (loadPage, loadBusiness), page-engine.js
   Set window.PAGE_ID before this script loads.
═══════════════════════════════════════════════════════════ */
(function(){
  const PAGE_ID = window.PAGE_ID || 'menu';
  const IS_EDIT = new URLSearchParams(location.search).get('edit') === '1';

  function postToParent(type, payload){
    if (!window.parent || window.parent === window) return;
    try { window.parent.postMessage({ source:'fs-page-editor', type, payload }, '*'); } catch {}
  }

  // Inject all the section-engine CSS so chrome sections look right
  function bootEngineCss(){
    const eng = window.__fsPageEngine;
    if (!eng) return;
    eng.injectStyleEngineCss();
    eng.injectPageHeaderCss();
    eng.injectExtraSectionStyles();
  }

  function renderChrome(page, biz){
    const eng = window.__fsPageEngine;
    if (!eng) {
      console.warn('[chrome] page-engine.js not loaded');
      return;
    }
    const topRoot = document.getElementById('page-chrome-top');
    const botRoot = document.getElementById('page-chrome-bottom');
    const top = Array.isArray(page.chrome_top) ? page.chrome_top : [];
    const bot = Array.isArray(page.chrome_bottom) ? page.chrome_bottom : [];

    function renderInto(root, list){
      if (!root) return;
      // In edit mode: render all sections, including hidden (dimmed)
      // In live mode: skip hidden
      const visible = IS_EDIT ? list : list.filter(s => !s.hidden);
      root.innerHTML = visible.map(s => {
        let html = eng.renderSection(s, biz);
        if (IS_EDIT && s.hidden) {
          html = html.replace(/^(\s*<section[^>]*)/, '$1 data-hidden="1"');
        }
        return html;
      }).join('');
      // Hidden badges
      if (IS_EDIT) {
        root.querySelectorAll('[data-hidden="1"]').forEach(el => {
          el.style.opacity = '.4';
          el.style.position = 'relative';
          el.insertAdjacentHTML('afterbegin', '<div style="position:absolute;top:8px;left:8px;background:#1a1108;color:#dcbe94;padding:4px 10px;border:1px solid rgba(220,190,148,.25);border-radius:4px;font-family:var(--cond);font-size:9px;letter-spacing:.2em;text-transform:uppercase;z-index:50">Hidden</div>');
        });
      }
    }

    renderInto(topRoot, top);
    renderInto(botRoot, bot);

    // Reveal animations — mark already-in-viewport elements as .in
    if (typeof IntersectionObserver !== 'undefined') {
      const fade = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }});
      }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
        else fade.observe(el);
      });
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }

    // In edit mode, set up the section interactions on chrome sections
    if (IS_EDIT) {
      setupChromeEditMode(page);
    }
  }

  function setupChromeEditMode(page){
    const eng = window.__fsPageEngine;
    if (!eng) return;
    // Tag each chrome section with its id
    const top = Array.isArray(page.chrome_top) ? page.chrome_top : [];
    const bot = Array.isArray(page.chrome_bottom) ? page.chrome_bottom : [];
    const topEls = document.querySelectorAll('#page-chrome-top > section');
    const botEls = document.querySelectorAll('#page-chrome-bottom > section');
    top.forEach((s, i) => {
      const el = topEls[i];
      if (el) { el.setAttribute('data-section-id', s.id); el.setAttribute('data-section-type', s.type); el.classList.add('fs-edit-section'); }
    });
    bot.forEach((s, i) => {
      const el = botEls[i];
      if (el) { el.setAttribute('data-section-id', s.id); el.setAttribute('data-section-type', s.type); el.classList.add('fs-edit-section'); }
    });
    // Run the engine's setupEditMode on the whole document
    eng.setupEditMode();
  }

  let LAST_PAGE = null;
  let LAST_BIZ = null;

  async function bootLive(){
    bootEngineCss();
    try {
      const [page, biz] = await Promise.all([
        loadPage(PAGE_ID),
        typeof loadBusiness === 'function' ? loadBusiness() : null
      ]);
      LAST_PAGE = page; LAST_BIZ = biz;
      renderChrome(page, biz);
    } catch(e) {
      console.warn('[chrome] live boot failed:', e);
    }
  }

  function bootEdit(){
    bootEngineCss();
    document.body.classList.add('fs-edit');
    const badge = document.createElement('div');
    badge.className = 'fs-edit-hidden';
    badge.textContent = 'Edit Mode';
    document.body.appendChild(badge);
    console.log('[chrome-iframe] ready — posting to parent');
    postToParent('ready', { page: PAGE_ID });
  }

  // Listen for messages from parent editor (edit mode only)
  if (IS_EDIT) {
    window.addEventListener('message', e => {
      const m = e.data;
      if (!m || m.source !== 'fs-page-editor-parent') return;
      console.log('[chrome-iframe] received', m.type);
      if (m.type === 'load-page') {
        LAST_PAGE = m.payload.page;
        LAST_BIZ = m.payload.business;
        renderChrome(LAST_PAGE, LAST_BIZ);
      }
    });
  }

  window.__fsBootChrome = function(){
    if (IS_EDIT) bootEdit();
    else bootLive();
  };
})();
