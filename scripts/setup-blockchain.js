// Blockchain Setup Verification Script
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔗 Morocco Made Real - Blockchain Setup Verification\n");

  // Check environment variables
  console.log("📋 Checking Environment Variables:");
  
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
  const polygonscanApiKey = process.env.POLYGONSCAN_API_KEY;
  const rpcUrl = process.env.POLYGON_RPC_URL;
  
  if (!privateKey) {
    console.log("❌ BLOCKCHAIN_PRIVATE_KEY not found");
    console.log("   Please follow the guide in BLOCKCHAIN_SETUP_GUIDE.md");
    return;
  } else {
    console.log("✅ BLOCKCHAIN_PRIVATE_KEY configured");
  }
  
  // Check for Etherscan V2 API key (preferred)
  if (etherscanApiKey) {
    console.log("✅ ETHERSCAN_API_KEY configured (Etherscan V2 - recommended)");
    console.log("   🌟 This key works across 50+ supported chains");
  } else if (polygonscanApiKey) {
    console.log("✅ POLYGONSCAN_API_KEY configured (legacy - still works)");
    console.log("   💡 Consider upgrading to ETHERSCAN_API_KEY for multi-chain support");
  } else {
    console.log("❌ No API key found (ETHERSCAN_API_KEY or POLYGONSCAN_API_KEY)");
    console.log("   Please get your API key from etherscan.io (recommended) or polygonscan.com");
    return;
  }
  
  if (!rpcUrl) {
    console.log("⚠️  POLYGON_RPC_URL not set, using default");
  } else {
    console.log("✅ POLYGON_RPC_URL configured");
  }

  console.log("\n🔍 Testing Blockchain Connection:");
  
  try {
    // Test network connection
    const provider = new ethers.JsonRpcProvider(
      rpcUrl || "https://rpc-amoy.polygon.technology/"
    );
    
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;
    console.log(`✅ Wallet address: ${address}`);
    
    // Check balance
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(`💰 Balance: ${balanceInEth} ${network.chainId === 80002n ? 'POL' : 'MATIC'}`);
    
    if (parseFloat(balanceInEth) === 0) {
      console.log("⚠️  No test tokens found. Please get some from the faucet:");
      if (network.chainId === 80002n) {
        console.log("   🚰 Amoy Faucet: https://faucet.polygon.technology/");
      } else {
        console.log("   🚰 Mumbai Faucet: https://faucet.polygon.technology/");
      }
    }
    
    console.log("\n🎯 Next Steps:");
    console.log("1. If balance is 0, get test tokens from faucet");
    console.log("2. Deploy smart contract: npx hardhat run scripts/deploy-contract.js --network polygonAmoy");
    console.log("3. Update SMART_CONTRACT_ADDRESS in .env.local");
    console.log("4. Start development: npm run dev");
    
    // Additional info about API keys
    console.log("\n📚 API Key Information:");
    if (etherscanApiKey) {
      console.log("✨ Using Etherscan V2 API - supports multiple chains with single key");
      console.log("   Endpoint: https://api.etherscan.io/v2/api?chainid=80002");
    } else {
      console.log("🔄 Using legacy Polygonscan API - consider upgrading to Etherscan V2");
      console.log("   Migration: Set ETHERSCAN_API_KEY=your_etherscan_key in .env.local");
    }
    
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("- Check your private key format (should start with 0x)");
    console.log("- Verify RPC URL is accessible");
    console.log("- Try a different RPC endpoint");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup verification failed:", error);
    process.exit(1);
  }); 