import { useWallet } from '../../contexts/WalletContext';
import type { NetworkType } from '../../types';

export function NetworkSwitcher() {
  const { network, switchNetwork } = useWallet();

  const networks: NetworkType[] = ['devnet', 'testnet', 'mainnet'];

  return (
    <div className="flex gap-2">
      {networks.map((net) => (
        <button
          key={net}
          onClick={() => switchNetwork(net)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            network === net
              ? 'bg-stacks-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {net.charAt(0).toUpperCase() + net.slice(1)}
        </button>
      ))}
    </div>
  );
}
