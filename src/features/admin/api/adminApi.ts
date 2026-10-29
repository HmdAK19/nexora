import { apiClient, isRecord, readFiniteNumber, readIsoDate, readString } from '@shared/api';
import type { Paginated } from '@shared/model';

import type { AdminOverview, AdminSettings, AdminTicket, AdminUser, AdminVerification } from '../model';

function readEnum<T extends string>(value: string, values: readonly T[], field: string): T {
  if (values.includes(value as T)) return value as T;

  throw new Error(`Invalid API response field: ${field}`);
}

function parseUser(value: unknown): AdminUser {
  if (!isRecord(value)) throw new Error('Invalid admin user response');

  return {
    balance: readFiniteNumber(value, 'balance'),
    email: readString(value, 'email'),
    id: readString(value, 'id'),
    level: readEnum(readString(value, 'level'), ['advanced', 'basic', 'verified'], 'level'),
    name: readString(value, 'name'),
    role: readEnum(
      readString(value, 'role'),
      ['admin', 'compliance', 'customer', 'operations', 'support'],
      'role'
    ),
    status: readEnum(readString(value, 'status'), ['active', 'blocked'], 'status'),
  };
}

function parseOverview(value: unknown): AdminOverview {
  if (
    !isRecord(value) ||
    !isRecord(value.attention) ||
    !isRecord(value.metrics) ||
    !Array.isArray(value.services)
  ) {
    throw new Error('Invalid administration overview response');
  }

  return {
    attention: {
      highRiskWithdrawals: readFiniteNumber(value.attention, 'highRiskWithdrawals'),
      openVerifications: readFiniteNumber(value.attention, 'openVerifications'),
      unansweredTickets: readFiniteNumber(value.attention, 'unansweredTickets'),
    },
    metrics: {
      activeUsers: readFiniteNumber(value.metrics, 'activeUsers'),
      openReviews: readFiniteNumber(value.metrics, 'openReviews'),
      tradesToday: readFiniteNumber(value.metrics, 'tradesToday'),
      volume24h: readFiniteNumber(value.metrics, 'volume24h'),
    },
    services: value.services.map((service) => {
      if (!isRecord(service)) throw new Error('Invalid administration service response');

      return {
        key: readEnum(
          readString(service, 'key'),
          ['notifications', 'trading', 'verification', 'wallet'],
          'key'
        ),
        status: readEnum(readString(service, 'status'), ['degraded', 'operational'], 'status'),
      };
    }),
  };
}

function parseVerification(value: unknown): AdminVerification {
  if (!isRecord(value)) throw new Error('Invalid administration verification response');
  const document = value.document;

  if (document !== null && !isRecord(document)) throw new Error('Invalid verification document response');

  return {
    document: document
      ? {
          mimeType: readString(document, 'mimeType'),
          name: readString(document, 'name'),
          uploadedAt: readIsoDate(document, 'uploadedAt'),
        }
      : null,
    status: readEnum(readString(value, 'status'), ['pending'], 'status'),
    submittedAt: readIsoDate(value, 'submittedAt'),
    user: parseUser(value.user),
  };
}

function parseTicket(value: unknown): AdminTicket {
  if (!isRecord(value)) throw new Error('Invalid administration ticket response');

  return {
    category: readEnum(
      readString(value, 'category'),
      ['account', 'security', 'trading', 'verification', 'wallet'],
      'category'
    ),
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
    lastMessagePreview: typeof value.lastMessagePreview === 'string' ? value.lastMessagePreview : '',
    status: readEnum(
      readString(value, 'status'),
      ['closed', 'open', 'waiting_for_support', 'waiting_for_user'],
      'status'
    ),
    subject: readString(value, 'subject'),
    updatedAt: readIsoDate(value, 'updatedAt'),
    user: parseUser(value.user),
  };
}

function parseSettings(value: unknown): AdminSettings {
  if (
    !isRecord(value) ||
    typeof value.networkEnabled !== 'boolean' ||
    typeof value.withdrawalsEnabled !== 'boolean'
  ) {
    throw new Error('Invalid administration settings response');
  }

  return {
    minimumWithdrawal: readFiniteNumber(value, 'minimumWithdrawal'),
    networkEnabled: value.networkEnabled,
    paymentProvider: readEnum(
      readString(value, 'paymentProvider'),
      ['manual', 'provider-a'],
      'paymentProvider'
    ),
    tradingFeePercent: readFiniteNumber(value, 'tradingFeePercent'),
    updatedAt: readIsoDate(value, 'updatedAt'),
    withdrawalsEnabled: value.withdrawalsEnabled,
  };
}

function parseList<T>(value: unknown, parser: (item: unknown) => T, name: string): T[] {
  if (!Array.isArray(value)) throw new Error(`Invalid ${name} response`);

  return value.map(parser);
}

function parsePaginated<T>(value: unknown, parser: (item: unknown) => T, name: string): Paginated<T> {
  if (!isRecord(value) || !Array.isArray(value.data) || typeof value.hasMore !== 'boolean') {
    throw new Error(`Invalid ${name} response`);
  }

  return {
    data: value.data.map(parser),
    hasMore: value.hasMore,
    page: readFiniteNumber(value, 'page'),
    pageSize: readFiniteNumber(value, 'pageSize'),
    total: readFiniteNumber(value, 'total'),
  };
}

export const adminKeys = {
  all: ['admin'] as const,
  overview: () => [...adminKeys.all, 'overview'] as const,
  settings: () => [...adminKeys.all, 'settings'] as const,
  tickets: () => [...adminKeys.all, 'tickets'] as const,
  users: (search: string, page: number, pageSize: number) =>
    [...adminKeys.all, 'users', { page, pageSize, search }] as const,
  verifications: () => [...adminKeys.all, 'verifications'] as const,
};

export const adminApi = {
  getOverview: async (): Promise<AdminOverview> =>
    parseOverview((await apiClient.get<unknown>('/admin/overview')).data),
  listUsers: async (input: {
    page: number;
    pageSize: number;
    search: string;
  }): Promise<Paginated<AdminUser>> =>
    parsePaginated(
      (await apiClient.get<unknown>('/admin/users', { params: input })).data,
      parseUser,
      'administration users'
    ),
  listVerifications: async (): Promise<AdminVerification[]> =>
    parseList(
      (await apiClient.get<unknown>('/admin/verifications')).data,
      parseVerification,
      'administration verifications'
    ),
  reviewVerification: async (input: { decision: 'approved' | 'rejected'; userId: string }): Promise<void> => {
    await apiClient.post(`/admin/verifications/${encodeURIComponent(input.userId)}/decision`, {
      decision: input.decision,
    });
  },
  listTickets: async (): Promise<AdminTicket[]> =>
    parseList((await apiClient.get<unknown>('/admin/tickets')).data, parseTicket, 'administration tickets'),
  replyToTicket: async (input: { message: string; ticketId: string }): Promise<AdminTicket> =>
    parseTicket(
      (
        await apiClient.post<unknown>(`/admin/tickets/${encodeURIComponent(input.ticketId)}/replies`, {
          message: input.message,
        })
      ).data
    ),
  getSettings: async (): Promise<AdminSettings> =>
    parseSettings((await apiClient.get<unknown>('/admin/settings')).data),
  updateSettings: async (settings: Omit<AdminSettings, 'updatedAt'>): Promise<AdminSettings> =>
    parseSettings((await apiClient.put<unknown>('/admin/settings', settings)).data),
};
