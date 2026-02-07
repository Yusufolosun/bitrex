import { useWallet } from '../../contexts/WalletContext';

export function ConnectButton() {
  const { isConnected, stxAddress, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && stxAddress) {
    return (
      <button
        onClick={disconnectWallet}
        className="btn-secondary flex items-center gap-2"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        {formatAddress(stxAddress)}
      </button>
    );
  }

  return (
    <button onClick={connectWallet} className="btn-primary">
      Connect Wallet
    </button>
  );
}
