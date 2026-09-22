const labels = { projects: 'Project', orgs: 'Organization', entre: 'Entrepreneurship' };
const grid = document.getElementById('project-carousel'); // the "stage": holds the cards, sits inside .carousel-viewport
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
grid.innerHTML = PROJECTS.map((project, index) => {
  const media = project.image ? `<img class="cover" src="${project.image}" alt="" loading="lazy">` : project.logo ? `<img class="logo" src="${project.logo}" alt="" loading="lazy">` : `<span class="card-number" aria-hidden="true">0${index + 1}</span>`;
  return `<button class="project-card${project.theme ? ' ' + project.theme : ''}" data-open-project="${project.id}" data-category="${project.category}" style="--cover:${project.color}"><span class="card-media">${media}</span><span class="card-top"><span class="identity"><small>${escapeHTML(project.role)}</small></span></span><span class="card-bottom"><span><span class="card-title">${escapeHTML(project.title)}</span><span class="card-tagline">${escapeHTML(project.tagline)}</span></span><span class="arrow" aria-hidden="true">↗</span></span></button>`;
}).join('');

// Selected work: 3D cover-flow wheel. `activeIndex` is a position within the currently-filtered
// subset of cards (not the full PROJECTS list), and every card's transform is computed from its
// position relative to that index -- there is no scrollable track, and the wheel loops in both
// directions instead of stopping at the first/last project.
const allCards = [...grid.querySelectorAll('.project-card')];
let visibleCards = allCards;
let activeIndex = 0;

// Base transform per "ring" out from the active card (index 0 = active itself). Anything farther
// out than the last defined ring uses FAR_LEVEL, which is fully transparent and non-interactive --
// present mainly so a 6-card wheel doesn't show an abrupt gap on its "back" side.
const LEVELS = [
  {x: 0, z: 0, ry: 0, scale: 1, opacity: 1, zi: 50},
  {x: 62, z: -180, ry: 25, scale: .88, opacity: .7, zi: 40},
  {x: 105, z: -350, ry: 35, scale: .75, opacity: .25, zi: 20},
];
const FAR_LEVEL = {x: 130, z: -520, ry: 42, scale: .6, opacity: 0, zi: 5};

function layout() {
  const n = visibleCards.length;
  allCards.forEach(card => { card.hidden = !visibleCards.includes(card); });
  visibleCards.forEach((card, i) => {
    let rel = i - activeIndex;
    if (n > 1) { rel = ((rel % n) + n) % n; if (rel > n / 2) rel -= n; }
    const sign = Math.sign(rel);
    const level = Math.abs(rel) < LEVELS.length ? LEVELS[Math.abs(rel)] : FAR_LEVEL;
    const x = level.x * sign, ry = -level.ry * sign; // next (positive rel) turns away to the left, i.e. negative rotateY
    card.style.transform = `translate(-50%, -50%) translateX(${x}%) translateZ(${level.z}px) rotateY(${ry}deg) scale(${level.scale})`;
    card.style.opacity = String(level.opacity);
    card.style.zIndex = String(level.zi);
    card.style.pointerEvents = level.opacity > 0 ? 'auto' : 'none';
    card.classList.toggle('is-active', rel === 0);
    card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
    card.tabIndex = rel === 0 ? 0 : -1;
    card.dataset.rel = String(rel);
  });
}
function goTo(index) {
  if (expandedProjectId) return; // wheel navigation is paused while a case study is open
  const n = visibleCards.length;
  if (!n) return;
  activeIndex = ((index % n) + n) % n;
  layout();
}
function step(direction) { goTo(activeIndex + direction); }

