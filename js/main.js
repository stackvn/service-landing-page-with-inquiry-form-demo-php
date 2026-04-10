/**
 * TechFix Landing Page - Main JavaScript
 * Form validation, phone mask, animations, interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initHeader();
    initMobileMenu();
    initForm();
    initScrollAnimations();
    initSmoothScroll();
});

/* ========================================
   Header Scroll Effect
   ======================================== */
function initHeader() {
    const header = document.querySelector('.header');
    const demoNotice = document.querySelector('.demo-notice');
    
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolled past demo notice
        if (demoNotice) {
            const noticeHeight = demoNotice.offsetHeight;
            if (currentScroll > noticeHeight) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    
    if (!burger || !mobileMenu) return;
    
    function toggleMenu() {
        burger.classList.toggle('burger--active');
        mobileMenu.classList.toggle('mobile-menu--active');
        document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    }
    
    function closeMenu() {
        burger.classList.remove('burger--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
    }
    
    burger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking overlay
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
            closeMenu();
        }
    });
}

/* ========================================
   Form Validation & Submission
   ======================================== */
function initForm() {
    const form = document.getElementById('requestForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const commentInput = document.getElementById('comment');
    const submitBtn = form?.querySelector('.form__submit');
    
    if (!form) return;
    
    // Phone mask initialization
    initPhoneMask(phoneInput);
    
    // Real-time validation
    nameInput?.addEventListener('blur', () => validateName(nameInput));
    nameInput?.addEventListener('input', () => {
        if (nameInput.classList.contains('form__input--error')) {
            validateName(nameInput);
        }
    });
    
    phoneInput?.addEventListener('blur', () => validatePhone(phoneInput));
    phoneInput?.addEventListener('input', () => {
        if (phoneInput.classList.contains('form__input--error')) {
            validatePhone(phoneInput);
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName(nameInput);
        const isPhoneValid = validatePhone(phoneInput);
        
        if (!isNameValid || !isPhoneValid) {
            // Focus first invalid field
            if (!isNameValid) {
                nameInput.focus();
            } else if (!isPhoneValid) {
                phoneInput.focus();
            }
            return;
        }
        
        // Disable button and show loader
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn--loading');
        }
        
        // Simulate API request
        try {
            await simulateRequest(1500);
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            form.reset();
            clearValidation(nameInput);
            clearValidation(phoneInput);
            
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            // Re-enable button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn--loading');
            }
        }
    });
}

/* ========================================
   Phone Mask
   ======================================== */
function initPhoneMask(input) {
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Remove leading 7 or 8 if present
        if (value.length > 0 && (value[0] === '7' || value[0] === '8')) {
            value = value.substring(1);
        }
        
        // Limit to 10 digits
        value = value.substring(0, 10);
        
        // Apply mask
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = '+7 (';
            
            if (value.length <= 3) {
                formattedValue += value;
            } else {
                formattedValue += value.substring(0, 3) + ')';
                
                if (value.length <= 6) {
                    formattedValue += ' ' + value.substring(3);
                } else {
                    formattedValue += ' ' + value.substring(3, 6) + '-';
                    
                    if (value.length <= 8) {
                        formattedValue += value.substring(6);
                    } else {
                        formattedValue += value.substring(6, 8) + '-';
                        formattedValue += value.substring(8, 10);
                    }
                }
            }
        }
        
        e.target.value = formattedValue;
    });
    
    // Handle backspace properly
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            const value = input.value;
            const cursorPos = input.selectionStart;
            
            // If cursor is right after a non-digit character, move it back
            if (cursorPos > 0 && !/\d/.test(value[cursorPos - 1])) {
                e.preventDefault();
                input.setSelectionRange(cursorPos - 1, cursorPos - 1);
            }
        }
    });
}

/* ========================================
   Validation Functions
   ======================================== */
function validateName(input) {
    if (!input) return false;
    
    const value = input.value.trim();
    const errorEl = document.getElementById('nameError');
    
    if (value.length === 0) {
        showError(input, errorEl, 'Введите ваше имя');
        return false;
    }
    
    if (value.length < 2) {
        showError(input, errorEl, 'Имя должно содержать минимум 2 символа');
        return false;
    }
    
    clearError(input, errorEl);
    return true;
}

function validatePhone(input) {
    if (!input) return false;
    
    const value = input.value.replace(/\D/g, '');
    const errorEl = document.getElementById('phoneError');
    
    // Check if phone has at least 10 digits (after country code)
    const phoneDigits = value.startsWith('7') || value.startsWith('8') 
        ? value.substring(1) 
        : value;
    
    if (phoneDigits.length === 0) {
        showError(input, errorEl, 'Введите номер телефона');
        return false;
    }
    
    if (phoneDigits.length < 10) {
        showError(input, errorEl, 'Введите полный номер телефона');
        return false;
    }
    
    clearError(input, errorEl);
    return true;
}

function showError(input, errorEl, message) {
    if (input) {
        input.classList.add('form__input--error');
    }
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearError(input, errorEl) {
    if (input) {
        input.classList.remove('form__input--error');
    }
    if (errorEl) {
        errorEl.textContent = '';
    }
}

function clearValidation(input) {
    if (!input) return;
    const errorEl = document.getElementById(input.id + 'Error');
    clearError(input, errorEl);
}

/* ========================================
   Simulate Request
   ======================================== */
function simulateRequest(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

/* ========================================
   Success Modal
   ======================================== */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = modal?.querySelector('.modal__close');
    const overlay = modal?.querySelector('.modal__overlay');
    
    if (!modal) return;
    
    modal.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
    
    function closeModal() {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
    
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
    
    // Close on escape
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .service-card, .step, .result-card'
    );
    
    if (!animatedElements.length) return;
    
    // Add animation class to elements
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll--visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ========================================
   Utility Functions
   ======================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
