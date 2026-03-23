/* ============================================================
   MONZER AZIZ — PORTFOLIO  ·  main.js
   Custom cursor · GSAP animations · i18n · interactions
   ============================================================ */

(() => {
  'use strict';

  /* ==========================================================
     TRANSLATIONS  (EN / DE)
     ========================================================== */
  const T = {
    en: {
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.contact': 'Contact',
      'hero.pretitle': "Hello, I'm",
      'hero.subtitle': 'Creative Technologist',
      'hero.tagline': 'Bridging Art & Automation',
      'hero.cta': 'Explore My Work',
      'hero.scroll': 'Scroll',
      'about.label': 'About',
      'about.title': 'A one-person production & technology hub',
      'about.p1': "With a Master\u2019s degree in Media and Communication and over five years of experience, I operate as a one-person production and technology hub. On any given week, I\u2019m producing video content, designing graphics and animations, building web applications, and engineering automation tools \u2014 bridging creative production, instructional thinking, and technical execution.",
      'about.p2': 'By applying AI-driven scripting, I reduced editing time for large-scale projects by 50%. I built a Python tool that automatically removes silent segments from Zoom recordings. I design and deliver internal workshops on AI and automation \u2014 making complex content accessible to all levels.',
      'about.stat1': 'Years Experience',
      'about.stat2': 'Languages',
      'about.stat3': 'Curiosity',
      'projects.label': 'Selected Work',
      'projects.p1.title': 'Ya Hablas \u2014 Language Academy',
      'projects.p1.desc': 'A full-featured language learning platform with Duolingo-style gamification. XP tracking, streaks, badges, leaderboard, spaced repetition, daily challenges, and a word bank \u2014 supporting multiple languages and proficiency levels.',
      'projects.p2.title': 'Pine-MD \u2014 Medical Practice',
      'projects.p2.desc': 'A modern, professional website for a medical practice. Clean design focused on trust, accessibility, and patient experience. Responsive layout with intuitive navigation and clear service presentation.',
      'projects.p3.title': 'ZDF VMS \u2014 Recording Dashboard',
      'projects.p3.desc': 'A centralized data recording system for managing lecture recordings at FOM Hochschule. Three detail views, advanced filtering, real-time status tracking, and Panopto/Moodle integration \u2014 handling hundreds of weekly recordings.',
      'projects.p4.title': 'Smart Feedback System',
      'projects.p4.desc': 'An intelligent feedback system for virtual lecture operations. Pre-filled fields via URL parameters, voice-to-text with automatic transcription, structured categories, and seamless integration with the recording management system.',
      'projects.viewlive': 'View Live',
      'skills.label': 'Skills & Tools',
      'skills.design': 'Design & Video Production',
      'skills.tech': 'Technical & Automation',
      'skills.languages': 'Languages',
      'contact.label': 'Contact',
      'contact.title': "Let\u2019s Work Together",
      'contact.desc': "Have a project in mind? I\u2019m always open to discussing new ideas, creative collaborations, or freelance opportunities. Whether you need a web app, automation solution, or creative production \u2014 let\u2019s talk.",
      'contact.name': 'Name',
      'contact.message': 'Message',
      'contact.send': 'Send Message',
    },
    de: {
      'nav.about': '\u00DCber mich',
      'nav.projects': 'Projekte',
      'nav.skills': 'Skills',
      'nav.contact': 'Kontakt',
      'hero.pretitle': 'Hallo, ich bin',
      'hero.subtitle': 'Kreativer Technologe',
      'hero.tagline': 'Br\u00FCcke zwischen Kunst & Automatisierung',
      'hero.cta': 'Meine Arbeit entdecken',
      'hero.scroll': 'Scrollen',
      'about.label': '\u00DCber mich',
      'about.title': 'Ein Ein-Personen-Produktions- & Technologie-Hub',
      'about.p1': 'Mit einem Master-Abschluss in Medien und Kommunikation und \u00FCber f\u00FCnf Jahren Erfahrung arbeite ich als Ein-Personen-Produktions- und Technologie-Hub. In einer typischen Woche produziere ich Videoinhalte, gestalte Grafiken und Animationen, entwickle Webanwendungen und baue Automatisierungstools \u2014 als Br\u00FCcke zwischen kreativer Produktion, didaktischem Denken und technischer Umsetzung.',
      'about.p2': 'Durch den Einsatz von KI-gest\u00FCtztem Skripting habe ich die Bearbeitungszeit f\u00FCr gro\u00DFe Projekte um 50% reduziert. Ich habe ein Python-Tool entwickelt, das automatisch stille Segmente aus Zoom-Aufnahmen entfernt. Zudem konzipiere und leite ich interne Workshops zu KI und Automatisierung.',
      'about.stat1': 'Jahre Erfahrung',
      'about.stat2': 'Sprachen',
      'about.stat3': 'Neugier',
      'projects.label': 'Ausgew\u00E4hlte Arbeiten',
      'projects.p1.title': 'Ya Hablas \u2014 Sprachakademie',
      'projects.p1.desc': 'Eine vollst\u00E4ndige Sprachlernplattform mit Duolingo-artiger Gamification. XP-Tracking, Streak-System, Badges, Bestenliste, Spaced Repetition, t\u00E4gliche Challenges und eine Wortbank \u2014 f\u00FCr mehrere Sprachen und Niveaustufen.',
      'projects.p2.title': 'Pine-MD \u2014 Arztpraxis',
      'projects.p2.desc': 'Eine moderne, professionelle Website f\u00FCr eine Arztpraxis. Klares Design mit Fokus auf Vertrauen, Zug\u00E4nglichkeit und Patientenerlebnis. Responsives Layout mit intuitiver Navigation.',
      'projects.p3.title': 'ZDF VMS \u2014 Aufzeichnungs-Dashboard',
      'projects.p3.desc': 'Ein zentrales Datenerfassungssystem f\u00FCr Vorlesungsaufzeichnungen an der FOM Hochschule. Drei Detailansichten, erweiterte Filter, Echtzeit-Statusverfolgung und Panopto/Moodle-Integration \u2014 f\u00FCr Hunderte w\u00F6chentlicher Aufzeichnungen.',
      'projects.p4.title': 'Intelligentes Feedback-System',
      'projects.p4.desc': 'Ein intelligentes Feedback-System f\u00FCr den virtuellen Lehrbetrieb. Vorausgef\u00FCllte Felder via URL-Parameter, Sprach-zu-Text mit automatischer Transkription, strukturierte Kategorien und nahtlose Integration in das Aufzeichnungsmanagement.',
      'projects.viewlive': 'Live ansehen',
      'skills.label': 'Skills & Tools',
      'skills.design': 'Design & Videoproduktion',
      'skills.tech': 'Technik & Automatisierung',
      'skills.languages': 'Sprachen',
      'contact.label': 'Kontakt',
      'contact.title': 'Zusammenarbeiten',
      'contact.desc': 'Haben Sie ein Projekt im Sinn? Ich bin immer offen f\u00FCr neue Ideen, kreative Zusammenarbeit oder Freelance-M\u00F6glichkeiten. Ob Web-App, Automatisierungsl\u00F6sung oder kreative Produktion \u2014 lassen Sie uns sprechen.',
      'contact.name': 'Name',
      'contact.message': 'Nachricht',
      'contact.send': 'Nachricht senden',
    },
  };

  let currentLang = localStorage.getItem('lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (T[lang] && T[lang][key]) {
        el.textContent = T[lang][key];
      }
    });

    document.querySelectorAll('.lang-option').forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
  }

  /* ==========================================================
     DOM READY
     ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    applyLang(currentLang);
    initCursor();
    initNav();
    initMobileMenu();
    initLangToggle();
    initScrollProgress();
    initMagnetic();

    // Wait for GSAP to load (deferred)
    if (typeof gsap !== 'undefined') {
      initGSAP();
    } else {
      window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') initGSAP();
      });
    }
  });

  /* ==========================================================
     CUSTOM CURSOR
     ========================================================== */
  function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;
    if (matchMedia('(pointer:coarse)').matches) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    (function tick() {
      fx += (mx - fx) * 0.15;
      fy += (my - fy) * 0.15;
      follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('a, button, .magnetic, .project-image').forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('active'));
      el.addEventListener('mouseleave', () => follower.classList.remove('active'));
    });
  }

  /* ==========================================================
     NAVBAR SCROLL STATE
     ========================================================== */
  function initNav() {
    const nav = document.querySelector('.navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ==========================================================
     MOBILE MENU
     ========================================================== */
  function initMobileMenu() {
    const btn = document.querySelector('.nav-hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* ==========================================================
     LANGUAGE TOGGLE
     ========================================================== */
  function initLangToggle() {
    document.querySelectorAll('.lang-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        if (lang && lang !== currentLang) applyLang(lang);
      });
    });
  }

  /* ==========================================================
     SCROLL PROGRESS
     ========================================================== */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h) * 100 + '%' : '0%';
    });
  }

  /* ==========================================================
     MAGNETIC BUTTONS
     ========================================================== */
  function initMagnetic() {
    if (matchMedia('(pointer:coarse)').matches) return;

    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ==========================================================
     GSAP ANIMATIONS
     ========================================================== */
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero entrance ---
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTL
      .to('.name-inner', {
        y: 0,
        duration: 1.2,
        stagger: 0.15,
      })
      .to('.hero-pretitle', { opacity: 1, duration: 0.6 }, '-=0.6')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

    // --- Reveal-up on scroll ---
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // --- Section headers ---
    gsap.utils.toArray('.section-header').forEach((h) => {
      gsap.from(h.children, {
        scrollTrigger: {
          trigger: h,
          start: 'top 90%',
        },
        opacity: 0,
        x: -30,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
      });
    });

    // --- Stat numbers count-up ---
    gsap.utils.toArray('.stat-number').forEach((el) => {
      const end = el.textContent.trim();
      if (end === '∞') return;
      const num = parseInt(end, 10);
      if (isNaN(num)) return;
      const suffix = end.replace(String(num), '');
      el.textContent = '0' + suffix;
      const obj = { v: 0 };

      gsap.to(obj, {
        v: num,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
        duration: 1.5,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(obj.v) + suffix;
        },
      });
    });

    // --- Project rows stagger ---
    gsap.utils.toArray('.project-row').forEach((row) => {
      const children = row.querySelectorAll('.reveal-up');
      gsap.to(children, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
        },
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      });
    });

    // --- Skill tags stagger ---
    gsap.utils.toArray('.skill-group').forEach((group) => {
      const tags = group.querySelectorAll('.skill-tags span');
      gsap.from(tags, {
        scrollTrigger: {
          trigger: group,
          start: 'top 88%',
        },
        opacity: 0,
        y: 16,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    // --- Parallax on hero orbs ---
    gsap.to('.hero-orb-1', {
      yPercent: 40,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-orb-2', {
      yPercent: 30,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-orb-3', {
      yPercent: 50,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
})();
