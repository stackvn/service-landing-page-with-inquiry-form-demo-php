/**
 * МастерДом — Landing Page JavaScript
 * Creative interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initForm();
    initScrollAnimations();
    initSmoothScroll();
});

// Navigation
function initNavigation() {
    const navWrapper = document.getElementById('navWrapper');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navWrapper.classList.add('nav-wrapper--scrolled');
        } else {
            navWrapper.classList.remove('nav-wrapper--scrolled');
        }
    }, { passive: true });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('menu-toggle--active');
        mobileNav.classList.toggle('mobile-nav--active');
        document.body.style.overflow = mobileNav.classList.contains('mobile-nav--active') ? 'hidden' : '';
    });
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('menu-toggle--active');
            mobileNav.classList.remove('mobile-nav--active');
            document.body.style.overflow = '';
        });
    });
}

// Form handling
function initForm() {
    const form = document.getElementById('requestForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const submitBtn = form.querySelector('.form__submit');
    const btnText = submitBtn.querySelector('.btn__text');
    const btnLoader = submitBtn.querySelector('.btn__loader');
    
    // Phone mask
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0 && (value[0] === '7' || value[0] === '8')) {
            value = value.substring(1);
        }
        
        value = value.substring(0, 10);
        
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7 (';
            if (value.length <= 3) {
                formatted += value;
            } else {
                formatted += value.substring(0, 3) + ')';
                if (value.length <= 6) {
                    formatted += ' ' + value.substring(3);
                } else {
                    formatted += ' ' + value.substring(3, 6) + '-';
                    if (value.length <= 8) {
                        formatted += value.substring(6);
                    } else {
                        formatted += value.substring(6, 8) + '-' + value.substring(8, 10);
                    }
                }
            }
        }
        
        e.target.value = formatted;
    });
    
    // Validation
    function validateName() {
        const value = nameInput.value.trim();
        const errorEl = document.getElementById('nameError');
        
        if (value.length < 2) {
            showError(nameInput, errorEl, 'Введите имя (минимум 2 символа)');
            return false;
        }
        
        clearError(nameInput, errorEl);
        return true;
    }
    
    function validatePhone() {
        const digits = phoneInput.value.replace(/\D/g, '');
        const errorEl = document.getElementById('phoneError');
        const phoneDigits = digits.startsWith('7') ? digits.substring(1) : digits;
        
        if (phoneDigits.length < 10) {
            showError(phoneInput, errorEl, 'Введите полный номер телефона');
            return false;
        }
        
        clearError(phoneInput, errorEl);
        return true;
    }
    
    function showError(input, errorEl, message) {
        input.classList.add('form__input--error');
        if (errorEl) errorEl.textContent = message;
    }
    
    function clearError(input, errorEl) {
        input.classList.remove('form__input--error');
        if (errorEl) errorEl.textContent = '';
    }
    
    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    phoneInput.addEventListener('blur', validatePhone);
    
    nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('form__input--error')) validateName();
    });
    
    phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('form__input--error')) validatePhone();
    });
    
    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        
        if (!isNameValid || !isPhoneValid) {
            if (!isNameValid) nameInput.focus();
            else phoneInput.focus();
            return;
        }
        
        // Show loader
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success modal
        showModal();
        
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        btnText.style.display = '';
        btnLoader.style.display = 'none';
    });
}

// Modal
function showModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = modal.querySelector('.modal__overlay');
    
    modal.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
    
    function close() {
        modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', esc);
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in--visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const offset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}
