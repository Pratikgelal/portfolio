// =====================================================
// Pratik Gelal — Portfolio JS
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- hero photo slow parallax on scroll ---------- */
  (() => {
    const heroSection = document.getElementById('home');
    const imageWrap = document.querySelector('.hero-image-wrap');
    if (!heroSection || !imageWrap) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let currentX = 0;
    let targetX = 0;

    function computeTarget() {
      const heroHeight = heroSection.offsetHeight || 1;
      const rect = heroSection.getBoundingClientRect();
      // progress: 0 at top of hero in view, 1 once scrolled a full hero-height down
      let progress = -rect.top / heroHeight;
      progress = Math.min(Math.max(progress, 0), 1);
      const maxShift = imageWrap.offsetWidth / 3; // shift right by ~1/3 of the image width
      targetX = progress * maxShift;
    }

    function tick() {
      computeTarget();
      // slow, smooth easing toward the target (lerp)
      currentX += (targetX - currentX) * 0.045;
      if (Math.abs(targetX - currentX) < 0.05) currentX = targetX;
      imageWrap.style.transform = `translateX(${currentX}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  (() => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const heroSection = document.getElementById('home');
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w, h, dpr;
    let stars = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = heroSection.clientWidth;
      h = heroSection.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function buildStars() {
      const count = Math.floor((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        tw: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.tw += 0.012 * s.speed;
        const alpha = 0.2 + Math.abs(Math.sin(s.tw)) * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) requestAnimationFrame(draw);
    else draw();
  })();


  /* ---------- header scroll state ---------- */
  const header = document.getElementById('header');
  const backTop = document.getElementById('backTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    backTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  /* ---------- active section highlight ---------- */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---------- skill bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const val = bar.getAttribute('data-value') || 0;
        const fill = bar.querySelector('.skill-fill');
        requestAnimationFrame(() => { fill.style.width = val + '%'; });
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(b => skillObs.observe(b));

  /* ---------- project filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-bar button');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cats = card.getAttribute('data-cat') || '';
        const match = filter === 'all' || cats.split(' ').includes(filter);
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- project modal ---------- */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalLinks = document.getElementById('modalLinks');

  function openModal(card) {
    const img = card.querySelector('.project-thumb img');
    const cat = card.querySelector('.project-cat').textContent;
    const title = card.querySelector('h4').textContent;
    const desc = card.querySelector('.project-body p').textContent;
    const tech = (card.querySelector('.tech')?.textContent || '').split('·').map(t => t.trim()).filter(Boolean);
    const links = card.querySelectorAll('.project-links a');

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCat.textContent = cat;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalTech.innerHTML = tech.map(t => `<span>${t}</span>`).join('');
    modalLinks.innerHTML = '';
    links.forEach(a => {
      const clone = a.cloneNode(true);
      modalLinks.appendChild(clone);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let direct links work normally
      openModal(card);
    });
  });
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- CV viewer modal ---------- */
  const cvBackdrop = document.getElementById('cvModalBackdrop');
  const cvClose = document.getElementById('cvModalClose');
  const cvTriggers = document.querySelectorAll('.cv-trigger');

  function openCvModal(e) {
    e.preventDefault();
    cvBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCvModal() {
    cvBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  cvTriggers.forEach(btn => btn.addEventListener('click', openCvModal));
  cvClose.addEventListener('click', closeCvModal);
  cvBackdrop.addEventListener('click', (e) => { if (e.target === cvBackdrop) closeCvModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCvModal(); });

  /* ---------- contact form -> gmail compose ---------- */
  const RECIPIENT_EMAIL = 'pratikgelal2063@gmail.com';
  const form = document.getElementById('contactForm');
  const errEl = document.getElementById('cf-error');
  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errEl.textContent = '';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !subject || !message) {
      errEl.textContent = 'Please fill in all fields before sending.';
      return;
    }
    if (!isValidEmail(email)) {
      errEl.textContent = 'Please enter a valid email address.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening Gmail…';

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECIPIENT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const win = window.open(gmailUrl, '_blank', 'noopener');

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      if (!win || win.closed) {
        // Popup blocked — fall back to mailto
        window.location.href = mailtoUrl;
        statusEl.textContent = 'Opening your email app…';
        statusEl.classList.add('success');
      } else {
        statusEl.textContent = 'Gmail opened in a new tab — hit send there!';
        statusEl.classList.add('success');
        form.reset();
      }
    }, 500);
  });
});
