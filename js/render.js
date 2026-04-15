/**
 * rajan.portfolio — Rendering Engine
 * Injects data from data.js into the DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderExperience();
  renderSkills();
  renderEducation();
  renderPublications();
  renderProjects();
  renderContact();
  initAnimations();
});

/* ── Hero ────────────────────────────────────────────────── */
function renderHero() {
  const { meta, hero } = portfolioData;
  const section = document.getElementById('home');
  if (!section) return;

  section.innerHTML = `
    <div class="container hero-inner">
      <div class="hero-badge reveal">
        <span class="hero-badge-dot"></span>
        ${hero.badge}
      </div>

      <h1 class="hero-name reveal">
        <span class="name-line name-first">${meta.firstName}</span>
        <span class="name-line name-last">${meta.lastName}</span>
      </h1>

      <div class="hero-role reveal">
        <span class="role-prefix">// </span><span id="typed-role"></span><span class="typing-cursor">▊</span>
      </div>

      <p class="hero-desc reveal">${hero.description}</p>

      <div class="hero-actions reveal">
        ${hero.actions.map(a => `<a href="${a.link}" class="btn-${a.type}">${a.text}</a>`).join('')}
      </div>

      <div class="hero-meta reveal">
        <span class="hero-meta-item">
          <i class="fa-solid fa-location-dot"></i> ${meta.location}
        </span>
        <a href="${meta.github}" target="_blank" class="hero-meta-item hero-meta-link">
          <i class="fa-brands fa-github"></i> ${meta.githubLabel}
        </a>
        <a href="${meta.linkedin}" target="_blank" class="hero-meta-item hero-meta-link">
          <i class="fa-brands fa-linkedin"></i> ${meta.linkedinLabel}
        </a>
      </div>
    </div>

    <div class="hero-scroll-hint" aria-hidden="true">
      <span class="scroll-line"></span>
    </div>
  `;
}

