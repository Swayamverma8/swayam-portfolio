/* ================================================
   PORTFOLIO JAVASCRIPT
   Handles: navbar, typed effect, scroll reveal,
   counter animation, progress bars, filters, form
   ================================================ */

// ── Wait for DOM ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide icons
  lucide.createIcons();


  /* ================================================
     NAVBAR: scroll class + active link
     ================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });

    // Back-to-top button
    const backTop = document.getElementById('backTop');
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('navLinks');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Back to top
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ================================================
     TYPED TEXT EFFECT (Hero Section)
     ✏️ REPLACE: Change the words array with your roles
     ================================================ */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    // ✏️ REPLACE: Your actual roles/skills
    const words   = ['Web Applications.', 'REST APIs.', 'React Interfaces.', 'Full-Stack Projects.'];
    let   wIndex  = 0;
    let   cIndex  = 0;
    let   deleting = false;

    const type = () => {
      const currentWord = words[wIndex];
      if (deleting) {
        typedEl.textContent = currentWord.slice(0, cIndex--);
        if (cIndex < 0) { deleting = false; wIndex = (wIndex + 1) % words.length; }
        setTimeout(type, 60);
      } else {
        typedEl.textContent = currentWord.slice(0, cIndex++);
        if (cIndex > currentWord.length) { deleting = true; setTimeout(type, 1500); return; }
        setTimeout(type, 100);
      }
    };
    setTimeout(type, 600);
  }


  /* ================================================
     SCROLL REVEAL (Intersection Observer)
     ================================================ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ================================================
     COUNTER ANIMATION (About Stats)
     ================================================ */
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const countUp = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  /* ================================================
     SKILL PROGRESS BARS
     ================================================ */
  const bars = document.querySelectorAll('.prof-bar-fill[data-width]');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));


  /* ================================================
     PROJECT FILTER
     ================================================ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          // Trigger re-reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ================================================
     CONTACT FORM
     NOTE: This is a demo handler. To actually send
     emails, integrate with Formspree, EmailJS, or
     your own backend endpoint.
     ✏️ REPLACE: Connect to your preferred email service
     ================================================ */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...';

      /*
        ✏️ TO ACTUALLY SEND EMAILS, replace this setTimeout block with:

        Option 1 — Formspree (recommended for beginners):
        1. Go to https://formspree.io and create a free account
        2. Create a new form and copy the endpoint URL
        3. Replace YOUR_FORM_ID below:

        const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        if (res.ok) { ... show success ... }

        Option 2 — EmailJS:
        https://www.emailjs.com/docs/sdk/installation/
      */

      // Simulated success (demo only — replace with real API call above)
      await new Promise(resolve => setTimeout(resolve, 1500));

      showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className   = 'form-status ' + type;
    setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 6000);
  }


  /* ================================================
     SMOOTH SCROLL for anchor links
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 70;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
