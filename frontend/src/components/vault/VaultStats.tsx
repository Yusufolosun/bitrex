import { FiTrendingUp, FiDollarSign, FiPieChart, FiLock } from 'react-icons/fi';
import { StatCard } from '../common/StatCard';
import { useVaultData } from '../../hooks/useVaultData';
import { formatFromMicroUnits } from '../../utils/contracts';

/**
 * Component displaying overall vault statistics
 */
export function VaultStats() {
  const { vaultInfo, vaultLoading } = useVaultData();

  const totalValueLocked = vaultInfo 
    ? formatFromMicroUnits(vaultInfo.totalAssets)
    : '0';

  const totalShares = vaultInfo 
    ? formatFromMicroUnits(vaultInfo.totalShares)
    : '0';

  const sharePrice = vaultInfo 
    ? (vaultInfo.sharePrice / 1_000_000).toFixed(6)
    : '1.000000';

  // Calculate APY (placeholder - would come from strategy data in production)
  const estimatedAPY = '8.5';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Vault Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Value Locked"
          value={totalValueLocked}
          suffix="BTC"
          icon={FiDollarSign}
          loading={vaultLoading}
        />
        
        <StatCard
          label="Total Shares"
          value={totalShares}
          icon={FiPieChart}
          loading={vaultLoading}
        />
        
        <StatCard
          label="Share Price"
          value={sharePrice}
          suffix="BTC"
          icon={FiLock}
          loading={vaultLoading}
        />
        
        <StatCard
          label="Estimated APY"
          value={estimatedAPY}
          suffix="%"
          icon={FiTrendingUp}
          trend={{
            value: '+2.1% this month',
            isPositive: true,
          }}
          loading={vaultLoading}
        />
      </div>
    </div>
  );
}
