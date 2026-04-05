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

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // ─── Defaults ───
  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  // ─── Universal Section Fade-In ───
  // Every section and the trust-bar animate in as they enter view
  document.querySelectorAll('section, .trust-bar').forEach(section => {
    // Skip hero — it has its own entrance animation
    if (section.classList.contains('hero') || section.querySelector('.hero__bg')) return;

    const children = section.querySelectorAll(':scope > .container > *');
    if (children.length) {
      children.forEach(child => {
        gsap.from(child, {
          scrollTrigger: { trigger: child, start: 'top 90%' },
          y: 40, opacity: 0, duration: 0.7
        });
      });
    } else {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: 'top 90%' },
        y: 40, opacity: 0, duration: 0.7
      });
    }
  });

  // ─── Hero Section ───
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroTl = gsap.timeline();
    heroTl
      .from('.hero__content .overline', { y: 30, opacity: 0, duration: 0.6 })
      .from('.hero__content h1', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
      .from('.hero__content p', { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.hero__actions .btn', { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.2')
      .from('.hero__float', { x: 60, opacity: 0, duration: 0.7 }, '-=0.4');
  }

  // ─── Trust Bar ───
  gsap.from('.trust-item', {
    scrollTrigger: { trigger: '.trust-bar', start: 'top 85%' },
    y: 30, opacity: 0, stagger: 0.12, duration: 0.6
  });

  // ─── Section Headers ───
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: { trigger: header, start: 'top 85%' },
      y: 30, opacity: 0, stagger: 0.1, duration: 0.6
    });
  });

  // ─── Cards (service cards, review cards, fb cards) ───
  const cardSelectors = [
    '.card', '.service-card', '.review-card', '.fb-card',
    '.property-card', '.pm-group', '.fcard'
  ];
  cardSelectors.forEach(sel => {
    const cards = document.querySelectorAll(sel);
    if (!cards.length) return;
    // Group cards by parent for stagger
    const parents = new Set();
    cards.forEach(c => parents.add(c.parentElement));
    parents.forEach(parent => {
      const children = parent.querySelectorAll(sel);
      gsap.from(children, {
        scrollTrigger: { trigger: parent, start: 'top 85%' },
        y: 40, opacity: 0, stagger: 0.12, duration: 0.7
      });
    });
  });

  // ─── About Grid ───
  document.querySelectorAll('.about-grid').forEach(grid => {
    const imgWrap = grid.querySelector('.about__img-wrap');
    const textCol = grid.querySelector('.about__img-wrap ~ div') || grid.querySelector('div:last-child');
    if (imgWrap) {
      const isFlipped = grid.classList.contains('about-grid--flip');
      gsap.from(imgWrap, {
        scrollTrigger: { trigger: grid, start: 'top 80%' },
        x: isFlipped ? 60 : -60, opacity: 0, duration: 0.9
      });
    }
    if (textCol && textCol !== imgWrap) {
      gsap.from(textCol.children, {
        scrollTrigger: { trigger: grid, start: 'top 80%' },
        y: 30, opacity: 0, stagger: 0.08, duration: 0.6, delay: 0.2
      });
    }
  });

  // ─── How It Works ───
  const hiw = document.querySelector('.hiw');
  if (hiw) {
    gsap.from('.hiw__header', {
      scrollTrigger: { trigger: hiw, start: 'top 80%' },
      y: 30, opacity: 0, duration: 0.6
    });
    gsap.from('.hiw__step', {
      scrollTrigger: { trigger: hiw, start: 'top 75%' },
      x: -30, opacity: 0, stagger: 0.15, duration: 0.6, delay: 0.2
    });
    gsap.from('.hiw__image', {
      scrollTrigger: { trigger: hiw, start: 'top 75%' },
      x: 60, opacity: 0, duration: 0.9, delay: 0.3
    });
  }

  // ─── Owners Section (Bento) ───
  document.querySelectorAll('.owners-row').forEach(row => {
    gsap.from(row.children, {
      scrollTrigger: { trigger: row, start: 'top 85%' },
      y: 50, opacity: 0, stagger: 0.15, duration: 0.8
    });
  });

  // ─── Owners Featured Card Inner Elements ───
  const featured = document.querySelector('.owners-featured');
  if (featured) {
    gsap.from(featured.querySelectorAll('h3, p, h4, div[style*="display:flex"]'), {
      scrollTrigger: { trigger: featured, start: 'top 80%' },
      y: 20, opacity: 0, stagger: 0.08, duration: 0.5, delay: 0.4
    });
  }

  // ─── Glass CTA ───
  const glassCta = document.querySelector('.cta-glass');
  if (glassCta) {
    const glassCard = glassCta.querySelector('.cta-glass-card');
    if (glassCard) {
      gsap.from(glassCard, {
        scrollTrigger: { trigger: glassCta, start: 'top 80%' },
        y: 60, opacity: 0, scale: 0.95, duration: 1
      });
      gsap.from(glassCard.querySelectorAll('.cta-card-badge'), {
        scrollTrigger: { trigger: glassCta, start: 'top 75%' },
        scale: 0, opacity: 0, stagger: 0.15, duration: 0.5, delay: 0.6,
        ease: 'back.out(2)'
      });
    }
    gsap.from('.cta-badge', {
      scrollTrigger: { trigger: glassCta, start: 'top 80%' },
      scale: 0, opacity: 0, stagger: 0.2, duration: 0.6, delay: 0.5,
      ease: 'back.out(2)'
    });
  }

  // ─── Testimonial Section ───
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    gsap.from(testimonialSlider, {
      scrollTrigger: { trigger: testimonialSlider, start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8
    });
  }

  // ─── Reviews Header ───
  const reviewsHeader = document.querySelector('.reviews-header');
  if (reviewsHeader) {
    gsap.from(reviewsHeader, {
      scrollTrigger: { trigger: reviewsHeader, start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.7
    });
  }

  // ─── FAQ Items ───
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-list', start: 'top 85%' },
    y: 20, opacity: 0, stagger: 0.1, duration: 0.5
  });

  // ─── Contact Section ───
  const contact = document.querySelector('.contact');
  if (contact) {
    const contactGrid = contact.querySelector('.contact__grid');
    if (contactGrid) {
      const leftCol = contactGrid.children[0];
      const form = contactGrid.querySelector('.contact__form');
      if (leftCol) {
        gsap.from(leftCol.children, {
          scrollTrigger: { trigger: contact, start: 'top 80%' },
          y: 30, opacity: 0, stagger: 0.1, duration: 0.6
        });
      }
      if (form) {
        gsap.from(form, {
          scrollTrigger: { trigger: contact, start: 'top 80%' },
          y: 40, opacity: 0, duration: 0.8, delay: 0.2
        });
      }
    }
  }

  // ─── Footer ───
  const footer = document.querySelector('.footer');
  if (footer) {
    gsap.from('.footer__brand', {
      scrollTrigger: { trigger: footer, start: 'top 90%' },
      y: 30, opacity: 0, duration: 0.6
    });
    gsap.from('.footer__grid > div', {
      scrollTrigger: { trigger: footer, start: 'top 90%' },
      y: 30, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.15
    });
  }

  // ─── Animated Counters (GSAP powered) ───
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        el.textContent = prefix + Math.floor(obj.val).toLocaleString() + suffix;
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
    document.querySelectorAll('.card, .service-card, .review-card, .pm-group, .bento__card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, boxShadow: '0 12px 40px rgba(11,26,48,0.12)', duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: '', duration: 0.3, ease: 'power2.out' });
      });
    });
  }

}
