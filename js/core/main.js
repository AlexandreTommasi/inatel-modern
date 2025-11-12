/**
 * Main JavaScript for Inatel Homepage
 * Handles navigation, scroll effects, and animations
 */

// =============== INITIALIZE NAVIGATION ===============
function initializeNavigation() {
  // =============== MOBILE MENU ===============
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  // Show menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // Hide menu
  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Close menu when clicking on nav links
  if (navMenu) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
      });
    });
  }

  // =============== HEADER SCROLL EFFECT ===============
  const header = document.getElementById('header');

  if (header) {
    let isScrolled = false;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const shouldBeScrolled = scrollY > 100;

      // Only update when state changes
      if (shouldBeScrolled && !isScrolled) {
        header.classList.add('scrolled');

        // Force inline styles as fallback
        header.style.background = 'rgba(0, 81, 165, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.webkitBackdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 81, 165, 0.5)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';

        isScrolled = true;

      } else if (!shouldBeScrolled && isScrolled) {
        header.classList.remove('scrolled');

        // Remove inline styles to return to transparent
        header.style.background = '';
        header.style.backdropFilter = '';
        header.style.webkitBackdropFilter = '';
        header.style.boxShadow = '';
        header.style.borderBottom = '';

        isScrolled = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Verificar imediatamente
    handleScroll();
  }

  // =============== NOTIFICATIONS DROPDOWN ===============
  const notificationsButton = document.getElementById('notifications-button');
  const notificationsDropdown = document.getElementById('notifications-dropdown');

  if (notificationsButton && notificationsDropdown) {
    notificationsButton.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationsDropdown.classList.toggle('show');
      // Fechar profile se estiver aberto
      const profileDropdown = document.getElementById('profile-dropdown');
      if (profileDropdown) {
        profileDropdown.classList.remove('show');
      }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!notificationsDropdown.contains(e.target) && !notificationsButton.contains(e.target)) {
        notificationsDropdown.classList.remove('show');
      }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        notificationsDropdown.classList.remove('show');
      }
    });
  }

  // =============== PROFILE DROPDOWN ===============
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileButton && profileDropdown) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
      // Fechar notifications se estiver aberto
      if (notificationsDropdown) {
        notificationsDropdown.classList.remove('show');
      }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        profileDropdown.classList.remove('show');
      }
    });
  }
}

// =============== INITIALIZE SMOOTH SCROLL ===============
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Esperar componentes serem carregados antes de inicializar
window.addEventListener('componentsLoaded', () => {
  initializeNavigation();
  initializeSmoothScroll();
  initializeActiveSection();
});

// =============== SCROLL REVEAL ANIMATION ===============
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

// Observe all cards and sections
const animatedElements = document.querySelectorAll('.card, .stat-card, .news-card, .feature-card, .community-card');
animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// =============== INITIALIZE ACTIVE SECTION HIGHLIGHT ===============
function initializeActiveSection() {
  const sections = document.querySelectorAll('section[id]');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.style.color = 'var(--color-primary)';
        } else {
          navLink.style.color = 'var(--color-text)';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);
}

// =============== PARTICLES ANIMATION ===============
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    // Random size
    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random animation duration
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';

    particlesContainer.appendChild(particle);
  }
}

// =============== COUNTER ANIMATION ===============
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Start when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// =============== TYPING EFFECT ===============
function typingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const texts = [
    'Portal do Aluno Inatel',
    'Encontre sua vaga ideal!',
    'Seu futuro começa aqui!'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing after 1 second
  setTimeout(type, 1000);
}

// =============== PARALLAX EFFECT (DISABLED FOR PERFORMANCE) ===============
function parallaxEffect() {
  // Desabilitado para melhorar performance
  return;
}

// =============== MOUSE TRAIL ===============
function createMouseTrail() {
  const trail = [];
  const trailLength = 20;
  let mouseX = 0;
  let mouseY = 0;

  // Create trail elements
  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'mouse-trail-dot';
    document.body.appendChild(dot);
    trail.push(dot);
  }

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate trail
  function animateTrail() {
    let x = mouseX;
    let y = mouseY;

    trail.forEach((dot, index) => {
      const nextDot = trail[index + 1] || trail[0];

      dot.style.left = x + 'px';
      dot.style.top = y + 'px';

      // Fade out based on position in trail
      const opacity = 1 - (index / trailLength);
      dot.style.opacity = opacity;

      // Scale down based on position
      const scale = 1 - (index / trailLength) * 0.5;
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`;

      x += (nextDot.offsetLeft - x) * 0.3;
      y += (nextDot.offsetTop - y) * 0.3;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

// =============== 3D TILT EFFECT (DISABLED FOR PERFORMANCE) ===============
function add3DTilt() {
  // Desabilitado para melhorar performance
  return;
}

// =============== CURSOR GLOW EFFECT ===============
function createCursorGlow() {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// =============== CONSOLE MESSAGE ===============
console.log('%c🚀 Inatel Modern Website', 'color: #0051A5; font-size: 20px; font-weight: bold;');
console.log('%cDesenvolvido com Vanilla JavaScript', 'color: #00A3E0; font-size: 12px;');

// =============== INITIALIZE ALL ===============
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  animateCounters();
  typingEffect();
  parallaxEffect();
  add3DTilt();
  createCursorGlow();
});
