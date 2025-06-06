// Core interfaces for artisan piece documentation and blockchain verification

export interface TraditionalPractice {
  id: string;
  technique: string;
  region: string;
  historicalContext: string;
  culturalSignificance: 'low' | 'medium' | 'high' | 'exceptional';
  originEra: string;
  relatedPractices: string[];
  preservationStatus: 'endangered' | 'vulnerable' | 'stable' | 'thriving';
  unescoRecognition?: boolean;
  description: string;
  materials: string[];
  tools: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'master';
  learningTimeMonths: number;
}

export interface MultimediaContent {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  ipfsHash?: string;
  title: string;
  description?: string;
  duration?: number; // for video/audio in seconds
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    capturedAt?: Date;
    capturedBy?: string;
    equipment?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtisanJourney {
  creationStory: string;
  inspiration: string;
  timeToCreateHours: number;
  materialsUsed: {
    name: string;
    source: string;
    quantity: string;
    cost?: number;
    sustainability: 'local' | 'regional' | 'imported' | 'recycled';
  }[];
  toolsUsed: {
    name: string;
    type: 'traditional' | 'modern' | 'hybrid';
    age?: string;
    significance?: string;
  }[];
  processSteps: {
    stepNumber: number;
    title: string;
    description: string;
    duration: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    multimedia?: string[]; // MultimediaContent IDs
  }[];
  challenges: string[];
  innovations: string[];
  culturalMeaning: string;
  personalSignificance: string;
}

export interface PricingInfo {
  originalPrice: number;
  currency: 'MAD' | 'USD' | 'EUR';
  priceJustification: string;
  costBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
    artisticValue: number;
  };
  marketComparison?: {
    similarPieces: {
      price: number;
      source: string;
      differences: string;
    }[];
  };
  negotiable: boolean;
  bulkDiscounts?: {
    quantity: number;
    discountPercentage: number;
  }[];
}

export interface BlockchainData {
  certificateId: string;
  transactionHash: string;
  blockNumber?: number;
  contractAddress: string;
  ipfsHash: string;
  timestamp: Date;
  gasUsed?: number;
  verificationLevel: 'bronze' | 'silver' | 'gold' | 'master';
  verifiedBy: string;
  verificationDate: Date;
  immutableProof: string;
  smartContractVersion: string;
}

export interface ArtisanPiece {
  // Basic Information
  id: string;
  title: string;
  description: string;
  artisanId: string;
  artisanName: string;
  artisanBio?: string;
  
  // Traditional Practice
  traditionalPractice: TraditionalPractice;
  
  // Creation Journey
  journey: ArtisanJourney;
  
  // Multimedia Documentation
  multimedia: {
    primaryImage: string; // MultimediaContent ID
    gallery: string[]; // MultimediaContent IDs
    creationVideo?: string; // MultimediaContent ID
    timelapseVideo?: string; // MultimediaContent ID
    audioNarration?: string; // MultimediaContent ID
    documentaryFootage?: string[]; // MultimediaContent IDs
  };
  
  // Pricing and Commerce
  pricing: PricingInfo;
  
  // Blockchain Integration
  blockchain: BlockchainData;
  
  // Status and Workflow
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
  workflowStage: 'documentation' | 'multimedia' | 'pricing' | 'blockchain' | 'museum_review' | 'published';
  
  // Museum Integration
  museumEligible: boolean;
  museumSubmitted: boolean;
  museumApproved?: boolean;
  curatorNotes?: string;
  
  // Metadata
  tags: string[];
  categories: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: 'cm' | 'inch';
  };
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'restoration_needed';
  authenticity: {
    score: number; // 1-10
    verifiedBy: string[];
    verificationMethods: string[];
    certificates: string[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // SEO and Discovery
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  featured: boolean;
  trending: boolean;
  viewCount: number;
  shareCount: number;
}

// Database table interfaces for Supabase
export interface ArtisanPieceRow {
  id: string;
  title: string;
  description: string;
  artisan_id: string;
  artisan_name: string;
  artisan_bio?: string;
  traditional_practice: TraditionalPractice;
  journey: ArtisanJourney;
  multimedia: ArtisanPiece['multimedia'];
  pricing: PricingInfo;
  blockchain: BlockchainData;
  status: ArtisanPiece['status'];
  workflow_stage: ArtisanPiece['workflowStage'];
  museum_eligible: boolean;
  museum_submitted: boolean;
  museum_approved?: boolean;
  curator_notes?: string;
  tags: string[];
  categories: string[];
  dimensions?: ArtisanPiece['dimensions'];
  condition: ArtisanPiece['condition'];
  authenticity: ArtisanPiece['authenticity'];
  created_at: string;
  updated_at: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  slug: string;
  featured: boolean;
  trending: boolean;
  view_count: number;
  share_count: number;
}

export interface MultimediaContentRow {
  id: string;
  type: MultimediaContent['type'];
  url: string;
  ipfs_hash?: string;
  title: string;
  description?: string;
  duration?: number;
  file_size: number;
  mime_type: string;
  thumbnail_url?: string;
  metadata: MultimediaContent['metadata'];
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
} 