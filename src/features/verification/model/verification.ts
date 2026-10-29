export type VerificationCountry = 'AE' | 'IR' | 'TR';
export type VerificationStatus = 'draft' | 'not_started' | 'pending' | 'ready' | 'rejected' | 'verified';
export interface VerificationProfile {
  country: VerificationCountry;
  fullName: string;
  nationalId: string;
}
export const verificationLimits = {
  documentBytes: 5 * 1024 * 1024,
  fullNameMax: 120,
  nationalIdMax: 32,
} as const;
export const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'] as const;
