# Bitrex Frontend

Production-grade React frontend for Bitrex, a Bitcoin yield optimization vault built on the Stacks blockchain.

## Overview

This frontend application provides a user interface for interacting with Bitrex smart contracts, allowing users to:

- Connect their Stacks wallet (Hiro, Xverse, Leather)
- View vault statistics (TVL, share price, APY)
- Monitor their personal vault position
- Deposit BTC into the vault
- Withdraw BTC from the vault
- Switch between networks (Devnet, Testnet, Mainnet)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Stacks.js (@stacks/connect, @stacks/transactions)
- **Icons**: React Icons (Feather)
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   └── StatCard.tsx
│   ├── vault/           # Vault-specific components
│   │   ├── VaultDashboard.tsx
│   │   ├── VaultStats.tsx
│   │   ├── UserPosition.tsx
│   │   ├── DepositModal.tsx
│   │   └── WithdrawModal.tsx
│   └── wallet/          # Wallet integration components
│       ├── ConnectButton.tsx
│       ├── NetworkSwitcher.tsx
│       └── WalletInfo.tsx
├── contexts/
│   └── WalletContext.tsx    # Global wallet state
├── hooks/
│   ├── useContractRead.ts   # Generic contract read hook
│   └── useVaultData.ts      # Vault-specific data hook
├── utils/
│   └── contracts.ts         # Contract interaction utilities
├── types/
│   └── index.ts             # TypeScript type definitions
├── constants/
│   └── contracts.ts         # Contract addresses and configs
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- A Stacks wallet browser extension (Hiro, Xverse, or Leather)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Development

### Environment Variables

The application uses different contract addresses for each network:

- **Devnet**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`
- **Testnet**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`
- **Mainnet**: `SP000000000000000000002Q6VF78` (placeholder)

Network configurations are defined in `src/constants/contracts.ts`.

### Contract Integration

The application interacts with the following Clarity contracts:

- `vault-core`: Main vault logic for deposits, withdrawals, and share management
- `strategy-router`: Strategy allocation and management
- `fee-manager`: Fee collection and distribution

Contract interaction is handled through:

1. **Read Operations**: Use `useContractRead` hook or `useVaultData` for vault-specific queries
2. **Write Operations**: Use `openContractCall` from `@stacks/connect` in modal components

### Network Switching

Users can switch between three networks:

- **Devnet** (localhost:3999): Local development with Clarinet
- **Testnet**: Stacks testnet
- **Mainnet**: Stacks production network

Network switching is managed by `WalletContext` and persisted across sessions.

## Testing

### Local Development with Clarinet

1. Start Clarinet console in the project root:
```bash
cd ..
clarinet console
```

2. Switch frontend to Devnet network
3. Use test accounts from `settings/Simnet.toml`

### Testnet Deployment

Deploy contracts to testnet:
```bash
cd ..
clarinet deployments apply -p deployments/testnet.yaml
```

Update contract addresses in `src/constants/contracts.ts` after deployment.

## Key Components

### WalletContext

Global state management for wallet connection, providing:
- Wallet address and connection status
- Network switching functionality  
- Address management for different networks

### VaultDashboard

Main dashboard component displaying:
- Vault statistics overview
- User position and balance
- Quick action buttons for deposit/withdraw
- Real-time data refresh

### DepositModal / WithdrawModal

Transaction modals for:
- Amount input validation
- Transaction submission via Stacks Connect
- Success/error handling
- Data refresh on completion

## Styling

Tailwind CSS with custom color palette:

- **Bitcoin colors**: `bitcoin-50` through `bitcoin-900` (orange gradient)
- **Stacks colors**: `stacks-500`, `stacks-600`, `stacks-700` (purple)

Global styles defined in `index.css` include:
- Button classes: `btn-primary`, `btn-secondary`
- Card class: `card`
- Container: `container`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Stacks wallet extensions required for transaction signing.

## Troubleshooting

### Wallet Not Connecting

1. Ensure wallet extension is installed and unlocked
2. Check that you're on the correct network
3. Refresh the page and try again

### Contract Read Errors

1. Verify contracts are deployed to the selected network
2. Check contract addresses in `src/constants/contracts.ts`
3. Ensure network configuration URLs are correct

### Transaction Failures

1. Check wallet balance (need STX for gas fees)
2. Verify vault is not paused (check dashboard warning)
3. Review browser console for detailed error messages

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

