const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const CONTACT_EMAIL = "uthayam1993@gmail.com";
const WHATSAPP_NUMBER = "919789304792";
const EMAILJS_ENABLED = (EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY");
if (EMAILJS_ENABLED) { try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {} }

// Reveal all .reveal elements immediately (fix white space / missing content)
function revealAll() {
  document.querySelectorAll(".reveal").forEach(function(el) {
    el.classList.add("visible");
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

function initScrollReveal() {
  if (!("IntersectionObserver" in window)) { revealAll(); return; }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -20px 0px" });

  document.querySelectorAll(".reveal").forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50) {
      el.classList.add("visible");
    } else {
      obs.observe(el);
    }
  });
  // Safety net
  setTimeout(revealAll, 1500);
}

// Toast
function showToast(msg, type) {
  var toast = document.getElementById("toast");
  var icon = document.getElementById("toastIcon");
  var text = document.getElementById("toastMsg");
  if (!toast) return;
  icon.textContent = type === "success" ? "OK" : "!";
  text.textContent = msg;
  toast.className = "toast " + (type || "success") + " show";
  setTimeout(function() { toast.className = "toast"; }, 4000);
}

// Mobile nav
var menuToggle = document.getElementById("menuToggle");
var mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function() {
    var isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll progress
var progressBar = document.getElementById("scrollProgress");
function updateProgress() {
  if (!progressBar) return;
  var st = document.documentElement.scrollTop;
  var dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + "%";
}

// Back to top
var backBtn = document.getElementById("backToTop");
if (backBtn) {
  backBtn.addEventListener("click", function() { window.scrollTo({ top: 0, behavior: "smooth" }); });
}

// Active nav
var sectionEls = document.querySelectorAll("section[id]");
var navLinks = document.querySelectorAll(".nav > a:not(.nav-cta)");
function updateActiveNav() {
  var current = "";
  sectionEls.forEach(function(sec) {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(function(a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
}

// Scroll handler
window.addEventListener("scroll", function() {
  updateProgress();
  updateActiveNav();
  if (backBtn) backBtn.classList.toggle("visible", window.scrollY > 400);
  var copy = document.querySelector(".hero-copy");
  if (copy && window.scrollY < 500) {
    copy.style.transform = "translateY(" + (window.scrollY * 0.07) + "px)";
  }
}, { passive: true });
updateActiveNav();

// Stats counter
var statsDone = false;
var statsSection = document.querySelector(".stats-section");
if (statsSection) {
  var so = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !statsDone) {
      statsDone = true;
      document.querySelectorAll(".stat-num").forEach(function(el) {
        var target = parseInt(el.dataset.target, 10);
        var current = 0;
        var steps = 55;
        var inc = Math.ceil(target / steps);
        var timer = setInterval(function() {
          current += inc;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 1400 / steps);
      });
      so.disconnect();
    }
  }, { threshold: 0.3 });
  so.observe(statsSection);
}

// Typed text
var typedEl = document.getElementById("typedText");
if (typedEl) {
  var words = ["Smart Solutions","ERP Systems","Web Applications","Digital Growth","SAP Integrations"];
  var wi = 0, ci = 0, del = false;
  function typeLoop() {
    var word = words[wi];
    typedEl.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);
    if (!del && ci === word.length) { del = true; setTimeout(typeLoop, 2000); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    setTimeout(typeLoop, del ? 50 : 85);
  }
  setTimeout(typeLoop, 1200);
}

// Testimonials carousel
var testiTrack = document.getElementById("testiTrack");
var dotsWrap = document.getElementById("testiDots");
var prevBtn = document.getElementById("testiPrev");
var nextBtn = document.getElementById("testiNext");
if (testiTrack) {
  var cards = testiTrack.querySelectorAll(".testi-card");
  var total = cards.length;
  var idx = 0;
  function getPerView() { return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
  function maxIdx() { return Math.max(0, total - getPerView()); }
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    var max = maxIdx();
    for (var i = 0; i <= max; i++) {
      var d = document.createElement("button");
      d.className = "testi-dot" + (i === idx ? " active" : "");
      d.setAttribute("aria-label", "Slide " + (i + 1));
      (function(i) { d.addEventListener("click", function() { idx = i; slide(); }); })(i);
      dotsWrap.appendChild(d);
    }
  }
  function slide() {
    idx = Math.min(idx, maxIdx());
    var w = cards[0] ? (cards[0].offsetWidth + 20) : 0;
    testiTrack.style.transform = "translateX(-" + (idx * w) + "px)";
    if (dotsWrap) dotsWrap.querySelectorAll(".testi-dot").forEach(function(d, i) {
      d.classList.toggle("active", i === idx);
    });
  }
  if (prevBtn) prevBtn.addEventListener("click", function() { idx = idx > 0 ? idx - 1 : maxIdx(); slide(); });
  if (nextBtn) nextBtn.addEventListener("click", function() { idx = idx < maxIdx() ? idx + 1 : 0; slide(); });
  setInterval(function() { if (!document.hidden) { idx = idx < maxIdx() ? idx + 1 : 0; slide(); } }, 5000);
  window.addEventListener("resize", function() { buildDots(); slide(); }, { passive: true });
  buildDots();
}

// Contact form
var form = document.getElementById("contactForm");
var submitBtn = document.getElementById("submitBtn");
var submitTxt = document.getElementById("submitTxt");
var submitSpin = document.getElementById("submitSpinner");
var feedback = document.getElementById("formFeedback");
if (form) {
  function setLoading(on) {
    if (submitBtn) submitBtn.disabled = on;
    if (submitTxt) submitTxt.style.display = on ? "none" : "inline";
    if (submitSpin) submitSpin.style.display = on ? "inline-block" : "none";
  }
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var name = data.get("name") || "";
    var email = data.get("email") || "";
    var phone = data.get("phone") || "Not provided";
    var service = data.get("service") || "";
    var message = data.get("message") || "Not provided";
    setLoading(true);
    if (feedback) feedback.textContent = "";
    var subject = encodeURIComponent("Website Inquiry: " + service);
    var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nService: " + service + "\n\nProject Details:\n" + message);
    setLoading(false);
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    if (feedback) feedback.textContent = "Opening your email application...";
  });
  var waAlt = document.querySelector(".btn-wa-alt");
  if (waAlt) {
    waAlt.addEventListener("click", function(e) {
      var n = (document.getElementById("fname") || {}).value;
      var s = (document.getElementById("fservice") || {}).value;
      if (n || s) {
        e.preventDefault();
        var msg = encodeURIComponent("Hello, I visited your website.\nName: " + (n || "-") + "\nService: " + (s || "-") + "\n\nI would like to discuss a project.");
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg, "_blank");
      }
    });
  }
}

// 3D Tilt
function apply3DTilt(selector, opts) {
  var maxTilt = (opts && opts.maxTilt) || 12;
  var scale = (opts && opts.scale) || 1.04;
  var maxGlare = (opts && opts.maxGlare) || 0.2;
  document.querySelectorAll(selector).forEach(function(card) {
    if (getComputedStyle(card).position === "static") card.style.position = "relative";
    card.style.overflow = "hidden";
    var glare = document.createElement("div");
    glare.className = "tilt-glare";
    card.appendChild(glare);
    card.addEventListener("mousemove", function(e) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var cx = r.width / 2, cy = r.height / 2;
      var rX = ((y - cy) / cy) * -maxTilt;
      var rY = ((x - cx) / cx) * maxTilt;
      card.style.transform = "perspective(900px) rotateX(" + rX + "deg) rotateY(" + rY + "deg) scale3d(" + scale + "," + scale + "," + scale + ")";
      card.style.zIndex = "3";
      var angle = Math.atan2(y - cy, x - cx) * 57.296 + 90;
      var opacity = Math.min(Math.hypot(x - cx, y - cy) / Math.hypot(cx, cy) * maxGlare, maxGlare);
      glare.style.background = "linear-gradient(" + angle + "deg,rgba(255,255,255," + opacity + ") 0%,transparent 65%)";
    });
    card.addEventListener("mouseleave", function() {
      card.style.transform = "";
      card.style.zIndex = "";
      glare.style.background = "transparent";
    });
  });
}
document.body.classList.add("tilt-active");
apply3DTilt(".service-card");
apply3DTilt(".solution-tile", { maxTilt: 15, scale: 1.06, maxGlare: 0.16 });
apply3DTilt(".testi-card", { maxTilt: 7, scale: 1.02, maxGlare: 0.1 });

