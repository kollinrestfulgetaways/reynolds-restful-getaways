(() => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('.filters').forEach(group => {
    const grid = group.nextElementSibling;
    if (!grid) return;
    group.setAttribute('role', 'group');
    group.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.textContent.trim();
        group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        grid.querySelectorAll('article[data-category]').forEach(item => {
          item.hidden = !category.startsWith('All ') && item.dataset.category !== category;
        });
      });
    });
  });
  document.querySelectorAll('form[data-form-kind]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('website')) return;
      const newsletter = form.dataset.formKind === 'newsletter';
      const subject = newsletter ? 'Travel notes subscription request' : 'Website contact inquiry';
      const body = newsletter
        ? `Please add me to your occasional travel notes.\n\nEmail: ${data.get('email') || ''}\n\nI consent to receive travel notes by email.`
        : `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n\n${data.get('message') || ''}`;
      const status = form.querySelector('[role="status"]');
      if (status) status.textContent = 'Your email app will open. Please send the prepared email to complete your request. If it does not open, email kollin@reynoldsrestfulgetaways.com.';
      window.location.href = `mailto:kollin@reynoldsrestfulgetaways.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
})();
