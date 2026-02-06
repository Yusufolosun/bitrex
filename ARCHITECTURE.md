# Bitrex Architecture

## Overview
Bitrex is a Bitcoin yield optimization vault that automatically rebalances sBTC across multiple DeFi protocols on Stacks.

## Contract Architecture

### Core Contracts
1. **vault-core.clar** - User deposit/withdrawal management, share token logic
2. **strategy-router.clar** - Allocation decisions and rebalancing coordination
3. **fee-manager.clar** - Performance fee calculation and distribution

### Protocol Adapters
1. **adapter-zest.clar** - Zest Protocol lending integration
2. **adapter-bitflow.clar** - Bitflow DEX liquidity pool integration
3. **adapter-stacking.clar** - PoX stacking integration

### Traits
1. **sip010-trait.clar** - SIP-010 fungible token standard
2. **strategy-trait.clar** - Common interface for protocol adapters

## Data Flow

### Deposit Flow
User → vault-core → strategy-router → adapters → protocols

### Withdrawal Flow
User → vault-core → strategy-router → adapters → protocols → user

### Rebalancing Flow
Keeper/Admin → strategy-router → adapters (withdraw) → adapters (deposit)

## Security Model
- Multi-sig governance (planned Phase 5)
- Emergency pause mechanism
- Per-strategy circuit breakers
- Reentrancy protection on withdrawals
