// Museum extract interfaces for public display and educational content

export interface EducationalContent {
  level: 'elementary' | 'middle_school' | 'high_school' | 'university' | 'adult' | 'expert';
  language: 'en' | 'fr' | 'ar' | 'es';
  content: {
    overview: string;
    historicalContext: string;
    culturalSignificance: string;
    techniques: string;
    materials: string;
    symbolism?: string;
    modernRelevance: string;
  };
  activities?: {
    type: 'quiz' | 'interactive' | 'video' | 'audio' | 'ar_experience';
    title: string;
    description: string;
    url?: string;
    duration?: number;
  }[];
  learningObjectives: string[];
  vocabulary: {
    term: string;
    definition: string;
    pronunciation?: string;
  }[];
}

export interface CurationWorkflow {
  submissionDate: Date;
  submittedBy: string;
  curatorAssigned?: string;
  assignmentDate?: Date;
  
  reviewStages: {
    stage: 'initial_review' | 'content_review' | 'legal_review' | 'final_approval';
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'needs_revision';
    reviewer: string;
    reviewDate?: Date;
    comments?: string;
    requiredChanges?: string[];
  }[];
  
  approvalDate?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  revisionRequests: {
    date: Date;
    reviewer: string;
    changes: string[];
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }[];
  
  publicationDate?: Date;
  publicationStatus: 'draft' | 'under_review' | 'approved' | 'published' | 'archived';
}

export interface DisplaySettings {
  featured: boolean;
  featuredUntil?: Date;
  category: 'pottery' | 'textiles' | 'jewelry' | 'woodwork' | 'metalwork' | 'leather' | 'other';
  subcategory?: string;
  
  visibility: {
    public: boolean;
    searchable: boolean;
    shareable: boolean;
    downloadable: boolean;
    printable: boolean;
  };
  
  displayOrder: number;
  relatedPieces: string[]; // IDs of related museum extracts
  collections: string[]; // Collection names this piece belongs to
  
  interactiveFeatures: {
    zoom: boolean;
    rotation: boolean;
    comparison: boolean;
    augmentedReality: boolean;
    virtualTour: boolean;
  };
  
  accessibilityFeatures: {
    audioDescription: boolean;
    textToSpeech: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
  };
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'article' | 'website';
    locale: string;
  };
  
  structuredData: {
    type: 'CreativeWork' | 'VisualArtwork' | 'CulturalEvent';
    name: string;
    description: string;
    creator: string;
    dateCreated: string;
    material: string[];
    technique: string[];
    culturalContext: string;
  };
  
  alternateLanguages: {
    language: string;
    url: string;
  }[];
}

export interface AnalyticsData {
  views: {
    total: number;
    unique: number;
    byCountry: { [country: string]: number };
    byLanguage: { [language: string]: number };
    byDevice: { [device: string]: number };
  };
  
  engagement: {
    averageTimeSpent: number; // seconds
    bounceRate: number; // percentage
    interactionRate: number; // percentage
    shareCount: number;
    downloadCount: number;
    favoriteCount: number;
  };
  
  educational: {
    quizCompletions: number;
    averageQuizScore: number;
    activityEngagement: { [activityId: string]: number };
  };
  
  feedback: {
    ratings: {
      average: number;
      count: number;
      distribution: { [rating: number]: number };
    };
    comments: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  
  lastUpdated: Date;
}

export interface MuseumExtract {
  // Core Identity
  id: string;
  pieceId: string; // Reference to original ArtisanPiece
  extractId: string; // Human-readable museum ID
  
  // Basic Information
  title: string;
  subtitle?: string;
  description: string;
  shortDescription: string; // For cards and previews
  
  // Artisan Information (public-safe)
  artisan: {
    name: string;
    region: string;
    biography: string;
    specialization: string;
    yearsOfExperience?: number;
    awards?: string[];
    publicContact?: string;
  };
  
