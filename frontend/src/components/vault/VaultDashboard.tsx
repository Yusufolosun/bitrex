import { useState } from 'react';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { VaultStats } from './VaultStats';
import { UserPosition } from './UserPosition';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { useVaultData } from '../../hooks/useVaultData';
import { useWallet } from '../../contexts/WalletContext';

/**
 * Main vault dashboard component combining statistics and user position
 */
export function VaultDashboard() {
  const { isConnected } = useWallet();
  const { vaultInfo, error, refetchAll, loading } = useVaultData();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const isPaused = vaultInfo?.paused || false;

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vault Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor and manage your Bitcoin deposits</p>
        </div>
        <button
          onClick={refetchAll}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
          title="Refresh data"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error loading vault data</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Paused warning */}
      {isPaused && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Vault Paused</p>
              <p className="text-sm text-yellow-700 mt-1">
                Deposits and withdrawals are temporarily disabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vault statistics */}
      <VaultStats />

      {/* User position */}
      {isConnected && <UserPosition />}

      {/* Action buttons */}
      {isConnected && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              disabled={isPaused}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deposit BTC
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={isPaused}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw BTC
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={refetchAll}
      />
      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={refetchAll}
      />
    </div>
  );
}
