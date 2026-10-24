import { apiClient, isRecord, readIsoDate, readString } from '@shared/api';

import {
  supportCategories,
  supportStatuses,
  type CreateTicketFormValues,
  type SupportCategory,
  type SupportStatus,
} from '../model';

export interface SupportTicketSummary {
  category: SupportCategory;
  createdAt: string;
  id: string;
  lastMessagePreview: string;
  status: SupportStatus;
  subject: string;
  updatedAt: string;
}

export interface SupportMessage {
  author: 'support' | 'user';
  body: string;
  createdAt: string;
  id: string;
}

export interface SupportTicket extends SupportTicketSummary {
  messages: SupportMessage[];
}

function parseCategory(value: string): SupportCategory {
  if (supportCategories.includes(value as SupportCategory)) return value as SupportCategory;

  throw new Error('Invalid support category');
}

function parseStatus(value: string): SupportStatus {
  if (supportStatuses.includes(value as SupportStatus)) return value as SupportStatus;

  throw new Error('Invalid support status');
}

function parseSummary(value: unknown): SupportTicketSummary {
  if (!isRecord(value)) throw new Error('Invalid support ticket response');

  return {
    category: parseCategory(readString(value, 'category')),
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
    lastMessagePreview: readString(value, 'lastMessagePreview'),
    status: parseStatus(readString(value, 'status')),
    subject: readString(value, 'subject'),
    updatedAt: readIsoDate(value, 'updatedAt'),
  };
}

function parseMessage(value: unknown): SupportMessage {
  if (!isRecord(value)) throw new Error('Invalid support message response');

  const author = readString(value, 'author');

  if (author !== 'support' && author !== 'user') throw new Error('Invalid support message author');

  return {
    author,
    body: readString(value, 'body'),
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
  };
}

function parseTicket(value: unknown): SupportTicket {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    throw new Error('Invalid support ticket detail response');
  }

  return { ...parseSummary(value), messages: value.messages.map(parseMessage) };
}

export const supportKeys = {
  all: ['support'] as const,
  detail: (id: string) => [...supportKeys.all, 'ticket', id] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
};

export const supportApi = {
  closeTicket: async (id: string): Promise<SupportTicket> =>
    parseTicket((await apiClient.patch<unknown>(`/support/tickets/${encodeURIComponent(id)}/close`)).data),
  createTicket: async (input: CreateTicketFormValues): Promise<SupportTicket> =>
    parseTicket((await apiClient.post<unknown>('/support/tickets', input)).data),
  getTicket: async (id: string): Promise<SupportTicket> =>
    parseTicket((await apiClient.get<unknown>(`/support/tickets/${encodeURIComponent(id)}`)).data),
  listTickets: async (): Promise<SupportTicketSummary[]> => {
    const data: unknown = (await apiClient.get<unknown>('/support/tickets')).data;

    if (!Array.isArray(data)) throw new Error('Invalid support tickets response');

    return data.map(parseSummary);
  },
  reply: async (id: string, message: string): Promise<SupportTicket> =>
    parseTicket(
      (
        await apiClient.post<unknown>(`/support/tickets/${encodeURIComponent(id)}/messages`, {
          message,
        })
      ).data
    ),
};
