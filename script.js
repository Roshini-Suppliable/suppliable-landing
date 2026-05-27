/* =========================================================
   Suppliable — Landing page interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Clean hash URLs (smooth-scroll then strip the # from the address bar)
     Anchor links like <a href="#how"> or <a href="/#how"> keep working — but
     after navigation the URL shows as "/" instead of "/#how". ---- */
  function smoothScrollTo(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 8;
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: top, behavior: 'smooth' });
    } else {
      window.scrollTo(0, top);
    }
  }
  function cleanHashFromURL() {
    if (window.location.hash && history.replaceState) {
      var clean = window.location.pathname + window.location.search;
      history.replaceState(null, '', clean);
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    /* Only intercept in-page anchors: "#foo" or "/#foo" or current-path "#foo" */
    var hashIdx = href.indexOf('#');
    if (hashIdx === -1) return;
    var beforeHash = href.slice(0, hashIdx);
    var isSamePage = beforeHash === '' || beforeHash === '/' || beforeHash === window.location.pathname;
    if (!isSamePage) return;
    var id = href.slice(hashIdx + 1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(target);
    cleanHashFromURL();
  });
  /* If the page loads with a hash (e.g. user came from /privacypolicy/#how),
     scroll to the section then wipe the hash from the URL. */
  if (window.location.hash) {
    var initialTarget = document.getElementById(window.location.hash.slice(1));
    if (initialTarget) {
      /* let layout settle */
      setTimeout(function () {
        smoothScrollTo(initialTarget);
        cleanHashFromURL();
      }, 50);
    }
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Reveal-on-scroll ---- */
  var revealTargets = document.querySelectorAll(
    '.how-steps, .how-phone, .cat-card, .section-head, .bulk-copy, .bulk-form-wrap, .download-inner'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated stat counters ---- */
  var stats = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { statIO.observe(el); });
  }

  /* ---- Bulk quote form validation ---- */
  var form = document.getElementById('bulkForm');
  var success = document.getElementById('formSuccess');

  function setError(input, message) {
    var field = input.closest('.field');
    field.classList.toggle('invalid', !!message);
    var err = field.querySelector('.error');
    if (err) err.textContent = message || '';
  }

  function validateField(input) {
    var val = input.value.trim();
    if (!val) { setError(input, 'This field is required.'); return false; }
    if (input.id === 'bf-phone') {
      var digits = val.replace(/\D/g, '');
      if (digits.length < 10) {
        setError(input, 'Enter a valid 10-digit phone number.');
        return false;
      }
    }
    setError(input, '');
    return true;
  }

  var fields = form.querySelectorAll('input, textarea');
  fields.forEach(function (input) {
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (input.closest('.field').classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    fields.forEach(function (input) {
      if (!validateField(input)) ok = false;
    });
    if (!ok) {
      var firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      phone: form.phone.value.trim(),
      requirement: form.requirement.value.trim()
    };

    var message =
      'Bulk quote enquiry from suppliable.in\n\n' +
      'Name: ' + data.name + '\n' +
      'Company: ' + data.company + '\n' +
      'Phone: ' + data.phone + '\n\n' +
      'Requirement:\n' + data.requirement;

    var waUrl = 'https://wa.me/918778627926?text=' + encodeURIComponent(message);

    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.reset();

    /* slight delay so the user sees the success message before WhatsApp loads */
    setTimeout(function () { window.location.href = waUrl; }, 600);
  });

  /* ---- How it works: step cards drive the embedded app demo ---- */
  var demoFrame = document.getElementById('appDemo');
  var stepBtns = document.querySelectorAll('.step[data-demo]');

  function sendDemo(screen, query) {
    if (!demoFrame || !demoFrame.contentWindow) return;
    demoFrame.contentWindow.postMessage({
      suppliable: true,
      action: 'goto',
      screen: screen,
      query: query || null
    }, '*');
  }

  stepBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      stepBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      sendDemo(btn.dataset.demo, btn.dataset.query);
    });
  });
})();
