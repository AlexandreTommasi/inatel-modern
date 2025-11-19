/**
 * Vagas Page - Job Matching System
 * Handles job filtering, matching algorithm, and candidature
 */

// =============== STATE MANAGEMENT ===============
let vagas = [];
let userProfile = {
  curso: '',
  periodo: 0,
  areas: []
};

// Load profile from localStorage
function loadProfile() {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    userProfile = JSON.parse(savedProfile);
    populateProfileForm();
    updateProfileStatus();
  }

  // Sempre mostrar o modal ao carregar a página
  showProfileSetupModal();
  hideVagasContent();
}

// =============== PROFILE SETUP MODAL ===============
const profileSetupModal = document.getElementById('profile-setup-modal');
const profileSetupForm = document.getElementById('profile-setup-form');
const vagasContent = document.getElementById('vagas-content');

function showProfileSetupModal() {
  if (profileSetupModal) {
    profileSetupModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideProfileSetupModal() {
  if (profileSetupModal) {
    profileSetupModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function showVagasContent() {
  if (vagasContent) {
    vagasContent.style.display = 'block';
  }
}

function hideVagasContent() {
  if (vagasContent) {
    vagasContent.style.display = 'none';
  }
}

// Handle profile setup form submission
if (profileSetupForm) {
  profileSetupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const curso = document.getElementById('setup-curso').value;
    const periodo = parseInt(document.getElementById('setup-periodo').value) || 0;

    // Validation
    if (!curso || !periodo) {
      showToast('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Get selected areas
    const selectedAreas = [];
    document.querySelectorAll('#setup-areas-interesse input[name="areas"]:checked').forEach(checkbox => {
      selectedAreas.push(checkbox.value);
    });

    if (selectedAreas.length < 2) {
      showToast('Selecione pelo menos 2 áreas de interesse!');
      return;
    }

    // Get selected tipos
    const selectedTipos = [];
    document.querySelectorAll('#profile-setup-form input[name="tipo"]:checked').forEach(checkbox => {
      selectedTipos.push(checkbox.value);
    });

    if (selectedTipos.length === 0) {
      showToast('Selecione pelo menos um tipo de vaga!');
      return;
    }

    // Get selected modalidades
    const selectedModalidades = [];
    document.querySelectorAll('#profile-setup-form input[name="modalidade"]:checked').forEach(checkbox => {
      selectedModalidades.push(checkbox.value);
    });

    if (selectedModalidades.length === 0) {
      showToast('Selecione pelo menos uma modalidade!');
      return;
    }

    // Save to userProfile
    userProfile = {
      curso,
      periodo,
      areas: selectedAreas,
      tipos: selectedTipos,
      modalidades: selectedModalidades
    };

    // Save to localStorage
    saveProfile();

    // Update sidebar form
    populateProfileForm();
    updateProfileStatus();

    // Hide modal and show vagas content
    hideProfileSetupModal();
    showVagasContent();

    // Load vagas
    if (vagas.length > 0) {
      renderVagas();
    }

    // Show success toast
    showToast('Perfil configurado com sucesso! Carregando vagas...');
  });
}

// Save profile to localStorage
function saveProfile() {
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// =============== PROFILE FORM ===============
const profileForm = document.getElementById('profile-form');
const profileStatus = document.getElementById('profile-status');

function populateProfileForm() {
  document.getElementById('curso').value = userProfile.curso || '';
  document.getElementById('periodo').value = userProfile.periodo || '';

  // Set checkboxes
  const checkboxes = document.querySelectorAll('input[name="areas"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = userProfile.areas.includes(checkbox.value);
  });
}

function updateProfileStatus() {
  const isConfigured = userProfile.curso && userProfile.periodo && userProfile.areas.length > 0;

  if (isConfigured) {
    profileStatus.textContent = 'Configurado';
    profileStatus.classList.add('active');
  } else {
    profileStatus.textContent = 'Não configurado';
    profileStatus.classList.remove('active');
  }

  // Update UI states
  updateUIStates(isConfigured);
}

// Toggle between profile required and vagas available states
function updateUIStates(isProfileConfigured) {
  const profileRequiredState = document.getElementById('profile-required-state');
  const vagasAvailableState = document.getElementById('vagas-available-state');

  if (isProfileConfigured) {
    profileRequiredState.style.display = 'none';
    vagasAvailableState.style.display = 'block';
  } else {
    profileRequiredState.style.display = 'block';
    vagasAvailableState.style.display = 'none';
  }
}

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  userProfile.curso = document.getElementById('curso').value;
  userProfile.periodo = parseInt(document.getElementById('periodo').value) || 0;

  // Get selected areas
  const selectedAreas = [];
  document.querySelectorAll('input[name="areas"]:checked').forEach(checkbox => {
    selectedAreas.push(checkbox.value);
  });
  userProfile.areas = selectedAreas;

  // Save and update
  saveProfile();
  updateProfileStatus();
  renderVagas();

  // Show toast
  showToast('Preferências salvas com sucesso!');
});

// =============== MATCH ALGORITHM ===============
function calculateMatch(vaga) {
  if (!userProfile.curso || !userProfile.periodo || userProfile.areas.length === 0) {
    return 0;
  }

  let score = 0;
  let maxScore = 0;

  // Course match (40 points)
  maxScore += 40;
  if (vaga.cursos.includes(userProfile.curso)) {
    score += 40;
  } else {
    // Partial match for related courses
    const relacionados = {
      'Engenharia de Computação': ['Engenharia de Software'],
      'Engenharia de Software': ['Engenharia de Computação'],
      'Engenharia Elétrica': ['Engenharia de Telecomunicações', 'Engenharia de Controle e Automação'],
      'Engenharia de Telecomunicações': ['Engenharia Elétrica'],
      'Engenharia de Controle e Automação': ['Engenharia Elétrica']
    };

    if (relacionados[userProfile.curso]) {
      const hasRelated = relacionados[userProfile.curso].some(curso => vaga.cursos.includes(curso));
      if (hasRelated) score += 20;
    }
  }

  // Period match (20 points)
  maxScore += 20;
  if (userProfile.periodo >= vaga.periodoMinimo) {
    score += 20;
  } else {
    // Partial points if close
    const diff = vaga.periodoMinimo - userProfile.periodo;
    if (diff === 1) score += 10;
  }

  // Interest areas match (40 points)
  maxScore += 40;
  const matchingAreas = vaga.areas.filter(area => userProfile.areas.includes(area));
  if (matchingAreas.length > 0) {
    score += (matchingAreas.length / vaga.areas.length) * 40;
  }

  // Calculate percentage
  const percentage = Math.round((score / maxScore) * 100);
  return percentage;
}

function getMatchLevel(percentage) {
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

// =============== LOAD VAGAS ===============
async function loadVagas() {
  try {
    const response = await fetch('data/vagas.json');
    vagas = await response.json();

    // Calculate match for each vaga
    vagas = vagas.map(vaga => ({
      ...vaga,
      matchPercentual: calculateMatch(vaga),
      matchLevel: getMatchLevel(calculateMatch(vaga))
    }));

    renderVagas();
  } catch (error) {
    console.error('Erro ao carregar vagas:', error);
    showToast('Erro ao carregar vagas. Tente novamente.');
  }
}

// =============== FILTERS ===============
function getActiveFilters() {
  const filters = {
    tipos: [],
    modalidades: []
  };

  // Get selected types
  document.querySelectorAll('input[name="tipo"]:checked').forEach(checkbox => {
    filters.tipos.push(checkbox.value);
  });

  // Get selected modalities
  document.querySelectorAll('input[name="modalidade"]:checked').forEach(checkbox => {
    filters.modalidades.push(checkbox.value);
  });

  return filters;
}

function filterVagas(vagasList) {
  const filters = getActiveFilters();

  return vagasList.filter(vaga => {
    // Filter by type
    if (filters.tipos.length > 0 && !filters.tipos.includes(vaga.tipo)) {
      return false;
    }

    // Filter by modality
    if (filters.modalidades.length > 0 && !filters.modalidades.includes(vaga.modalidade)) {
      return false;
    }

    return true;
  });
}

// Clear filters
document.getElementById('clear-filters').addEventListener('click', () => {
  document.querySelectorAll('input[name="tipo"], input[name="modalidade"]').forEach(checkbox => {
    checkbox.checked = true;
  });
  renderVagas();
});

// Listen to filter changes
document.querySelectorAll('input[name="tipo"], input[name="modalidade"]').forEach(checkbox => {
  checkbox.addEventListener('change', renderVagas);
});

// =============== SORTING ===============
const sortSelect = document.getElementById('sort');

function sortVagas(vagasList) {
  const sortBy = sortSelect.value;

  return [...vagasList].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.matchPercentual - a.matchPercentual;
      case 'recentes':
        return new Date(b.publicadoEm) - new Date(a.publicadoEm);
      case 'empresa':
        return a.empresa.localeCompare(b.empresa);
      default:
        return 0;
    }
  });
}

