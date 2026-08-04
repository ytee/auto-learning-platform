(() => {
  const $ = selector => document.querySelector(selector);

  function activeModuleId() {
    return $('#moduleSelect')?.value || new URLSearchParams(location.hash.replace(/^#/, '')).get('module');
  }

  function applyDomainLabels() {
    const aerospace = activeModuleId() === 'aerospace';
    const exampleLabel = $('#conceptDetail .concept-example .eyebrow');
    if (exampleLabel) exampleLabel.textContent = aerospace ? 'AEROSPACE EXAMPLE' : 'AUTOMOTIVE EXAMPLE';

    if (aerospace) {
      $('#conceptDetail')?.querySelectorAll('.concept-tags span, .concept-references p').forEach(element => {
        if (element.textContent.includes('Part ')) {
          element.textContent = element.textContent.replace(/\bPart\s+/g, '');
        }
      });
    }
  }

  const detail = $('#conceptDetail');
  if (detail) {
    new MutationObserver(applyDomainLabels).observe(detail, { childList: true, subtree: true });
  }
  $('#moduleSelect')?.addEventListener('change', () => requestAnimationFrame(applyDomainLabels));
  applyDomainLabels();
})();
