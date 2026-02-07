export const CONTRACTS = {
  VAULT_CORE: 'vault-core',
  STRATEGY_ROUTER: 'strategy-router',
  FEE_MANAGER: 'fee-manager',
  ADAPTER_ZEST: 'adapter-zest',
  ADAPTER_BITFLOW: 'adapter-bitflow',
  ADAPTER_STACKING: 'adapter-stacking',
} as const;

export const CONTRACT_ADDRESSES = {
  devnet: {
    deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
  testnet: {
    deployer: '', // To be filled after testnet deployment
  },
  mainnet: {
    deployer: '', // To be filled after mainnet deployment
  },
} as const;

export const NETWORK_CONFIGS = {
  devnet: {
    name: 'Devnet',
    url: 'http://localhost:3999',
  },
  testnet: {
    name: 'Testnet',
    url: 'https://api.testnet.hiro.so',
  },
  mainnet: {
    name: 'Mainnet',
    url: 'https://api.hiro.so',
  },
} as const;
