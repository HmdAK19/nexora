import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey, getSecondsRemaining } from '@shared/lib';

import { buyApi, buyKeys, type PurchaseOrder } from '../api';
import { getPurchaseErrorKey, validatePurchaseAmount } from '../lib';
import { type PurchaseAsset } from '../model';

const orderPollInterval = 2_000;

export function useExpressPurchase() {
  const queryClient = useQueryClient();
  const requestVersionRef = useRef(0);
  const idempotencyKeyRef = useRef<string | undefined>(undefined);
  const invalidatedOrderRef = useRef<string | undefined>(undefined);
  const [amount, setAmountState] = useState('1000');
  const [asset, setAssetState] = useState<PurchaseAsset>('USDT');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<PurchaseOrder>();
  const [now, setNow] = useState(Date.now());

  const quoteMutation = useMutation({
    mutationFn: buyApi.createQuote,
  });
  const orderMutation = useMutation({
    mutationFn: ({ quoteId, idempotencyKey }: { quoteId: string; idempotencyKey: string }) =>
      buyApi.createOrder(quoteId, idempotencyKey),
  });

  const orderId = createdOrder?.id;
  const orderQuery = useQuery({
    queryKey: buyKeys.order(orderId ?? ''),
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      return buyApi.getOrder(orderId);
    },
    enabled: Boolean(orderId && createdOrder?.status === 'pending'),
    initialData: createdOrder,
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? orderPollInterval : false),
  });

  const quote = quoteMutation.data;
  const order = orderQuery.data ?? createdOrder;
  const amountError = validatePurchaseAmount(amount);
  const secondsRemaining = quote ? getSecondsRemaining(quote.expiresAt, now) : 0;
  const quoteExpired = Boolean(quote && secondsRemaining === 0);

  useEffect(() => {
    if (!quote || quoteExpired || !confirmationOpen) {
      return;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 1_000);

    return () => window.clearInterval(timer);
  }, [confirmationOpen, quote, quoteExpired]);

  useEffect(() => {
    if (!order || order.status === 'pending' || invalidatedOrderRef.current === order.id) {
      return;
    }

    invalidatedOrderRef.current = order.id;
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['orders'] }),
      queryClient.invalidateQueries({ queryKey: ['wallet'] }),
    ]);
  }, [order, queryClient]);

  function clearPurchaseResult() {
    requestVersionRef.current += 1;
    idempotencyKeyRef.current = undefined;
    invalidatedOrderRef.current = undefined;
    setConfirmationOpen(false);
    setCreatedOrder(undefined);
    quoteMutation.reset();
    orderMutation.reset();
  }

  function setAmount(value: string) {
    setAmountState(value);
    clearPurchaseResult();
  }

  function setAsset(value: PurchaseAsset) {
    setAssetState(value);
    clearPurchaseResult();
  }

  async function requestQuote() {
    if (amountError || quoteMutation.isPending) {
      return;
    }

    const requestVersion = ++requestVersionRef.current;
    try {
      const result = await quoteMutation.mutateAsync({
        asset,
        fiatAmount: Number(amount),
        fiatCurrency: 'USD',
      });

      if (requestVersion !== requestVersionRef.current) {
        return;
      }

      idempotencyKeyRef.current = undefined;
      setNow(Date.now());
      setConfirmationOpen(true);

      return result;
    } catch {
      return;
    }
  }

  async function confirmPurchase() {
    if (!quote || quoteExpired || orderMutation.isPending) {
      return;
    }

    try {
      const idempotencyKey = idempotencyKeyRef.current ?? createIdempotencyKey();
      idempotencyKeyRef.current = idempotencyKey;
      const result = await orderMutation.mutateAsync({ quoteId: quote.id, idempotencyKey });

      setCreatedOrder(result);
      setConfirmationOpen(false);
    } catch {
      // Keep the same idempotency key so a safe retry cannot create a duplicate order.
    }
  }

  function closeConfirmation() {
    if (!orderMutation.isPending) {
      setConfirmationOpen(false);
    }
  }

  function startNewPurchase() {
    clearPurchaseResult();
    setNow(Date.now());
  }

  return {
    amount,
    amountError,
    asset,
    closeConfirmation,
    confirmationOpen,
    confirmPurchase,
    order,
    orderErrorKey: orderMutation.error
      ? getPurchaseErrorKey(orderMutation.error)
      : orderQuery.error
        ? getPurchaseErrorKey(orderQuery.error)
        : undefined,
    orderLoading: orderMutation.isPending,
    quote,
    quoteErrorKey: quoteMutation.error ? getPurchaseErrorKey(quoteMutation.error) : undefined,
    quoteExpired,
    quoteLoading: quoteMutation.isPending,
    requestQuote,
    secondsRemaining,
    setAmount,
    setAsset,
    startNewPurchase,
  };
}
