var CONTACT_EMAIL = "uthayam1993@gmail.com";
var WHATSAPP_NUMBER = "919789304792";
var EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
var EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
var EMAILJS_ENABLED = (EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY");
if (EMAILJS_ENABLED) { try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {} }

// ----------------------------------------------------------------
// CSS-FIRST REVEAL SYSTEM
// Content is visible by default (no JS needed).
// JS adds .js-ready to body to opt-in to scroll animations.
// Then immediately reveals above-fold elements.
// ----------------------------------------------------------------
function initReveal() {
  document.body.classList.add("js-ready");
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function(el) { el.classList.add("visible"); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: "0px 0px -10px 0px" });

  els.forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add("visible");
    } else {
      obs.observe(el);
    }
  });
  // Hard safety: reveal everything after 2s regardless
  setTimeout(function() {
    document.querySelectorAll(".reveal").forEach(function(el) { el.classList.add("visible"); });
  }, 2000);
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
    var open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll("a").forEach(function(a) {
    a.addEventListener("click", function() {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Year
var yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

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
if (backBtn) backBtn.addEventListener("click", function() { window.scrollTo({ top: 0, behavior: "smooth" }); });

// Active nav
var sectionEls = document.querySelectorAll("section[id]");
var navLinks = document.querySelectorAll(".nav > a:not(.nav-cta)");
function updateActiveNav() {
  var cur = "";
  sectionEls.forEach(function(s) { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navLinks.forEach(function(a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
}

// Combined scroll
window.addEventListener("scroll", function() {
  updateProgress();
  updateActiveNav();
  if (backBtn) backBtn.classList.toggle("visible", window.scrollY > 400);
  var copy = document.querySelector(".hero-copy");
  if (copy && window.scrollY < 500) copy.style.transform = "translateY(" + (window.scrollY * 0.07) + "px)";
}, { passive: true });
updateActiveNav();

// Stats counter
var statsDone = false;
var statsEl = document.querySelector(".stats-section");
if (statsEl) {
  var so = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !statsDone) {
      statsDone = true;
      document.querySelectorAll(".stat-num").forEach(function(el) {
        var target = parseInt(el.dataset.target, 10), cur = 0;
        var inc = Math.ceil(target / 55);
        var t = setInterval(function() {
          cur += inc; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur;
        }, 1400 / 55);
      });
      so.disconnect();
    }
  }, { threshold: 0.3 });
  so.observe(statsEl);
}

// Typed text
var typedEl = document.getElementById("typedText");
if (typedEl) {
  var words = ["Smart Solutions","ERP Systems","Web Applications","Digital Growth","SAP Integrations"];
  var wi = 0, ci = 0, del = false;
  function typeLoop() {
    var w = words[wi];
    typedEl.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    if (!del && ci === w.length) { del = true; setTimeout(typeLoop, 2000); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    setTimeout(typeLoop, del ? 50 : 85);
  }
  setTimeout(typeLoop, 1200);
}

// Testimonials carousel
var testiTrack = document.getElementById("testiTrack");
if (testiTrack) {
  var cards = testiTrack.querySelectorAll(".testi-card");
  var total = cards.length, idx = 0;
  var dotsWrap = document.getElementById("testiDots");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  function pv() { return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
  function maxI() { return Math.max(0, total - pv()); }
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (var i = 0; i <= maxI(); i++) {
      var d = document.createElement("button");
      d.className = "testi-dot" + (i === idx ? " active" : "");
      d.setAttribute("aria-label", "Slide " + (i+1));
      (function(i){ d.addEventListener("click", function(){ idx=i; slide(); }); })(i);
      dotsWrap.appendChild(d);
    }
  }
  function slide() {
    idx = Math.min(idx, maxI());
    var w = cards[0] ? cards[0].offsetWidth + 20 : 0;
    testiTrack.style.transform = "translateX(-" + (idx * w) + "px)";
    if (dotsWrap) dotsWrap.querySelectorAll(".testi-dot").forEach(function(d,i){ d.classList.toggle("active", i===idx); });
  }
  if (prevBtn) prevBtn.addEventListener("click", function(){ idx = idx > 0 ? idx-1 : maxI(); slide(); });
  if (nextBtn) nextBtn.addEventListener("click", function(){ idx = idx < maxI() ? idx+1 : 0; slide(); });
  setInterval(function(){ if (!document.hidden){ idx = idx < maxI() ? idx+1 : 0; slide(); } }, 5000);
  window.addEventListener("resize", function(){ buildDots(); slide(); }, { passive: true });
  buildDots();
}

// Contact form
var form = document.getElementById("contactForm");
if (form) {
  var submitBtn = document.getElementById("submitBtn");
  var submitTxt = document.getElementById("submitTxt");
  var submitSpin = document.getElementById("submitSpinner");
  var feedback = document.getElementById("formFeedback");
  function setLoading(on) {
    if (submitBtn) submitBtn.disabled = on;
    if (submitTxt) submitTxt.style.display = on ? "none" : "inline";
    if (submitSpin) submitSpin.style.display = on ? "inline-block" : "none";
  }
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var fd = new FormData(form);
    var name = fd.get("name")||"", email = fd.get("email")||"";
    var phone = fd.get("phone")||"Not provided", service = fd.get("service")||"";
    var message = fd.get("message")||"Not provided";
    setLoading(true);
    if (feedback) feedback.textContent = "";
    var subject = encodeURIComponent("Website Inquiry: " + service);
    var body = encodeURIComponent("Name: "+name+"\nEmail: "+email+"\nPhone: "+phone+"\nService: "+service+"\n\nProject Details:\n"+message);
    setTimeout(function() {
      setLoading(false);
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
      if (feedback) feedback.textContent = "Opening your email application...";
    }, 300);
  });
  var waAlt = document.querySelector(".btn-wa-alt");
  if (waAlt) {
    waAlt.addEventListener("click", function(e) {
      var n = (document.getElementById("fname")||{}).value;
      var s = (document.getElementById("fservice")||{}).value;
      if (n || s) {
        e.preventDefault();
        var msg = encodeURIComponent("Hello, I visited your website.\nName: "+(n||"-")+"\nService: "+(s||"-")+"\n\nI would like to discuss a project.");
        window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+msg, "_blank");
      }
    });
  }
}

// 3D Tilt
function apply3DTilt(sel, opts) {
  var maxTilt=(opts&&opts.maxTilt)||12, scale=(opts&&opts.scale)||1.04, maxG=(opts&&opts.maxGlare)||0.2;
  document.querySelectorAll(sel).forEach(function(card) {
    if (getComputedStyle(card).position==="static") card.style.position="relative";
    card.style.overflow="hidden";
    var gl=document.createElement("div"); gl.className="tilt-glare"; card.appendChild(gl);
    card.addEventListener("mousemove", function(e) {
      var r=card.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      var cx=r.width/2, cy=r.height/2;
      var rX=((y-cy)/cy)*-maxTilt, rY=((x-cx)/cx)*maxTilt;
      card.style.transform="perspective(900px) rotateX("+rX+"deg) rotateY("+rY+"deg) scale3d("+scale+","+scale+","+scale+")";
      card.style.zIndex="3";
      var ang=Math.atan2(y-cy,x-cx)*57.296+90;
      var op=Math.min(Math.hypot(x-cx,y-cy)/Math.hypot(cx,cy)*maxG,maxG);
      gl.style.background="linear-gradient("+ang+"deg,rgba(255,255,255,"+op+") 0%,transparent 65%)";
    });
    card.addEventListener("mouseleave", function(){ card.style.transform=""; card.style.zIndex=""; gl.style.background="transparent"; });
  });
}
document.body.classList.add("tilt-active");
apply3DTilt(".service-card");
apply3DTilt(".solution-tile", { maxTilt:15, scale:1.06, maxGlare:0.15 });
apply3DTilt(".testi-card",    { maxTilt:7,  scale:1.02, maxGlare:0.1 });

// Hero visual 3D track
(function() {
  var hero=document.querySelector(".hero"), visual=document.querySelector(".hero-visual");
  if (!hero||!visual) return;
  hero.addEventListener("mousemove", function(e) {
    var r=hero.getBoundingClientRect();
    var rX=((e.clientY-r.top-r.height/2)/(r.height/2))*-4;
    var rY=((e.clientX-r.left-r.width/2)/(r.width/2))*6;
    visual.style.transform="perspective(1400px) rotateX("+rX+"deg) rotateY("+rY+"deg)";
    visual.style.transition="transform 0.1s ease";
  });
  hero.addEventListener("mouseleave", function(){ visual.style.transform=""; visual.style.transition="transform 1s ease"; });
})();

// Particle canvas — z-index:-1 so it NEVER covers content
(function() {
  var hero=document.querySelector(".hero"); if(!hero) return;
  var cvs=document.createElement("canvas");
  cvs.id="heroCanvas";
  cvs.setAttribute("aria-hidden","true");
  cvs.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;opacity:0.4;pointer-events:none";
  hero.prepend(cvs);
  var ctx=cvs.getContext("2d"), W, H;
  function resize(){ W=cvs.width=hero.offsetWidth; H=cvs.height=hero.offsetHeight; }
  resize();
  window.addEventListener("resize", resize, {passive:true});
  var pts=[];
  for(var i=0;i<55;i++) pts.push({x:Math.random(),y:Math.random(),z:Math.random(),vx:(Math.random()-0.5)*0.0003,vy:(Math.random()-0.5)*0.0003});
  var mx=0.5,my=0.5;
  document.addEventListener("mousemove",function(e){mx=e.clientX/window.innerWidth;my=e.clientY/window.innerHeight;},{passive:true});
  function frame(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p){
      p.x+=p.vx+(mx-0.5)*0.00007*p.z; p.y+=p.vy+(my-0.5)*0.00007*p.z;
      if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
      ctx.beginPath(); ctx.arc(p.x*W,p.y*H,0.7+p.z*1.8,0,Math.PI*2);
      ctx.fillStyle="rgba(100,180,255,"+(0.1+p.z*0.32)+")"; ctx.fill();
    });
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=(pts[i].x-pts[j].x)*W, dy=(pts[i].y-pts[j].y)*H, d=Math.sqrt(dx*dx+dy*dy);
        if(d<85){
          ctx.beginPath(); ctx.moveTo(pts[i].x*W,pts[i].y*H); ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle="rgba(80,170,255,"+((1-d/85)*0.055*(pts[i].z+pts[j].z))+")";
          ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

// Heading underline
var hObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add("in-view"); });
},{threshold:0.4});
document.querySelectorAll(".section-heading h2,.about-copy h2,.contact-copy h2").forEach(function(h){hObs.observe(h);});

// INIT REVEAL
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else {
  initReveal();
}