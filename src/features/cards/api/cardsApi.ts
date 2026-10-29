import { apiClient, isRecord, readIsoDate, readString } from '@shared/api';
import type { AddBankCardInput, BankCard } from '../model';
function parseCard(value: unknown): BankCard {
  if (!isRecord(value) || typeof value.isDefault !== 'boolean') throw new Error('Invalid bank card response');
  return {
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
    isDefault: value.isDefault,
    maskedIban: readString(value, 'maskedIban'),
    maskedNumber: readString(value, 'maskedNumber'),
  };
}
export const cardKeys = { all: ['cards'] as const, list: () => ['cards', 'list'] as const };
export const cardsApi = {
  list: async (): Promise<BankCard[]> => {
    const data: unknown = (await apiClient.get('/cards')).data;
    if (!Array.isArray(data)) throw new Error('Invalid bank cards response');
    return data.map(parseCard);
  },
  create: async (input: AddBankCardInput): Promise<BankCard> =>
    parseCard((await apiClient.post('/cards', input)).data),
  remove: async (id: string) => {
    await apiClient.delete(`/cards/${encodeURIComponent(id)}`);
  },
  setDefault: async (id: string): Promise<BankCard> =>
    parseCard((await apiClient.patch(`/cards/${encodeURIComponent(id)}/default`)).data),
};
