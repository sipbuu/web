



const NAMES = ['sip', 'slyqap', 'sipbuu', 'softboysip', 'sipbuu'];

function initRotatingName() {
  const el = document.getElementById('rotating-name');
  if (!el) return;
  let i = 0;
  function rotate() {
    el.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      i = (i + 1) % NAMES.length;
      el.textContent = NAMES[i];
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }, 280);
  }
  setInterval(rotate, 2800);
}



function initCardAnims() {
  const cards = document.querySelectorAll('.card-anim');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(c => obs.observe(c));
}



function initActiveNav() {
  const normalizePath = (value) => {
    if (!value || value === 'index.html') return '/';
    let path = value;
    try {
      path = new URL(value, window.location.origin).pathname;
    } catch {
      path = value;
    }
    if (path.length > 1) path = path.replace(/\/+$/, '');
    return path || '/';
  };

  const path = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    const linkPath = normalizePath(href);
    const isActive = path === linkPath;
    if (isActive) a.classList.add('active');
  });
}



function initHeroAnims() {
  const items = document.querySelectorAll('.anim-init');
  items.forEach((el, i) => {
    el.style.animationDelay = (i * 0.07 + 0.05) + 's';
    el.classList.add('anim-in');
  });
}



function initThemePanel() {
  const btn = document.getElementById('theme-toggle-btn');
  const panel = document.getElementById('theme-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    btn.classList.toggle('active');
  });

  document.querySelectorAll('.swatch[data-accent]').forEach(sw => {
    sw.addEventListener('click', () => {
      const accent = sw.dataset.accent;
      document.body.setAttribute('data-accent', accent);
      localStorage.setItem('sip-accent', accent);
      document.querySelectorAll('.swatch').forEach(s => s.style.outline = '');
      sw.style.outline = '2px solid var(--accent)';
    });
  });

  

  const saved = localStorage.getItem('sip-accent');
  if (saved) {
    document.body.setAttribute('data-accent', saved);
    const sw = document.querySelector(`.swatch[data-accent="${saved}"]`);
    if (sw) sw.style.outline = '2px solid var(--accent)';
  }
}



document.addEventListener('DOMContentLoaded', () => {
  initRotatingName();
  initCardAnims();
  initActiveNav();
  initHeroAnims();
  initThemePanel();
});
