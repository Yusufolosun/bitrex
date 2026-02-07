import { useWallet } from '../../contexts/WalletContext';
import { FiUser, FiGlobe } from 'react-icons/fi';

export function WalletInfo() {
  const { isConnected, stxAddress, network } = useWallet();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Wallet Info</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FiUser className="text-gray-500" />
          <span className="text-sm text-gray-600">Address:</span>
          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {stxAddress}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <FiGlobe className="text-gray-500" />
          <span className="text-sm text-gray-600">Network:</span>
          <span className="text-sm font-medium capitalize">{network}</span>
        </div>
      </div>
    </div>
  );
}
