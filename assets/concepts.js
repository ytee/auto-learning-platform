(() => {
  const initialHash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const requestedView = initialHash.get('view');
  const requestedConceptId = initialHash.get('concept');

  const state = {
    manifest: null,
    model: null,
    moduleId: null,
    selectedConceptId: null,
    practice: null,
    loadToken: 0
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

  const listMarkup = items => `<ul>${items.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ul>`;
  const paragraphMarkup = paragraphs => paragraphs
    .map(paragraph => `<p>${escapeMarkup(paragraph)}</p>`)
    .join('');

  function currentModuleId() {
    return $('#moduleSelect')?.value || initialHash.get('module') || initialHash.get('topic') || 'safety';
  }

  function moduleMetadata(moduleId) {
    return state.manifest?.topics?.find(module => module.id === moduleId) || null;
  }

  function setConceptUrl(conceptId, view = 'concepts') {
    const parameters = new URLSearchParams();
    parameters.set('module', currentModuleId());
    parameters.set('view', view);
    if (conceptId) parameters.set('concept', conceptId);
    history.replaceState(null, '', `#${parameters.toString()}`);
  }

  function setStatus(message, kind = '') {
    const status = $('#conceptStatus');
    status.textContent = message;
    status.className = `concept-status ${kind}`.trim();
  }

  function renderUnavailable(module) {
    state.model = null;
    state.selectedConceptId = null;
    $('#conceptCollectionTitle').textContent = 'Concepts';
    $('#conceptBaseline').textContent = `${module?.title || 'This module'} does not yet have a published concept collection.`;
    $('#conceptNav').innerHTML = '';
    $('#conceptDetail').innerHTML = `
      <article class="concept-empty">
        <p class="eyebrow">CONCEPT COLLECTION</p>
        <h3>Concept-first learning is not available here yet</h3>
        <p>The existing learning route, checkpoints and validation material remain available.</p>
        <button type="button" data-open-route>Open the 10-Day Route</button>
      </article>`;
    $('[data-open-route]').onclick = () => $('[data-view="route"]').click();
    setStatus('');
  }

  function conceptById(conceptId) {
    return state.model?.concepts?.find(concept => concept.id === conceptId) || null;
  }

  function renderConceptNavigation() {
    $('#conceptNav').innerHTML = state.model.concepts.map(concept => `
      <button
        type="button"
        class="concept-nav-item ${concept.id === state.selectedConceptId ? 'active' : ''}"
        data-concept-id="${escapeMarkup(concept.id)}"
        aria-current="${concept.id === state.selectedConceptId ? 'true' : 'false'}">
        <span class="concept-order">${String(concept.order).padStart(2, '0')}</span>
        <span>
          <strong>${escapeMarkup(concept.title)}</strong>
          <small>${escapeMarkup(concept.difficulty)} · Stage ${concept.stage}</small>
        </span>
      </button>`).join('');

    $$('#conceptNav [data-concept-id]').forEach(button => {
      button.onclick = () => selectConcept(button.dataset.conceptId);
    });
  }

  function renderRelatedConcepts(concept) {
    return concept.relatedConcepts.map(relatedId => {
      const related = conceptById(relatedId);
      return related
        ? `<button type="button" class="concept-link" data-related-concept="${escapeMarkup(related.id)}">${escapeMarkup(related.title)}</button>`
        : '';
    }).join('');
  }

  function renderConceptDetail(concept) {
    const standardParts = concept.standard.parts.map(part => `Part ${part}`).join(' · ');
    const clauseRefs = concept.standard.clauseRefs.join(' · ');
    const exampleParagraphs = String(concept.automotiveExample).split(/\n\s*\n/).filter(Boolean);

    $('#conceptDetail').innerHTML = `
      <article class="concept-sheet">
        <header class="concept-sheet-head">
          <div>
            <p class="eyebrow">LEARN</p>
            <h2>${escapeMarkup(concept.title)}</h2>
            <p class="concept-summary">${escapeMarkup(concept.summary)}</p>
          </div>
          <div class="concept-tags" aria-label="Concept metadata">
            <span>${escapeMarkup(concept.difficulty)}</span>
            <span>Stage ${concept.stage}</span>
            <span>${escapeMarkup(standardParts)}</span>
          </div>
        </header>

        <section class="concept-section">
          <h3>Learning objectives</h3>
          ${listMarkup(concept.learningObjectives)}
        </section>

        <section class="concept-section">
          <h3>Concept explanation</h3>
          ${paragraphMarkup(concept.explanation)}
        </section>

        <section class="concept-section concept-emphasis">
          <h3>Why it matters</h3>
          ${paragraphMarkup(concept.whyItMatters)}
        </section>

        <section class="concept-section">
          <h3>Engineering flow</h3>
          <div class="concept-flow">
            <article><h4>Inputs</h4>${listMarkup(concept.inputs)}</article>
            <article><h4>Activities</h4>${listMarkup(concept.activities)}</article>
            <article><h4>Outputs and evidence</h4>${listMarkup(concept.outputs)}</article>
          </div>
        </section>

        <section class="concept-section concept-example">
          <p class="eyebrow">AUTOMOTIVE EXAMPLE</p>
          ${paragraphMarkup(exampleParagraphs)}
        </section>

        <section class="concept-section concept-warning">
          <h3>Common mistakes</h3>
          ${listMarkup(concept.commonMistakes)}
        </section>

        <section class="concept-section">
          <h3>Related concepts</h3>
          <div class="concept-links">${renderRelatedConcepts(concept)}</div>
        </section>

        <section class="concept-section concept-references">
          <h3>Reference map</h3>
          <p><strong>${escapeMarkup(concept.standard.family)} ${escapeMarkup(concept.standard.edition)}</strong> · ${escapeMarkup(standardParts)}</p>
          <p>${escapeMarkup(clauseRefs)}</p>
          ${listMarkup(concept.references)}
          <p class="notice">AutoLeaP provides original explanatory learning material and reference pointers; licensed standards remain authoritative.</p>
        </section>

        <footer class="concept-actions">
          <button type="button" class="practice-concept" data-practice-concept="${escapeMarkup(concept.id)}">
            Practice this concept (${concept.linkedQuestions.length} checkpoints)
          </button>
          <button type="button" class="secondary" data-open-route>Open full route</button>
        </footer>
      </article>`;

    $$('[data-related-concept]').forEach(button => {
      button.onclick = () => selectConcept(button.dataset.relatedConcept);
    });
    $('[data-practice-concept]').onclick = () => startConceptPractice(concept);
    $('[data-open-route]').onclick = () => {
      clearConceptPractice();
      $('[data-view="route"]').click();
    };
  }

  function selectConcept(conceptId, updateUrl = true) {
    const concept = conceptById(conceptId) || state.model?.concepts?.[0];
    if (!concept) return;

    state.selectedConceptId = concept.id;
    renderConceptNavigation();
    renderConceptDetail(concept);
    setStatus('');
    if (updateUrl) setConceptUrl(concept.id);
  }

  function renderConceptModel(model, preferredConceptId) {
    state.model = model;
    $('#conceptCollectionTitle').textContent = model.collection.title;
    $('#conceptBaseline').textContent =
      `${model.concepts.length} concepts · ${model.standardBaseline.family} ${model.standardBaseline.edition} · ${model.standardBaseline.status}`;
    selectConcept(preferredConceptId || model.concepts[0]?.id, false);
  }

  async function loadConcepts(moduleId, preferredConceptId = null) {
    const token = ++state.loadToken;
    const module = moduleMetadata(moduleId);
    state.moduleId = moduleId;
    setStatus('Loading concept collection…', 'loading');
    $('#conceptNav').innerHTML = '';
    $('#conceptDetail').innerHTML = '';

    if (!module?.concepts) {
      renderUnavailable(module);
      return;
    }

    try {
      const response = await fetch(module.concepts, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Cannot load ${module.concepts}`);
      const model = await response.json();
      if (token !== state.loadToken) return;
      if (model.module !== moduleId || !Array.isArray(model.concepts) || !model.concepts.length) {
        throw new Error('Concept collection does not match the selected module');
      }
      renderConceptModel(model, preferredConceptId);
    } catch (error) {
      if (token !== state.loadToken) return;
      console.error(error);
      $('#conceptCollectionTitle').textContent = 'Concepts unavailable';
      $('#conceptBaseline').textContent = '';
      $('#conceptDetail').innerHTML = `
        <article class="concept-empty error">
          <h3>The concept collection could not be loaded</h3>
          <p>${escapeMarkup(error.message)}</p>
          <p>The existing learning route and checkpoints are unaffected.</p>
        </article>`;
      setStatus('Concept loading failed.', 'error');
    }
  }

  function resetCheckpointFilters() {
    const fields = ['search', 'tierFilter', 'systemFilter', 'statusFilter'];
    fields.forEach(id => {
      const field = $(`#${id}`);
      if (field) field.value = '';
    });
    $('#search')?.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function practiceBanner() {
    let banner = $('#conceptPracticeBanner');
    if (banner) return banner;

    banner = document.createElement('aside');
    banner.id = 'conceptPracticeBanner';
    banner.className = 'concept-practice-banner';
    $('#view-route').prepend(banner);
    return banner;
  }

  function applyConceptPractice() {
    if (!state.practice || currentModuleId() !== state.practice.moduleId) return;

    const routeStages = $('#routeStages');
    if (!routeStages) return;

    const linkedIds = state.practice.questionIds;
    let matched = 0;
    const visibleDays = new Set();

    routeStages.querySelectorAll('.question-card').forEach(card => {
      const visible = linkedIds.has(card.dataset.id);
      card.classList.toggle('concept-practice-hidden', !visible);
      if (visible) {
        matched += 1;
        const daySection = card.closest('.day-section');
        if (daySection?.id) visibleDays.add(daySection.id.replace('stage-', ''));
      }
    });

    routeStages.querySelectorAll('.day-section').forEach(section => {
      section.classList.toggle(
        'concept-practice-hidden',
        !visibleDays.has(section.id.replace('stage-', ''))
      );
    });

    $$('#routeNav [data-day]').forEach(button => {
      button.classList.toggle('concept-practice-hidden', !visibleDays.has(button.dataset.day));
    });

    const banner = practiceBanner();
    banner.innerHTML = `
      <div>
        <p class="eyebrow">CONCEPT PRACTICE</p>
        <strong>${escapeMarkup(state.practice.title)}</strong>
        <span>${matched} linked checkpoints from the existing Functional Safety practice bank</span>
      </div>
      <div class="concept-practice-actions">
        <button type="button" data-return-concept>Return to concept</button>
        <button type="button" class="secondary" data-clear-concept-practice>Show all checkpoints</button>
      </div>`;

    banner.querySelector('[data-return-concept]').onclick = () => {
      $('[data-view="concepts"]').click();
      selectConcept(state.practice.conceptId);
    };
    banner.querySelector('[data-clear-concept-practice]').onclick = clearConceptPractice;
  }

  function clearConceptPractice() {
    state.practice = null;
    $('#conceptPracticeBanner')?.remove();
    $$('.concept-practice-hidden').forEach(element => element.classList.remove('concept-practice-hidden'));
  }

  function startConceptPractice(concept) {
    clearConceptPractice();
    state.practice = {
      moduleId: currentModuleId(),
      conceptId: concept.id,
      title: concept.title,
      questionIds: new Set(concept.linkedQuestions)
    };

    resetCheckpointFilters();
    $('[data-view="route"]').click();
    setConceptUrl(concept.id, 'route');
    requestAnimationFrame(applyConceptPractice);
  }

  function bindCockpitEvents() {
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const viewName = tab.dataset.view;
        $('#diagnosticToolbar')?.classList.toggle(
          'hidden',
          viewName === 'modules' || viewName === 'concepts'
        );

        if (viewName === 'concepts') {
          const moduleId = currentModuleId();
          if (state.moduleId !== moduleId || !state.model) {
            loadConcepts(moduleId, state.selectedConceptId);
          } else if (state.selectedConceptId) {
            setConceptUrl(state.selectedConceptId);
          }
        }
      });
    });

    $('#moduleSelect').addEventListener('change', event => {
      clearConceptPractice();
      state.selectedConceptId = null;
      loadConcepts(event.target.value);
    });

    const routeStages = $('#routeStages');
    if (routeStages) {
      new MutationObserver(() => {
        if (state.practice) applyConceptPractice();
      }).observe(routeStages, { childList: true, subtree: true });
    }
  }

  async function waitForCockpit() {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      if ($('#moduleSelect')?.options.length) return;
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw new Error('AutoLeaP cockpit did not initialize');
  }

  async function initializeConcepts() {
    state.manifest = await fetch('data/topics.json', { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error('Cannot load vehicle learning manifest for concepts');
      return response.json();
    });

    bindCockpitEvents();
    await waitForCockpit();

    const moduleId = currentModuleId();
    await loadConcepts(moduleId, requestedConceptId);

    if (requestedView === 'concepts') {
      $('[data-view="concepts"]').click();
      if (requestedConceptId) selectConcept(requestedConceptId, false);
    }
  }

  initializeConcepts().catch(error => {
    console.error(error);
    setStatus(error.message, 'error');
  });
})();
