export interface VaultInfo {
  totalShares: bigint;
  totalAssets: bigint;
  sharePrice: bigint;
  paused: boolean;
  contractVersion: bigint;
}

export interface UserVaultData {
  shares: bigint;
  value: bigint;
}

export interface StrategyInfo {
  name: string;
  riskScore: bigint;
  active: boolean;
  currentAllocation?: bigint;
  targetPercentage?: bigint;
  apy?: bigint;
}

export interface TransactionStatus {
  txId: string;
  status: 'pending' | 'success' | 'failed';
  type: 'deposit' | 'withdraw' | 'rebalance';
  timestamp: number;
}

export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
