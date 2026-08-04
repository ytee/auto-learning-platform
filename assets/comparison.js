(() => {
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

  const state = {
    models: new Map(),
    activeId: null
  };

  function comparisonRequest() {
    const parameters = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (parameters.get('view') !== 'comparison') return null;
    return parameters.get('comparison') || 'aerospace-vs-automotive-safety';
  }

  async function loadComparison(id) {
    if (state.models.has(id)) return state.models.get(id);
    const response = await fetch(`data/comparisons/${id}.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Cannot load comparison ${id}`);
    const model = await response.json();
    if (model.id !== id) throw new Error(`Comparison identity mismatch for ${id}`);
    state.models.set(id, model);
    return model;
  }

  function listMarkup(items) {
    return `<ul>${items.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ul>`;
  }

  function renderShared(items) {
    return items.map(item => `
      <article class="comparison-card">
        <h3>${escapeMarkup(item.title)}</h3>
        <p>${escapeMarkup(item.summary)}</p>
      </article>`).join('');
  }

  function renderDifferences(items) {
    return items.map(item => `
      <tr>
        <td><strong>${escapeMarkup(item.dimension)}</strong></td>
        <td>${escapeMarkup(item.automotive)}</td>
        <td>${escapeMarkup(item.aerospace)}</td>
        <td>${escapeMarkup(item.practicalEffect)}</td>
      </tr>`).join('');
  }

  function renderMappings(items) {
    return items.map(item => `
      <tr>
        <td><strong>${escapeMarkup(item.automotive)}</strong></td>
        <td><strong>${escapeMarkup(item.aerospace)}</strong></td>
        <td class="mapping-note">${escapeMarkup(item.note)}</td>
      </tr>`).join('');
  }

  function renderDomainExample(label, item) {
    return `
      <article class="domain-example">
        <p class="home-kicker">${escapeMarkup(label)}</p>
        <h3>${escapeMarkup(item.title)}</h3>
        <dl>
          <dt>Hazard or failure context</dt>
          <dd>${escapeMarkup(item.hazardContext)}</dd>
          <dt>Assessment route</dt>
          <dd>${escapeMarkup(item.assessment)}</dd>
          <dt>Assurance focus</dt>
          <dd>${escapeMarkup(item.assuranceFocus)}</dd>
        </dl>
      </article>`;
  }

  function renderReferences(items) {
    return items.map(item => `
      <li class="reference-card">
        <a href="${escapeMarkup(item.url)}" target="_blank" rel="noopener noreferrer">${escapeMarkup(item.title)}</a>
        <strong> · ${escapeMarkup(item.organization)}</strong>
        <p>${escapeMarkup(item.note)}</p>
      </li>`).join('');
  }

  function renderComparison(model) {
    $('#comparisonContent').innerHTML = `
      <div class="comparison-toolbar">
        <button type="button" class="secondary" data-open-home>← Back to home</button>
        <button type="button" class="secondary" data-comparison-top>Go to top</button>
      </div>

      <header class="comparison-hero">
        <div>
          <p class="home-kicker">${escapeMarkup(model.eyebrow)}</p>
          <h1>${escapeMarkup(model.title)}</h1>
          <p class="comparison-summary">${escapeMarkup(model.summary)}</p>
        </div>
        <aside class="comparison-caution">
          <strong>Do not translate mechanically</strong>
          <span>${escapeMarkup(model.caution)}</span>
        </aside>
      </header>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">WHERE THEY AGREE</p>
          <h2>Shared safety-engineering foundation</h2>
          <p>These practices transfer well across domains, even though the governing objectives and approval context differ.</p>
        </header>
        <div class="comparison-grid">${renderShared(model.sharedPrinciples)}</div>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">WHERE THEY DIFFER</p>
          <h2>Different risk models and assurance systems</h2>
          <p>The same engineering term can carry different scope, evidence and approval consequences.</p>
        </header>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead><tr><th>Dimension</th><th>Automotive</th><th>Aerospace</th><th>Practical effect</th></tr></thead>
            <tbody>${renderDifferences(model.differences)}</tbody>
          </table>
        </div>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">CONCEPTUAL MAPPING</p>
          <h2>Useful analogies, not equivalences</h2>
          <p>Use this map to orient learning. Do not use it to convert compliance claims or assurance levels.</p>
        </header>
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead><tr><th>Automotive concept</th><th>Approximate aerospace counterpart</th><th>Boundary note</th></tr></thead>
            <tbody>${renderMappings(model.mappings)}</tbody>
          </table>
        </div>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">ENGINE-CONTROL EXAMPLE</p>
          <h2>Similar technology, different assurance argument</h2>
        </header>
        <div class="domain-example-grid">
          ${renderDomainExample('AUTOMOTIVE', model.engineControlExample.automotive)}
          ${renderDomainExample('AEROSPACE', model.engineControlExample.aerospace)}
        </div>
        <p class="comparison-lesson"><strong>Core lesson:</strong> ${escapeMarkup(model.engineControlExample.lesson)}</p>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">WHAT TRANSFERS</p>
          <h2>Shared practices and domain-specific knowledge</h2>
        </header>
        <div class="transfer-grid">
          <article class="transfer-column transfer-shared"><h3>Shared engineering practices</h3>${listMarkup(model.transfer.shared)}</article>
          <article class="transfer-column"><h3>Automotive-specific depth</h3>${listMarkup(model.transfer.automotiveSpecific)}</article>
          <article class="transfer-column"><h3>Aerospace-specific depth</h3>${listMarkup(model.transfer.aerospaceSpecific)}</article>
        </div>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">AUTOLEAP LEARNING ROUTE</p>
          <h2>Learn the common foundation, then branch</h2>
        </header>
        <div class="learning-route-grid">
          <article class="learning-route-column learning-route-shared"><h3>Shared Safety Engineering</h3>${listMarkup(model.learningRoute.sharedFoundation)}</article>
          <article class="learning-route-column"><h3>Automotive Functional Safety</h3>${listMarkup(model.learningRoute.automotiveBranch)}</article>
          <article class="learning-route-column"><h3>Aerospace Development Assurance</h3>${listMarkup(model.learningRoute.aerospaceBranch)}</article>
        </div>
      </section>

      <section class="comparison-section">
        <header class="comparison-section-head">
          <p class="home-kicker">AUTHORITATIVE BASELINE</p>
          <h2>Official references</h2>
          <p>AutoLeaP provides original explanatory material. Licensed standards, regulations and approved programme plans remain authoritative.</p>
        </header>
        <ul class="comparison-references">${renderReferences(model.references)}</ul>
        <p class="comparison-verified">Reference status last checked: ${escapeMarkup(model.verifiedOn)}</p>
      </section>`;

    $('[data-comparison-top]')?.addEventListener('click', () => {
      $('#view-comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function applyComparisonSurface() {
    document.body.dataset.surface = 'comparison';
    $$('.view').forEach(view => view.classList.remove('active'));
    $('#view-comparison')?.classList.add('active');
    $('.hero')?.setAttribute('hidden', '');
    $('#simpleLearningNavigation')?.setAttribute('hidden', '');
    $('#simpleContextControls')?.setAttribute('hidden', '');
    $('#diagnosticToolbar')?.classList.add('hidden');
    $('#workspaceFooter')?.setAttribute('hidden', '');
  }

  async function show(id = 'aerospace-vs-automotive-safety', { updateHash = true } = {}) {
    const model = await loadComparison(id);
    state.activeId = id;
    renderComparison(model);
    applyComparisonSurface();
    if (updateHash) history.replaceState(null, '', `#view=comparison&comparison=${encodeURIComponent(id)}`);
    $('#view-comparison')?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-open-comparison]');
      if (!button) return;
      const id = button.dataset.openComparison || 'aerospace-vs-automotive-safety';
      show(id).catch(error => {
        console.error(error);
        $('#comparisonContent').innerHTML = `<p role="alert">${escapeMarkup(error.message)}</p>`;
        applyComparisonSurface();
      });
    });

    window.addEventListener('popstate', () => {
      const requested = comparisonRequest();
      if (requested) show(requested, { updateHash: false }).catch(console.error);
    });
  }

  globalThis.AUTOLEAP_COMPARISON = { show, comparisonRequest };
  bindEvents();

  const requested = comparisonRequest();
  if (requested) show(requested, { updateHash: false }).catch(console.error);
})();
