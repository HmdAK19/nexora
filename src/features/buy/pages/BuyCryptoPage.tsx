import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab, Tabs } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { PageHeading } from '@shared/ui';

import { buyStyles } from '../Buy.styles';
import {
  BankDepositPanel,
  ExpressPurchaseForm,
  P2POffers,
  PurchaseConfirmationDialog,
  PurchaseReceipt,
} from '../components';
import { useExpressPurchase } from '../hooks';

export default function BuyCryptoPage() {
  const { t } = useTranslation(NAMESPACES.buy);
  const [tab, setTab] = useState(0);
  const purchase = useExpressPurchase();

  return (
    <Box>
      <PageHeading description={t('description')} title={t('title')} />
      <Tabs
        aria-label={t('tabs.label')}
        onChange={(_, value: number) => setTab(value)}
        sx={buyStyles.tabs}
        value={tab}
        variant="scrollable"
      >
        <Tab label={t('tabs.express')} />
        <Tab label={t('tabs.p2p')} />
        <Tab label={t('tabs.bank')} />
      </Tabs>

      {tab === 0 && (
        <>
          <ExpressPurchaseForm
            amount={purchase.amount}
            amountError={purchase.amountError}
            asset={purchase.asset}
            errorKey={purchase.quoteErrorKey}
            loading={purchase.quoteLoading}
            onAmountChange={purchase.setAmount}
            onAssetChange={purchase.setAsset}
            onSubmit={() => void purchase.requestQuote()}
          />
          {purchase.order && (
            <PurchaseReceipt
              errorKey={purchase.orderErrorKey}
              onNewPurchase={purchase.startNewPurchase}
              order={purchase.order}
            />
          )}
        </>
      )}
      {tab === 1 && <P2POffers />}
      {tab === 2 && <BankDepositPanel />}

      <PurchaseConfirmationDialog
        errorKey={purchase.orderErrorKey}
        loading={purchase.orderLoading}
        onClose={purchase.closeConfirmation}
        onConfirm={() => void purchase.confirmPurchase()}
        onRefresh={() => void purchase.requestQuote()}
        open={purchase.confirmationOpen}
        quote={purchase.quote}
        quoteExpired={purchase.quoteExpired}
        refreshing={purchase.quoteLoading}
        secondsRemaining={purchase.secondsRemaining}
      />
    </Box>
  );
}
