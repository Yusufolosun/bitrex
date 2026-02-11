const {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  standardPrincipalCV,
  fetchNonce,
  validateStacksAddress,
} = require('@stacks/transactions');
const { STACKS_MAINNET, STACKS_TESTNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Bitrex Transaction Generator
 * 
 * Generates multiple on-chain transactions to Bitrex smart contracts
 * Supports all public write functions across all contracts
 */

class TransactionGenerator {
  constructor(config) {
    this.config = config;
    this.network = config.network === 'mainnet' 
      ? STACKS_MAINNET 
      : STACKS_TESTNET;
    
    this.results = {
      successful: [],
      failed: [],
      totalCost: 0,
      startTime: Date.now(),
    };
  }

  async initialize() {
    console.log('\n🚀 Bitrex Transaction Generator');
    console.log('═'.repeat(70));
    console.log(`Network:           ${this.config.network}`);
    console.log(`Sender Address:    ${this.config.senderAddress}`);
    console.log(`Contract:          ${this.config.contractAddress}`);
    console.log(`Function:          ${this.config.functionName}`);
    console.log(`Target Txs:        ${this.config.targetCount}`);
    console.log(`Budget:            ${this.config.totalBudget} STX`);
    console.log(`Delay:             ${this.config.delayMs / 1000}s between transactions`);
    console.log('═'.repeat(70));

    // Validate configuration
    await this.validateConfig();
    
    // Check balance
    await this.checkBalance();
    
    // Calculate fee strategy
    this.calculateFees();
    
    // Get user confirmation unless auto-confirm
    if (!this.config.autoConfirm) {
      await this.getUserConfirmation();
    }
  }

  async validateConfig() {
    console.log('\n🔍 Validating Configuration...');
    
    const required = [
      'senderKey',
      'senderAddress',
      'contractAddress',
      'functionName',
      'targetCount',
      'totalBudget'
    ];

    for (const field of required) {
      if (!this.config[field]) {
        throw new Error(`Missing required configuration: ${field}`);
      }
    }

    // Validate sender address
    if (!validateStacksAddress(this.config.senderAddress)) {
      throw new Error(`Invalid sender address: ${this.config.senderAddress}`);
    }

    // Validate contract address format
    const addressRegex = /^S[PM][0-9A-Z]+\.[a-z0-9-]+$/;
    if (!addressRegex.test(this.config.contractAddress)) {
      throw new Error(`Invalid contract address format: ${this.config.contractAddress}`);
    }

    // Validate budget
    if (this.config.totalBudget <= 0) {
      throw new Error('Budget must be greater than 0');
    }

    // Validate target count
    if (this.config.targetCount <= 0 || this.config.targetCount > 200) {
      throw new Error('Target count must be between 1 and 200');
    }

    console.log('   ✓ Configuration validated');
  }

  async checkBalance() {
    console.log('\n💰 Checking Wallet Balance...');
    
    try {
      const apiUrl = this.config.network === 'mainnet' ? 'https://api.hiro.so' : 'https://api.testnet.hiro.so';
      const url = `${apiUrl}/extended/v1/address/${this.config.senderAddress}/balances`;
      const response = await fetch(url);
      const data = await response.json();
      
      const stxBalance = parseInt(data.stx.balance) / 1000000;
      const lockedBalance = parseInt(data.stx.locked) / 1000000;
      const availableBalance = stxBalance - lockedBalance;
      
      console.log(`   Available: ${availableBalance.toFixed(6)} STX`);
      console.log(`   Locked:    ${lockedBalance.toFixed(6)} STX`);
      console.log(`   Total:     ${stxBalance.toFixed(6)} STX`);
      
      if (availableBalance < this.config.totalBudget) {
        throw new Error(
          `Insufficient balance. Need ${this.config.totalBudget} STX, have ${availableBalance.toFixed(6)} STX`
        );
      }
      
      const buffer = this.config.totalBudget * 0.1;
      if (availableBalance < (this.config.totalBudget + buffer)) {
        console.log(`   ⚠️  Warning: Low buffer. Recommend having ${(this.config.totalBudget + buffer).toFixed(2)} STX`);
      }
      
      console.log('   ✓ Balance sufficient');
      
    } catch (error) {
      if (error.message.includes('Insufficient balance')) {
        throw error;
      }
      console.log(`   ⚠️  Could not verify balance: ${error.message}`);
      console.log('   ⚠️  Proceeding without balance check');
    }
  }

  calculateFees() {
    const estimatedFeePerTx = 0.01;
    const totalEstimatedCost = estimatedFeePerTx * this.config.targetCount;
    
    this.feePerTx = Math.floor(
      (this.config.totalBudget / this.config.targetCount) * 1000000
    );

    console.log(`\n💵 Fee Calculation:`);
    console.log(`   Estimated fee/tx:  ${estimatedFeePerTx.toFixed(6)} STX`);
    console.log(`   Total estimated:   ${totalEstimatedCost.toFixed(6)} STX`);
    console.log(`   Allocated fee/tx:  ${(this.feePerTx / 1000000).toFixed(6)} STX`);
    console.log(`   Budget:            ${this.config.totalBudget.toFixed(6)} STX`);
    
    if (totalEstimatedCost > this.config.totalBudget) {
      console.log(`   ⚠️  Warning: Estimated cost exceeds budget`);
      console.log(`   ⚠️  Some transactions may fail due to insufficient fees`);
    }
  }

  async getUserConfirmation() {
    console.log('\n⚠️  Ready to execute transactions');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✓ Starting transaction generation...\n');
  }

  buildFunctionArgs() {
    const argsConfig = this.config.functionArgs || [];
    const args = [];

    for (const arg of argsConfig) {
      switch (arg.type) {
        case 'uint':
          args.push(uintCV(BigInt(arg.value)));
          break;
        case 'string':
          args.push(stringAsciiCV(arg.value));
          break;
        case 'principal':
          args.push(standardPrincipalCV(arg.value));
          break;
        default:
          throw new Error(`Unsupported argument type: ${arg.type}`);
      }
    }

    return args;
  }

  async executeTransaction(index, nonce) {
    const [contractAddress, contractName] = this.config.contractAddress.split('.');
    
    try {
      const txOptions = {
        contractAddress,
        contractName,
        functionName: this.config.functionName,
        functionArgs: this.buildFunctionArgs(),
        senderKey: this.config.senderKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: BigInt(this.feePerTx),
        nonce: BigInt(nonce),
      };

      if (this.config.dryRun) {
        console.log(`[DRY RUN] [${index + 1}/${this.config.targetCount}] Would execute with nonce ${nonce}`);
        return { success: true, txId: 'dry-run-' + index, dryRun: true };
      }

      const transaction = await makeContractCall(txOptions);
      
      if (!transaction) {
        throw new Error('makeContractCall returned undefined');
      }
      
      const broadcastResponse = await broadcastTransaction({transaction, network: this.network});

      if (broadcastResponse.error) {
        throw new Error(broadcastResponse.error);
      }

      const txId = broadcastResponse.txid || broadcastResponse;
      const fee = this.feePerTx / 1000000;

      this.results.successful.push({
        index,
        txId,
        fee,
        nonce,
        timestamp: Date.now(),
      });

      this.results.totalCost += fee;

      console.log(`✓ [${index + 1}/${this.config.targetCount}] TX: ${txId.substring(0, 10)}... | Fee: ${fee.toFixed(6)} STX | Nonce: ${nonce}`);
      
      return { success: true, txId };

    } catch (error) {
      console.error(`✗ [${index + 1}/${this.config.targetCount}] Error: ${error.message}`);
      
      this.results.failed.push({
        index,
        nonce,
        error: error.message,
        timestamp: Date.now(),
      });

      // Retry logic
      if (this.config.maxRetries > 0 && error.message.includes('nonce')) {
        console.log(`   ⟲ Will retry with adjusted nonce...`);
        return { success: false, error: error.message, retry: true };
      }

      return { success: false, error: error.message };
    }
  }

  async run() {
    await this.initialize();

    let currentNonce;
    try {
      currentNonce = await fetchNonce({address: this.config.senderAddress, network: this.network});
      console.log(`Starting nonce: ${currentNonce}\n`);
    } catch (error) {
      console.error(`❌ Failed to get nonce: ${error.message}`);
      process.exit(1);
    }

    for (let i = 0; i < this.config.targetCount; i++) {
      const result = await this.executeTransaction(i, currentNonce);
      
      if (result.success) {
        currentNonce++;
      } else if (result.retry) {
        // Fetch latest nonce and retry
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelayMs || 30000));
        currentNonce = await fetchNonce({address: this.config.senderAddress, network: this.network});
        i--; // Retry this iteration
        continue;
      } else {
        currentNonce++;
      }

      // Delay between transactions (except for last one)
      if (i < this.config.targetCount - 1) {
        const delaySeconds = this.config.delayMs / 1000;
        process.stdout.write(`   ⏳ Waiting ${delaySeconds}s before next transaction...`);
        await new Promise(resolve => setTimeout(resolve, this.config.delayMs));
        process.stdout.write('\r' + ' '.repeat(70) + '\r');
      }
    }

    this.generateReport();
    
    if (this.config.saveResults) {
      this.saveResults();
    }
  }

  generateReport() {
    const duration = (Date.now() - this.results.startTime) / 1000;
    const successRate = (this.results.successful.length / this.config.targetCount) * 100;

    console.log('\n' + '═'.repeat(70));
    console.log('📊 TRANSACTION SUMMARY');
    console.log('═'.repeat(70));
    console.log(`Total Attempted:   ${this.config.targetCount}`);
    console.log(`Successful:        ${this.results.successful.length}`);
    console.log(`Failed:            ${this.results.failed.length}`);
    console.log(`Success Rate:      ${successRate.toFixed(1)}%`);
    console.log(`Total Cost:        ${this.results.totalCost.toFixed(6)} STX`);
    console.log(`Remaining Budget:  ${(this.config.totalBudget - this.results.totalCost).toFixed(6)} STX`);
    console.log(`Duration:          ${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`);
    console.log('═'.repeat(70));

    if (this.results.successful.length > 0) {
      const explorerUrl = this.config.network === 'mainnet' 
        ? 'https://explorer.hiro.so'
        : 'https://explorer.hiro.so/txid';
      
      console.log('\n🔗 Explorer Links:');
      console.log(`   Address: ${explorerUrl}/address/${this.config.senderAddress}?chain=${this.config.network}`);
      console.log(`   First TX: ${explorerUrl}/txid/${this.results.successful[0].txId}?chain=${this.config.network}`);
    }

    if (this.results.failed.length > 0) {
      console.log('\n❌ Failed Transactions:');
      this.results.failed.forEach(f => {
        console.log(`   [${f.index + 1}] ${f.error}`);
      });
    }
  }

  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(__dirname, `transaction-results-${timestamp}.json`);
    
    const output = {
      config: {
        network: this.config.network,
        contract: this.config.contractAddress,
        function: this.config.functionName,
        functionArgs: this.config.functionArgs,
        targetCount: this.config.targetCount,
        budget: this.config.totalBudget,
        delayMs: this.config.delayMs,
      },
      summary: {
        successful: this.results.successful.length,
        failed: this.results.failed.length,
        totalCost: this.results.totalCost,
        duration: (Date.now() - this.results.startTime) / 1000,
        successRate: (this.results.successful.length / this.config.targetCount) * 100,
      },
      transactions: this.results.successful,
      errors: this.results.failed,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Results saved to: ${path.basename(outputPath)}`);
  }
}

// Utility: Derive private key from mnemonic
async function derivePrivateKeyFromMnemonic(mnemonic) {
  const bip39 = require('@scure/bip39');
  const { HDKey } = require('@scure/bip32');
  
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = HDKey.fromMasterSeed(seed);
  const accountKey = masterKey.derive("m/44'/5757'/0'/0/0");
  const privateKeyBytes = accountKey.privateKey;
  
  return Buffer.from(privateKeyBytes).toString('hex') + '01';
}

// Main execution
async function main() {
  try {
    // Load configuration from environment
    let senderKey = process.env.PRIVATE_KEY;
    
    // If mnemonic provided instead of private key
    if (!senderKey && process.env.WALLET_MNEMONIC) {
      console.log('Deriving private key from mnemonic...');
      senderKey = await derivePrivateKeyFromMnemonic(process.env.WALLET_MNEMONIC);
    }
    
    if (!senderKey) {
      throw new Error('Must provide PRIVATE_KEY or WALLET_MNEMONIC in .env file');
    }

    const config = {
      network: process.env.STACKS_NETWORK || 'mainnet',
      senderKey,
      senderAddress: process.env.SENDER_ADDRESS,
      contractAddress: process.env.CONTRACT_ADDRESS,
      functionName: process.env.CONTRACT_FUNCTION,
      functionArgs: JSON.parse(process.env.FUNCTION_ARGS || '[]'),
      targetCount: parseInt(process.env.TARGET_TRANSACTION_COUNT || '40'),
      totalBudget: parseFloat(process.env.TOTAL_BUDGET_STX || '2.5'),
      delayMs: parseInt(process.env.TRANSACTION_DELAY_MS || '120000'),
      maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
      retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '30000'),
      autoConfirm: process.env.AUTO_CONFIRM === 'true',
      dryRun: process.env.DRY_RUN === 'true',
      saveResults: process.env.SAVE_RESULTS !== 'false',
    };

    const generator = new TransactionGenerator(config);
    await generator.run();

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Interrupted by user. Exiting...');
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = TransactionGenerator;
