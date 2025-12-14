// Read accent colors from CSS variables
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const ACCENT = cssVar('--accent-color') || '#7c3aed';
const ACCENT_LIGHT = cssVar('--accent-light') || '#06b6d4';

// Dark Mode Toggle (Fully Functional)
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    htmlElement.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Toggle dark mode
        htmlElement.classList.toggle('dark-mode');
        
        // Save preference
        const isDarkMode = htmlElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update icon
        themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
        
        // Animation
        themeIcon.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeIcon.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    });
}

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

// Navbar always visible (no hide on scroll)
const navbar = document.querySelector('.navbar');
if (navbar) {
    navbar.style.transform = 'translateY(0)';
}

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// ======================================
// REVIEWS & ADVICE FUNCTIONALITY
// ======================================

// Load reviews from localStorage
function loadReviews() {
    const reviewsData = localStorage.getItem('reviews');
    return reviewsData ? JSON.parse(reviewsData) : [];
}

// Save reviews to localStorage
function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Render reviews
function renderReviews() {
    const reviews = loadReviews();
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    const noReviews = document.getElementById('noReviews');

    if (reviews.length === 0) {
        reviewsDisplay.innerHTML = '<div class="no-reviews"><p>📝 Be the first to share your review or advice!</p></div>';
        return;
    }

    reviewsDisplay.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-name">${escapeHtml(review.name)}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}</span>
            </div>
            <p class="review-text">${escapeHtml(review.text)}</p>
            <p class="review-date">${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle review form submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    // Character counter
    const reviewText = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    
    reviewText.addEventListener('input', () => {
        charCount.textContent = reviewText.value.length;
    });

    // Star rating
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < rating);
            });
        });
        
        star.addEventListener('mouseover', () => {
            const rating = star.dataset.rating;
            stars.forEach((s, index) => {
                s.style.color = index < rating ? '#fbbf24' : 'var(--border-color)';
            });
        });
    });

    document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
        stars.forEach((s, index) => {
            s.style.color = index < (ratingInput.value || 0) ? '#fbbf24' : 'var(--border-color)';
        });
    });

    // Form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const email = document.getElementById('reviewEmail').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);

        if (!rating) {
            alert('Please select a rating');
            return;
        }

        const review = {
            name,
            email,
            text,
            rating,
            date: new Date().toISOString()
        };

        const reviews = loadReviews();
        reviews.unshift(review);
        saveReviews(reviews);

        // Reset form
        reviewForm.reset();
        ratingInput.value = 0;
        charCount.textContent = '0';
        stars.forEach(s => s.classList.remove('active'));

        // Re-render reviews
        renderReviews();

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInReview 0.3s ease-out;
        `;
        successMsg.textContent = '✅ Thank you for your review!';
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideOutReview 0.3s ease-in forwards';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
    });
}

// Initial render
renderReviews();

// Add slideout animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutReview {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ========== ENHANCED SCROLL ANIMATIONS ==========
// Add animation classes to elements on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate section titles
    document.querySelectorAll('.section-title').forEach((el, i) => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Animate project cards
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Animate skill cards
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${i * 0.15}s`;
        observer.observe(el);
    });

    // Animate CGPA cards with staggered animation
    document.querySelectorAll('.cgpa-card').forEach((el, i) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Animate setup cards
    document.querySelectorAll('.setup-card').forEach((el, i) => {
        el.classList.add('fade-in-up');
        el.style.animationDelay = `${i * 0.08}s`;
        observer.observe(el);
    });

    // Animate review items
    document.querySelectorAll('.review-item').forEach((el, i) => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Add index to stats and skill tags for animation stagger
    document.querySelectorAll('.stat').forEach((el, i) => {
        el.style.setProperty('--index', i);
    });

    document.querySelectorAll('.skill-tag').forEach((el, i) => {
        el.style.setProperty('--index', i);
    });
});

console.log('Updated portfolio script with scroll animations loaded');
