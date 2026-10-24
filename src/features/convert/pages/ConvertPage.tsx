import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';
import { PageHeading } from '@shared/ui';

import { ConversionConfirmationDialog, ConversionForm, ConversionReceipt } from '../components';
import { convertStyles } from '../Convert.styles';
import { useConversion } from '../hooks';

export default function ConvertPage() {
  const { t } = useTranslation(NAMESPACES.convert);
  const conversion = useConversion();

  return (
    <Box sx={convertStyles.page}>
      <PageHeading description={t('description')} title={t('title')} />
      <ConversionForm
        amount={conversion.amount}
        amountError={conversion.amountError}
        errorKey={conversion.quoteErrorKey}
        fromAsset={conversion.fromAsset}
        loading={conversion.quoteLoading}
        onAmountChange={conversion.setAmount}
        onFromAssetChange={conversion.setFromAsset}
        onSubmit={() => void conversion.requestQuote()}
        onSwap={conversion.swapAssets}
        onToAssetChange={conversion.setToAsset}
        toAsset={conversion.toAsset}
      />
      {conversion.order && (
        <ConversionReceipt
          errorKey={conversion.orderErrorKey}
          onReset={conversion.resetResult}
          order={conversion.order}
        />
      )}
      <ConversionConfirmationDialog
        errorKey={conversion.orderErrorKey}
        loading={conversion.orderLoading}
        onClose={conversion.closeConfirmation}
        onConfirm={() => void conversion.confirmConversion()}
        onRefresh={() => void conversion.requestQuote()}
        open={conversion.confirmationOpen}
        quote={conversion.quote}
        quoteExpired={conversion.quoteExpired}
        refreshing={conversion.quoteLoading}
        secondsRemaining={conversion.secondsRemaining}
      />
    </Box>
  );
}
