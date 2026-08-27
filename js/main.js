document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  const setMenu = (open) => {
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    mobileMenu?.classList.toggle('open', open);
    header?.classList.toggle('menu-active', open);
    body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenu(opening);
    if (opening) {
      window.setTimeout(() => mobileMenu?.querySelector('a')?.focus({ preventScroll: true }), 210);
    }
  });
  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }

    if (event.key === 'Tab' && menuToggle?.getAttribute('aria-expanded') === 'true' && mobileMenu) {
      const focusable = [...mobileMenu.querySelectorAll('a[href], button:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  document.querySelectorAll('.faq details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq details[open]').forEach((other) => {
        if (other !== detail) other.removeAttribute('open');
      });
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const heroImage = document.querySelector('.hero-image');
  let ticking = false;
  const updateHeroDepth = () => {
    if (heroImage && !reduceMotion.matches && window.scrollY < window.innerHeight) {
      heroImage.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.08, 42)}px`);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroDepth);
      ticking = true;
    }
  }, { passive: true });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxVideo = lightbox?.querySelector('video');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  let lastFocused = null;

  const resetLightboxMedia = () => {
    if (lightboxImage) {
      lightboxImage.hidden = true;
      lightboxImage.src = '';
      lightboxImage.alt = '';
    }
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.hidden = true;
      lightboxVideo.removeAttribute('src');
      lightboxVideo.removeAttribute('poster');
      lightboxVideo.removeAttribute('aria-label');
      lightboxVideo.load();
    }
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('lightbox-open');
    resetLightboxMedia();
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  document.querySelectorAll('.gallery-item, .video-trigger').forEach((item) => {
    item.addEventListener('click', () => {
      if (!lightbox) return;
      lastFocused = item;
      const caption = item.getAttribute('data-caption') || '';
      const videoSource = item.getAttribute('data-video');
      const imageSource = item.getAttribute('data-image');
      resetLightboxMedia();

      if (videoSource && lightboxVideo) {
        lightboxVideo.hidden = false;
        lightboxVideo.src = videoSource;
        lightboxVideo.poster = item.getAttribute('data-poster') || '';
        lightboxVideo.setAttribute('aria-label', caption);
        lightboxVideo.load();
      } else if (imageSource && lightboxImage) {
        lightboxImage.hidden = false;
        lightboxImage.src = imageSource;
        lightboxImage.alt = caption;
      }

      if (lightboxCaption) lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.classList.add('lightbox-open');
      lightboxClose?.focus();
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();

    if (event.key === 'Tab' && lightbox?.classList.contains('open')) {
      const focusable = [lightboxClose, lightboxVideo && !lightboxVideo.hidden ? lightboxVideo : null].filter(Boolean);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  document.querySelectorAll('.track-whatsapp').forEach((link) => {
    link.addEventListener('click', () => {
      const origin = link.getAttribute('data-origin') || 'cta';
      window.dataLayer?.push({ event: 'whatsapp_click', conversion_origin: origin });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { event_category: 'engagement', event_label: origin });
      }
    });
  });

  const whatsappFloat = document.querySelector('.whatsapp-float');
  const floatQuietZones = document.querySelectorAll('.hero, .service-feature, .service-residential, .problems, .process, .video-proof, .gallery, .faq, .final-cta, .site-footer');
  if (whatsappFloat && 'IntersectionObserver' in window) {
    const visibleQuietZones = new Set();
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleQuietZones.add(entry.target);
        else visibleQuietZones.delete(entry.target);
      });
      whatsappFloat.classList.toggle('context-hidden', visibleQuietZones.size > 0);
    }, { threshold: 0.05 });
    floatQuietZones.forEach((section) => floatObserver.observe(section));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
