# Bitrex Transaction Generator

Automated script for generating multiple on-chain transactions to Bitrex smart contracts on the Stacks blockchain.

## 📋 Overview

This tool enables you to execute multiple contract calls efficiently, perfect for:
- Testing contract interactions
- Generating transaction history
- Automating routine operations
- Budget-controlled transaction generation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Stacks wallet with sufficient STX balance
- Wallet private key or mnemonic phrase

### Installation

```bash
cd scripts/transactions
npm install
```

### Configuration

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Edit `.env` with your settings:**

```env
STACKS_NETWORK=mainnet
PRIVATE_KEY=your_private_key_here
SENDER_ADDRESS=your_stacks_address_here
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
TOTAL_BUDGET_STX=2.5
TARGET_TRANSACTION_COUNT=40
```

3. **Run the script:**
```bash
npm start
```

---

## 📚 Available Contracts & Functions

### 1️⃣ Bitrex Vault (`bitrex-vault`)

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault`

#### Write Functions

##### `deposit(amount: uint)`
Deposit assets into the vault and receive shares.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
```

**Parameters:**
- `amount` - Amount to deposit (in micro-units, 1 STX = 1,000,000 micro-STX)

**Requirements:**
- Vault must not be paused
- Amount must be > 0
- Amount must meet minimum deposit requirement

---

##### `withdraw(shares: uint)`
Withdraw assets by burning vault shares.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=withdraw
FUNCTION_ARGS=[{"type":"uint","value":"500000"}]
```

**Parameters:**
- `shares` - Amount of shares to burn

**Requirements:**
- Vault must not be paused
- Must have sufficient shares
- Shares must be > 0

---

##### `update-config(key: string-ascii, value: uint)` [Admin Only]
Update vault configuration parameters.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=update-config
FUNCTION_ARGS=[{"type":"string","value":"min-deposit"},{"type":"uint","value":"200000"}]
```

**Parameters:**
- `key` - Configuration key (e.g., "min-deposit", "reserve-ratio")
- `value` - New configuration value

**Requirements:**
- Only contract owner can call
- Valid configuration key

---

##### `toggle-pause()` [Admin Only]
Pause or unpause the vault.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=toggle-pause
FUNCTION_ARGS=[]
```

**Requirements:**
- Only contract owner can call

---

### 2️⃣ Strategy Router (`bitrex-strategy-router`)

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router`

#### Write Functions

##### `register-strategy(strategy-id, adapter, risk-score, target-pct)` [Admin Only]
Register a new investment strategy.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=register-strategy
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"},{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.adapter-zest"},{"type":"uint","value":"500"},{"type":"uint","value":"3000"}]
```

**Parameters:**
- `strategy-id` - Unique identifier for the strategy
- `adapter` - Principal address of the adapter contract
- `risk-score` - Risk score (0-10000)
- `target-pct` - Target allocation percentage (basis points, max 10000)

**Requirements:**
- Only contract owner can call
- Target percentage <= 10000

---

##### `deactivate-strategy(strategy-id)` [Admin Only]
Deactivate an existing strategy.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=deactivate-strategy
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"}]
```

**Parameters:**
- `strategy-id` - Strategy to deactivate

**Requirements:**
- Only contract owner can call
- Strategy must exist

---

##### `update-target-allocation(strategy-id, new-target)` [Admin Only]
Update strategy target allocation.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=update-target-allocation
FUNCTION_ARGS=[{"type":"string","value":"zest-lending"},{"type":"uint","value":"4000"}]
```

**Parameters:**
- `strategy-id` - Strategy to update
- `new-target` - New target allocation (basis points)

**Requirements:**
- Only contract owner can call
- New target <= 10000

---

##### `allocate-capital(amount)` 
Allocate capital to strategies.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
```

**Parameters:**
- `amount` - Amount to allocate

---

##### `free-capital(amount)`
Free capital from strategies.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=free-capital
FUNCTION_ARGS=[{"type":"uint","value":"2000000"}]
```

**Parameters:**
- `amount` - Amount to free

---

##### `rebalance()` [Admin Only]
Trigger portfolio rebalancing.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=rebalance
FUNCTION_ARGS=[]
```

**Requirements:**
- Only contract owner can call
- Minimum rebalance interval must have passed

---

##### `update-rebalance-config(threshold, interval)` [Admin Only]
Update rebalancing parameters.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=update-rebalance-config
FUNCTION_ARGS=[{"type":"uint","value":"500"},{"type":"uint","value":"144"}]
```

**Parameters:**
- `threshold` - Rebalance threshold (basis points)
- `interval` - Minimum blocks between rebalances

**Requirements:**
- Only contract owner can call

---

### 3️⃣ Fee Manager (`fee-manager`)

**Contract:** `SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager`

#### Write Functions

##### `calculate-performance-fee(current-value)`
Calculate and accumulate performance fees.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
```

