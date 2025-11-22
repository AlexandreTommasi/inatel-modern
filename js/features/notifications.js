/**
 * Notifications System - Mock Push Notifications
 * Uses browser Notification API to simulate job alerts
 */

// =============== STATE ===============
let notificationsEnabled = false;
let notificationCheckInterval = null;

// =============== CHECK NOTIFICATION SUPPORT ===============
function isNotificationSupported() {
  return 'Notification' in window;
}

// =============== REQUEST PERMISSION ===============
async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    alert('Seu navegador não suporta notificações.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      notificationsEnabled = true;
      localStorage.setItem('notificationsEnabled', 'true');
      updateNotificationBanner();
      startNotificationSimulation();

      // Show welcome notification
      showNotification(
        'Notificações ativadas! 🎉',
        'Você receberá alertas quando surgirem vagas compatíveis com seu perfil.',
        './images/logo-inatel.png'
      );

      return true;
    } else {
      alert('Você precisa permitir notificações para receber alertas de vagas.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return false;
  }
}

// =============== SHOW NOTIFICATION ===============
function showNotification(title, body, icon = null) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    console.log('Notificações não permitidas');
    return;
  }

  const options = {
    body,
    icon: icon || './images/logo-inatel.png',
    badge: './images/logo-inatel.png',
    vibrate: [200, 100, 200],
    tag: 'vaga-notification',
    requireInteraction: false,
    data: {
      url: window.location.origin + '/inatel-modern/vagas.html'
    }
  };

  const notification = new Notification(title, options);

  // Click handler
  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    notification.close();

    // Navigate to vagas page if not already there
    if (!window.location.pathname.includes('vagas.html')) {
      window.location.href = './vagas.html';
    }
  };

  // Auto close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);
}

// =============== SIMULATE VAGA NOTIFICATIONS ===============
function startNotificationSimulation() {
  // Clear any existing interval
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
  }

  // Check for new vagas every 30 seconds (mock)
  notificationCheckInterval = setInterval(() => {
    checkForNewVagas();
  }, 30000);

  console.log('🔔 Sistema de notificações iniciado (simulação a cada 30s)');
}

function stopNotificationSimulation() {
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
    notificationCheckInterval = null;
  }
  console.log('🔕 Sistema de notificações pausado');
}

// Mock: Check for new vagas with high match
function checkForNewVagas() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

  // Only send notifications if profile is configured
  if (!userProfile.curso || !userProfile.areas || userProfile.areas.length === 0) {
    return;
  }

  // Mock: 20% chance of new vaga notification
  const shouldNotify = Math.random() < 0.2;

  if (shouldNotify) {
    // Mock vaga data
    const mockVagas = [
      {
        titulo: 'Desenvolvedor Full Stack - Estágio',
        empresa: 'Inatel Competence Center',
        match: 95
      },
      {
        titulo: 'Engenheiro de IoT - Júnior',
        empresa: 'Padtec',
        match: 88
      },
      {
        titulo: 'Analista de Segurança Cibernética',
        empresa: 'Siemens',
        match: 92
      },
      {
        titulo: 'Desenvolvedor Mobile - Flutter',
        empresa: 'Stefanini',
        match: 85
      }
    ];

    const randomVaga = mockVagas[Math.floor(Math.random() * mockVagas.length)];

    showNotification(
      `Nova vaga: ${randomVaga.titulo} (${randomVaga.match}% match)`,
      `${randomVaga.empresa} está contratando! Clique para ver detalhes.`
    );
  }
}

// =============== NOTIFICATION BANNER ===============
const notificationBanner = document.getElementById('notification-banner');
const enableNotificationsBtn = document.getElementById('enable-notifications');

function updateNotificationBanner() {
  if (!notificationBanner) return;

  const enabled = localStorage.getItem('notificationsEnabled') === 'true';

  if (enabled && Notification.permission === 'granted') {
    notificationBanner.classList.add('hidden');
  } else {
    notificationBanner.classList.remove('hidden');
  }
}

// =============== EVENT LISTENERS ===============
if (enableNotificationsBtn) {
  enableNotificationsBtn.addEventListener('click', async () => {
    const granted = await requestNotificationPermission();

    if (granted) {
      console.log('✅ Notificações habilitadas com sucesso');
    }
  });
}

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  // Check if notifications were previously enabled
  const wasEnabled = localStorage.getItem('notificationsEnabled') === 'true';

  if (wasEnabled && Notification.permission === 'granted') {
    notificationsEnabled = true;
    startNotificationSimulation();
  }

  updateNotificationBanner();

  // Log support status
  if (isNotificationSupported()) {
    console.log('🔔 Notification API disponível');
    console.log(`📊 Permissão atual: ${Notification.permission}`);
  } else {
    console.log('❌ Notification API não suportada neste navegador');
  }
});

// =============== MANUAL TRIGGER (for testing) ===============
// Uncomment to test notifications manually in console:
// window.testNotification = () => {
//   showNotification(
//     'Nova vaga: Desenvolvedor Python - 92% match',
//     'Inatel está contratando! Clique para ver detalhes.'
//   );
// };

// =============== EXPORT FUNCTIONS ===============
window.requestNotificationPermission = requestNotificationPermission;
window.showNotification = showNotification;
