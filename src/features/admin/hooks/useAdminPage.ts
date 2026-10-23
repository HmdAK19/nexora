import { useMemo, useState } from 'react';

import { adminUsers } from '../model';

export function useAdminPage() {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [networkEnabled, setNetworkEnabled] = useState(true);
  const [withdrawEnabled, setWithdrawEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
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

  return {
    changeTab,
    filteredUsers,
    networkEnabled,
    query,
    saved,
    setNetworkEnabled,
    setQuery,
    setSaved,
    setWithdrawEnabled,
    tab,
    withdrawEnabled,
  };
}
