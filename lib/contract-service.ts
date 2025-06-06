// Contract Service for Morocco Made Real - Smart Contract Interactions
import { ethers } from 'ethers';
import { walletService } from './wallet-service';
import Web3 from 'web3';

// Contract ABI (Application Binary Interface)
const MOROCCAN_CULTURAL_HERITAGE_ABI = [
  // Events
  "event ArtisanRegistered(uint256 indexed artisanId, address indexed artisanAddress, string name)",
  "event ArtisanVerified(uint256 indexed artisanId, uint8 level, address indexed verifier)",
  "event PieceRegistered(uint256 indexed pieceId, uint256 indexed artisanId, string title)",
  "event PieceVerified(uint256 indexed pieceId, address indexed verifier, uint8 status)",
  "event MuseumSubmissionCreated(uint256 indexed pieceId, address indexed submitter)",
  "event MuseumSubmissionApproved(uint256 indexed pieceId, address indexed approver)",
  "event ReputationUpdated(uint256 indexed artisanId, uint256 newScore)",
  
  // Read functions
  "function artisans(uint256) view returns (uint256 artisanId, address artisanAddress, string name, string region, string specialization, uint8 verificationLevel, uint256 yearsExperience, bool isActive, uint256 registrationDate, uint256 totalPieces, uint256 reputationScore)",
  "function addressToArtisanId(address) view returns (uint256)",
  "function culturalPieces(uint256) view returns (uint256 pieceId, uint256 artisanId, string title, string description, string culturalSignificance, string ipfsHash, uint256 originalPrice, uint8 status, uint256 creationDate, uint256 verificationDate, address verifier, bool isMuseumSubmitted, uint256 viewCount)",
  "function museumSubmissions(uint256) view returns (uint256 pieceId, string curatorNotes, string educationalContent, uint256 submissionDate, address submittedBy, bool isApproved, uint256 approvalDate)",
  "function authorizedVerifiers(address) view returns (bool)",
  "function museumCurators(address) view returns (bool)",
  "function getArtisan(uint256 artisanId) view returns (address artisanAddress, string name, string region, string specialization, uint8 verificationLevel, uint256 yearsExperience, bool isActive, uint256 registrationDate, uint256 totalPieces, uint256 reputationScore)",
  "function getPiece(uint256 pieceId) view returns (uint256 artisanId, string title, string description, string culturalSignificance, string ipfsHash, uint256 originalPrice, uint8 status, uint256 creationDate, uint256 verificationDate, address verifier, bool isMuseumSubmitted, uint256 viewCount)",
  "function getTotalCounts() view returns (uint256 totalArtisans, uint256 totalPieces, uint256 verifiedPieces, uint256 museumPieces)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  
  // Write functions
  "function registerArtisan(address artisanAddress, string name, string region, string specialization, uint256 yearsExperience) returns (uint256)",
  "function verifyArtisan(uint256 artisanId, uint8 level)",
  "function registerPiece(string title, string description, string culturalSignificance, string ipfsHash, uint256 originalPrice) returns (uint256)",
  "function verifyPiece(uint256 pieceId, uint8 status)",
  "function submitToMuseum(uint256 pieceId, string curatorNotes, string educationalContent)",
  "function approveMuseumSubmission(uint256 pieceId)",
  "function recordView(uint256 pieceId)",
  "function addVerifier(address verifier)",
  "function removeVerifier(address verifier)",
  "function addCurator(address curator)",
  "function removeCurator(address curator)"
];

// Enums matching the smart contract
export enum VerificationLevel {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  MASTER = 3
}

export enum PieceStatus {
  PENDING = 0,
  VERIFIED = 1,
  MUSEUM_READY = 2,
  ARCHIVED = 3
}

// Interfaces
export interface ArtisanProfile {
  artisanId: number;
  artisanAddress: string;
  name: string;
  region: string;
  specialization: string;
  verificationLevel: VerificationLevel;
  yearsExperience: number;
  isActive: boolean;
  registrationDate: number;
  totalPieces: number;
  reputationScore: number;
}

