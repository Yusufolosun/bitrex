import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, ClarityValue } from '@stacks/transactions';
import { useWallet } from '../contexts/WalletContext';
import { NETWORK_CONFIGS } from '../constants/contracts';

interface UseContractReadResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface ContractReadOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  enabled?: boolean;
}

/**
 * Hook for reading data from Clarity smart contracts
 * @param options Contract read options
 * @param transform Optional function to transform the raw Clarity value
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useContractRead<T = any>(
  options: ContractReadOptions,
  transform?: (value: any) => T
): UseContractReadResult<T> {
  const { network } = useWallet();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contractAddress, contractName, functionName, functionArgs, enabled = true } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const networkConfig = NETWORK_CONFIGS[network];
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        network: networkConfig.network,
        senderAddress: contractAddress,
      });

      const jsonValue = cvToJSON(result);
      const transformedData = transform ? transform(jsonValue) : jsonValue;
      
      setData(transformedData as T);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read contract data';
      setError(errorMessage);
      console.error('Contract read error:', err);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, contractName, functionName, functionArgs, network, enabled, transform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
