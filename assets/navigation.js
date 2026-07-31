(() => {
  const initialHash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const initialHadHash = location.hash.length > 1;
  const state = {
    manifest: null,
    area: 'concepts',
    moduleId: null,
    view: 'route',
    stage: Number(initialHash.get('stage')) || 1,
    conceptIndex: 0,
    system: '',
    quizIndex: 0,
    filtersOpen: false,
    pendingDestination: null,
    routeSyncQueued: false,
    conceptSyncQueued: false
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeMarkup = value => String(value ?? '').replace(
    /[&<>'"]/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#039;',
      '"': '&quot;'
    })[character]
  );

  const topicById = moduleId => state.manifest?.topics?.find(topic => topic.id === moduleId) || null;
  const topicLabel = moduleId => topicById(moduleId)?.title || moduleId || 'Learning topic';

  function hiddenTrigger(viewName) {
    return $(`.tab[data-view="${viewName}"]`);
  }

  function openUnderlyingView(viewName) {
    const trigger = hiddenTrigger(viewName);
    if (trigger) trigger.click();
    state.view = viewName;
    syncShell();
    if (viewName === 'route') queueRouteSync();
    if (viewName === 'systems') queueSystemSync();
    if (viewName === 'validation') queueQuizSync();
  }

  function createShell() {
    const shell = document.createElement('nav');
    shell.id = 'simpleLearningNavigation';
    shell.className = 'simple-learning-navigation';
    shell.setAttribute('aria-label', 'Learning navigation');
    shell.innerHTML = `
      <div class="simple-nav-inner">
        <div class="simple-segment" role="group" aria-label="Learning area">
          <button type="button" data-simple-area="concepts">Concepts</button>
          <button type="button" data-simple-area="exercises">Exercises</button>
        </div>
        <label class="simple-field simple-topic-field">
          <span>Topic</span>
          <select id="simpleTopicSelect" aria-label="Learning topic"></select>
        </label>
        <label class="simple-field simple-view-field">
          <span>View</span>
          <select id="simpleViewSelect" aria-label="Exercise view">
            <option value="route">Learning route</option>
            <option value="systems">Systems</option>
            <option value="interfaces">Interface map</option>
            <option value="coverage">Coverage map</option>
            <option value="validation">Validation</option>
          </select>
        </label>
        <button type="button" id="simpleFilterToggle" class="simple-filter-toggle" aria-expanded="false">Filters</button>
      </div>
    `;

    const oldPrimary = $('.primary-navigation');
    (oldPrimary || document.querySelector('main')).before(shell);

    $('#simpleTopicSelect').innerHTML = state.manifest.topics
      .map(topic => `<option value="${escapeMarkup(topic.id)}">${escapeMarkup(topic.title)}</option>`)
      .join('');

    shell.querySelectorAll('[data-simple-area]').forEach(button => {
      button.addEventListener('click', () => openDestination(button.dataset.simpleArea, state.moduleId));
    });
    $('#simpleTopicSelect').addEventListener('change', event => {
      openDestination(state.area, event.target.value);
    });
    $('#simpleViewSelect').addEventListener('change', event => openUnderlyingView(event.target.value));
    $('#simpleFilterToggle').addEventListener('click', () => {
      state.filtersOpen = !state.filtersOpen;
      syncFilters();
    });
  }

  function createContextControls() {
    const controls = document.createElement('aside');
    controls.id = 'simpleContextControls';
    controls.className = 'simple-context-controls';
    controls.innerHTML = `
      <div id="simpleStageControls" class="simple-context-group" hidden>
        <button type="button" data-stage-step="-1" aria-label="Previous stage">←</button>
        <label class="simple-field"><span>Stage</span><select id="simpleStageSelect"></select></label>
        <button type="button" data-stage-step="1" aria-label="Next stage">→</button>
      </div>
      <div id="simpleConceptControls" class="simple-context-group" hidden>
        <button type="button" data-concept-step="-1" aria-label="Previous concept">←</button>
        <label class="simple-field"><span>Concept</span><select id="simpleConceptSelect"></select></label>
        <button type="button" data-concept-step="1" aria-label="Next concept">→</button>
      </div>
      <div id="simpleSystemControls" class="simple-context-group" hidden>
        <label class="simple-field"><span>System</span><select id="simpleSystemSelect"></select></label>
      </div>
      <div id="simpleQuizControls" class="simple-context-group" hidden>
        <button type="button" data-quiz-step="-1" aria-label="Previous question">←</button>
        <span id="simpleQuizPosition" class="simple-position"></span>
        <button type="button" data-quiz-step="1" aria-label="Next question">→</button>
      </div>
    `;
    document.querySelector('main').prepend(controls);

    $('#simpleStageSelect').addEventListener('change', event => selectStage(Number(event.target.value), true));
    controls.querySelectorAll('[data-stage-step]').forEach(button => {
      button.addEventListener('click', () => stepStage(Number(button.dataset.stageStep)));
    });

    $('#simpleConceptSelect').addEventListener('change', event => clickConcept(Number(event.target.value)));
    controls.querySelectorAll('[data-concept-step]').forEach(button => {
      button.addEventListener('click', () => clickConcept(state.conceptIndex + Number(button.dataset.conceptStep)));
    });

    $('#simpleSystemSelect').addEventListener('change', event => selectSystem(event.target.value));
    controls.querySelectorAll('[data-quiz-step]').forEach(button => {
      button.addEventListener('click', () => selectQuiz(state.quizIndex + Number(button.dataset.quizStep)));
    });
  }

  function createGoTop() {
    const button = document.createElement('button');
    button.id = 'goToTop';
    button.className = 'go-to-top';
    button.type = 'button';
    button.setAttribute('aria-label', 'Go to top');
    button.innerHTML = '<span aria-hidden="true">↑</span><span>Top</span>';
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.append(button);
  }

  function setArea(area) {
    state.area = area;
    document.body.dataset.learningArea = area;
    $('#activeArea').textContent = `${area === 'concepts' ? 'Concepts' : 'Exercises'} · ${topicLabel(state.moduleId)}`;
    if (area === 'concepts') {
      hiddenTrigger('concepts')?.click();
    } else {
      openUnderlyingView(state.view || 'route');
    }
    syncShell();
  }

  async function switchModule(moduleId) {
    const moduleSelect = $('#moduleSelect');
    if (!moduleSelect || moduleSelect.value === moduleId) return;

    const previousTitle = $('#moduleTitle')?.textContent;
    moduleSelect.value = moduleId;
    moduleSelect.dispatchEvent(new Event('change', { bubbles: true }));

    for (let attempt = 0; attempt < 160; attempt += 1) {
      await new Promise(resolve => setTimeout(resolve, 25));
      if ($('#moduleTitle')?.textContent !== previousTitle) return;
    }
  }

  async function openDestination(area, moduleId) {
    state.pendingDestination = { area, moduleId };
    state.moduleId = moduleId;
    state.stage = 1;
    state.system = '';
    state.quizIndex = 0;
    syncShell();

    await switchModule(moduleId);
    if (!state.pendingDestination || state.pendingDestination.moduleId !== moduleId) return;
    state.pendingDestination = null;
    setArea(area);
  }

  function syncFilters() {
    const toolbar = $('#diagnosticToolbar');
    const toggle = $('#simpleFilterToggle');
    const eligible = state.area === 'exercises' && !['interfaces', 'coverage', 'validation'].includes(state.view);
    if (!eligible) state.filtersOpen = false;
    toolbar?.classList.toggle('simple-toolbar-open', eligible && state.filtersOpen);
    toolbar?.classList.toggle('simple-toolbar-closed', !(eligible && state.filtersOpen));
    if (toggle) {
      toggle.hidden = !eligible;
      toggle.setAttribute('aria-expanded', String(eligible && state.filtersOpen));
      toggle.textContent = state.filtersOpen ? 'Hide filters' : 'Filters';
    }
  }

  function syncShell() {
    const shell = $('#simpleLearningNavigation');
    if (!shell) return;
    $('#simpleTopicSelect').value = state.moduleId || $('#moduleSelect')?.value || '';
    $('#simpleViewSelect').value = state.view;
    shell.querySelectorAll('[data-simple-area]').forEach(button => {
      const active = button.dataset.simpleArea === state.area;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    $('.simple-view-field').hidden = state.area !== 'exercises';
    $('#simpleStageControls').hidden = !(state.area === 'exercises' && state.view === 'route');
    $('#simpleConceptControls').hidden = state.area !== 'concepts';
    $('#simpleSystemControls').hidden = !(state.area === 'exercises' && state.view === 'systems');
    $('#simpleQuizControls').hidden = !(state.area === 'exercises' && state.view === 'validation');
    $('#activeArea').textContent = `${state.area === 'concepts' ? 'Concepts' : 'Exercises'} · ${topicLabel(state.moduleId)}`;
    syncFilters();
  }

  function availableStageSections() {
    const all = $$('#routeStages .day-section');
    const available = all.filter(section => !section.classList.contains('concept-practice-hidden'));
    return available.length ? available : all;
  }

  function rewritePracticeBanner() {
    const message = $('#conceptPracticeBanner span');
    if (!message) return;
    message.textContent = message.textContent.replace(
      /from the existing Functional Safety practice bank/i,
      `from the existing ${topicLabel(state.moduleId)} exercise bank`
    );
  }

  function queueRouteSync() {
    if (state.routeSyncQueued) return;
    state.routeSyncQueued = true;
    requestAnimationFrame(() => {
      state.routeSyncQueued = false;
      syncRouteStages();
    });
  }

  function syncRouteStages() {
    const sections = availableStageSections();
    if (!sections.length) return;
    const validDays = sections.map(section => Number(section.id.replace('stage-', '')));
    if (!validDays.includes(state.stage)) state.stage = validDays[0];

    $('#simpleStageSelect').innerHTML = sections.map(section => {
      const day = Number(section.id.replace('stage-', ''));
      const title = section.querySelector('.day-head h2')?.textContent || `Stage ${day}`;
      return `<option value="${day}">Stage ${day} · ${escapeMarkup(title)}</option>`;
    }).join('');
    $('#simpleStageSelect').value = String(state.stage);

    $$('#routeStages .day-section').forEach(section => {
      const day = Number(section.id.replace('stage-', ''));
      section.classList.toggle('simple-stage-hidden', day !== state.stage);
    });
    $('#routeNav')?.classList.add('simple-original-nav-hidden');
  }

  function selectStage(day, scroll = false) {
    state.stage = day;
    syncRouteStages();
    if (scroll) document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function stepStage(delta) {
    const stages = availableStageSections().map(section => Number(section.id.replace('stage-', '')));
    const index = Math.max(0, stages.indexOf(state.stage));
    const next = Math.min(stages.length - 1, Math.max(0, index + delta));
    selectStage(stages[next], true);
  }

  function queueConceptSync() {
    if (state.conceptSyncQueued) return;
    state.conceptSyncQueued = true;
    requestAnimationFrame(() => {
      state.conceptSyncQueued = false;
      syncConceptSelector();
    });
  }

  function conceptButtons() {
    return $$('#conceptNav [data-concept-id]');
  }

  function syncConceptSelector() {
    const buttons = conceptButtons();
    if (!buttons.length) {
      $('#simpleConceptControls').hidden = true;
      return;
    }
    const activeIndex = Math.max(0, buttons.findIndex(button => button.classList.contains('active')));
    state.conceptIndex = activeIndex;
    $('#simpleConceptSelect').innerHTML = buttons.map((button, index) => {
      const title = button.querySelector('strong')?.textContent || button.dataset.conceptId;
      const meta = button.querySelector('small')?.textContent || '';
      return `<option value="${index}">${escapeMarkup(title)}${meta ? ` · ${escapeMarkup(meta)}` : ''}</option>`;
    }).join('');
    $('#simpleConceptSelect').value = String(activeIndex);
    $('#conceptNav')?.classList.add('simple-original-nav-hidden');
    if (state.area === 'concepts') $('#simpleConceptControls').hidden = false;
  }

  function clickConcept(index) {
    const buttons = conceptButtons();
    if (!buttons.length) return;
    const bounded = Math.min(buttons.length - 1, Math.max(0, index));
    state.conceptIndex = bounded;
    buttons[bounded].click();
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function queueSystemSync() {
    requestAnimationFrame(syncSystemSelector);
  }

  function systemCards() {
    return $$('#systemCards .track-card');
  }

  function syncSystemSelector() {
    const cards = systemCards();
    if (!cards.length) return;
    $('#systemCards')?.classList.add('simple-original-nav-hidden');
    $('#simpleSystemSelect').innerHTML = cards.map(card => {
      const name = card.dataset.system;
      return `<option value="${escapeMarkup(name)}">${escapeMarkup(name)}</option>`;
    }).join('');
    if (!cards.some(card => card.dataset.system === state.system)) state.system = cards[0].dataset.system;
    $('#simpleSystemSelect').value = state.system;
    selectSystem(state.system, false);
  }

  function selectSystem(name, scroll = true) {
    state.system = name;
    const card = systemCards().find(item => item.dataset.system === name);
    if (card) card.click();
    if (scroll) document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function queueQuizSync() {
    requestAnimationFrame(syncQuizPager);
  }

  function quizCards() {
    return $$('#knowledgeCheck .quiz-card');
  }

  function syncQuizPager() {
    const cards = quizCards();
    if (!cards.length) return;
    state.quizIndex = Math.min(cards.length - 1, Math.max(0, state.quizIndex));
    cards.forEach((card, index) => card.classList.toggle('simple-quiz-hidden', index !== state.quizIndex));
    $('#simpleQuizPosition').textContent = `Question ${state.quizIndex + 1} of ${cards.length}`;
  }

  function selectQuiz(index) {
    state.quizIndex = index;
    syncQuizPager();
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bindObservers() {
    new MutationObserver(() => { queueRouteSync(); rewritePracticeBanner(); }).observe($('#view-route'), { childList: true, subtree: true });
    new MutationObserver(queueConceptSync).observe($('#conceptNav'), { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    new MutationObserver(queueSystemSync).observe($('#systemCards'), { childList: true, subtree: true });
    new MutationObserver(queueQuizSync).observe($('#knowledgeCheck'), { childList: true, subtree: true });

    document.addEventListener('click', event => {
      const viewTrigger = event.target.closest('[data-view]');
      if (viewTrigger && ['route', 'systems', 'interfaces', 'coverage', 'validation'].includes(viewTrigger.dataset.view)) {
        state.area = 'exercises';
        state.view = viewTrigger.dataset.view;
        requestAnimationFrame(syncShell);
      }
      if (event.target.closest('[data-practice-concept], [data-clear-concept-practice]')) {
        setTimeout(queueRouteSync, 50);
      }
    }, true);

    $('#moduleSelect').addEventListener('change', event => {
      state.moduleId = event.target.value;
      requestAnimationFrame(syncShell);
    });
  }

  async function waitForCockpit() {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      if (
        $('#moduleSelect')?.options.length &&
        $('#routeStages') &&
        $('#conceptNav') &&
        $('#knowledgeCheck')
      ) return;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw new Error('AutoLeaP could not initialize the simplified learning navigation');
  }

  async function initialize() {
    state.manifest = await fetch('data/topics.json', { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error('Cannot load learning topics');
      return response.json();
    });
    await waitForCockpit();

    state.moduleId = initialHash.get('module') || initialHash.get('topic') || $('#moduleSelect').value || state.manifest.topics[0].id;
    state.view = initialHash.get('view') && initialHash.get('view') !== 'concepts' ? initialHash.get('view') : 'route';
    state.area = initialHash.get('view') === 'concepts' || !initialHadHash ? 'concepts' : 'exercises';

    createShell();
    createContextControls();
    createGoTop();
    bindObservers();
    syncShell();

    await openDestination(state.area, state.moduleId);
    queueRouteSync();
    queueConceptSync();
    queueSystemSync();
    queueQuizSync();
  }

  initialize().catch(error => {
    console.error(error);
    const activeArea = $('#activeArea');
    if (activeArea) activeArea.textContent = 'Simplified navigation unavailable';
  });
})();
