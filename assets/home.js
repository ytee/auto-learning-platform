(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
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

  const state = {
    manifest: null,
    catalog: null,
    questions: new Map(),
    targets: new Map()
  };

  function hashParameters() {
    return new URLSearchParams(location.hash.replace(/^#/, ''));
  }

  function isHomeRequest() {
    return !location.hash || hashParameters().get('view') === 'home';
  }

  async function waitFor(selector, predicate = element => Boolean(element), attempts = 200) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const element = $(selector);
      if (element && predicate(element)) return element;
      await wait(25);
    }
    throw new Error(`Timed out waiting for ${selector}`);
  }

  function readRetainedState(moduleId) {
    const keys = [`autoNotesNvM:${moduleId}`, `autoPrepState:${moduleId}`];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        return {
          done: parsed.done || {},
          ratings: parsed.ratings || {},
          bookmarks: parsed.bookmarks || {}
        };
      } catch (error) {
        console.warn(`Cannot read retained state for ${moduleId}`, error);
      }
    }
    return { done: {}, ratings: {}, bookmarks: {} };
  }

  async function loadQuestions(topic) {
    if (state.questions.has(topic.id)) return state.questions.get(topic.id);

    let questions;
    if (topic.legacyGlobal) {
      questions = globalThis[topic.legacyGlobal]?.questions || [];
    } else {
      const batches = await Promise.all((topic.questionFiles || []).map(async file => {
        const response = await fetch(file, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Cannot load ${file}`);
        return response.json();
      }));
      questions = batches.flat();
    }

    state.questions.set(topic.id, questions);
    return questions;
  }

  function moduleProgress(topic, questions) {
    const retained = readRetainedState(topic.id);
    const completed = questions.filter(question => retained.done[question.id]).length;
    const total = questions.length;
    const stages = [...new Set(questions.map(question => question.day))].sort((left, right) => left - right);
    const nextStage = stages.find(stage =>
      questions.some(question => question.day === stage && !retained.done[question.id])
    ) || stages.at(-1) || 1;
    const stageQuestions = questions.filter(question => question.day === nextStage);
    const stageCompleted = stageQuestions.filter(question => retained.done[question.id]).length;

    return {
      topic,
      retained,
      completed,
      total,
      percentage: total ? Math.round((100 * completed) / total) : 0,
      nextStage,
      stageCompleted,
      stageTotal: stageQuestions.length
    };
  }

  function targetKey(target) {
    const key = `target-${state.targets.size + 1}`;
    state.targets.set(key, target);
    return key;
  }

  function targetButton(target, label, className = 'home-card-action') {
    return `<button type="button" class="${className}" data-home-target="${targetKey(target)}">${escapeMarkup(label)} <span aria-hidden="true">→</span></button>`;
  }

  async function renderContinueLearning() {
    const progressModels = await Promise.all(state.manifest.topics.map(async topic =>
      moduleProgress(topic, await loadQuestions(topic))
    ));

    const ranked = [...progressModels].sort((left, right) => {
      if (right.completed !== left.completed) return right.completed - left.completed;
      return state.manifest.topics.indexOf(left.topic) - state.manifest.topics.indexOf(right.topic);
    });
    const selected = ranked[0];
    const hasProgress = selected.completed > 0;
    const actionLabel = hasProgress ? 'Continue stage' : 'Start the route';

    $('#continueLearning').innerHTML = `
      <article class="continue-card">
        <div class="continue-copy">
          <p class="home-kicker">${hasProgress ? 'CONTINUE LEARNING' : 'RECOMMENDED START'}</p>
          <h2>${escapeMarkup(selected.topic.title)}</h2>
          <p>${escapeMarkup(selected.topic.description)}</p>
          <div class="home-meta-row">
            <span>Stage ${selected.nextStage} of 10</span>
            <span>${selected.completed} of ${selected.total} complete</span>
            <span>${selected.percentage}% progress</span>
          </div>
          <div class="continue-actions">
            ${targetButton({ module: selected.topic.id, area: 'exercises', view: 'route', stage: selected.nextStage }, actionLabel, 'home-primary-action')}
            ${selected.topic.concepts
              ? targetButton({ module: selected.topic.id, area: 'concepts' }, 'Open concepts', 'home-secondary-action')
              : ''}
          </div>
        </div>
        <div class="continue-progress" aria-label="${selected.percentage}% complete">
          <div class="progress-ring" style="--progress:${selected.percentage}">
            <strong>${selected.percentage}%</strong>
            <span>complete</span>
          </div>
          <p>Next: Stage ${selected.nextStage}</p>
          <small>${selected.stageCompleted} of ${selected.stageTotal} checkpoints complete in this stage</small>
        </div>
      </article>`;
  }

  function renderLearningPaths() {
    $('#learningPathCards').innerHTML = state.manifest.topics.map((topic, index) => {
      const primaryTarget = topic.concepts
        ? { module: topic.id, area: 'concepts' }
        : { module: topic.id, area: 'exercises', view: 'route', stage: 1 };
      const primaryLabel = topic.concepts ? 'Explore concepts' : 'Open learning route';

      return `
        <article class="learning-path-card" data-path-index="${index + 1}">
          <div class="path-number">${String(index + 1).padStart(2, '0')}</div>
          <p class="home-kicker">LEARNING PATH</p>
          <h3>${escapeMarkup(topic.title)}</h3>
          <p class="path-subtitle">${escapeMarkup(topic.subtitle)}</p>
          <p>${escapeMarkup(topic.description)}</p>
          <div class="path-actions">
            ${targetButton(primaryTarget, primaryLabel)}
            ${targetButton({ module: topic.id, area: 'exercises', view: 'route', stage: 1 }, 'Practice', 'home-text-action')}
          </div>
        </article>`;
    }).join('');
  }

  function renderShelf(containerId, items, label) {
    const container = $(`#${containerId}`);
    container.innerHTML = items.map((item, index) => `
      <article class="discovery-card ${index === 0 ? 'featured' : ''}">
        <div>
          <p class="home-kicker">${escapeMarkup(label)}</p>
          <h3>${escapeMarkup(item.title)}</h3>
          <p>${escapeMarkup(item.summary)}</p>
        </div>
        <footer>
          <span>${escapeMarkup(item.meta)}</span>
          ${targetButton(item, 'Open')}
        </footer>
      </article>`).join('');
  }

  function renderHome() {
    const hero = state.catalog.hero;
    $('#homeEyebrow').textContent = hero.eyebrow;
    $('#homeTitle').textContent = hero.title;
    $('#homeSummary').textContent = hero.summary;

    renderLearningPaths();
    renderShelf('conceptCards', state.catalog.concepts, 'CONCEPT');
    renderShelf('caseStudyCards', state.catalog.caseStudies, 'CASE STUDY');
    renderShelf('scenarioCards', state.catalog.scenarios, 'ENGINEERING SCENARIO');
    renderShelf('playbookCards', state.catalog.playbooks, 'PLAYBOOK');
    renderShelf('roadmapCards', state.catalog.roadmaps, 'ROADMAP');

    $('#homePrimaryAction').textContent = hero.primaryAction;
    $('#homeSecondaryAction').textContent = hero.secondaryAction;
  }

  function showHome({ updateHash = true, section = null } = {}) {
    document.body.dataset.surface = 'home';
    $$('.view').forEach(view => view.classList.remove('active'));
    $('#view-home').classList.add('active');
    $('.hero')?.setAttribute('hidden', '');
    $('#simpleLearningNavigation')?.setAttribute('hidden', '');
    $('#simpleContextControls')?.setAttribute('hidden', '');
    $('#diagnosticToolbar')?.classList.add('hidden');
    $('#workspaceFooter')?.setAttribute('hidden', '');

    if (updateHash) history.replaceState(null, '', '#view=home');

    requestAnimationFrame(() => {
      const target = section ? document.getElementById(section) : document.body;
      target?.scrollIntoView({ behavior: section ? 'smooth' : 'auto', block: 'start' });
    });
  }

  function showWorkspace() {
    document.body.dataset.surface = 'workspace';
    $('.hero')?.removeAttribute('hidden');
    $('#simpleLearningNavigation')?.removeAttribute('hidden');
    $('#simpleContextControls')?.removeAttribute('hidden');
    $('#workspaceFooter')?.removeAttribute('hidden');
    $('#view-home')?.classList.remove('active');
  }

  async function openTarget(target) {
    showWorkspace();
    const topicSelect = await waitFor('#simpleTopicSelect');
    if (topicSelect.value !== target.module) {
      topicSelect.value = target.module;
      topicSelect.dispatchEvent(new Event('change', { bubbles: true }));
      await waitFor('#moduleSelect', element => element.value === target.module);
      await wait(80);
    }

    const areaButton = await waitFor(`[data-simple-area="${target.area}"]`);
    areaButton.click();
    await wait(80);

    if (target.area === 'exercises' && target.view) {
      const viewSelect = await waitFor('#simpleViewSelect');
      viewSelect.value = target.view;
      viewSelect.dispatchEvent(new Event('change', { bubbles: true }));
      await wait(80);
    }

    if (target.stage) {
      const stageSelect = await waitFor('#simpleStageSelect', element =>
        [...element.options].some(option => Number(option.value) === Number(target.stage))
      );
      stageSelect.value = String(target.stage);
      stageSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (target.concept) {
      const conceptButton = await waitFor(
        `#conceptNav [data-concept-id="${target.concept}"]`,
        Boolean,
        240
      );
      conceptButton.click();
    }

    const parameters = new URLSearchParams();
    parameters.set('module', target.module);
    parameters.set('view', target.area === 'concepts' ? 'concepts' : (target.view || 'route'));
    if (target.stage) parameters.set('stage', String(target.stage));
    if (target.concept) parameters.set('concept', target.concept);
    history.replaceState(null, '', `#${parameters.toString()}`);
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bindHomeEvents() {
    document.addEventListener('click', event => {
      const targetButtonElement = event.target.closest('[data-home-target]');
      if (targetButtonElement) {
        const target = state.targets.get(targetButtonElement.dataset.homeTarget);
        if (target) openTarget(target).catch(console.error);
        return;
      }

      const homeButton = event.target.closest('[data-open-home]');
      if (homeButton) {
        showHome();
        return;
      }

      const sectionButton = event.target.closest('[data-home-section]');
      if (sectionButton) {
        showHome({ section: sectionButton.dataset.homeSection });
      }
    });

    $('#homePrimaryAction').addEventListener('click', () => {
      $('#continueLearning [data-home-target]')?.click();
    });
    $('#homeSecondaryAction').addEventListener('click', () => {
      showHome({ section: 'learning-paths' });
    });

    window.addEventListener('popstate', () => {
      if (isHomeRequest()) showHome({ updateHash: false });
      else showWorkspace();
    });
  }

  async function initializeHome() {
    [state.manifest, state.catalog] = await Promise.all([
      fetch('data/topics.json', { cache: 'no-store' }).then(response => {
        if (!response.ok) throw new Error('Cannot load learning topics');
        return response.json();
      }),
      fetch('data/home.json', { cache: 'no-store' }).then(response => {
        if (!response.ok) throw new Error('Cannot load home catalog');
        return response.json();
      })
    ]);

    renderHome();
    bindHomeEvents();
    await waitFor('#simpleLearningNavigation');
    await renderContinueLearning();

    if (isHomeRequest()) showHome({ updateHash: !location.hash });
    else showWorkspace();
  }

  initializeHome().catch(error => {
    console.error(error);
    const status = $('#homeStatus');
    if (status) status.textContent = 'The discovery home page could not be loaded. The learning workspace remains available.';
    showWorkspace();
  });
})();
