import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createIdempotencyKey, getSecondsRemaining } from '@shared/lib';

import { conversionKeys, convertApi, type ConversionOrder } from '../api';
import { getConversionErrorKey, validateConversionAmount } from '../lib';
import type { ConversionAsset } from '../model';

const pollInterval = 2_000;

export function useConversion() {
  const queryClient = useQueryClient();
  const requestVersionRef = useRef(0);
  const idempotencyKeyRef = useRef<string | undefined>(undefined);
  const invalidatedOrderRef = useRef<string | undefined>(undefined);
  const [amount, setAmountState] = useState('1000');
  const [fromAsset, setFromAssetState] = useState<ConversionAsset>('USDT');
  const [toAsset, setToAssetState] = useState<ConversionAsset>('BTC');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ConversionOrder>();
  const [now, setNow] = useState(Date.now());

  const quoteMutation = useMutation({ mutationFn: convertApi.createQuote });
  const orderMutation = useMutation({
    mutationFn: ({ quoteId, idempotencyKey }: { quoteId: string; idempotencyKey: string }) =>
      convertApi.createOrder(quoteId, idempotencyKey),
  });
  const orderId = createdOrder?.id;
  const orderQuery = useQuery({
    queryKey: conversionKeys.order(orderId ?? ''),
    queryFn: () => {
      if (!orderId) throw new Error('Conversion order ID is required');

      return convertApi.getOrder(orderId);
    },
    enabled: Boolean(orderId && createdOrder?.status === 'pending'),
    initialData: createdOrder,
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? pollInterval : false),
  });

  const quote = quoteMutation.data;
  const order = orderQuery.data ?? createdOrder;
  const amountError = validateConversionAmount(amount);
  const secondsRemaining = quote ? getSecondsRemaining(quote.expiresAt, now) : 0;
  const quoteExpired = Boolean(quote && secondsRemaining === 0);

  useEffect(() => {
    if (!quote || quoteExpired || !confirmationOpen) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1_000);

    return () => window.clearInterval(timer);
  }, [confirmationOpen, quote, quoteExpired]);

  useEffect(() => {
    if (!order || order.status === 'pending' || invalidatedOrderRef.current === order.id) return;

    invalidatedOrderRef.current = order.id;
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['wallet'] }),
    ]);
  }, [order, queryClient]);

  function resetResult() {
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
    resetResult();
  }

  function setFromAsset(value: ConversionAsset) {
    setFromAssetState(value);
    if (value === toAsset) setToAssetState(fromAsset);
    resetResult();
  }

  function setToAsset(value: ConversionAsset) {
    setToAssetState(value);
    if (value === fromAsset) setFromAssetState(toAsset);
    resetResult();
  }

  function swapAssets() {
    setFromAssetState(toAsset);
    setToAssetState(fromAsset);
    resetResult();
  }

  async function requestQuote() {
    if (amountError || quoteMutation.isPending) return;

    const requestVersion = ++requestVersionRef.current;

    try {
      await quoteMutation.mutateAsync({
        fromAsset,
        sourceAmount: Number(amount),
        toAsset,
      });

      if (requestVersion !== requestVersionRef.current) return;

      idempotencyKeyRef.current = undefined;
      setNow(Date.now());
      setConfirmationOpen(true);
    } catch {
      // Mutation state exposes the localized error.
    }
  }

  async function confirmConversion() {
    if (!quote || quoteExpired || orderMutation.isPending) return;

    try {
      const idempotencyKey = idempotencyKeyRef.current ?? createIdempotencyKey();
      idempotencyKeyRef.current = idempotencyKey;
      const result = await orderMutation.mutateAsync({ quoteId: quote.id, idempotencyKey });

      setCreatedOrder(result);
      setConfirmationOpen(false);
    } catch {
      // Preserve the key so retrying an uncertain request remains idempotent.
    }
  }

  return {
    amount,
    amountError,
    closeConfirmation: () => !orderMutation.isPending && setConfirmationOpen(false),
    confirmationOpen,
    confirmConversion,
    fromAsset,
    order,
    orderErrorKey: orderMutation.error
      ? getConversionErrorKey(orderMutation.error)
      : orderQuery.error
        ? getConversionErrorKey(orderQuery.error)
        : undefined,
    orderLoading: orderMutation.isPending,
    quote,
    quoteErrorKey: quoteMutation.error ? getConversionErrorKey(quoteMutation.error) : undefined,
    quoteExpired,
    quoteLoading: quoteMutation.isPending,
    requestQuote,
    resetResult,
    secondsRemaining,
    setAmount,
    setFromAsset,
    setToAsset,
    swapAssets,
    toAsset,
  };
}
