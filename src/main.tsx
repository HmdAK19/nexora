import { loadRuntimeConfig } from '@shared/config';

const root = document.getElementById('root');

if (!root) throw new Error('Application root element was not found.');

const appRoot = root;

function renderConfigurationError(error: unknown) {
  console.error('Application runtime configuration failed to load.', error);

  const message = document.createElement('main');
  const englishHeading = document.createElement('h1');
  const englishDescription = document.createElement('p');
  const separator = document.createElement('hr');
  const persianHeading = document.createElement('h2');
  const persianDescription = document.createElement('p');

  message.setAttribute('role', 'alert');
  englishHeading.textContent = 'Application configuration error';
  englishDescription.textContent =
    'The application could not load its runtime configuration. Please contact support or try again later.';
  persianHeading.lang = 'fa';
  persianHeading.dir = 'rtl';
  persianHeading.textContent = 'خطا در تنظیمات برنامه';
  persianDescription.lang = 'fa';
  persianDescription.dir = 'rtl';
  persianDescription.textContent =
    'تنظیمات زمان اجرای برنامه بارگذاری نشد. لطفاً بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.';

  message.append(englishHeading, englishDescription, separator, persianHeading, persianDescription);
  appRoot.replaceChildren(message);
}

void loadRuntimeConfig()
  .then(async () => {
    const { bootstrap } = await import('./bootstrap');
    bootstrap(appRoot);
  })
  .catch(renderConfigurationError);
