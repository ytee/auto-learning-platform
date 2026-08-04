(() => {
  const comparisonId = 'aerospace-vs-automotive-safety';
  let rendererPromise = null;

  function ensureComparisonShell() {
    if (!document.querySelector('link[href="assets/comparison.css"]')) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'assets/comparison.css';
      document.head.append(stylesheet);
    }

    if (!document.querySelector('#view-comparison')) {
      const view = document.createElement('section');
      view.id = 'view-comparison';
      view.className = 'view comparison-view';
      view.setAttribute('aria-label', 'Safety-domain comparison');
      view.innerHTML = '<div id="comparisonContent"></div>';
      document.querySelector('main')?.append(view);
    }
  }

  function loadRenderer() {
    if (globalThis.AUTOLEAP_COMPARISON) return Promise.resolve(globalThis.AUTOLEAP_COMPARISON);
    if (rendererPromise) return rendererPromise;

    rendererPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="assets/comparison.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(globalThis.AUTOLEAP_COMPARISON), { once: true });
        existing.addEventListener('error', () => reject(new Error('Cannot load comparison renderer')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'assets/comparison.js';
      script.onload = () => resolve(globalThis.AUTOLEAP_COMPARISON);
      script.onerror = () => reject(new Error('Cannot load comparison renderer'));
      document.body.append(script);
    });

    return rendererPromise;
  }

  function openComparison(event) {
    event?.stopPropagation();
    ensureComparisonShell();
    loadRenderer()
      .then(api => api.show(comparisonId))
      .catch(console.error);
  }

  function ensureNavigationEntry() {
    const navigation = document.querySelector('.site-navigation');
    if (!navigation || navigation.querySelector('[data-open-comparison]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.openComparison = comparisonId;
    button.textContent = 'Comparisons';
    button.addEventListener('click', openComparison);
    navigation.append(button);
  }

  function ensureHomeCard() {
    const container = document.querySelector('#caseStudyCards');
    if (!container || !container.children.length || container.querySelector('[data-comparison-card]')) return false;

    const card = document.createElement('article');
    card.className = 'discovery-card';
    card.dataset.comparisonCard = comparisonId;
    card.innerHTML = `
      <div>
        <p class="home-kicker">CROSS-DOMAIN COMPARISON</p>
        <h3>Aerospace vs Automotive Safety</h3>
        <p>Compare shared safety-engineering principles, risk classification, assurance evidence, certification context and the limits of ASIL-to-DAL analogies.</p>
      </div>
      <footer>
        <span>ISO 26262 × ARP4754B/ARP4761A × DO-178C</span>
        <button type="button" class="home-card-action" data-open-comparison="${comparisonId}">Open <span aria-hidden="true">→</span></button>
      </footer>`;
    card.querySelector('[data-open-comparison]').addEventListener('click', openComparison);
    container.append(card);
    return true;
  }

  function waitForHomeCard(attempt = 0) {
    if (ensureHomeCard() || attempt >= 160) return;
    setTimeout(() => waitForHomeCard(attempt + 1), 25);
  }

  function workspaceReady(attempt = 0) {
    if (document.querySelector('#simpleLearningNavigation') && document.querySelector('#continueLearning')?.children.length) {
      loadRenderer().catch(console.error);
      return;
    }
    if (attempt >= 200) {
      loadRenderer().catch(console.error);
      return;
    }
    setTimeout(() => workspaceReady(attempt + 1), 25);
  }

  ensureComparisonShell();
  ensureNavigationEntry();
  waitForHomeCard();
  workspaceReady();
  globalThis.AUTOLEAP_COMPARISON_LOADER = loadRenderer;
})();
