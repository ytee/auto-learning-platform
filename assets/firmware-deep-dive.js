(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const TOPIC_FILES = Array.from({ length: 6 }, (_, index) => `assets/firmware-deep-dive-topics-${index + 1}.js`);
  const CHECKLIST_KEY = 'autoleap:embedded-interview-checklist:v1';
  const DEFAULT_SECTION = 'overview';
  const state = {
    topics: [],
    questions: [],
    topicId: null,
    questionIndex: 0,
    questionGroup: '',
    checklist: {},
    checklistNotes: {},
    activeSection: DEFAULT_SECTION,
    initialized: false
  };

  const escapeMarkup = value => String(value ?? '').replace(
    /[&<>'"]/g,
    character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]
  );

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${source}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve();
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error(`Cannot load ${source}`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = source;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`Cannot load ${source}`));
      document.body.append(script);
    });
  }

  function requestParameters() {
    return new URLSearchParams(location.hash.replace(/^#/, ''));
  }

  function isDeepDiveRequest() {
    return requestParameters().get('view') === 'firmware-deep-dive';
  }

  function saveChecklist() {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify({
      done: state.checklist,
      notes: state.checklistNotes
    }));
  }

  function loadChecklist() {
    try {
      const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}');
      state.checklist = saved.done || {};
      state.checklistNotes = saved.notes || {};
    } catch (error) {
      console.warn('Cannot restore firmware checklist', error);
      state.checklist = {};
      state.checklistNotes = {};
    }
  }

  function ensureShell() {
    if (!document.querySelector('link[href="assets/firmware-deep-dive.css"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'assets/firmware-deep-dive.css';
      document.head.append(stylesheet);
    }

    if (!$('#view-firmware-deep-dive')) {
      const view = document.createElement('section');
      view.id = 'view-firmware-deep-dive';
      view.className = 'view firmware-deep-dive-view';
      view.setAttribute('aria-label', 'Firmware Deep Dive');
      view.innerHTML = '<div id="firmwareDeepDiveContent"></div>';
      document.querySelector('main')?.append(view);
    }
  }

  function ensureEntryPoints() {
    const navigation = $('.site-navigation');
    if (navigation && !navigation.querySelector('[data-open-firmware-deep-dive]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Firmware Deep Dive';
      button.dataset.openFirmwareDeepDive = 'overview';
      navigation.append(button);
    }

    const playbooks = $('#playbookCards');
    if (playbooks?.children.length && !playbooks.querySelector('[data-fdd-card]')) {
      const card = document.createElement('article');
      card.className = 'discovery-card featured';
      card.dataset.fddCard = 'true';
      card.innerHTML = `
        <div>
          <p class="home-kicker">FIRMWARE DEEP DIVE</p>
          <h3>MCU, MCAL, peripheral and interview mastery</h3>
          <p>Study C and memory semantics, Cortex-M and AURIX, ADC/PWM/DMA, CAN/I2C/SPI/UART, AUTOSAR MCAL, RTOS/Linux and hardware diagnosis through expert questions.</p>
        </div>
        <footer>
          <span>25 deep concepts · 125 expert questions · 40 checklist items</span>
          <button type="button" class="home-card-action" data-open-firmware-deep-dive="overview">Open <span aria-hidden="true">→</span></button>
        </footer>`;
      playbooks.prepend(card);
    }

    const metrics = $$('.map-metrics strong');
    if (metrics.length >= 3) {
      metrics[1].textContent = '525';
      metrics[2].textContent = '68+';
    }
  }

  function applySurface() {
    document.body.dataset.surface = 'firmware-deep-dive';
    $$('.view').forEach(view => view.classList.remove('active'));
    $('#view-firmware-deep-dive')?.classList.add('active');
    $('.hero')?.setAttribute('hidden', '');
    $('#simpleLearningNavigation')?.setAttribute('hidden', '');
    $('#simpleContextControls')?.setAttribute('hidden', '');
    $('#diagnosticToolbar')?.classList.add('hidden');
    $('#workspaceFooter')?.setAttribute('hidden', '');
  }

  const sectionLabels = {
    overview: 'Overview',
    concepts: 'Concepts',
    questions: 'Tough Questions',
    checklist: 'Interview Checklist',
    comparisons: 'Platform Comparisons',
    mcal: 'AUTOSAR MCAL',
    sources: 'Sources'
  };

  function headerMarkup() {
    return `
      <div class="fdd-top">
        <button type="button" class="secondary" data-open-home>← Home</button>
        <button type="button" class="secondary" data-fdd-top>Go to top</button>
      </div>
      <header class="fdd-hero">
        <div>
          <p class="home-kicker">EMBEDDED SYSTEMS & FIRMWARE</p>
          <h1>Firmware Deep Dive</h1>
          <p>Senior-level study of language semantics, MCU and DSP architecture, peripherals, buses, AUTOSAR MCAL configuration, real-time software, Linux integration and laboratory diagnosis.</p>
        </div>
        <div class="fdd-metrics">
          <span><strong>${state.topics.length}</strong>deep concepts</span>
          <span><strong>${state.questions.length}</strong>advanced questions</span>
          <span><strong>${globalThis.AUTOLEAP_FDD_MODEL.checklist.length}</strong>checklist items</span>
        </div>
      </header>
      <nav class="fdd-nav" aria-label="Firmware deep-dive navigation">
        ${Object.entries(sectionLabels).map(([id, label]) => `<button type="button" data-fdd-section="${id}" class="${state.activeSection === id ? 'active' : ''}">${label}</button>`).join('')}
      </nav>`;
  }

  function overviewMarkup() {
    const groups = [...new Set(state.topics.map(topic => topic.group))];
    return `
      <section class="fdd-panel">
        <p class="home-kicker">STUDY MAP</p>
        <h2>From register bit to product architecture</h2>
        <div class="fdd-grid">
          ${groups.map(group => {
            const topics = state.topics.filter(topic => topic.group === group);
            return `<article><h3>${escapeMarkup(group)}</h3><p>${topics.map(topic => escapeMarkup(topic.title)).join(' · ')}</p><button type="button" class="home-card-action" data-fdd-topic="${topics[0].id}">Start group →</button></article>`;
          }).join('')}
        </div>
        <div class="fdd-callout">
          <strong>Depth rule</strong>
          <span>Every answer must connect mechanism, failure mode, architecture decision and target evidence. Naming an API or peripheral register is not sufficient.</span>
        </div>
      </section>`;
  }

  function conceptMarkup() {
    const topic = state.topics.find(item => item.id === state.topicId) || state.topics[0];
    state.topicId = topic.id;
    return `
      <section class="fdd-panel">
        <label class="fdd-field"><span>Deep concept</span><select id="fddConceptSelect">${state.topics.map(item => `<option value="${item.id}" ${item.id === topic.id ? 'selected' : ''}>${escapeMarkup(item.group)} · ${escapeMarkup(item.title)}</option>`).join('')}</select></label>
        <article class="fdd-sheet">
          <p class="home-kicker">${escapeMarkup(topic.group)}</p>
          <h2>${escapeMarkup(topic.title)}</h2>
          <p class="lead">${escapeMarkup(topic.summary)}</p>
          <h3>Core principles</h3><ul>${topic.principles.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ul>
          <h3>Representative failure</h3><p>${escapeMarkup(topic.failure)}</p>
          <h3>Architecture exercise</h3><p>${escapeMarkup(topic.design)}</p>
          <h3>Trade-off to defend</h3><p>${escapeMarkup(topic.tradeoff)}</p>
          <h3>Evidence expected</h3><ul>${topic.evidence.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ul>
          <button type="button" data-fdd-questions-for="${topic.id}">Practise five difficult questions</button>
        </article>
      </section>`;
  }

  function filteredQuestions() {
    return state.questionGroup
      ? state.questions.filter(question => question.group === state.questionGroup)
      : state.questions;
  }

  function questionMarkup() {
    const groups = [...new Set(state.questions.map(question => question.group))];
    const questions = filteredQuestions();
    state.questionIndex = Math.min(Math.max(0, state.questionIndex), Math.max(0, questions.length - 1));
    const question = questions[state.questionIndex];
    if (!question) return '<section class="fdd-panel"><p>No questions match this filter.</p></section>';
    const progress = Math.round(((state.questionIndex + 1) / questions.length) * 100);
    return `
      <section class="fdd-panel">
        <div class="fdd-filters">
          <label class="fdd-field"><span>Question group</span><select id="fddQuestionGroup"><option value="">All groups</option>${groups.map(group => `<option value="${escapeMarkup(group)}" ${group === state.questionGroup ? 'selected' : ''}>${escapeMarkup(group)}</option>`).join('')}</select></label>
          <label class="fdd-field"><span>Find a question</span><select id="fddQuestionSelect">${questions.map((item, index) => `<option value="${index}" ${index === state.questionIndex ? 'selected' : ''}>${index + 1}. ${escapeMarkup(item.kind)} · ${escapeMarkup(item.question.slice(0, 105))}</option>`).join('')}</select></label>
        </div>
        <div class="fdd-pager"><button type="button" data-fdd-question-step="-1">← Previous</button><strong>${state.questionIndex + 1} of ${questions.length}</strong><button type="button" data-fdd-question-step="1">Next →</button></div>
        <div class="fdd-progress"><i style="width:${progress}%"></i></div>
        <article class="fdd-sheet">
          <p class="home-kicker">${escapeMarkup(question.tier)} · ${escapeMarkup(question.kind)} · ${escapeMarkup(question.group)}</p>
          <h2>${escapeMarkup(question.question)}</h2>
          <details><summary>Reveal answer framework</summary><ol>${question.answer.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ol></details>
          <details><summary>Interviewer follow-up probes</summary><ul>${question.probes.map(item => `<li>${escapeMarkup(item)}</li>`).join('')}</ul></details>
        </article>
      </section>`;
  }

  function checklistMarkup() {
    const items = globalThis.AUTOLEAP_FDD_MODEL.checklist;
    const completed = items.filter(([id]) => state.checklist[id]).length;
    return `
      <section class="fdd-panel">
        <p class="home-kicker">EMBEDDED SOFTWARE ENGINEER</p>
        <h2>Interview study checklist</h2>
        <p>${completed} of ${items.length} complete. Completion and notes are stored only in this browser.</p>
        <div class="fdd-progress"><i style="width:${Math.round((completed / items.length) * 100)}%"></i></div>
        <div class="fdd-checks">
          ${items.map(([id, label, topicId]) => `
            <article class="${state.checklist[id] ? 'done' : ''}">
              <label><input type="checkbox" data-fdd-check="${id}" ${state.checklist[id] ? 'checked' : ''}><strong>${escapeMarkup(label)}</strong></label>
              <button type="button" data-fdd-topic="${topicId}">Study</button>
              <textarea data-fdd-note="${id}" placeholder="Your evidence, weak points or interview notes">${escapeMarkup(state.checklistNotes[id] || '')}</textarea>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function tableMarkup(title, headers, rows) {
    return `<h2>${escapeMarkup(title)}</h2><div class="fdd-table"><table><thead><tr>${headers.map(header => `<th>${escapeMarkup(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeMarkup(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function comparisonsMarkup() {
    const model = globalThis.AUTOLEAP_FDD_MODEL;
    return `<section class="fdd-panel">
      ${tableMarkup('MCU platform comparison', ['Platform','Architecture','Strength','Architecture caution','Representative fit'], model.platforms)}
      ${tableMarkup('Firmware architecture comparison', ['Architecture','Determinism','Isolation','Lifecycle characteristic','Representative fit'], model.architectures)}
      ${tableMarkup('Laboratory equipment comparison', ['Equipment','Observes','Best use','Does not prove'], model.tools)}
    </section>`;
  }

  function mcalMarkup() {
    return `<section class="fdd-panel"><p class="home-kicker">AUTOSAR CLASSIC</p>${tableMarkup('MCAL configuration map', ['Module','Primary ownership','Typical configuration failure','Target evidence'], globalThis.AUTOLEAP_FDD_MODEL.mcal)}<div class="fdd-callout"><strong>Configuration review rule</strong><span>Trace every important requirement to a semantic parameter, generated symbol, final register state and measured target behaviour. A successful generator run is not verification.</span></div></section>`;
  }

  function sourcesMarkup() {
    return `<section class="fdd-panel">
      <p class="home-kicker">COVERAGE AND PROVENANCE</p><h2>Sources and boundaries</h2>
      <div class="fdd-grid">
        <article><h3>Role profile</h3><p><a href="https://github.com/ytee/resume-2026/blob/main/jp/jp12-s.md" target="_blank" rel="noopener noreferrer">jp12-s.md</a> supplied the firmware-architecture, MCU/DSP, peripheral, secure-update, RTOS/Linux/bare-metal and technical-leadership coverage.</p></article>
        <article><h3>Interview checklist</h3><p>The checklist supplied directly in the request is reproduced as a retained learning checklist and expanded into deeper technical concepts.</p></article>
        <article><h3>LinkedIn provenance</h3><p><a href="https://www.linkedin.com/posts/prashant-embedded_embeddedsystems-embeddedc-firmware-activity-7487211404383596544-Ukb-" target="_blank" rel="noopener noreferrer">Supplied LinkedIn post</a>. The public page could not be retrieved, so AutoLeaP does not infer or copy unavailable post content.</p></article>
        <article><h3>Technical baseline</h3><p>Use exact Arm core documentation, Infineon AURIX derivative manuals and errata, AUTOSAR release documents, Linux kernel documentation, compiler/ABI manuals and peripheral specifications for implementation decisions.</p></article>
      </div>
      <p class="notice">AutoLeaP is original learning material. Product reference manuals, standards, tool documentation, schematics and approved project requirements remain authoritative.</p>
    </section>`;
  }

  function sectionMarkup() {
    if (state.activeSection === 'concepts') return conceptMarkup();
    if (state.activeSection === 'questions') return questionMarkup();
    if (state.activeSection === 'checklist') return checklistMarkup();
    if (state.activeSection === 'comparisons') return comparisonsMarkup();
    if (state.activeSection === 'mcal') return mcalMarkup();
    if (state.activeSection === 'sources') return sourcesMarkup();
    return overviewMarkup();
  }

  function render() {
    const container = $('#firmwareDeepDiveContent');
    if (!container) return;
    container.innerHTML = `${headerMarkup()}${sectionMarkup()}`;
    bindRenderedEvents();
  }

  function show(section = DEFAULT_SECTION, { updateHash = true } = {}) {
    state.activeSection = Object.hasOwn(sectionLabels, section) ? section : DEFAULT_SECTION;
    applySurface();
    render();
    if (updateHash) history.replaceState(null, '', `#view=firmware-deep-dive&section=${encodeURIComponent(state.activeSection)}`);
    $('#view-firmware-deep-dive')?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  function openTopic(topicId) {
    state.topicId = state.topics.some(topic => topic.id === topicId) ? topicId : state.topics[0].id;
    show('concepts');
  }

  function openQuestions(topicId = null) {
    state.questionGroup = '';
    const index = topicId ? state.questions.findIndex(question => question.topicId === topicId) : 0;
    state.questionIndex = Math.max(0, index);
    show('questions');
  }

  function bindRenderedEvents() {
    $$('[data-fdd-section]').forEach(button => button.addEventListener('click', () => show(button.dataset.fddSection)));
    $('[data-fdd-top]')?.addEventListener('click', () => $('#view-firmware-deep-dive')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $$('[data-fdd-topic]').forEach(button => button.addEventListener('click', () => openTopic(button.dataset.fddTopic)));
    $('[data-fdd-questions-for]')?.addEventListener('click', event => openQuestions(event.currentTarget.dataset.fddQuestionsFor));

    $('#fddConceptSelect')?.addEventListener('change', event => {
      const select = event.currentTarget;
      const value = select.value;
      select.blur();
      requestAnimationFrame(() => {
        state.topicId = value;
        render();
      });
    });
    $('#fddQuestionGroup')?.addEventListener('change', event => {
      state.questionGroup = event.currentTarget.value;
      state.questionIndex = 0;
      render();
    });
    $('#fddQuestionSelect')?.addEventListener('change', event => {
      const select = event.currentTarget;
      const index = Number(select.value);
      select.blur();
      requestAnimationFrame(() => {
        state.questionIndex = index;
        render();
      });
    });
    $$('[data-fdd-question-step]').forEach(button => button.addEventListener('click', () => {
      const questions = filteredQuestions();
      state.questionIndex = Math.min(questions.length - 1, Math.max(0, state.questionIndex + Number(button.dataset.fddQuestionStep)));
      render();
    }));
    $$('[data-fdd-check]').forEach(input => input.addEventListener('change', event => {
      state.checklist[event.currentTarget.dataset.fddCheck] = event.currentTarget.checked;
      saveChecklist();
      render();
    }));
    $$('[data-fdd-note]').forEach(textarea => textarea.addEventListener('change', event => {
      state.checklistNotes[event.currentTarget.dataset.fddNote] = event.currentTarget.value;
      saveChecklist();
    }));
  }

  function bindGlobalEvents() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-open-firmware-deep-dive]');
      if (button) show(button.dataset.openFirmwareDeepDive || DEFAULT_SECTION);
    });
    window.addEventListener('popstate', () => {
      if (isDeepDiveRequest()) show(requestParameters().get('section') || DEFAULT_SECTION, { updateHash: false });
    });
  }

  async function initialize() {
    ensureShell();
    for (const file of TOPIC_FILES) await loadScript(file);
    state.topics = globalThis.AUTOLEAP_FDD_TOPICS || [];
    const model = globalThis.AUTOLEAP_FDD_MODEL;
    if (!model || state.topics.length !== 25) throw new Error(`Firmware Deep Dive expected 25 topics; loaded ${state.topics.length}`);
    state.questions = model.buildQuestions(state.topics);
    state.topicId = state.topics[0].id;
    loadChecklist();
    ensureEntryPoints();
    bindGlobalEvents();
    state.initialized = true;
    if (isDeepDiveRequest()) show(requestParameters().get('section') || DEFAULT_SECTION, { updateHash: false });
  }

  initialize().catch(error => {
    console.error(error);
    ensureShell();
    $('#firmwareDeepDiveContent').innerHTML = `<p role="alert">Firmware Deep Dive could not be loaded: ${escapeMarkup(error.message)}</p>`;
  });
})();
