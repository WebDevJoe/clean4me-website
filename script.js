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

  // ─── Helper: animate elements on scroll ───
  function animateIn(elements, triggerEl, props) {
    if (!elements || (elements.length !== undefined && !elements.length)) return;
    // Mark elements so the catch-all skips them
    if (elements.length !== undefined) {
      Array.from(elements).forEach(el => el.dataset.gsap = '1');
    } else {
      elements.dataset.gsap = '1';
    }
    gsap.set(elements, { opacity: 0, y: props.y || 40, x: props.x || 0, scale: props.scale || 1 });
    gsap.to(elements, {
      y: 0, opacity: 1, x: 0, scale: 1,
      duration: props.duration || 0.7,
      stagger: props.stagger || 0,
      delay: props.delay || 0,
      ease: props.ease || 'power3.out',
      scrollTrigger: {
        trigger: triggerEl,
        start: props.start || 'top 88%',
        once: true
      }
    });
  }

  // ─── Hero Section ───
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroTl = gsap.timeline();
    heroTl
      .fromTo('.hero__content .overline', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('.hero__content h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo('.hero__content p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo('.hero__actions .btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 }, '-=0.2')
      .fromTo('.hero__float', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, '-=0.4');
  }

  // ─── Trust Bar ───
  const trustBar = document.querySelector('.trust-bar');
  if (trustBar) {
    animateIn(trustBar.querySelectorAll('.trust-item'), trustBar, { y: 30, stagger: 0.12, duration: 0.6 });
  }

  // ─── Section Headers ───
  document.querySelectorAll('.section-header').forEach(header => {
    animateIn(header.children, header, { y: 30, stagger: 0.1, duration: 0.6 });
  });

  // ─── Cards (service cards, review cards, fb cards) ───
  const cardSelectors = ['.card', '.service-card', '.review-card', '.fb-card', '.property-card', '.pm-group', '.fcard'];
  cardSelectors.forEach(sel => {
    const cards = document.querySelectorAll(sel);
    if (!cards.length) return;
    const parents = new Set();
    cards.forEach(c => parents.add(c.parentElement));
    parents.forEach(parent => {
      animateIn(parent.querySelectorAll(sel), parent, { y: 40, stagger: 0.12 });
    });
  });

  // ─── About Grid ───
  document.querySelectorAll('.about-grid').forEach(grid => {
    const imgWrap = grid.querySelector('.about__img-wrap');
    const textCol = grid.querySelector('.about__img-wrap ~ div') || grid.querySelector('div:last-child');
    const isFlipped = grid.classList.contains('about-grid--flip');
    if (imgWrap) animateIn(imgWrap, grid, { x: isFlipped ? 60 : -60, y: 0, duration: 0.9 });
    if (textCol && textCol !== imgWrap) animateIn(textCol.children, grid, { y: 30, stagger: 0.08, delay: 0.2 });
  });

  // ─── How It Works ───
  const hiw = document.querySelector('.hiw');
  if (hiw) {
    animateIn(hiw.querySelectorAll('.hiw__header'), hiw, { y: 30 });
    animateIn(hiw.querySelectorAll('.hiw__step'), hiw, { x: -30, y: 0, stagger: 0.15, delay: 0.2 });
    animateIn(hiw.querySelectorAll('.hiw__image'), hiw, { x: 60, y: 0, duration: 0.9, delay: 0.3 });
  }

  // ─── Owners Section (Bento) ───
  document.querySelectorAll('.owners-row').forEach(row => {
    animateIn(row.children, row, { y: 50, stagger: 0.15, duration: 0.8 });
  });

  // ─── Glass CTA ───
  const glassCta = document.querySelector('.cta-glass');
  if (glassCta) {
    const glassCard = glassCta.querySelector('.cta-glass-card');
    if (glassCard) {
      animateIn(glassCard, glassCta, { y: 60, scale: 0.95, duration: 1 });
      animateIn(glassCard.querySelectorAll('.cta-card-badge'), glassCta, { scale: 0.5, y: 0, stagger: 0.15, delay: 0.6, ease: 'back.out(2)' });
    }
    animateIn(glassCta.querySelectorAll('.cta-badge'), glassCta, { scale: 0.5, y: 0, stagger: 0.2, delay: 0.5, ease: 'back.out(2)' });
  }

  // ─── Testimonial Section ───
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) animateIn(testimonialSlider, testimonialSlider, { y: 40, duration: 0.8 });

  // ─── Reviews Header ───
  const reviewsHeader = document.querySelector('.reviews-header');
  if (reviewsHeader) animateIn(reviewsHeader, reviewsHeader, { y: 30 });

  // ─── FAQ Items ───
  const faqList = document.querySelector('.faq-list');
  if (faqList) animateIn(faqList.querySelectorAll('.faq-item'), faqList, { y: 20, stagger: 0.1, duration: 0.5 });

  // ─── Contact Section ───
  const contact = document.querySelector('.contact');
  if (contact) {
    const contactGrid = contact.querySelector('.contact__grid');
    if (contactGrid) {
      const leftCol = contactGrid.children[0];
      const form = contactGrid.querySelector('.contact__form');
      if (leftCol) animateIn(leftCol.children, contact, { y: 30, stagger: 0.1 });
      if (form) animateIn(form, contact, { y: 40, delay: 0.2, duration: 0.8 });
    }
  }

  // ─── Footer ───
  const footer = document.querySelector('.footer');
  if (footer) {
    animateIn(footer.querySelector('.footer__top'), footer, { y: 30 });
  }

  // ─── Animated Counters (GSAP powered) ───
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = prefix + Math.floor(obj.val).toLocaleString() + suffix; }
    });
  });

  // ─── Universal Catch-All ───
  // Animate any section content not already handled by specific animations
  document.querySelectorAll('section, .trust-bar').forEach(section => {
    if (section.classList.contains('hero') || section.querySelector('.hero__bg')) return;
    const container = section.querySelector('.container') || section;
    Array.from(container.children).forEach(child => {
      if (child.dataset.gsap) return;
      animateIn(child, child, { y: 35 });
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