export interface CulturalPiece {
  pieceId: number;
  artisanId: number;
  title: string;
  description: string;
  culturalSignificance: string;
  ipfsHash: string;
  originalPrice: number;
  status: PieceStatus;
  creationDate: number;
  verificationDate: number;
  verifier: string;
  isMuseumSubmitted: boolean;
  viewCount: number;
}

export interface MuseumSubmission {
  pieceId: number;
  curatorNotes: string;
  educationalContent: string;
  submissionDate: number;
  submittedBy: string;
  isApproved: boolean;
  approvalDate: number;
}

export interface ContractCounts {
  totalArtisans: number;
  totalPieces: number;
  verifiedPieces: number;
  museumPieces: number;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  data?: any;
}

// Contract Service Class
export class ContractService {
  private provider: ethers.Provider | null = null;
  private contract: ethers.Contract | null = null;
  private web3: Web3 | null = null;
  private contractAddress: string;
  private isMockMode: boolean;

  constructor() {
    this.contractAddress = process.env.SMART_CONTRACT_ADDRESS || '';
    this.isMockMode = !this.contractAddress || process.env.NODE_ENV === 'development';
    
    if (!this.isMockMode) {
      this.initializeProvider();
    } else {
      console.warn('🔧 Contract Service running in MOCK MODE');
    }
  }

  private async initializeProvider() {
    try {
      // Initialize ethers provider
      const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology/';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Initialize Web3 for additional functionality
      this.web3 = new Web3(rpcUrl);
      
      // Initialize contract (read-only)
      this.contract = new ethers.Contract(
        this.contractAddress,
        MOROCCAN_CULTURAL_HERITAGE_ABI,
        this.provider
      );
      
      console.log('✅ Contract service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize contract service:', error);
      this.isMockMode = true;
    }
  }

  private async getSigner(): Promise<ethers.Signer | null> {
    if (this.isMockMode) return null;
    
    try {
      // Use the wallet service to get the signer
      const connection = walletService.getConnection();
      if (connection) {
        return connection.signer;
      }

      // If not connected, try to connect
      await walletService.connectMetaMask();
      const newConnection = walletService.getConnection();
      return newConnection?.signer || null;
      
    } catch (error) {
      console.error('Failed to get signer:', error);
      return null;
    }
  }

  private getContractWithSigner(signer: ethers.Signer): ethers.Contract {
    return new ethers.Contract(
      this.contractAddress,
      MOROCCAN_CULTURAL_HERITAGE_ABI,
      signer
    );
  }

