// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Initialize form handler
    initializeForm();
    
    // Initialize demo video handler
    initializeDemoVideo();
});

// Scroll to section function
function scrollToSection(sectionId) {
    if (sectionId === 'demo') {
        window.location.href = 'https://glasses-vto-rust.vercel.app/';
    } else {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Form handling
function initializeForm() {
    const form = document.getElementById('demoForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'company'];
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(field);
            }
        });
        
        // Check privacy policy acceptance
        if (!document.getElementById('privacyAccepted').checked) {
            errors.push('privacyAccepted');
        }
        
        if (errors.length > 0) {
            showToast('Please fill in all required fields and accept the privacy policy.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        try {
            // Submit form data
            const response = await fetch('/api/demo-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone || null,
                    company: data.company,
                    industry: data.industry || null,
                    message: data.message || null
                })
            });
            
            if (response.ok) {
                showToast('Demo request submitted successfully! We\'ll contact you within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Failed to submit demo request. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Demo video handler
function initializeDemoVideo() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (!videoPlaceholder) return;
    
    videoPlaceholder.addEventListener('click', function() {
        // In a real implementation, this would open a video modal or play a video
        showToast('Demo video would play here. Contact us for a live demo!', 'info');
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastClose = toast.querySelector('.toast-close');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set color based on type
    const toastContent = toast.querySelector('.toast-content');
    switch (type) {
        case 'success':
            toastContent.style.borderLeft = '4px solid #10b981';
            break;
        case 'error':
            toastContent.style.borderLeft = '4px solid #ef4444';
            break;
        case 'info':
        default:
            toastContent.style.borderLeft = '4px solid #3b82f6';
            break;
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideToast();
    }, 5000);
    
    // Close button handler
    toastClose.onclick = hideToast;
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll('.feature-card, .testimonial-card, .feature-item');
    
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for hero stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const targetValue = parseInt(target.replace('%', ''));
        
        let current = 0;
        const increment = targetValue / 50; // 50 steps for smooth animation
        
        const updateCounter = () => {
            if (current < targetValue) {
                current += increment;
                counter.textContent = Math.floor(current) + (isPercentage ? '%' : 's');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when hero section is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('demoForm');
    if (!form) return;
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ef4444';
            showFieldError(this, 'Please enter a valid email address');
        } else {
            this.style.borderColor = '#d1d5db';
            hideFieldError(this);
        }
    });
    
    // Real-time phone validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#ef4444';
            showFieldError(this, 'Please enter a valid phone number');
        } else {
            this.style.borderColor = '#d1d5db';
            hideFieldError(this);
        }
    });
    
    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'email', 'company'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
                showFieldError(this, 'This field is required');
            } else {
                this.style.borderColor = '#d1d5db';
                hideFieldError(this);
            }
        });
    });
});

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        // Close toast with Escape
        const toast = document.getElementById('toast');
        if (toast.classList.contains('show')) {
            hideToast();
        }
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// Performance optimization: Lazy load images (if any images are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading on DOM ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add loading states for better UX
function showLoading(element) {
    element.style.position = 'relative';
    element.style.pointerEvents = 'none';
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = '<div class="spinner"></div>';
    loader.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const spinner = loader.querySelector('.spinner');
    spinner.style.cssText = `
        border: 3px solid #f3f4f6;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    `;
    
    element.appendChild(loader);
}

function hideLoading(element) {
    const loader = element.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
    element.style.pointerEvents = 'auto';
}

// Add spinner animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);