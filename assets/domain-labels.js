(() => {
  const $ = selector => document.querySelector(selector);
  let updateScheduled = false;

  function activeModuleId() {
    return $('#moduleSelect')?.value || new URLSearchParams(location.hash.replace(/^#/, '')).get('module');
  }

  function setTextIfChanged(element, nextText) {
    if (element && element.textContent !== nextText) {
      element.textContent = nextText;
    }
  }

  function applyDomainLabels() {
    const aerospace = activeModuleId() === 'aerospace';
    const exampleLabel = $('#conceptDetail .concept-example .eyebrow');
    setTextIfChanged(exampleLabel, aerospace ? 'AEROSPACE EXAMPLE' : 'AUTOMOTIVE EXAMPLE');

    if (aerospace) {
      $('#conceptDetail')?.querySelectorAll('.concept-tags span, .concept-references p').forEach(element => {
        if (!element.textContent.includes('Part ')) return;
        setTextIfChanged(element, element.textContent.replace(/\bPart\s+/g, ''));
      });
    }
  }

  function scheduleDomainLabels() {
    if (updateScheduled) return;
    updateScheduled = true;
    requestAnimationFrame(() => {
      updateScheduled = false;
      applyDomainLabels();
    });
  }

  const detail = $('#conceptDetail');
  if (detail) {
    new MutationObserver(scheduleDomainLabels).observe(detail, { childList: true, subtree: true });
  }
  $('#moduleSelect')?.addEventListener('change', scheduleDomainLabels);
  applyDomainLabels();
})();
