document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (button) {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('active', b === button));
    document.querySelectorAll('[data-category]').forEach((item) => {
      item.hidden = filter !== 'All' && item.dataset.category !== filter;
    });
  }

  const menuButton = event.target.closest('[data-menu-button]');
  if (menuButton) document.querySelector('[data-menu]')?.classList.toggle('open');
});

const newsletterForm = document.querySelector('[data-newsletter-form]');
if (newsletterForm) {
  const emailInput = newsletterForm.querySelector('[data-newsletter-email]');
  const submitButton = newsletterForm.querySelector('[data-newsletter-submit]');
  const status = newsletterForm.querySelector('[data-newsletter-status]');
  const subscribedKey = 'rrg-newsletter-subscribed-v1';
  const lastAttemptKey = 'rrg-newsletter-last-attempt-v1';

  const setComplete = () => {
    newsletterForm.classList.add('is-complete');
    emailInput.value = '';
    emailInput.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Requested ✓';
    status.textContent = "You're on the list. Watch your inbox for future travel notes.";
    status.className = 'newsletter-status success';
  };

  try {
    if (localStorage.getItem(subscribedKey) === '1') setComplete();
  } catch {}

  newsletterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    const email = emailInput.value.trim();
    if (!email || !emailInput.checkValidity()) {
      status.textContent = 'Enter a valid email address first.';
      status.className = 'newsletter-status error';
      emailInput.focus();
      return;
    }

    try {
      const lastAttempt = Number(localStorage.getItem(lastAttemptKey) || 0);
      if (Date.now() - lastAttempt < 30000) {
        status.textContent = 'Please wait a moment before trying again.';
        status.className = 'newsletter-status error';
        return;
      }
      localStorage.setItem(lastAttemptKey, String(Date.now()));
    } catch {}

    submitButton.disabled = true;
    submitButton.textContent = 'Requesting…';
    status.textContent = '';
    status.className = 'newsletter-status';

    const payload = new FormData(newsletterForm);
    payload.set('_subject', 'New Reynolds Restful Getaways newsletter signup');
    payload.set('_captcha', 'false');
    payload.set('_template', 'table');
    payload.set('_url', window.location.href);

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@reynoldsrestfulgetaways.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload
      });
      const result = await response.json().catch(() => ({}));
      const ok = response.ok && (result.success === true || result.success === 'true');
      if (!ok) throw new Error(result.message || 'Unable to submit');

      try { localStorage.setItem(subscribedKey, '1'); } catch {}
      setComplete();
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = 'Request travel notes';
      status.textContent = 'Something went wrong. Please try again in a moment.';
      status.className = 'newsletter-status error';
    }
  });
}
