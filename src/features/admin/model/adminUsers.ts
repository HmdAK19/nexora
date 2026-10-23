export interface AdminUser {
  balance: string;
  email: string;
  id: number;
  level: string;
  name: string;
  status: 'active' | 'blocked';
}

export const adminUsers: AdminUser[] = [
  {
    balance: '$24,820',
    email: 'hamed@nexora.dev',
    id: 10214,
    level: 'Advanced',
    name: 'Hamed Ahmadi',
    status: 'active',
  },
  {
    balance: '$8,142',
    email: 'sara@example.com',
    id: 10213,
    level: 'Intermediate',
    name: 'Sara Mohammadi',
    status: 'active',
  },
  {
    balance: '$560',
    email: 'ali@example.com',
    id: 10212,
    level: 'Basic',
    name: 'Ali Rezaei',
    status: 'blocked',
  },
];
