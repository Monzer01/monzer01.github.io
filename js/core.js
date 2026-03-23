/* ============================================================
   core.js — Shared logic for ALL pages
   Custom cursor, nav, language, magnetic, reveal, transitions
   ============================================================ */
(function(){
  'use strict';

  const IS_TOUCH = matchMedia('(pointer:coarse)').matches;

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
      if(cur)  cur.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
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
