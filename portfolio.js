const labels = { projects: 'Project', orgs: 'Organization', entre: 'Entrepreneurship' };
const grid = document.getElementById('project-grid');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
grid.innerHTML = PROJECTS.map((project, index) => `<button class="project-card" data-open-project="${project.id}" data-category="${project.category}"><div class="project-cover">${project.logo ? `<img src="${project.logo}" alt="Wild Bill Pickles logo" loading="lazy">` : `<span class="project-number">0${index + 1}</span><span>${escapeHTML(project.location)}</span>`}</div><div class="project-body"><div class="eyebrow">${labels[project.category]}</div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p><div class="project-role"><span>${escapeHTML(project.role)}</span><span aria-hidden="true">↗</span></div></div></button>`).join('');
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('selected', selected); item.setAttribute('aria-pressed', String(selected)); });
  grid.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
const dialog = document.getElementById('project-dialog');
let previousFocus;
let returnHash = '#work-carousel';
function showProject(id) {
  const project = PROJECTS.find(item => item.id === id);
  if (!project) return;
  if (!dialog.open) previousFocus = document.activeElement;
  for (const [key, value] of Object.entries({category: labels[project.category], title: project.title, org: project.organization, description: project.description, outcome: project.outcome})) document.getElementById(`detail-${key}`).textContent = value;
  document.getElementById('detail-meta').innerHTML = [project.role, project.date, project.location].map(value => `<span>${escapeHTML(value)}</span>`).join('');
  document.getElementById('detail-skills').innerHTML = project.skills.map(value => `<span>${escapeHTML(value)}</span>`).join('');
  const action = document.getElementById('detail-action'); action.hidden = !project.documentUrl;
  if (project.documentUrl) action.href = project.documentUrl;
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-open-project]');
  if (!button) return;
  returnHash = location.hash || '#work-carousel';
  location.hash = `/project/${button.dataset.openProject}`;
});
function syncRoute() { const match = location.hash.match(/^#\/project\/([\w-]+)$/); if (match) showProject(match[1]); else if (dialog.open) dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (location.hash.startsWith('#/project/')) history.replaceState(null, '', location.pathname + location.search + returnHash); if (previousFocus instanceof HTMLElement) previousFocus.focus({preventScroll:true}); });
document.getElementById('detail-action').addEventListener('click', () => dialog.close());
window.addEventListener('hashchange', syncRoute); syncRoute();
const navLinks = [...document.querySelectorAll('.dock a')];
const sectionLinks = {'hero':'#hero','now':'#now','work-carousel':'#work-carousel','wild-bill':'#work-carousel','story':'#story','connect':'#connect','resume':'#connect'};
const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible) return; navLinks.forEach(link => { const active = link.getAttribute('href') === sectionLinks[visible.target.id]; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); }, {rootMargin:'-15% 0px -45% 0px',threshold:0});
Object.keys(sectionLinks).forEach(id => observer.observe(document.getElementById(id)));
document.getElementById('year').textContent = new Date().getFullYear();
