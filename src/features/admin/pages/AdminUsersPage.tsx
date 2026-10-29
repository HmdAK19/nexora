import { useDeferredValue, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { formatCurrency } from '@shared/lib';
import { PageFeedback } from '@shared/ui';

import { AdminQueryState } from '../components';
import { useAdminUsers } from '../hooks';
import { styles } from '../Admin.styles';

export default function AdminUsersPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const deferredSearch = useDeferredValue(search.trim());
  const query = useAdminUsers(deferredSearch, page + 1, pageSize);

  useEffect(() => setPage(0), [deferredSearch]);

  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          label={t('users.search')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={styles.searchField}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search aria-hidden size={17} />
                </InputAdornment>
              ),
            },
          }}
        />
        {query.isFetching && <LinearProgress aria-label={t('users.loading')} />}
        {query.error && query.data && <Alert severity="warning">{t('states.refreshError')}</Alert>}
        {!query.data ? (
          <AdminQueryState error={query.error} loading={query.isLoading} retry={() => void query.refetch()} />
        ) : query.data.data.length === 0 ? (
          <PageFeedback title={t('users.empty')} description={t('users.emptyDescription')} />
        ) : (
          <TableContainer>
            <Table aria-label={t('users.tableLabel')}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('users.columns.user')}</TableCell>
                  <TableCell>{t('users.columns.role')}</TableCell>
                  <TableCell>{t('users.columns.level')}</TableCell>
                  <TableCell>{t('users.columns.balance')}</TableCell>
                  <TableCell>{t('users.columns.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data.data.map((user) => (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar>{user.name[0]}</Avatar>
                        <span>
                          <Typography fontWeight={700}>{user.name}</Typography>
                          <Typography color="text.secondary" variant="caption">
                            {user.email} · {user.id}
                          </Typography>
                        </span>
                      </Stack>
                    </TableCell>
                    <TableCell>{t(`roles.${user.role}`)}</TableCell>
                    <TableCell>{t(`levels.${user.level}`)}</TableCell>
                    <TableCell>{formatCurrency(user.balance)}</TableCell>
                    <TableCell>
                      <Chip
                        color={user.status === 'active' ? 'success' : 'error'}
                        label={t(`statuses.${user.status}`)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={query.data.total}
              page={page}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage={t('users.rowsPerPage')}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={(event) => {
                setPage(0);
                setPageSize(Number(event.target.value));
              }}
            />
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
