import { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { openContractCall } from '@stacks/connect';
import { useWallet } from '../../contexts/WalletContext';
import { useVaultData } from '../../hooks/useVaultData';
import { buildWithdrawArgs, convertToMicroUnits, formatFromMicroUnits } from '../../utils/contracts';
import { NETWORK_CONFIGS } from '../../constants/contracts';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal component for withdrawing BTC from the vault
 */
export function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const { network } = useWallet();
  const { userVaultData } = useVaultData();
  const [shares, setShares] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const userShares = userVaultData?.shares || 0;
  const maxShares = formatFromMicroUnits(userShares);

  const handleWithdraw = async () => {
    setError(null);
    
    const numShares = parseFloat(shares);
    if (isNaN(numShares) || numShares <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const microShares = convertToMicroUnits(numShares);
    if (microShares > userShares) {
      setError(`Insufficient shares. You have ${maxShares} shares available.`);
      return;
    }

    setLoading(true);

    try {
      const txOptions = buildWithdrawArgs(microShares, network);
      const networkConfig = NETWORK_CONFIGS[network];

      await openContractCall({
        ...txOptions,
        network: networkConfig.network,
        onFinish: (data) => {
          console.log('Withdraw transaction submitted:', data.txId);
          setShares('');
          setLoading(false);
          onSuccess?.();
          onClose();
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit withdrawal';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setShares(maxShares);
  };

  const handleClose = () => {
    if (!loading) {
      setShares('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Withdraw BTC</h3>
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
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="withdraw-shares" className="block text-sm font-medium text-gray-700">
                Shares to Withdraw
              </label>
              <button
                onClick={handleMaxClick}
                disabled={loading}
                className="text-sm text-bitcoin-600 hover:text-bitcoin-700 font-medium disabled:opacity-50"
              >
                MAX
              </button>
            </div>
            <input
              id="withdraw-shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0.00"
              step="0.000001"
              min="0"
              max={maxShares}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bitcoin-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-1">Available: {maxShares} shares</p>
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
            <p className="mb-2">You will receive BTC equal to your shares value.</p>
            <p>Current share price: 1 Share = 1 BTC</p>
            {shares && parseFloat(shares) > 0 && (
              <p className="mt-2 font-semibold text-gray-900">
                You will receive: ~{shares} BTC
              </p>
            )}
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
            onClick={handleWithdraw}
            disabled={loading || !shares || parseFloat(shares) <= 0}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}
