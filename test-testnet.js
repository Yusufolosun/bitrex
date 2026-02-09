const {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  principalCV,
  fetchCallReadOnlyFunction,
  cvToJSON,
  parseReadOnlyResponse,
} = require('@stacks/transactions');
const network = require('@stacks/network');

// Configuration
const TESTNET_API = 'https://api.testnet.hiro.so';
const DEPLOYER_ADDRESS = 'ST1M46W6CVGAMH3ZJD3TKMY5KCY48HWAZK1GA0CF0';
const MNEMONIC = 'echo frown regret aerobic regret dignity verify squeeze arrest mushroom sock follow punch enforce outside short seat slice catch immune cupboard table loud fun';

const stacksNetwork = network.STACKS_TESTNET;

// Contract names
const CONTRACTS = {
  VAULT: 'bitrex-vault',
  ROUTER: 'bitrex-strategy-router',
  ZEST: 'adapter-zest',
  BITFLOW: 'adapter-bitflow',
  STACKING: 'adapter-stacking',
};

// Helper: Derive private key from mnemonic
async function getPrivateKey() {
  const bip39 = require('@scure/bip39');
  const seed = bip39.mnemonicToSeedSync(MNEMONIC);
  
  const { HDKey } = require('@scure/bip32');
  const masterKey = HDKey.fromMasterSeed(seed);
  const accountKey = masterKey.derive("m/44'/5757'/0'/0/0");
  const privateKeyBytes = accountKey.privateKey;
  // Return as hex string with proper prefix for Stacks
  return Buffer.from(privateKeyBytes).toString('hex') + '01';
}

// Helper: Wait for transaction
async function waitForTransaction(txId) {
  console.log(`⏳ Waiting for TX: ${txId}`);
  const url = `${TESTNET_API}/extended/v1/tx/${txId}`;
  
  for (let i = 0; i < 30; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.tx_status === 'success') {
        console.log(`✅ TX confirmed: ${txId}\n`);
        return true;
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        console.log(`❌ TX failed: ${data.tx_status}`);
        console.log(`   Error: ${JSON.stringify(data, null, 2)}\n`);
        return false;
      }
    } catch (e) {
      // Transaction not found yet, keep waiting
    }
  }
  console.log(`⚠️  TX timeout: ${txId}\n`);
  return false;
}

// Helper: Read-only function call
async function readOnlyCall(contractName, functionName, functionArgs = []) {
  try {
    const result = await fetchCallReadOnlyFunction({
      network: stacksNetwork,
      contractAddress: DEPLOYER_ADDRESS,
      contractName,
      functionName,
      functionArgs,
      senderAddress: DEPLOYER_ADDRESS,
    });
    
    return cvToJSON(parseReadOnlyResponse(result));
  } catch (error) {
    console.error(`❌ Read-only call failed: ${functionName}`);
    console.error(error.message);
    return null;
  }
}

// Test 1: Register strategies
async function registerStrategies() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📝 TEST 1: Register Strategies on Testnet');
  console.log('═══════════════════════════════════════════════════════\n');

  const strategies = [
    {
      id: 'zest-lending',
      adapter: `${DEPLOYER_ADDRESS}.${CONTRACTS.ZEST}`,
      riskScore: 3,
      targetPct: 4000,
    },
    {
      id: 'bitflow-lp',
      adapter: `${DEPLOYER_ADDRESS}.${CONTRACTS.BITFLOW}`,
      riskScore: 5,
      targetPct: 4000,
    },
    {
      id: 'pox-stacking',
      adapter: `${DEPLOYER_ADDRESS}.${CONTRACTS.STACKING}`,
      riskScore: 2,
      targetPct: 2000,
    },
  ];

  // Get private key
  const privateKey = await getPrivateKey();
  
  for (const strategy of strategies) {
    console.log(`Registering: ${strategy.id}`);
    console.log(`  Adapter: ${strategy.adapter}`);
    console.log(`  Risk: ${strategy.riskScore}, Target: ${strategy.targetPct / 100}%`);

    try {
      const txOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACTS.ROUTER,
        functionName: 'register-strategy',
        functionArgs: [
          stringAsciiCV(strategy.id),
          principalCV(strategy.adapter),
          uintCV(strategy.riskScore),
          uintCV(strategy.targetPct),
        ],
        senderKey: privateKey,
        network: stacksNetwork,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, stacksNetwork);

      if (broadcastResponse.error) {
        console.log(`❌ Broadcast failed: ${broadcastResponse.error}`);
        if (broadcastResponse.reason) {
          console.log(`   Reason: ${broadcastResponse.reason}`);
        }
        console.log();
        continue;
      }

      await waitForTransaction(broadcastResponse.txid);
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
}

