(() => {
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

    const navigation = document.querySelector('.site-navigation');
    if (navigation && !navigation.querySelector('[data-open-comparison]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.openComparison = 'aerospace-vs-automotive-safety';
      button.textContent = 'Comparisons';
      navigation.append(button);
    }
  }

  function loadRenderer() {
    if (globalThis.AUTOLEAP_COMPARISON) return Promise.resolve(globalThis.AUTOLEAP_COMPARISON);
    const existing = document.querySelector('script[src="assets/comparison.js"]');
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener('load', () => resolve(globalThis.AUTOLEAP_COMPARISON), { once: true });
        existing.addEventListener('error', () => reject(new Error('Cannot load comparison renderer')), { once: true });
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/comparison.js';
      script.onload = () => resolve(globalThis.AUTOLEAP_COMPARISON);
      script.onerror = () => reject(new Error('Cannot load comparison renderer'));
      document.body.append(script);
    });
  }

  ensureComparisonShell();
  globalThis.AUTOLEAP_COMPARISON_LOADER = loadRenderer;
  loadRenderer().catch(console.error);
})();
