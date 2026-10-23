import { useTranslation } from 'react-i18next';
import {
  Activity,
  Check,
  CircleDollarSign,
  Network,
  Search,
  Settings2,
  ShieldAlert,
  TicketCheck,
  Users,
} from 'lucide-react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

import { useAdminPage } from '../hooks';
import { styles } from './AdminPage.styles';

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
  const {
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
  } = useAdminPage();
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
                        <Button size="small" onClick={() => setSelectedUser(user)}>
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
      {tab === 2 && (
        <Grid container spacing={2}>
          {reviewResult && (
            <Grid size={12}>
              <Alert severity="success">{t(`review.${reviewResult}`)}</Alert>
            </Grid>
          )}
          {verificationRequests.map(({ user, documentType }) => (
            <Grid
              key={user.id}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar>{user.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={800}>{user.name}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {t(`documents.${documentType}`)} · {t('submittedToday')}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={styles.stack12}>
                    <Button
                      color="success"
                      startIcon={<Check size={16} />}
                      variant="contained"
                      onClick={() => resolveVerification(user.id, 'approved')}
                    >
                      {t('approve')}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => resolveVerification(user.id, 'rejected')}
                    >
                      {t('reject')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {verificationRequests.length === 0 && (
            <Grid size={12}>
              <Alert severity="info">{t('review.empty')}</Alert>
            </Grid>
          )}
        </Grid>
      )}
      {tab === 3 && (
        <Stack spacing={1.5}>
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent sx={styles.cardContent13}>
                <TicketCheck size={22} />
                <Box>
                  <Typography fontWeight={750}>{t(`tickets.${ticket.subjectKey}`)}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {ticket.id} · hamed@example.com
                  </Typography>
                </Box>
                <Chip
                  label={t(`tickets.${ticket.priorityKey}`)}
                  color={ticket.normal ? 'default' : 'warning'}
                  size="small"
                  sx={styles.chip14}
                />
                <Button onClick={() => openTicket(ticket)}>{t('reply')}</Button>
              </CardContent>
            </Card>
          ))}
          {tickets.length === 0 && <Alert severity="success">{t('tickets.empty')}</Alert>}
        </Stack>
      )}
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
      <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t('userDetails')}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={1.5} sx={styles.dialogContent}>
              <Typography>
                <strong>{t('table.user')}:</strong> {selectedUser.name}
              </Typography>
              <Typography>
                <strong>{t('email')}:</strong> {selectedUser.email}
              </Typography>
              <Typography>
                <strong>{t('table.level')}:</strong> {selectedUser.level}
              </Typography>
              <Typography>
                <strong>{t('table.balance')}:</strong> {selectedUser.balance}
              </Typography>
              <Chip
                color={selectedUser.status === 'active' ? 'success' : 'error'}
                label={t(`statuses.${selectedUser.status}`)}
                size="small"
                sx={styles.dialogStatus}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(selectedTicket)} onClose={closeTicket} fullWidth maxWidth="sm">
        <DialogTitle>{t('tickets.replyTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <Typography color="text.secondary">
              {selectedTicket ? t(`tickets.${selectedTicket.subjectKey}`) : ''}
            </Typography>
            <TextField
              autoFocus
              label={t('tickets.replyMessage')}
              multiline
              minRows={4}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTicket}>{t('cancel')}</Button>
          <Button variant="contained" disabled={reply.trim().length < 3} onClick={submitReply}>
            {t('tickets.sendReply')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
