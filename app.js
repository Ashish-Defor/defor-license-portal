const title = document.querySelector('#connection-title');
const detail = document.querySelector('#connection-detail');
const state = document.querySelector('#connection-state');
for (const link of document.querySelectorAll('[data-path]')) link.addEventListener('click', event => { if (link.getAttribute('aria-disabled') === 'true') event.preventDefault(); });
async function configure() {
  try {
    const response = await fetch('./config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Configuration unavailable');
    const config = await response.json();
    if (!config.service_url) {
      title.textContent = 'Secure service deployment pending';
      detail.textContent = 'This portal is published. Sign-in and license management will become available after the authentication server is deployed and connected.';
      state.textContent = 'Awaiting backend';
      return;
    }
    const service = new URL(config.service_url);
    if (service.protocol !== 'https:' || service.username || service.password || service.search || service.hash || service.pathname !== '/') throw new Error('Invalid service address');
    for (const link of document.querySelectorAll('[data-path]')) {
      link.href = new URL(link.dataset.path, service).href;
      link.classList.remove('disabled');
      link.removeAttribute('aria-disabled');
    }
    title.textContent = 'Secure service configured';
    detail.textContent = `Sign-in and license management open securely at ${service.hostname}. Availability is checked when you connect.`;
    state.textContent = 'Ready to connect';
  } catch {
    title.textContent = 'Service configuration unavailable';
    detail.textContent = 'Please contact your DEFOR administrator. Sign-in is disabled until the service address is available.';
    state.textContent = 'Configuration required';
  }
}
configure();
