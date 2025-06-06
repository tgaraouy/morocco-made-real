// Digital certificate interfaces for blockchain-verified authenticity

export interface CertificateMetadata {
  version: string;
  standard: 'ERC-721' | 'ERC-1155' | 'custom';
  schema: string;
  issuer: {
    name: string;
    address: string;
    publicKey: string;
    website: string;
    contact: string;
  };
  issuanceDate: Date;
  expirationDate?: Date;
  revocable: boolean;
  transferable: boolean;
}

export interface VerificationData {
  authenticityScore: number; // 1-10
  verificationDate: Date;
  verifierSignature: string;
  verifierPublicKey: string;
  blockchainProof: {
    transactionHash: string;
    blockNumber: number;
    contractAddress: string;
    tokenId?: string;
    network: 'polygon' | 'ethereum' | 'binance';
  };
  ipfsProof: {
    hash: string;
    gateway: string;
    pinned: boolean;
  };
  verificationMethods: {
    method: 'visual_inspection' | 'material_analysis' | 'provenance_check' | 'expert_review' | 'ai_analysis';
    result: 'passed' | 'failed' | 'inconclusive';
    confidence: number; // 0-1
    notes?: string;
  }[];
  witnesses?: {
    name: string;
    role: string;
    signature: string;
    date: Date;
  }[];
}

export interface CertificateDesign {
  template: 'moroccan_traditional' | 'modern_minimal' | 'luxury_gold' | 'cultural_heritage';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
    arabic: string;
  };
  layout: 'portrait' | 'landscape';
  watermark?: string;
  border: boolean;
  logo: string;
  backgroundPattern?: string;
}

export interface QRCodeData {
  url: string;
  data: {
    certificateId: string;
    verificationUrl: string;
    blockchainHash: string;
    quickVerify: string;
  };
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  format: 'PNG' | 'SVG';
  embedded: boolean;
}

export interface MultiLanguageContent {
  language: 'en' | 'fr' | 'ar' | 'es';
  title: string;
  description: string;
  artisanName: string;
  technique: string;
  region: string;
  culturalSignificance: string;
  verificationStatement: string;
  legalDisclaimer: string;
  contactInfo: string;
}

export interface DigitalCertificate {
  // Core Identity
  id: string;
  certificateId: string; // Human-readable ID
  pieceId: string; // Reference to ArtisanPiece
  
  // Certificate Details
  title: string;
  description: string;
  type: 'authenticity' | 'provenance' | 'quality' | 'cultural_heritage' | 'master_craft';
  
  // Piece Information
  pieceDetails: {
    title: string;
    artisanName: string;
    artisanId: string;
    technique: string;
    region: string;
    materials: string[];
    dimensions?: {
      length: number;
      width: number;
      height: number;
      weight: number;
      unit: 'cm' | 'inch';
    };
    estimatedValue: {
      amount: number;
      currency: 'MAD' | 'USD' | 'EUR';
      date: Date;
    };
    photos: string[]; // URLs to images
  };
  
  // Verification
  verification: VerificationData;
  
  // Certificate Metadata
  metadata: CertificateMetadata;
  
  // Visual Design
  design: CertificateDesign;
  
  // QR Code
  qrCode: QRCodeData;
  
  // Multi-language Support
  content: MultiLanguageContent[];
  defaultLanguage: 'en' | 'fr' | 'ar' | 'es';
  
  // Museum Integration
  museumExtract?: {
    publicDescription: string;
    displayImages: string[];
    culturalContext: string;
    isPubliclyDisplayable: boolean;
    educationalContent: string;
    curatorNotes?: string;
  };
  
  // Legal and Compliance
  legal: {
    jurisdiction: string;
    applicableLaw: string;
    disputeResolution: string;
    liability: string;
    warranty: string;
    termsOfUse: string;
  };
  
  // Status and Lifecycle
  status: 'draft' | 'pending' | 'issued' | 'verified' | 'revoked' | 'expired';
  issuedBy: string;
  issuedTo?: string;
  
  // File Outputs
  outputs: {
    pdf?: {
      url: string;
      size: number;
      pages: number;
      watermarked: boolean;
    };
    image?: {
      url: string;
      format: 'PNG' | 'JPEG';
      resolution: string;
    };
    nft?: {
      tokenId: string;
      contractAddress: string;
      network: string;
      marketplaceUrl?: string;
    };
  };
  
  // Analytics and Usage
  analytics: {
    viewCount: number;
    verificationCount: number;
    downloadCount: number;
    shareCount: number;
    lastVerified?: Date;
    verificationHistory: {
      date: Date;
      verifier: string;
      result: 'valid' | 'invalid' | 'expired';
      ipAddress?: string;
    }[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  issuedAt?: Date;
  expiresAt?: Date;
  
  // Security
  security: {
    digitalSignature: string;
    hashAlgorithm: 'SHA-256' | 'SHA-512';
    encryptionLevel: 'standard' | 'high' | 'military';
    accessControl: 'public' | 'restricted' | 'private';
    auditTrail: {
      action: string;
      user: string;
      timestamp: Date;
      ipAddress?: string;
      details?: string;
    }[];
  };
}

// Database table interface for Supabase
export interface DigitalCertificateRow {
  id: string;
  certificate_id: string;
  piece_id: string;
  title: string;
  description: string;
  type: DigitalCertificate['type'];
  piece_details: DigitalCertificate['pieceDetails'];
  verification: VerificationData;
  metadata: CertificateMetadata;
  design: CertificateDesign;
  qr_code: QRCodeData;
  content: MultiLanguageContent[];
  default_language: DigitalCertificate['defaultLanguage'];
  museum_extract?: DigitalCertificate['museumExtract'];
  legal: DigitalCertificate['legal'];
  status: DigitalCertificate['status'];
  issued_by: string;
  issued_to?: string;
  outputs: DigitalCertificate['outputs'];
  analytics: DigitalCertificate['analytics'];
  created_at: string;
  updated_at: string;
  issued_at?: string;
  expires_at?: string;
  security: DigitalCertificate['security'];
}

// Certificate validation interface
export interface CertificateValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
  details: {
    blockchainVerified: boolean;
    signatureValid: boolean;
    notExpired: boolean;
    issuerTrusted: boolean;
    contentIntact: boolean;
    qrCodeValid: boolean;
  };
  verifiedAt: Date;
  verificationId: string;
}

// Certificate generation request
export interface CertificateGenerationRequest {
  pieceId: string;
  type: DigitalCertificate['type'];
  language: 'en' | 'fr' | 'ar' | 'es';
  template: CertificateDesign['template'];
  includeQR: boolean;
  includeNFT: boolean;
  publicDisplay: boolean;
  requestedBy: string;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
} 