**Parameters:**
- `current-value` - Current total value of the vault

**Note:** This is a public function that can be called by anyone.

---

##### `update-fee-rate(new-rate)` [Admin Only]
Update the performance fee rate.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=update-fee-rate
FUNCTION_ARGS=[{"type":"uint","value":"150"}]
```

**Parameters:**
- `new-rate` - New fee rate in basis points (max 1000 = 10%)

**Requirements:**
- Only contract owner can call
- New rate <= 1000

---

##### `claim-fees(recipient)` [Admin Only]
Claim accumulated fees.

**Configuration:**
```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=claim-fees
FUNCTION_ARGS=[{"type":"principal","value":"SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193"}]
```

**Parameters:**
- `recipient` - Principal to receive fees

**Requirements:**
- Only contract owner can call
- Fees must be > 0

---

## 🎯 Common Use Cases

### Use Case 1: Generate 40 Deposit Transactions

For testing vault deposit functionality:

```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
CONTRACT_FUNCTION=deposit
FUNCTION_ARGS=[{"type":"uint","value":"1000000"}]
TARGET_TRANSACTION_COUNT=40
TOTAL_BUDGET_STX=2.5
TRANSACTION_DELAY_MS=120000
```

**Cost:** ~0.0625 STX per transaction

---

### Use Case 2: Test Performance Fee Calculations

Generate fee calculation calls:

```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.fee-manager
CONTRACT_FUNCTION=calculate-performance-fee
FUNCTION_ARGS=[{"type":"uint","value":"10000000"}]
TARGET_TRANSACTION_COUNT=40
TOTAL_BUDGET_STX=2.5
```

---

### Use Case 3: Multiple Capital Allocations

Test portfolio allocation:

```env
CONTRACT_ADDRESS=SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-strategy-router
CONTRACT_FUNCTION=allocate-capital
FUNCTION_ARGS=[{"type":"uint","value":"5000000"}]
TARGET_TRANSACTION_COUNT=10
TOTAL_BUDGET_STX=1.0
```

---

## ⚙️ Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STACKS_NETWORK` | Yes | `mainnet` | Network: `mainnet` or `testnet` |
| `PRIVATE_KEY` | Yes* | - | Wallet private key (hex) |
| `WALLET_MNEMONIC` | Yes* | - | 24-word seed phrase |
| `SENDER_ADDRESS` | Yes | - | Your Stacks address |
| `CONTRACT_ADDRESS` | Yes | - | Contract principal |
| `CONTRACT_FUNCTION` | Yes | - | Function name to call |
| `FUNCTION_ARGS` | Yes | `[]` | JSON array of arguments |
| `TOTAL_BUDGET_STX` | No | `2.5` | Total STX budget |
| `TARGET_TRANSACTION_COUNT` | No | `40` | Number of transactions |
| `TRANSACTION_DELAY_MS` | No | `120000` | Delay between txs (ms) |
| `MAX_RETRIES` | No | `3` | Retry attempts |
| `AUTO_CONFIRM` | No | `false` | Skip confirmation |
| `DRY_RUN` | No | `false` | Simulate without executing |
| `SAVE_RESULTS` | No | `true` | Save results to JSON |

*Either `PRIVATE_KEY` or `WALLET_MNEMONIC` required, not both.

---

## 📊 Output & Results

### Console Output

```
🚀 Bitrex Transaction Generator
══════════════════════════════════════════════════════════════════════
Network:           mainnet
Sender Address:    SP1M46W6...
Contract:          SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault
Function:          deposit
Target Txs:        40
Budget:            2.5 STX
Delay:             120s between transactions
══════════════════════════════════════════════════════════════════════

✓ [1/40] TX: 0xabc123... | Fee: 0.062500 STX | Nonce: 42
✓ [2/40] TX: 0xdef456... | Fee: 0.062500 STX | Nonce: 43
...

📊 TRANSACTION SUMMARY
══════════════════════════════════════════════════════════════════════
Total Attempted:   40
Successful:        40
Failed:            0
Success Rate:      100.0%
Total Cost:        2.500000 STX
Remaining Budget:  0.000000 STX
Duration:          80m 0s
══════════════════════════════════════════════════════════════════════

🔗 Explorer Links:
   Address: https://explorer.hiro.so/address/SP1M46W6...?chain=mainnet
   First TX: https://explorer.hiro.so/txid/0xabc123...?chain=mainnet

💾 Results saved to: transaction-results-2026-02-11T10-30-00-000Z.json
```

