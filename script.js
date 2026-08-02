(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    items.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", Math.min(i % 6, 5) * 40 + "ms");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  function initStatCounters() {
    var stats = document.querySelectorAll(".stat-number[data-target]");
    if (!stats.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 900;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      stats.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    stats.forEach(function (el) { observer.observe(el); });
  }

  function initHeroTyping() {
    var el = document.getElementById("heroQuery");
    if (!el) return;

    var text = el.getAttribute("data-text") || "";
    var cursor = document.createElement("span");
    cursor.className = "cursor";

    if (reduceMotion) {
      el.textContent = text;
      el.appendChild(cursor);
      return;
    }

    el.textContent = "";
    var i = 0;

    function typeNext() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(typeNext, 18 + Math.random() * 28);
      }
    }

    typeNext();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initStatCounters();
    initHeroTyping();
  });
})();
