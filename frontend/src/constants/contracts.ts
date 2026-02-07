import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';

export const CONTRACTS = {
  VAULT_CORE: 'vault-core',
  STRATEGY_ROUTER: 'strategy-router',
  FEE_MANAGER: 'fee-manager',
  ADAPTER_ZEST: 'adapter-zest',
  ADAPTER_BITFLOW: 'adapter-bitflow',
  ADAPTER_STACKING: 'adapter-stacking',
} as const;

export const CONTRACT_ADDRESSES = {
  devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  testnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Update after testnet deployment
  mainnet: 'SP000000000000000000002Q6VF78', // Update after mainnet deployment
} as const;

export const NETWORK_CONFIGS = {
  devnet: {
    name: 'Devnet' as const,
    url: 'http://localhost:3999',
    network: new StacksDevnet(),
  },
  testnet: {
    name: 'Testnet' as const,
    url: 'https://api.testnet.hiro.so',
    network: new StacksTestnet(),
  },
  mainnet: {
    name: 'Mainnet' as const,
    url: 'https://api.hiro.so',
    network: new StacksMainnet(),
  },
} as const;
