# Bitrex - Bitcoin Dual-Yield Optimizer

> Automated yield optimization for sBTC holders on Stacks blockchain

## 🚀 Live on Mainnet

**Deployed**: February 9, 2026  
**Deployer**: `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193`  
**Status**: ✅ All 8 contracts live

### Contract Addresses
- **Vault**: `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault`
- **Strategy Router**: `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router`
- **Fee Manager**: `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager`

[View on Explorer](https://explorer.hiro.so/address/SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193?chain=mainnet) | [Quick Reference](docs/QUICK_REFERENCE.md) | [Full Deployment Details](docs/deployment/MAINNET_DEPLOYMENT.md)

## Overview
Bitrex is a smart contract-based vault system that automatically rebalances user sBTC deposits across multiple yield-generating protocols to maximize returns while minimizing gas costs.

## Features
- 🔄 Automated rebalancing across Zest, Bitflow, and PoX stacking
- 💎 Liquid vault shares (deposit once, earn continuously)
- 📊 Transparent on-chain performance tracking
- 🛡️ Security-first architecture with circuit breakers
- 💰 Low 1% performance fee on profits

## Development Status
✅ **Phase 5: Mainnet Deployment - COMPLETE (Feb 9, 2026)**

All smart contracts successfully deployed to Stacks mainnet. Total deployment cost: 0.14091 STX.

## Deployment Summary

| Contract | Fee (STX) | Status |
|----------|-----------|--------|
| bitrex-vault | 0.04273 | ✅ Live |
| bitrex-strategy-router | 0.03586 | ✅ Live |
| fee-manager | 0.02066 | ✅ Live |
| adapter-zest | 0.01125 | ✅ Live |
| adapter-bitflow | 0.01157 | ✅ Live |
| adapter-stacking | 0.01140 | ✅ Live |
| sip010-trait | 0.00439 | ✅ Live |
| strategy-trait | 0.00305 | ✅ Live |
| **Total** | **0.14091 STX** | |

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

## ⚡ Transaction Automation

Automated transaction generation scripts for interacting with deployed contracts:

```bash
cd scripts/transactions
npm install
cp .env.example .env
# Configure .env with your settings
npm start
```

**Features:**
- Generate 40+ transactions within budget
- Support for all public write functions
- Automatic nonce management and retries
- Comprehensive logging and reporting
- Dry-run mode for testing

📖 **Documentation:**
- [Transaction Script Setup Guide](./TRANSACTION_SCRIPT_SETUP.md)
- [Full Documentation](./scripts/transactions/README.md)
- [Write Functions Reference](./scripts/transactions/WRITE_FUNCTIONS_REFERENCE.md)

## Testing
- Unit tests for all core functions
- Integration tests for multi-contract flows
- Testnet deployment validation (Phase 4)
- Transaction automation scripts (Phase 5+)

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