layout(); // all six cards stay in the wheel; the old filter pills were removed with the intro bar
const videoBox = document.getElementById('detail-videos');
function videoEmbed(entry) {
  const item = typeof entry === 'string' ? {url: entry} : entry;
  const url = String(item.url || '').trim();
  let src = '', isFile = false, match;
  if ((match = url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/))) src = `https://www.youtube-nocookie.com/embed/${match[1]}`;
  else if ((match = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(?:.*\/)?(\d+)/))) src = `https://player.vimeo.com/video/${match[1]}`;
  else if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) { src = url; isFile = true; }
  else return '';
  const title = escapeHTML(item.title || 'Project video');
  const ratio = /^\d+\s*\/\s*\d+$/.test(item.ratio || '') ? item.ratio : '16 / 9';
  const [w, h] = ratio.split('/').map(Number);
  const media = isFile
    ? `<video controls preload="metadata" playsinline src="${escapeHTML(src)}"${item.poster ? ` poster="${escapeHTML(item.poster)}"` : ''}></video>`
    : `<iframe src="${src}" title="${title}" loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  return `<figure class="video${h > w ? ' tall' : ''}"><div class="video-frame" style="aspect-ratio:${ratio}">${media}</div>${item.title ? `<figcaption>${title}</figcaption>` : ''}</figure>`;
}
// ---------------------------------------------------------------------------------------------
// Case study: ONE reusable expansion system shared by all six carousel projects. Clicking the
// active (centered) card opens a full vertical case study below the carousel, not a modal --
// the wheel (and its other cards) stays visible above it. Every section below is
// conditional: a project with only a title/image/description renders just that, with no empty
// headings for challenge/process/outcome/learnings/images/videos/documents/links until that data
// is actually added to its entry in projects.js.
// ---------------------------------------------------------------------------------------------
let expandedProjectId = null;
const caseStudyEl = document.getElementById('case-study');
const caseStudyContent = document.getElementById('case-study-content');

function csSection(heading, bodyHtml) {
  return bodyHtml ? `<div class="cs-section"><h3>${heading}</h3>${bodyHtml}</div>` : '';
}
function renderCaseStudy(project) {
  const hasStory = Boolean(project.story && project.story.length);
  const meta = [project.role, project.date, project.location].filter(Boolean).map(value => `<span>${escapeHTML(value)}</span>`).join('');
  const skills = (project.skills || []).map(value => `<span>${escapeHTML(value)}</span>`).join('');
  const story = hasStory ? project.story.map(part => `<div class="story-row"><p>${escapeHTML(part.text)}</p><div class="story-photos count-${part.photos.length}">${part.photos.map(([src, alt]) => `<img src="${src}" alt="${escapeHTML(alt)}" loading="lazy">`).join('')}</div></div>`).join('') : '';
  const gallery = (project.images || []).map(entry => {
    const src = typeof entry === 'string' ? entry : entry.src;
    const caption = typeof entry === 'string' ? '' : (entry.caption || '');
    if (!src) return '';
    return `<figure><img src="${src}" alt="${escapeHTML(caption)}" loading="lazy">${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}</figure>`;
  }).join('');
  const videos = (project.videos || []).map(videoEmbed).join('');
  const docs = (project.documents || []).map(doc => doc && doc.url ? `<a href="${escapeHTML(doc.url)}" target="_blank" rel="noopener noreferrer"><span class="cs-doc-text"><strong>${escapeHTML(doc.title || 'Document')}</strong>${doc.subtitle ? `<span class="cs-doc-subtitle">${escapeHTML(doc.subtitle)}</span>` : ''}</span>${doc.type ? `<span class="cs-doc-badge">${escapeHTML(doc.type)}<span aria-hidden="true">↗</span></span>` : ''}</a>` : '').join('');
  const links = (project.links || []).map(link => link && link.url ? `<a href="${escapeHTML(link.url)}" target="_blank" rel="noopener"><span>${escapeHTML(link.label || link.url)}</span><span aria-hidden="true">↗</span></a>` : '').join('');
  const action = project.documentUrl ? `<a class="button dark" href="${escapeHTML(project.documentUrl)}"${project.documentUrl.startsWith('#') ? '' : ' target="_blank" rel="noopener"'}>${escapeHTML(project.documentLabel || 'View project')} ↗</a>` : '';

  return `<div class="cs-hero${project.theme ? ' ' + project.theme : ''}" style="--cover:${project.color || '#23201c'}">
      <p class="eyebrow">${escapeHTML(labels[project.category] || '')}</p>
      <h2>${escapeHTML(project.title)}</h2>
      ${project.organization ? `<p>${escapeHTML(project.organization)}</p>` : ''}
    </div>
    <div class="cs-body">
      ${meta ? `<div class="cs-meta">${meta}</div>` : ''}
      ${!hasStory ? csSection('Project Overview', project.description ? project.description.split(/\n\s*\n/).map(part => `<p>${escapeHTML(part.trim())}</p>`).join('') : '') : ''}
      ${!hasStory ? csSection('The challenge', project.challenge ? `<p>${escapeHTML(project.challenge)}</p>` : '') : ''}
      ${!hasStory ? csSection('My approach', project.process ? `<p>${escapeHTML(project.process)}</p>` : '') : ''}
      ${hasStory ? `<div class="cs-section"><div class="story">${story}</div></div>` : ''}
      ${!hasStory ? csSection('Outcome', project.outcome ? `<p>${escapeHTML(project.outcome)}</p>` : '') : ''}
      ${!hasStory ? csSection('What I learned', project.learnings ? `<p>${escapeHTML(project.learnings)}</p>` : '') : ''}
      ${gallery ? `<div class="cs-section"><h3>Photos</h3><div class="cs-gallery">${gallery}</div></div>` : ''}
      ${videos ? `<div class="cs-section"><h3>Video</h3><div class="videos">${videos}</div></div>` : ''}
      ${docs ? `<div class="cs-section"><h3>Related Work</h3><div class="cs-docs">${docs}</div></div>` : ''}
      ${links ? `<div class="cs-section"><h3>Links</h3><div class="cs-links">${links}</div></div>` : ''}
      ${skills ? `<div class="tags">${skills}</div>` : ''}
      ${action ? `<div class="cs-actions">${action}</div>` : ''}
    </div>`;
}

function expandProject(id) {
  const project = PROJECTS.find(item => item.id === id);
  if (!project || expandedProjectId === id) return;
  expandedProjectId = id;
  caseStudyContent.innerHTML = renderCaseStudy(project);
  caseStudyContent.scrollTop = 0;
  caseStudyEl.hidden = false;
  caseStudyEl.offsetHeight; // force a reflow so the opacity:0 resting state paints before .cs-open transitions it
  caseStudyEl.classList.add('cs-open');
  history.replaceState(null, '', location.pathname + location.search + `#/case-study/${id}`);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  caseStudyEl.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'});
}
function collapseProject() {
  if (!expandedProjectId) return;
  expandedProjectId = null;
  caseStudyEl.classList.remove('cs-open');
  setTimeout(() => { if (!expandedProjectId) { caseStudyEl.hidden = true; caseStudyContent.innerHTML = ''; } }, 420);
  if (location.hash.startsWith('#/case-study/')) history.replaceState(null, '', location.pathname + location.search + '#work-carousel');
}
document.querySelector('.case-study-close').addEventListener('click', collapseProject);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && expandedProjectId) collapseProject(); });

