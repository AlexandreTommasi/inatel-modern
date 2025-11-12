/**
 * Components Loader
 * Carrega componentes HTML reutilizáveis (header, footer, etc)
 */

// =============== COMPONENT LOADER ===============
async function loadComponent(componentName, targetId) {
  try {
    const response = await fetch(`/components/${componentName}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentName}`);
    }
    const html = await response.text();
    const target = document.getElementById(targetId);
    if (target) {
      target.outerHTML = html;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error loading component ${componentName}:`, error);
    return false;
  }
}

// =============== LOAD ALL COMPONENTS ===============
async function loadAllComponents() {
  const componentsToLoad = [
    { name: 'header', id: 'header-placeholder' },
    { name: 'footer', id: 'footer-placeholder' }
  ];

  // Carregar todos os componentes em paralelo
  await Promise.all(
    componentsToLoad.map(({ name, id }) => loadComponent(name, id))
  );

  console.log('✅ Componentes carregados com sucesso');

  // Disparar evento customizado quando componentes estiverem prontos
  window.dispatchEvent(new Event('componentsLoaded'));
}

// =============== INITIALIZE ===============
// Carregar componentes quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllComponents);
} else {
  loadAllComponents();
}
