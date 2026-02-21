import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';

interface OrderFormProps {
  selectedCrypto?: string;
  currentPrice?: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ selectedCrypto = 'BTC', currentPrice = 45000 }) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState(currentPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = (parseFloat(amount) || 0) * (parseFloat(pricePerUnit) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/trades/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crypto: selectedCrypto,
          type: orderType,
          amount: parseFloat(amount),
          price: parseFloat(pricePerUnit),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute trade');
      }

      setAmount('');
      alert('Trade executed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setOrderType('buy')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            orderType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setOrderType('sell')}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            orderType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Sell
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Amount ({selectedCrypto})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:border-indigo-600 focus:outline-none"
          step="0.00000001"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Price per Unit (USD)</label>
        <input
          type="number"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          placeholder="0.00"
          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:border-indigo-600 focus:outline-none"
          step="0.01"
        />
      </div>

      <div className="bg-neutral-700/50 rounded-lg p-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Total:</span>
          <span className="font-semibold text-white">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        variant={orderType === 'buy' ? 'success' : 'danger'}
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
      </Button>
    </form>
  );
};
