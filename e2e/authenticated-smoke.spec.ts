import { expect, test, type Page } from '@playwright/test';

const user = {
  id: 'user-e2e',
  name: 'E2E User',
  email: 'e2e@nexora.dev',
  level: 'verified',
  permissions: [
    'cards:access',
    'convert:access',
    'dashboard:access',
    'markets:access',
    'orders:access',
    'purchase:access',
    'referrals:access',
    'support:access',
    'verification:access',
    'wallet:access',
  ],
  role: 'customer',
};

async function mockApi(page: Page) {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === '/api/auth/refresh')
      return route.fulfill({ status: 401, json: { code: 'UNAUTHORIZED', message: 'No session' } });
    if (pathname === '/api/auth/login')
      return route.fulfill({ json: { accessToken: 'e2e-access-token', user } });
    if (pathname === '/api/dashboard')
      return route.fulfill({
        json: {
          portfolioValue: 1000,
          portfolioChange: 1.2,
          availableBalance: 500,
          openOrders: 0,
          totalTrades: 0,
          allocation: [],
          performance: [900, 1000],
          activities: [],
        },
      });
    if (pathname === '/api/markets/featured') return route.fulfill({ json: [] });
    return route.fulfill({ status: 404, json: { code: 'NOT_MOCKED', message: pathname } });
  });
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
});

test('validates login fields and completes the authenticated route transition', async ({ page }) => {
  await page.getByRole('button', { name: 'ورود به نکسورا' }).click();
  await expect(page.getByText('ایمیل الزامی است')).toBeVisible();
  await expect(page.getByText('رمز عبور الزامی است')).toBeVisible();

  await page.getByLabel('ایمیل').fill('e2e@nexora.dev');
  await page.getByLabel('رمز عبور').fill('Nexora123!');
  await page.getByRole('button', { name: 'ورود به نکسورا' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'نمای کلی دارایی‌ها' })).toBeVisible();
});

test('does not introduce horizontal overflow at the configured viewport', async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
