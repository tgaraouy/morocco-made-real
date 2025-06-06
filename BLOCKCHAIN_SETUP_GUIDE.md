# 🔗 Blockchain Setup Guide - Morocco Made Real

## 📋 Overview
This guide will help you set up the necessary blockchain credentials for your Morocco Made Real project:
1. **BLOCKCHAIN_PRIVATE_KEY**: Your wallet private key for deploying smart contracts
2. **POLYGONSCAN_API_KEY**: For contract verification and blockchain interactions

## 🚨 Security Warning
**NEVER share your private key or commit it to version control!**
- Private keys give full access to your wallet funds
- Always use testnet for development
- Keep production keys in secure environment variables

---

## 🔧 Step 1: Set Up MetaMask Wallet

### Install MetaMask
1. Go to [metamask.io](https://metamask.io)
2. Install the browser extension
3. Create a new wallet or import existing one
4. **IMPORTANT**: Save your seed phrase securely

### Add Polygon Mumbai Testnet
1. Open MetaMask
2. Click network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:

```
Network Name: Polygon Mumbai Testnet
New RPC URL: https://rpc-mumbai.maticvigil.com/
Chain ID: 80001
Currency Symbol: MATIC
Block Explorer URL: https://mumbai.polygonscan.com/
```

5. Click "Save"

### Alternative: Add Polygon Amoy Testnet (Newer)
Mumbai is being deprecated. Use Amoy for new projects:

```
Network Name: Polygon Amoy Testnet
New RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: POL
Block Explorer URL: https://amoy.polygonscan.com/
```

---

## 💰 Step 2: Get Test MATIC/POL

### For Mumbai Testnet:
1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Mumbai" network
3. Enter your wallet address
4. Request test MATIC

### For Amoy Testnet:
1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy" network  
3. Enter your wallet address
4. Request test POL

### Alternative Faucets:
- [Alchemy Mumbai Faucet](https://mumbaifaucet.com/)
- [GetBlock Faucet](https://getblock.io/faucet/)

---

## 🔑 Step 3: Export Private Key

### From MetaMask:
1. Open MetaMask
2. Click the three dots (⋮) next to your account
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your MetaMask password
6. **Copy the private key** (starts with 0x...)

### ⚠️ Security Notes:
- This private key controls your wallet
- Only use testnet wallets for development
- Never share or commit this key to code repositories

---

## 🔍 Step 4: Get Etherscan API Key (V2)

### Create Etherscan Account:
1. Go to [etherscan.io](https://etherscan.io) (main Etherscan site)
2. Click "Sign In" → "Click to sign up"
3. Create account with email/password
4. Verify your email

### Generate API Key:
1. Login to your Etherscan account
2. Go to [API-KEYs page](https://etherscan.io/myapikey)
3. Click "Add" button
4. Enter a project name (e.g., "Morocco Made Real")
5. **Copy the API key** (long string of characters)

### ✨ Etherscan V2 Benefits:
- **Single API key** works across 50+ supported chains
- **Unified endpoint**: `https://api.etherscan.io/v2/api`
- **Chain ID parameter**: Specify target chain with `chainid=80002`
- **Free tier**: 100,000 requests/day across all chains
- **Multi-chain support**: Ethereum, Polygon, BSC, Arbitrum, Optimism, and more

### Supported Polygon Networks:
- **Polygon Mainnet**: Chain ID `137`
- **Polygon Amoy Testnet**: Chain ID `80002` (recommended)
- **Polygon Mumbai Testnet**: Chain ID `80001` (deprecated)

### Legacy Polygonscan Support:
If you already have a Polygonscan API key, it will still work as a fallback. The system checks for `ETHERSCAN_API_KEY` first, then falls back to `POLYGONSCAN_API_KEY`.

---

## 📝 Step 5: Configure Environment Variables

### Create .env.local file:
```bash
# Blockchain Configuration
BLOCKCHAIN_PRIVATE_KEY=0x1234567890abcdef... # Your private key from Step 3

# Etherscan V2 API Key (unified for all chains)
ETHERSCAN_API_KEY=ABC123XYZ789... # Your API key from Step 4

# Legacy Polygonscan API Key (optional fallback)
POLYGONSCAN_API_KEY=ABC123XYZ789... # Same key or different legacy key

# Network Configuration (choose one)
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com/ # Mumbai
# POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/ # Amoy (recommended)

# Smart Contract Address (will be set after deployment)
SMART_CONTRACT_ADDRESS=

# Optional: Enhanced RPC (for better performance)
# POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

### Update .env.template:
```bash
# Add these lines to your .env.template file
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key_here

# Etherscan V2 API Key (works across all supported chains)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
# Legacy support (optional)
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
SMART_CONTRACT_ADDRESS=will_be_set_after_deployment
```

### 🔄 Migration from Polygonscan to Etherscan V2:
If you're upgrading from the old Polygonscan API:
1. **Keep your existing** `POLYGONSCAN_API_KEY` for backward compatibility
2. **Add the new** `ETHERSCAN_API_KEY` with the same value
3. **Future-proof**: The system will prefer `ETHERSCAN_API_KEY` when available
4. **Single key**: One Etherscan V2 key works for Polygon, Ethereum, BSC, Arbitrum, etc.

---

## 🚀 Step 6: Deploy Smart Contract

### Install Dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install ethers@^6.0.0 @openzeppelin/contracts
```

### Deploy to Testnet:
```bash
# Deploy to Mumbai
npx hardhat run scripts/deploy-contract.js --network polygonMumbai

# Or deploy to Amoy (recommended)
npx hardhat run scripts/deploy-contract.js --network polygonAmoy
```

### Update Environment:
After deployment, add the contract address to your `.env.local`:
```bash
SMART_CONTRACT_ADDRESS=0x1234567890abcdef... # Address from deployment
```

---

## ✅ Step 7: Verify Setup

### Test Contract Service:
```bash
npm run dev
```

Check the console for:
```
✅ Contract service initialized successfully
🔧 Contract Service running in MOCK MODE (if no contract deployed)
```

### Test Blockchain Connection:
1. Open your app at `http://localhost:3000`
2. Navigate to AI & Blockchain page
3. Check browser console for connection status
4. Try registering a test artisan or piece

---

## 🔧 Troubleshooting

### Common Issues:

#### "Invalid private key" error:
- Ensure private key starts with `0x`
- Check for extra spaces or characters
- Verify you copied the complete key

#### "Network connection failed":
- Check RPC URL is correct
- Try alternative RPC endpoints
- Verify internet connection

#### "Insufficient funds" error:
- Get more test tokens from faucet
- Wait for faucet cooldown (usually 24 hours)
- Try different faucet services

#### "API key invalid":
- Verify API key is copied correctly
- Check Polygonscan account is verified
- Ensure API key is for correct network

### Alternative RPC Providers:
If default RPC is slow, try these:

**Mumbai:**
```
https://rpc-mumbai.maticvigil.com/
https://matic-mumbai.chainstacklabs.com
https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
```

**Amoy:**
```
https://rpc-amoy.polygon.technology/
https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
```

---

## 🎯 Next Steps

After completing this setup:

1. **Test the system**: Deploy a test contract and verify it works
2. **Implement features**: Start building your artisan registration system
3. **Add IPFS**: Set up IPFS for storing cultural piece metadata
4. **Production planning**: Plan migration to Polygon mainnet

---

## 🚀 Etherscan V2 Integration

### New Unified API Service

The project now includes a comprehensive Etherscan V2 service (`lib/etherscan-service.ts`) that demonstrates the power of the unified API:

```typescript
import { etherscanService } from '@/lib/etherscan-service';

// Get balance on any supported chain
const balance = await etherscanService.getBalance(address, 80002); // Polygon Amoy
const ethBalance = await etherscanService.getBalance(address, 1);   // Ethereum

// Get transaction history across chains
const polygonTxs = await etherscanService.getTransactions(address, 137);
const arbitrumTxs = await etherscanService.getTransactions(address, 42161);

// Contract verification works across all chains
const contractABI = await etherscanService.getContractABI(contractAddress, 80002);
```

### Supported Chains (50+)
With a single Etherscan V2 API key, you can query:
- **Ethereum** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Polygon Amoy** (Chain ID: 80002) - Recommended for testing
- **Polygon Mumbai** (Chain ID: 80001) - Deprecated
- **BNB Smart Chain** (Chain ID: 56)
- **Arbitrum One** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Base** (Chain ID: 8453)
- **Avalanche** (Chain ID: 43114)
- **Fantom** (Chain ID: 250)
- And 40+ more chains!

### Migration Benefits
- ✅ **Single API Key**: One key for all supported chains
- ✅ **Unified Endpoint**: `https://api.etherscan.io/v2/api`
- ✅ **Chain ID Parameter**: Easy multi-chain development
- ✅ **100K Requests/Day**: Shared across all chains
- ✅ **Future-Proof**: New chains added automatically
- ✅ **Backward Compatible**: Legacy keys still work

---

## 📚 Additional Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [**Etherscan V2 API Docs**](https://docs.etherscan.io/etherscan-v2) ⭐ **New!**
- [Legacy Polygonscan API Docs](https://docs.polygonscan.com/)

---

## 🔒 Security Best Practices

1. **Never commit private keys** to version control
2. **Use different wallets** for development and production
3. **Regularly rotate API keys** for production
4. **Monitor wallet activity** for unauthorized transactions
5. **Use hardware wallets** for production deployments
6. **Implement multi-signature** for production contracts

---

**Last Updated**: December 2024  
**API Version**: Etherscan V2 (Unified Multi-Chain)  
**Network Recommendation**: Polygon Amoy Testnet (Mumbai is deprecated)  
**Estimated Setup Time**: 15-30 minutes 