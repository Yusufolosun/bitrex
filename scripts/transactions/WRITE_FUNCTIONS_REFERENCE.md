# 📝 Write Functions Quick Reference

Quick lookup for all write functions in Bitrex contracts.

## 🏦 Bitrex Vault

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault`

| Function | Arguments | Admin Only | Description |
|----------|-----------|------------|-------------|
| `deposit` | `(amount uint)` | ❌ | Deposit assets, receive shares |
| `withdraw` | `(shares uint)` | ❌ | Burn shares, receive assets |
| `update-config` | `(key string-ascii) (value uint)` | ✅ | Update configuration |
| `toggle-pause` | None | ✅ | Pause/unpause vault |
| `transfer-ownership` | `(new-owner principal)` | ✅ | Transfer contract ownership |

### Example Configurations

**Deposit 1 STX:**
```env
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
```

**Withdraw 500,000 shares:**
```env
CONTRACT_FUNCTION=withdraw
FUNCTION_ARGS=[{"type":"uint","value":"500000"}]
```

**Update min deposit:**
```env
CONTRACT_FUNCTION=update-config
FUNCTION_ARGS=[{"type":"string","value":"min-deposit"},{"type":"uint","value":"200000"}]
```

---

## 🔀 Strategy Router

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router`

| Function | Arguments | Admin Only | Description |
|----------|-----------|------------|-------------|
| `register-strategy` | `(id string) (adapter principal) (risk uint) (target uint)` | ✅ | Register new strategy |
| `deactivate-strategy` | `(strategy-id string)` | ✅ | Deactivate strategy |
| `update-target-allocation` | `(strategy-id string) (new-target uint)` | ✅ | Update allocation target |
| `allocate-capital` | `(amount uint)` | ❌ | Allocate capital |
| `free-capital` | `(amount uint)` | ❌ | Free capital |
| `rebalance` | None | ✅ | Trigger rebalance |
| `update-rebalance-config` | `(threshold uint) (interval uint)` | ✅ | Update rebalance params |
| `transfer-ownership` | `(new-owner principal)` | ✅ | Transfer ownership |

### Example Configurations

**Register Zest strategy:**
```env
CONTRACT_FUNCTION=register-strategy
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"},{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.adapter-zest"},{"type":"uint","value":"500"},{"type":"uint","value":"3000"}]
```

**Allocate 5 STX:**
```env
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
```

**Trigger rebalance:**
```env
CONTRACT_FUNCTION=rebalance
FUNCTION_ARGS=[]
```

---

## 💰 Fee Manager

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager`

| Function | Arguments | Admin Only | Description |
|----------|-----------|------------|-------------|
| `calculate-performance-fee` | `(current-value uint)` | ❌ | Calculate fees |
| `update-fee-rate` | `(new-rate uint)` | ✅ | Update fee rate |
| `claim-fees` | `(recipient principal)` | ✅ | Claim accumulated fees |
| `transfer-ownership` | `(new-owner principal)` | ✅ | Transfer ownership |

### Example Configurations

**Calculate fees:**
```env
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
```

**Update fee rate to 1.5%:**
```env
CONTRACT_FUNCTION=update-fee-rate
FUNCTION_ARGS=[{"type":"uint","value":"150"}]
```

**Claim fees:**
```env
CONTRACT_FUNCTION=claim-fees
FUNCTION_ARGS=[{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193"}]
```

---

## 🎯 Recommended Test Scenarios

### Scenario 1: Basic Vault Operations (Non-Admin)
```env
# Test deposits
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
TARGET_TRANSACTION_COUNT=20
```

### Scenario 2: Fee Calculations (Non-Admin)
```env
# Test performance fee calculations
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
TARGET_TRANSACTION_COUNT=40
```

### Scenario 3: Capital Allocation (Non-Admin)
```env
# Test capital allocation
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
TARGET_TRANSACTION_COUNT=15
```

---

## ⚠️ Important Notes

### Admin-Only Functions
Functions marked with ✅ in "Admin Only" column can only be called by the contract owner. Attempting to call these with a non-admin wallet will fail.

### Gas Costs
- Simple read-only calls: ~0.01 STX
- Write operations: 0.01-0.1 STX
- Complex operations: 0.1-0.5 STX

### Argument Types
- `uint` - Unsigned integer (use for amounts, numbers)
- `string` - ASCII string (use for identifiers, keys)
- `principal` - Stacks address (use for contract/wallet addresses)

### Amount Units
- All amounts in micro-units
- 1 STX = 1,000,000 micro-STX
- Example: 2.5 STX = 2500000

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd scripts/transactions
npm install

# Configure
cp .env.example .env
# Edit .env with your settings

# Test with dry run
DRY_RUN=true npm start

# Execute for real
npm start
```
