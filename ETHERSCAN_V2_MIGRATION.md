# Etherscan V2 Migration Guide
## Morocco Made Real - Blockchain API Upgrade

### 🎯 Overview

This document outlines the migration from legacy Polygonscan API to the new **Etherscan V2 unified API** based on the [official Etherscan V2 documentation](https://docs.etherscan.io/etherscan-v2).

### ✨ Key Benefits of Etherscan V2

- **Single API Key**: One key works across 50+ supported chains
- **Unified Endpoint**: `https://api.etherscan.io/v2/api`
- **Chain ID Parameter**: Easy multi-chain development with `chainid=80002`
- **100K Requests/Day**: Shared quota across all chains
- **Future-Proof**: New chains added automatically
- **Backward Compatible**: Legacy keys still work as fallback

---

## 📋 Files Modified

### 1. **hardhat.config.js**
**Changes:**
- Updated `etherscan.apiKey` to use single API key format
- Modified `customChains` to use Etherscan V2 endpoints
- Added support for all Polygon networks (Mumbai, Amoy, Mainnet)

**Before:**
```javascript
etherscan: {
  apiKey: {
    polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    polygon: process.env.POLYGONSCAN_API_KEY || "",
  }
}
```

**After:**
```javascript
etherscan: {
  // Etherscan V2 - Single API key for all chains
  apiKey: process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY || "",
  customChains: [
    {
      network: "polygonAmoy",
      chainId: 80002,
      urls: {
        // Etherscan V2 unified endpoint with chainid parameter
        apiURL: "https://api.etherscan.io/v2/api?chainid=80002",
        browserURL: "https://amoy.polygonscan.com"
      }
    }
    // ... other chains
  ]
}
```

### 2. **env.template**
**Changes:**
- Added `ETHERSCAN_API_KEY` as primary API key
- Kept `POLYGONSCAN_API_KEY` for backward compatibility
- Added migration notes

**New Environment Variables:**
```bash
# Etherscan V2 API Key (unified for all chains)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
# Legacy support (will fallback to ETHERSCAN_API_KEY if not set)
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### 3. **BLOCKCHAIN_SETUP_GUIDE.md**
**Changes:**
- Updated Step 4 to focus on Etherscan V2 API key creation
- Added migration instructions from Polygonscan to Etherscan V2
- Updated environment variable configuration
- Added new Etherscan V2 integration section

**Key Updates:**
- Changed from `polygonscan.com` to `etherscan.io` for API key creation
- Added multi-chain benefits explanation
- Included supported chains list (50+)
- Added migration path for existing users

### 4. **scripts/setup-blockchain.js**
**Changes:**
- Updated to check for both `ETHERSCAN_API_KEY` and `POLYGONSCAN_API_KEY`
- Added API key type detection and recommendations
- Enhanced output with migration suggestions

**New Features:**
- Detects which API key type is being used
- Provides upgrade recommendations
- Shows Etherscan V2 endpoint information

### 5. **lib/etherscan-service.ts** *(New File)*
**Purpose:**
- Comprehensive Etherscan V2 API service
- Demonstrates multi-chain capabilities
- Provides TypeScript interfaces for all API responses

**Key Features:**
```typescript
// Single service works across all chains
const balance = await etherscanService.getBalance(address, 80002); // Polygon Amoy
const ethBalance = await etherscanService.getBalance(address, 1);   // Ethereum
const bscBalance = await etherscanService.getBalance(address, 56);  // BSC
```

### 6. **scripts/test-etherscan-v2.js** *(New File)*
**Purpose:**
- Test script to verify Etherscan V2 API functionality
- Demonstrates multi-chain queries with single API key
- Provides troubleshooting information

**Usage:**
```bash
npm run etherscan:test
```

### 7. **package.json**
**Changes:**
- Added new script: `"etherscan:test": "node scripts/test-etherscan-v2.js"`

---

## 🚀 Migration Steps

### For New Users:
1. Get API key from [etherscan.io/myapikey](https://etherscan.io/myapikey)
2. Set `ETHERSCAN_API_KEY=your_key` in `.env.local`
3. Follow the updated `BLOCKCHAIN_SETUP_GUIDE.md`

### For Existing Users:
1. **Keep your existing setup** - it still works!
2. **Optional upgrade**: Get Etherscan V2 key from [etherscan.io](https://etherscan.io)
3. **Add to .env.local**: `ETHERSCAN_API_KEY=your_new_key`
4. **Test**: Run `npm run etherscan:test` to verify multi-chain access

### Verification:
```bash
# Test your setup
npm run blockchain:setup

# Test Etherscan V2 API
npm run etherscan:test

# Deploy contract (works with both API types)
npm run blockchain:deploy:amoy
```

---

## 🌐 Supported Chains

With Etherscan V2, your single API key works on:

| Chain | Chain ID | Symbol | Network |
|-------|----------|--------|---------|
| Ethereum | 1 | ETH | Mainnet |
| Polygon | 137 | MATIC | Mainnet |
| Polygon Amoy | 80002 | POL | Testnet |
| Polygon Mumbai | 80001 | MATIC | Testnet (Deprecated) |
| BNB Smart Chain | 56 | BNB | Mainnet |
| Arbitrum One | 42161 | ETH | L2 |
| Optimism | 10 | ETH | L2 |
| Base | 8453 | ETH | L2 |
| Avalanche | 43114 | AVAX | Mainnet |
| Fantom | 250 | FTM | Mainnet |

*And 40+ more chains!*

---

## 🔧 API Usage Examples

### Basic Balance Query:
```javascript
// Etherscan V2 endpoint
const url = `https://api.etherscan.io/v2/api?chainid=80002&module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
```

### Multi-Chain Development:
```typescript
import { etherscanService } from '@/lib/etherscan-service';

// Query multiple chains with same API key
const chains = [1, 137, 80002, 56, 42161]; // ETH, Polygon, Amoy, BSC, Arbitrum

for (const chainId of chains) {
  const balance = await etherscanService.getBalance(address, chainId);
  console.log(`Chain ${chainId}: ${balance} tokens`);
}
```

### Contract Verification:
```bash
# Works across all supported chains
npx hardhat verify --network polygonAmoy 0x1234...
npx hardhat verify --network polygon 0x1234...
npx hardhat verify --network ethereum 0x1234...
```

---

## 🔍 Troubleshooting

### Common Issues:

**"Invalid API key" error:**
- Ensure you're using a valid Etherscan API key
- Check the key is copied correctly without extra spaces
- Verify your account is verified on etherscan.io

**"Chain not supported" error:**
- Check the chain ID is correct
- Ensure you're using Etherscan V2 endpoint
- Some chains may not be supported yet

**Rate limiting:**
- Etherscan V2 has 100K requests/day across all chains
- Add delays between requests in scripts
- Monitor your usage at etherscan.io

### Testing Commands:
```bash
# Test blockchain setup
npm run blockchain:setup

# Test Etherscan V2 API across multiple chains
npm run etherscan:test

# Compile and test smart contracts
npm run blockchain:compile
npm run blockchain:test
```

---

## 📚 Resources

- [Etherscan V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- [Supported Chains List](https://docs.etherscan.io/etherscan-v2/getting-started/supported-chains)
- [API Endpoints Reference](https://docs.etherscan.io/etherscan-v2/api-endpoints)
- [Legacy Polygonscan Docs](https://docs.polygonscan.com/) (for reference)

---

## ✅ Migration Checklist

- [ ] Read Etherscan V2 documentation
- [ ] Get new API key from etherscan.io
- [ ] Update .env.local with ETHERSCAN_API_KEY
- [ ] Test with `npm run etherscan:test`
- [ ] Verify contract deployment still works
- [ ] Update team documentation
- [ ] Consider removing legacy POLYGONSCAN_API_KEY (optional)

---

**Migration Date**: December 2024  
**API Version**: Etherscan V2  
**Backward Compatibility**: ✅ Maintained  
**Multi-Chain Support**: ✅ 50+ chains  
**Status**: Ready for Production 