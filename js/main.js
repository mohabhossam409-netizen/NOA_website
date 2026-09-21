/* =========================================================
   NOA Landscaping — behavior
   ========================================================= */

/* ---- SETTINGS ------------------------------------------------
   Your Facebook page address. Change it here to update every Facebook
   link on the site (also update "sameAs" in index.html). Leave empty to
   hide the Facebook links.
   ------------------------------------------------------------- */
const FACEBOOK_URL = "https://www.facebook.com/share/1KHYGU9tBU/";

(function () {
  "use strict";
  const doc = document.documentElement;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  doc.classList.add("js");

  /* Footer year */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* Facebook links (hidden until FACEBOOK_URL is set) */
  if (FACEBOOK_URL) {
    $$("[data-facebook]").forEach((a) => (a.href = FACEBOOK_URL));
    $$("[data-facebook-row]").forEach((el) => el.removeAttribute("hidden"));
  }

  /* Header shadow + floating WhatsApp button */
  const header = $("#site-header");
  const waFloat = $("#wa-float");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    waFloat.classList.toggle("is-visible", y > 480);
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Mobile menu */
  const toggle = $("#nav-toggle");
  const panel = $("#primary-nav");
  function setMenu(open) {
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", panel).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (e) => {
    if (toggle.getAttribute("aria-expanded") === "true" && !panel.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 960px)").addEventListener("change", () => setMenu(false));

  /* Highlight the current section in the navigation */
  const links = $$(".nav__link");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        const active = links.find((a) => a.getAttribute("href") === "#" + entry.target.id);
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* Gentle reveal on scroll */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-in"); obs.unobserve(entry.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Lightbox */
  const items = $$(".g-item");
  const lb = $("#lightbox");
  const lbImg = $(".lb-img", lb);
  const lbText = $(".lb-text", lb);
  const lbCount = $(".lb-count", lb);
  const btnClose = $(".lb-close", lb);
  const btnPrev = $(".lb-prev", lb);
  const btnNext = $(".lb-next", lb);
  let current = 0;
  let opener = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    const alt = $("img", item).alt;
    lbImg.classList.remove("is-loaded");
    lbImg.onload = () => lbImg.classList.add("is-loaded");
    lbImg.alt = alt;
    lbImg.src = item.dataset.full;
    if (lbImg.complete && lbImg.naturalWidth) lbImg.classList.add("is-loaded");
    lbText.textContent = alt;
    lbCount.textContent = current + 1 + " / " + items.length;
    [current + 1, current - 1].forEach((n) => { new Image().src = items[(n + items.length) % items.length].dataset.full; });
  }
  function openLightbox(i) {
    opener = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    doc.classList.add("lb-open");
    btnClose.focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    doc.classList.remove("lb-open");
    if (opener) opener.focus();
  }
  items.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
  btnClose.addEventListener("click", closeLightbox);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figure")) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      const f = [btnClose, btnPrev, btnNext];
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* Swipe on touch screens */
  let startX = null;
  lb.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
