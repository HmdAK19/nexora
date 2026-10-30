import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(root, 'docs/assets');
const baseUrl = process.env.NEXORA_SCREENSHOT_URL ?? 'http://127.0.0.1:4173';

const permissions = [
  'admin:audit:read',
  'admin:overview:read',
  'admin:settings:manage',
  'admin:settings:read',
  'admin:support:read',
  'admin:support:reply',
  'admin:users:read',
  'admin:verification:read',
  'admin:verification:review',
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
];

const user = {
  id: 'docs-admin',
  name: 'Nexora Demo',
  email: 'demo@nexora.dev',
  level: 'advanced',
  permissions,
  role: 'admin',
};

const markets = [
  market('btc', 'BTC', 'Bitcoin', 67542.18, 2.84, [62, 64, 63, 66, 65, 68, 70, 69, 72]),
  market('eth', 'ETH', 'Ethereum', 3548.72, 1.76, [44, 46, 45, 48, 50, 49, 53, 55, 54]),
  market('sol', 'SOL', 'Solana', 174.36, 5.21, [20, 23, 22, 27, 26, 30, 34, 33, 37]),
  market('ada', 'ADA', 'Cardano', 0.4528, -1.12, [38, 37, 39, 36, 35, 34, 36, 33, 32]),
  market('avax', 'AVAX', 'Avalanche', 39.84, 3.42, [27, 28, 30, 29, 32, 34, 33, 36, 38]),
];

function market(id, symbol, name, price, change24h, sparkline) {
  return { id, symbol, name, quote: 'USDT', price, change24h, volume24h: price * 18420, sparkline };
}

function candle(index) {
  const time = Date.now() - (109 - index) * 15 * 60 * 1000;
  const drift = index * 27 + Math.sin(index / 5) * 620;
  const open = 63800 + drift;
  const close = open + Math.sin(index / 2.7) * 210;
  return {
    time,
    open,
    close,
    high: Math.max(open, close) + 180,
    low: Math.min(open, close) - 160,
    volume: 80 + (index % 9) * 13,
  };
}

function json(route, body, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

async function installApiMock(page, state) {
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url());

    if (pathname === '/api/auth/refresh') {
      return state.authenticated
        ? json(route, { accessToken: 'docs-access-token', user })
        : json(route, { code: 'UNAUTHORIZED', message: 'No documentation session' }, 401);
    }
    if (pathname === '/api/account/notifications') return json(route, { items: [], unreadCount: 0 });
    if (pathname === '/api/dashboard') {
      return json(route, {
        portfolioValue: 1597090.4,
        portfolioChange: 8.42,
        availableBalance: 284320.18,
        openOrders: 7,
        totalTrades: 1248,
        allocation: [
          { symbol: 'BTC', value: 48, color: '#1769ff' },
          { symbol: 'ETH', value: 28, color: '#20d6c7' },
          { symbol: 'SOL', value: 15, color: '#9a69ff' },
          { symbol: 'Other', value: 9, color: '#ffad32' },
        ],
        performance: [
          1210000, 1245000, 1232000, 1288000, 1320000, 1305000, 1375000, 1412000, 1398000, 1460000, 1515000,
          1492000, 1550000, 1597090,
        ],
        activities: [
          { id: 'a1', title: 'Bitcoin purchase', subtitle: 'Today · BTC/USDT', amount: -12450, kind: 'buy' },
          { id: 'a2', title: 'USDT deposit', subtitle: 'Yesterday · TRC20', amount: 50000, kind: 'deposit' },
          { id: 'a3', title: 'Ethereum sale', subtitle: 'Oct 29 · ETH/USDT', amount: 18720, kind: 'sell' },
        ],
      });
    }
    if (pathname === '/api/markets/featured') return json(route, markets.slice(0, 4));
    if (pathname === '/api/markets') {
      return json(route, { data: markets, page: 1, pageSize: 25, total: markets.length, hasMore: false });
    }
    if (pathname === '/api/markets/BTC-USDT/trading') {
      const levels = Array.from({ length: 12 }, (_, index) => ({
        price: 67542.18 + (index + 1) * 18.5,
        amount: 0.08 + index * 0.017,
      }));
      return json(route, {
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        symbol: 'BTC-USDT',
        name: 'Bitcoin',
        lastPrice: 67542.18,
        change24h: 2.84,
        high24h: 68120.45,
        low24h: 64880.12,
        volume24h: 1294830200,
        depth: {
          symbol: 'BTC-USDT',
          sequence: 8421,
          asks: [...levels].reverse(),
          bids: levels.map((level) => ({ ...level, price: 67542.18 - (level.price - 67542.18) })),
        },
      });
    }
    if (pathname === '/api/markets/BTC-USDT/candles') {
      return json(
        route,
        Array.from({ length: 110 }, (_, index) => candle(index))
      );
    }
    if (pathname === '/api/markets/BTC-USDT/trades') {
      return json(
        route,
        Array.from({ length: 18 }, (_, index) => ({
          id: index + 1,
          price: 67542.18 + Math.sin(index) * 42,
          amount: 0.012 + index * 0.0031,
          side: index % 3 === 0 ? 'sell' : 'buy',
          time: Date.now() - index * 42_000,
        }))
      );
    }
    if (pathname === '/api/wallet') {
      return json(
        route,
        markets.slice(0, 3).map((item, index) => ({
          ...item,
          balance: index === 0 ? 1.82 : index === 1 ? 18.4 : 640,
          available: index === 0 ? 1.25 : index === 1 ? 12.8 : 510,
          value: index === 0 ? 122925 : index === 1 ? 65296 : 111590,
        }))
      );
    }
    if (pathname === '/api/orders') return json(route, []);
    if (pathname === '/api/admin/overview') {
      return json(route, {
        metrics: { activeUsers: 24891, volume24h: 48120560, tradesToday: 18420, openReviews: 36 },
        attention: { openVerifications: 24, unansweredTickets: 8, highRiskWithdrawals: 4 },
        services: [
          { key: 'trading', status: 'operational' },
          { key: 'wallet', status: 'operational' },
          { key: 'verification', status: 'operational' },
          { key: 'notifications', status: 'degraded' },
        ],
      });
    }

    return json(route, { code: 'NOT_MOCKED', message: pathname }, 404);
  });
}

async function capture(page, state, path, filename, authenticated) {
  state.authenticated = authenticated;
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1_200);
  await page.screenshot({ path: resolve(outputDirectory, filename), fullPage: true });
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  colorScheme: 'dark',
  deviceScaleFactor: 1,
  locale: 'en-US',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const state = { authenticated: false };
await installApiMock(page, state);

try {
  await capture(page, state, '/login', 'login.png', false);
  await capture(page, state, '/register', 'register.png', false);
  await capture(page, state, '/', 'dashboard.png', true);
  await capture(page, state, '/trade/BTC-USDT', 'trading.png', true);
  await capture(page, state, '/admin/overview', 'admin-overview.png', true);
} finally {
  await browser.close();
}
