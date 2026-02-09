import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';

export const CONTRACTS = {
  VAULT: 'bitrex-vault',
  STRATEGY_ROUTER: 'bitrex-strategy-router',
  FEE_MANAGER: 'fee-manager',
  ADAPTER_ZEST: 'adapter-zest',
  ADAPTER_BITFLOW: 'adapter-bitflow',
  ADAPTER_STACKING: 'adapter-stacking',
} as const;

export const CONTRACT_ADDRESSES = {
  devnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  testnet: 'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0', // ✅ Deployed Feb 9, 2026
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
