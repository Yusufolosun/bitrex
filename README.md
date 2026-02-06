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