sortSelect.addEventListener('change', renderVagas);

// =============== RENDER VAGAS ===============
const vagasContainer = document.getElementById('vagas-container');
const emptyState = document.getElementById('empty-state');
const vagasCount = document.getElementById('vagas-count');

function renderVagas() {
  // Filter and sort
  let filteredVagas = filterVagas(vagas);
  filteredVagas = sortVagas(filteredVagas);

  // Update count
  vagasCount.textContent = `${filteredVagas.length} ${filteredVagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}`;

  // Clear container
  vagasContainer.innerHTML = '';

  if (filteredVagas.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  // Render each vaga
  filteredVagas.forEach(vaga => {
    const card = createVagaCard(vaga);
    vagasContainer.appendChild(card);
  });
}

function createVagaCard(vaga) {
  const card = document.createElement('article');
  card.className = 'vaga-card';

  // Format date
  const date = new Date(vaga.publicadoEm);
  const formattedDate = date.toLocaleDateString('pt-BR');

  card.innerHTML = `
    <div class="vaga-card__header">
      <div class="vaga-card__info">
        <h3>${vaga.titulo}</h3>
        <div class="vaga-card__empresa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          ${vaga.empresa}
        </div>
      </div>
      <div class="vaga-card__match">
        <div class="match-circle ${vaga.matchLevel}">
          ${vaga.matchPercentual}%
        </div>
        <div class="match-label">Match</div>
      </div>
    </div>

    <div class="vaga-card__tags">
      <span class="tag tag--type">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        ${vaga.tipo}
      </span>
      <span class="tag tag--modal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        ${vaga.modalidade}
      </span>
      <span class="tag">
        ${vaga.localizacao}
      </span>
      ${vaga.areas.slice(0, 3).map(area => `<span class="tag">${area}</span>`).join('')}
    </div>

    <p class="vaga-card__description">${vaga.descricao}</p>

    <div class="vaga-card__footer">
      <div class="vaga-card__meta">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Publicado em ${formattedDate}
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
          A partir do ${vaga.periodoMinimo}º período
        </span>
      </div>
      <div class="vaga-card__actions">
        <button class="btn--icon" title="Ver detalhes" onclick="showVagaDetails(${vaga.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button class="btn btn--primary" onclick="openCandidaturaModal(${vaga.id})">
          Candidatar-se
        </button>
      </div>
    </div>
  `;

  return card;
}

// =============== VAGA DETAILS ===============
function showVagaDetails(vagaId) {
  const vaga = vagas.find(v => v.id === vagaId);
  if (!vaga) return;

  alert(`
DETALHES DA VAGA

${vaga.titulo}
${vaga.empresa}

${vaga.descricao}

REQUISITOS:
${vaga.requisitos.map(r => `• ${r}`).join('\n')}

BENEFÍCIOS:
${vaga.beneficios.map(b => `• ${b}`).join('\n')}

Match: ${vaga.matchPercentual}%
  `);
}

// Make function global
window.showVagaDetails = showVagaDetails;

// =============== CANDIDATURA MODAL ===============
const modal = document.getElementById('candidatura-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const candidaturaForm = document.getElementById('candidatura-form');

let currentVagaId = null;

function openCandidaturaModal(vagaId) {
  currentVagaId = vagaId;
  const vaga = vagas.find(v => v.id === vagaId);

  if (!vaga) return;

  // Update modal content
  const modalVagaInfo = document.getElementById('modal-vaga-info');
  modalVagaInfo.innerHTML = `
    <div style="background: var(--color-bg-alt); padding: var(--space-lg); border-radius: var(--radius-lg); margin-bottom: var(--space-lg);">
      <h4 style="margin-bottom: var(--space-xs);">${vaga.titulo}</h4>
      <p style="color: var(--color-text-light); font-size: var(--font-size-sm); margin: 0;">${vaga.empresa} • ${vaga.tipo}</p>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCandidaturaModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  candidaturaForm.reset();
  currentVagaId = null;
}

modalClose.addEventListener('click', closeCandidaturaModal);
cancelBtn.addEventListener('click', closeCandidaturaModal);
modalOverlay.addEventListener('click', closeCandidaturaModal);

// Make function global
window.openCandidaturaModal = openCandidaturaModal;

// =============== CANDIDATURA FORM ===============
candidaturaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    vagaId: currentVagaId,
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    linkedin: document.getElementById('linkedin').value,
    mensagem: document.getElementById('mensagem').value,
    dataEnvio: new Date().toISOString()
  };

  // Save to localStorage (mock)
  const candidaturas = JSON.parse(localStorage.getItem('candidaturas') || '[]');
  candidaturas.push(formData);
  localStorage.setItem('candidaturas', JSON.stringify(candidaturas));

  // Close modal
  closeCandidaturaModal();

  // Show success message
  showToast('Candidatura enviada com sucesso!');

  console.log('Candidatura enviada:', formData);
});

// =============== TOAST ===============
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// =============== PARTICLES ANIMATION ===============
function createParticles(containerId, particleCount = 50) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';

    // Random animation duration (10s to 30s)
    const duration = 10 + Math.random() * 20;
    particle.style.animationDuration = duration + 's';

    // Random delay
    particle.style.animationDelay = Math.random() * 5 + 's';

    // Random size
    const size = 2 + Math.random() * 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random opacity
    particle.style.opacity = 0.3 + Math.random() * 0.5;

    container.appendChild(particle);
  }
}

// =============== INITIALIZE ===============
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadVagas();

  // Initialize particles
  createParticles('particles-modal', 50);
  createParticles('particles-hero', 40);
});
