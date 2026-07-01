/* ═══════════════════════════════════════════════════════════════════════
   AURUM — landing page interactions. Vanilla JS, no dependencies.
   ═══════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════
     COMMERCIAL CONFIG — the single source of truth. Edit these only.
     ═══════════════════════════════════════════════════════════════════ */
  const CONFIG = {
    productName:     'The Executive — 24K',
    unitPrice:       99,
    currencySymbol:  '$',
    edition:         20,
    remaining:       3,       // pieces left
    dropDurationHrs: 71,      // countdown length from first visit

    // ── Real checkout ────────────────────────────────────────────────
    // Paste your Stripe Payment Link (Stripe Dashboard → Payment Links).
    // Leave '' to keep the front-end "reservation" flow (no real payment).
    checkoutUrl: '',          // e.g. 'https://buy.stripe.com/eVa5kD0aB...'

    // ── Real photography ─────────────────────────────────────────────
    // Drop files in /assets and reference them here. Empty = keep the
    // stylised SVG placeholder for that slot. See assets/README.md.
    photos: {
      hero:        '',        // e.g. 'assets/product-hero.jpg'
      gallery:     ['', '', '', '', '', ''],  // 6 gallery frames, in order
      finish:      '',        // "A mirror you can hold" feature
      certificate: '',        // "Numbered. Sealed." feature
      box:         '',        // "Arrives like it matters" feature
    },
  };

  /* ── Apply price + edition everywhere (data-hooks) ──────────────────── */
  const isWhole = CONFIG.unitPrice % 1 === 0;
  const priceDollars = Math.floor(CONFIG.unitPrice).toLocaleString();
  const priceCents = isWhole ? '' : '.' + CONFIG.unitPrice.toFixed(2).split('.')[1];
  const priceFull = CONFIG.currencySymbol + priceDollars + priceCents;
  $$('[data-price-dollars]').forEach((e) => (e.textContent = CONFIG.currencySymbol + priceDollars));
  $$('[data-price-amount]').forEach((e) => (e.textContent = priceDollars));
  $$('[data-price-cents]').forEach((e) => (e.textContent = priceCents));
  $$('[data-price-full]').forEach((e) => (e.textContent = priceFull));
  $$('[data-edition]').forEach((e) => (e.textContent = CONFIG.edition.toLocaleString()));

  /* ── Stripe checkout ────────────────────────────────────────────────── */
  const checkoutLive = !!CONFIG.checkoutUrl && /^https?:\/\//.test(CONFIG.checkoutUrl);
  function goToCheckout(email) {
    if (!checkoutLive) return false;
    let url;
    try { url = new URL(CONFIG.checkoutUrl); } catch (_) { return false; }
    if (email) url.searchParams.set('prefilled_email', email);
    window.location.assign(url.toString());
    return true;
  }
  if (checkoutLive) {
    const verb = $('[data-cta-verb]');
    if (verb) verb.textContent = 'Checkout';
    const fine = $('.card__fine');
    if (fine) fine.textContent = 'Secure checkout via Stripe · shipping & tax calculated at checkout.';
  }

  /* ── Real-photo slots (swap SVG placeholders for photography) ───────── */
  function mountPhoto(container, src, alt, fit) {
    if (!container || !src) return;
    const img = new Image();
    img.className = 'photo photo--' + (fit || 'cover');
    img.alt = alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onload = () => container.classList.add('has-photo');
    img.onerror = () => img.remove();   // silently fall back to the SVG
    img.src = src;
    container.appendChild(img);
  }
  const P = CONFIG.photos;
  mountPhoto($('[data-photo="hero"]'), P.hero, CONFIG.productName, 'contain');
  mountPhoto($('[data-photo="finish"]'), P.finish, 'Mirror finish', 'contain');
  mountPhoto($('[data-photo="certificate"]'), P.certificate, 'Certificate of authenticity', 'contain');
  mountPhoto($('[data-photo="box"]'), P.box, 'Presentation box', 'contain');
  $$('[data-shot]').forEach((shot, i) => mountPhoto(shot, P.gallery[i], shot.dataset.label, 'cover'));

  /* ── Sticky nav shrink ──────────────────────────────────────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll reveal (IntersectionObserver, fire once) ───────────────── */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ── Hero parallax (subtle, pointer + scroll) ──────────────────────── */
  const stage = $('[data-parallax]');
  if (stage && !reduceMotion) {
    let scrollY = 0, px = 0, py = 0, raf = null;
    const apply = () => {
      stage.style.transform = `translate3d(${px}px, ${scrollY * 0.04 + py}px, 0)`;
      raf = null;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener('scroll', () => { scrollY = window.scrollY; schedule(); }, { passive: true });
    if (window.matchMedia('(pointer:fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        px = (e.clientX / window.innerWidth - 0.5) * 18;
        py = (e.clientY / window.innerHeight - 0.5) * 14;
        schedule();
      });
    }
  }

  /* ── Magnetic buttons (pointer-fine only) ──────────────────────────── */
  if (window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── Scarcity counter + tiered state ───────────────────────────────── */
  const fill = $('[data-fill]');
  const stateEl = $('[data-state]');
  const claimed = CONFIG.edition - CONFIG.remaining;
  const pctClaimed = Math.round((claimed / CONFIG.edition) * 100);
  const pctRemaining = 100 - pctClaimed;

  $$('[data-remaining]').forEach((el) => (el.textContent = CONFIG.remaining));
  $$('[data-claimed]').forEach((el) => (el.textContent = claimed.toLocaleString()));

  if (stateEl) {
    if (pctRemaining < 20)      { stateEl.textContent = 'Final pieces';   stateEl.classList.add('is-red'); }
    else if (pctRemaining < 50) { stateEl.textContent = 'Going fast';     stateEl.classList.add('is-amber'); }
    else                        { stateEl.textContent = 'Now reserving'; }
  }
  // animate the fill bar once it scrolls into view
  if (fill) {
    const setFill = () => (fill.style.width = pctClaimed + '%');
    if ('IntersectionObserver' in window) {
      const fo = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { setFill(); fo.disconnect(); } });
      }, { threshold: 0.4 });
      fo.observe(fill.closest('.counter'));
    } else setFill();
  }

  /* ── Countdown (persisted target so it doesn't reset every reload) ──── */
  const cd = $('[data-countdown]');
  if (cd) {
    const KEY = 'aurum_drop_deadline';
    let deadline = Number(localStorage.getItem(KEY));
    const now = Date.now();
    if (!deadline || deadline < now) {
      deadline = now + CONFIG.dropDurationHrs * 3600 * 1000;
      try { localStorage.setItem(KEY, String(deadline)); } catch (_) {}
    }
    const pad = (n) => String(n).padStart(2, '0');
    const elD = $('[data-d]', cd), elH = $('[data-h]', cd), elM = $('[data-m]', cd), elS = $('[data-s]', cd);
    const tick = () => {
      let diff = Math.max(0, deadline - Date.now());
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      elD.textContent = pad(d); elH.textContent = pad(h); elM.textContent = pad(m); elS.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── Order form: quantity + live total + reservation success ───────── */
  const form = $('#reserveForm');
  if (form) {
    let qty = 1;
    const valueEl  = $('[data-qty-value]', form);
    const totalEl  = $('[data-total]', form);
    const grandEl  = $('[data-grand]', form);
    const fmt = (n) => CONFIG.currencySymbol + (n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    const sync = () => {
      valueEl.textContent = qty;
      totalEl.textContent = qty;
      grandEl.textContent = fmt(qty * CONFIG.unitPrice);
    };
    $$('.qty__btn', form).forEach((b) =>
      b.addEventListener('click', () => {
        qty = Math.min(2, Math.max(1, qty + Number(b.dataset.qty)));
        sync();
      })
    );
    sync();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        form.email.focus();
        showToast('Enter a valid email to hold your number.');
        return;
      }
      if (goToCheckout(email)) return;   // → Stripe when a link is configured
      const pieceNo = CONFIG.edition - CONFIG.remaining + 1;
      const num = String(pieceNo).padStart(String(CONFIG.edition).length, '0');
      const assigned = $('[data-assigned]');
      if (assigned) assigned.textContent = 'No. ' + num;
      form.hidden = true;
      const ok = $('[data-success]');
      if (ok) ok.hidden = false;
      showToast('Reservation held — check your inbox.');
    });
  }

  /* ── Newsletter (footer) ───────────────────────────────────────────── */
  const news = $('#newsForm');
  if (news) {
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = $('[data-news-note]');
      const input = news.querySelector('input');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim())) {
        if (note) note.textContent = 'Hmm — that email looks off.';
        return;
      }
      if (note) note.textContent = "You're on the list. We'll warn you before the mold dies.";
      input.value = '';
    });
  }

  /* ── Lightbox gallery ──────────────────────────────────────────────── */
  const shots = $$('[data-shot]');
  const lb = $('[data-lightbox]');
  if (lb && shots.length) {
    const media = $('[data-lb-media]', lb);
    const cap = $('[data-lb-cap]', lb);
    let idx = 0;
    let lastFocus = null;

    const render = () => {
      const shot = shots[idx];
      const photo = shot.querySelector('img.photo');
      if (photo) {
        const img = document.createElement('img');
        img.className = 'photo photo--contain';
        img.src = photo.src;
        img.alt = shot.dataset.label || '';
        media.replaceChildren(img);
      } else {
        const svg = shot.querySelector('svg');
        media.innerHTML = svg ? svg.outerHTML : '';
      }
      cap.textContent = shot.dataset.label || '';
    };
    const open = (i) => {
      idx = i; lastFocus = document.activeElement;
      render();
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      $('[data-lb-close]', lb).focus();
    };
    const close = () => {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    const step = (dir) => { idx = (idx + dir + shots.length) % shots.length; render(); };

    shots.forEach((s, i) => s.addEventListener('click', () => open(i)));
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => step(-1));
    $('[data-lb-next]', lb).addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ── Toast ─────────────────────────────────────────────────────────── */
  let toastTimer = null;
  function showToast(msg) {
    const t = $('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('is-show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('is-show');
      setTimeout(() => (t.hidden = true), 320);
    }, 3200);
  }

  /* ── Smooth-scroll for in-page anchors (respects reduced motion) ───── */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
