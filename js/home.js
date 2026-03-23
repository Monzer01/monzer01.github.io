/* ============================================================
   home.js — Home-page canvas, hero animation, stats, cards
   ============================================================ */
(function(){
  'use strict';

  /* ===== HERO CANVAS — morphing constellation ===== */
  const canvas = document.getElementById('hero-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let W, H;
    const mouse = {x:null, y:null};
    let particles = [];
    let time = 0;

    function resize(){
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initParticles();
    }

    function initParticles(){
      particles = [];
      const COUNT = Math.min(100, Math.floor(W * H / 10000));
      for(let i=0; i<COUNT; i++){
        particles.push({
          x: Math.random()*W, y: Math.random()*H,
          baseX: Math.random()*W, baseY: Math.random()*H,
          vx: (Math.random()-.5)*.2, vy: (Math.random()-.5)*.2,
          r: Math.random()*2.5+.5,
          phase: Math.random()*Math.PI*2,
          speed: Math.random()*.02+.005,
          drift: Math.random()*30+10
        });
      }
    }

    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function draw(){
      time++;
      ctx.clearRect(0,0,W,H);

      /* centre glow that follows mouse */
      const gx = mouse.x ?? W/2;
      const gy = mouse.y ?? H/2;
      const grad = ctx.createRadialGradient(gx,gy,0,gx,gy,350);
      grad.addColorStop(0,'rgba(0,212,255,.04)');
      grad.addColorStop(1,'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,W,H);

      for(const p of particles){
        /* organic drifting */
        p.x = p.baseX + Math.sin(time * p.speed + p.phase) * p.drift;
        p.y = p.baseY + Math.cos(time * p.speed * .7 + p.phase) * p.drift * .6;
        p.baseX += p.vx;
        p.baseY += p.vy;
        if(p.baseX<-20) p.baseX=W+20;
        if(p.baseX>W+20) p.baseX=-20;
        if(p.baseY<-20) p.baseY=H+20;
        if(p.baseY>H+20) p.baseY=-20;

        /* mouse attraction */
        if(mouse.x !== null){
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < 200){
            const pull = (200-dist)/200 * .6;
            p.x += dx/dist * pull * 2;
            p.y += dy/dist * pull * 2;
          }
        }

        /* draw particle with glow */
        const alpha = .3 + Math.sin(time*.02+p.phase)*.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,212,255,${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,212,255,.3)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* connection lines */
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const d=dx*dx+dy*dy;
          if(d<18000){
            const a = .08*(1-d/18000);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${a})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }

      /* mouse connection lines */
      if(mouse.x !== null){
        for(const p of particles){
          const dx=p.x-mouse.x, dy=p.y-mouse.y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<160){
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(0,212,255,${.15*(1-d/160)})`;
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== HERO TEXT ANIMATION ===== */
  const tl = gsap.timeline({delay:.5});

  /* blob entrance */
  tl.from('.hero-blob', {scale:0, opacity:0, duration:1.5, ease:'power2.out'}, 0);

  /* orbs fade in staggered */
  tl.from('.orb', {scale:0, opacity:0, duration:.6, stagger:.1, ease:'back.out(1.6)'}, .3);

  /* eyebrow */
  tl.from('.hero-eyebrow', {opacity:0, y:20, duration:.6, ease:'power3.out'}, .4);

  /* characters — split by row for dramatic effect */
  tl.from('.name-row:first-child .char', {
    y:140, opacity:0, rotationX:-90, scale:.8,
    duration:.8, stagger:.05, ease:'back.out(1.5)'
  }, .6);
  tl.from('.name-row:last-child .char', {
    y:140, opacity:0, rotationX:-90, scale:.8,
    duration:.8, stagger:.05, ease:'back.out(1.5)'
  }, .9);

  /* role + tagline */
  tl.from('.role-word', {opacity:0, x:-30, duration:.5, ease:'power3.out'}, '-=.4');
  tl.from('.role-divider', {opacity:0, scaleX:0, duration:.3, ease:'power3.out'}, '-=.2');
  tl.from('.role-tagline', {opacity:0, x:30, duration:.5, ease:'power3.out'}, '-=.2');

  /* CTAs */
  tl.from('.hero-cta-row', {opacity:0, y:20, duration:.5, ease:'power3.out'}, '-=.1');

  /* scroll indicator */
  tl.from('.hero-scroll', {opacity:0, y:-10, duration:.5, ease:'power3.out'}, '-=.1');

  /* lines */
  tl.from('.hero-lines span', {scaleX:0, duration:.8, stagger:.15, ease:'power3.out'}, .5);

  /* ===== STAT COUNT-UP ===== */
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if(isNaN(target)) return;
    const obj = {val:0};
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 1.6, ease:'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  /* ===== CATEGORY CARD HOVER PARALLAX ===== */
  document.querySelectorAll('.cat-card').forEach(card => {
    const preview = card.querySelector('.cat-preview');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      gsap.to(card, {rotateY: x*6, rotateX: -y*6, duration:.4, ease:'power2.out'});
      if(preview) gsap.to(preview, {x: x*15, y: y*15, duration:.4, ease:'power2.out'});
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {rotateY:0, rotateX:0, duration:.6, ease:'elastic.out(1,.5)'});
      if(preview) gsap.to(preview, {x:0, y:0, duration:.6, ease:'elastic.out(1,.5)'});
    });
  });

})();
