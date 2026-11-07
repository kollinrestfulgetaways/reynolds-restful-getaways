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
