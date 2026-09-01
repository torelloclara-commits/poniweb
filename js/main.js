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

// Home hero carousel: auto-advance like a slideshow, with clickable dots
var carousel = document.querySelector('.hero-carousel');
if (carousel) {
  var slides = carousel.querySelectorAll('.hc-slide');
  var dots = carousel.querySelectorAll('.hc-dot');
  var current = 0;
  var intervalMs = 5000;
  var timer = null;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function next() { goTo(current + 1); }

  function start() {
    stop();
    timer = window.setInterval(next, intervalMs);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      start();
    });
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
  }
}

// Photo collage columns: gentle scroll parallax — outer columns drift up, middle drifts down
var pcCols = document.querySelectorAll('.pc-col-up, .pc-col-down');
if (pcCols.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var ticking = false;
  var updateParallax = function () {
    var vh = window.innerHeight;
    pcCols.forEach(function (col) {
      var rect = col.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      // progress: -1 (below viewport) .. 0 (centered) .. 1 (above viewport)
      var progress = (vh / 2 - center) / vh;
      progress = Math.max(-1, Math.min(1, progress));
      var dir = col.classList.contains('pc-col-up') ? -1 : 1;
      var shift = dir * progress * 36;
      col.style.transform = 'translateY(' + shift + 'px)';
    });
    ticking = false;
  };
  document.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateParallax);
  updateParallax();
}