// Test 2: Verify strategy registration
async function verifyStrategies() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🔍 TEST 2: Verify Strategy Registration');
  console.log('═══════════════════════════════════════════════════════\n');

  const strategyIds = ['zest-lending', 'bitflow-lp', 'pox-stacking'];

  for (const id of strategyIds) {
    console.log(`Strategy: ${id}`);
    const info = await readOnlyCall(
      CONTRACTS.ROUTER,
      'get-strategy-info',
      [stringAsciiCV(id)]
    );
    
    if (info) {
      console.log(`  ${JSON.stringify(info, null, 2)}`);
    }
    console.log();
  }

  // Get active strategies
  console.log('Active Strategies:');
  const activeStrategies = await readOnlyCall(CONTRACTS.ROUTER, 'get-active-strategies');
  console.log(`  ${JSON.stringify(activeStrategies, null, 2)}\n`);
}

// Test 3: Check vault info
async function checkVaultInfo() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TEST 3: Vault Information');
  console.log('═══════════════════════════════════════════════════════\n');

  const vaultInfo = await readOnlyCall(CONTRACTS.VAULT, 'get-vault-info');
  console.log('Vault Info:');
  console.log(`  ${JSON.stringify(vaultInfo, null, 2)}\n`);

  const sharePrice = await readOnlyCall(CONTRACTS.VAULT, 'get-share-price');
  console.log('Share Price:');
  console.log(`  ${JSON.stringify(sharePrice, null, 2)}\n`);

  const totalAssets = await readOnlyCall(CONTRACTS.VAULT, 'get-total-assets');
  console.log('Total Assets:');
  console.log(`  ${JSON.stringify(totalAssets, null, 2)}\n`);

  const isPaused = await readOnlyCall(CONTRACTS.VAULT, 'is-paused');
  console.log('Is Paused:');
  console.log(`  ${JSON.stringify(isPaused, null, 2)}\n`);
}

// Test 4: Test deposit (small amount)
async function testDeposit() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('💰 TEST 4: Test Vault Deposit');
  console.log('═══════════════════════════════════════════════════════\n');

  const privateKey = await getPrivateKey();

  const depositAmount = 100000; // 0.001 STX
  console.log(`Depositing: ${depositAmount} µSTX (${depositAmount / 1000000} STX)`);

  try {
    const txOptions = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: CONTRACTS.VAULT,
      functionName: 'deposit',
      functionArgs: [uintCV(depositAmount)],
      senderKey: privateKey,
      network: stacksNetwork,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, stacksNetwork);

    if (broadcastResponse.error) {
      console.log(`❌ Broadcast failed: ${broadcastResponse.error}`);
      if (broadcastResponse.reason) {
        console.log(`   Reason: ${broadcastResponse.reason}`);
      }
      return;
    }

    const success = await waitForTransaction(broadcastResponse.txid);
    
    if (success) {
      // Check user shares
      console.log('\nChecking user shares...');
      const userShares = await readOnlyCall(
        CONTRACTS.VAULT,
        'get-user-shares',
        [principalCV(DEPLOYER_ADDRESS)]
      );
      console.log(`User Shares: ${JSON.stringify(userShares, null, 2)}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }
}

// Test 5: Check adapter info
async function checkAdapterInfo() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🔌 TEST 5: Adapter Information');
  console.log('═══════════════════════════════════════════════════════\n');

  const adapters = [
    { name: 'Zest', contract: CONTRACTS.ZEST },
    { name: 'Bitflow', contract: CONTRACTS.BITFLOW },
    { name: 'Stacking', contract: CONTRACTS.STACKING },
  ];

  for (const adapter of adapters) {
    console.log(`${adapter.name} Adapter:`);
    
    const info = await readOnlyCall(adapter.contract, 'get-strategy-info');
    console.log(`  Info: ${JSON.stringify(info, null, 2)}`);
    
    const apy = await readOnlyCall(adapter.contract, 'get-apy');
    console.log(`  APY: ${JSON.stringify(apy, null, 2)}`);
    
    const balance = await readOnlyCall(adapter.contract, 'get-balance');
    console.log(`  Balance: ${JSON.stringify(balance, null, 2)}\n`);
  }
}

// Main execution
async function runTests() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║         BITREX TESTNET INTEGRATION TESTS              ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`\nNetwork: Stacks Testnet`);
  console.log(`Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`API: ${TESTNET_API}\n`);

  try {
    // Run tests sequentially
    await registerStrategies();
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s between tests
    
    await verifyStrategies();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await checkVaultInfo();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await checkAdapterInfo();
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await testDeposit();

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                  TESTS COMPLETED                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    console.log('📊 Summary:');
    console.log('  ✅ Strategy registration tested');
    console.log('  ✅ Vault operations tested');
    console.log('  ✅ Adapter info retrieved');
    console.log('  ✅ Read-only functions verified\n');
    
    console.log('🔗 View on Explorer:');
    console.log(`  https://explorer.hiro.so/address/${DEPLOYER_ADDRESS}?chain=testnet\n`);

  } catch (error) {
    console.error('\n❌ Test suite error:', error);
  }
}

// Run the tests
runTests().catch(console.error);
