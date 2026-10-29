export interface BankCard {
  createdAt: string;
  id: string;
  isDefault: boolean;
  maskedIban: string;
  maskedNumber: string;
}
export interface AddBankCardInput {
  iban: string;
  number: string;
}
