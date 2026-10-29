import { allowedDocumentTypes, verificationLimits } from '../model';
export type DocumentError = 'empty' | 'size' | 'type' | null;
export function validateVerificationDocument(file?: File): DocumentError {
  if (!file || file.size === 0) return 'empty';
  if (!allowedDocumentTypes.includes(file.type as (typeof allowedDocumentTypes)[number])) return 'type';
  if (file.size > verificationLimits.documentBytes) return 'size';
  return null;
}
export function isValidVerificationProfile(fullName: string, nationalId: string) {
  return (
    fullName.trim().length >= 3 &&
    fullName.trim().length <= verificationLimits.fullNameMax &&
    /^[A-Za-z0-9-]{8,32}$/.test(nationalId.trim())
  );
}
