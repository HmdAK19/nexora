export interface RuntimeConfig {
  apiBaseUrl: string;
  webSocketUrl: string;
}

type RuntimeConfigSource = Partial<Record<keyof RuntimeConfig, unknown>>;

const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  apiBaseUrl: '/api',
  webSocketUrl: '/ws',
};

const RUNTIME_CONFIG_PATH = `${import.meta.env.BASE_URL}runtime-config.json`;
const ABSOLUTE_API_PROTOCOLS = new Set(['http:', 'https:']);
const ABSOLUTE_SOCKET_PROTOCOLS = new Set(['ws:', 'wss:']);

let runtimeConfig = DEFAULT_RUNTIME_CONFIG;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeUrl(
  value: unknown,
  field: keyof RuntimeConfig,
  absoluteProtocols: ReadonlySet<string>
): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Runtime configuration field "${field}" must be a non-empty string.`);
  }

  const candidate = value.trim();

  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    const relativeUrl = new URL(candidate, 'https://runtime-config.invalid');

    if (relativeUrl.search || relativeUrl.hash) {
      throw new Error(`Runtime configuration field "${field}" cannot include a query or fragment.`);
    }

    return relativeUrl.pathname.replace(/\/+$/, '') || '/';
  }

  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    throw new Error(`Runtime configuration field "${field}" must be an absolute URL or root path.`);
  }

  if (!absoluteProtocols.has(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error(`Runtime configuration field "${field}" uses an unsupported or unsafe URL.`);
  }

  return url.toString().replace(/\/+$/, '');
}

export function parseRuntimeConfig(value: unknown): RuntimeConfig {
  if (!isRecord(value)) throw new Error('Runtime configuration must be a JSON object.');

  const source: RuntimeConfigSource = value;

  return Object.freeze({
    apiBaseUrl: normalizeUrl(source.apiBaseUrl, 'apiBaseUrl', ABSOLUTE_API_PROTOCOLS),
    webSocketUrl: normalizeUrl(source.webSocketUrl, 'webSocketUrl', ABSOLUTE_SOCKET_PROTOCOLS),
  });
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch(RUNTIME_CONFIG_PATH, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Runtime configuration could not be loaded (${response.status}).`);
  }

  runtimeConfig = parseRuntimeConfig((await response.json()) as unknown);

  return runtimeConfig;
}

export function getRuntimeConfig(): RuntimeConfig {
  return runtimeConfig;
}

export function createMarketWebSocketUrl(symbol: string, origin: string): string {
  const url = new URL(getRuntimeConfig().webSocketUrl, origin);

  if (url.protocol === 'http:') url.protocol = 'ws:';
  if (url.protocol === 'https:') url.protocol = 'wss:';

  url.searchParams.set('symbol', symbol);

  return url.toString();
}
