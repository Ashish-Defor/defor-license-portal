const title = document.querySelector('#connection-title');
const detail = document.querySelector('#connection-detail');
const state = document.querySelector('#connection-state');
for (const link of document.querySelectorAll('[data-path]')) link.addEventListener('click', event => { if (link.getAttribute('aria-disabled') === 'true') event.preventDefault(); });
async function configure() {
  try {
    const response = await fetch('./config.json?v=free-v1', { cache: 'no-store' });
    if (!response.ok) throw new Error('Configuration unavailable');
    const config = await response.json();
    if (config.service_mode === 'firebase') {
      const manager = new URL(config.management_url);
      if (manager.origin !== 'https://defor-cad-access-ashish.web.app' || manager.pathname !== '/' || manager.search || manager.hash || manager.username || manager.password) throw new Error('Invalid free manager address');
      title.textContent = 'Free DEFOR CAD access management';
      detail.textContent = 'The existing Firebase service handles email/password accounts and CAD startup licenses. The separate Microsoft SAML service is prepared in the private repository but is not hosted. No paid hosting has been created.';
      state.textContent = 'Firebase manager available';
      document.querySelector('#account-heading').textContent = 'Your DEFOR CAD account';
      document.querySelector('#account-detail').textContent = 'Sign in inside DEFOR CAD when it opens. For password recovery, open the access manager, enter your email and choose Forgot password.';
      document.querySelector('#application-detail').textContent = 'The current DEFOR CAD build checks your Firebase account and license online at startup. Once signed in, you can work offline until the app closes or you sign out. Microsoft SAML requires a separately hosted Gatekeeper server.';
      document.querySelector('#signin-step-title').textContent = 'Sign in with your DEFOR account';
      document.querySelector('#signin-step-detail').textContent = 'Use your administrator-created email and password in the application.';
      for (const link of document.querySelectorAll('[data-path]')) {
        if (link.dataset.path === '/device') { link.textContent = 'Sign in from the DEFOR CAD application'; continue; }
        link.href = manager.href;
        link.classList.remove('disabled');
        link.removeAttribute('aria-disabled');
        if (link.dataset.path === '/password/login') link.textContent = 'Open password help';
        if (link.dataset.path === '/password/forgot') link.textContent = 'Open password recovery';
      }
      return;
    }
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
