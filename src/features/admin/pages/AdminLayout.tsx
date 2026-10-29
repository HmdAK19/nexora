import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { useAuthorization } from '@features/auth';
import { PERMISSIONS } from '@shared/lib';
import type { Permission } from '@shared/model';
import { PageHeading } from '@shared/ui';

import { styles } from '../Admin.styles';

interface AdminNavigationItem {
  label: string;
  path: string;
  permission: Permission;
}

export default function AdminLayout() {
  const { t } = useTranslation(NAMESPACES.admin);
  const { can } = useAuthorization();
  const location = useLocation();
  const items = useMemo<AdminNavigationItem[]>(
    () => [
      {
        label: t('navigation.overview'),
        path: '/admin/overview',
        permission: PERMISSIONS.admin.overviewRead,
      },
      { label: t('navigation.users'), path: '/admin/users', permission: PERMISSIONS.admin.usersRead },
      {
        label: t('navigation.verifications'),
        path: '/admin/verifications',
        permission: PERMISSIONS.admin.verificationRead,
      },
      { label: t('navigation.support'), path: '/admin/support', permission: PERMISSIONS.admin.supportRead },
      {
        label: t('navigation.settings'),
        path: '/admin/settings',
        permission: PERMISSIONS.admin.settingsRead,
      },
    ],
    [t]
  );

  const visibleItems = items.filter(({ permission }) => can(permission));
  const activePath = visibleItems.find(({ path }) => location.pathname.startsWith(path))?.path ?? false;

  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Tabs
        aria-label={t('navigation.label')}
        value={activePath}
        variant="scrollable"
        scrollButtons="auto"
        sx={styles.navigation}
      >
        {visibleItems.map(({ label, path }) => (
          <Tab
            component={NavLink}
            key={path}
            label={label}
            to={path}
            value={path}
            sx={styles.navigationTab}
          />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
}
