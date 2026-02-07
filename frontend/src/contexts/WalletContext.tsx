import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';
import type { NetworkType } from '../types';

interface WalletContextType {
  userSession: UserSession;
  userData: any | null;
  isConnected: boolean;
  network: NetworkType;
  stxAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchNetwork: (network: NetworkType) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [network, setNetwork] = useState<NetworkType>('devnet');
  const [isConnected, setIsConnected] = useState(false);
  const [stxAddress, setStxAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setUserData(data);
      setIsConnected(true);
      
      const address = getAddressForNetwork(data, network);
      setStxAddress(address);
    }
  }, [network]);

  const getAddressForNetwork = (userData: any, net: NetworkType): string => {
    if (!userData) return '';
    
    const profile = userData.profile;
    if (net === 'mainnet') {
      return profile.stxAddress.mainnet;
    } else {
      return profile.stxAddress.testnet;
    }
  };

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Bitrex',
        icon: window.location.origin + '/bitrex-logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        setIsConnected(true);
        
        const address = getAddressForNetwork(data, network);
        setStxAddress(address);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
    setIsConnected(false);
    setStxAddress(null);
  };

  const switchNetwork = (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
    if (userData) {
      const address = getAddressForNetwork(userData, newNetwork);
      setStxAddress(address);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        userSession,
        userData,
        isConnected,
        network,
        stxAddress,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
