// Read accent colors from CSS variables
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const ACCENT = cssVar('--accent-color') || '#7c3aed';
const ACCENT_LIGHT = cssVar('--accent-light') || '#06b6d4';

// Mobile Menu Toggle with Animation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const body = document.body;

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        
        if (!isActive) {
            // Opening menu
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            body.classList.add('menu-open');
        } else {
            // Closing menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Smooth scroll and active nav link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Contact Form Handler (simple client-side behavior)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        if (name && email && message) {
            // Show success toast using the theme accent
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT});
                color: #fff;
                padding: 12px 18px;
                border-radius: 10px;
                z-index: 2000;
                box-shadow: 0 10px 30px rgba(15,23,36,0.12);
                font-weight:700;
            `;
            successMsg.textContent = '✓ Message received — thank you!';
            document.body.appendChild(successMsg);

            contactForm.reset();

            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => successMsg.remove(), 400);
            }, 3200);
        }
    });
}

// Inject small dynamic styles that rely on CSS variables
const style = document.createElement('style');
style.textContent = `
    .nav-link.active { color: var(--text-primary); }
    .nav-link.active::after { width: 100%; }
`;
document.head.appendChild(style);

// Hide scroll indicator after scrolling
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = window.scrollY > 120 ? '0' : '1';
    }
});

// Intersection Observer for subtle fade-ins
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.project-card, .setup-card, .skill-category, .stat').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Navbar responsive hide on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    if (!navbar) return;
    if (scrollTop > lastScrollTop && scrollTop > 120) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

console.log('Updated portfolio script loaded');
