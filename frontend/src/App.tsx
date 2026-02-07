import { WalletProvider } from './contexts/WalletContext';
import { ConnectButton } from './components/wallet/ConnectButton';
import { NetworkSwitcher } from './components/wallet/NetworkSwitcher';
import { WalletInfo } from './components/wallet/WalletInfo';
import { useWallet } from './contexts/WalletContext';

function Dashboard() {
  const { isConnected } = useWallet();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Bitrex Vault</h2>
        <p className="text-gray-600">Automated Bitcoin yield optimization on Stacks</p>
      </div>

      {!isConnected ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-6">Connect your wallet to view vault dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn-primary w-full">Deposit BTC</button>
              <button className="btn-secondary w-full">Withdraw BTC</button>
            </div>
          </div>
          <WalletInfo />
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-bitcoin-600 to-bitcoin-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold">Bitrex</h1>
          </div>

          <div className="flex items-center gap-4">
            <NetworkSwitcher />
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        
        <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
          © 2026 Bitrex. Built on Stacks.
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
