// Footer year
document.querySelectorAll('#year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.main-nav a').forEach(function (a) {
  a.addEventListener('click', function () {
    document.querySelector('.main-nav').classList.remove('open');
  });
});

// Header shadow after scrolling past the hero
var header = document.querySelector('.site-header');
if (header) {
  var onScroll = function () {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll reveal: fade + slide up sections as they enter the viewport
var revealTargets = document.querySelectorAll(
  '.banner, .split, .need-block, .gallery-section, .feature-rows, ' +
  '.logo-strip, .blog-feature, .blog-list, .values-grid, .work-grid, ' +
  '.contact-section, .agenda-hero, .page-hero, .blog-hero, .legal'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(function (el) { io.observe(el); });
}

// Home hero carousel: auto-advance with sliding transition, clickable dots and swipe
(function () {
  var carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  var track  = carousel.querySelector('.hc-track');
  var slides = carousel.querySelectorAll('.hc-slide');
  var dots   = carousel.querySelectorAll('.hc-dot');
  var intervalMs = 3500;
  var current = 0;
  var timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-current * 100) + '%)';
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
    dots.forEach(function (d, n) { d.classList.toggle('is-active', n === current); });
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }
  function start() {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(function () { goTo(current + 1); }, intervalMs);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); start(); });
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  var startX = 0;
  carousel.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    stop();
  }, { passive: true });
  carousel.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    start();
  });

  goTo(0);
  start();
})();

// Photo collage: infinite vertical scroll (sides down, middle up)
var collage = document.querySelector('.photo-collage');
if (collage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  collage.querySelectorAll('.pc-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      var img = clone.querySelector('img');
      if (img) img.setAttribute('alt', '');
      track.appendChild(clone);
    });
  });
  collage.classList.add('pc-ready');
}
