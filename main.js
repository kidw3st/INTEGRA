/* ============================================
   INTEGRA — Main JavaScript v2.0
   GSAP + ScrollTrigger + MotionPath
   All animations, interactions, effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // Smooth Scroll (custom, no plugin)
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const y = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // Preloader
  // ============================================
  const preloader = document.querySelector('.preloader');
  const preloaderLogo = document.querySelector('.preloader-logo');
  const preloaderBarFill = document.querySelector('.preloader-bar-fill');
  const preloaderCounter = document.querySelector('.preloader-counter');

  if (preloader && preloaderLogo) {
    // Split text into chars
    const text = preloaderLogo.textContent;
    preloaderLogo.innerHTML = text.split('').map(c =>
      `<span class="char">${c}</span>`
    ).join('');

    const chars = preloaderLogo.querySelectorAll('.char');
    let progress = 0;

    // Animate chars in
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.2
    });

    // Simulate loading
    const loadInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;

      if (preloaderBarFill) preloaderBarFill.style.width = progress + '%';
      if (preloaderCounter) preloaderCounter.textContent = Math.round(progress) + '%';

      if (progress >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
          gsap.to(preloader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
              document.body.style.overflow = '';
              initAnimations();
            }
          });
        }, 400);
      }
    }, 80);

    document.body.style.overflow = 'hidden';
  } else {
    initAnimations();
  }

  // ============================================
  // Main Animation Init
  // ============================================
  function initAnimations() {
    initSplitText();
    initCursor();
    initScrollProgress();
    initNav();
    initHero();
    initAbout();
    initPortfolio();
    initServices();
    initProcess();
    initTestimonial();
    initContact();
    initFooter();
    initParallaxOrb();
    initDotGridInteraction();
  }

  // ============================================
  // Split Text Utility
  // ============================================
  function splitTextIntoChars(el) {
    const text = el.textContent;
    el.innerHTML = text.split('').map(c =>
      c === ' ' ? ' ' : `<span class="char">${c}</span>`
    ).join('');
    return el.querySelectorAll('.char');
  }

  function splitTextIntoWords(el) {
    const text = el.textContent;
    el.innerHTML = text.split(/(\s+)/).map(w => {
      if (/^\s+$/.test(w)) return w;
      const chars = w.split('').map(c => `<span class="char">${c}</span>`).join('');
      return `<span class="word">${chars}</span>`;
    }).join('');
    return el.querySelectorAll('.word .char');
  }

  function initSplitText() {
    // Split hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const line = heroTitle.querySelector('.hero-title-line');
      if (line) splitTextIntoChars(line);
    }

    // Split all section titles
    document.querySelectorAll('.section-title').forEach(title => {
      splitTextIntoWords(title);
    });

    // Split eyebrows
    document.querySelectorAll('.eyebrow').forEach(el => {
      splitTextIntoChars(el);
    });
  }

  // ============================================
  // Custom Cursor
  // ============================================
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    function updateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .service-item, input, textarea, .btn-primary, .btn-secondary');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    // Click ripple
    document.addEventListener('click', (e) => {
      createRipple(e.clientX, e.clientY);
    });

    // Cursor text for portfolio cards
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.textContent = el.dataset.cursor;
        cursor.style.cssText += 'display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#000;';
      });
      el.addEventListener('mouseleave', () => {
        cursor.textContent = '';
        cursor.style.fontSize = '';
      });
    });
  }

  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);

    gsap.to(ripple, {
      width: 100,
      height: 100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  }

  // ============================================
  // Scroll Progress Bar
  // ============================================
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // ============================================
  // Navigation
  // ============================================
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Show nav after hero
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 80%',
      onEnter: () => nav.classList.add('visible'),
      onLeaveBack: () => nav.classList.remove('visible')
    });

    // Compact nav on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // Active link tracking
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.pageYOffset >= top) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
          link.style.color = 'var(--n-900)';
        }
      });
    }, { passive: true });
  }

  // ============================================
  // Hero Section
  // ============================================
  function initHero() {
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
      .to('.hero-bg-layer', { opacity: 1, duration: 1.5, ease: 'power2.out' })
      .to('.hero-gradient-orb', { opacity: 1, duration: 2, ease: 'power2.out' }, '-=1.2')
      .to('.dot-grid', { opacity: 1, duration: 1.5, ease: 'power2.out' }, '-=1.2');

    // Title chars reveal
    const titleChars = document.querySelectorAll('.hero-title .char');
    if (titleChars.length) {
      heroTl.to(titleChars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out'
      }, '-=0.8');
    }

    heroTl
      .to('#heroSubtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .to('.hero-cta-group', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('#heroScroll', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    // Hero parallax on scroll
    gsap.to('#heroBg', {
      y: -120,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.dot-grid', {
      y: -80,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('#heroContent', {
      y: -100,
      opacity: 0,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: 1 }
    });

    gsap.to('#heroScroll', {
      opacity: 0,
      scrollTrigger: { trigger: '#hero', start: '15% top', end: '35% top', scrub: 1 }
    });

    gsap.to('.hero-cta-group', {
      opacity: 0,
      y: -40,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: 1 }
    });
  }

  // ============================================
  // Parallax Gradient Orb
  // ============================================
  function initParallaxOrb() {
    const orb = document.querySelector('.hero-gradient-orb');
    if (!orb) return;

    let orbX = 0, orbY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 200;
      targetY = (e.clientY / window.innerHeight - 0.5) * 200;
    });

    function updateOrb() {
      orbX += (targetX - orbX) * 0.03;
      orbY += (targetY - orbY) * 0.03;
      orb.style.transform = `translate(${orbX}px, ${orbY}px)`;
      requestAnimationFrame(updateOrb);
    }
    updateOrb();
  }

  // ============================================
  // Dot Grid Interaction (mouse proximity)
  // ============================================
  function initDotGridInteraction() {
    const dotGrid = document.getElementById('dotGrid');
    if (!dotGrid) return;

    const GRID_SIZE = 13;
    const dots = dotGrid.querySelectorAll('.dot');
    if (!dots.length) return;

    // Initial animation from center
    const centerRow = Math.floor(GRID_SIZE / 2);
    const centerCol = Math.floor(GRID_SIZE / 2);

    dots.forEach((dot, i) => {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));

      gsap.fromTo(dot,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1.2,
          opacity: 0.7,
          duration: 0.5,
          delay: 0.5 + distance * 0.04,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
          onComplete: () => gsap.set(dot, { scale: 0.75, opacity: 0.3 })
        }
      );
    });

    // Mouse proximity effect
    document.addEventListener('mousemove', (e) => {
      const rect = dotGrid.getBoundingClientRect();
      if (e.clientY > rect.bottom + 200) return; // Skip if far below

      dots.forEach((dot, i) => {
        const dotRect = dot.getBoundingClientRect();
        const dotCenterX = dotRect.left + dotRect.width / 2;
        const dotCenterY = dotRect.top + dotRect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - dotCenterX, 2) + Math.pow(e.clientY - dotCenterY, 2));

        if (dist < 120) {
          const scale = gsap.utils.mapRange(0, 120, 2.5, 0.75, dist);
          const opacity = gsap.utils.mapRange(0, 120, 0.9, 0.3, dist);
          gsap.to(dot, { scale, opacity, duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(dot, { scale: 0.75, opacity: 0.3, duration: 0.5, ease: 'power2.out' });
        }
      });
    });
  }

  // ============================================
  // About Section
  // ============================================
  function initAbout() {
    // Eyebrow chars
    const aboutEyebrow = document.querySelector('#about .eyebrow');
    if (aboutEyebrow) {
      const chars = aboutEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#about', start: 'top 75%' }
      });
    }

    // Title words
    const aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) {
      const chars = aboutTitle.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#about .section-title', start: 'top 70%' }
      });
    }

    // Accent text underline
    const accentText = document.querySelector('#about .accent-text');
    if (accentText) {
      ScrollTrigger.create({
        trigger: accentText,
        start: 'top 75%',
        once: true,
        onEnter: () => accentText.classList.add('revealed')
      });
    }

    // Counter animation
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, i) => {
      const target = parseInt(stat.dataset.target);
      const numberEl = stat.querySelector('.stat-number');
      if (!numberEl || isNaN(target)) return;

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          stat.classList.add('revealed');
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              numberEl.textContent = Math.round(obj.val);
            }
          });
        }
      });
    });

    // Stagger stats reveal
    gsap.from('.stat', {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.about-stats', start: 'top 80%' }
    });

    // Description
    gsap.to('.about-description', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.about-description', start: 'top 85%' }
    });
  }

  // ============================================
  // Portfolio Section
  // ============================================
  function initPortfolio() {
    // Eyebrow
    const portEyebrow = document.querySelector('#portfolio .eyebrow');
    if (portEyebrow) {
      const chars = portEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#portfolio', start: 'top 75%' }
      });
    }

    // Title
    const portTitle = document.querySelector('#portfolio .section-title');
    if (portTitle) {
      const chars = portTitle.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#portfolio .section-title', start: 'top 70%' }
      });
    }

    // Cards staggered reveal with 3D tilt
    const cards = gsap.utils.toArray('.portfolio-card');
    cards.forEach((card, i) => {
      // Reveal animation
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%' }
      });

      // 3D tilt on mouse move
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power3.out'
        });
      });
    });
  }

  // ============================================
  // Services Section
  // ============================================
  function initServices() {
    // Eyebrow
    const servEyebrow = document.querySelector('#services .eyebrow');
    if (servEyebrow) {
      const chars = servEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#services', start: 'top 75%' }
      });
    }

    // Title
    const servTitle = document.querySelector('#services .section-title');
    if (servTitle) {
      const chars = servTitle.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#services .section-title', start: 'top 70%' }
      });
    }

    // Service items staggered
    const items = gsap.utils.toArray('.service-item');
    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%' }
      });
    });
  }

  // ============================================
  // Process Section
  // ============================================
  function initProcess() {
    // Eyebrow
    const procEyebrow = document.querySelector('#process .eyebrow');
    if (procEyebrow) {
      const chars = procEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#process', start: 'top 75%' }
      });
    }

    // Title
    const procTitle = document.querySelector('#process .section-title');
    if (procTitle) {
      const chars = procTitle.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#process .section-title', start: 'top 70%' }
      });
    }

    // Timeline line fill
    const timelineLineFill = document.querySelector('.process-timeline-line-fill');
    if (timelineLineFill) {
      gsap.to(timelineLineFill, {
        height: '100%',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 1
        }
      });
    }

    // Process steps
    const steps = gsap.utils.toArray('.process-step');
    steps.forEach((step, i) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: step, start: 'top 80%' }
      });

      tl.to(step, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      .to(step.querySelector('.step-number'), {
        color: '#0071E3',
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.3');
    });

    // SVG Circuit animation
    initCircuitAnimation();
  }

  function initCircuitAnimation() {
    gsap.registerPlugin(MotionPathPlugin);

    const circuitPath = document.getElementById('circuitPath');
    const travelDot = document.getElementById('travelDot');
    const morphShape = document.getElementById('morphShape');

    if (!circuitPath || !travelDot || !morphShape) return;

    const pathLength = circuitPath.getTotalLength();

    gsap.set(circuitPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 0.8
    });

    gsap.set(travelDot, { opacity: 0 });
    gsap.set(morphShape, { opacity: 0 });

    const circuitTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#process',
        start: 'top 60%',
        toggleActions: 'play none none none'
      }
    });

    circuitTl
      .to(circuitPath, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' })
      .to(travelDot, { opacity: 1, duration: 0.2 }, 0.5)
      .to(travelDot, {
        motionPath: {
          path: '#circuitPath',
          align: '#circuitPath',
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        },
        duration: 3,
        ease: 'power1.inOut'
      }, 0.5)
      .to(morphShape, { opacity: 0.6, duration: 0.4 }, 0.8)
      .to(morphShape, { scale: 1.5, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.inOut' }, 1.2)
      .to(morphShape, { rotation: 90, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.inOut' }, 1.8)
      .to(morphShape, { scale: 0.8, rotation: 180, duration: 0.5, ease: 'power2.inOut' }, 2.3)
      .to(morphShape, { scale: 1, rotation: 360, opacity: 0.8, duration: 0.4, ease: 'power2.out' }, 2.8);
  }

  // ============================================
  // Testimonial Section
  // ============================================
  function initTestimonial() {
    // Eyebrow
    const testEyebrow = document.querySelector('#testimonial .eyebrow');
    if (testEyebrow) {
      const chars = testEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#testimonial', start: 'top 75%' }
      });
    }

    gsap.to('.testimonial-quote p', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.testimonial-quote', start: 'top 75%' }
    });

    gsap.to('.testimonial-quote footer', {
      opacity: 1,
      duration: 0.8,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.testimonial-quote', start: 'top 75%' }
    });
  }

  // ============================================
  // Contact Section
  // ============================================
  function initContact() {
    // Eyebrow
    const contactEyebrow = document.querySelector('#contact .eyebrow');
    if (contactEyebrow) {
      const chars = contactEyebrow.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 75%' }
      });
    }

    // Title
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) {
      const chars = contactTitle.querySelectorAll('.char');
      gsap.from(chars, {
        opacity: 0,
        y: 60,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#contact .section-title', start: 'top 70%' }
      });
    }

    gsap.to('.contact-form', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.contact-form', start: 'top 85%' }
    });

    gsap.to('.contact-links', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.contact-links', start: 'top 90%' }
    });

    // Form handling
    initForm();
  }

  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const btn = form.querySelector('.btn-submit');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Validation
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
      const group = input.closest('.form-group');
      let error = group.querySelector('.form-error');
      if (!error) {
        error = document.createElement('div');
        error.className = 'form-error';
        group.appendChild(error);
      }
      error.textContent = message;
      error.classList.add('visible');
      input.style.borderColor = 'var(--error)';
    }

    function clearError(input) {
      const group = input.closest('.form-group');
      const error = group.querySelector('.form-error');
      if (error) error.classList.remove('visible');
      input.style.borderColor = '';
    }

    // Real-time validation
    nameInput.addEventListener('blur', () => {
      if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Минимум 2 символа');
      } else {
        clearError(nameInput);
      }
    });

    emailInput.addEventListener('blur', () => {
      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Введите корректный email');
      } else {
        clearError(emailInput);
      }
    });

    messageInput.addEventListener('blur', () => {
      if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Минимум 10 символов');
      } else {
        clearError(messageInput);
      }
    });

    // Clear on focus
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('focus', () => clearError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all
      let valid = true;

      if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Минимум 2 символа');
        valid = false;
      }

      if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Введите корректный email');
        valid = false;
      }

      if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Минимум 10 символов');
        valid = false;
      }

      if (!valid) {
        // Shake button
        gsap.fromTo(btn, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        return;
      }

      // Success animation
      btn.classList.add('sending');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Отправка...</span>';

      setTimeout(() => {
        btn.classList.remove('sending');
        btn.classList.add('sent');
        btn.innerHTML = '<span>Отправлено!</span>';

        gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });

        // Confetti-like particles
        createSuccessParticles(btn);

        setTimeout(() => {
          btn.classList.remove('sent');
          btn.innerHTML = originalHTML;
          form.reset();
        }, 3000);
      }, 1200);
    });
  }

  function createSuccessParticles(btn) {
    const rect = btn.getBoundingClientRect();
    const colors = ['#0071E3', '#30D158', '#5AC8FA', '#FF9F0A'];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${colors[i % colors.length]};
        pointer-events: none;
        z-index: 10001;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
      `;
      document.body.appendChild(particle);

      const angle = (i / 12) * Math.PI * 2;
      const distance = 80 + Math.random() * 60;

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  // ============================================
  // Footer
  // ============================================
  function initFooter() {
    gsap.from('.footer-content', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.footer', start: 'top 95%' }
    });
  }

  // ============================================
  // Section Morphing Transitions
  // ============================================
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, i) => {
    if (i === 0) return;

    gsap.fromTo(section,
      { clipPath: 'inset(6% 0 6% 0)' },
      {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1
        }
      }
    );
  });

  // ============================================
  // Performance: Refresh on resize
  // ============================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
});
