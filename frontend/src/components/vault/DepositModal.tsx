import { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { openContractCall } from '@stacks/connect';
import { useWallet } from '../../contexts/WalletContext';
import { buildDepositArgs, convertToMicroUnits } from '../../utils/contracts';
import { NETWORK_CONFIGS } from '../../constants/contracts';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal component for depositing BTC into the vault
 */
export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const { network } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    setError(null);
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const microAmount = convertToMicroUnits(numAmount);
      const txOptions = buildDepositArgs(microAmount, network);
      const networkConfig = NETWORK_CONFIGS[network];

      await openContractCall({
        ...txOptions,
        network: networkConfig.network,
        onFinish: (data) => {
          console.log('Deposit transaction submitted:', data.txId);
          setAmount('');
          setLoading(false);
          onSuccess?.();
          onClose();
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit deposit';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Deposit BTC</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (BTC)
            </label>
            <input
              id="deposit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.000001"
              min="0"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bitcoin-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2">You will receive vault shares equal to your deposit amount.</p>
            <p>Current share price: 1 BTC = 1 Share</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t">
          <button
            onClick={handleClose}
            disabled={loading}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading || !amount}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}