### Saved Results

Results are automatically saved to `transaction-results-{timestamp}.json`:

```json
{
  "config": {
    "network": "mainnet",
    "contract": "SP1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK0DYG193.bitrex-vault",
    "function": "deposit",
    "functionArgs": [{"type":"uint","value":"1000000"}],
    "targetCount": 40,
    "budget": 2.5
  },
  "summary": {
    "successful": 40,
    "failed": 0,
    "totalCost": 2.5,
    "duration": 4800,
    "successRate": 100
  },
  "transactions": [
    {
      "index": 0,
      "txId": "0xabc123...",
      "fee": 0.0625,
      "nonce": 42,
      "timestamp": 1707649800000
    }
  ]
}
```

---

## 🛡️ Safety Features

### Pre-Execution Checks
- ✅ Configuration validation
- ✅ Address format verification
- ✅ Balance checking
- ✅ Fee calculation
- ✅ Budget verification

### During Execution
- ✅ Nonce management
- ✅ Automatic retry on nonce errors
- ✅ Graceful error handling
- ✅ Progress tracking
- ✅ Real-time cost monitoring

### Post-Execution
- ✅ Comprehensive reporting
- ✅ Transaction history logging
- ✅ Explorer links generation
- ✅ JSON results export

### User Controls
- ✅ 5-second confirmation delay (unless `AUTO_CONFIRM=true`)
- ✅ Ctrl+C interrupt support
- ✅ Dry-run mode for testing
- ✅ Budget limits

---

## 🔧 Advanced Usage

### Dry Run Mode

Test configuration without executing:

```bash
DRY_RUN=true npm start
```

### Auto-Confirm Mode

Skip the 5-second confirmation:

```env
AUTO_CONFIRM=true
```

### Using Mnemonic Instead of Private Key

```env
# Comment out PRIVATE_KEY
# PRIVATE_KEY=...

# Add mnemonic
WALLET_MNEMONIC=your 24 word seed phrase here
```

### Custom Delay Between Transactions

Adjust based on network conditions:

```env
# 2 minutes (default)
TRANSACTION_DELAY_MS=120000

# 1 minute (faster, but may hit rate limits)
TRANSACTION_DELAY_MS=60000

# 5 minutes (safer for congested network)
TRANSACTION_DELAY_MS=300000
```

---

## 🚨 Troubleshooting

### "Missing required configuration"
**Solution:** Ensure all required fields in `.env` are filled.

### "Invalid contract address format"
**Solution:** Verify address format: `SPXXX...XXX.contract-name`

### "Insufficient balance"
**Solution:** Ensure wallet has more than `TOTAL_BUDGET_STX` + 10% buffer.

### "Transaction failed: nonce too low"
**Solution:** Script will auto-retry with updated nonce. If persists, check for pending transactions.

### "Function execution error"
**Solution:** 
- Verify function name spelling
- Check argument types and values
- Ensure you meet function requirements (admin, balance, etc.)

### Network timeouts
**Solution:** Increase `TRANSACTION_DELAY_MS` or reduce `TARGET_TRANSACTION_COUNT`.

---

## 🔐 Security Best Practices

### ⚠️ CRITICAL: Never Commit Sensitive Files

The following are automatically ignored by `.gitignore`:
- `.env` (contains private keys)
- `transaction-results-*.json` (may contain transaction data)
- `wallet-*.json`
- `*-private.json`

### Secure Private Key Storage

**DO:**
- ✅ Use `.env` file (git-ignored)
- ✅ Use hardware wallets when possible
- ✅ Keep private keys encrypted
- ✅ Use separate wallets for testing

**DON'T:**
- ❌ Commit `.env` to git
- ❌ Share private keys in chat/email
- ❌ Use deployer wallet for testing
- ❌ Store keys in plain text outside `.env`

### Pre-Deployment Checklist

- [ ] `.env` contains correct network (`mainnet` vs `testnet`)
- [ ] Wallet has sufficient balance
- [ ] Contract address is verified
- [ ] Function name is correct
- [ ] Arguments are properly formatted
- [ ] Budget is reasonable
- [ ] Using non-deployer wallet
- [ ] `.gitignore` is up to date

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review error messages carefully
3. Test with `DRY_RUN=true` first
4. Verify contract on Stacks Explorer
5. Check transaction details on Explorer

---

## 📜 License

MIT License - See project root for details.

---

## 🙏 Acknowledgments

Built for the Bitrex DeFi protocol on Stacks blockchain.