const dialog = document.getElementById('project-dialog');
let previousFocus;
let returnHash = '#work-carousel';
function showProject(id) {
  const project = PROJECTS.find(item => item.id === id);
  if (!project) return;
  if (!dialog.open) previousFocus = document.activeElement;
  for (const [key, value] of Object.entries({category: labels[project.category], title: project.title, org: project.organization, description: project.description, outcome: project.outcome})) document.getElementById(`detail-${key}`).textContent = value;
  document.getElementById('detail-meta').innerHTML = [project.role, project.date, project.location].filter(Boolean).map(value => `<span>${escapeHTML(value)}</span>`).join('');
  document.getElementById('detail-skills').innerHTML = project.skills.map(value => `<span>${escapeHTML(value)}</span>`).join('');
  const action = document.getElementById('detail-action'); action.hidden = !project.documentUrl;
  if (project.documentUrl) action.href = project.documentUrl;
  const outcome = document.getElementById('detail-outcome');
  outcome.hidden = outcome.previousElementSibling.hidden = !project.outcome;
  videoBox.innerHTML = (project.videos || []).map(videoEmbed).join('');
  videoBox.hidden = !videoBox.innerHTML;
  const themed = project.theme === 'wbp';
  dialog.classList.toggle('wbp', themed);
  document.getElementById('detail-bar').hidden = !themed;
  document.getElementById('detail-hero').hidden = !themed;
  document.getElementById('detail-category').hidden = themed;
  document.getElementById('detail-bar-label').textContent = labels[project.category];
  const story = document.getElementById('detail-story');
  story.hidden = !project.story;
  document.getElementById('detail-generic').hidden = Boolean(project.story);
  story.innerHTML = (project.story || []).map(part => `<div class="story-row"><p>${escapeHTML(part.text)}</p><div class="story-photos count-${part.photos.length}">${part.photos.map(([src, alt]) => `<img src="${src}" alt="${escapeHTML(alt)}" loading="lazy">`).join('')}</div></div>`).join('');
  action.textContent = `${project.documentLabel} ↗`;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.dialog-scroll').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-open-project]');
  if (!button) return;
  if (carouselDragMoved) { carouselDragMoved = false; return; } // a click that ends a carousel drag, not a real click
  if (button.classList.contains('project-card')) {
    if (expandedProjectId) return; // a case study is already open; ignore further clicks on the wheel
    if (button.dataset.rel !== '0') { goTo(visibleCards.indexOf(button)); return; } // side card -> recenter
    const id = button.dataset.openProject;
    // Most cards morph into their in-page case study; a project marked detailView:'dialog' in
    // projects.js instead opens the same dialog the journey/spotlight links use.
    if (!PROJECTS.some(item => item.id === id && item.detailView === 'dialog')) { expandProject(id); return; }
  }
  returnHash = location.hash || '#work-carousel';
  location.hash = `/project/${button.dataset.openProject}`;
});
function syncRoute() {
  const caseMatch = location.hash.match(/^#\/case-study\/([\w-]+)$/);
  if (caseMatch) { expandProject(caseMatch[1]); return; }
  const match = location.hash.match(/^#\/project\/([\w-]+)$/);
  if (match) showProject(match[1]); else if (dialog.open) dialog.close();
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { videoBox.innerHTML = ''; document.body.style.overflow = ''; if (location.hash.startsWith('#/project/')) history.replaceState(null, '', location.pathname + location.search + returnHash); if (previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true}); });
document.getElementById('detail-action').addEventListener('click', () => dialog.close());
window.addEventListener('hashchange', syncRoute); syncRoute();
const navLinks = [...document.querySelectorAll('.dock a')];
const sectionLinks = {'hero':'#hero','work-carousel':'#work-carousel','wild-bill':'#work-carousel','story':'#story','connect':'#connect','resume':'#connect'};
const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible) return; navLinks.forEach(link => { const active = link.getAttribute('href') === sectionLinks[visible.target.id]; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); }, {rootMargin:'-15% 0px -45% 0px',threshold:0});
Object.keys(sectionLinks).forEach(id => observer.observe(document.getElementById(id)));
document.getElementById('year').textContent = new Date().getFullYear();

