import { apiClient, isRecord, readFiniteNumber, readIsoDate, readString } from '@shared/api';

import type { VerificationProfile, VerificationStatus } from '../model';

export interface VerificationCase {
  country?: VerificationProfile['country'];
  document?: { id: string; mimeType: string; name: string; size: number; uploadedAt: string };
  fullName?: string;
  nationalIdMasked?: string;
  status: VerificationStatus;
  submittedAt?: string;
  updatedAt: string;
}
const statuses: VerificationStatus[] = ['draft', 'not_started', 'pending', 'ready', 'rejected', 'verified'];
function optionalString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string' ? (value[key] as string) : undefined;
}
function parseCase(value: unknown): VerificationCase {
  if (!isRecord(value)) throw new Error('Invalid verification response');
  const status = readString(value, 'status') as VerificationStatus;
  if (!statuses.includes(status)) throw new Error('Invalid verification status');
  const document = isRecord(value.document)
    ? {
        id: readString(value.document, 'id'),
        mimeType: readString(value.document, 'mimeType'),
        name: readString(value.document, 'name'),
        size: readFiniteNumber(value.document, 'size'),
        uploadedAt: readIsoDate(value.document, 'uploadedAt'),
      }
    : undefined;
  const country = optionalString(value, 'country');
  if (country && country !== 'AE' && country !== 'IR' && country !== 'TR')
    throw new Error('Invalid verification country');
  return {
    country: country as VerificationProfile['country'] | undefined,
    document,
    fullName: optionalString(value, 'fullName'),
    nationalIdMasked: optionalString(value, 'nationalIdMasked'),
    status,
    submittedAt: optionalString(value, 'submittedAt'),
    updatedAt: readIsoDate(value, 'updatedAt'),
  };
}
export const verificationKeys = {
  all: ['verification'] as const,
  current: () => ['verification', 'current'] as const,
};
export const verificationApi = {
  get: async (): Promise<VerificationCase> => parseCase((await apiClient.get('/verification')).data),
  saveProfile: async (profile: VerificationProfile): Promise<VerificationCase> =>
    parseCase((await apiClient.put('/verification/profile', profile)).data),
  uploadDocument: async (file: File): Promise<VerificationCase> =>
    parseCase(
      (
        await apiClient.post('/verification/document', file, {
          headers: { 'Content-Type': file.type, 'X-Document-Name': encodeURIComponent(file.name) },
        })
      ).data
    ),
  submit: async (): Promise<VerificationCase> =>
    parseCase((await apiClient.post('/verification/submit')).data),
};
