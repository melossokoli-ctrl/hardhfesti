(function () {
  'use strict';

  const FESTIVAL_DATE = new Date('2026-09-04T18:00:00+02:00');

  const ids = {
    days: ['hero-days'],
    hours: ['hero-hours'],
    mins: ['hero-mins'],
    secs: ['hero-secs'],
  };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = FESTIVAL_DATE - now;

    if (diff <= 0) {
      Object.values(ids).flat().forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    ids.days.forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = pad(days); });
    ids.hours.forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = pad(hours); });
    ids.mins.forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = pad(mins); });
    ids.secs.forEach((id) => { const el = document.getElementById(id); if (el) el.textContent = pad(secs); });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  function initHeroVideo() {
    const heroVideo = document.querySelector('.hero__video');
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.volume = 0;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
    heroVideo.removeAttribute('controls');

    const tryPlayHeroVideo = () => {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      heroVideo.volume = 0;
      heroVideo.play().catch(() => {});
    };

    tryPlayHeroVideo();
    heroVideo.addEventListener('loadeddata', tryPlayHeroVideo);
    heroVideo.addEventListener('canplay', tryPlayHeroVideo);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlayHeroVideo();
    });
    window.addEventListener('pageshow', tryPlayHeroVideo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
  } else {
    initHeroVideo();
  }

  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('.hero__content .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });

  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const testimonialDots = document.getElementById('testimonialDots');

  if (testimonialTrack && testimonialDots) {
    const cards = testimonialTrack.querySelectorAll('.testimonial-card');
    let current = 0;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials-carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Përshtypje ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      testimonialDots.appendChild(dot);
    });

    const dots = testimonialDots.querySelectorAll('.testimonials-carousel__dot');

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      testimonialTrack.style.transform = `translateX(-${current * 100}%)`;
      cards.forEach((c, i) => c.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    if (testimonialPrev) testimonialPrev.addEventListener('click', () => goTo(current - 1));
    if (testimonialNext) testimonialNext.addEventListener('click', () => goTo(current + 1));
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'U regjistrua! ✓';
      newsletterForm.reset();
      setTimeout(() => { btn.textContent = original; }, 3000);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Duke dërguar...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'U dërgua! ✓';
        btn.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  document.querySelectorAll('.gallery__item, .shop-grid__item').forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;
        cursor:pointer;animation:fadeIn 0.3s ease;
      `;

      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;';

      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
      });
    });
  });
})();
