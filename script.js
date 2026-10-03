/* ================================================================
   Renuvarni Solutions — Advanced Script
   Features: EmailJS, WhatsApp, Typed Text, Scroll Reveal,
             Stats Counters, Testimonials Carousel, Toast,
             Scroll Progress, Back to Top, Active Nav
   ================================================================ */

/* ── EmailJS Configuration ──────────────────────────────────────
   To enable real email sending:
   1. Sign up free at https://www.emailjs.com
   2. Add Gmail as an Email Service → copy the Service ID
   3. Create an Email Template → copy the Template ID
   4. Go to Account → copy your Public Key
   5. Fill the three values below, then push to GitHub
   ──────────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

const EMAILJS_ENABLED = (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY');
if (EMAILJS_ENABLED) emailjs.init(EMAILJS_PUBLIC_KEY);

/* Fallback mailto for form */
const CONTACT_EMAIL = 'uthayam1993@gmail.com';
const WHATSAPP_NUMBER = '919789304792';

/* ── Toast ───────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');
  const text  = document.getElementById('toastMsg');
  icon.textContent = type === 'success' ? '✓' : '✕';
  text.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 4000);
}

/* ── Mobile Nav ──────────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

/* ── Footer Year ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Scroll Progress Bar ─────────────────────────────────────── */
const progressBar = document.getElementById('scrollProgress');
function updateProgress() {
  const scrollTop  = document.documentElement.scrollTop;
  const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
}

/* ── Back to Top ─────────────────────────────────────────────── */
const backBtn = document.getElementById('backToTop');
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Active Nav Highlight ────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav > a:not(.nav-cta)');
function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ── Combined Scroll Handler ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveNav();
  backBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
updateActiveNav();

/* ── Scroll Reveal (Intersection Observer) ───────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated Stats Counter ──────────────────────────────────── */
let statsDone = false;
const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsDone) {
    statsDone = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = Math.ceil(duration / target);
      let current = 0;
      const timer = setInterval(() => {
        current += Math.ceil(target / 60);
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, step);
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.4 });
if (statsSection) statsObserver.observe(statsSection);

/* ── Typed Text Animation ────────────────────────────────────── */
const words  = ['Smart Solutions', 'ERP Systems', 'Web Applications', 'Digital Growth', 'SAP Integrations'];
const typedEl = document.getElementById('typedText');
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const word = words[wordIndex];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
  } else {
    typedEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 90);
}
setTimeout(typeLoop, 1000);

/* ── Testimonials Carousel ───────────────────────────────────── */
const track     = document.getElementById('testiTrack');
const dotsWrap  = document.getElementById('testiDots');
const prevBtn   = document.getElementById('testiPrev');
const nextBtn   = document.getElementById('testiNext');

let testiIndex = 0;
let perView    = getPerView();
const cards    = track ? track.querySelectorAll('.testi-card') : [];
const total    = cards.length;

function getPerView() {
  return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
}
function maxIndex() { return Math.max(0, total - perView); }

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  const count = maxIndex() + 1;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === testiIndex ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => { testiIndex = i; applySlide(); });
    dotsWrap.appendChild(d);
  }
}

function applySlide() {
  if (!track) return;
  const cardW = cards[0] ? cards[0].offsetWidth : 0;
  const gap   = 20;
  track.style.transform = `translateX(-${testiIndex * (cardW + gap)}px)`;
  dotsWrap && dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === testiIndex);
  });
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  testiIndex = testiIndex > 0 ? testiIndex - 1 : maxIndex();
  applySlide();
});
if (nextBtn) nextBtn.addEventListener('click', () => {
  testiIndex = testiIndex < maxIndex() ? testiIndex + 1 : 0;
  applySlide();
});

/* Auto-advance testimonials every 5 s */
setInterval(() => {
  if (document.hidden) return;
  testiIndex = testiIndex < maxIndex() ? testiIndex + 1 : 0;
  applySlide();
}, 5000);

window.addEventListener('resize', () => {
  perView = getPerView();
  testiIndex = Math.min(testiIndex, maxIndex());
  buildDots();
  applySlide();
});

buildDots();

