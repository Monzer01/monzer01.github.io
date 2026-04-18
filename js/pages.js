/* ============================================================
   pages.js — Sub-page specific effects
   Neural network, liquid waves, film reel, matrix rain,
   typewriter, gallery reveals
   ============================================================ */
(function(){
  'use strict';

  const page = document.documentElement.dataset.page;

  /* ===== PAGE HERO ENTRANCE ===== */
  const heroTL = gsap.timeline({delay:.5});
  heroTL.from('.page-hero-label', {opacity:0, y:30, duration:.5, ease:'power3.out'});
  heroTL.from('.page-hero-title', {opacity:0, y:50, duration:.7, ease:'power3.out'}, '-=.25');
  heroTL.from('.page-hero-sub',   {opacity:0, y:30, duration:.5, ease:'power3.out'}, '-=.25');

  /* ===== NEURAL NETWORK CANVAS (webapps page) ===== */
  if(page === 'webapps'){
    const nc = document.getElementById('neon-canvas');
    if(nc){
      const ctx = nc.getContext('2d');
      let W, H, nodes = [], mouse = {x:null,y:null}, time = 0;

      function initNN(){
        W = nc.width  = nc.offsetWidth;
        H = nc.height = nc.offsetHeight;
        nodes = [];
        const COUNT = Math.min(60, Math.floor(W*H/16000));
        for(let i=0;i<COUNT;i++){
          nodes.push({
            x:Math.random()*W, y:Math.random()*H,
            vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
            r:Math.random()*3+1.5,
            pulse:Math.random()*Math.PI*2,
            layer:Math.floor(Math.random()*3)
          });
        }
      }
      initNN();
      window.addEventListener('resize', initNN);

      nc.addEventListener('mousemove', e => {
        const r = nc.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      nc.addEventListener('mouseleave', () => { mouse.x=null; mouse.y=null; });

      const colors = ['0,212,255','180,110,255','157,139,255'];

      function drawNN(){
        time += .01;
        ctx.clearRect(0,0,W,H);

        for(const n of nodes){
          n.x += n.vx + Math.sin(time+n.pulse)*.15;
          n.y += n.vy + Math.cos(time*.7+n.pulse)*.1;
          if(n.x<0||n.x>W) n.vx *= -1;
          if(n.y<0||n.y>H) n.vy *= -1;
          n.x = Math.max(0,Math.min(W,n.x));
          n.y = Math.max(0,Math.min(H,n.y));

          /* mouse interaction — attract nearby nodes */
          if(mouse.x!==null){
            const dx=mouse.x-n.x, dy=mouse.y-n.y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<180){
              n.x += dx/d * (180-d)/180 * 1.5;
              n.y += dy/d * (180-d)/180 * 1.5;
            }
          }

          const c = colors[n.layer];
          const a = .4 + Math.sin(time*2+n.pulse)*.2;

          /* glow */
          ctx.beginPath();
          ctx.arc(n.x,n.y,n.r*3,0,Math.PI*2);
          ctx.fillStyle = `rgba(${c},${a*.15})`;
          ctx.fill();

          /* core */
          ctx.beginPath();
          ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
          ctx.fillStyle = `rgba(${c},${a})`;
          ctx.fill();
        }

        /* connections — neural network style */
        for(let i=0;i<nodes.length;i++){
          for(let j=i+1;j<nodes.length;j++){
            const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
            const d=dx*dx+dy*dy;
            if(d<22000){
              const a = .1*(1-d/22000);
              /* data pulse traveling along line */
              const pulse = (Math.sin(time*3+i+j)*.5+.5);
              const mx = nodes[i].x + (nodes[j].x-nodes[i].x)*pulse;
              const my = nodes[i].y + (nodes[j].y-nodes[i].y)*pulse;

              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(0,212,255,${a})`;
              ctx.lineWidth = .5;
              ctx.stroke();

              /* data pulse dot */
              if(d<12000){
                ctx.beginPath();
                ctx.arc(mx,my,1.5,0,Math.PI*2);
                ctx.fillStyle = `rgba(180,110,255,${a*3})`;
                ctx.fill();
              }
            }
          }
        }

        /* mouse hub */
        if(mouse.x!==null){
          for(const n of nodes){
            const dx=n.x-mouse.x, dy=n.y-mouse.y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<150){
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(n.x, n.y);
              ctx.strokeStyle = `rgba(180,110,255,${.2*(1-d/150)})`;
              ctx.lineWidth = .8;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawNN);
      }
      drawNN();
    }

    /* glitch + scan line + symbols entrance */
    heroTL.from('.nsym', {scale:0, opacity:0, duration:.5, stagger:.08, ease:'back.out(1.5)'}, .3);
    heroTL.from('.neon-stats', {opacity:0, y:20, duration:.5, ease:'power3.out'}, '-=.2');

    const glitch = document.querySelector('.glitch');
    if(glitch){
      setInterval(() => {
        glitch.classList.add('glitching');
        setTimeout(() => glitch.classList.remove('glitching'), 200);
      }, 4000);
    }
  }

  /* ===== LIQUID WAVE CANVAS (websites page) ===== */
  if(page === 'websites'){
    const wc = document.getElementById('wave-canvas');
    if(wc){
      const ctx = wc.getContext('2d');
      let W, H, time = 0;

      function initWave(){
        W = wc.width  = wc.offsetWidth;
        H = wc.height = wc.offsetHeight;
      }
      initWave();
      window.addEventListener('resize', initWave);

      function drawWaves(){
        time += .008;
        ctx.clearRect(0,0,W,H);

        /* draw 4 layered waves */
        const waves = [
          {y:H*.45, amp:30, freq:.008, speed:1,   color:'0,232,123', alpha:.04},
          {y:H*.50, amp:25, freq:.012, speed:1.3, color:'0,232,123', alpha:.06},
          {y:H*.55, amp:20, freq:.015, speed:.8,  color:'0,212,255', alpha:.03},
          {y:H*.60, amp:35, freq:.006, speed:1.5, color:'0,232,123', alpha:.05},
        ];

        for(const w of waves){
          ctx.beginPath();
          ctx.moveTo(0, H);
          for(let x=0; x<=W; x+=2){
            const y = w.y
              + Math.sin(x * w.freq + time * w.speed) * w.amp
              + Math.sin(x * w.freq * 1.5 + time * w.speed * .7) * w.amp * .5;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H);
          ctx.closePath();
          ctx.fillStyle = `rgba(${w.color},${w.alpha})`;
          ctx.fill();
        }

        /* top flowing line */
        ctx.beginPath();
        for(let x=0; x<=W; x+=2){
          const y = H*.35 + Math.sin(x*.01+time*1.2)*20 + Math.sin(x*.025+time*.6)*10;
          if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.strokeStyle = 'rgba(0,232,123,.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        requestAnimationFrame(drawWaves);
      }
      drawWaves();
    }

    /* floating browsers entrance */
    heroTL.from('.float-browser', {
      scale:0, opacity:0, rotation:-10,
      duration:.7, stagger:.2, ease:'back.out(1.4)'
    }, .3);

    /* dots entrance */
    const dots = document.querySelector('.page-hero-dots');
    if(dots) heroTL.from(dots, {opacity:0, duration:.8, ease:'power2.out'}, 0);
  }

  /* ===== FILM REEL CANVAS (videos page) ===== */
  if(page === 'videos'){
    const fc = document.getElementById('film-canvas');
    if(fc){
      const ctx = fc.getContext('2d');
      let W, H, time = 0;

      function initFilm(){
        W = fc.width  = fc.offsetWidth;
        H = fc.height = fc.offsetHeight;
      }
      initFilm();
      window.addEventListener('resize', initFilm);

      function drawFilm(){
        time += .5;
        ctx.clearRect(0,0,W,H);

        /* Horizontal film frames moving across the background */
        const frameW = 160, frameH = 100, gap = 20;
        const totalW = frameW + gap;
        const rows = 3;
        const offsetX = -(time*.3) % totalW;

        for(let row=0; row<rows; row++){
          const yBase = H*.2 + row*(frameH+50);
          const dir = row % 2 === 0 ? 1 : -1;
          const ox = dir === 1 ? offsetX : -offsetX;

          for(let i=-1; i<Math.ceil(W/totalW)+1; i++){
            const x = i*totalW + ox;
            const alpha = .03 + Math.sin(time*.02 + i + row)*.015;

            /* frame border */
            ctx.strokeStyle = `rgba(255,140,66,${alpha*2})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, yBase, frameW, frameH);

            /* inner fill */
            ctx.fillStyle = `rgba(255,140,66,${alpha})`;
            ctx.fillRect(x+4, yBase+4, frameW-8, frameH-8);

            /* sprocket holes */
            for(let s=0; s<3; s++){
              const sy = yBase + 15 + s*30;
              ctx.beginPath();
              ctx.arc(x-8, sy, 4, 0, Math.PI*2);
              ctx.fillStyle = `rgba(255,140,66,${alpha*1.5})`;
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x+frameW+8, sy, 4, 0, Math.PI*2);
              ctx.fill();
            }
          }
        }

        /* dramatic light leak going from left to right */
        const leakX = (time*2) % (W+400) - 200;
        const leakGrad = ctx.createRadialGradient(leakX,H/2,0,leakX,H/2,200);
        leakGrad.addColorStop(0,'rgba(255,140,66,.05)');
        leakGrad.addColorStop(1,'transparent');
        ctx.fillStyle = leakGrad;
        ctx.fillRect(0,0,W,H);

        requestAnimationFrame(drawFilm);
      }
      drawFilm();
    }

    /* timecode counters */
    const tcs = document.querySelectorAll('.cinema-timecode, .cinema-timecode-inline');
    if(tcs.length){
      let frame = 0;
      function updateTC(){
        frame++;
        const f  = frame % 25;
        const s  = Math.floor(frame/25) % 60;
        const m  = Math.floor(frame/1500) % 60;
        const h  = Math.floor(frame/90000) % 24;
        const str =
          String(h).padStart(2,'0') + ':' +
          String(m).padStart(2,'0') + ':' +
          String(s).padStart(2,'0') + ':' +
          String(f).padStart(2,'0');
        tcs.forEach(el => el.textContent = str);
        requestAnimationFrame(updateTC);
      }
      updateTC();
    }

    /* cinema entrances */
    gsap.from('.cinema-bar.top',    {scaleY:4, duration:1.2, ease:'power3.inOut', delay:.2});
    gsap.from('.cinema-bar.bottom', {scaleY:4, duration:1.2, ease:'power3.inOut', delay:.2});
    heroTL.from('.cinema-tools-row .ct', {scale:0, opacity:0, duration:.4, stagger:.1, ease:'back.out(1.5)'}, '-=.1');
    heroTL.from('.film-strip span', {opacity:0, y:20, duration:.3, stagger:.05, ease:'power3.out'}, .4);
  }

  /* ===== MATRIX CANVAS RAIN (automation page) ===== */
  if(page === 'automation'){
    const mc = document.getElementById('matrix-canvas');
    if(mc){
      const ctx = mc.getContext('2d');
      let W, H;
      const fontSize = 14;
      let cols, drops;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>~=/\\|01';

      function initMatrix(){
        W = mc.width  = mc.offsetWidth;
        H = mc.height = mc.offsetHeight;
        cols = Math.floor(W/fontSize);
        drops = Array(cols).fill(1);
      }
      initMatrix();
      window.addEventListener('resize', initMatrix);

      function drawMatrix(){
        ctx.fillStyle = 'rgba(6,6,10,0.06)';
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = '#00ffcc';
        ctx.font = fontSize + 'px JetBrains Mono, monospace';
        for(let i=0; i<drops.length; i++){
          const ch = chars[Math.floor(Math.random()*chars.length)];
          ctx.globalAlpha = Math.random()*.5 + .2;
          ctx.fillText(ch, i*fontSize, drops[i]*fontSize);
          if(drops[i]*fontSize > H && Math.random()>.975){
            drops[i] = 0;
          }
          drops[i]++;
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawMatrix);
      }
      drawMatrix();
    }

    /* typewriter effect */
    const tw = document.querySelector('.typewriter');
    if(tw){
      const full = tw.textContent;
      tw.textContent = '';
      let idx = 0;
      function type(){
        if(idx < full.length){
          tw.textContent += full[idx++];
          setTimeout(type, 60 + Math.random()*40);
        }
      }
      setTimeout(type, 900);
    }

    /* blink cursor */
    const bc = document.querySelector('.blink-cursor');
    if(bc){
      setInterval(() => { bc.style.opacity = bc.style.opacity === '0' ? '1' : '0'; }, 530);
    }
  }

  /* ===== GALLERY ITEMS stagger ===== */
  gsap.utils.toArray('.showcase-gallery').forEach(gallery => {
    const items = gallery.querySelectorAll('.gallery-item');
    gsap.from(items, {
      opacity:0, y:60, scale:.95, duration:.8, stagger:.15, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:gallery, start:'top 80%', once:true }
    });
  });

  /* ===== APP PROJECT CARDS stagger (webapps.html) ===== */
  const appCards = document.querySelectorAll('.app-card');
  if(appCards.length){
    gsap.from(appCards, {
      opacity:0, y:80, scale:.92, duration:1, stagger:.2, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:'.app-cards-grid', start:'top 80%', once:true }
    });

    /* 3D tilt on hover */
    appCards.forEach(card => {
      const inner = card.querySelector('.app-card-inner');
      if(!inner) return;

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - .5;
        const y = (e.clientY - rect.top)  / rect.height - .5;
        gsap.to(inner, {
          rotateY: x * 6, rotateX: -y * 6,
          duration:.4, ease:'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(inner, { rotateY:0, rotateX:0, duration:.6, ease:'power3.out' });
      });
    });
  }

  /* ===== DETAIL PAGE HERO ===== */
  const detailHero = document.querySelector('.detail-hero');
  if(detailHero){
    const dtl = gsap.timeline({delay:.4});
    dtl.from('.detail-back',     {opacity:0, x:-30, duration:.5, ease:'power3.out'});
    dtl.from('.detail-num',      {opacity:0, y:60, duration:.6, ease:'power3.out'}, '-=.3');
    dtl.from('.detail-title',    {opacity:0, y:50, duration:.7, ease:'power3.out'}, '-=.3');
    dtl.from('.detail-subtitle', {opacity:0, y:30, duration:.5, ease:'power3.out'}, '-=.2');
    dtl.from('.detail-meta-item',{opacity:0, y:20, duration:.4, stagger:.1, ease:'power3.out'}, '-=.2');

    /* Detail canvas — floating particles matching project color */
    const dc = document.getElementById('detail-canvas');
    if(dc){
      const ctx = dc.getContext('2d');
      let W, H, particles = [];
      const color = detailHero.dataset.color;
      const colors = {
        neon:   ['rgba(0,212,255,.3)','rgba(180,110,255,.2)'],
        cyan:   ['rgba(0,212,255,.3)','rgba(0,100,255,.2)'],
        purple: ['rgba(180,110,255,.3)','rgba(255,102,170,.2)'],
        mint:   ['rgba(0,232,123,.3)','rgba(0,212,180,.2)']
      };
      const palette = colors[color] || colors.neon;

      function initDetailCanvas(){
        W = dc.width  = dc.offsetWidth;
        H = dc.height = dc.offsetHeight;
        particles = [];
        const count = Math.min(40, Math.floor(W*H/25000));
        for(let i=0;i<count;i++){
          particles.push({
            x: Math.random()*W, y: Math.random()*H,
            r: Math.random()*2+1,
            vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
            color: palette[Math.floor(Math.random()*palette.length)]
          });
        }
      }

      function drawDetailCanvas(){
        ctx.clearRect(0,0,W,H);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if(p.x<0) p.x=W; if(p.x>W) p.x=0;
          if(p.y<0) p.y=H; if(p.y>H) p.y=0;
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
        /* Connection lines */
        for(let i=0;i<particles.length;i++){
          for(let j=i+1;j<particles.length;j++){
            const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
            const dist=Math.sqrt(dx*dx+dy*dy);
            if(dist<120){
              ctx.beginPath();
              ctx.moveTo(particles[i].x,particles[i].y);
              ctx.lineTo(particles[j].x,particles[j].y);
              ctx.strokeStyle = palette[0].replace('.3',String(.08*(1-dist/120)));
              ctx.lineWidth=.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawDetailCanvas);
      }

      initDetailCanvas();
      drawDetailCanvas();
      window.addEventListener('resize', initDetailCanvas);
    }
  }

  /* ===== DETAIL GALLERY stagger ===== */
  const detailGallery = document.querySelector('.detail-gallery-grid');
  if(detailGallery){
    const items = detailGallery.querySelectorAll('.detail-gallery-item');
    gsap.from(items, {
      opacity:0, y:60, scale:.95, duration:.8, stagger:.15, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:detailGallery, start:'top 80%', once:true }
    });
  }

  /* ===== DETAIL HERO-IMAGE BROWSER FRAME — page-load entrance ===== */
  const heroBrowserFrame = document.querySelector('.detail-hero-image .detail-browser-frame');
  if(heroBrowserFrame){
    gsap.from(heroBrowserFrame, {
      opacity:0, y:80, scale:.95, duration:1.2, ease:'power3.out',
      delay:1.1
    });
  }

  /* ===== GALLERY BROWSER FRAMES — scroll-triggered ===== */
  const galleryBrowserFrames = document.querySelectorAll('.detail-gallery .detail-browser-frame');
  galleryBrowserFrames.forEach(frame => {
    gsap.from(frame, {
      opacity:0, y:40, scale:.97, duration:.8, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:frame, start:'top 90%', once:true }
    });
  });

  /* ===== AUTO CARDS stagger ===== */
  const autoCards = document.querySelectorAll('.auto-card');
  if(autoCards.length){
    gsap.from(autoCards, {
      opacity:0, y:50, duration:.7, stagger:.12, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:'.auto-grid', start:'top 80%', once:true }
    });
  }

  /* ===== VIDEO CAPABILITIES stagger ===== */
  const vidCaps = document.querySelectorAll('.vid-cap');
  if(vidCaps.length){
    gsap.from(vidCaps, {
      opacity:0, y:40, duration:.6, stagger:.1, ease:'power3.out',
      immediateRender:false,
      scrollTrigger:{ trigger:'.video-capabilities', start:'top 80%', once:true }
    });
  }

})();
