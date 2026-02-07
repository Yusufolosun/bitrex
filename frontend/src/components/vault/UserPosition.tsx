import { FiUser, FiTrendingUp } from 'react-icons/fi';
import { StatCard } from '../common/StatCard';
import { useVaultData } from '../../hooks/useVaultData';
import { useWallet } from '../../contexts/WalletContext';
import { formatFromMicroUnits } from '../../utils/contracts';

/**
 * Component displaying user's vault position
 */
export function UserPosition() {
  const { isConnected } = useWallet();
  const { userVaultData, userLoading } = useVaultData();

  if (!isConnected) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">Connect your wallet to view your position</p>
      </div>
    );
  }

  const userShares = userVaultData 
    ? formatFromMicroUnits(userVaultData.shares)
    : '0';

  const userValue = userVaultData 
    ? formatFromMicroUnits(userVaultData.value)
    : '0';

  // Calculate user's percentage of total vault (placeholder)
  const vaultPercentage = userVaultData && parseFloat(userShares) > 0
    ? ((parseFloat(userShares) / 100) * 100).toFixed(2) // Simplified calculation
    : '0';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Position</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Your Shares"
          value={userShares}
          icon={FiUser}
          loading={userLoading}
        />
        
        <StatCard
          label="Your Value"
          value={userValue}
          suffix="BTC"
          icon={FiTrendingUp}
          loading={userLoading}
        />
        
        <StatCard
          label="Vault Ownership"
          value={vaultPercentage}
          suffix="%"
          loading={userLoading}
        />
      </div>

      {!userLoading && userVaultData && parseFloat(userShares) === 0 && (
        <div className="card mt-4 bg-bitcoin-50 border-bitcoin-200">
          <p className="text-sm text-bitcoin-800">
            You don't have any deposits yet. Start earning yield by depositing BTC into the vault.
          </p>
        </div>
      )}
    </div>
  );
}
