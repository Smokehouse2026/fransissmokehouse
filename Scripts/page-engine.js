/* ═══════════════════════════════════════════════════════════
   PAGE ENGINE — shared across all section-based pages.
   Usage:
     <script>window.PAGE_ID = 'catering';</script>
     <script src="path/to/page-engine.js"></script>
     <script>window.__fsBootPageEngine();</script>
   Requires supabase.js to be loaded first (loadPage, loadBusiness).
═══════════════════════════════════════════════════════════ */
(function(){
/* ═══════════════════════════════════════════════════════════
   PAGE RENDERER — loads page from Supabase and builds DOM
═══════════════════════════════════════════════════════════ */
const PAGE_ID = window.PAGE_ID || 'catering';

function escHtml(s){ return String(s||'').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }
/** Convert *word* to <em>word</em> within already-escaped text. */
function emFormat(s){ return escHtml(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); }

/* ═══════════════════════════════════════════════════════════
   STYLE ENGINE — turns step-based values + colors into CSS vars
═══════════════════════════════════════════════════════════ */
const COLOR_PALETTE = {
  default:  '',                       // no override
  bg:       'var(--void)',
  panel:    'rgba(22,12,4,.85)',
  dark:     '#0a0604',
  text:     'var(--cream)',
  parch:    'var(--parch)',
  sand:     'var(--sand)',
  flame:    'var(--flame)',
  ember:    'var(--ember)',
  glow:     'var(--glow)',
  fire:     'var(--fire)',
  white:    '#ffffff',
  transparent: 'transparent'
};
const SIZE_MAP_TEXT = {
  xs:  'clamp(10px, 0.9vw, 12px)',
  sm:  'clamp(12px, 1.1vw, 14px)',
  md:  'clamp(14px, 1.4vw, 17px)',
  lg:  'clamp(17px, 2vw, 22px)',
  xl:  'clamp(22px, 3vw, 32px)',
  '2xl':'clamp(32px, 5vw, 56px)',
  '3xl':'clamp(44px, 7vw, 80px)',
  '4xl':'clamp(56px, 9vw, 110px)'
};
const PAD_MAP = {
  none:'0', sm:'clamp(20px,3vh,30px)', md:'clamp(40px,6vh,60px)',
  lg:'clamp(60px,10vh,100px)', xl:'clamp(80px,14vh,140px)'
};
const RADIUS_MAP = { none:'0', sm:'4px', md:'8px', lg:'14px', pill:'9999px', circle:'50%' };
const BORDER_MAP = { none:'none', subtle:'1px solid rgba(196,160,112,.18)', strong:'2px solid rgba(196,160,112,.42)' };
const WIDTH_MAP  = { default:'1100px', narrow:'720px', medium:'900px', wide:'1300px', full:'100%' };
const ALIGN_MAP  = { left:'left', center:'center', right:'right' };
const GAP_MAP    = { tight:'8px', normal:'14px', loose:'24px' };

/** Resolve a palette key OR a custom hex/rgba into a CSS color value. */
function resolveColor(v){
  if (!v) return '';
  if (COLOR_PALETTE[v] !== undefined) return COLOR_PALETTE[v];
  return v; // assume raw color value (hex, rgba, etc.)
}

/** Build a CSS variable declaration string from an element style object.
 *  Returns "--fs-text-size:...; --fs-text-color:...;" etc. Used inline on the element. */
function elementStyleVars(style){
  if (!style || typeof style !== 'object') return '';
  const parts = [];
  if (style.size && SIZE_MAP_TEXT[style.size])      parts.push(`--fs-text-size:${SIZE_MAP_TEXT[style.size]}`);
  if (style.color)                                   parts.push(`--fs-text-color:${resolveColor(style.color)}`);
  if (style.align && ALIGN_MAP[style.align])         parts.push(`--fs-text-align:${ALIGN_MAP[style.align]}`);
  if (style.bg)                                      parts.push(`--fs-bg:${resolveColor(style.bg)}`);
  if (style.pad_top   && PAD_MAP[style.pad_top]   !== undefined) parts.push(`--fs-pad-top:${PAD_MAP[style.pad_top]}`);
  if (style.pad_bot   && PAD_MAP[style.pad_bot]   !== undefined) parts.push(`--fs-pad-bot:${PAD_MAP[style.pad_bot]}`);
  if (style.pad_left  && PAD_MAP[style.pad_left]  !== undefined) parts.push(`--fs-pad-left:${PAD_MAP[style.pad_left]}`);
  if (style.pad_right && PAD_MAP[style.pad_right] !== undefined) parts.push(`--fs-pad-right:${PAD_MAP[style.pad_right]}`);
  if (style.radius && RADIUS_MAP[style.radius] !== undefined)   parts.push(`--fs-radius:${RADIUS_MAP[style.radius]}`);
  if (style.border && BORDER_MAP[style.border] !== undefined)   parts.push(`--fs-border:${BORDER_MAP[style.border]}`);
  if (style.max_width && WIDTH_MAP[style.max_width] !== undefined) parts.push(`--fs-max-width:${WIDTH_MAP[style.max_width]}`);
  if (style.gap && GAP_MAP[style.gap] !== undefined)            parts.push(`--fs-gap:${GAP_MAP[style.gap]}`);
  if (style.width_pct)                                          parts.push(`--fs-width:${style.width_pct}%`);
  if (style.height_mode === 'short')      parts.push(`--fs-height:200px`);
  else if (style.height_mode === 'tall')  parts.push(`--fs-height:480px`);
  else if (style.height_mode === 'cover') parts.push(`--fs-height:100vh`);
  return parts.length ? parts.join(';') + ';' : '';
}

/** Inject the CSS that makes the --fs-* variables actually do something. Idempotent. */
function injectStyleEngineCss(){
  if (document.getElementById('fs-style-engine-css')) return;
  const css = `
  [data-style-id]{
    font-size:var(--fs-text-size,inherit);
    color:var(--fs-text-color,inherit);
    text-align:var(--fs-text-align,inherit);
    background:var(--fs-bg,transparent);
    padding-top:var(--fs-pad-top,0);
    padding-bottom:var(--fs-pad-bot,0);
    padding-left:var(--fs-pad-left,0);
    padding-right:var(--fs-pad-right,0);
    border-radius:var(--fs-radius,inherit);
    border:var(--fs-border,initial);
    width:var(--fs-width,auto);
    max-width:var(--fs-max-width,none);
  }
  /* Section-level styling */
  [data-section-style]{
    background:var(--fs-sec-bg,transparent);
    padding-top:var(--fs-sec-pad-top,clamp(60px,10vh,100px));
    padding-bottom:var(--fs-sec-pad-bot,clamp(60px,10vh,100px));
    background-image:var(--fs-sec-bg-image,none);
    background-size:cover;
    background-position:center;
  }
  [data-section-style] .sec-inner{
    max-width:var(--fs-sec-width,1100px);
  }
  /* Section-style overrides for top-divider visibility */
  [data-section-style][data-divider="off"]{border-top:none !important}
  /* Image element width pct + height mode */
  img[data-style-id]{
    width:var(--fs-width,100%);
    height:var(--fs-height,auto);
    object-fit:cover;
  }
  `;
  const s = document.createElement('style');
  s.id = 'fs-style-engine-css';
  s.textContent = css;
  document.head.appendChild(s);
}

/** Build an attribute string `data-style-id="x" style="--fs-...:..."` for an element.
 *  styles object is the section's element_styles. */
function styleAttrs(key, styles){
  const s = styles?.[key];
  const styleStr = elementStyleVars(s);
  return `data-style-id="${key}"${styleStr ? ` style="${styleStr}"` : ''}`;
}

/** Build the section-level style string for the outer <section> element. */
function sectionStyleAttrs(sectionStyle){
  if (!sectionStyle || typeof sectionStyle !== 'object') return 'data-section-style';
  const parts = [];
  if (sectionStyle.bg)        parts.push(`--fs-sec-bg:${resolveColor(sectionStyle.bg)}`);
  if (sectionStyle.bg_image)  parts.push(`--fs-sec-bg-image:url('${String(sectionStyle.bg_image).replace(/'/g,"\\'")}')`);
  if (sectionStyle.padding_top    && PAD_MAP[sectionStyle.padding_top]    !== undefined) parts.push(`--fs-sec-pad-top:${PAD_MAP[sectionStyle.padding_top]}`);
  if (sectionStyle.padding_bottom && PAD_MAP[sectionStyle.padding_bottom] !== undefined) parts.push(`--fs-sec-pad-bot:${PAD_MAP[sectionStyle.padding_bottom]}`);
  if (sectionStyle.width      && WIDTH_MAP[sectionStyle.width]   !== undefined) parts.push(`--fs-sec-width:${WIDTH_MAP[sectionStyle.width]}`);
  const styleStr = parts.length ? ` style="${parts.join(';')}"` : '';
  const divider = sectionStyle.divider_top === false ? ' data-divider="off"' : '';
  return `data-section-style${divider}${styleStr}`;
}

/* ═══════════════════════════════════════════════════════════
   SECTION RENDERERS — each takes (props, biz, styles) and returns HTML
   Styles is the section's element_styles object — keyed by element id.
═══════════════════════════════════════════════════════════ */
const SECTION_RENDERERS = {
  page_header(p, biz){
    const useBrand = p.use_business_brand !== false;
    const brandName  = useBrand ? (biz?.name || 'The Francis Smokehouse')  : (p.brand_text || '');
    const brandEm    = useBrand ? 'Smokehouse'                              : (p.brand_text_em || '');
    // For "Smokehouse" emphasis on the auto brand, split known business names
    let brandHtml = '';
    if (useBrand && brandName) {
      // Split at the last word, italicize it
      const parts = brandName.trim().split(/\s+/);
      if (parts.length > 1) {
        brandHtml = parts.slice(0, -1).join(' ') + ' <em>' + parts[parts.length - 1] + '</em>';
      } else {
        brandHtml = escHtml(brandName);
      }
    } else if (p.brand_text || p.brand_text_em) {
      brandHtml = escHtml(p.brand_text || '') + (p.brand_text_em ? ' <em>' + escHtml(p.brand_text_em) + '</em>' : '');
    }
    const tagline = (p.use_business_tagline !== false)
      ? '& Specialty Meats · St. Francisville, LA'
      : (p.tagline_text || '');
    return `
      <section class="page-header-sec">
        <a class="ph-back" href="${escHtml(p.back_href||'../index.html')}" ${styleAttrs('back_text', p.__styles)}>${escHtml(p.back_text||'← Back')}</a>
        <div class="ph-center">
          <a class="ph-brand" href="${escHtml(p.back_href||'../index.html')}" ${styleAttrs('brand', p.__styles)}>${brandHtml || '<span style="opacity:.4">(brand)</span>'}</a>
          ${tagline ? `<div class="ph-sub" ${styleAttrs('tagline', p.__styles)}>${escHtml(tagline)}</div>` : ''}
        </div>
        <a class="ph-right" href="${escHtml(p.right_href||'../menu.html')}" ${styleAttrs('right_text', p.__styles)}>${escHtml(p.right_text||'See Menu →')}</a>
      </section>
    `;
  },

  hero(p, biz){
    const phone = biz?.phone || '';
    const fbUrl = biz?.socials?.facebook || '';
    const hoursLabel = biz?.hours_label || '';
    const titleHtml = (Array.isArray(p.title_lines) ? p.title_lines : []).map(l => emFormat(l)).join('<br>');
    const primaryHref = p.cta_primary_use_phone && phone ? `tel:${phone.replace(/[^0-9+]/g,'')}` : (p.cta_primary_href || '#');
    const secondaryHref = p.cta_secondary_use_facebook && fbUrl ? fbUrl : (p.cta_secondary_href || '#');
    const styles = p.__styles || {};
    return `
      <section id="hero">
        ${p.ghost ? `<div id="hero-ghost" ${styleAttrs('ghost', styles)}>${escHtml(p.ghost)}</div>` : ''}
        <div id="hero-left">
          ${p.eyebrow ? `<div id="hero-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          <h1 id="hero-title" ${styleAttrs('title_lines', styles)}>${titleHtml}</h1>
          <div id="hero-rule"></div>
          ${p.lead ? `<p id="hero-lead" ${styleAttrs('lead', styles)}>${escHtml(p.lead)}</p>` : ''}
        </div>
        <div id="hero-right">
          ${p.card_label ? `<div class="hc-label" ${styleAttrs('card_label', styles)}>${escHtml(p.card_label)}</div>` : ''}
          ${p.card_title ? `<div class="hc-title" ${styleAttrs('card_title', styles)}>${escHtml(p.card_title)}</div>` : ''}
          ${p.card_sub ? `<div class="hc-sub" ${styleAttrs('card_sub', styles)}>${escHtml(p.card_sub)}</div>` : ''}
          <div class="hc-contact-row">
            ${phone ? `<div class="hc-row"><div class="hc-icon">📞</div><div class="hc-info"><span class="hc-info-label">Phone</span><span class="hc-info-val">${escHtml(phone)}</span></div></div>` : ''}
            ${fbUrl ? `<div class="hc-row"><div class="hc-icon">📘</div><div class="hc-info"><span class="hc-info-label">Facebook</span><span class="hc-info-val">${escHtml(biz?.name || 'Message us')}</span></div></div>` : ''}
            ${hoursLabel ? `<div class="hc-row"><div class="hc-icon">🕙</div><div class="hc-info"><span class="hc-info-label">Hours</span><span class="hc-info-val">${escHtml(hoursLabel)}</span></div></div>` : ''}
          </div>
          ${p.cta_primary_text ? `<a href="${escHtml(primaryHref)}" class="btn-fire" ${styleAttrs('cta_primary_text', styles)}>${escHtml(p.cta_primary_text)}${p.cta_primary_use_phone && phone ? ` — ${escHtml(phone)}` : ''}</a>` : ''}
          ${p.cta_secondary_text ? `<a href="${escHtml(secondaryHref)}" target="_blank" rel="noopener" class="btn-ghost" ${styleAttrs('cta_secondary_text', styles)}>${escHtml(p.cta_secondary_text)}</a>` : ''}
        </div>
      </section>
    `;
  },

  hero_image(p, biz){
    const styles = p.__styles || {};
    const titleHtml = (Array.isArray(p.title_lines) ? p.title_lines : []).map(l => emFormat(l)).join('<br>');
    return `
      <section class="hero-image-section">
        <div class="hi-bg" style="${p.image ? `background-image:url('${escHtml(p.image)}')` : ''}"></div>
        <div class="hi-overlay"></div>
        <div class="hi-content">
          ${p.eyebrow ? `<div class="hi-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : `<div class="hi-eyebrow" ${styleAttrs('eyebrow', styles)}></div>`}
          <h1 class="hi-title" ${styleAttrs('title_lines', styles)}>${titleHtml || '<span style="opacity:.4">(add a title)</span>'}</h1>
          ${p.lead ? `<p class="hi-lead" ${styleAttrs('lead', styles)}>${escHtml(p.lead)}</p>` : `<p class="hi-lead" ${styleAttrs('lead', styles)}></p>`}
        </div>
      </section>
    `;
  },

  feature_grid(p){
    const styles = p.__styles || {};
    const items = (p.items || []).map((it, i) => `
      <div class="offer-card reveal">
        ${it.icon ? `<div class="oc-icon" ${styleAttrs(`items.${i}.icon`, styles)}>${escHtml(it.icon)}</div>` : ''}
        <div class="oc-title" ${styleAttrs(`items.${i}.title`, styles)}>${escHtml(it.title)}</div>
        ${it.desc ? `<div class="oc-desc" ${styleAttrs(`items.${i}.desc`, styles)}>${escHtml(it.desc)}</div>` : ''}
        ${it.tag ? `<div class="oc-tag" ${styleAttrs(`items.${i}.tag`, styles)}>${escHtml(it.tag)}</div>` : ''}
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="offer-grid">${items}</div>
        </div>
      </section>
    `;
  },

  dotted_list(p){
    const styles = p.__styles || {};
    const items = (p.items || []).map((it, i) => `
      <div class="mo-item reveal">
        <div class="mo-dot"></div>
        <div class="mo-text">
          <div class="mo-name" ${styleAttrs(`items.${i}.name`, styles)}>${escHtml(it.name)}</div>
          ${it.desc ? `<div class="mo-desc" ${styleAttrs(`items.${i}.desc`, styles)}>${escHtml(it.desc)}</div>` : ''}
        </div>
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="menu-opts">${items}</div>
        </div>
      </section>
    `;
  },

  steps(p){
    const styles = p.__styles || {};
    const items = (p.items || []).map((it, i) => `
      <div class="step-item reveal">
        <div class="step-num">${String(i+1).padStart(2,'0')}</div>
        <div class="step-title" ${styleAttrs(`items.${i}.title`, styles)}>${escHtml(it.title)}</div>
        ${it.desc ? `<div class="step-desc" ${styleAttrs(`items.${i}.desc`, styles)}>${escHtml(it.desc)}</div>` : ''}
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="steps">${items}</div>
        </div>
      </section>
    `;
  },

  testimonials(p){
    const styles = p.__styles || {};
    const stars5 = n => '★'.repeat(Math.max(0, Math.min(5, n||5)));
    const items = (p.items || []).map((it, i) => `
      <div class="t-card reveal">
        <div class="t-stars">${stars5(it.stars)}</div>
        ${it.quote ? `<p class="t-quote" ${styleAttrs(`items.${i}.quote`, styles)}>${escHtml(it.quote)}</p>` : ''}
        ${it.source ? `<div class="t-src" ${styleAttrs(`items.${i}.source`, styles)}>${escHtml(it.source)}</div>` : ''}
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="testimonials">${items}</div>
        </div>
      </section>
    `;
  },

  image_text(p){
    const styles = p.__styles || {};
    const reversed = p.image_side === 'right';
    return `
      <section class="section">
        <div class="sec-inner it-wrap${reversed ? ' it-rev' : ''}">
          <div class="it-image">
            ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.image_alt||'')}" ${styleAttrs('image', styles)}>` : '<div class="it-image-empty">(add an image)</div>'}
          </div>
          <div class="it-text">
            ${p.eyebrow ? `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}></div>`}
            <h2 class="sec-title" ${styleAttrs('title', styles)}>${emFormat(p.title || '')}</h2>
            <div class="it-body" ${styleAttrs('body', styles)}>${escHtml(p.body || '').replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </section>
    `;
  },

  gallery(p){
    const styles = p.__styles || {};
    const items = (p.items || []).map((it, i) => `
      <div class="gal-item">
        ${it.image ? `<img src="${escHtml(it.image)}" alt="${escHtml(it.caption||'')}" loading="lazy" ${styleAttrs(`items.${i}.image`, styles)}>` : '<div class="gal-item-empty">image</div>'}
        ${it.caption ? `<div class="gal-cap" ${styleAttrs(`items.${i}.caption`, styles)}>${escHtml(it.caption)}</div>` : ''}
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}></div>`}
          ${p.title ? `<h2 class="sec-title" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : `<h2 class="sec-title" ${styleAttrs('title', styles)}></h2>`}
          ${p.subtitle ? `<p class="sec-sub" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="gallery-grid">${items || '<div class="gal-item-empty" style="padding:60px;text-align:center;width:100%">No images yet</div>'}</div>
        </div>
      </section>
    `;
  },

  faq(p){
    const styles = p.__styles || {};
    const items = (p.items || []).map((it, i) => `
      <details class="faq-item" ${i === 0 ? 'open' : ''}>
        <summary class="faq-q" ${styleAttrs(`items.${i}.q`, styles)}>${escHtml(it.q || '')}</summary>
        <div class="faq-a" ${styleAttrs(`items.${i}.a`, styles)}>${escHtml(it.a || '').replace(/\n/g, '<br>')}</div>
      </details>
    `).join('');
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}></div>`}
          ${p.title ? `<h2 class="sec-title" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : `<h2 class="sec-title" ${styleAttrs('title', styles)}></h2>`}
          ${p.subtitle ? `<p class="sec-sub" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="faq-list">${items}</div>
        </div>
      </section>
    `;
  },

  video(p){
    const styles = p.__styles || {};
    let embedUrl = '';
    if (p.url) {
      const url = String(p.url).trim();
      let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (m) embedUrl = `https://www.youtube.com/embed/${m[1]}`;
      else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) embedUrl = `https://www.youtube.com/embed/${url}`;
      else {
        m = url.match(/vimeo\.com\/(\d+)/);
        if (m) embedUrl = `https://player.vimeo.com/video/${m[1]}`;
      }
    }
    return `
      <section class="section">
        <div class="sec-inner">
          ${p.eyebrow ? `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : `<div class="sec-eyebrow" ${styleAttrs('eyebrow', styles)}></div>`}
          ${p.title ? `<h2 class="sec-title" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : `<h2 class="sec-title" ${styleAttrs('title', styles)}></h2>`}
          ${p.subtitle ? `<p class="sec-sub" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          <div class="video-wrap">
            ${embedUrl
              ? `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              : '<div class="video-empty">(paste a YouTube or Vimeo URL)</div>'}
          </div>
        </div>
      </section>
    `;
  },

  divider(p){
    const styles = p.__styles || {};
    return `
      <section class="divider-section">
        <div class="sec-inner">
          <div class="divider-line"></div>
          ${p.label ? `<div class="divider-label" ${styleAttrs('label', styles)}>${escHtml(p.label)}</div><div class="divider-line"></div>` : ''}
        </div>
      </section>
    `;
  },

  cta_phone(p, biz){
    const styles = p.__styles || {};
    const phone = biz?.phone || '';
    const fbUrl = biz?.socials?.facebook || '';
    const hoursLabel = biz?.hours_label || '';
    const titleHtml = (Array.isArray(p.title_lines) ? p.title_lines : []).map(l => emFormat(l)).join('<br>');
    const phoneHref = p.use_business_phone && phone ? `tel:${phone.replace(/[^0-9+]/g,'')}` : (p.phone_href || '#');
    const prepItems = Array.isArray(p.prep_items) ? p.prep_items : [];
    return `
      <section id="cta-section">
        <div class="cta-wrap">
          ${p.eyebrow ? `<div class="cta-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          <h2 class="cta-title reveal" ${styleAttrs('title_lines', styles)}>${titleHtml}</h2>
          ${p.subtitle ? `<p class="cta-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
          ${phone ? `<a href="${escHtml(phoneHref)}" class="big-call-btn reveal"><span class="phone-emoji">${escHtml(p.button_emoji||'📞')}</span><span>${escHtml(phone)}</span></a>` : ''}
          ${hoursLabel ? `<div class="cta-hours reveal"><span class="cta-hours-dot"></span><span>${escHtml(hoursLabel)}</span></div>` : ''}
          ${prepItems.length ? `<div class="cta-prep reveal"><div class="cta-prep-title">Have this ready when you call</div><ul class="cta-prep-list">${prepItems.map((it,i) => `<li ${styleAttrs(`prep_items.${i}`, styles)}>${escHtml(it)}</li>`).join('')}</ul></div>` : ''}
          ${p.use_business_facebook && fbUrl ? `<div class="cta-or-fb reveal">or</div><a href="${escHtml(fbUrl)}" target="_blank" rel="noopener" class="cta-fb-btn reveal" ${styleAttrs('facebook_text', styles)}><span>📘</span><span>${escHtml(p.facebook_text||'Message us on Facebook')}</span></a>` : ''}
        </div>
      </section>
    `;
  }
};

/* ─── ADDITIONAL SECTION RENDERERS — Find Us, About, Story, Gift Cards ─── */

SECTION_RENDERERS.info_grid = function(p, biz){
  const styles = p.__styles || {};
  const items = (p.items || []).map((it, i) => `
    <div class="info-card-block reveal${it.highlight ? ' highlight' : ''}">
      ${it.icon ? `<div class="ic-icon" ${styleAttrs(`items.${i}.icon`, styles)}>${escHtml(it.icon)}</div>` : ''}
      ${it.label ? `<div class="ic-label" ${styleAttrs(`items.${i}.label`, styles)}>${escHtml(it.label)}</div>` : ''}
      ${it.title ? `<div class="ic-title" ${styleAttrs(`items.${i}.title`, styles)}>${escHtml(it.title)}</div>` : ''}
      ${it.body ? `<div class="ic-body" ${styleAttrs(`items.${i}.body`, styles)}>${escHtml(it.body).replace(/\n/g, '<br>')}</div>` : ''}
      ${it.action_text && it.action_href ? `<a href="${escHtml(it.action_href)}" class="ic-action" ${it.action_target === 'blank' ? 'target="_blank" rel="noopener"' : ''} ${styleAttrs(`items.${i}.action_text`, styles)}>${escHtml(it.action_text)}</a>` : ''}
    </div>
  `).join('');
  return `
    <section class="section">
      <div class="sec-inner">
        ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
        ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
        ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
        <div class="info-grid">${items}</div>
      </div>
    </section>
  `;
};

SECTION_RENDERERS.map_embed = function(p, biz){
  const styles = p.__styles || {};
  const embedUrl = p.embed_url || '';
  const dirHref = p.directions_href || '#';
  return `
    <section class="map-embed-section">
      <div class="map-frame-wrap">
        ${embedUrl
          ? `<iframe src="${escHtml(embedUrl)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map"></iframe>`
          : '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(196,160,112,.4);font-family:var(--cond);font-size:11px;letter-spacing:.18em;text-transform:uppercase">(add a Google Maps embed URL)</div>'}
        ${p.cta_text ? `<a href="${escHtml(dirHref)}" target="_blank" rel="noopener" class="map-cta" ${styleAttrs('cta_text', styles)}>${escHtml(p.cta_text)}</a>` : ''}
      </div>
    </section>
  `;
};

SECTION_RENDERERS.directions_columns = function(p, biz){
  const styles = p.__styles || {};
  const fromList = (p.from_items || []).map((it, i) => `
    <div class="from-item reveal">
      <div class="from-dot"></div>
      <div>
        <div class="from-name" ${styleAttrs(`from_items.${i}.name`, styles)}>${escHtml(it.name||'')}</div>
        <div class="from-dir" ${styleAttrs(`from_items.${i}.dir`, styles)}>${escHtml(it.dir||'')}</div>
        ${it.dist ? `<div class="from-dist" ${styleAttrs(`from_items.${i}.dist`, styles)}>${escHtml(it.dist)}</div>` : ''}
      </div>
    </div>
  `).join('');
  const landmarks = (p.landmarks || []).map((it, i) => `
    <div class="lm-item">
      ${it.icon ? `<div class="lm-icon">${escHtml(it.icon)}</div>` : ''}
      <div class="lm-text" ${styleAttrs(`landmarks.${i}.text`, styles)}>${escHtml(it.text||'').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</div>
    </div>
  `).join('');
  return `
    <section class="dir-cols-section">
      <div class="dir-cols-inner">
        <div class="dir-col">
          ${p.left_eyebrow ? `<h3 class="reveal" ${styleAttrs('left_eyebrow', styles)}>${escHtml(p.left_eyebrow)}</h3>` : ''}
          ${p.left_title ? `<h2 class="reveal" ${styleAttrs('left_title', styles)}>${emFormat(p.left_title)}</h2>` : ''}
          <div class="from-list">${fromList}</div>
        </div>
        <div class="dir-col">
          ${p.right_eyebrow ? `<h3 class="reveal" ${styleAttrs('right_eyebrow', styles)}>${escHtml(p.right_eyebrow)}</h3>` : ''}
          ${p.right_title ? `<h2 class="reveal" ${styleAttrs('right_title', styles)}>${emFormat(p.right_title)}</h2>` : ''}
          ${p.right_body ? `<div class="lm-text reveal" style="margin-bottom:18px" ${styleAttrs('right_body', styles)}>${escHtml(p.right_body)}</div>` : ''}
          <div class="landmarks">${landmarks}</div>
        </div>
      </div>
    </section>
  `;
};

SECTION_RENDERERS.narrative = function(p, biz){
  const styles = p.__styles || {};
  const flip = p.flip ? ' flip' : '';
  const num = p.chapter_num ? String(p.chapter_num).padStart(2, '0') : '';
  const paragraphs = (p.paragraphs || []).map((para, i) =>
    `<p class="nc-text reveal" ${styleAttrs(`paragraphs.${i}`, styles)}>${escHtml(para).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>`
  ).join('');
  const values = (p.values || []).map((v, i) => `
    <div class="nc-val">
      ${v.icon ? `<div class="nc-val-icon">${escHtml(v.icon)}</div>` : ''}
      <div class="nc-val-title" ${styleAttrs(`values.${i}.title`, styles)}>${escHtml(v.title||'')}</div>
      <div class="nc-val-desc" ${styleAttrs(`values.${i}.desc`, styles)}>${escHtml(v.desc||'').replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');
  const stats = (p.stats || []).map((s, i) => `
    <div class="nc-stat">
      <div class="nc-stat-num" ${styleAttrs(`stats.${i}.num`, styles)}>${escHtml(s.num||'')}</div>
      <div class="nc-stat-label" ${styleAttrs(`stats.${i}.label`, styles)}>${escHtml(s.label||'').replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');
  const pull = p.pull_text ? `
    <div class="nc-pull reveal">
      <div class="nc-pull-text" ${styleAttrs('pull_text', styles)}>${escHtml(p.pull_text)}</div>
      ${p.pull_source ? `<div class="nc-pull-source" ${styleAttrs('pull_source', styles)}>${escHtml(p.pull_source)}</div>` : ''}
    </div>
  ` : '';
  return `
    <section class="narrative-section">
      <div class="nc-inner${flip}">
        ${num ? `<div class="nc-num reveal">${num}</div>` : '<div></div>'}
        <div>
          ${p.eyebrow ? `<div class="nc-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="nc-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${paragraphs}
          ${pull}
          ${values.length ? `<div class="nc-values reveal">${values}</div>` : ''}
          ${stats.length ? `<div class="nc-stats reveal">${stats}</div>` : ''}
        </div>
      </div>
    </section>
  `;
};

SECTION_RENDERERS.narrative_paragraph = function(p, biz){
  const styles = p.__styles || {};
  let text = escHtml(p.text || '');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\[stat\](.+?)\[\/stat\]/g, '<span class="narr-stat">$1</span>');
  return `
    <section class="bigquote-section" style="padding-top:0;padding-bottom:0">
      <p class="narr-para reveal${p.drop_cap ? ' drop-cap' : ''}" ${styleAttrs('text', styles)}>${text}</p>
    </section>
  `;
};

SECTION_RENDERERS.chapter_mark = function(p, biz){
  const styles = p.__styles || {};
  return `
    <section class="ch-mark-section">
      <div class="ch-mark-line"></div>
      <span class="ch-mark-ember">${escHtml(p.left_emoji||'🔥')}</span>
      ${p.label ? `<span class="ch-mark-label" ${styleAttrs('label', styles)}>${escHtml(p.label)}</span>` : ''}
      <span class="ch-mark-ember">${escHtml(p.right_emoji||'🔥')}</span>
      <div class="ch-mark-line"></div>
    </section>
  `;
};

SECTION_RENDERERS.moment_card = function(p, biz){
  const styles = p.__styles || {};
  const facts = (p.facts || []).map((f, i) =>
    `<span class="mc-fact" ${styleAttrs(`facts.${i}`, styles)}>${escHtml(f)}</span>`
  ).join('');
  return `
    <section class="moment-section">
      <div class="moment-card reveal">
        ${p.label ? `<div class="mc-label" ${styleAttrs('label', styles)}>${escHtml(p.label)}</div>` : ''}
        ${p.title ? `<div class="mc-title" ${styleAttrs('title', styles)}>${escHtml(p.title)}</div>` : ''}
        ${p.text ? `<div class="mc-text" ${styleAttrs('text', styles)}>${escHtml(p.text)}</div>` : ''}
        ${facts ? `<div class="mc-facts">${facts}</div>` : ''}
      </div>
    </section>
  `;
};

SECTION_RENDERERS.big_quote = function(p, biz){
  const styles = p.__styles || {};
  return `
    <section class="bigquote-section">
      <div class="bigquote reveal">
        ${p.text ? `<div class="bq-text" ${styleAttrs('text', styles)}>${escHtml(p.text)}</div>` : ''}
        ${p.source ? `<div class="bq-attr" ${styleAttrs('source', styles)}>${escHtml(p.source)}</div>` : ''}
      </div>
    </section>
  `;
};

SECTION_RENDERERS.cta_multi = function(p, biz){
  const styles = p.__styles || {};
  const titleHtml = (Array.isArray(p.title_lines) ? p.title_lines : []).map(l => emFormat(l)).join('<br>');
  const infoTiles = (p.info_tiles || []).map((it, i) => `
    <div class="info-tile">
      ${it.icon ? `<div class="it-icon">${escHtml(it.icon)}</div>` : ''}
      ${it.label ? `<div class="it-label" ${styleAttrs(`info_tiles.${i}.label`, styles)}>${escHtml(it.label)}</div>` : ''}
      ${it.value ? `<div class="it-val" ${styleAttrs(`info_tiles.${i}.value`, styles)}>${escHtml(it.value).replace(/\n/g, '<br>')}</div>` : ''}
    </div>
  `).join('');
  const buttons = (p.buttons || []).map((b, i) => {
    let href = b.href || '#';
    if (b.use_business_phone && biz?.phone) href = 'tel:' + biz.phone.replace(/[^0-9+]/g,'');
    if (b.use_business_facebook && biz?.socials?.facebook) href = biz.socials.facebook;
    const target = (b.target === 'blank' || b.use_business_facebook) ? 'target="_blank" rel="noopener"' : '';
    const cls = b.style === 'fire' ? 'btn-fire' : 'btn-ghost';
    return `<a href="${escHtml(href)}" class="${cls}" ${target} ${styleAttrs(`buttons.${i}.text`, styles)}>${escHtml(b.text||'Button')}</a>`;
  }).join('');
  return `
    <section class="cta-multi-section">
      <div class="cta-multi-wrap">
        ${titleHtml ? `<h2 class="cta-multi-title reveal" ${styleAttrs('title_lines', styles)}>${titleHtml}</h2>` : ''}
        ${p.subtitle ? `<p class="cta-multi-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
        ${infoTiles ? `<div class="cta-multi-info reveal">${infoTiles}</div>` : ''}
        ${buttons ? `<div class="cta-multi-btns reveal">${buttons}</div>` : ''}
      </div>
    </section>
  `;
};

SECTION_RENDERERS.card_image = function(p, biz){
  const styles = p.__styles || {};
  const paragraphs = (p.paragraphs || []).map((para, i) =>
    `<p class="ci-body reveal" ${styleAttrs(`paragraphs.${i}`, styles)}>${escHtml(para).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`
  ).join('');
  return `
    <section class="card-image-section">
      <div class="card-image-wrap">
        <div class="card-image-mockup">
          ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.image_alt||'')}" ${styleAttrs('image', styles)} onerror="this.style.opacity='.3'">` : '<div class="it-image-empty" style="border-radius:10px">(add an image)</div>'}
        </div>
        <div class="card-image-info">
          ${p.eyebrow ? `<div class="ci-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
          ${p.title ? `<h2 class="ci-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
          ${paragraphs}
        </div>
      </div>
    </section>
  `;
};

SECTION_RENDERERS.occasions_grid = function(p, biz){
  const styles = p.__styles || {};
  const items = (p.items || []).map((it, i) => `
    <div class="occ-tile reveal">
      ${it.icon ? `<div class="occ-icon">${escHtml(it.icon)}</div>` : ''}
      <div class="occ-text" ${styleAttrs(`items.${i}.text`, styles)}>${escHtml(it.text||'')}</div>
    </div>
  `).join('');
  return `
    <section class="section">
      <div class="sec-inner">
        ${p.eyebrow ? `<div class="sec-eyebrow reveal" ${styleAttrs('eyebrow', styles)}>${escHtml(p.eyebrow)}</div>` : ''}
        ${p.title ? `<h2 class="sec-title reveal" ${styleAttrs('title', styles)}>${emFormat(p.title)}</h2>` : ''}
        ${p.subtitle ? `<p class="sec-sub reveal" ${styleAttrs('subtitle', styles)}>${escHtml(p.subtitle)}</p>` : ''}
        <div class="occ-grid">${items}</div>
      </div>
    </section>
  `;
};

SECTION_RENDERERS.html_block = function(p, biz){
  // Escape hatch — emits the HTML as-is. Use sparingly.
  return `
    <section class="html-block-section">
      <div class="html-block-inner">${p.html || ''}</div>
    </section>
  `;
};

SECTION_RENDERERS._menu_placeholder = function(p, biz){
  // Renders as a visual placeholder in the edit-mode iframe. The actual
  // menu/market grid sits in the live HTML between chrome_top and chrome_bottom.
  const kind = p.kind === 'market' ? 'Market' : 'Menu';
  return `
    <section class="menu-placeholder-section" style="padding:clamp(40px,6vh,70px) clamp(24px,8vw,120px);text-align:center;background:rgba(20,12,6,.4);border-top:2px dashed rgba(255,153,48,.3);border-bottom:2px dashed rgba(255,153,48,.3);margin:14px 0">
      <div style="display:inline-flex;align-items:center;gap:14px;padding:14px 24px;background:#1a1108;border:1px solid var(--flame);border-radius:8px;color:var(--flame);font-family:var(--cond);font-weight:700;font-size:11px;letter-spacing:.22em;text-transform:uppercase">
        <span>📋</span>
        <span>${escHtml(kind)} Items Grid</span>
        <span style="color:rgba(196,160,112,.55);font-weight:500">— managed via the ${escHtml(kind)} tab</span>
      </div>
    </section>
  `;
};
function renderSection(s, biz){
  const fn = SECTION_RENDERERS[s.type];
  if (!fn) return '';
  // Pass element_styles via __styles on the props (avoids changing renderer signature)
  const propsWithStyles = { ...(s.props || {}), __styles: s.element_styles || {} };
  let html = '';
  try { html = fn(propsWithStyles, biz); } catch(e) { console.error(e); return ''; }
  // Inject section_style attributes onto the outer <section>
  const sa = sectionStyleAttrs(s.section_style);
  html = html.replace(/^(\s*<section)/, `$1 ${sa}`);
  return html;
}

/* ─── CSS for page_header section ─── */
function injectPageHeaderCss(){
  if (document.getElementById('fs-page-header-css')) return;
  const css = `
  .page-header-sec{position:sticky;top:0;z-index:500;display:flex;align-items:center;justify-content:space-between;padding:clamp(12px,1.8vh,18px) clamp(20px,5vw,60px);background:rgba(9,7,4,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(196,160,112,.09)}
  .page-header-sec .ph-back{font-family:var(--cond);font-weight:600;font-size:var(--fs-text-size,10px);letter-spacing:.22em;text-transform:uppercase;color:var(--fs-text-color,rgba(196,160,112,.68));border:var(--fs-border,1px solid rgba(196,160,112,.32));padding:7px 16px;border-radius:var(--fs-radius,2px);text-decoration:none;transition:all .3s}
  .page-header-sec .ph-back:hover{border-color:rgba(255,153,48,.45);color:var(--flame)}
  .page-header-sec .ph-center{text-align:center}
  .page-header-sec .ph-brand{font-family:var(--serif);font-weight:700;font-size:var(--fs-text-size,clamp(14px,2vw,22px));color:var(--fs-text-color,var(--cream));text-decoration:none;text-shadow:0 0 30px rgba(255,153,48,.15)}
  .page-header-sec .ph-brand em{font-style:italic;font-weight:400;color:var(--flame)}
  .page-header-sec .ph-sub{font-family:var(--cond);font-size:var(--fs-text-size,8px);letter-spacing:.28em;text-transform:uppercase;color:var(--fs-text-color,rgba(196,160,112,.45));margin-top:2px}
  .page-header-sec .ph-right{font-family:var(--cond);font-weight:600;font-size:var(--fs-text-size,10px);letter-spacing:.22em;text-transform:uppercase;color:var(--fs-text-color,rgba(196,160,112,.68));border:var(--fs-border,1px solid rgba(196,160,112,.32));padding:7px 16px;border-radius:var(--fs-radius,2px);text-decoration:none;transition:all .3s}
  .page-header-sec .ph-right:hover{border-color:rgba(255,153,48,.45);color:var(--flame)}
  `;
  const s = document.createElement('style');
  s.id = 'fs-page-header-css';
  s.textContent = css;
  document.head.appendChild(s);
}


async function renderPage(){
  const root = document.getElementById('page-root');
  if (!root) return;
  let page, biz;
  try {
    [page, biz] = await Promise.all([
      typeof loadPage === 'function' ? loadPage(PAGE_ID) : { sections: [] },
      typeof loadBusiness === 'function' ? loadBusiness() : null
    ]);
  } catch(e) {
    console.error('renderPage failed:', e);
    return;
  }
  const sections = (page.sections || []).filter(s => !s.hidden);
  root.innerHTML = sections.map(s => renderSection(s, biz)).join('');

  if (biz?.phone) {
    const sc = document.getElementById('sticky-call');
    if (sc) sc.href = 'tel:' + biz.phone.replace(/[^0-9+]/g,'');
  }
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
}

/* ─── Extra CSS for new section types — injected once at boot ─── */
function injectExtraSectionStyles(){
  if (document.getElementById('extra-section-styles')) return;
  const css = `
    /* Hero with image */
    .hero-image-section{position:relative;z-index:10;min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:clamp(60px,10vh,100px) clamp(24px,8vw,120px);overflow:hidden}
    .hi-bg{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
    .hi-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,7,4,.55),rgba(9,7,4,.8));z-index:1}
    .hi-content{position:relative;z-index:2;max-width:900px}
    .hi-eyebrow{font-family:var(--cond);font-weight:600;font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:var(--flame);margin-bottom:16px}
    .hi-title{font-family:var(--serif);font-weight:900;font-size:clamp(40px,8vw,90px);letter-spacing:-.03em;line-height:.95;color:var(--cream);margin-bottom:20px}
    .hi-title em{font-style:italic;font-weight:300;color:var(--flame)}
    .hi-lead{font-family:var(--serif);font-style:italic;font-weight:300;font-size:clamp(15px,1.7vw,21px);line-height:1.6;color:rgba(196,160,112,.85);max-width:640px;margin:0 auto}
    /* Image + text two-column */
    .it-wrap{display:grid;grid-template-columns:1fr;gap:clamp(28px,4vw,56px);align-items:center}
    @media(min-width:768px){.it-wrap{grid-template-columns:1fr 1fr}}
    .it-rev .it-image{order:2}@media(max-width:767px){.it-rev .it-image{order:0}}
    .it-image{position:relative;overflow:hidden;border-radius:8px;background:rgba(22,12,4,.4);border:1px solid rgba(196,160,112,.1)}
    .it-image img{display:block;width:100%;height:auto}
    .it-image-empty{padding:80px 24px;text-align:center;color:rgba(196,160,112,.5);font-style:italic;font-family:var(--cond);letter-spacing:.16em;text-transform:uppercase;font-size:11px}
    .it-text .sec-eyebrow{margin-bottom:10px}
    .it-text .sec-title{margin-bottom:18px}
    .it-body{font-family:var(--body);font-weight:300;font-size:clamp(14px,1.4vw,16px);line-height:1.75;color:rgba(196,160,112,.85)}
    /* Gallery */
    .gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr));gap:clamp(8px,1.2vw,14px)}
    .gal-item{background:rgba(22,12,4,.5);border:1px solid rgba(196,160,112,.1);border-radius:6px;overflow:hidden;transition:border-color .25s}
    .gal-item:hover{border-color:rgba(255,153,48,.3)}
    .gal-item img{display:block;width:100%;height:200px;object-fit:cover}
    .gal-item-empty{padding:40px;text-align:center;color:rgba(196,160,112,.4);font-style:italic;font-family:var(--cond);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
    .gal-cap{padding:10px 14px;font-family:var(--cond);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(196,160,112,.75)}
    /* FAQ */
    .faq-list{display:flex;flex-direction:column;gap:8px;max-width:820px;margin:0 auto}
    .faq-item{background:rgba(22,14,6,.6);border:1px solid rgba(196,160,112,.1);border-radius:6px;overflow:hidden;transition:border-color .25s}
    .faq-item:hover{border-color:rgba(255,153,48,.18)}
    .faq-item[open]{border-color:rgba(255,153,48,.3)}
    .faq-q{padding:18px 24px;font-family:var(--serif);font-weight:700;font-size:clamp(15px,1.5vw,18px);color:var(--cream);cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:18px;align-items:center}
    .faq-q::after{content:'+';font-family:var(--cond);font-weight:300;font-size:24px;color:var(--flame);transition:transform .25s}
    .faq-item[open] .faq-q::after{transform:rotate(45deg)}
    .faq-q::-webkit-details-marker{display:none}
    .faq-a{padding:0 24px 22px;font-family:var(--body);font-weight:300;font-size:clamp(13px,1.2vw,15px);line-height:1.7;color:rgba(196,160,112,.85)}
    /* Video */
    .video-wrap{position:relative;width:100%;padding-top:56.25%;background:rgba(22,12,4,.6);border:1px solid rgba(196,160,112,.1);border-radius:8px;overflow:hidden;max-width:960px;margin:0 auto}
    .video-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
    .video-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(196,160,112,.4);font-style:italic;font-family:var(--cond);letter-spacing:.16em;text-transform:uppercase;font-size:11px}
    /* Divider */
    .divider-section{padding:40px clamp(24px,8vw,120px)}
    .divider-section .sec-inner{display:flex;align-items:center;gap:18px;max-width:1100px;margin:0 auto}
    .divider-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(196,160,112,.25),transparent)}
    .divider-label{font-family:var(--cond);font-weight:600;font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--flame);opacity:.7}

    /* Info Grid (Find Us cards / Gift Cards bottom cards) */
    .info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr));gap:clamp(10px,1.5vw,16px);max-width:1100px;margin:0 auto}
    .info-card-block{background:rgba(22,14,6,.75);border:1px solid rgba(196,160,112,.12);border-radius:8px;padding:clamp(20px,3vh,28px);display:flex;flex-direction:column;gap:8px;transition:border-color .3s,transform .3s}
    .info-card-block.highlight{border-color:rgba(255,153,48,.3);background:rgba(28,18,8,.85)}
    .info-card-block:hover{border-color:rgba(255,153,48,.28);transform:translateY(-3px)}
    .info-card-block .ic-icon{font-size:clamp(22px,2.8vw,30px);filter:drop-shadow(0 0 8px rgba(255,153,48,.3))}
    .info-card-block .ic-label{font-family:var(--cond);font-weight:700;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--flame);opacity:.8}
    .info-card-block .ic-title{font-family:var(--serif);font-weight:700;font-size:clamp(15px,1.6vw,20px);color:var(--cream);margin-top:2px}
    .info-card-block .ic-body{font-family:var(--body);font-weight:300;font-size:clamp(12px,1.1vw,14px);line-height:1.65;color:rgba(196,160,112,.78);flex:1}
    .info-card-block .ic-action{margin-top:8px;font-family:var(--cond);font-weight:600;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--flame);text-decoration:none;align-self:flex-start;padding:8px 14px;border:1px solid rgba(255,153,48,.32);border-radius:2px;transition:all .25s}
    .info-card-block .ic-action:hover{background:rgba(255,153,48,.08);border-color:rgba(255,153,48,.6)}

    /* Map Embed */
    .map-embed-section{padding:clamp(40px,6vh,70px) clamp(24px,8vw,120px);max-width:1400px;margin:0 auto}
    .map-frame-wrap{position:relative;width:100%;padding-top:50%;background:rgba(22,12,4,.6);border:1px solid rgba(196,160,112,.18);border-radius:10px;overflow:hidden;box-shadow:0 16px 60px rgba(0,0,0,.55)}
    .map-frame-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.7) brightness(.85)}
    .map-cta{position:absolute;bottom:18px;right:18px;background:linear-gradient(90deg,var(--ember),var(--flame));color:#fff;text-decoration:none;padding:12px 22px;border-radius:3px;font-family:var(--cond);font-weight:700;font-size:11px;letter-spacing:.22em;text-transform:uppercase;box-shadow:0 6px 28px rgba(212,82,0,.45);z-index:2;transition:transform .25s}
    .map-cta:hover{transform:scale(1.05)}

    /* Narrative chapter (About) */
    .narrative-section{padding:clamp(70px,12vh,130px) clamp(24px,8vw,120px);border-top:1px solid rgba(196,160,112,.07);position:relative;overflow:hidden}
    .narrative-section::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 100%,rgba(212,82,0,.05),transparent 60%)}
    .nc-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:120px 1fr;gap:clamp(28px,4vw,56px);align-items:start;position:relative;z-index:1}
    .nc-inner.flip{grid-template-columns:1fr 120px}
    .nc-inner.flip .nc-num{order:2}
    @media(max-width:767px){.nc-inner,.nc-inner.flip{grid-template-columns:1fr}.nc-inner.flip .nc-num{order:0}}
    .nc-num{font-family:var(--cond);font-weight:800;font-size:clamp(64px,10vw,128px);letter-spacing:-.04em;line-height:1;color:rgba(212,82,0,.16)}
    .nc-eyebrow{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:var(--flame);opacity:.8;margin-bottom:12px;display:flex;align-items:center;gap:10px}
    .nc-eyebrow::before{content:'';width:24px;height:1px;background:currentColor}
    .nc-title{font-family:var(--serif);font-weight:900;font-size:clamp(30px,5vw,60px);letter-spacing:-.02em;line-height:1;color:var(--cream);margin-bottom:clamp(16px,2.5vh,26px)}
    .nc-title em{font-style:italic;font-weight:300;color:var(--flame)}
    .nc-text{font-family:var(--body);font-weight:300;font-size:clamp(14px,1.4vw,17px);line-height:1.8;color:rgba(196,160,112,.85);margin-bottom:clamp(14px,2vh,22px)}
    .nc-text strong{color:var(--parch);font-weight:500}
    .nc-text em{font-style:italic;color:var(--flame)}
    .nc-pull{margin:clamp(20px,3vh,30px) 0;padding:clamp(18px,2.5vh,26px);background:rgba(22,12,4,.65);border-left:3px solid var(--flame);border-radius:0 6px 6px 0}
    .nc-pull-text{font-family:var(--serif);font-style:italic;font-weight:400;font-size:clamp(15px,1.6vw,19px);line-height:1.55;color:rgba(232,212,176,.92);margin-bottom:8px}
    .nc-pull-source{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(196,160,112,.6)}
    .nc-values{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(180px,100%),1fr));gap:clamp(10px,1.4vw,16px);margin-top:clamp(18px,3vh,28px)}
    .nc-val{padding:clamp(14px,2vh,20px);background:rgba(22,12,4,.6);border:1px solid rgba(196,160,112,.1);border-radius:6px;display:flex;flex-direction:column;gap:6px;transition:border-color .25s}
    .nc-val:hover{border-color:rgba(255,153,48,.22)}
    .nc-val-icon{font-size:clamp(20px,2.4vw,26px);filter:drop-shadow(0 0 6px rgba(255,153,48,.3))}
    .nc-val-title{font-family:var(--serif);font-weight:700;font-size:clamp(13px,1.3vw,16px);color:var(--cream)}
    .nc-val-desc{font-family:var(--body);font-weight:300;font-size:clamp(11px,1.05vw,13px);line-height:1.55;color:rgba(196,160,112,.7)}
    .nc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:clamp(8px,1vw,14px);margin-top:clamp(14px,2vh,22px)}
    .nc-stat{padding:clamp(14px,2vh,22px) 8px;background:rgba(22,12,4,.7);border:1px solid rgba(196,160,112,.1);border-radius:6px;text-align:center;transition:border-color .25s}
    .nc-stat:hover{border-color:rgba(255,153,48,.3)}
    .nc-stat-num{font-family:var(--serif);font-weight:900;font-size:clamp(20px,2.6vw,30px);color:var(--flame);line-height:1.1}
    .nc-stat-label{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(196,160,112,.7);margin-top:5px;line-height:1.3}

    /* Narrative paragraph (Story page) */
    .narr-para{font-family:var(--serif);font-weight:300;font-size:clamp(16px,1.6vw,20px);line-height:1.8;color:rgba(232,212,176,.88);max-width:680px;margin:0 auto clamp(20px,3vh,30px);padding:0 clamp(24px,6vw,80px)}
    .narr-para strong{color:var(--cream);font-weight:500}
    .narr-para em{font-style:italic;color:var(--flame)}
    .narr-para.drop-cap::first-letter{font-family:var(--serif);font-weight:900;font-size:clamp(58px,8vw,90px);float:left;line-height:.85;margin:6px 12px 0 0;color:var(--flame);text-shadow:0 2px 14px rgba(255,153,48,.3)}
    .narr-stat{display:inline-block;font-family:var(--cond);font-weight:700;color:var(--flame);background:rgba(255,153,48,.08);padding:1px 8px;border-radius:3px;font-size:.9em}
    /* Chapter mark with embers */
    .ch-mark-section{padding:clamp(36px,5vh,56px) clamp(24px,8vw,120px);max-width:760px;margin:0 auto;display:flex;align-items:center;gap:14px}
    .ch-mark-line{flex:1;height:1px;background:linear-gradient(90deg,rgba(196,160,112,.15),transparent);}
    .ch-mark-line:first-child{background:linear-gradient(90deg,transparent,rgba(196,160,112,.15))}
    .ch-mark-ember{font-size:14px;filter:drop-shadow(0 0 6px rgba(255,153,48,.4))}
    .ch-mark-label{font-family:var(--cond);font-weight:700;font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--flame);padding:0 6px}
    /* Moment card (Story) */
    .moment-section{padding:clamp(20px,3vh,40px) clamp(24px,8vw,120px)}
    .moment-card{max-width:760px;margin:0 auto;padding:clamp(28px,4vh,40px);background:rgba(22,12,4,.75);border:1px solid rgba(196,160,112,.18);border-radius:10px;box-shadow:0 12px 48px rgba(0,0,0,.4)}
    .moment-card .mc-label{font-family:var(--cond);font-weight:700;font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--flame);margin-bottom:10px}
    .moment-card .mc-title{font-family:var(--serif);font-weight:900;font-size:clamp(22px,3vw,34px);letter-spacing:-.01em;color:var(--cream);margin-bottom:14px}
    .moment-card .mc-text{font-family:var(--body);font-weight:300;font-size:clamp(13px,1.3vw,16px);line-height:1.75;color:rgba(196,160,112,.82);margin-bottom:18px}
    .moment-card .mc-facts{display:flex;flex-wrap:wrap;gap:8px}
    .moment-card .mc-fact{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--flame);background:rgba(255,153,48,.08);padding:6px 12px;border-radius:3px;border:1px solid rgba(255,153,48,.18)}
    /* Big quote (Story) */
    .bigquote-section{padding:clamp(40px,6vh,70px) clamp(24px,8vw,120px)}
    .bigquote{max-width:820px;margin:0 auto;text-align:center;padding:clamp(20px,3vh,30px) 0}
    .bigquote .bq-text{font-family:var(--serif);font-style:italic;font-weight:400;font-size:clamp(20px,2.6vw,32px);line-height:1.45;color:var(--cream);margin-bottom:14px;position:relative}
    .bigquote .bq-text::before,.bigquote .bq-text::after{color:var(--ember);opacity:.6;font-size:1.5em;line-height:0;vertical-align:-.2em}
    .bigquote .bq-text::before{content:'\\201C ';margin-right:4px}
    .bigquote .bq-text::after{content:' \\201D';margin-left:4px}
    .bigquote .bq-attr{font-family:var(--cond);font-weight:600;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(196,160,112,.6)}

    /* CTA Multi (Find Us, About, Gift Cards CTAs) */
    .cta-multi-section{position:relative;z-index:10;padding:clamp(70px,12vh,120px) clamp(24px,8vw,120px);border-top:1px solid rgba(196,160,112,.07);text-align:center}
    .cta-multi-section::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(212,82,0,.1),transparent 65%)}
    .cta-multi-wrap{max-width:820px;margin:0 auto;position:relative;z-index:1}
    .cta-multi-title{font-family:var(--serif);font-weight:900;font-size:clamp(36px,7vw,80px);letter-spacing:-.03em;line-height:.92;color:var(--cream);margin-bottom:clamp(12px,2vh,20px)}
    .cta-multi-title em{font-style:italic;font-weight:300;color:var(--flame)}
    .cta-multi-sub{font-family:var(--serif);font-style:italic;font-weight:300;font-size:clamp(14px,1.6vw,20px);color:rgba(196,160,112,.78);margin-bottom:clamp(24px,3.5vh,40px)}
    .cta-multi-info{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:clamp(24px,3.5vh,40px)}
    .cta-multi-info .info-tile{background:rgba(22,14,6,.7);border:1px solid rgba(196,160,112,.12);border-radius:6px;padding:clamp(14px,2vh,20px) clamp(18px,2.5vw,28px);min-width:clamp(140px,18vw,200px);transition:border-color .25s}
    .cta-multi-info .info-tile:hover{border-color:rgba(255,153,48,.3)}
    .cta-multi-info .it-icon{font-size:22px;margin-bottom:6px;filter:drop-shadow(0 0 6px rgba(255,153,48,.3))}
    .cta-multi-info .it-label{font-family:var(--cond);font-weight:700;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:rgba(196,160,112,.55);margin-bottom:4px}
    .cta-multi-info .it-val{font-family:var(--cond);font-weight:600;font-size:clamp(12px,1.2vw,14px);color:rgba(232,212,176,.85);line-height:1.4}
    .cta-multi-btns{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
    .cta-multi-btns .btn-fire,.cta-multi-btns .btn-ghost{padding:14px 30px;font-size:12px}

    /* Directions Columns (Find Us) */
    .dir-cols-section{padding:clamp(60px,10vh,100px) clamp(24px,8vw,120px);border-top:1px solid rgba(196,160,112,.07)}
    .dir-cols-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(40px,6vw,80px)}
    @media(min-width:900px){.dir-cols-inner{grid-template-columns:1fr 1fr}}
    .dir-col h3{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:var(--flame);opacity:.8;margin-bottom:10px;display:flex;align-items:center;gap:10px}
    .dir-col h3::before{content:'';width:24px;height:1px;background:currentColor}
    .dir-col h2{font-family:var(--serif);font-weight:900;font-size:clamp(28px,5vw,52px);letter-spacing:-.02em;line-height:1;color:var(--cream);margin-bottom:clamp(20px,3vh,30px)}
    .dir-col h2 em{font-style:italic;font-weight:300;color:var(--flame)}
    .from-list{display:flex;flex-direction:column;gap:18px}
    .from-item{display:flex;gap:14px;padding:clamp(14px,2vh,20px);background:rgba(18,10,4,.6);border:1px solid rgba(196,160,112,.1);border-radius:6px;transition:border-color .25s}
    .from-item:hover{border-color:rgba(255,153,48,.22)}
    .from-dot{width:8px;height:8px;border-radius:50%;background:var(--flame);box-shadow:0 0 6px var(--flame);flex-shrink:0;margin-top:8px}
    .from-name{font-family:var(--serif);font-weight:700;font-size:clamp(15px,1.5vw,18px);color:var(--cream);margin-bottom:4px}
    .from-dir{font-family:var(--body);font-weight:300;font-size:clamp(12px,1.15vw,14px);line-height:1.6;color:rgba(196,160,112,.75);margin-bottom:6px}
    .from-dist{font-family:var(--cond);font-weight:600;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--flame);opacity:.7}
    .landmarks{display:flex;flex-direction:column;gap:14px;margin-top:clamp(14px,2vh,22px)}
    .lm-item{display:flex;gap:14px;align-items:flex-start}
    .lm-icon{font-size:20px;flex-shrink:0;filter:drop-shadow(0 0 6px rgba(255,153,48,.3))}
    .lm-text{font-family:var(--body);font-weight:300;font-size:clamp(13px,1.2vw,15px);line-height:1.65;color:rgba(196,160,112,.82)}
    .lm-text strong{color:var(--parch);font-weight:500}

    /* Card Image (Gift Cards mockup) */
    .card-image-section{padding:clamp(40px,6vh,70px) clamp(24px,8vw,120px)}
    .card-image-wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:clamp(28px,4vw,56px);align-items:center}
    @media(min-width:768px){.card-image-wrap{grid-template-columns:1fr 1fr}}
    .card-image-mockup img{display:block;width:100%;max-width:500px;height:auto;border-radius:10px;box-shadow:0 18px 60px rgba(212,82,0,.3);transform:rotate(-2deg);transition:transform .4s}
    .card-image-mockup img:hover{transform:rotate(0deg) scale(1.02)}
    .card-image-info .ci-eyebrow{font-family:var(--cond);font-weight:600;font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:var(--flame);margin-bottom:10px;display:flex;align-items:center;gap:10px}
    .card-image-info .ci-eyebrow::before{content:'';width:24px;height:1px;background:currentColor}
    .card-image-info .ci-title{font-family:var(--serif);font-weight:900;font-size:clamp(28px,4.5vw,52px);letter-spacing:-.02em;line-height:1;color:var(--cream);margin-bottom:18px}
    .card-image-info .ci-title em{font-style:italic;font-weight:300;color:var(--flame)}
    .card-image-info .ci-body{font-family:var(--body);font-weight:300;font-size:clamp(14px,1.4vw,17px);line-height:1.8;color:rgba(196,160,112,.85);margin-bottom:14px}
    .card-image-info .ci-body strong{color:var(--parch);font-weight:500}

    /* Occasions Grid (Gift Cards) */
    .occ-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
    .occ-tile{padding:clamp(18px,2.6vh,24px) 14px;background:rgba(22,12,4,.7);border:1px solid rgba(196,160,112,.1);border-radius:8px;text-align:center;transition:border-color .25s,transform .25s}
    .occ-tile:hover{border-color:rgba(255,153,48,.32);transform:translateY(-2px)}
    .occ-icon{font-size:clamp(24px,3vw,32px);margin-bottom:8px;filter:drop-shadow(0 0 6px rgba(255,153,48,.3))}
    .occ-text{font-family:var(--cond);font-weight:600;font-size:clamp(11px,1.1vw,13px);letter-spacing:.12em;text-transform:uppercase;color:rgba(232,212,176,.85)}

    /* HTML Block — escape hatch */
    .html-block-section{padding:clamp(40px,6vh,80px) clamp(24px,8vw,120px)}
    .html-block-inner{max-width:1100px;margin:0 auto;color:var(--cream)}
  `;
  const style = document.createElement('style');
  style.id = 'extra-section-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════
   EDIT MODE — activated via ?edit=1 URL param
   When active: sections become clickable, text becomes editable,
   "+" buttons appear between sections. Talks to the parent editor
   via window.postMessage.
═══════════════════════════════════════════════════════════ */
const IS_EDIT = new URLSearchParams(location.search).get('edit') === '1';

function postToParent(type, payload){
  if (!window.parent || window.parent === window) return;
  try { window.parent.postMessage({ source: 'fs-page-editor', type, payload }, '*'); } catch {}
}

function setupEditMode(){
  // Tag each rendered section with its id from PG_LAST_DATA, in the same order.
  // We render ALL sections in edit mode (hidden ones are just dimmed) so the
  // index aligns 1:1 with the data array.
  const sections = PG_LAST_DATA?.sections || [];
  const sectionEls = document.querySelectorAll('#page-root > section');
  sections.forEach((s, i) => {
    const el = sectionEls[i];
    if (!el) return;
    el.setAttribute('data-section-id', s.id);
    el.setAttribute('data-section-type', s.type);
    // Wrap into an editable shell
    el.classList.add('fs-edit-section');
  });

  injectEditChrome();
  wireEditableText();
  wireSectionInteractions();
}

function injectEditChrome(){
  if (document.getElementById('fs-edit-styles')) return;
  const css = `
    body.fs-edit{cursor:auto !important}
    body.fs-edit #cursor,body.fs-edit #sticky-call{display:none !important}
    .fs-edit-section{position:relative;outline:2px solid transparent;outline-offset:-2px;transition:outline-color .15s}
    body.fs-edit .fs-edit-section:hover{outline-color:rgba(255,153,48,.5)}
    body.fs-edit .fs-edit-section.selected{outline-color:var(--flame);outline-width:3px;outline-offset:-3px}
    [data-edit]{transition:background .15s,outline .15s}
    body.fs-edit [data-edit]{cursor:text;outline:1px dashed transparent;outline-offset:3px;border-radius:3px}
    body.fs-edit [data-edit]:hover{outline-color:rgba(255,194,74,.4);background:rgba(255,153,48,.05)}
    body.fs-edit [data-edit]:focus{outline:2px solid var(--flame);background:rgba(255,153,48,.08);box-shadow:0 0 0 4px rgba(255,153,48,.15)}
    body.fs-edit [data-style-id].fs-elem-selected{outline:2px solid var(--flame) !important;outline-offset:3px;box-shadow:0 0 0 5px rgba(255,153,48,.15)}
    body.fs-edit img[data-style-id]{cursor:pointer}
    body.fs-edit img[data-style-id]:hover{outline:1px dashed rgba(255,194,74,.6);outline-offset:3px}
    .fs-section-toolbar{position:absolute;top:-1px;right:-1px;display:flex;gap:1px;background:#1a1108;border:1px solid var(--flame);border-radius:0 0 0 6px;padding:4px;z-index:100;opacity:0;pointer-events:none;transition:opacity .12s}
    .fs-edit-section.selected .fs-section-toolbar,.fs-edit-section:hover .fs-section-toolbar{opacity:1;pointer-events:auto}
    .fs-tb-btn{background:transparent;border:1px solid transparent;color:#dcbe94;width:28px;height:28px;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;font-family:var(--cond)}
    .fs-tb-btn:hover{background:rgba(255,153,48,.18);border-color:rgba(255,153,48,.45);color:#fff}
    .fs-tb-btn.danger:hover{background:rgba(220,80,70,.25);border-color:#dc5046;color:#fff}
    .fs-tb-label{padding:0 10px;display:flex;align-items:center;color:var(--flame);font-family:var(--cond);font-weight:700;font-size:9px;letter-spacing:.22em;text-transform:uppercase;border-right:1px solid rgba(255,153,48,.25);margin-right:4px}
    /* Drop zone between sections */
    .fs-drop-zone{position:relative;height:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:50}
    .fs-drop-zone::before{content:'';position:absolute;left:5%;right:5%;height:2px;background:transparent;border-radius:1px;transition:background .15s}
    .fs-drop-zone:hover::before{background:rgba(255,153,48,.5)}
    .fs-drop-btn{position:relative;width:28px;height:28px;border-radius:50%;background:#1a1108;border:1.5px solid var(--flame);color:var(--flame);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:300;cursor:pointer;opacity:.5;transition:opacity .15s,transform .15s}
    .fs-drop-zone:hover .fs-drop-btn{opacity:1;transform:scale(1.15)}
    .fs-edit-hidden{position:fixed;top:14px;left:14px;background:#1a1108;color:#dcbe94;padding:8px 14px;border:1px solid rgba(220,190,148,.25);border-radius:6px;font-family:var(--cond);font-size:11px;letter-spacing:.18em;text-transform:uppercase;z-index:1000;display:flex;align-items:center;gap:8px}
    .fs-edit-hidden::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--flame);box-shadow:0 0 6px var(--flame)}
  `;
  const style = document.createElement('style');
  style.id = 'fs-edit-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

function wireEditableText(){
  document.querySelectorAll('[data-edit]').forEach(el => {
    const field = el.getAttribute('data-edit');
    el.setAttribute('contenteditable', 'plaintext-only');
    el.spellcheck = false;

    // Special handling for multi-line title fields (title_lines)
    const isLines = (field === 'title_lines');
    if (isLines) {
      // Render as plain text with newlines; on save, split by newline
      // Convert the <br> visualisation to actual newlines for editing
      const html = el.innerHTML;
      el.dataset.editLines = '1';
      el.textContent = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<em>([^<]+)<\/em>/g, '*$1*')
        .replace(/<[^>]+>/g, '');
    } else {
      // Strip <em>...</em> back to *...* so the user sees the syntax they typed
      const html = el.innerHTML;
      if (html.includes('<em>')) {
        el.textContent = html.replace(/<em>([^<]+)<\/em>/g, '*$1*').replace(/<[^>]+>/g, '');
        el.dataset.hasEm = '1';
      }
    }

    el.addEventListener('focus', () => {
      const sec = el.closest('.fs-edit-section');
      if (sec) {
        document.querySelectorAll('.fs-edit-section.selected').forEach(s => s.classList.remove('selected'));
        sec.classList.add('selected');
        postToParent('section-selected', { id: sec.dataset.sectionId, type: sec.dataset.sectionType });
      }
      // Also tell parent which specific element is selected, so it can show per-element styling
      document.querySelectorAll('[data-style-id].fs-elem-selected').forEach(e => e.classList.remove('fs-elem-selected'));
      el.classList.add('fs-elem-selected');
      postToParent('element-selected', {
        sectionId: sec?.dataset.sectionId,
        styleId: el.getAttribute('data-style-id') || field
      });
    });

    let saveTimer;
    const commit = () => {
      const sec = el.closest('.fs-edit-section');
      if (!sec) return;
      let value = el.innerText;
      if (isLines) {
        value = value.split(/\n/).map(s => s.trim()).filter(s => s);
      }
      postToParent('field-changed', {
        sectionId: sec.dataset.sectionId,
        field,
        value
      });
    };
    el.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(commit, 250);
    });
    el.addEventListener('blur', () => { clearTimeout(saveTimer); commit(); });

    // Enter behavior for non-line fields: prevent newlines
    el.addEventListener('keydown', e => {
      if (!isLines && e.key === 'Enter') { e.preventDefault(); el.blur(); }
    });
  });
}

function wireSectionInteractions(){
  document.querySelectorAll('.fs-edit-section').forEach((sec, idx, all) => {
    // Toolbar
    const tb = document.createElement('div');
    tb.className = 'fs-section-toolbar';
    const typeLabel = (sec.dataset.sectionType || '').replace(/_/g,' ');
    tb.innerHTML = `
      <span class="fs-tb-label">${typeLabel}</span>
      <button class="fs-tb-btn" data-act="up"   title="Move up"     ${idx===0?'disabled':''}>↑</button>
      <button class="fs-tb-btn" data-act="down" title="Move down"   ${idx===all.length-1?'disabled':''}>↓</button>
      <button class="fs-tb-btn" data-act="dup"  title="Duplicate">⎘</button>
      <button class="fs-tb-btn" data-act="hide" title="Hide">⊘</button>
      <button class="fs-tb-btn" data-act="props" title="More settings">⚙</button>
      <button class="fs-tb-btn danger" data-act="del" title="Delete">×</button>
    `;
    sec.appendChild(tb);
    tb.querySelectorAll('[data-act]').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const act = btn.dataset.act;
        postToParent('section-action', { id: sec.dataset.sectionId, action: act });
      };
    });

    // Click anywhere on the section selects it
    sec.addEventListener('click', e => {
      // Don't grab editable text clicks
      if (e.target.closest('[data-edit]')) return;
      if (e.target.closest('.fs-tb-btn')) return;
      document.querySelectorAll('.fs-edit-section.selected').forEach(s => s.classList.remove('selected'));
      sec.classList.add('selected');
      postToParent('section-selected', { id: sec.dataset.sectionId, type: sec.dataset.sectionType });
    });
  });

  // Drop zones between sections (and at top + bottom)
  // For chrome pages, we have two separate roots (#page-chrome-top, #page-chrome-bottom)
  // and drop-zones are inserted into each. For section pages, we use #page-root.
  const dropRoots = document.getElementById('page-root')
    ? [document.getElementById('page-root')]
    : [document.getElementById('page-chrome-top'), document.getElementById('page-chrome-bottom')].filter(Boolean);
  dropRoots.forEach(root => {
    const sections = Array.from(root.children).filter(c => c.classList.contains('fs-edit-section'));
    sections.forEach((sec, i) => {
      const dz = mkDropZone(i, root.id);
      root.insertBefore(dz, sec);
    });
    root.appendChild(mkDropZone(sections.length, root.id));
  });

  // Image element selection — non-text elements with [data-style-id] are clickable
  document.querySelectorAll('img[data-style-id], [data-style-id]:not([data-edit])').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const sec = el.closest('.fs-edit-section');
      if (!sec) return;
      document.querySelectorAll('.fs-edit-section.selected').forEach(s => s.classList.remove('selected'));
      sec.classList.add('selected');
      document.querySelectorAll('[data-style-id].fs-elem-selected').forEach(e => e.classList.remove('fs-elem-selected'));
      el.classList.add('fs-elem-selected');
      postToParent('section-selected', { id: sec.dataset.sectionId, type: sec.dataset.sectionType });
      postToParent('element-selected', {
        sectionId: sec.dataset.sectionId,
        styleId: el.getAttribute('data-style-id')
      });
    });
  });
}

function mkDropZone(index, rootId){
  const dz = document.createElement('div');
  dz.className = 'fs-drop-zone';
  dz.innerHTML = `<button class="fs-drop-btn" title="Add section here">+</button>`;
  dz.onclick = () => postToParent('insert-here', { index, rootId: rootId || 'page-root' });
  return dz;
}

/* Listen for messages from the parent editor */
let PG_LAST_DATA = null;
window.addEventListener('message', e => {
  const m = e.data;
  if (!m || m.source !== 'fs-page-editor-parent') return;
  console.log('[edit-iframe] received', m.type, m.payload?.page?.sections?.length, 'sections');
  if (m.type === 'load-page') {
    // Replace the entire page data and re-render
    PG_LAST_DATA = m.payload.page;
    renderFromMessage(m.payload.page, m.payload.business);
  }
});

async function renderFromMessage(page, biz){
  const root = document.getElementById('page-root');
  if (!root) return;
  // In edit mode, render ALL sections including hidden ones, with a "hidden" badge
  const list = page.sections || [];
  root.innerHTML = list.map(s => {
    if (!SECTION_RENDERERS[s.type]) {
      return `<div style="padding:40px;text-align:center;color:#dcbe94;background:rgba(22,12,4,.4);margin:14px 0;border:1px dashed rgba(196,160,112,.25);" class="fs-edit-section" data-section-id="${escHtml(s.id)}" data-section-type="${escHtml(s.type)}">Unknown section type: ${escHtml(s.type)}</div>`;
    }
    let html = renderSection(s, biz);
    if (s.hidden) {
      html = html.replace(/^(\s*<section[^>]*)/, '$1 data-hidden="1"');
    }
    return html;
  }).join('');
  // Mark hidden sections visually
  document.querySelectorAll('[data-hidden="1"]').forEach(el => {
    el.style.opacity = '.4';
    el.style.position = 'relative';
    el.insertAdjacentHTML('afterbegin', '<div style="position:absolute;top:8px;left:8px;background:#1a1108;color:#dcbe94;padding:4px 10px;border:1px solid rgba(220,190,148,.25);border-radius:4px;font-family:var(--cond);font-size:9px;letter-spacing:.2em;text-transform:uppercase;z-index:50">Hidden</div>');
  });
  // Make all .reveal elements visible immediately in edit mode
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  setupEditMode();
  if (biz?.phone) {
    const sc = document.getElementById('sticky-call');
    if (sc) sc.href = 'tel:' + biz.phone.replace(/[^0-9+]/g,'');
  }
}

  window.__fsBootPageEngine = function(){
    injectStyleEngineCss();
    injectPageHeaderCss();
    injectExtraSectionStyles();
    if (IS_EDIT) {
      document.body.classList.add('fs-edit');
      const badge = document.createElement('div');
      badge.className = 'fs-edit-hidden';
      badge.textContent = 'Edit Mode';
      document.body.appendChild(badge);
      console.log('[edit-iframe] ready — posting to parent');
      postToParent('ready', { page: PAGE_ID });
    } else {
      renderPage();
    }
  };
  // Expose engine internals — used by menu/market chrome renderer
  window.__fsPageEngine = {
    SECTION_RENDERERS, renderSection, escHtml, emFormat,
    postToParent, setupEditMode,
    get IS_EDIT(){ return IS_EDIT; },
    injectStyleEngineCss, injectPageHeaderCss, injectExtraSectionStyles
  };
})();
