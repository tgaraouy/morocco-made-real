// Test script for Etherscan V2 API integration
// Demonstrates multi-chain capabilities with single API key

require("dotenv").config();

// Simple fetch-based implementation for testing
class EtherscanV2Test {
  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY;
    this.baseUrl = 'https://api.etherscan.io/v2/api';
    
    if (!this.apiKey) {
      throw new Error('No API key found. Please set ETHERSCAN_API_KEY or POLYGONSCAN_API_KEY');
    }
  }

  async makeRequest(chainId, module, action, params = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('chainid', chainId.toString());
    url.searchParams.set('module', module);
    url.searchParams.set('action', action);
    url.searchParams.set('apikey', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.status === '0' && data.message !== 'No transactions found') {
        throw new Error(`API error: ${data.message}`);
      }

      return data;
    } catch (error) {
      console.error(`Request failed for chain ${chainId}:`, error.message);
      return null;
    }
  }

  async testBalance(address, chainId, chainName) {
    console.log(`\n🔍 Testing balance on ${chainName} (Chain ID: ${chainId})`);
    
    const result = await this.makeRequest(chainId, 'account', 'balance', {
      address,
      tag: 'latest'
    });

    if (result && result.result) {
      const balance = (parseInt(result.result) / 1e18).toFixed(6);
      console.log(`✅ Balance: ${balance} tokens`);
      return balance;
    } else {
      console.log(`❌ Failed to get balance`);
      return null;
    }
  }

  async testGasPrice(chainId, chainName) {
    console.log(`\n⛽ Testing gas price on ${chainName}`);
    
    const result = await this.makeRequest(chainId, 'proxy', 'eth_gasPrice');

    if (result && result.result) {
      const gasPrice = parseInt(result.result, 16);
      const gasPriceGwei = (gasPrice / 1e9).toFixed(2);
      console.log(`✅ Gas Price: ${gasPriceGwei} Gwei`);
      return gasPriceGwei;
    } else {
      console.log(`❌ Failed to get gas price`);
      return null;
    }
  }
}

async function main() {
  console.log("🚀 Etherscan V2 API Test - Morocco Made Real\n");

  // Check API key type
  const apiKeyType = process.env.ETHERSCAN_API_KEY ? 'Etherscan V2' : 'Legacy Polygonscan';
  console.log(`🔑 Using ${apiKeyType} API key`);

  if (process.env.ETHERSCAN_API_KEY) {
    console.log("✨ You're using the new unified Etherscan V2 API!");
    console.log("   This key works across 50+ supported chains");
  } else {
    console.log("💡 Consider upgrading to Etherscan V2 for multi-chain support");
    console.log("   Get your key at: https://etherscan.io/myapikey");
  }

  try {
    const tester = new EtherscanV2Test();
    
    // Test address (Vitalik's address for demonstration)
    const testAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    
    // Define test chains
    const chains = [
      { id: 1, name: "Ethereum Mainnet" },
      { id: 137, name: "Polygon Mainnet" },
      { id: 80002, name: "Polygon Amoy Testnet" },
      { id: 56, name: "BNB Smart Chain" },
      { id: 42161, name: "Arbitrum One" }
    ];

    console.log(`\n🌐 Testing multi-chain capabilities with address: ${testAddress}`);
    console.log("=" * 60);

    // Test balance on multiple chains
    for (const chain of chains) {
      await tester.testBalance(testAddress, chain.id, chain.name);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("\n⛽ Testing gas prices across chains:");
    console.log("=" * 40);

    // Test gas prices
    for (const chain of chains) {
      await tester.testGasPrice(chain.id, chain.name);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("\n🎉 Etherscan V2 API test completed!");
    console.log("\n📊 Summary:");
    console.log("- Single API key works across multiple chains");
    console.log("- Unified endpoint: https://api.etherscan.io/v2/api");
    console.log("- Chain selection via chainid parameter");
    console.log("- 100,000 requests/day shared across all chains");

    if (!process.env.ETHERSCAN_API_KEY) {
      console.log("\n💡 Upgrade Recommendation:");
      console.log("Set ETHERSCAN_API_KEY in your .env.local for full V2 benefits");
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your API key is valid");
    console.log("2. Ensure you have internet connection");
    console.log("3. Verify API key has sufficient quota");
    console.log("4. Try again in a few minutes (rate limiting)");
  }
}

// Helper function for string repetition (Node.js compatibility)
String.prototype.repeat = String.prototype.repeat || function(count) {
  return new Array(count + 1).join(this);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 