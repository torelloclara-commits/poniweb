(function () {
  var carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  var track  = carousel.querySelector('.hc-track');
  var slides = carousel.querySelectorAll('.hc-slide');
  var dots   = carousel.querySelectorAll('.hc-dot');
  var INTERVAL = 5000;
  var current = 0;
  var timer = null;

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-current * 100) + '%)';
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === current); });
    dots.forEach(function (d, n) { d.classList.toggle('is-active', n === current); });
  }

  function stop() { clearInterval(timer); }
  function start() {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
  }

  dots.forEach(function (d, n) {
    d.addEventListener('click', function () { goTo(n); start(); });
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