/* ── Contact Form (EmailJS + WhatsApp fallback) ──────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const submitTxt  = document.getElementById('submitTxt');
const submitSpin = document.getElementById('submitSpinner');
const feedback   = document.getElementById('formFeedback');

function setLoading(on) {
  submitBtn.disabled = on;
  submitTxt.style.display   = on ? 'none' : 'inline';
  submitSpin.style.display  = on ? 'inline-block' : 'none';
}

form && form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const data    = new FormData(form);
  const name    = data.get('name');
  const email   = data.get('email');
  const phone   = data.get('phone') || 'Not provided';
  const service = data.get('service');
  const message = data.get('message') || 'Not provided';

  setLoading(true);
  feedback.textContent = '';

  /* ── Try EmailJS first if configured ── */
  if (EMAILJS_ENABLED) {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        phone,
        service,
        message,
        reply_to: email
      });
      form.reset();
      setLoading(false);
      showToast('Message sent! We\'ll be in touch soon.', 'success');
      feedback.textContent = '✓ Inquiry sent successfully!';
      return;
    } catch (err) {
      console.warn('EmailJS failed, using mailto fallback:', err);
    }
  }

  /* ── Fallback: open email client ── */
  const subject = encodeURIComponent(`Website Inquiry: ${service}`);
  const body    = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nProject Details:\n${message}`
  );
  setLoading(false);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  showToast('Opening your email application…', 'success');
  feedback.textContent = 'Opening your email application…';
});

/* ── WhatsApp Form Button — prefill message from form ────────── */
const waAlt = document.querySelector('.btn-wa-alt');
if (waAlt && form) {
  waAlt.addEventListener('click', (e) => {
    const name    = document.getElementById('fname')?.value;
    const service = document.getElementById('fservice')?.value;
    if (name || service) {
      e.preventDefault();
      const msg = encodeURIComponent(
        `Hello, I visited your website.\nName: ${name || '-'}\nService: ${service || '-'}\n\nI would like to discuss a project.`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    }
  });
}

/* ================================================================
   3D EFFECTS � Mouse Tilt, Glare, Particles, Parallax
   ================================================================ */

/* Mark body so CSS can scope hover overrides */
document.body.classList.add('tilt-active');

/* -- Universal 3D Mouse-Tilt + Glare -------------------------- */
function apply3DTilt(selector, opts = {}) {
  const { maxTilt = 12, scale = 1.05, maxGlare = 0.28 } = opts;
  document.querySelectorAll(selector).forEach(card => {
    /* ensure position:relative for glare overlay */
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.style.overflow = 'hidden';

    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    card.appendChild(glare);

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2,        cy = r.height / 2;
      const rX = ((y - cy) / cy) * -maxTilt;
      const rY = ((x - cx) / cx) *  maxTilt;

      card.style.transform = perspective(900px) rotateX(deg) rotateY(deg) scale3d(,,);
      card.style.zIndex    = '3';

      const angle   = Math.atan2(y - cy, x - cx) * 57.296 + 90;
      const opacity = Math.min(Math.hypot(x - cx, y - cy) / Math.hypot(cx, cy) * maxGlare, maxGlare);
      glare.style.background = linear-gradient(deg,rgba(255,255,255,) 0%,transparent 65%);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex    = '';
      glare.style.background = 'transparent';
    });
  });
}

/* Apply to service cards, solution tiles, testimonial cards */
apply3DTilt('.service-card');
apply3DTilt('.solution-tile', { maxTilt: 16, scale: 1.07, maxGlare: 0.2 });
apply3DTilt('.testi-card',    { maxTilt:  8, scale: 1.03, maxGlare: 0.15 });

/* -- Hero Visual � Mouse-Tracking 3D Depth --------------------- */
(function () {
  const hero   = document.querySelector('.hero');
  const visual = document.querySelector('.hero-visual');
  if (!hero || !visual) return;

  hero.addEventListener('mousemove', e => {
    const r  = hero.getBoundingClientRect();
    const x  = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2,        cy = r.height / 2;
    const rX = ((y - cy) / cy) * -6;
    const rY = ((x - cx) / cx) *  9;
    visual.style.transform  = perspective(1400px) rotateX(deg) rotateY(deg);
    visual.style.transition = 'transform 0.08s ease';
  });

  hero.addEventListener('mouseleave', () => {
    visual.style.transform  = '';
    visual.style.transition = 'transform 0.9s ease';
  });
})();

/* -- 3D Floating Particle Network (Hero Canvas) ---------------- */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const cvs = document.createElement('canvas');
  cvs.id = 'heroCanvas';
  hero.prepend(cvs);

  const ctx = cvs.getContext('2d');
  let W, H;

  function resize() {
    W = cvs.width  = hero.offsetWidth;
    H = cvs.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 75;
  const pts   = Array.from({ length: COUNT }, () => ({
    x  : Math.random() * 1,   /* normalised 0-1 */
    y  : Math.random() * 1,
    z  : Math.random(),        /* depth 0=far 1=near */
    vx : (Math.random() - 0.5) * 0.0003,
    vy : (Math.random() - 0.5) * 0.0003
  }));

  let mx = 0.5, my = 0.5;
  document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  function frame() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      /* gentle drift + subtle mouse parallax */
      p.x += p.vx + (mx - 0.5) * 0.00012 * p.z;
      p.y += p.vy + (my - 0.5) * 0.00012 * p.z;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

      const px = p.x * W, py = p.y * H;
      const r  = 0.8 + p.z * 2.2;
      const a  = 0.12 + p.z * 0.4;

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = gba(100,180,255,);
      ctx.fill();
    });

    /* Draw connecting lines between nearby particles */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          const alpha = (1 - d / 95) * 0.07 * (a.z + b.z);
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = gba(80,170,255,);
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* -- Hero Text Parallax on Scroll ------------------------------ */
(function () {
  const copy = document.querySelector('.hero-copy');
  if (!copy) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 500) copy.style.transform = 	ranslateY(px);
  }, { passive: true });
})();

/* -- 3D Heading Underline Trigger ------------------------------ */
const headingObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.5 });
document.querySelectorAll('.section-heading h2, .about-copy h2, .contact-copy h2')
  .forEach(h => headingObserver.observe(h));
