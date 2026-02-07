import { useMemo } from 'react';
import { principalCV } from '@stacks/transactions';
import { useContractRead } from './useContractRead';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_ADDRESSES, CONTRACTS } from '../constants/contracts';
import type { VaultInfo, UserVaultData } from '../types';

/**
 * Transform raw vault info from contract response
 */
function transformVaultInfo(response: any): VaultInfo {
  const data = response.value;
  
  return {
    totalShares: BigInt(data['total-shares']?.value || '0'),
    totalAssets: BigInt(data['total-assets']?.value || '0'),
    sharePrice: BigInt(data['share-price']?.value || '1000000'), // Default 1:1 ratio
    paused: data.paused?.value === true,
    contractVersion: BigInt(data['contract-version']?.value || '1'),
  };
}

/**
 * Transform raw user shares from contract response
 */
function transformUserShares(response: any): bigint {
  if (response.type === 'uint') {
    return BigInt(response.value);
  }
  if (response.value?.value) {
    return BigInt(response.value.value);
  }
  return BigInt(0);
}

/**
 * Hook to fetch vault information and user position
 * @returns Vault data, user data, loading states, and refetch functions
 */
export function useVaultData() {
  const { address, network, isConnected } = useWallet();
  const contractAddress = CONTRACT_ADDRESSES[network];

  // Fetch vault info (total shares, assets, share price, paused status)
  const {
    data: vaultInfo,
    loading: vaultLoading,
    error: vaultError,
    refetch: refetchVault,
  } = useContractRead<VaultInfo>(
    {
      contractAddress,
      contractName: CONTRACTS.VAULT_CORE,
      functionName: 'get-vault-info',
      functionArgs: [],
      enabled: true,
    },
    transformVaultInfo
  );

  // Fetch user shares (only if wallet is connected)
  const {
    data: userShares,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useContractRead<bigint>(
    {
      contractAddress,
      contractName: CONTRACTS.VAULT_CORE,
      functionName: 'get-user-shares',
      functionArgs: address ? [principalCV(address)] : [],
      enabled: isConnected && !!address,
    },
    transformUserShares
  );

  // Calculate user vault value based on shares and share price
  const userVaultData: UserVaultData | null = useMemo(() => {
    if (!userShares || !vaultInfo) return null;

    const value = (userShares * vaultInfo.sharePrice) / BigInt(1_000_000);
    
    return {
      shares: userShares,
      value,
    };
  }, [userShares, vaultInfo]);

  // Refetch all data
  const refetchAll = async () => {
    await Promise.all([refetchVault(), refetchUser()]);
  };

  return {
    vaultInfo,
    userVaultData,
    loading: vaultLoading || userLoading,
    vaultLoading,
    userLoading,
    error: vaultError || userError,
    refetchAll,
    refetchVault,
    refetchUser,
  };
}