  // Cultural Context
  cultural: {
    technique: string;
    region: string;
    historicalPeriod: string;
    culturalSignificance: string;
    symbolism?: string;
    traditionalUse: string;
    modernAdaptations?: string;
    relatedTraditions: string[];
  };
  
  // Technical Details
  technical: {
    materials: string[];
    tools: string[];
    dimensions?: {
      length: number;
      width: number;
      height: number;
      weight: number;
      unit: 'cm' | 'inch';
    };
    condition: string;
    ageEstimate?: string;
    productionTime?: string;
  };
  
  // Media Content
  media: {
    primaryImage: {
      url: string;
      alt: string;
      caption: string;
      photographer?: string;
    };
    gallery: {
      url: string;
      alt: string;
      caption: string;
      type: 'detail' | 'process' | 'context' | 'comparison';
    }[];
    videos?: {
      url: string;
      title: string;
      description: string;
      duration: number;
      type: 'creation_process' | 'artisan_interview' | 'cultural_context';
    }[];
    audio?: {
      url: string;
      title: string;
      description: string;
      duration: number;
      type: 'narration' | 'ambient' | 'interview';
    }[];
  };
  
  // Educational Content
  education: EducationalContent[];
  
  // Curation and Workflow
  curation: CurationWorkflow;
  
  // Display Settings
  display: DisplaySettings;
  
  // SEO and Discoverability
  seo: SEOMetadata;
  
  // Analytics
  analytics: AnalyticsData;
  
  // Blockchain Reference
  blockchain: {
    originalCertificateId: string;
    verificationUrl: string;
    authenticityScore: number;
    lastVerified: Date;
  };
  
  // Legal and Rights
  rights: {
    copyright: string;
    license: 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'CC-BY-NC' | 'All Rights Reserved';
    attribution: string;
    commercialUse: boolean;
    modifications: boolean;
    redistribution: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  lastReviewedAt?: Date;
  
  // Version Control
  version: number;
  previousVersions?: string[]; // IDs of previous versions
  changeLog: {
    version: number;
    date: Date;
    changes: string[];
    changedBy: string;
  }[];
}

// Database table interface for Supabase
export interface MuseumExtractRow {
  id: string;
  piece_id: string;
  extract_id: string;
  title: string;
  subtitle?: string;
  description: string;
  short_description: string;
  artisan: MuseumExtract['artisan'];
  cultural: MuseumExtract['cultural'];
  technical: MuseumExtract['technical'];
  media: MuseumExtract['media'];
  education: EducationalContent[];
  curation: CurationWorkflow;
  display: DisplaySettings;
  seo: SEOMetadata;
  analytics: AnalyticsData;
  blockchain: MuseumExtract['blockchain'];
  rights: MuseumExtract['rights'];
  created_at: string;
  updated_at: string;
  published_at?: string;
  last_reviewed_at?: string;
  version: number;
  previous_versions?: string[];
  change_log: MuseumExtract['changeLog'];
}

// Museum collection interface
export interface MuseumCollection {
  id: string;
  name: string;
  description: string;
  theme: string;
  curator: string;
  pieces: string[]; // MuseumExtract IDs
  featured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Museum search and filter interface
export interface MuseumSearchFilters {
  query?: string;
  category?: string[];
  region?: string[];
  technique?: string[];
  materials?: string[];
  period?: string[];
  featured?: boolean;
  language?: 'en' | 'fr' | 'ar' | 'es';
  sortBy?: 'relevance' | 'date' | 'popularity' | 'title' | 'random';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Museum extract generation request
export interface ExtractGenerationRequest {
  pieceId: string;
  requestedBy: string;
  targetAudience: 'general_public' | 'students' | 'researchers' | 'tourists';
  languages: ('en' | 'fr' | 'ar' | 'es')[];
  includeEducational: boolean;
  includeInteractive: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
  deadline?: Date;
} 