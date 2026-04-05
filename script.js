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

  // ─── Everything else: scroll-triggered ───
  // Collect all elements that should animate in
  const animTargets = document.querySelectorAll([
    '.trust-item',
    '.section-header',
    '.card',
    '.service-card',
    '.review-card',
    '.fb-card',
    '.property-card',
    '.pm-group',
    '.fcard',
    '.about-grid',
    '.about__img-wrap',
    '.hiw',
    '.owners-row',
    '.owners-featured',
    '.cta-glass-card',
    '.cta-badge',
    '.cta-card-badge',
    '.testimonial-slider',
    '.reviews-header',
    '.faq-item',
    '.contact__grid > *',
    '.contact__form',
    '.footer__top',
    '.footer__bottom'
  ].join(','));

  // Set them all hidden
  gsap.set(animTargets, { opacity: 0, y: 40 });

  // Use ScrollTrigger.batch for performance
  ScrollTrigger.batch(animTargets, {
    start: 'top 90%',
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        overwrite: true
      });
    },
    once: true
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
