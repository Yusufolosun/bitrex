# Bitrex - Bitcoin Dual-Yield Optimizer

> Automated yield optimization for sBTC holders on Stacks blockchain

## Overview
Bitrex is a smart contract-based vault system that automatically rebalances user sBTC deposits across multiple yield-generating protocols to maximize returns while minimizing gas costs.

## Features
- 🔄 Automated rebalancing across Zest, Bitflow, and PoX stacking
- 💎 Liquid vault shares (deposit once, earn continuously)
- 📊 Transparent on-chain performance tracking
- 🛡️ Security-first architecture with circuit breakers
- 💰 Low 1% performance fee on profits

## Development Status
🚧 **Phase 2: Smart Contract Development (In Progress)**

## Project Structure
See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Development Setup
```bash
# Install Clarinet
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz

# Run tests
clarinet test

# Check contracts
clarinet check
```

## Testing
- Unit tests for all core functions
- Integration tests for multi-contract flows
- Testnet deployment validation (Phase 4)

## License
MIT

## ��� Security Notes

### Network Configuration
- **NEVER commit `settings/Mainnet.toml` or `settings/Testnet.toml`** to version control
- These files contain wallet mnemonics and are excluded via `.gitignore`
- Use the `.example` template files to create your own configurations
- For mainnet deployments, use hardware wallets or secure key management

### Setup Instructions
1. Copy template files:
```bash
   cp settings/Mainnet.toml.example settings/Mainnet.toml
   cp settings/Testnet.toml.example settings/Testnet.toml
```
2. Replace placeholder mnemonics with your own secure mnemonics
3. **Never share or commit these files**

### Devnet Configuration
- `settings/Devnet.toml` uses publicly known test mnemonics (safe to commit)
- Only use for local development - these wallets have no real value
