// ===== SCROLL REVEAL =====

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 80) {
            element.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

// Run once when page loads
revealOnScroll();


// ===== PARTICLES BACKGROUND =====

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];

function createParticles() {
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            d: Math.random() * canvas.width,
            tilt: Math.random() * 10,
            tiltAngle: 0,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

createParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.y += (Math.cos(particle.tiltAngle) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(particle.tiltAngle);

        if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = 'rgba(99, 102, 241, 1)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}

animateParticles();


// ===== SKILLS STAR BACKGROUND =====

const skillsCanvas = document.getElementById("skillsCanvas");

if (skillsCanvas) {
    const skillsCtx = skillsCanvas.getContext("2d");

    function resizeSkillsCanvas() {
        skillsCanvas.width = skillsCanvas.offsetWidth;
        skillsCanvas.height = skillsCanvas.offsetHeight;
    }

    resizeSkillsCanvas();
    window.addEventListener("resize", resizeSkillsCanvas);

    const stars = [];

    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * skillsCanvas.width,
            y: Math.random() * skillsCanvas.height,
            r: Math.random() * 2,
            opacity: Math.random(),
            speed: Math.random() * 0.02
        });
    }

    function animateStars() {
        skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

        stars.forEach(star => {
            star.opacity += star.speed;

            if (star.opacity >= 1 || star.opacity <= 0) {
                star.speed *= -1;
            }

            skillsCtx.beginPath();
            skillsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            skillsCtx.fillStyle = `rgba(255,255,255,${star.opacity})`;
            skillsCtx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    animateStars();
}


// ===== NAVBAR SCROLL EFFECT =====

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});


// ===== PROJECT FILTER =====

const projFilters = document.querySelectorAll('.proj-filter');
const projCards = document.querySelectorAll('.proj-card');

projFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        projFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterValue = filter.getAttribute('data-filter');

        projCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});


// ===== CONTACT FORM =====

function copyEmail(element) {
    const email = 'pratikgelal2063@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const copiedMsg = element.querySelector('.copied-msg');
        if (copiedMsg) {
            copiedMsg.classList.add('show');
            setTimeout(() => copiedMsg.classList.remove('show'), 2000);
        }
    });
}

function sendMessage() {
    const name = document.getElementById('c-name').value;
    const email = document.getElementById('c-email').value;
    const message = document.getElementById('c-msg').value;
    const formNote = document.getElementById('form-note');

    if (!name || !email || !message) {
        formNote.textContent = 'Please fill all fields';
        formNote.style.color = '#ef4444';
        return;
    }

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:pratikgelal2063@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    formNote.textContent = 'Message sent! Opening email client...';
    formNote.style.color = '#22c55e';

    setTimeout(() => {
        document.getElementById('c-name').value = '';
        document.getElementById('c-email').value = '';
        document.getElementById('c-msg').value = '';
        formNote.textContent = '';
    }, 2000);
}


// ===== FOOTER YEAR =====

document.getElementById('year').textContent = new Date().getFullYear();
