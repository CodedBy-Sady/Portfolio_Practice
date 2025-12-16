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

// Performance: Lazy load images
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// No scroll animations needed - website loads instantly

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
        `;
        successMsg.textContent = '✅ Thank you for your review!';
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    });
}

// Initial render
renderReviews();

// DOM content fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully - no animations');
});
