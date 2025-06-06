// MetaMask Wallet Service for Morocco Made Real
import { ethers } from 'ethers';

export interface WalletConnection {
  address: string;
  provider: ethers.Provider;
  signer: ethers.Signer;
  chainId: number;
}

export class WalletService {
  private connection: WalletConnection | null = null;

  // MetaMask Connection
  async connectMetaMask(): Promise<WalletConnection> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask browser extension from https://metamask.io');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      this.connection = {
        address,
        provider,
        signer,
        chainId: Number(network.chainId)
      };

      return this.connection;
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  }

  // Switch to Polygon Amoy network
  async switchToAmoyNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      // Try to switch to Amoy network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13882' }], // 80002 in hex
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13882',
            chainName: 'Polygon Amoy Testnet',
            nativeCurrency: {
              name: 'POL',
              symbol: 'POL',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
            blockExplorerUrls: ['https://amoy.polygonscan.com/'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  // Check if connected to correct network
  async isOnCorrectNetwork(): Promise<boolean> {
    if (!this.connection) return false;
    return this.connection.chainId === 80002; // Polygon Amoy
  }

  // Get current connection
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  // Disconnect wallet
  disconnect(): void {
    this.connection = null;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.connection !== null;
  }

  // Get wallet address
  getAddress(): string | null {
    return this.connection?.address || null;
  }

  // Listen for account changes
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for network changes
  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Remove event listeners
  removeAllListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', () => {});
      window.ethereum.removeListener('chainChanged', () => {});
    }
  }

  // Check if MetaMask is installed
  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
  }

  // Get MetaMask installation URL
  static getInstallUrl(): string {
    return 'https://metamask.io/download/';
  }
}

// Export singleton instance
export const walletService = new WalletService(); 