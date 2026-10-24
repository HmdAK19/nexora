export const supportCategories = ['account', 'wallet', 'trading', 'verification', 'security'] as const;

export type SupportCategory = (typeof supportCategories)[number];

export const supportStatuses = ['open', 'waiting_for_support', 'waiting_for_user', 'closed'] as const;

export type SupportStatus = (typeof supportStatuses)[number];

export interface CreateTicketFormValues {
  category: SupportCategory;
  message: string;
  subject: string;
}

export const initialTicketFormValues: CreateTicketFormValues = {
  category: 'wallet',
  message: '',
  subject: '',
};

export const supportLimits = {
  messageMaxLength: 4_000,
  messageMinLength: 10,
  subjectMaxLength: 120,
  subjectMinLength: 4,
} as const;
