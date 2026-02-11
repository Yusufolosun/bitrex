# 📋 Bitrex Write Functions - Complete Reference

## Summary

This document provides complete specifications for all write functions across Bitrex contracts, specifically focusing on functions that modify state (require transaction fees).

**Total Write Functions:** 22  
**Non-Admin Functions:** 8  
**Admin-Only Functions:** 14

---

## 🏦 Bitrex Vault
**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault`

### Non-Admin Write Functions (2)

#### 1. `deposit(amount: uint)` → Response<uint, uint>

**Purpose:** Deposit assets into vault and receive proportional shares

**Parameters:**
- `amount` (uint) - Amount of assets to deposit (micro-units)

**Returns:** Number of shares minted

**Requirements:**
- Vault must not be paused
- Amount must be greater than 0
- Amount must meet minimum deposit threshold

**Example:**
```clarity
(contract-call? .bitrex-vault deposit u1000000)  ;; Deposit 1 STX worth
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
```

**Errors:**
- `ERR-VAULT-PAUSED (u104)` - Vault is paused
- `ERR-ZERO-AMOUNT (u102)` - Amount is zero
- `ERR-INSUFFICIENT-BALANCE (u101)` - Below minimum deposit

---

#### 2. `withdraw(shares: uint)` → Response<uint, uint>

**Purpose:** Burn vault shares and receive proportional assets

**Parameters:**
- `shares` (uint) - Number of shares to burn

**Returns:** Amount of assets withdrawn

**Requirements:**
- Vault must not be paused
- Shares must be greater than 0
- User must have sufficient shares

**Example:**
```clarity
(contract-call? .bitrex-vault withdraw u500000)  ;; Burn 500,000 shares
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=withdraw
FUNCTION_ARGS=[{"type":"uint","value":"500000"}]
```

**Errors:**
- `ERR-VAULT-PAUSED (u104)` - Vault is paused
- `ERR-ZERO-AMOUNT (u102)` - Shares is zero
- `ERR-INSUFFICIENT-BALANCE (u101)` - Insufficient shares

---

### Admin-Only Write Functions (3)

#### 3. `update-config(key: string-ascii, value: uint)` → Response<uint, uint>

**Purpose:** Update vault configuration parameters

**Parameters:**
- `key` (string-ascii 32) - Configuration key
- `value` (uint) - New value

**Common Keys:**
- `"min-deposit"` - Minimum deposit amount
- `"reserve-ratio"` - Reserve ratio (basis points)

**Transaction Config:**
```env
CONTRACT_FUNCTION=update-config
FUNCTION_ARGS=[{"type":"string","value":"min-deposit"},{"type":"uint","value":"200000"}]
```

**Requirements:** Only contract owner

**Errors:**
- `ERR-NOT-AUTHORIZED (u100)` - Not contract owner

---

#### 4. `toggle-pause()` → Response<bool, uint>

**Purpose:** Pause or unpause vault operations

**Parameters:** None

**Returns:** New paused state

**Transaction Config:**
```env
CONTRACT_FUNCTION=toggle-pause
FUNCTION_ARGS=[]
```

**Requirements:** Only contract owner

**Errors:**
- `ERR-NOT-AUTHORIZED (u100)` - Not contract owner

---

#### 5. `transfer-ownership(new-owner: principal)` → Response<principal, uint>

**Purpose:** Transfer contract ownership

**Parameters:**
- `new-owner` (principal) - New owner address

**Transaction Config:**
```env
CONTRACT_FUNCTION=transfer-ownership
FUNCTION_ARGS=[{"type":"principal","value":"SP..."}]
```

**Requirements:** Only contract owner

**Errors:**
- `ERR-NOT-AUTHORIZED (u100)` - Not contract owner

---

## 🔀 Strategy Router
**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router`

### Non-Admin Write Functions (2)

#### 6. `allocate-capital(amount: uint)` → Response<uint, uint>

**Purpose:** Allocate capital to investment strategies

**Parameters:**
- `amount` (uint) - Amount to allocate

**Returns:** Amount allocated

**Example:**
```clarity
(contract-call? .bitrex-strategy-router allocate-capital u5000000)
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
```

**Use Case:** Testing capital allocation mechanisms

---

#### 7. `free-capital(amount: uint)` → Response<uint, uint>

**Purpose:** Free capital from investment strategies

**Parameters:**
- `amount` (uint) - Amount to free

**Returns:** Amount freed

**Example:**
```clarity
(contract-call? .bitrex-strategy-router free-capital u2000000)
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=free-capital
FUNCTION_ARGS=[{"type":"uint","value":"2000000"}]
```

**Use Case:** Testing capital withdrawal from strategies

---

