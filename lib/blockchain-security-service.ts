// ============================================================================
// BLOCKCHAIN SECURITY SERVICE
// Privacy-first blockchain integration - Only hashes sent to chain
// ============================================================================

import { ethers } from 'ethers';
import crypto from 'crypto';

// ============================================================================
// SECURITY INTERFACES
// ============================================================================

interface ArtisanSecurityProfile {
  artisanId: string;
  consentHash: string;          // Hash of signed consent documents
  culturalDataHash: string;     // Hash of cultural DNA profile
  portfolioHash: string;        // Hash of images/videos/audio
  validationHash: string;       // Hash of expert validations
  timestampHash: string;        // Hash of creation timestamp
  privacyLevel: 'public' | 'semi-private' | 'private';
}

interface BlockchainCertificate {
  certificateId: string;
  artisanHash: string;          // Only hash on blockchain
  validationLevel: 0 | 1 | 2 | 3;
  issuerAddress: string;
  timestamp: number;
  expirationTimestamp: number;
  revocationFlag: boolean;
  royaltyBeneficiary: string;   // For artisan families
}

interface SecurityAuditLog {
  action: string;
  timestamp: number;
  dataHash: string;
  userHash: string;
  ipAddress?: string;
  outcome: 'success' | 'failure' | 'warning';
}

// ============================================================================
// BLOCKCHAIN SECURITY SERVICE
// ============================================================================

export class BlockchainSecurityService {
  private provider: ethers.Provider;
  private signer: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private ipfs: any;
  private securityLogs: SecurityAuditLog[] = [];

