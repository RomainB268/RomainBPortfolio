/* ========================================
   PORTFOLIO ROMAIN BEAUMONT
   Fichier : main.js
   Description : Scripts principaux du site
   Version : 2.1 - Terminal Theme
   ======================================== */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const CONFIG = {
    scrollThreshold: 300,
    headerScrollThreshold: 50,
    animationDelay: 100,
    typingSpeed: 80,
    statsAnimationDuration: 2000
  };

  // ==================== INITIALISATION ====================
  
  console.log('%c🚀 Portfolio Romain Beaumont - Initialized', 'color: #89b4fa; font-size: 14px; font-weight: bold;');

  document.addEventListener('DOMContentLoaded', function() {
    initScrollToTop();
    initSmoothScroll();
    initIntersectionObserver();
    initFormValidation();
    initTypingEffect();
    initStatsCounter();
    initHeaderScroll();
    initLazyLoading();
    initMobileMenu();
    
    console.log('%c✅ Tous les modules sont chargés', 'color: #a6e3a1; font-size: 12px;');
  });

  // ==================== MENU MOBILE ====================
  
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Fermer le menu au clic sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    console.log('✓ Menu mobile initialisé');
  }

  // ==================== SCROLL TO TOP ====================
  
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (!scrollBtn) {
      console.warn('⚠️ Bouton scroll-to-top non trouvé');
      return;
    }

    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > CONFIG.scrollThreshold) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Action au clic
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    console.log('✓ Scroll to top initialisé');
  }

  // ==================== SMOOTH SCROLL ====================
  
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignorer les liens vides
        if (!href || href === '#') return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = 80;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    console.log(`✓ Smooth scroll activé sur ${links.length} liens`);
  }

  // ==================== INTERSECTION OBSERVER (ANIMATIONS) ====================
  
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Animation spécifique pour les skill bars
          if (entry.target.classList.contains('skill-category')) {
            animateSkillBars(entry.target);
          }
          
          // Ne pas observer à nouveau
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer les éléments
    const elementsToObserve = document.querySelectorAll(
      '.project-card, .skill-category, .highlight-card, .contact-card, .info-card, .filter-btn, .cta-content'
    );

    elementsToObserve.forEach(el => observer.observe(el));

    console.log(`✓ Observer activé sur ${elementsToObserve.length} éléments`);
  }

  // ==================== ANIMATION DES BARRES DE COMPÉTENCES ====================
  
  function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = targetWidth;
      }, index * 100);
    });
  }

  // ==================== VALIDATION FORMULAIRE ====================
  
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) {
      console.warn('⚠️ Formulaire de contact non trouvé (normal sur projets.html)');
      return;
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Récupération des valeurs
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      // Validation
      const errors = validateForm(formData);

      if (errors.length > 0) {
        displayErrors(errors);
        return;
      }

      // Simulation d'envoi
      submitForm(formData);
    });

    console.log('✓ Validation formulaire activée');
  }

  function validateForm(data) {
    const errors = [];

    if (data.name.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('L\'adresse email n\'est pas valide');
    }

    if (data.phone && !/^[0-9\s\+\-\(\)]{10,}$/.test(data.phone)) {
      errors.push('Le numéro de téléphone n\'est pas valide');
    }

    if (data.subject.length < 3) {
      errors.push('Le sujet doit contenir au moins 3 caractères');
    }

    if (data.message.length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }

    return errors;
  }

  function displayErrors(errors) {
    const oldAlert = document.querySelector('.form-alert');
    if (oldAlert) oldAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'form-alert form-alert-error';
    alertDiv.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div>
        <strong>Erreur de validation</strong>
        <ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>
      </div>
    `;

    const form = document.getElementById('contactForm');
    form.insertBefore(alertDiv, form.firstChild);

    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => alertDiv.remove(), 5000);
  }

  function submitForm(data) {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none"/>
      </svg>
      Envoi en cours...
    `;

    setTimeout(() => {
      displaySuccess();
      form.reset();
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Envoyer le message
        <svg class="icon-right" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
    }, 2000);
  }

  function displaySuccess() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'form-alert form-alert-success';
    alertDiv.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <div>
        <strong>Message envoyé !</strong>
        <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
      </div>
    `;

    const form = document.getElementById('contactForm');
    form.insertBefore(alertDiv, form.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
  }

  // ==================== EFFET DE TYPING ====================
  
  function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.opacity = '1';

    let index = 0;

    function type() {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, CONFIG.typingSpeed);
      } else {
        // Retirer le curseur après typing
        setTimeout(() => {
          typingElement.style.borderRight = 'none';
        }, 500);
      }
    }

    setTimeout(type, 500);
    console.log('✓ Effet typing activé');
  }

  // ==================== COMPTEUR ANIMÉ (STATS) ====================
  
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));

    console.log(`✓ Compteur stats activé sur ${statNumbers.length} éléments`);
  }

  function animateCounter(element) {
    const text = element.textContent.trim();
    const isPercentage = text.includes('%');
    const targetValue = parseInt(text);
    
    if (isNaN(targetValue)) return;

    const duration = CONFIG.statsAnimationDuration;
    const increment = targetValue / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        element.textContent = targetValue + (isPercentage ? '%' : '+');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
      }
    }, 16);
  }

  // ==================== HEADER AU SCROLL ====================
  
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > CONFIG.headerScrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Masquer le header au scroll down, afficher au scroll up
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });

    console.log('✓ Header scroll activé');
  }

  // ==================== LAZY LOADING IMAGES ====================
  
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    console.log(`✓ Lazy loading activé sur ${images.length} images`);
  }

  // ==================== LOG DE PERFORMANCE ====================
  
  window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`%c⚡ Page chargée en ${loadTime.toFixed(2)}ms`, 'color: #f9e2af; font-size: 12px;');
  });

})();
