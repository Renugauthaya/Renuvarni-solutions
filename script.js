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