### Admin-Only Write Functions (6)

#### 8. `register-strategy(strategy-id, adapter, risk-score, target-pct)` → Response<string-ascii, uint>

**Purpose:** Register a new investment strategy

**Parameters:**
- `strategy-id` (string-ascii 32) - Unique identifier
- `adapter` (principal) - Adapter contract address
- `risk-score` (uint) - Risk score (0-10000)
- `target-pct` (uint) - Target allocation percentage (basis points, max 10000)

**Example:**
```clarity
(contract-call? .bitrex-strategy-router register-strategy 
  "zest-lending" 
  .adapter-zest 
  u500 
  u3000)
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=register-strategy
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"},{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.adapter-zest"},{"type":"uint","value":"500"},{"type":"uint","value":"3000"}]
```

**Requirements:**
- Only contract owner
- Target percentage ≤ 10000

**Errors:**
- `ERR-NOT-AUTHORIZED (u200)` - Not authorized
- `ERR-INVALID-ALLOCATION (u203)` - Invalid target percentage

---

#### 9. `deactivate-strategy(strategy-id)` → Response<bool, uint>

**Purpose:** Deactivate an existing strategy

**Parameters:**
- `strategy-id` (string-ascii 32) - Strategy to deactivate

**Transaction Config:**
```env
CONTRACT_FUNCTION=deactivate-strategy
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"}]
```

**Requirements:**
- Only contract owner
- Strategy must exist

**Errors:**
- `ERR-NOT-AUTHORIZED (u200)` - Not authorized
- `ERR-STRATEGY-NOT-FOUND (u201)` - Strategy doesn't exist

---

#### 10. `update-target-allocation(strategy-id, new-target)` → Response<uint, uint>

**Purpose:** Update strategy allocation target

**Parameters:**
- `strategy-id` (string-ascii 32) - Strategy to update
- `new-target` (uint) - New target percentage (basis points)

**Transaction Config:**
```env
CONTRACT_FUNCTION=update-target-allocation
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"},{"type":"uint","value":"4000"}]
```

**Requirements:**
- Only contract owner
- New target ≤ 10000

**Errors:**
- `ERR-NOT-AUTHORIZED (u200)` - Not authorized
- `ERR-STRATEGY-NOT-FOUND (u201)` - Strategy doesn't exist
- `ERR-INVALID-ALLOCATION (u203)` - Invalid percentage

---

#### 11. `rebalance()` → Response<bool, uint>

**Purpose:** Trigger portfolio rebalancing

**Parameters:** None

**Transaction Config:**
```env
CONTRACT_FUNCTION=rebalance
FUNCTION_ARGS=[]
```

**Requirements:**
- Only contract owner
- Minimum blocks since last rebalance must have passed

**Errors:**
- `ERR-NOT-AUTHORIZED (u200)` - Not authorized
- `ERR-REBALANCE-THRESHOLD-NOT-MET (u205)` - Too soon to rebalance

---

#### 12. `update-rebalance-config(threshold, interval)` → Response<bool, uint>

**Purpose:** Update rebalancing parameters

**Parameters:**
- `threshold` (uint) - Rebalance threshold (basis points)
- `interval` (uint) - Minimum blocks between rebalances

**Transaction Config:**
```env
CONTRACT_FUNCTION=update-rebalance-config
FUNCTION_ARGS=[{"type":"uint","value":"500"},{"type":"uint","value":"144"}]
```

**Requirements:** Only contract owner

**Errors:**
- `ERR-NOT-AUTHORIZED (u200)` - Not authorized

---

#### 13. `transfer-ownership(new-owner)` → Response<principal, uint>

**Purpose:** Transfer contract ownership

**Parameters:**
- `new-owner` (principal) - New owner address

**Transaction Config:**
```env
CONTRACT_FUNCTION=transfer-ownership
FUNCTION_ARGS=[{"type":"principal","value":"SP..."}]
```

**Requirements:** Only contract owner

---

