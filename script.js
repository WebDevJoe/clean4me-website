/* ═══════════════════════════════════════════════════════════════
   PRISTINE — Site Interactivity + GSAP Animations
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Register GSAP ScrollTrigger ───
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }

  // ─── Scroll Progress Bar ───
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
  }

  // ─── Navbar Scroll Effect ───
  const nav = document.querySelector('.nav');
  if (nav) {
    const checkScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // ─── Mobile Menu ───
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Testimonial Slider ───
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (track && dots.length) {
    let current = 0;
    const total = dots.length;

    const goTo = (index) => {
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    let autoplay = setInterval(() => goTo((current + 1) % total), 6000);
    track.closest('.testimonial-slider').addEventListener('mouseenter', () => clearInterval(autoplay));
    track.closest('.testimonial-slider').addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo((current + 1) % total), 6000);
    });
  }

  // ─── How It Works Accordion ───
  const hiwSteps = document.querySelectorAll('.hiw__step');
  if (hiwSteps.length) {
    hiwSteps.forEach(step => {
      step.addEventListener('click', () => {
        hiwSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      });
    });
  }

  // ─── FAQ Accordion ───
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Active nav link highlight ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});


// ═══════════════════════════════════════════════════════════════
//  GSAP ANIMATIONS
// ═══════════════════════════════════════════════════════════════

function initGSAP() {

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ─── Hero: plays immediately on load ───
  const hero = document.querySelector('.hero');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const overline = hero.querySelector('.overline');
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('.hero__content > p');
    const btns = hero.querySelectorAll('.hero__actions .btn');
    const float = hero.querySelector('.hero__float');

    gsap.set([overline, h1, p, btns, float].filter(Boolean), { opacity: 0 });

    if (overline) tl.to(overline, { opacity: 1, y: 0, duration: 0.6 }, 0);
    if (h1) tl.fromTo(h1, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.15);
    if (p) tl.fromTo(p, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.3);
    if (btns.length) tl.fromTo(btns, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 }, 0.45);
    if (float) tl.fromTo(float, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, 0.5);
  }

  // ─── Hero v2: split-layout entrance ───
  const heroV2 = document.querySelector('.hero-v2');
  if (heroV2) {
    const tl2 = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const eyebrow = heroV2.querySelector('.hero-v2__eyebrow');
    const title = heroV2.querySelector('.hero-v2__title');
    const sub = heroV2.querySelector('.hero-v2__sub');
    const ctaItems = heroV2.querySelectorAll('.hero-v2__cta > *');
    const visual = heroV2.querySelector('.hero-v2__visual');

    gsap.set([eyebrow, title, sub, ctaItems, visual].filter(x => x && (x.length === undefined || x.length)), { opacity: 0 });

    if (eyebrow) tl2.fromTo(eyebrow, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0);
    if (title) tl2.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.12);
    if (sub) tl2.fromTo(sub, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.28);
    if (ctaItems.length) tl2.fromTo(ctaItems, { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.55 }, 0.42);
    if (visual) tl2.fromTo(visual, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85 }, 0.2);
  }

  // ─── Everything else: scroll-triggered ───

  // Section headers — stagger overline → heading → paragraph
  gsap.utils.toArray('.section-header').forEach(header => {
    const els = Array.from(header.children);
    if (!els.length) return;
    gsap.set(els, { y: 28, opacity: 0 });
    ScrollTrigger.create({
      trigger: header, start: 'top 88%', once: true,
      onEnter: () => gsap.to(els, {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out'
      })
    });
  });

  // Card grids — scale + fade with stagger inside each group
  const cardGroupSelectors = ['.grid-2', '.grid-3', '.services-grid', '.testimonial-track', '.pm-services'];
  cardGroupSelectors.forEach(sel => {
    gsap.utils.toArray(sel).forEach(group => {
      const cards = group.querySelectorAll('.card, .service-card, .review-card, .service-cta-card, .pm-group, .testimonial-card, .fcard, .testimonial-slide');
      if (!cards.length) return;
      gsap.set(cards, { y: 50, opacity: 0, scale: 0.96 });
      ScrollTrigger.create({
        trigger: group, start: 'top 85%', once: true,
        onEnter: () => gsap.to(cards, {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out'
        })
      });
    });
  });

  // Reviews grid — different selector pattern
  document.querySelectorAll('.grid.grid-3').forEach(grid => {
    const reviews = grid.querySelectorAll('.review-card');
    if (!reviews.length) return;
    gsap.set(reviews, { y: 40, opacity: 0 });
    ScrollTrigger.create({
      trigger: grid, start: 'top 85%', once: true,
      onEnter: () => gsap.to(reviews, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out'
      })
    });
  });

  // Trust bar — slide up with stagger
  gsap.utils.toArray('.trust-bar').forEach(bar => {
    const items = bar.querySelectorAll('.trust-item');
    if (!items.length) return;
    gsap.set(items, { y: 30, opacity: 0 });
    ScrollTrigger.create({
      trigger: bar, start: 'top 88%', once: true,
      onEnter: () => gsap.to(items, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out'
      })
    });
  });

  // About image — clip-path reveal
  gsap.utils.toArray('.about__img-wrap').forEach(wrap => {
    gsap.set(wrap, { clipPath: 'inset(0 100% 0 0)' });
    const img = wrap.querySelector('img');
    if (img) gsap.set(img, { scale: 1.1 });
    ScrollTrigger.create({
      trigger: wrap, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to(wrap, { clipPath: 'inset(0 0% 0 0)', duration: 1.05, ease: 'power3.out' });
        if (img) gsap.to(img, { scale: 1, duration: 1.4, ease: 'power3.out' });
      }
    });
  });

  // How-it-works steps
  gsap.utils.toArray('.steps').forEach(steps => {
    const items = steps.querySelectorAll('.hiw, .step');
    if (!items.length) return;
    gsap.set(items, { y: 35, opacity: 0 });
    ScrollTrigger.create({
      trigger: steps, start: 'top 85%', once: true,
      onEnter: () => gsap.to(items, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.13, ease: 'power3.out'
      })
    });
  });

  // CTA blocks (Facebook CTA, property CTA, glass CTA, reviews header)
  const ctaTargets = document.querySelectorAll('.fb-cta, .property-cta__content, .cta-glass-card, .reviews-header, .contact__form, .contact__details > *');
  ctaTargets.forEach(el => {
    gsap.set(el, { y: 30, opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    });
  });

  // Footer
  gsap.utils.toArray('.footer__main, .footer__bottom').forEach(el => {
    gsap.set(el, { y: 30, opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
    });
  });

  // Number count-up — works for any [data-count] element + reviews score
  function countUp(el, target, suffix = '', decimals = 0, duration = 1.4) {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration, ease: 'power3.out',
      onUpdate: () => {
        el.textContent = (decimals > 0 ? obj.v.toFixed(decimals) : Math.round(obj.v)) + suffix;
      }
    });
  }

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = Number.isInteger(target) ? 0 : 1;
    el.textContent = '0' + (suffix || '');
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => countUp(el, target, suffix, decimals)
    });
  });

  // Reviews header score (4.7) — auto count-up
  const reviewScore = document.querySelector('.reviews-header__score');
  if (reviewScore && !reviewScore.dataset.count) {
    const final = parseFloat(reviewScore.textContent);
    if (!isNaN(final)) {
      reviewScore.textContent = '0.0';
      ScrollTrigger.create({
        trigger: reviewScore, start: 'top 92%', once: true,
        onEnter: () => countUp(reviewScore, final, '', 1, 1.2)
      });
    }
  }

  // Hero v2 visual — gentle scroll parallax
  document.querySelectorAll('.hero-v2__visual').forEach(visual => {
    const img = visual.querySelector('img');
    if (!img) return;
    gsap.to(img, {
      yPercent: 8, ease: 'none',
      scrollTrigger: {
        trigger: visual, start: 'top top', end: 'bottom top', scrub: 0.6
      }
    });
  });

  // ─── Parallax on Hero Background ───
  document.querySelectorAll('.hero__bg img').forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // ─── Card Hover Lift (non-touch) ───
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.card, .service-card, .review-card, .pm-group').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, boxShadow: '0 12px 40px rgba(11,26,48,0.12)', duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: '', duration: 0.3, ease: 'power2.out' });
      });
    });
  }

}

/* ─── Custom Dropdown ─── */
(function initDropdowns() {
  const dropdowns = document.querySelectorAll('[data-dropdown]');
  if (!dropdowns.length) return;

  function closeAll(except) {
    document.querySelectorAll('[data-dropdown][data-open="true"]').forEach(d => {
      if (d === except) return;
      d.dataset.open = 'false';
      const t = d.querySelector('.dropdown__trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(el => {
    const trigger = el.querySelector('.dropdown__trigger');
    const menu = el.querySelector('.dropdown__menu');
    const valueEl = el.querySelector('.dropdown__value');
    const hidden = el.querySelector('input[type="hidden"]');
    const options = el.querySelectorAll('.dropdown__option');
    if (!trigger || !menu || !valueEl || !hidden) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = el.dataset.open === 'true';
      if (open) {
        el.dataset.open = 'false';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        closeAll(el);
        el.dataset.open = 'true';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('dropdown__option--selected'));
        opt.classList.add('dropdown__option--selected');
        valueEl.textContent = opt.textContent.trim();
        valueEl.removeAttribute('data-placeholder');
        hidden.value = opt.dataset.value;
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
        el.dataset.open = 'false';
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();

/* ─── Character Counters ─── */
(function initCounters() {
  document.querySelectorAll('[data-char-counter]').forEach(field => {
    const counter = document.querySelector(`[data-counter-for="${field.id}"]`);
    if (!counter) return;
    const max = parseInt(field.getAttribute('maxlength'), 10) || 0;
    const currentEl = counter.querySelector('[data-current]');
    function update() {
      const len = field.value.length;
      if (currentEl) currentEl.textContent = len;
      counter.dataset.warn = (len >= max * 0.85 && len < max).toString();
      counter.dataset.error = (len >= max).toString();
    }
    field.addEventListener('input', update);
    field.addEventListener('paste', () => setTimeout(update, 0));
    update();
  });
})();

/* ─── Contact Form: validation, honeypot, length safety ─── */
(function initContactForms() {
  const LIMITS = { name: 80, email: 254, phone: 30, message: 1000 };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('input', e => {
      if (e.target.classList.contains('form__input--error') || e.target.classList.contains('form__textarea--error')) {
        e.target.classList.remove('form__input--error', 'form__textarea--error');
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      // Honeypot — bots fill, humans don't. Silent reject.
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== '') return;

      let valid = true;

      // Required
      form.querySelectorAll('[required]').forEach(el => {
        const v = (el.value || '').trim();
        if (!v) {
          el.classList.add(el.tagName === 'TEXTAREA' ? 'form__textarea--error' : 'form__input--error');
          valid = false;
        }
      });

      // Email format
      const email = form.querySelector('input[type="email"]');
      if (email && email.value && !EMAIL_RE.test(email.value.trim())) {
        email.classList.add('form__input--error');
        valid = false;
      }

      // Length safety
      const data = new FormData(form);
      Object.keys(LIMITS).forEach(k => {
        const v = data.get(k);
        if (typeof v === 'string' && v.length > LIMITS[k]) valid = false;
      });

      if (!valid) return;

      // No backend wired yet — show success state.
      const submit = form.querySelector('[type="submit"]');
      if (!submit) return;
      const originalText = submit.textContent;
      submit.textContent = "Thanks — we'll be in touch shortly";
      submit.disabled = true;

      setTimeout(() => {
        form.reset();
        submit.textContent = originalText;
        submit.disabled = false;
        // Reset custom dropdowns
        form.querySelectorAll('[data-dropdown]').forEach(d => {
          const valEl = d.querySelector('.dropdown__value');
          if (valEl) {
            valEl.textContent = 'Select a service';
            valEl.setAttribute('data-placeholder', '');
          }
          d.querySelectorAll('.dropdown__option--selected').forEach(o => o.classList.remove('dropdown__option--selected'));
          d.dataset.open = 'false';
        });
        // Reset counters
        form.querySelectorAll('[data-char-counter]').forEach(f => f.dispatchEvent(new Event('input')));
      }, 4000);
    });
  });
})();
