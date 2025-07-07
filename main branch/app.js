// Frank Value Creation Website JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initHeaderScroll();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Update active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// Header scroll effects
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', throttle(handleHeaderScroll, 10));
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = [
        { selector: '.hero__content', animation: 'fade-in' },
        { selector: '.about__text', animation: 'slide-in-left' },
        { selector: '.about__image', animation: 'slide-in-right' },
        { selector: '.service-card', animation: 'fade-in' },
        { selector: '.level-card', animation: 'slide-in-left' },
        { selector: '.case-study__content', animation: 'fade-in' },
        { selector: '.reference-card', animation: 'fade-in' },
        { selector: '.contact__content', animation: 'fade-in' }
    ];

    animatedElements.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add(animation);
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });

        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Handle form submission
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formFields = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        message: formData.get('message')
    };

    // Validate all fields
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showFormMessage('Thank you for your message! Dr. Frank will contact you soon.', 'success');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }
    // Email validation
    else if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    // Name validation
    else if (fieldName === 'name' && value && value.length < 2) {
        errorMessage = 'Name must be at least 2 characters long.';
        isValid = false;
    }
    // Message validation
    else if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long.';
        isValid = false;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Show form message
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Style the message
    messageElement.style.padding = 'var(--space-12) var(--space-16)';
    messageElement.style.borderRadius = 'var(--radius-base)';
    messageElement.style.marginBottom = 'var(--space-16)';
    messageElement.style.fontWeight = 'var(--font-weight-medium)';
    
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
        messageElement.style.color = 'var(--color-success)';
        messageElement.style.border = '1px solid rgba(var(--color-success-rgb), 0.2)';
    } else if (type === 'error') {
        messageElement.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
        messageElement.style.color = 'var(--color-error)';
        messageElement.style.border = '1px solid rgba(var(--color-error-rgb), 0.2)';
    }

    // Insert message at the top of the form
    const contactForm = document.getElementById('contact-form');
    contactForm.insertBefore(messageElement, contactForm.firstChild);

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Utility function: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Utility function: Debounce
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add loading animation for page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger hero animation immediately
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 100);
    }
});

// Add CSS for form error states
const style = document.createElement('style');
style.textContent = `
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
    
    .form-control:focus.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.2);
    }
    
    .nav__toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav__toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav__toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav__link.active {
        color: var(--color-primary);
    }
    
    .nav__link.active::after {
        width: 100%;
    }
    
    body.loaded * {
        transition-delay: 0s !important;
    }
`;

document.head.appendChild(style);

// Performance optimization: Lazy load images when they come into view
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Add scroll-to-top functionality
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-professional);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
initScrollToTop();