// Cover-flow wheel: drag/swipe (mouse + touch, via Pointer Events) and mouse-wheel navigation.
// A drag/swipe only advances the wheel once it clears a real movement threshold, so a small
// accidental nudge doesn't spin it; a completed drag also suppresses the click that would
// otherwise fire on release (reusing the same carouselDragMoved flag the card-click handler
// above already checks).
let carouselDragMoved = false;
(() => {
  const viewport = grid.parentElement; // .carousel-viewport
  const SWIPE_THRESHOLD = 50;
  let dragging = false, dragStartX = 0, dragMoved = false;

  grid.addEventListener('pointerdown', event => {
    if (expandedProjectId) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStartX = event.clientX;
    grid.classList.add('dragging');
    grid.setPointerCapture(event.pointerId);
  });
  grid.addEventListener('pointermove', event => {
    if (!dragging) return;
    if (Math.abs(event.clientX - dragStartX) > 6) dragMoved = true;
  });
  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    grid.classList.remove('dragging');
    if (grid.hasPointerCapture?.(event.pointerId)) grid.releasePointerCapture(event.pointerId);
    const dx = event.clientX - dragStartX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1); // swipe left -> next, swipe right -> prev
    carouselDragMoved = dragMoved;
  }
  grid.addEventListener('pointerup', endDrag);
  grid.addEventListener('pointercancel', endDrag);
  grid.addEventListener('dragstart', event => event.preventDefault());

  // Wheel-over-carousel steps to the next/previous project instead of the browser's default
  // scroll, but only for the one gesture that crosses the threshold -- it's then locked for
  // ~600ms (during which normal wheel events pass through untouched), so the page can still be
  // scrolled past this section rather than getting stuck here.
  let wheelLocked = false;
  viewport.addEventListener('wheel', event => {
    if (expandedProjectId || wheelLocked) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 12) return;
    event.preventDefault();
    step(delta > 0 ? 1 : -1);
    wheelLocked = true;
    setTimeout(() => { wheelLocked = false; }, 650);
  }, {passive: false});
})();

