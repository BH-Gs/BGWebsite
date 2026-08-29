// =========================================================
// BG — Thank You
// Same trimmed set as ComingSoon.js, minus the newsletter
// handler — there's no form on this page.
// =========================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --------- Page boot loader ----------
(function pageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  if (prefersReducedMotion) {
    loader.remove();
    return;
  }

  const MIN_DISPLAY_MS = 3000;
  const MAX_WAIT_MS = 4500;
  const start = Date.now();
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, MIN_DISPLAY_MS - (Date.now() - start));
    setTimeout(() => {
      loader.classList.add('loader-done');
      setTimeout(() => loader.remove(), 600);
    }, wait);
  }

  window.addEventListener('load', finish);
  setTimeout(finish, MAX_WAIT_MS);
})();

// --------- Sticky nav on scroll ----------
window.addEventListener('scroll', function () {
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  document.querySelectorAll('nav').forEach((navEl) => {
    navEl.classList.toggle('sticky', scrolled > 0);
  });
}, { passive: true });

// --------- Scroll progress bar ----------
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    scrollProgress.style.width = `${pct}%`;
  }, { passive: true });
}

// --------- Hero terminal boot sequence ----------
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (Number.isNaN(target)) return;

  if (prefersReducedMotion) {
    el.textContent = String(target);
    return;
  }

  const duration = 700;
  const start = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    el.textContent = String(Math.floor(progress * target));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(step);
}

(function bootTerminal() {
  const lines = document.querySelectorAll('#terminalBody .t-line');
  if (!lines.length) return;

  if (prefersReducedMotion) {
    lines.forEach((line) => {
      line.classList.add('shown');
      const counter = line.querySelector('[data-count]');
      if (counter) animateCount(counter);
    });
    return;
  }

  lines.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add('shown');
      const counter = line.querySelector('[data-count]');
      if (counter) animateCount(counter);
    }, 300 + 240 * i);
  });
})();

// --------- Ambient particles (page-wide background animation) ----------
if (!prefersReducedMotion) {
  const particleField = document.getElementById('particleField');
  if (particleField) {
    const PARTICLE_COUNT = 26;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('span');
      const isCircuit = i % 2 === 0;
      particle.className = `spark ${isCircuit ? 'spark-circuit' : 'spark-ember'}`;
      const size = 2.5 + Math.random() * 4;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 90}px`);
      particle.style.animationDelay = `${Math.random() * 7}s`;
      particle.style.animationDuration = `${7 + Math.random() * 6}s`;
      particleField.appendChild(particle);
    }
  }
}

// --------- Cursor-tracked light ----------
const cursorLight = document.getElementById('cursorLight');
if (cursorLight && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorLight.style.left = `${e.clientX}px`;
    cursorLight.style.top = `${e.clientY}px`;
  });
}

// --------- Reveal-on-scroll ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// --------- Back to top ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// --------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());