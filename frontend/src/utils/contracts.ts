import {
  uintCV,
  principalCV,
  contractPrincipalCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';
import { CONTRACTS, CONTRACT_ADDRESSES } from '../constants/contracts';
import type { NetworkType } from '../types';

/**
 * Build arguments for vault deposit transaction
 * @param amount Amount in micro-STX (1 STX = 1,000,000 micro-STX)
 * @param network Current network
 * @returns Transaction options object
 */
export function buildDepositArgs(amount: number, network: NetworkType) {
  const contractAddress = CONTRACT_ADDRESSES[network];
  
  return {
    contractAddress,
    contractName: CONTRACTS.VAULT_CORE,
    functionName: 'deposit',
    functionArgs: [uintCV(amount)],
    postConditionMode: PostConditionMode.Deny,
    network,
  };
}

/**
 * Build arguments for vault withdrawal transaction
 * @param shares Number of shares to burn
 * @param network Current network
 * @returns Transaction options object
 */
export function buildWithdrawArgs(shares: number, network: NetworkType) {
  const contractAddress = CONTRACT_ADDRESSES[network];
  
  return {
    contractAddress,
    contractName: CONTRACTS.VAULT_CORE,
    functionName: 'withdraw',
    functionArgs: [uintCV(shares)],
    postConditionMode: PostConditionMode.Deny,
    network,
  };
}

/**
 * Build arguments for read-only contract call
 * @param contractName Name of the contract
 * @param functionName Name of the function to call
 * @param functionArgs Array of Clarity values
 * @param network Current network
 * @returns Read-only function call options
 */
export function buildReadOnlyArgs(
  contractName: string,
  functionName: string,
  functionArgs: any[],
  network: NetworkType
) {
  const contractAddress = CONTRACT_ADDRESSES[network];
  
  return {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
  };
}

/**
 * Format micro-units to standard units (e.g., micro-STX to STX)
 * @param microUnits Amount in micro-units
 * @returns Formatted decimal string
 */
export function formatFromMicroUnits(microUnits: number): string {
  return (microUnits / 1_000_000).toFixed(6);
}

/**
 * Convert standard units to micro-units (e.g., STX to micro-STX)
 * @param units Amount in standard units
 * @returns Amount in micro-units
 */
export function convertToMicroUnits(units: number): number {
  return Math.floor(units * 1_000_000);
}
