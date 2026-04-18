/* ============================================================
   core.js — Shared logic for ALL pages
   Custom cursor, nav, language, magnetic, reveal, transitions
   ============================================================ */
(function(){
  'use strict';

  const IS_TOUCH = matchMedia('(pointer:coarse)').matches;
  const root = document.documentElement;

  /* ---------- custom cursor ---------- */
  if(!IS_TOUCH){
    const cur = document.querySelector('.cursor');
    const glow = document.querySelector('.cursor-glow');
    const curText = cur?.querySelector('.cursor-text');
    let mx=0, my=0, cx=0, cy=0;

    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

    (function tick(){
      cx += (mx-cx) * .15;
      cy += (my-cy) * .15;
      const isOutline = root.getAttribute('data-style') === 'outline';
      /* pencil tip at bottom-center of the upright SVG */
      const off = isOutline ? 'translate(-41%,-93%)' : 'translate(-50%,-50%)';
      if(cur)  cur.style.transform  = `translate(${mx}px,${my}px) ${off}`;
      if(glow) glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();

    /* expand on interactive elements */
    document.querySelectorAll('a, button, .cat-card, .gallery-item, .auto-card, .vid-cap').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('expand');
        const txt = el.dataset.cursorText;
        if(txt && curText) curText.textContent = txt;
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('expand');
        if(curText) curText.textContent = '';
      });
    });

    /* ---------- outline pen trail ---------- */
    const penCanvas = document.querySelector('.outline-pen-trail');
    if(penCanvas){
      const pCtx = penCanvas.getContext('2d');
      let pW, pH;

      /* Trail is a ring-buffer of timestamped points.
         Each point fades individually based on its age.
         Speed determines how many points accumulate (fast = long trail).
         After 2 s idle the remaining trail fades to zero. */
      const trail = [];          // {x, y, t, opacity}
      const POINT_LIFETIME = 600;  // ms — base lifetime of each trail point
      const IDLE_THRESHOLD = 2000; // ms — start extra fade after this
      let lastMoveTime = 0;
      let prevMx = 0, prevMy = 0;

      function resizePen(){
        pW = penCanvas.width  = window.innerWidth;
        pH = penCanvas.height = window.innerHeight;
      }
      resizePen();
      window.addEventListener('resize', resizePen);

      document.addEventListener('mousemove', () => {
        if(root.getAttribute('data-style') !== 'outline') return;
        const now = performance.now();
        /* compute speed to adjust point lifetime */
        const dx = mx - prevMx, dy = my - prevMy;
        const speed = Math.sqrt(dx*dx + dy*dy);
        prevMx = mx; prevMy = my;
        /* faster movement = longer-lived points (longer trail) */
        const life = Math.min(1200, POINT_LIFETIME + speed * 8);
        trail.push({x:mx, y:my, t:now, life});
        lastMoveTime = now;
      });

      (function drawPen(){
        if(root.getAttribute('data-style') !== 'outline'){
          requestAnimationFrame(drawPen);
          return;
        }

        const now = performance.now();
        const idle = now - lastMoveTime;

        /* purge dead points */
        while(trail.length && now - trail[0].t > trail[0].life) trail.shift();

        pCtx.clearRect(0,0,pW,pH);

        if(trail.length > 1){
          /* extra fade multiplier when idle > 2 s */
          let idleFade = 1;
          if(idle > IDLE_THRESHOLD){
            idleFade = Math.max(0, 1 - (idle - IDLE_THRESHOLD) / 800);
          }

          for(let i=1;i<trail.length;i++){
            const p = trail[i-1], c = trail[i];
            const age = now - c.t;
            let alpha = (1 - age / c.life) * 0.2 * idleFade;
            if(alpha <= 0) continue;

            pCtx.strokeStyle = `rgba(26,26,26,${alpha.toFixed(3)})`;
            pCtx.lineWidth   = 1.6;
            pCtx.lineCap     = 'round';
            pCtx.lineJoin    = 'round';
            pCtx.beginPath();
            const midX = (p.x+c.x)/2 + (Math.random()-.5)*.8;
            const midY = (p.y+c.y)/2 + (Math.random()-.5)*.8;
            pCtx.moveTo(p.x, p.y);
            pCtx.quadraticCurveTo(p.x, p.y, midX, midY);
            pCtx.stroke();
          }

          /* clear if everything faded */
          if(idleFade <= 0) trail.length = 0;
        }

        requestAnimationFrame(drawPen);
      })();
    }

    /* ---------- outline hover highlight ---------- */
    (function setupHoverHighlights(){
      const bigEls = '.cat-card, .gallery-item, .auto-card, .vid-cap, .app-card';
      const smallEls = 'a, button';

      /* helper: hand-drawn wobbly line between two points */
      function wobblyLine(ctx, x1, y1, x2, y2, wobble){
        const steps = 6;
        ctx.moveTo(x1, y1);
        for(let i = 1; i <= steps; i++){
          const t  = i / steps;
          const px = x1 + (x2 - x1) * t + (Math.random() - .5) * wobble;
          const py = y1 + (y2 - y1) * t + (Math.random() - .5) * wobble;
          ctx.lineTo(px, py);
        }
      }

      /* Big elements: sketchy corner brackets that draw in */
      function drawCornerBrackets(canvas, progress){
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const len = Math.min(w, h) * .25;  // bracket arm length
        const p = Math.min(1, progress);
        const armLen = len * p;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(26,26,26,.55)';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const pad = 4;
        const corners = [
          // top-left: down, right
          { x: pad, y: pad, arms: [[0, armLen], [armLen, 0]] },
          // top-right: down, left
          { x: w - pad, y: pad, arms: [[0, armLen], [-armLen, 0]] },
          // bottom-left: up, right
          { x: pad, y: h - pad, arms: [[0, -armLen], [armLen, 0]] },
          // bottom-right: up, left
          { x: w - pad, y: h - pad, arms: [[0, -armLen], [-armLen, 0]] },
        ];

        corners.forEach(c => {
          c.arms.forEach(([dx, dy]) => {
            ctx.beginPath();
            wobblyLine(ctx, c.x, c.y, c.x + dx, c.y + dy, 1.5);
            ctx.stroke();
          });
        });
      }

      /* Small elements: scribbly underline */
      function drawUnderline(canvas, progress){
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const p = Math.min(1, progress);

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(26,26,26,.5)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';

        const y = h - 3;
        const endX = w * p;

        // draw two slightly offset squiggly lines for a scribble effect
        for(let pass = 0; pass < 2; pass++){
          const offsetY = pass * 2.5;
          ctx.beginPath();
          ctx.moveTo(2, y + offsetY);
          const segs = Math.max(4, Math.floor(endX / 12));
          for(let i = 1; i <= segs; i++){
            const t = i / segs;
            const px = 2 + (endX - 4) * t;
            const py = y + offsetY + (Math.random() - .5) * 3;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      function setupHighlight(el, isBig){
        el.addEventListener('mouseenter', () => {
          if(root.getAttribute('data-style') !== 'outline') return;
          if(el.querySelector('.outline-hover-highlight')) return;

          const pos = getComputedStyle(el).position;
          if(pos === 'static') el.style.position = 'relative';

          const wrap = document.createElement('div');
          wrap.className = 'outline-hover-highlight';
          const canvas = document.createElement('canvas');
          wrap.appendChild(canvas);
          el.appendChild(wrap);

          const w = wrap.offsetWidth;
          const h = wrap.offsetHeight;
          const dpr = window.devicePixelRatio || 1;
          canvas.width  = w * dpr;
          canvas.height = h * dpr;
          canvas.getContext('2d').scale(dpr, dpr);
          canvas.style.width  = w + 'px';
          canvas.style.height = h + 'px';

          const drawFn = isBig ? drawCornerBrackets : drawUnderline;
          const duration = isBig ? 300 : 250;
          const start = performance.now();

          (function animate(){
            const elapsed = performance.now() - start;
            const progress = Math.min(1, elapsed / duration);
            drawFn(canvas, progress);
            if(progress < 1) requestAnimationFrame(animate);
          })();
        });

        el.addEventListener('mouseleave', () => {
          const hl = el.querySelector('.outline-hover-highlight');
          if(hl) hl.remove();
        });
      }

      document.querySelectorAll(bigEls).forEach(el => setupHighlight(el, true));
      document.querySelectorAll(smallEls).forEach(el => {
        // skip elements already handled as big elements
        if(el.closest('.cat-card, .gallery-item, .auto-card, .vid-cap, .app-card')) return;
        setupHighlight(el, false);
      });
    })();
  }

  /* ---------- nav scroll ---------- */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    lastY = window.scrollY;
  }, {passive:true});

  /* ---------- hamburger / mobile nav ---------- */
  const burger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if(burger && mobileNav){
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- language toggle ---------- */
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      window.applyLang(opt.dataset.lang);
    });
  });
  /* apply saved lang */
  window.applyLang(window.currentLang);

  /* ---------- style theme toggle ---------- */
  const styleBtn = document.querySelector('.style-toggle');
  const savedStyle = localStorage.getItem('site-style');
  if(savedStyle) root.setAttribute('data-style', savedStyle);

  function updateFavicon(){
    const fav = document.getElementById('favicon');
    if(!fav) return;
    fav.href = root.getAttribute('data-style') === 'outline'
      ? 'Assets/favicon-outline.svg' : 'Assets/favicon.svg';
  }

  if(styleBtn){
    styleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-style');
      root.classList.add('theme-transitioning');
      if(current === 'outline'){
        root.removeAttribute('data-style');
        localStorage.removeItem('site-style');
      } else {
        root.setAttribute('data-style', 'outline');
        localStorage.setItem('site-style', 'outline');
      }
      updateFavicon();
      setTimeout(() => root.classList.remove('theme-transitioning'), 600);
    });
  }

  /* ---------- magnetic buttons ---------- */
  if(!IS_TOUCH){
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width/2);
        const dy = e.clientY - (r.top  + r.height/2);
        el.style.transform = `translate(${dx*0.25}px,${dy*0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- GSAP reveal-up ---------- */
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity:1, y:0, duration:1, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%', once:true }
    });
  });

  /* Recalculate ScrollTrigger positions once all images/fonts are loaded */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    /* Safety net: any .reveal-up already above viewport should be visible */
    document.querySelectorAll('.reveal-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight){
        gsap.set(el, {opacity:1, y:0});
      }
    });
  });

  /* ---------- page transitions ---------- */
  const slices = document.querySelectorAll('.transition-slice');

  /* entrance — reveal page */
  if(slices.length){
    gsap.set(slices, {scaleY:1, transformOrigin:'top'});
    gsap.to(slices, {
      scaleY:0, duration:.6, stagger:.08, ease:'power3.inOut', delay:.1
    });
  }

  /* exit — cover page, then navigate */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || a.hasAttribute('target')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      if(!slices.length){ window.location.href = href; return; }
      gsap.set(slices, {scaleY:0, transformOrigin:'bottom'});
      gsap.to(slices, {
        scaleY:1, duration:.5, stagger:.06, ease:'power3.inOut',
        onComplete:() => { window.location.href = href; }
      });
    });
  });

})();