  // Mock functions for development
  private mockTransaction(operation: string, data?: any): TransactionResult {
    console.log(`🔧 Mock: ${operation}`, data);
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      data
    };
  }

  // Check wallet connection and network
  async ensureWalletConnected(): Promise<boolean> {
    try {
      if (!walletService.isConnected()) {
        await walletService.connectMetaMask();
      }

      if (!(await walletService.isOnCorrectNetwork())) {
        await walletService.switchToAmoyNetwork();
      }

      return true;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return false;
    }
  }

  // Artisan Management
  async registerArtisan(
    artisanAddress: string,
    name: string,
    region: string,
    specialization: string,
    yearsExperience: number
  ): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('registerArtisan', { name, region, specialization });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.registerArtisan(
        artisanAddress,
        name,
        region,
        specialization,
        yearsExperience
      );

      const receipt = await tx.wait();
      
      // Extract artisan ID from events
      const event = receipt.logs?.find((log: any) => {
        try {
          const parsed = contractWithSigner.interface.parseLog(log);
          return parsed?.name === 'ArtisanRegistered';
        } catch {
          return false;
        }
      });
      
      let artisanId;
      if (event) {
        const parsed = contractWithSigner.interface.parseLog(event);
        artisanId = Number(parsed?.args?.artisanId);
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        data: { artisanId }
      };
    } catch (error) {
      console.error('Error registering artisan:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async verifyArtisan(artisanId: number, level: VerificationLevel): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('verifyArtisan', { artisanId, level });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.verifyArtisan(artisanId, level);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error verifying artisan:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getArtisan(artisanId: number): Promise<ArtisanProfile | null> {
    if (this.isMockMode) {
      console.log('🔧 Mock: getArtisan', artisanId);
      return {
        artisanId,
        artisanAddress: '0x1234567890123456789012345678901234567890',
        name: 'Mock Artisan',
        region: 'Fez',
        specialization: 'Pottery',
        verificationLevel: VerificationLevel.BRONZE,
        yearsExperience: 10,
        isActive: true,
        registrationDate: Date.now() / 1000,
        totalPieces: 5,
        reputationScore: 150
      };
    }

    try {
      if (!this.contract) throw new Error('Contract not initialized');

      const result = await this.contract.getArtisan(artisanId);
      
      return {
        artisanId,
        artisanAddress: result.artisanAddress,
        name: result.name,
        region: result.region,
        specialization: result.specialization,
        verificationLevel: Number(result.verificationLevel),
        yearsExperience: Number(result.yearsExperience),
        isActive: result.isActive,
        registrationDate: Number(result.registrationDate),
        totalPieces: Number(result.totalPieces),
        reputationScore: Number(result.reputationScore)
      };
    } catch (error) {
      console.error('Error getting artisan:', error);
      return null;
    }
  }

  // Piece Management
  async registerPiece(
    title: string,
    description: string,
    culturalSignificance: string,
    ipfsHash: string,
    originalPrice: number
  ): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('registerPiece', { title, description });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.registerPiece(
        title,
        description,
        culturalSignificance,
        ipfsHash,
        ethers.parseEther(originalPrice.toString())
      );

      const receipt = await tx.wait();
      
      // Extract piece ID from events
      const event = receipt.logs?.find((log: any) => {
        try {
          const parsed = contractWithSigner.interface.parseLog(log);
          return parsed?.name === 'PieceRegistered';
        } catch {
          return false;
        }
      });
      
      let pieceId;
      if (event) {
        const parsed = contractWithSigner.interface.parseLog(event);
        pieceId = Number(parsed?.args?.pieceId);
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        data: { pieceId }
      };
    } catch (error) {
      console.error('Error registering piece:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async verifyPiece(pieceId: number, status: PieceStatus): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('verifyPiece', { pieceId, status });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.verifyPiece(pieceId, status);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error verifying piece:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPiece(pieceId: number): Promise<CulturalPiece | null> {
    if (this.isMockMode) {
      console.log('🔧 Mock: getPiece', pieceId);
      return {
        pieceId,
        artisanId: 1,
        title: 'Mock Cultural Piece',
        description: 'A beautiful traditional Moroccan piece',
        culturalSignificance: 'Represents centuries of tradition',
        ipfsHash: 'QmMockHash123456789',
        originalPrice: 100,
        status: PieceStatus.VERIFIED,
        creationDate: Date.now() / 1000,
        verificationDate: Date.now() / 1000,
        verifier: '0x1234567890123456789012345678901234567890',
        isMuseumSubmitted: false,
        viewCount: 25
      };
    }

    try {
      if (!this.contract) throw new Error('Contract not initialized');

      const result = await this.contract.getPiece(pieceId);
      
      return {
        pieceId,
        artisanId: Number(result.artisanId),
        title: result.title,
        description: result.description,
        culturalSignificance: result.culturalSignificance,
        ipfsHash: result.ipfsHash,
        originalPrice: parseFloat(ethers.formatEther(result.originalPrice)),
        status: Number(result.status),
        creationDate: Number(result.creationDate),
        verificationDate: Number(result.verificationDate),
        verifier: result.verifier,
        isMuseumSubmitted: result.isMuseumSubmitted,
        viewCount: Number(result.viewCount)
      };
    } catch (error) {
      console.error('Error getting piece:', error);
      return null;
    }
  }

  // Museum Management
  async submitToMuseum(
    pieceId: number,
    curatorNotes: string,
    educationalContent: string
  ): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('submitToMuseum', { pieceId, curatorNotes });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.submitToMuseum(pieceId, curatorNotes, educationalContent);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error submitting to museum:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async approveMuseumSubmission(pieceId: number): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('approveMuseumSubmission', { pieceId });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.approveMuseumSubmission(pieceId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error approving museum submission:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Analytics
  async getTotalCounts(): Promise<ContractCounts> {
    if (this.isMockMode) {
      console.log('🔧 Mock: getTotalCounts');
      return {
        totalArtisans: 15,
        totalPieces: 45,
        verifiedPieces: 32,
        museumPieces: 8
      };
    }

    try {
      if (!this.contract) throw new Error('Contract not initialized');

      const result = await this.contract.getTotalCounts();
      
      return {
        totalArtisans: Number(result.totalArtisans),
        totalPieces: Number(result.totalPieces),
        verifiedPieces: Number(result.verifiedPieces),
        museumPieces: Number(result.museumPieces)
      };
    } catch (error) {
      console.error('Error getting total counts:', error);
      return {
        totalArtisans: 0,
        totalPieces: 0,
        verifiedPieces: 0,
        museumPieces: 0
      };
    }
  }

  async recordView(pieceId: number): Promise<TransactionResult> {
    if (this.isMockMode) {
      return this.mockTransaction('recordView', { pieceId });
    }

    try {
      if (!(await this.ensureWalletConnected())) {
        throw new Error('Wallet connection required');
      }

      const signer = await this.getSigner();
      if (!signer) throw new Error('No signer available');

      const contractWithSigner = this.getContractWithSigner(signer);
      const tx = await contractWithSigner.recordView(pieceId);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Error recording view:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Utility functions
  async isVerifier(address: string): Promise<boolean> {
    if (this.isMockMode) {
      console.log('🔧 Mock: isVerifier', address);
      return true;
    }

    try {
      if (!this.contract) return false;
      return await this.contract.authorizedVerifiers(address);
    } catch (error) {
      console.error('Error checking verifier status:', error);
      return false;
    }
  }

  async isCurator(address: string): Promise<boolean> {
    if (this.isMockMode) {
      console.log('🔧 Mock: isCurator', address);
      return true;
    }

    try {
      if (!this.contract) return false;
      return await this.contract.museumCurators(address);
    } catch (error) {
      console.error('Error checking curator status:', error);
      return false;
    }
  }

  async getArtisanIdByAddress(address: string): Promise<number> {
    if (this.isMockMode) {
      console.log('🔧 Mock: getArtisanIdByAddress', address);
      return 1;
    }

    try {
      if (!this.contract) return 0;
      const result = await this.contract.addressToArtisanId(address);
      return Number(result);
    } catch (error) {
      console.error('Error getting artisan ID:', error);
      return 0;
    }
  }

  // Event listeners
  onArtisanRegistered(callback: (artisanId: number, address: string, name: string) => void) {
    if (this.isMockMode || !this.contract) return;

    this.contract.on('ArtisanRegistered', (artisanId, artisanAddress, name) => {
      callback(Number(artisanId), artisanAddress, name);
    });
  }

  onPieceRegistered(callback: (pieceId: number, artisanId: number, title: string) => void) {
    if (this.isMockMode || !this.contract) return;

    this.contract.on('PieceRegistered', (pieceId, artisanId, title) => {
      callback(Number(pieceId), Number(artisanId), title);
    });
  }

  onPieceVerified(callback: (pieceId: number, verifier: string, status: PieceStatus) => void) {
    if (this.isMockMode || !this.contract) return;

    this.contract.on('PieceVerified', (pieceId, verifier, status) => {
      callback(Number(pieceId), verifier, Number(status));
    });
  }

  // Get wallet connection status
  isWalletConnected(): boolean {
    return walletService.isConnected();
  }

  // Get connected wallet address
  getWalletAddress(): string | null {
    return walletService.getAddress();
  }
}

// Export singleton instance
export const contractService = new ContractService(); 