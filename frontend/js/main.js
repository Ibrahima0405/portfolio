/* ============================================
   PORTFOLIO — main.js
   ============================================ */

const API = 'https://portfolio-ibrahima.onrender.com/api';/* ── Navigation ────────────────────────────── */
const navbar   = document.getElementById('navbar');
const menuBtn  = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Sticky nav + lien actif au scroll
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 60
    ? 'rgba(5,20,36,0.97)'
    : 'rgba(5,20,36,0.80)';

  // Lien actif
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 80 && top > -sec.offsetHeight + 80) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) link.classList.add('active');
    }
  });
});

// Menu hamburger mobile
menuBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Révélation au scroll ───────────────────── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Chargement des projets depuis l'API ────── */
async function chargerProjets() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  // Affiche loader
  container.innerHTML = `
    <div class="projects-loading">
      <div class="spinner"></div>
      <span>Chargement des projets...</span>
    </div>`;

  try {
    const res  = await fetch(`${API}/projets`);
    const data = await res.json();

    if (!data.success || !data.data.length) {
      container.innerHTML = '<p style="color:var(--muted)">Aucun projet pour le moment.</p>';
      return;
    }

    container.innerHTML = '';
    container.className = 'projects-grid';

    data.data.forEach((projet, i) => {
      const card = document.createElement('article');
      card.className = `project-card reveal${projet.featured ? ' featured' : ''}`;

      const tags = Array.isArray(projet.tags) ? projet.tags : JSON.parse(projet.tags || '[]');
      const tagsHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

      const linksHTML = [
        projet.github_url ? `<a href="${projet.github_url}" target="_blank" rel="noopener" class="project-link">⌥ GitHub</a>` : '',
        projet.demo_url   ? `<a href="${projet.demo_url}"   target="_blank" rel="noopener" class="project-link">↗ Demo</a>`   : ''
      ].join('');

      card.innerHTML = `
        <span class="project-num">0${i + 1}</span>
        ${projet.featured ? '<span class="project-badge">✦ Projet phare</span>' : ''}
        <h3 class="project-title">${projet.titre}</h3>
        <p class="project-desc">${projet.description}</p>
        <div class="project-tags">${tagsHTML}</div>
        ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
      `;

      container.appendChild(card);

      // Observer chaque carte
      setTimeout(() => observer.observe(card), 50 * i);
    });

  } catch (err) {
    console.warn('API non disponible — affichage projets statiques');
    afficherProjetsFallback(container);
  }
}

// Fallback si l'API est hors ligne
function afficherProjetsFallback(container) {
  const projets = [
    {
      titre: 'LetsGo',
      description: 'Application mobile de transport combinant covoiturage, VTC et transports en commun pour le marché sénégalais. Interface chauffeur et client, paiement Orange Money / Wave, suivi GPS en temps réel.',
      tags: ['React Native', 'Expo', 'Node.js', 'MySQL', 'Google Maps', 'JWT'],
      github_url: '#',
      featured: true
    },
    {
      titre: 'Transport API',
      description: 'Backend RESTful complet gérant les trajets, réservations, utilisateurs et notifications. Authentification JWT, déployé sur Render.',
      tags: ['Express.js', 'MySQL', 'JWT', 'Render'],
      github_url: '#',
      featured: false
    }
  ];

  container.innerHTML = '';
  container.className = 'projects-grid';

  projets.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = `project-card reveal${p.featured ? ' featured' : ''}`;
    const tagsHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    card.innerHTML = `
      <span class="project-num">0${i + 1}</span>
      ${p.featured ? '<span class="project-badge">✦ Projet phare</span>' : ''}
      <h3 class="project-title">${p.titre}</h3>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${tagsHTML}</div>
      ${p.github_url ? `<div class="project-links"><a href="${p.github_url}" class="project-link">⌥ GitHub</a></div>` : ''}
    `;
    container.appendChild(card);
    setTimeout(() => observer.observe(card), 50 * i);
  });
}

/* ── Formulaire de contact ──────────────────── */
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';
  feedback.className = 'form-feedback';

  const body = {
    nom:     form.nom.value.trim(),
    email:   form.email.value.trim(),
    sujet:   form.sujet.value.trim(),
    message: form.message.value.trim()
  };

  try {
    const res  = await fetch(`${API}/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      feedback.className = 'form-feedback success';
      feedback.textContent = '✓ Message envoyé avec succès ! Je te répondrai bientôt.';
      form.reset();
    } else {
      const msgs = data.errors ? data.errors.join(' • ') : data.message;
      feedback.className = 'form-feedback error';
      feedback.textContent = '✗ ' + msgs;
    }

  } catch (err) {
    feedback.className = 'form-feedback error';
    feedback.textContent = '✗ Impossible de contacter le serveur. Réessaie ou écris-moi directement par email.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Envoyer le message';
  }
});

/* ── Tracking visites ───────────────────────── */
async function trackerVisite() {
  try {
    await fetch(`${API}/stats/visite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname })
    });
  } catch (_) { /* silencieux */ }
}

/* ── Init ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  chargerProjets();
  trackerVisite();
});
