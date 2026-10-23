import { useTranslation } from 'react-i18next';
import { Activity, CircleDollarSign, Network, Search, Settings2, ShieldAlert, Users } from 'lucide-react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { PageHeading } from '@shared/ui';

import { AdminDialogs, TicketQueue, VerificationQueue } from '../components';
import { useAdminPage } from '../hooks';
import { styles } from '../Admin.styles';

function Metric({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Card sx={styles.metricCard}>
      <CardContent sx={styles.metricCardContent}>
        <Box sx={styles.box1}>
          <Box sx={styles.box2}>
            <Icon size={21} />
          </Box>
          <Box sx={styles.metricCopy}>
            <Typography color="text.secondary" variant="body2">
              {label}
            </Typography>
            <Typography fontWeight={850} variant="h5">
              {value}
            </Typography>
          </Box>
          <Chip color="success" label={change} size="small" sx={styles.chip3} />
        </Box>
      </CardContent>
    </Card>
  );
}
export default function AdminPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const controller = useAdminPage();
  const {
    changeTab,
    filteredUsers,
    minimumWithdrawal,
    networkEnabled,
    provider,
    query,
    saveFinancialSettings,
    saved,
    setMinimumWithdrawal,
    setNetworkEnabled,
    setProvider,
    setQuery,
    setSaved,
    setTradingFee,
    setWithdrawEnabled,
    tab,
    tradingFee,
    withdrawEnabled,
  } = controller;
  const labels = ['dashboard', 'users', 'verification', 'tickets', 'financial'].map((key) =>
    t(`tabs.${key}`)
  );
  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Tabs
        value={tab}
        onChange={(_, value: number) => changeTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={styles.tabs4}
      >
        {labels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      {tab === 0 && (
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
            <Grid
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <Metric icon={Users} label={t('metrics.activeUsers')} value="12,840" change="+8.4%" />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <Metric icon={CircleDollarSign} label={t('metrics.volume24h')} value="$8.42M" change="+12.1%" />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <Metric icon={Activity} label={t('metrics.tradesToday')} value="48,902" change="+6.7%" />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <Metric icon={ShieldAlert} label={t('metrics.openReviews')} value="27" change="-4" />
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
            <Grid
              size={{
                xs: 12,
                lg: 8,
              }}
            >
              <Card sx={styles.dashboardPanel}>
                <CardContent sx={styles.dashboardPanelContent}>
                  <Typography fontWeight={800} variant="h6">
                    {t('operationalStatus')}
                  </Typography>
                  <Stack spacing={1.5} sx={styles.stack6}>
                    {[
                      ['Trading engine', 'Operational'],
                      ['Wallet service', 'Operational'],
                      ['KYC provider', 'Operational'],
                      ['Email notifications', 'Degraded'],
                    ].map(([service, status]) => (
                      <Box key={service} sx={styles.box7}>
                        <Typography>{service}</Typography>
                        <Chip
                          color={status === 'Operational' ? 'success' : 'warning'}
                          label={status}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <Card sx={styles.dashboardPanel}>
                <CardContent sx={styles.dashboardPanelContent}>
                  <Typography fontWeight={800} variant="h6">
                    {t('needsAttention')}
                  </Typography>
                  <Stack spacing={1.25} sx={styles.attentionList}>
                    <Typography sx={styles.attentionItem}>12 {t('verificationRequests')}</Typography>
                    <Typography sx={styles.attentionItem}>7 {t('unansweredTickets')}</Typography>
                    <Typography sx={styles.attentionItem}>3 {t('highRiskWithdrawals')}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      )}
      {tab === 1 && (
        <Card>
          <CardContent>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchUsers')}
              fullWidth
              sx={styles.textField11}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={17} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.user')}</TableCell>
                    <TableCell>{t('table.level')}</TableCell>
                    <TableCell>{t('table.balance')}</TableCell>
                    <TableCell>{t('table.status')}</TableCell>
                    <TableCell>{t('table.action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar>{user.name[0]}</Avatar>
                          <Box>
                            <Typography fontWeight={700}>{user.name}</Typography>
                            <Typography color="text.secondary" variant="caption">
                              {user.email} · #{user.id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.level}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                      <TableCell>
                        <Chip
                          color={user.status === 'active' ? 'success' : 'error'}
                          label={user.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => controller.setSelectedUser(user)}>
                          {t('view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      {tab === 2 && <VerificationQueue controller={controller} />}
      {tab === 3 && <TicketQueue controller={controller} />}
      {tab === 4 && (
        <Grid container spacing={2.5}>
          <Grid
            size={{
              xs: 12,
              lg: 7,
            }}
          >
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Network size={22} />
                  <Typography fontWeight={800} variant="h6">
                    {t('financial.networkAndWithdrawals')}
                  </Typography>
                </Stack>
                <Stack sx={styles.stack15}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={networkEnabled}
                        onChange={(e) => setNetworkEnabled(e.target.checked)}
                      />
                    }
                    label={t('financial.enableTrc20')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={withdrawEnabled}
                        onChange={(e) => setWithdrawEnabled(e.target.checked)}
                      />
                    }
                    label={t('financial.enableWithdrawals')}
                  />
                </Stack>
                <TextField
                  select
                  fullWidth
                  label={t('financial.paymentProvider')}
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                  sx={styles.textField16}
                >
                  <MenuItem value="manual">Manual settlement</MenuItem>
                  <MenuItem value="provider-a">Provider A</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  startIcon={<Settings2 size={17} />}
                  sx={styles.button17}
                  onClick={saveFinancialSettings}
                >
                  {t('financial.save')}
                </Button>
                {saved && (
                  <Alert severity="success" sx={styles.alert18}>
                    {t('financial.saved')}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 5,
            }}
          >
            <Card>
              <CardContent>
                <Typography fontWeight={800} variant="h6">
                  {t('financial.commissions')}
                </Typography>
                <TextField
                  fullWidth
                  label={t('financial.tradingFee')}
                  value={tradingFee}
                  onChange={(event) => {
                    setTradingFee(event.target.value);
                    setSaved(false);
                  }}
                  inputProps={{ inputMode: 'decimal' }}
                  sx={styles.textField19}
                />
                <TextField
                  fullWidth
                  label={t('financial.minimumWithdrawal')}
                  value={minimumWithdrawal}
                  onChange={(event) => {
                    setMinimumWithdrawal(event.target.value);
                    setSaved(false);
                  }}
                  inputProps={{ inputMode: 'decimal' }}
                  sx={styles.textField20}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <AdminDialogs controller={controller} />
    </Box>
  );
}
