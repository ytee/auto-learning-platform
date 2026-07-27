(() => {
  const initialHash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const hadInitialHash = location.hash.length > 1;
  let pendingDestination = null;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  function closeMenus() {
    $$('.menu-group[open]').forEach(menu => menu.removeAttribute('open'));
  }

  function moduleLabel(moduleId) {
    return moduleId === 'autosar' ? 'AUTOSAR' : 'Functional Safety';
  }

  function setNavigationArea(area, moduleId) {
    document.body.dataset.learningArea = area;
    $('#exerciseNavigation')?.classList.toggle('hidden', area !== 'exercises');

    const activeArea = $('#activeArea');
    if (activeArea) {
      activeArea.textContent = `${area === 'concepts' ? 'Concepts' : 'Exercises'} · ${moduleLabel(moduleId)}`;
    }

    $$('.menu-group').forEach(group => {
      group.classList.toggle('active', group.dataset.menuGroup === area);
    });

    $$('[data-menu-area]').forEach(button => {
      const active = button.dataset.menuArea === area && button.dataset.module === moduleId;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function openView(viewName) {
    const trigger = $(`[data-view="${viewName}"]`);
    if (trigger) trigger.click();
  }

  function clearExerciseUrl(moduleId) {
    history.replaceState(null, '', `#module=${encodeURIComponent(moduleId)}`);
  }

  function completePendingDestination() {
    if (!pendingDestination) return;

    const moduleSelect = $('#moduleSelect');
    if (!moduleSelect || moduleSelect.value !== pendingDestination.moduleId) return;

    const { area, moduleId } = pendingDestination;
    pendingDestination = null;
    setNavigationArea(area, moduleId);

    if (area === 'concepts') {
      openView('concepts');
    } else {
      clearExerciseUrl(moduleId);
      openView('route');
    }
  }

  function openDestination(area, moduleId) {
    closeMenus();
    const moduleSelect = $('#moduleSelect');
    if (!moduleSelect?.options.length) {
      pendingDestination = { area, moduleId };
      return;
    }

    setNavigationArea(area, moduleId);

    if (moduleSelect.value === moduleId) {
      if (area === 'concepts') {
        openView('concepts');
      } else {
        clearExerciseUrl(moduleId);
        openView('route');
      }
      return;
    }

    pendingDestination = { area, moduleId };
    moduleSelect.value = moduleId;
    moduleSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function bindNavigation() {
    $$('[data-menu-area]').forEach(button => {
      button.addEventListener('click', () => {
        openDestination(button.dataset.menuArea, button.dataset.module);
      });
    });

    $$('#exerciseNavigation [data-view]').forEach(button => {
      button.addEventListener('click', () => {
        setNavigationArea('exercises', $('#moduleSelect')?.value || 'safety');
      });
    });

    $('[data-view="concepts"]')?.addEventListener('click', () => {
      setNavigationArea('concepts', 'safety');
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.menu-group')) closeMenus();
    });

    window.addEventListener('hashchange', () => {
      requestAnimationFrame(completePendingDestination);
    });
  }

  async function waitForCockpit() {
    for (let attempt = 0; attempt < 160; attempt += 1) {
      const moduleSelect = $('#moduleSelect');
      const moduleTitle = $('#moduleTitle');
      if (
        moduleSelect?.options.length &&
        moduleTitle?.textContent !== 'Select an automotive learning module'
      ) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw new Error('AutoLeaP navigation could not detect the initialized cockpit');
  }

  async function initializeNavigation() {
    bindNavigation();
    await waitForCockpit();

    const requestedModule = initialHash.get('module') || initialHash.get('topic') || 'safety';
    const requestedView = initialHash.get('view');

    if (requestedView === 'concepts') {
      openDestination('concepts', 'safety');
    } else if (hadInitialHash) {
      openDestination('exercises', requestedModule);
    } else {
      openDestination('concepts', 'safety');
    }
  }

  initializeNavigation().catch(error => {
    console.error(error);
    const activeArea = $('#activeArea');
    if (activeArea) activeArea.textContent = 'Navigation unavailable';
  });
})();