## 💰 Fee Manager
**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager`

### Non-Admin Write Functions (1)

#### 14. `calculate-performance-fee(current-value)` → Response<uint, uint>

**Purpose:** Calculate and accumulate performance fees based on current vault value

**Parameters:**
- `current-value` (uint) - Current total value of vault

**Returns:** Fee amount calculated

**How it works:**
1. Compares current value to last recorded value
2. Calculates profit (if any)
3. Applies performance fee rate (basis points)
4. Accumulates fees
5. Updates last value

**Example:**
```clarity
(contract-call? .fee-manager calculate-performance-fee u10000000)
```

**Transaction Config:**
```env
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
```

**Use Case:** Public function - anyone can call to trigger fee calculation

**Fee Calculation Formula:**
```
profit = current_value - last_value (if positive)
fee = (profit × fee_rate_bps) / 10000
```

**Default Fee Rate:** 100 bps (1%)

---

### Admin-Only Write Functions (3)

#### 15. `update-fee-rate(new-rate)` → Response<uint, uint>

**Purpose:** Update the performance fee rate

**Parameters:**
- `new-rate` (uint) - New fee rate in basis points (max 1000 = 10%)

**Transaction Config:**
```env
CONTRACT_FUNCTION=update-fee-rate
FUNCTION_ARGS=[{"type":"uint","value":"150"}]
```

**Requirements:**
- Only contract owner
- New rate ≤ 1000 (max 10%)

**Errors:**
- `ERR-NOT-AUTHORIZED (u400)` - Not authorized
- `ERR-INVALID-FEE-RATE (u402)` - Rate exceeds maximum

**Examples:**
- 100 bps = 1%
- 150 bps = 1.5%
- 200 bps = 2%
- 1000 bps = 10% (maximum)

---

#### 16. `claim-fees(recipient)` → Response<uint, uint>

**Purpose:** Claim accumulated performance fees

**Parameters:**
- `recipient` (principal) - Address to receive fees

**Returns:** Amount of fees claimed

**Transaction Config:**
```env
CONTRACT_FUNCTION=claim-fees
FUNCTION_ARGS=[{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193"}]
```

**Requirements:**
- Only contract owner
- Accumulated fees must be > 0

**Errors:**
- `ERR-NOT-AUTHORIZED (u400)` - Not authorized
- `ERR-NO-FEES-AVAILABLE (u401)` - No fees to claim

**Side Effects:**
- Resets accumulated fees to 0
- Updates total fees collected counter

---

#### 17. `transfer-ownership(new-owner)` → Response<principal, uint>

**Purpose:** Transfer contract ownership

**Parameters:**
- `new-owner` (principal) - New owner address

**Transaction Config:**
```env
CONTRACT_FUNCTION=transfer-ownership
FUNCTION_ARGS=[{"type":"principal","value":"SP..."}]
```

**Requirements:** Only contract owner

---

## 🎯 Recommended Test Functions for Non-Admin Wallets

Based on your requirement for 40 transactions with 2.5 STX budget:

### Best Options for Testing

#### Option 1: deposit (Most Realistic)
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
```
**Pros:** Tests core vault functionality, realistic user flow  
**Cons:** Requires actual assets (may need test tokens)

#### Option 2: calculate-performance-fee (Recommended for Testing)
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
```
**Pros:** Public function, no special requirements, safe to call multiple times  
**Cons:** Less realistic user interaction

#### Option 3: allocate-capital
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
```
**Pros:** Tests strategy router functionality  
**Cons:** May require specific vault state

---

## 📊 Function Complexity & Gas Estimates

| Function | Complexity | Est. Gas | Best For |
|----------|-----------|----------|----------|
| `deposit` | Medium | 0.01-0.05 STX | Vault testing |
| `withdraw` | Medium | 0.01-0.05 STX | Vault testing |
| `calculate-performance-fee` | Low | 0.005-0.02 STX | Fee testing |
| `allocate-capital` | Low | 0.005-0.02 STX | Router testing |
| `free-capital` | Low | 0.005-0.02 STX | Router testing |
| `register-strategy` | High | 0.05-0.1 STX | Admin only |
| `rebalance` | High | 0.05-0.15 STX | Admin only |

---

## 🔍 How to Choose the Right Function

### For Transaction History Generation
Choose: `calculate-performance-fee` or `allocate-capital`
- Low gas costs
- Safe to call repeatedly
- No special requirements

### For Realistic Testing
Choose: `deposit` then `withdraw`
- Tests actual user flows
- Requires test assets
- More complex but realistic

### For Admin Testing
Choose: Admin functions (requires deployer wallet)
- Not recommended for non-deployer wallet
- Higher gas costs
- More complex state changes

---

## 💡 Quick Start Recommendation

For your use case (40 transactions, 2.5 STX, non-deployer wallet):

```env
STACKS_NETWORK=mainnet
SENDER_ADDRESS=<YOUR_ADDRESS>
PRIVATE_KEY=<YOUR_KEY>
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
TOTAL_BUDGET_STX=2.5
TARGET_TRANSACTION_COUNT=40
TRANSACTION_DELAY_MS=120000
```

**Why this configuration:**
- ✅ Public function (no admin required)
- ✅ Low gas costs (~0.062 STX per tx)
- ✅ Safe to call repeatedly
- ✅ Tests fee calculation logic
- ✅ Generates transaction history
- ✅ Fits within budget

---

**End of Write Functions Reference**
