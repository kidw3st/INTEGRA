/* ============================================
   INTEGRA — Main JavaScript
   GSAP + ScrollTrigger animations
   ============================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // Custom Cursor
  // ============================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Only init cursor on desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    // Smooth follower
    function updateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .service-item, input, textarea');
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

    // Custom cursor text for portfolio cards
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.textContent = el.dataset.cursor;
        cursor.style.display = 'flex';
        cursor.style.alignItems = 'center';
        cursor.style.justifyContent = 'center';
        cursor.style.fontSize = '11px';
        cursor.style.fontWeight = '600';
        cursor.style.letterSpacing = '0.05em';
        cursor.style.color = '#000';
      });
      el.addEventListener('mouseleave', () => {
        cursor.textContent = '';
        cursor.style.fontSize = '';
      });
    });
  }

  // ============================================
  // Nav visibility
  // ============================================
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    onEnter: () => nav.classList.add('visible'),
    onLeaveBack: () => nav.classList.remove('visible')
  });

  // ============================================
  // Hero Animations
  // ============================================
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('.hero-bg-layer', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
    .to('.hero-grid-layer', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=1.2')
    .to('#heroTitle', {
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.8')
    .to('#heroSubtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    .to('#heroScroll', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

  // Hero parallax on scroll
  gsap.to('#heroBg', {
    y: -100,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('#heroGrid', {
    y: -60,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('#heroContent', {
    y: -80,
    opacity: 0,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '60% top',
      scrub: 1
    }
  });

  gsap.to('#heroScroll', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#hero',
      start: '20% top',
      end: '40% top',
      scrub: 1
    }
  });

  // ============================================
  // Morphing transitions between sections
  // ============================================
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, i) => {
    if (i === 0) return; // Skip hero

    // Clip-path reveal animation
    gsap.fromTo(section, 
      { clipPath: 'inset(8% 0 8% 0)' },
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
  // About Section
  // ============================================

  // Eyebrow + title reveal
  gsap.from('#about .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%'
    }
  });

  gsap.from('#about .section-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 65%'
    }
  });

  // Counter animation for stats
  const stats = document.querySelectorAll('.stat');
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const numberEl = stat.querySelector('.stat-number');

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            numberEl.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  // Stagger stats reveal
  gsap.from('.stat', {
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 80%'
    }
  });

  // Description reveal
  gsap.to('.about-description', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-description',
      start: 'top 85%'
    }
  });

  // ============================================
  // Portfolio Section
  // ============================================

  gsap.from('#portfolio .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#portfolio',
      start: 'top 70%'
    }
  });

  gsap.from('#portfolio .section-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#portfolio',
      start: 'top 65%'
    }
  });

  // Staggered reveal for portfolio cards
  const portfolioCards = gsap.utils.toArray('.portfolio-card');
  portfolioCards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%'
      }
    });
  });

  // ============================================
  // Services Section
  // ============================================

  gsap.from('#services .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 70%'
    }
  });

  gsap.from('#services .section-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 65%'
    }
  });

  // Staggered service items
  const serviceItems = gsap.utils.toArray('.service-item');
  serviceItems.forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      }
    });
  });

  // ============================================
  // Process Section
  // ============================================

  gsap.from('#process .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#process',
      start: 'top 70%'
    }
  });

  gsap.from('#process .section-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#process',
      start: 'top 65%'
    }
  });

  // Staggered process steps with number color change
  const processSteps = gsap.utils.toArray('.process-step');
  processSteps.forEach((step, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'top 80%'
      }
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

  // Timeline line animation
  gsap.from('.process-timeline::before', {
    scaleY: 0,
    transformOrigin: 'top',
    scrollTrigger: {
      trigger: '.process-timeline',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    }
  });

  // ============================================
  // Testimonial Section
  // ============================================

  gsap.from('#testimonial .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#testimonial',
      start: 'top 70%'
    }
  });

  gsap.to('.testimonial-quote p', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonial-quote',
      start: 'top 75%'
    }
  });

  gsap.to('.testimonial-quote footer', {
    opacity: 1,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.testimonial-quote',
      start: 'top 75%'
    }
  });

  // ============================================
  // Contact Section
  // ============================================

  gsap.from('#contact .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%'
    }
  });

  gsap.from('#contact .section-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 65%'
    }
  });

  gsap.to('.contact-form', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 85%'
    }
  });

  gsap.to('.contact-links', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-links',
      start: 'top 90%'
    }
  });

  // ============================================
  // Form submission
  // ============================================
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.querySelector('span').textContent;
    
    btn.querySelector('span').textContent = 'Отправлено!';
    btn.style.background = '#30D158';
    
    gsap.fromTo(btn, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );

    setTimeout(() => {
      btn.querySelector('span').textContent = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: 1,
          ease: 'power2.inOut'
        });
      }
    });
  });

  // ============================================
  // Performance: Refresh ScrollTrigger on resize
  // ============================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});