// Hero photo -> sand scroll transition. The photo very subtly scales up (1 -> 1.05) and a gradient
// permanently anchored to the BOTTOM of the photo (.hero-sand-blend: transparent -> half-strength
// sand -> solid var(--paper), the exact color #work-carousel already sits on) grows from invisible
// to fully opaque as the user scrolls through the hero, so the photo's own bottom edge visibly
// dissolves into the sand color -- no sliding panel, no hard line. The gradient's height is locked
// to ~32% of the photo's own rendered height on every frame. The "Today, I'm working on
// projects..." intro then reveals underneath. Mirrors a Motion useScroll/useTransform setup, done
// in plain JS since this is a static site with no build step to add motion/react to.
(() => {
  const heroSection = document.getElementById('hero');
  const heroPhoto = heroSection && heroSection.querySelector('.hero-photo');
  const heroBlend = heroSection && heroSection.querySelector('.hero-sand-blend');
  if (!heroSection || !heroPhoto || !heroBlend) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS alone covers the reduced-motion state

  const clamp01 = value => Math.min(1, Math.max(0, value));
  const mix = (from, to, t) => from + (to - from) * t;

  function applyScroll() {
    const rect = heroSection.getBoundingClientRect();
    // 0 when the hero's top reaches the viewport top, 1 once its bottom does (its own scroll distance).
    const progress = clamp01(-rect.top / rect.height);

    heroPhoto.style.transform = `scale(${mix(1, 1.05, progress)})`;

    // The blend gradient never moves -- it always sits at the photo's bottom edge, ~32% of its
    // height. What changes with scroll is purely its strength (opacity), so the photo visibly
    // "dissolves" into the sand color as you scroll, exactly like the requested sequence:
    // PHOTO -> PHOTO+slight tint -> PHOTO+stronger blend -> SAND.
    heroBlend.style.height = `${rect.height * 0.32}px`;
    heroBlend.style.opacity = String(progress);
  }
  applyScroll();

  // Run on every animation frame while (and only while) the hero is anywhere near the viewport,
  // rather than reacting to 'scroll' events. This keeps it in sync with scroll, resize, zoom, and
  // anything else that moves the hero, with no separate event wiring to fall out of sync.
  let rafId = null;
  function loop() { applyScroll(); rafId = requestAnimationFrame(loop); }
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      heroPhoto.style.willChange = 'transform';
      heroBlend.style.willChange = 'opacity';
      if (rafId === null) rafId = requestAnimationFrame(loop);
    } else {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      heroPhoto.style.willChange = heroBlend.style.willChange = 'auto';
    }
  });
  heroObserver.observe(heroSection);
})();

// Editorial cards (the statement card before the carousel, the journey intro card, and any more
// added later): a plain, one-time "enter the viewport -> settle into place" reveal (opacity 0->1,
// translateY 30px->0, handled by the .revealed class in styles.css). One shared observer for all
// of them rather than one per card. Does not touch the journey section's own scroll/reveal
// behavior below (the location-by-location experience is plain scroll + CSS, untouched here).
(() => {
  const cards = document.querySelectorAll('.editorial-card');
  if (!cards.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { cards.forEach(card => card.classList.add('revealed')); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
  }, {threshold: 0.2});
  cards.forEach(card => observer.observe(card));
})();
