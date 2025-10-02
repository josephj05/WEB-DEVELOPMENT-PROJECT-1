// ===== Theme toggle (robust when #theme-toggle is missing) =====
(() => {
  const root = document.documentElement;
  const toggleBtn = document.querySelector('#theme-toggle');

  function applyTheme(isDark){
    if(isDark){
      root.setAttribute('data-theme','dark');
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggleBtn){
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.textContent = isDark ? '☀️ Theme' : '🌙 Theme';
    }
  }

  // Load saved preference and apply
  try {
    const saved = localStorage.getItem('prefers-dark') === 'true';
    applyTheme(saved);
  } catch(e){
    applyTheme(false);
  }

  // Wire up button if present
  if (toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      const nowDark = !document.documentElement.hasAttribute('data-theme');
      applyTheme(nowDark);
      try { localStorage.setItem('prefers-dark', String(nowDark)); } catch(e){}
    });
  }
})();


// ===== Show/Hide content notes =====
(() => {
  const toggles = document.querySelectorAll('.toggle');
  toggles.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.getAttribute('data-target');
      const box = document.getElementById(id);
      const isHidden = box.hasAttribute('hidden');
      if(isHidden){
        box.removeAttribute('hidden');
        btn.textContent = 'Hide content notes';
      }else{
        box.setAttribute('hidden','');
        btn.textContent = 'Show content notes';
      }
    });
  });
})();


// (Optional) Respect prefers-reduced-motion
(() => {
  try {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setRM = () => document.documentElement.toggleAttribute('data-reduced-motion', mq.matches);
    mq.addEventListener ? mq.addEventListener('change', setRM) : mq.addListener(setRM);
    setRM();
  } catch(e){ /* no-op */ }
})();


// ===== Flexbox Playground controls (no-op if playground not on page) =====
(() => {
  const stage = document.getElementById('pg-stage');
  if(!stage) return;

  const dir = document.getElementById('pg-direction');
  const just = document.getElementById('pg-justify');
  const ali = document.getElementById('pg-align');
  const wrap = document.getElementById('pg-wrap');
  const gap = document.getElementById('pg-gap');
  const gapVal = document.getElementById('pg-gap-val');

  function apply(){
    stage.style.flexDirection = dir.value;
    stage.style.justifyContent = just.value;
    stage.style.alignItems = ali.value;
    stage.style.flexWrap = wrap.value;
    stage.style.gap = gap.value + 'px';
    gapVal.textContent = gap.value;
  }

  ['change','input'].forEach(evt=>{
    dir.addEventListener(evt, apply);
    just.addEventListener(evt, apply);
    ali.addEventListener(evt, apply);
    wrap.addEventListener(evt, apply);
    gap.addEventListener(evt, apply);
  });

  apply();
})();


// ===== Save Flexbox Froggy code to localStorage =====
(() => {
  const input = document.getElementById('froggy-code');
  const btn = document.getElementById('save-froggy');
  const status = document.getElementById('froggy-status');
  if(!input || !btn) return;

  const saved = localStorage.getItem('froggy-code');
  if(saved){
    input.value = saved;
    status.textContent = 'Saved code found: ' + saved;
  }

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const val = input.value.trim();
    if(!val){
      status.textContent = 'Please paste your code first.';
      return;
    }
    localStorage.setItem('froggy-code', val);
    status.textContent = 'Saved! (' + val + ')';
  });
})();


// ===== Reviews Carousel =====
(() => {
  const track = document.querySelector('.review-track');
  if(!track) return;

  const slides = Array.from(track.children);
  const prev = document.querySelector('.review-nav.prev');
  const next = document.querySelector('.review-nav.next');
  const dotsWrap = document.querySelector('.review-dots');

  let index = 0;

  // Create dots
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to review ${i+1}`);
    if(i === 0) b.setAttribute('aria-current','true');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
    if(prev) prev.disabled = (index === 0);
    if(next) next.disabled = (index === slides.length - 1);
    dots.forEach((d,i)=>{
      if(i===index) d.setAttribute('aria-current','true');
      else d.removeAttribute('aria-current');
    });
  }

  function goTo(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  prev && prev.addEventListener('click', ()=> goTo(index - 1));
  next && next.addEventListener('click', ()=> goTo(index + 1));

  // Keyboard arrows
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') goTo(index - 1);
    if(e.key === 'ArrowRight') goTo(index + 1);
  });

  // Touch swipe
  let startX = null;
  track.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX, {passive:true});
  track.addEventListener('touchmove', (e)=>{
    if(startX===null) return;
    const dx = e.touches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) goTo(index + 1);
      else goTo(index - 1);
      startX = null;
    }
  }, {passive:true});

  update();
})();


// === Theme toggle switch logic ===
(function(){
  var root = document.documentElement;
  var checkbox = document.getElementById('theme-toggle');
  if (!checkbox) return;

  // Load saved theme
  var saved = localStorage.getItem('theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
    checkbox.checked = (saved === 'light');
  } else {
    // Default dark
    root.setAttribute('data-theme','dark');
    checkbox.checked = false;
  }

  checkbox.addEventListener('change', function(){
    var next = checkbox.checked ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch(e) {}
  });
})();