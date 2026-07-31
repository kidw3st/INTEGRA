/* ============================================
   INTEGRA — Main JavaScript v3.0
   No preloader, all animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Smooth Scroll
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

  // Init everything
  initAnimations();

  function initAnimations() {
    initSplitText();
    initCursor();
    initCursorTrail();
    initScrollProgress();
    initNav();
    initHero();
    initAbout();
    initMarquee();
    initPortfolio();
    initServices();
    initProcess();
    initTestimonialSlider();
    initContact();
    initFooter();
    initParallaxOrb();
    initDotGridInteraction();
    initMagneticButtons();
    initTextScramble();
    initGlowCards();
    initHamburger();
    initThemeToggle();
    initBlurReveal();
    initSectionMorphing();
    initCanvasParticles();
    initTypingEffect();
    initScrollColorShift();
    initParallaxLayers();
    initAnimatedStats();
    initScrollSnap();
    initAnimatedFavicon();
    initTeam();
    initPricing();
    initFAQ();
    initClientsMarquee();
  }

  // ============================================
  // Split Text
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
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const line = heroTitle.querySelector('.hero-title-line');
      if (line) splitTextIntoChars(line);
    }
    document.querySelectorAll('.section-title').forEach(title => {
      splitTextIntoWords(title);
    });
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

    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .service-item, input, textarea, .btn-primary, .btn-secondary');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
      target.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
    document.addEventListener('click', (e) => createRipple(e.clientX, e.clientY));

    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.textContent = el.dataset.cursor;
        cursor.style.cssText += 'display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;letter-spacing:0.05em;color:#000;';
      });
      el.addEventListener('mouseleave', () => { cursor.textContent = ''; cursor.style.fontSize = ''; });
    });
  }

  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    gsap.to(ripple, { width: 100, height: 100, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => ripple.remove() });
  }

  // ============================================
  // Cursor Trail
  // ============================================
  function initCursorTrail() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const TRAIL_COUNT = 8;
    const trail = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.width = (6 - i * 0.5) + 'px';
      dot.style.height = (6 - i * 0.5) + 'px';
      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function updateTrail() {
      let prevX = mouseX, prevY = mouseY;
      trail.forEach((dot) => {
        const speed = 0.3 - trail.indexOf(dot) * 0.02;
        dot.x += (prevX - dot.x) * speed;
        dot.y += (prevY - dot.y) * speed;
        dot.el.style.transform = `translate(${dot.x - 3}px, ${dot.y - 3}px)`;
        dot.el.style.opacity = (0.4 - trail.indexOf(dot) * 0.04);
        prevX = dot.x;
        prevY = dot.y;
      });
      requestAnimationFrame(updateTrail);
    }
    updateTrail();
  }

  // ============================================
  // Scroll Progress
  // ============================================
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (scrollTop / docHeight) * 100 + '%';
    }, { passive: true });
  }

  // ============================================
  // Navigation
  // ============================================
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 80%',
      onEnter: () => nav.classList.add('visible'),
      onLeaveBack: () => nav.classList.remove('visible')
    });
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.pageYOffset > 100);
    }, { passive: true });
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--n-900)';
      });
    }, { passive: true });
  }

  // ============================================
  // Hero Section
  // ============================================
  function initHero() {
    gsap.set('.hero-bg-layer', { opacity: 0 });
    gsap.set('.hero-gradient-orb', { opacity: 0 });
    gsap.set('.hero-title', { opacity: 0 });
    gsap.set('#heroSubtitle', { opacity: 0, y: 30 });
    gsap.set('.hero-cta-group', { opacity: 0, y: 30 });
    gsap.set('#heroScroll', { opacity: 0 });

    const titleChars = document.querySelectorAll('.hero-title .char');
    if (titleChars.length) gsap.set(titleChars, { opacity: 0, y: 50 });

    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .to('.hero-bg-layer', { opacity: 1, duration: 1.5, ease: 'power2.out' })
      .to('.hero-gradient-orb', { opacity: 1, duration: 2, ease: 'power2.out' }, '-=1.2')
      .to('.hero-title', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=1');

    if (titleChars.length) {
      heroTl.to(titleChars, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, '-=0.6');
    }

    heroTl
      .to('#heroSubtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .to('.hero-cta-group', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('#heroScroll', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    gsap.to('#heroBg', { y: -120, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.dot-grid', { y: -80, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('#heroContent', { y: -100, opacity: 0, scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: 1 } });
    gsap.to('#heroScroll', { opacity: 0, scrollTrigger: { trigger: '#hero', start: '15% top', end: '35% top', scrub: 1 } });
    gsap.to('.hero-cta-group', { opacity: 0, y: -40, scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: 1 } });
  }

  // ============================================
  // Parallax Orb
  // ============================================
  function initParallaxOrb() {
    const orb = document.querySelector('.hero-gradient-orb');
    if (!orb) return;
    let orbX = 0, orbY = 0, targetX = 0, targetY = 0;
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
  // Dot Grid Interaction
  // ============================================
  function initDotGridInteraction() {
    const dotGrid = document.getElementById('dotGrid');
    if (!dotGrid) return;
    const GRID_SIZE = 13;
    const dots = dotGrid.querySelectorAll('.dot');
    if (!dots.length) return;
    const centerRow = Math.floor(GRID_SIZE / 2);
    const centerCol = Math.floor(GRID_SIZE / 2);
    dots.forEach((dot, i) => {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
      gsap.fromTo(dot, { scale: 0.5, opacity: 0 }, {
        scale: 1.2, opacity: 0.7, duration: 0.5, delay: 0.5 + distance * 0.04,
        ease: 'power2.inOut', yoyo: true, repeat: 1,
        onComplete: () => gsap.set(dot, { scale: 0.75, opacity: 0.3 })
      });
    });
    document.addEventListener('mousemove', (e) => {
      const rect = dotGrid.getBoundingClientRect();
      if (e.clientY > rect.bottom + 200) return;
      dots.forEach((dot) => {
        const dotRect = dot.getBoundingClientRect();
        const dotCenterX = dotRect.left + dotRect.width / 2;
        const dotCenterY = dotRect.top + dotRect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - dotCenterX, 2) + Math.pow(e.clientY - dotCenterY, 2));
        if (dist < 120) {
          gsap.to(dot, { scale: gsap.utils.mapRange(0, 120, 2.5, 0.75, dist), opacity: gsap.utils.mapRange(0, 120, 0.9, 0.3, dist), duration: 0.3, ease: 'power2.out' });
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
    const aboutEyebrow = document.querySelector('#about .eyebrow');
    if (aboutEyebrow) {
      gsap.from(aboutEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#about', start: 'top 75%' } });
    }
    const aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) {
      gsap.from(aboutTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#about .section-title', start: 'top 70%' } });
    }
    const accentText = document.querySelector('#about .accent-text');
    if (accentText) {
      ScrollTrigger.create({ trigger: accentText, start: 'top 75%', once: true, onEnter: () => accentText.classList.add('revealed') });
    }
    document.querySelectorAll('.stat').forEach(stat => {
      const target = parseInt(stat.dataset.target);
      const suffix = stat.dataset.suffix || '';
      const numberEl = stat.querySelector('.stat-number');
      if (!numberEl || isNaN(target)) return;
      ScrollTrigger.create({
        trigger: stat, start: 'top 80%', once: true,
        onEnter: () => {
          stat.classList.add('revealed');
          const obj = { val: 0 };
          gsap.to(obj, { val: target, duration: 2, ease: 'power2.out', onUpdate: () => { numberEl.textContent = Math.round(obj.val) + suffix; } });
        }
      });
    });
    gsap.from('.stat', { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.about-stats', start: 'top 80%' } });
    gsap.to('.about-description', { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.about-description', start: 'top 85%' } });
  }

  // ============================================
  // Marquee
  // ============================================
  function initMarquee() {
    const marquee = document.querySelector('.marquee');
    const track = document.querySelector('.marquee-track');
    if (!marquee || !track) return;
    gsap.to(track, {
      scrollTrigger: {
        trigger: marquee, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => { track.style.animationDuration = (20 - self.progress * 10) + 's'; }
      }
    });
  }

  // ============================================
  // Portfolio (Horizontal Scroll)
  // ============================================
  function initPortfolio() {
    const portEyebrow = document.querySelector('#portfolio .eyebrow');
    if (portEyebrow) {
      gsap.from(portEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#portfolio', start: 'top 75%' } });
    }
    const portTitle = document.querySelector('#portfolio .section-title');
    if (portTitle) {
      gsap.from(portTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#portfolio .section-title', start: 'top 70%' } });
    }
    const wrapper = document.querySelector('.portfolio-scroll-wrapper');
    const track = document.querySelector('.portfolio-scroll-track');
    if (wrapper && track) {
      const totalWidth = track.scrollWidth - wrapper.offsetWidth;
      gsap.to(track, {
        x: -totalWidth, ease: 'none',
        scrollTrigger: { trigger: wrapper, start: 'top 20%', end: () => '+=' + totalWidth, scrub: 1, pin: true, anticipatePin: 1 }
      });
      track.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
          const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
          gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    }
  }

  // ============================================
  // Services
  // ============================================
  function initServices() {
    const servEyebrow = document.querySelector('#services .eyebrow');
    if (servEyebrow) {
      gsap.from(servEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#services', start: 'top 75%' } });
    }
    const servTitle = document.querySelector('#services .section-title');
    if (servTitle) {
      gsap.from(servTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#services .section-title', start: 'top 70%' } });
    }
    gsap.utils.toArray('.service-item').forEach((item, i) => {
      gsap.to(item, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
    });
  }

  // ============================================
  // Process
  // ============================================
  function initProcess() {
    const procEyebrow = document.querySelector('#process .eyebrow');
    if (procEyebrow) {
      gsap.from(procEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#process', start: 'top 75%' } });
    }
    const procTitle = document.querySelector('#process .section-title');
    if (procTitle) {
      gsap.from(procTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#process .section-title', start: 'top 70%' } });
    }
    const timelineLineFill = document.querySelector('.process-timeline-line-fill');
    if (timelineLineFill) {
      gsap.to(timelineLineFill, { height: '100%', scrollTrigger: { trigger: '.process-timeline', start: 'top 70%', end: 'bottom 50%', scrub: 1 } });
    }
    gsap.utils.toArray('.process-step').forEach((step) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 80%' } });
      tl.to(step, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
        .to(step.querySelector('.step-number'), { color: '#0071E3', duration: 0.4, ease: 'power2.out' }, '-=0.3');
    });
    initCircuitAnimation();
  }

  function initCircuitAnimation() {
    gsap.registerPlugin(MotionPathPlugin);
    const circuitPath = document.getElementById('circuitPath');
    const travelDot = document.getElementById('travelDot');
    const morphShape = document.getElementById('morphShape');
    if (!circuitPath || !travelDot || !morphShape) return;
    const pathLength = circuitPath.getTotalLength();
    gsap.set(circuitPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 0.8 });
    gsap.set(travelDot, { opacity: 0 });
    gsap.set(morphShape, { opacity: 0 });
    const circuitTl = gsap.timeline({ scrollTrigger: { trigger: '#process', start: 'top 60%', toggleActions: 'play none none none' } });
    circuitTl
      .to(circuitPath, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' })
      .to(travelDot, { opacity: 1, duration: 0.2 }, 0.5)
      .to(travelDot, { motionPath: { path: '#circuitPath', align: '#circuitPath', autoRotate: true, alignOrigin: [0.5, 0.5] }, duration: 3, ease: 'power1.inOut' }, 0.5)
      .to(morphShape, { opacity: 0.6, duration: 0.4 }, 0.8)
      .to(morphShape, { scale: 1.5, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.inOut' }, 1.2)
      .to(morphShape, { rotation: 90, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.inOut' }, 1.8)
      .to(morphShape, { scale: 0.8, rotation: 180, duration: 0.5, ease: 'power2.inOut' }, 2.3)
      .to(morphShape, { scale: 1, rotation: 360, opacity: 0.8, duration: 0.4, ease: 'power2.out' }, 2.8);
  }

  // ============================================
  // Testimonial Slider
  // ============================================
  function initTestimonialSlider() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) {
      // Fallback for static testimonial
      const testEyebrow = document.querySelector('#testimonial .eyebrow');
      if (testEyebrow) {
        gsap.from(testEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#testimonial', start: 'top 75%' } });
      }
      gsap.to('.testimonial-quote p', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.testimonial-quote', start: 'top 75%' } });
      gsap.to('.testimonial-quote footer', { opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: '.testimonial-quote', start: 'top 75%' } });
      return;
    }
    const quotes = slider.querySelectorAll('.testimonial-quote');
    const dots = slider.querySelectorAll('.testimonial-dot');
    let current = 0;
    function goTo(index) {
      quotes.forEach((q, i) => {
        q.classList.remove('active', 'prev');
        if (i === index) q.classList.add('active');
        else if (i === current) q.classList.add('prev');
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    }
    dots.forEach(dot => {
      dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index)); resetAutoplay(); });
    });
    let autoplayInterval;
    function autoplay() { autoplayInterval = setInterval(() => goTo((current + 1) % quotes.length), 5000); }
    function resetAutoplay() { clearInterval(autoplayInterval); autoplay(); }
    autoplay();
  }

  // ============================================
  // Contact
  // ============================================
  function initContact() {
    const contactEyebrow = document.querySelector('#contact .eyebrow');
    if (contactEyebrow) {
      gsap.from(contactEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#contact', start: 'top 75%' } });
    }
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) {
      gsap.from(contactTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#contact .section-title', start: 'top 70%' } });
    }
    gsap.to('.contact-form', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.contact-form', start: 'top 85%' } });
    gsap.to('.contact-links', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '.contact-links', start: 'top 90%' } });
    initForm();
  }

  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const btn = form.querySelector('.btn-submit');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function showError(input, message) {
      const group = input.closest('.form-group');
      let error = group.querySelector('.form-error');
      if (!error) { error = document.createElement('div'); error.className = 'form-error'; group.appendChild(error); }
      error.textContent = message; error.classList.add('visible'); input.style.borderColor = 'var(--error)';
    }
    function clearError(input) {
      const group = input.closest('.form-group');
      const error = group.querySelector('.form-error');
      if (error) error.classList.remove('visible');
      input.style.borderColor = '';
    }
    nameInput.addEventListener('blur', () => { if (nameInput.value.trim().length < 2) showError(nameInput, 'Минимум 2 символа'); else clearError(nameInput); });
    emailInput.addEventListener('blur', () => { if (!validateEmail(emailInput.value)) showError(emailInput, 'Введите корректный email'); else clearError(emailInput); });
    messageInput.addEventListener('blur', () => { if (messageInput.value.trim().length < 10) showError(messageInput, 'Минимум 10 символов'); else clearError(messageInput); });
    [nameInput, emailInput, messageInput].forEach(input => { input.addEventListener('focus', () => clearError(input)); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      if (nameInput.value.trim().length < 2) { showError(nameInput, 'Минимум 2 символа'); valid = false; }
      if (!validateEmail(emailInput.value)) { showError(emailInput, 'Введите корректный email'); valid = false; }
      if (messageInput.value.trim().length < 10) { showError(messageInput, 'Минимум 10 символов'); valid = false; }
      if (!valid) { gsap.fromTo(btn, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }); return; }
      btn.classList.add('sending');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Отправка...</span>';
      setTimeout(() => {
        btn.classList.remove('sending'); btn.classList.add('sent');
        btn.innerHTML = '<span>Отправлено!</span>';
        gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
        createSuccessParticles(btn);
        setTimeout(() => { btn.classList.remove('sent'); btn.innerHTML = originalHTML; form.reset(); }, 3000);
      }, 1200);
    });
  }

  function createSuccessParticles(btn) {
    const rect = btn.getBoundingClientRect();
    const colors = ['#0071E3', '#30D158', '#5AC8FA', '#FF9F0A'];
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `position:fixed;width:6px;height:6px;border-radius:50%;background:${colors[i % 4]};pointer-events:none;z-index:10001;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;`;
      document.body.appendChild(particle);
      const angle = (i / 12) * Math.PI * 2;
      const distance = 80 + Math.random() * 60;
      gsap.to(particle, { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 40, opacity: 0, scale: 0, duration: 0.8 + Math.random() * 0.4, ease: 'power2.out', onComplete: () => particle.remove() });
    }
  }

  // ============================================
  // Footer
  // ============================================
  function initFooter() {
    gsap.from('.footer-content', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.footer', start: 'top 95%' } });
  }

  // ============================================
  // Magnetic Buttons
  // ============================================
  function initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .btn-submit').forEach(el => {
      const wrap = document.createElement('div');
      wrap.className = 'magnetic-wrap';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      wrap.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // ============================================
  // Text Scramble
  // ============================================
  function initTextScramble() {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function scrambleElement(el) {
      const originalText = el.textContent;
      const duration = 800;
      const startTime = Date.now();
      function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let result = '';
        for (let i = 0; i < originalText.length; i++) {
          result += progress * originalText.length > i ? originalText[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = result;
        if (progress < 1) requestAnimationFrame(update);
      }
      update();
    }
    document.querySelectorAll('.eyebrow').forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => scrambleElement(el) });
    });
  }

  // ============================================
  // Glow Cards
  // ============================================
  function initGlowCards() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.glow-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ============================================
  // Hamburger Menu
  // ============================================
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // Theme Toggle
  // ============================================
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });
  }

  // ============================================
  // Blur Reveal
  // ============================================
  function initBlurReveal() {
    document.querySelectorAll('[data-blur-reveal]').forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => el.classList.add('revealed') });
    });
  }

  // ============================================
  // Section Morphing
  // ============================================
  function initSectionMorphing() {
    document.querySelectorAll('.section').forEach((section, i) => {
      if (i === 0) return;
      gsap.fromTo(section, { clipPath: 'inset(6% 0 6% 0)' }, {
        clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power2.inOut',
        scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 40%', scrub: 1 }
      });
    });
  }

  // ============================================
  // Canvas Particles (lightweight, no Three.js)
  // ============================================
  function initCanvasParticles() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let animId;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 113, 227, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 113, 227, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    // Stop when out of view
    ScrollTrigger.create({
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => cancelAnimationFrame(animId),
      onEnterBack: () => animate()
    });
  }

  // ============================================
  // Typing Effect
  // ============================================
  function initTypingEffect() {
    const subtitle = document.getElementById('heroSubtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    subtitle.style.transform = 'none';

    let i = 0;
    const cursor = document.createElement('span');
    cursor.style.cssText = 'display:inline-block;width:2px;height:1em;background:var(--accent);margin-left:2px;animation:blink 1s step-end infinite;vertical-align:text-bottom;';
    subtitle.appendChild(cursor);

    // Add blink keyframes
    const style = document.createElement('style');
    style.textContent = '@keyframes blink{50%{opacity:0}}';
    document.head.appendChild(style);

    function type() {
      if (i < text.length) {
        subtitle.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 50 + Math.random() * 50);
      } else {
        // Remove cursor after typing
        setTimeout(() => { cursor.style.opacity = '0'; cursor.style.transition = 'opacity 0.5s'; }, 2000);
      }
    }

    // Start after hero title animation
    setTimeout(type, 1500);
  }

  // ============================================
  // Scroll Color Shift
  // ============================================
  function initScrollColorShift() {
    const sections = document.querySelectorAll('.section');
    const colors = [
      { bg: '#000000', text: '#FFFFFF' },
      { bg: '#0A0A0A', text: '#FFFFFF' },
      { bg: '#000000', text: '#FFFFFF' },
      { bg: '#0A0A0A', text: '#FFFFFF' },
      { bg: '#000000', text: '#FFFFFF' },
      { bg: '#0A0A0A', text: '#FFFFFF' },
      { bg: '#000000', text: '#FFFFFF' }
    ];

    sections.forEach((section, i) => {
      if (!colors[i]) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to('body', { backgroundColor: colors[i].bg, duration: 0.8, ease: 'power2.inOut' });
        },
        onEnterBack: () => {
          gsap.to('body', { backgroundColor: colors[i].bg, duration: 0.8, ease: 'power2.inOut' });
        }
      });
    });
  }

  // ============================================
  // Parallax Layers
  // ============================================
  function initParallaxLayers() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Add floating shapes
    for (let i = 0; i < 5; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 200 + 50;
      shape.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border: 1px solid rgba(0, 113, 227, ${Math.random() * 0.1 + 0.02});
        border-radius: ${Math.random() > 0.5 ? '50%' : '12px'};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        pointer-events: none;
        z-index: 0;
      `;
      hero.appendChild(shape);

      gsap.to(shape, {
        y: -100 - Math.random() * 200,
        rotation: Math.random() * 360,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1 + Math.random()
        }
      });
    }
  }

  // ============================================
  // Animated Stats (visual bars)
  // ============================================
  function initAnimatedStats() {
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      if (isNaN(target)) return;

      // Add visual bar
      const bar = document.createElement('div');
      bar.style.cssText = `
        width: 100%;
        height: 4px;
        background: var(--n-300);
        border-radius: 2px;
        margin-top: 12px;
        overflow: hidden;
      `;
      const fill = document.createElement('div');
      fill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, var(--accent), #5AC8FA);
        border-radius: 2px;
        transition: width 2s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      bar.appendChild(fill);
      stat.appendChild(bar);

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const percent = Math.min(target / 150 * 100, 100);
          fill.style.width = percent + '%';
        }
      });
    });
  }

  // ============================================
  // Scroll Snap
  // ============================================
  function initScrollSnap() {
    // Only on desktop, and only for main sections
    if (window.innerWidth < 768) return;

    // Light scroll snap via CSS
    document.documentElement.style.scrollSnapType = 'y proximity';

    document.querySelectorAll('.section').forEach(section => {
      section.style.scrollSnapAlign = 'start';
    });
  }

  // ============================================
  // Animated Favicon
  // ============================================
  function initAnimatedFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    function drawFavicon() {
      ctx.clearRect(0, 0, 32, 32);

      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);

      // Animated "I"
      const offset = Math.sin(frame * 0.05) * 2;
      ctx.fillStyle = '#0071E3';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('I', 16, 16 + offset);

      // Update favicon
      const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
      link.rel = 'icon';
      link.href = canvas.toDataURL();
      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link);
      }

      frame++;
      requestAnimationFrame(drawFavicon);
    }
    drawFavicon();
  }

  // ============================================
  // Team Section
  // ============================================
  function initTeam() {
    const teamEyebrow = document.querySelector('#team .eyebrow');
    if (teamEyebrow) {
      gsap.from(teamEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#team', start: 'top 75%' } });
    }
    const teamTitle = document.querySelector('#team .section-title');
    if (teamTitle) {
      gsap.from(teamTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#team .section-title', start: 'top 70%' } });
    }
    gsap.utils.toArray('.team-card').forEach((card, i) => {
      gsap.from(card, { opacity: 0, y: 60, duration: 0.8, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
    });
  }

  // ============================================
  // Pricing Section
  // ============================================
  function initPricing() {
    const pricingEyebrow = document.querySelector('#pricing .eyebrow');
    if (pricingEyebrow) {
      gsap.from(pricingEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#pricing', start: 'top 75%' } });
    }
    const pricingTitle = document.querySelector('#pricing .section-title');
    if (pricingTitle) {
      gsap.from(pricingTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#pricing .section-title', start: 'top 70%' } });
    }
    gsap.utils.toArray('.pricing-card').forEach((card, i) => {
      gsap.from(card, { opacity: 0, y: 60, duration: 0.8, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
    });
  }

  // ============================================
  // FAQ Section
  // ============================================
  function initFAQ() {
    const faqEyebrow = document.querySelector('#faq .eyebrow');
    if (faqEyebrow) {
      gsap.from(faqEyebrow.querySelectorAll('.char'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '#faq', start: 'top 75%' } });
    }
    const faqTitle = document.querySelector('#faq .section-title');
    if (faqTitle) {
      gsap.from(faqTitle.querySelectorAll('.char'), { opacity: 0, y: 60, rotationX: -90, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: { trigger: '#faq .section-title', start: 'top 70%' } });
    }

    // Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Open clicked (if wasn't active)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });

    // Stagger reveal
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
      gsap.from(item, { opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
    });
  }

  // ============================================
  // Clients Marquee
  // ============================================
  function initClientsMarquee() {
    const marquee = document.querySelector('.clients-marquee');
    const track = document.querySelector('.clients-marquee-track');
    if (!marquee || !track) return;

    gsap.from(track.children, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: marquee, start: 'top 80%' }
    });
  }

  // Performance
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
});
