import { useMemo, useState } from 'react';

import { adminUsers, type AdminUser } from '../model';

export interface AdminTicket {
  id: string;
  normal: boolean;
  priorityKey: 'urgent' | 'normal' | 'high';
  subjectKey: 'withdrawalPending' | 'changePhone' | 'depositWithoutTag';
}

interface VerificationRequest {
  documentType: 'nationalId' | 'passport';
  user: AdminUser;
}

const initialTickets: AdminTicket[] = [
  { id: '#1049', normal: false, priorityKey: 'urgent', subjectKey: 'withdrawalPending' },
  { id: '#1048', normal: true, priorityKey: 'normal', subjectKey: 'changePhone' },
  { id: '#1047', normal: false, priorityKey: 'high', subjectKey: 'depositWithoutTag' },
];

const initialVerificationRequests: VerificationRequest[] = adminUsers
  .slice(0, 2)
  .map((user, index) => ({ documentType: index === 0 ? 'nationalId' : 'passport', user }));

export function useAdminPage() {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [networkEnabled, setNetworkEnabled] = useState(true);
  const [withdrawEnabled, setWithdrawEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [reply, setReply] = useState('');
  const [tickets, setTickets] = useState(initialTickets);
  const [verificationRequests, setVerificationRequests] = useState(initialVerificationRequests);
  const [reviewResult, setReviewResult] = useState<'approved' | 'rejected' | null>(null);
  const [provider, setProvider] = useState('manual');
  const [tradingFee, setTradingFee] = useState('0.08');
  const [minimumWithdrawal, setMinimumWithdrawal] = useState('10');
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return adminUsers.filter((user) =>
      `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const changeTab = (value: number) => {
    setTab(value);
    setSaved(false);
  };

  const resolveVerification = (userId: number, result: 'approved' | 'rejected') => {
    setVerificationRequests((requests) => requests.filter(({ user }) => user.id !== userId));
    setReviewResult(result);
  };

  const openTicket = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setReply('');
  };

  const closeTicket = () => {
    setSelectedTicket(null);
    setReply('');
  };

  const submitReply = () => {
    if (!selectedTicket || reply.trim().length < 3) return;

    setTickets((items) => items.filter(({ id }) => id !== selectedTicket.id));
    closeTicket();
  };

  const saveFinancialSettings = () => {
    if (!Number.isFinite(Number(tradingFee)) || !Number.isFinite(Number(minimumWithdrawal))) return;

    setSaved(true);
  };

  return {
    changeTab,
    closeTicket,
    filteredUsers,
    minimumWithdrawal,
    networkEnabled,
    openTicket,
    provider,
    query,
    reply,
    resolveVerification,
    reviewResult,
    saveFinancialSettings,
    saved,
    selectedTicket,
    selectedUser,
    setMinimumWithdrawal,
    setNetworkEnabled,
    setProvider,
    setQuery,
    setReply,
    setSaved,
    setSelectedUser,
    setTradingFee,
    setWithdrawEnabled,
    submitReply,
    tab,
    tickets,
    tradingFee,
    verificationRequests,
    withdrawEnabled,
  };
}
