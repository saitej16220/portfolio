/* ============================================================
   1SCRIPT.JS — ANIMATION SYSTEM (B&W EDITION)
   ============================================================ */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. PAGE LOADER
   ============================================================ */
const loader = $('#page-loader');

function hideLoader() {
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('loader-hidden');
    loader.addEventListener('transitionend', () => {
      loader.remove();
      animateHeroWords();
    }, { once: true });
  }, 950);
}

window.addEventListener('load', hideLoader);

/* ============================================================
   2. HERO WORD REVEAL
   ============================================================ */
function animateHeroWords() {
  const words = $$('.word-wrap');
  // Each .h1-line's children get staggered delays
  const lines = $$('.h1-line');
  let globalIndex = 0;

  lines.forEach((line) => {
    const wraps = $$('.word-wrap', line);
    wraps.forEach((wrap) => {
      wrap.style.animationDelay = `${0.05 + globalIndex * 0.1}s`;
      wrap.style.animationFillMode = 'forwards';
      globalIndex++;
    });
  });

  // Reveal hero-bottom after words
  const bottom = $('.hero-bottom');
  if (bottom) {
    const totalDelay = 0.05 + globalIndex * 0.1 + 0.1;
    bottom.style.transitionDelay = `${totalDelay}s`;
    bottom.style.opacity = '1';
    bottom.style.transform = 'none';
  }

  // Eyebrow reveal
  $$('.hero-top .reveal-fade').forEach((el, i) => {
    el.style.transitionDelay = `${0.05 + i * 0.08}s`;
    el.classList.add('in-view');
  });
}

/* ============================================================
   3. CUSTOM CURSOR
   ============================================================ */
const cursorDot = $('#cursor-dot');
const cursorRing = $('#cursor-ring');

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px)`;
  });

  (function raf() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.transform = `translate(${ringX}px,${ringY}px)`;
    requestAnimationFrame(raf);
  })();

  // Hover states
  $$('a, button, .btn, .skill-card, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-link', 'cursor-expand'));
  });

  $$('.skill-card, .stat-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.remove('cursor-link');
      cursorRing.classList.add('cursor-expand');
    });
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-expand'));
  });
}

/* ============================================================
   4. NAVBAR — SCROLL + ACTIVE SECTION
   ============================================================ */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id], .hero[id]');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  // Scrolled class
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === current);
  });
}

/* ============================================================
   5. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealEls = $$('.reveal-up, .reveal-fade, .reveal-left');

// Apply data-delay attribute as CSS transition-delay
revealEls.forEach(el => {
  const delay = el.dataset.delay || '0';
  el.style.transitionDelay = `${delay}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => {
  // Skip hero-bottom (handled after loader) and hero-top items
  if (!el.closest('.hero-inner') && !el.closest('.hero-top')) {
    revealObserver.observe(el);
  }
});

/* ============================================================
   6. MAGNETIC BUTTONS
   ============================================================ */
$$('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ============================================================
   7. MARQUEE PAUSE ON HOVER
   ============================================================ */
const marquee = $('.hero-marquee');
if (marquee) {
  marquee.addEventListener('mouseenter', () => {
    marquee.style.animationPlayState = 'paused';
  });
  marquee.addEventListener('mouseleave', () => {
    marquee.style.animationPlayState = 'running';
  });
}

/* ============================================================
   8. SMOOTH ANCHOR SCROLL (overrides default)
   ============================================================ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});