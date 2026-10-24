import axios from 'axios';

const publicErrorCodes = new Set(['RATE_LIMITED', 'TICKET_CLOSED', 'TICKET_NOT_FOUND', 'VALIDATION_ERROR']);

export function getSupportErrorKey(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'errors.unexpected';

  const code = error.response?.data?.code;

  if (typeof code === 'string' && publicErrorCodes.has(code)) return `errors.${code}`;

  return error.response ? 'errors.unexpected' : 'errors.network';
}
