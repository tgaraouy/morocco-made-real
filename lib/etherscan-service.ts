// Etherscan V2 API Service for Morocco Made Real
// Unified API service supporting 50+ chains with single API key

interface EtherscanV2Config {
  apiKey: string;
  baseUrl: string;
}

interface EtherscanResponse<T = any> {
  status: string;
  message: string;
  result: T;
}

interface AccountBalance {
  account: string;
  balance: string;
}

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
}

interface ContractVerificationStatus {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

export class EtherscanV2Service {
  private config: EtherscanV2Config;

  constructor() {
    // Use Etherscan V2 API key, fallback to legacy Polygonscan key
    const apiKey = process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY;
    
    if (!apiKey) {
      throw new Error('No API key found. Please set ETHERSCAN_API_KEY or POLYGONSCAN_API_KEY in your environment variables.');
    }

    this.config = {
      apiKey,
      baseUrl: 'https://api.etherscan.io/v2/api'
    };
  }

  /**
   * Make a request to Etherscan V2 API
   * @param chainId - The chain ID (e.g., 137 for Polygon, 80002 for Amoy)
   * @param module - API module (account, contract, transaction, etc.)
   * @param action - API action
   * @param params - Additional parameters
   */
  private async makeRequest<T>(
    chainId: number,
    module: string,
    action: string,
    params: Record<string, any> = {}
  ): Promise<EtherscanResponse<T>> {
    const url = new URL(this.config.baseUrl);
    
    // Etherscan V2 parameters
    url.searchParams.set('chainid', chainId.toString());
    url.searchParams.set('module', module);
    url.searchParams.set('action', action);
    url.searchParams.set('apikey', this.config.apiKey);

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === '0' && data.message !== 'No transactions found') {
        throw new Error(`API error: ${data.message}`);
      }

      return data;
    } catch (error) {
      console.error('Etherscan V2 API request failed:', error);
      throw error;
    }
  }

  /**
   * Get account balance for a specific chain
   * @param address - Wallet address
   * @param chainId - Chain ID (137 = Polygon, 80002 = Amoy, 80001 = Mumbai)
   */
  async getBalance(address: string, chainId: number = 80002): Promise<string> {
    const response = await this.makeRequest<string>(
      chainId,
      'account',
      'balance',
      {
        address,
        tag: 'latest'
      }
    );

    return response.result;
  }

  /**
   * Get multiple account balances in one request
   * @param addresses - Array of wallet addresses
   * @param chainId - Chain ID
   */
  async getMultipleBalances(addresses: string[], chainId: number = 80002): Promise<AccountBalance[]> {
    const response = await this.makeRequest<AccountBalance[]>(
      chainId,
      'account',
      'balancemulti',
      {
        address: addresses.join(','),
        tag: 'latest'
      }
    );

    return response.result;
  }

  /**
   * Get transaction history for an address
   * @param address - Wallet address
   * @param chainId - Chain ID
   * @param startBlock - Starting block number (optional)
   * @param endBlock - Ending block number (optional)
   * @param page - Page number (optional)
   * @param offset - Number of transactions per page (optional, max 10000)
   */
  async getTransactions(
    address: string,
    chainId: number = 80002,
    options: {
      startBlock?: number;
      endBlock?: number;
      page?: number;
      offset?: number;
      sort?: 'asc' | 'desc';
    } = {}
  ): Promise<Transaction[]> {
    const response = await this.makeRequest<Transaction[]>(
      chainId,
      'account',
      'txlist',
      {
        address,
        startblock: options.startBlock || 0,
        endblock: options.endBlock || 99999999,
        page: options.page || 1,
        offset: options.offset || 100,
        sort: options.sort || 'desc'
      }
    );

    return response.result;
  }

  /**
   * Get contract source code and ABI
   * @param contractAddress - Smart contract address
   * @param chainId - Chain ID
   */
  async getContractSource(
    contractAddress: string,
    chainId: number = 80002
  ): Promise<ContractVerificationStatus[]> {
    const response = await this.makeRequest<ContractVerificationStatus[]>(
      chainId,
      'contract',
      'getsourcecode',
      {
        address: contractAddress
      }
    );

    return response.result;
  }

  /**
   * Get contract ABI
   * @param contractAddress - Smart contract address
   * @param chainId - Chain ID
   */
  async getContractABI(contractAddress: string, chainId: number = 80002): Promise<string> {
    const response = await this.makeRequest<string>(
      chainId,
      'contract',
      'getabi',
      {
        address: contractAddress
      }
    );

    return response.result;
  }

  /**
   * Get transaction receipt status
   * @param txHash - Transaction hash
   * @param chainId - Chain ID
   */
  async getTransactionStatus(txHash: string, chainId: number = 80002): Promise<{status: string}> {
    const response = await this.makeRequest<{status: string}>(
      chainId,
      'transaction',
      'gettxreceiptstatus',
      {
        txhash: txHash
      }
    );

    return response.result;
  }

  /**
   * Get gas price for a specific chain
   * @param chainId - Chain ID
   */
  async getGasPrice(chainId: number = 80002): Promise<string> {
    const response = await this.makeRequest<string>(
      chainId,
      'proxy',
      'eth_gasPrice'
    );

    return response.result;
  }

  /**
   * Get block number by timestamp
   * @param timestamp - Unix timestamp
   * @param closest - 'before' or 'after'
   * @param chainId - Chain ID
   */
  async getBlockByTimestamp(
    timestamp: number,
    closest: 'before' | 'after' = 'before',
    chainId: number = 80002
  ): Promise<string> {
    const response = await this.makeRequest<string>(
      chainId,
      'block',
      'getblocknobytime',
      {
        timestamp,
        closest
      }
    );

    return response.result;
  }

  /**
   * Get supported chains information
   * This is a utility method to show which chains are supported
   */
  getSupportedChains(): Record<string, {chainId: number, name: string, symbol: string}> {
    return {
      ethereum: { chainId: 1, name: 'Ethereum Mainnet', symbol: 'ETH' },
      polygon: { chainId: 137, name: 'Polygon Mainnet', symbol: 'MATIC' },
      polygonAmoy: { chainId: 80002, name: 'Polygon Amoy Testnet', symbol: 'POL' },
      polygonMumbai: { chainId: 80001, name: 'Polygon Mumbai Testnet', symbol: 'MATIC' },
      bsc: { chainId: 56, name: 'BNB Smart Chain', symbol: 'BNB' },
      arbitrum: { chainId: 42161, name: 'Arbitrum One', symbol: 'ETH' },
      optimism: { chainId: 10, name: 'Optimism', symbol: 'ETH' },
      base: { chainId: 8453, name: 'Base', symbol: 'ETH' },
      avalanche: { chainId: 43114, name: 'Avalanche C-Chain', symbol: 'AVAX' },
      fantom: { chainId: 250, name: 'Fantom Opera', symbol: 'FTM' }
    };
  }

  /**
   * Check if API key is configured correctly
   */
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get API key type (V2 or legacy)
   */
  getApiKeyType(): 'etherscan-v2' | 'polygonscan-legacy' | 'none' {
    if (process.env.ETHERSCAN_API_KEY) {
      return 'etherscan-v2';
    } else if (process.env.POLYGONSCAN_API_KEY) {
      return 'polygonscan-legacy';
    }
    return 'none';
  }
}

// Export singleton instance
export const etherscanService = new EtherscanV2Service(); 