  constructor() {
    this.initializeBlockchain();
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  private initializeBlockchain() {
    // Use Polygon for low-cost, eco-friendly transactions
    const POLYGON_RPC = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    
    if (process.env.PRIVATE_KEY) {
      this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    }

    // Smart contract ABI for cultural preservation
    const contractABI = [
      // Certificate Management
      "function mintCulturalCertificate(string memory artisanHash, uint8 validationLevel, string memory metadataHash) public returns (uint256)",
      "function revokeCertificate(uint256 certificateId, string memory reason) public",
      "function updateValidationLevel(uint256 certificateId, uint8 newLevel) public",
      
      // Royalty & Ethics
      "function setRoyaltyBeneficiary(uint256 certificateId, address beneficiary, uint256 percentage) public",
      "function enableOptOut(uint256 certificateId) public",
      "function disableOptOut(uint256 certificateId) public",
      
      // Verification
      "function verifyCertificate(uint256 certificateId) public view returns (bool, string memory, uint8)",
      "function getCertificateHash(uint256 certificateId) public view returns (string memory)",
      
      // Events
      "event CulturalCertificateMinted(uint256 indexed certificateId, string artisanHash, uint8 validationLevel)",
      "event CertificateRevoked(uint256 indexed certificateId, string reason)",
      "event ValidationLevelUpdated(uint256 indexed certificateId, uint8 oldLevel, uint8 newLevel)"
    ];

    const contractAddress = process.env.CULTURAL_PRESERVATION_CONTRACT_ADDRESS;
    if (contractAddress && this.signer) {
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
    }
  }

  // ========================================================================
  // SECURE HASHING FUNCTIONS
  // ========================================================================

  generateSecureHash(data: any): string {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  generateArtisanHash(artisanProfile: any): string {
    // Create composite hash without exposing personal data
    const compositeData = {
      craftType: artisanProfile.craftType,
      region: artisanProfile.region,
      validationLevel: artisanProfile.validationLevel,
      timestamp: Date.now(),
      salt: crypto.randomBytes(16).toString('hex')
    };
    return this.generateSecureHash(compositeData);
  }

  generateConsentHash(consent: any): string {
    // Hash consent without storing personal details on chain
    return this.generateSecureHash({
      consentType: consent.type,
      granted: consent.granted,
      timestamp: consent.timestamp,
      revocable: consent.revocable
    });
  }

  // ========================================================================
  // CULTURAL PRESERVATION CERTIFICATE SYSTEM
  // ========================================================================

  async mintCulturalCertificate(
    artisanProfile: any,
    validationLevel: 0 | 1 | 2 | 3,
    consent: any
  ): Promise<{
    certificateId: string;
    transactionHash: string;
    artisanHash: string;
    metadataHash: string;
  }> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain contract not initialized');
      }

      // 1. Generate secure hashes (NO personal data on blockchain)
      const artisanHash = this.generateArtisanHash(artisanProfile);
      const consentHash = this.generateConsentHash(consent);
      
      // 2. Create metadata hash for off-chain storage
      const metadata = {
        culturalProfile: this.generateSecureHash(artisanProfile),
        consent: consentHash,
        timestamp: Date.now()
      };
      const metadataHash = this.generateSecureHash(metadata);

      // 3. Only send HASH to blockchain
      const transaction = await this.contract.mintCulturalCertificate(
        artisanHash,              // Only hash, no personal data
        validationLevel,
        metadataHash              // Hash for detailed data reference
      );

      const receipt = await transaction.wait();
      const certificateId = receipt.logs[0].topics[1] || 'generated_id_' + Date.now();

      // 4. Log security action
      this.logSecurityAction({
        action: 'certificate_minted',
        timestamp: Date.now(),
        dataHash: artisanHash,
        userHash: this.generateSecureHash(artisanProfile.id || 'anonymous'),
        outcome: 'success'
      });

      return {
        certificateId,
        transactionHash: receipt.hash,
        artisanHash,
        metadataHash
      };

    } catch (error) {
      // Log security failure
      this.logSecurityAction({
        action: 'certificate_mint_failed',
        timestamp: Date.now(),
        dataHash: 'error',
        userHash: 'system',
        outcome: 'failure'
      });

      throw new Error(`Certificate minting failed: ${error.message}`);
    }
  }

  // ========================================================================
  // ETHICAL SMART CONTRACT FEATURES
  // ========================================================================

  async enableArtisanOptOut(certificateId: string, artisanSignature: string): Promise<void> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain contract not initialized');
      }

      // Verify artisan signature before allowing opt-out
      const isValidSignature = await this.verifyArtisanSignature(certificateId, artisanSignature);
      if (!isValidSignature) {
        throw new Error('Invalid artisan signature for opt-out');
      }

      await this.contract.enableOptOut(certificateId);
      
      this.logSecurityAction({
        action: 'artisan_opted_out',
        timestamp: Date.now(),
        dataHash: this.generateSecureHash(certificateId),
        userHash: this.generateSecureHash(artisanSignature),
        outcome: 'success'
      });

    } catch (error) {
      throw new Error(`Opt-out failed: ${error.message}`);
    }
  }

  async setRoyaltyBeneficiary(
    certificateId: string, 
    beneficiaryAddress: string, 
    percentage: number
  ): Promise<void> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain contract not initialized');
      }

      // Set royalty for artisan families
      await this.contract.setRoyaltyBeneficiary(
        certificateId, 
        beneficiaryAddress, 
        percentage * 100 // Convert to basis points
      );

      this.logSecurityAction({
        action: 'royalty_set',
        timestamp: Date.now(),
        dataHash: this.generateSecureHash(certificateId),
        userHash: this.generateSecureHash(beneficiaryAddress),
        outcome: 'success'
      });

    } catch (error) {
      throw new Error(`Royalty setting failed: ${error.message}`);
    }
  }

  // ========================================================================
  // CERTIFICATE VERIFICATION (HASH-ONLY)
  // ========================================================================

  async verifyCertificate(certificateId: string): Promise<{
    isValid: boolean;
    artisanHash: string;
    validationLevel: number;
    isRevoked: boolean;
    expirationDate: Date;
  }> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain contract not initialized');
      }

      const [isValid, artisanHash, validationLevel] = await this.contract.verifyCertificate(certificateId);
      
      // Additional checks
      const certificate = await this.getCertificateDetails(certificateId);
      
      return {
        isValid,
        artisanHash,
        validationLevel: Number(validationLevel),
        isRevoked: certificate.revocationFlag,
        expirationDate: new Date(certificate.expirationTimestamp * 1000)
      };

    } catch (error) {
      throw new Error(`Certificate verification failed: ${error.message}`);
    }
  }

  private async getCertificateDetails(certificateId: string): Promise<BlockchainCertificate> {
    // Mock implementation - replace with actual blockchain query
    return {
      certificateId,
      artisanHash: 'mock_hash',
      validationLevel: 1,
      issuerAddress: '0x0000000000000000000000000000000000000000',
      timestamp: Date.now(),
      expirationTimestamp: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
      revocationFlag: false,
      royaltyBeneficiary: '0x0000000000000000000000000000000000000000'
    };
  }

  // ========================================================================
  // SECURITY AUDIT & COMPLIANCE
  // ========================================================================

  private logSecurityAction(action: SecurityAuditLog): void {
    this.securityLogs.push(action);
    
    // In production, send to secure logging service
    console.log(`[SECURITY] ${action.action}: ${action.outcome} at ${new Date(action.timestamp)}`);
  }

  async getSecurityAuditTrail(timeRange?: { start: Date, end: Date }): Promise<SecurityAuditLog[]> {
    if (!timeRange) {
      return this.securityLogs;
    }

    return this.securityLogs.filter(log => 
      log.timestamp >= timeRange.start.getTime() && 
      log.timestamp <= timeRange.end.getTime()
    );
  }

  // ========================================================================
  // GDPR COMPLIANCE FUNCTIONS
  // ========================================================================

  async requestDataDeletion(artisanHash: string, requestSignature: string): Promise<void> {
    try {
      // Verify deletion request signature
      const isValid = await this.verifyDeletionRequest(artisanHash, requestSignature);
      if (!isValid) {
        throw new Error('Invalid deletion request signature');
      }

      // Mark certificate as opted-out (cannot delete from blockchain, but can flag)
      const certificateIds = await this.getCertificatesByArtisanHash(artisanHash);
      
      for (const certificateId of certificateIds) {
        await this.enableArtisanOptOut(certificateId, requestSignature);
      }

      this.logSecurityAction({
        action: 'gdpr_data_deletion_requested',
        timestamp: Date.now(),
        dataHash: artisanHash,
        userHash: this.generateSecureHash(requestSignature),
        outcome: 'success'
      });

    } catch (error) {
      throw new Error(`Data deletion failed: ${error.message}`);
    }
  }

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  private async verifyArtisanSignature(certificateId: string, signature: string): Promise<boolean> {
    // Implementation for signature verification
    // This would verify that the signature matches the certificate owner
    return true; // Placeholder
  }

  private async verifyDeletionRequest(artisanHash: string, signature: string): Promise<boolean> {
    // Implementation for deletion request verification
    return true; // Placeholder
  }

  private async getCertificatesByArtisanHash(artisanHash: string): Promise<string[]> {
    // Implementation to find all certificates for an artisan
    return []; // Placeholder
  }

  // ========================================================================
  // PUBLIC VERIFICATION API
  // ========================================================================

  async verifyArtisanAuthenticity(artisanHash: string): Promise<{
    isAuthentic: boolean;
    validationLevel: number;
    certificateCount: number;
    communityEndorsements: number;
    lastValidation: Date;
  }> {
    try {
      const certificates = await this.getCertificatesByArtisanHash(artisanHash);
      const validCertificates = [];

      for (const certificateId of certificates) {
        const verification = await this.verifyCertificate(certificateId);
        if (verification.isValid && !verification.isRevoked) {
          validCertificates.push(verification);
        }
      }

      const highestValidationLevel = validCertificates.length > 0 
        ? Math.max(...validCertificates.map(c => c.validationLevel))
        : 0;
      
      return {
        isAuthentic: validCertificates.length > 0,
        validationLevel: highestValidationLevel,
        certificateCount: validCertificates.length,
        communityEndorsements: await this.getCommunityEndorsementCount(artisanHash),
        lastValidation: validCertificates.length > 0 
          ? new Date(Math.max(...validCertificates.map(c => c.expirationDate.getTime())))
          : new Date(0)
      };

    } catch (error) {
      return {
        isAuthentic: false,
        validationLevel: 0,
        certificateCount: 0,
        communityEndorsements: 0,
        lastValidation: new Date(0)
      };
    }
  }

  private async getCommunityEndorsementCount(artisanHash: string): Promise<number> {
    // Implementation to count community endorsements
    return 0; // Placeholder
  }
}

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

export class SecurityUtils {
  static sanitizeInput(input: string): string {
    // Remove potentially harmful characters
    return input.replace(/[<>\"'%;()&+]/g, '');
  }

  static validateAddress(address: string): boolean {
    try {
      ethers.getAddress(address);
      return true;
    } catch {
      return false;
    }
  }

  static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  static isValidHash(hash: string): boolean {
    return /^[a-fA-F0-9]{64}$/.test(hash);
  }
}

// Export singleton instance
export const blockchainSecurityService = new BlockchainSecurityService(); 