/* ── Experience ──────────────────────────────────────────── */
function renderExperience() {
  const { experience } = portfolioData;
  const section = document.getElementById('experience');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">${experience.tag}</span>
        <h2 class="section-title">${experience.title}</h2>
      </div>
      <div class="timeline">
        ${experience.items.map((item, i) => `
          <article class="timeline-item reveal" style="animation-delay: ${i * 0.1}s">
            <div class="timeline-dot ${item.current ? 'timeline-dot-active' : ''}"></div>
            <div class="timeline-card">
              <div class="timeline-header">
                <div class="timeline-meta">
                  <h3 class="timeline-company">${item.company}</h3>
                  <p class="timeline-role">${item.role}</p>
                  <p class="timeline-location">
                    <i class="fa-solid fa-location-dot"></i> ${item.location}
                  </p>
                </div>
                <span class="timeline-period ${item.current ? 'timeline-period-active' : ''}">
                  ${item.current ? '<span class="period-dot"></span>' : ''}${item.period}
                </span>
              </div>
              <ul class="timeline-bullets">
                ${item.bullets.map(b => `<li class="timeline-bullet">${b}</li>`).join('')}
              </ul>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Skills ──────────────────────────────────────────────── */
function renderSkills() {
  const { skills } = portfolioData;
  const section = document.getElementById('skills');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">${skills.tag}</span>
        <h2 class="section-title">${skills.title}</h2>
      </div>
      <div class="skills-grid">
        ${skills.categories.map((cat, i) => `
          <article class="skill-card reveal" style="animation-delay: ${i * 0.08}s">
            <div class="skill-card-header">
              <div class="skill-card-icon">
                <i class="fa-solid ${cat.icon}"></i>
              </div>
              <h3 class="skill-card-name">${cat.name}</h3>
            </div>
            <div class="skill-tags">
              ${cat.items.map(item => `<span class="skill-pill">${item}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Education ───────────────────────────────────────────── */
function renderEducation() {
  const { education } = portfolioData;
  const section = document.getElementById('education');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">${education.tag}</span>
        <h2 class="section-title">${education.title}</h2>
      </div>
      <div class="edu-grid">
        ${education.items.map((item, i) => `
          <article class="edu-card reveal" style="animation-delay: ${i * 0.1}s">
            <div class="edu-icon">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="edu-content">
              <h3 class="edu-school">${item.school}</h3>
              <p class="edu-degree">${item.degree}</p>
              <div class="edu-footer">
                <span class="edu-location">
                  <i class="fa-solid fa-location-dot"></i> ${item.location}
                </span>
                <span class="edu-period">${item.period}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Publications ────────────────────────────────────────── */
function renderPublications() {
  const { publications } = portfolioData;
  const section = document.getElementById('publications');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">${publications.tag}</span>
        <h2 class="section-title">${publications.title}</h2>
      </div>
      <div class="pub-list">
        ${publications.items.map((pub, i) => `
          <article class="pub-item reveal" style="animation-delay: ${i * 0.1}s">
            <div class="pub-year">${pub.year}</div>
            <div class="pub-content">
              <p class="pub-title">"${pub.title}"</p>
              <p class="pub-authors">${pub.authors}</p>
              <div class="pub-meta">
                <span class="pub-venue">
                  <i class="fa-solid fa-book-open"></i> ${pub.venue}
                </span>
                <span class="pub-details">${pub.details}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Projects ────────────────────────────────────────────── */
function renderProjects() {
  const { projects } = portfolioData;
  const section = document.getElementById('projects');
  if (!section) return;

  const softwareCards = projects.software.items.map((p, i) => `
    <article class="proj-card reveal" style="animation-delay: ${i * 0.08}s">
      <div class="proj-thumb">
        <img src="${p.thumbnail}" alt="${p.title} preview" loading="lazy" onerror="this.parentElement.classList.add('proj-thumb-placeholder')">
      </div>
      <div class="proj-body">
        <div class="proj-header">
          <h3 class="proj-title">${p.title}</h3>
          <span class="proj-period">${p.period}</span>
        </div>
        <p class="proj-desc">${p.description}</p>
        <ul class="proj-bullets">
          ${p.bullets.map(b => `<li class="proj-bullet">${b}</li>`).join('')}
        </ul>
        ${p.link ? `<a href="${p.link}" target="_blank" class="proj-link"><i class="fa-brands fa-github"></i> View Project</a>` : ''}
      </div>
    </article>
  `).join('');

  const engCards = projects.engineering.items.map((p, i) => `
    <article class="proj-card proj-card-eng reveal" style="animation-delay: ${i * 0.08}s">
      <div class="proj-thumb">
        <img src="${p.thumbnail}" alt="${p.title} preview" loading="lazy" onerror="this.parentElement.classList.add('proj-thumb-placeholder')">
      </div>
      <div class="proj-body">
        <div class="proj-header">
          <h3 class="proj-title">${p.title}</h3>
        </div>
        <p class="proj-desc">${p.description}</p>
        <div class="proj-gallery">
          ${p.images.map((src, gi) => `
            <button class="proj-gallery-item" aria-label="View image ${gi + 1}" onclick="openLightbox('${src}', '${p.title}')">
              <img src="${src}" alt="${p.title} image ${gi + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">
            </button>
          `).join('')}
        </div>
      </div>
    </article>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">${projects.tag}</span>
        <h2 class="section-title">${projects.title}</h2>
      </div>

      <div class="proj-tabs reveal">
        <button class="proj-tab proj-tab-active" data-tab="software">
          <i class="fa-solid fa-code"></i> ${projects.software.label}
        </button>
        <button class="proj-tab" data-tab="engineering">
          <i class="fa-solid fa-wrench"></i> ${projects.engineering.label}
        </button>
      </div>

      <div class="proj-tab-panel" id="proj-panel-software">
        <div class="proj-grid proj-grid-software">
          ${softwareCards}
        </div>
      </div>

      <div class="proj-tab-panel proj-tab-panel-hidden" id="proj-panel-engineering">
        <div class="proj-grid proj-grid-eng">
          ${engCards}
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onclick="closeLightbox(event)">
      <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close">&times;</button>
      <img class="lightbox-img" id="lightbox-img" src="" alt="">
      <p class="lightbox-caption" id="lightbox-caption"></p>
    </div>
  `;

  section.querySelectorAll('.proj-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      section.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('proj-tab-active'));
      tab.classList.add('proj-tab-active');
      const target = tab.dataset.tab;
      section.querySelectorAll('.proj-tab-panel').forEach(panel => {
        panel.classList.toggle('proj-tab-panel-hidden', panel.id !== `proj-panel-${target}`);
      });
    });
  });
}

function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = caption;
  cap.textContent = caption;
  lb.classList.add('lightbox-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
  const lb = document.getElementById('lightbox');
  lb.classList.remove('lightbox-open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── Contact ─────────────────────────────────────────────── */
function renderContact() {
  const { contact } = portfolioData;
  const section = document.getElementById('contact');
  if (!section) return;

  section.innerHTML = `
    <div class="container">
      <div class="section-header reveal" style="text-align: center;">
        <span class="section-tag">${contact.tag}</span>
        <h2 class="section-title">${contact.title}</h2>
        <p class="contact-intro reveal">${contact.intro}</p>
      </div>
      <div class="contact-grid reveal">
        ${contact.links.map(link => `
          <a href="${link.href}" target="${link.href.startsWith('http') ? '_blank' : '_self'}" class="contact-card">
            <div class="contact-card-icon">
              <i class="${link.brand ? 'fa-brands' : 'fa-solid'} ${link.icon}"></i>
            </div>
            <div class="contact-card-body">
              <span class="contact-card-label">${link.label}</span>
              <span class="contact-card-value">${link.value}</span>
            </div>
            <i class="fa-solid fa-arrow-up-right contact-card-arrow"></i>
          </a>
        `).join('')}
      </div>
      <p class="contact-resume reveal">
        Prefer a document?
        <a href="Resume_2026.pdf" download class="contact-resume-link">
          <i class="fa-solid fa-file-arrow-down"></i> Download Resume
        </a>
      </p>
    </div>
  `;
}

/* ── Typing Animation ────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const roles = portfolioData.hero.roles;
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const role = roles[ri];
    if (!deleting) {
      el.textContent = role.slice(0, ++ci);
      if (ci === role.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      el.textContent = role.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 95);
  }
  tick();
}

/* ── Scroll Reveal ───────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => observer.observe(el));
}

/* ── Navbar Scroll ───────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  });

  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('open');
      });
    });
  }
}

/* ── Active Nav Link on Scroll ───────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
}

/* ── Init ────────────────────────────────────────────────── */
function initAnimations() {
  initTyping();
  initReveal();
  initNavbar();
  initActiveNav();
}