// Hero visual 3D track
(function() {
  var hero = document.querySelector(".hero");
  var visual = document.querySelector(".hero-visual");
  if (!hero || !visual) return;
  hero.addEventListener("mousemove", function(e) {
    var r = hero.getBoundingClientRect();
    var rX = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -5;
    var rY = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 8;
    visual.style.transform = "perspective(1400px) rotateX(" + rX + "deg) rotateY(" + rY + "deg)";
    visual.style.transition = "transform 0.08s ease";
  });
  hero.addEventListener("mouseleave", function() {
    visual.style.transform = "";
    visual.style.transition = "transform 0.9s ease";
  });
})();

// Particle canvas
(function() {
  var hero = document.querySelector(".hero");
  if (!hero) return;
  var cvs = document.createElement("canvas");
  cvs.id = "heroCanvas";
  cvs.style.cssText = "position:absolute;inset:0;z-index:0;opacity:0.45;pointer-events:none";
  hero.prepend(cvs);
  var ctx = cvs.getContext("2d");
  var W, H;
  function resize() { W = cvs.width = hero.offsetWidth; H = cvs.height = hero.offsetHeight; }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  var pts = [];
  for (var i = 0; i < 60; i++) {
    pts.push({ x: Math.random(), y: Math.random(), z: Math.random(), vx: (Math.random()-0.5)*0.0003, vy: (Math.random()-0.5)*0.0003 });
  }
  var mx = 0.5, my = 0.5;
  document.addEventListener("mousemove", function(e) { mx = e.clientX/window.innerWidth; my = e.clientY/window.innerHeight; }, { passive: true });
  function frame() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function(p) {
      p.x += p.vx + (mx - 0.5) * 0.00008 * p.z;
      p.y += p.vy + (my - 0.5) * 0.00008 * p.z;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, 0.7 + p.z * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,180,255," + (0.1 + p.z * 0.35) + ")";
      ctx.fill();
    });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = (pts[i].x - pts[j].x) * W, dy = (pts[i].y - pts[j].y) * H;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d < 85) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x * W, pts[i].y * H);
          ctx.lineTo(pts[j].x * W, pts[j].y * H);
          ctx.strokeStyle = "rgba(80,170,255," + ((1 - d/85) * 0.06 * (pts[i].z + pts[j].z)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

// Heading underline
var hObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add("in-view"); });
}, { threshold: 0.4 });
document.querySelectorAll(".section-heading h2, .about-copy h2, .contact-copy h2").forEach(function(h) { hObs.observe(h); });

// INIT
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollReveal);
} else {
  initScrollReveal();
}