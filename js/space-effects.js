/**
 * Efeitos Espaciais/Subaquáticos 3D
 * Cria ambiente imersivo com partículas e animações
 */

// =============== ESTRELAS/BOLHAS FLUTUANTES ===============
function createFloatingParticles() {
  // Remove o container de partículas antigas se existir
  const oldContainer = document.getElementById('space-particles');
  if (oldContainer) {
    oldContainer.remove();
  }

  const container = document.createElement('div');
  container.id = 'space-particles';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  `;
  document.body.prepend(container);

  const particleCount = 30; // Reduzido de 100 para 30

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'space-particle';

    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Tamanho variado (estrelas pequenas e grandes)
    const size = Math.random() * 3 + 1;

    // Opacidade variada
    const opacity = Math.random() * 0.7 + 0.3;

    // Duração da animação variada
    const duration = Math.random() * 20 + 15;

    // Delay aleatório
    const delay = Math.random() * 10;

    // Tipo de partícula (estrela ou bolha)
    const type = Math.random() > 0.5 ? 'star' : 'bubble';

    particle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${type === 'star'
        ? `radial-gradient(circle, rgba(0, 212, 255, ${opacity}) 0%, rgba(0, 163, 224, ${opacity * 0.5}) 50%, transparent 100%)`
        : `radial-gradient(circle, rgba(255, 255, 255, ${opacity * 0.6}) 0%, rgba(0, 212, 255, ${opacity * 0.3}) 50%, transparent 100%)`
      };
      box-shadow: 0 0 ${size * 3}px rgba(0, 212, 255, ${opacity * 0.8});
      animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
      filter: blur(${Math.random() * 0.5}px);
    `;

    container.appendChild(particle);
  }
}

// =============== RAIOS DE LUZ/ÁGUA ===============
function createLightRays() {
  // Removido para melhorar performance
  return;
}

// =============== ONDULAÇÕES (EFEITO ÁGUA) ===============
function createWaveEffect() {
  // Removido para melhorar performance
  return;
}

// =============== ANIMAÇÕES CSS ===============
function injectAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      25% {
        transform: translate(20px, -30px) scale(1.2);
        opacity: 0.8;
      }
      50% {
        transform: translate(-15px, -60px) scale(0.9);
        opacity: 1;
      }
      75% {
        transform: translate(25px, -90px) scale(1.1);
        opacity: 0.6;
      }
    }

    @keyframes light-ray-pulse {
      0%, 100% {
        opacity: 0.3;
        transform: translateX(-50%) translateY(-50%) rotate(var(--rotation)) scale(1);
      }
      50% {
        opacity: 0.6;
        transform: translateX(-50%) translateY(-50%) rotate(var(--rotation)) scale(1.1);
      }
    }

    @keyframes wave-movement {
      0%, 100% {
        transform: translateX(0) scaleY(1);
      }
      50% {
        transform: translateX(20px) scaleY(1.2);
      }
    }

    /* Glassmorphism aprimorado */
    .subject-item,
    .exam-item,
    .task-item {
      background: rgba(255, 255, 255, 0.6) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 4px 16px rgba(0, 81, 165, 0.1);
    }

    .subject-item:hover,
    .exam-item:hover,
    .task-item:hover {
      background: rgba(255, 255, 255, 0.8) !important;
      box-shadow: 0 8px 24px rgba(0, 163, 224, 0.2);
      transform: translateX(4px) translateZ(10px) !important;
    }
  `;
  document.head.appendChild(style);
}

// =============== EFEITO DE PROFUNDIDADE 3D ===============
function add3DDepthEffect() {
  // Removido para melhorar performance
  return;
}

// =============== INICIALIZAR TUDO ===============
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🌌 Iniciando efeitos espaciais 3D...', 'color: #00D4FF; font-size: 14px; font-weight: bold;');

  injectAnimations();
  createFloatingParticles();
  createLightRays();
  createWaveEffect();
  add3DDepthEffect();

  console.log('%c✨ Ambiente espacial ativado!', 'color: #00A3E0; font-size: 12px;');
});
