// 🎨 Human & AI-Curated Content System Types
// Morocco Made Real - Cultural Content Curation Framework

export interface CulturalContent {
  id: string;
  type: CulturalContentType;
  title: string;
  description: string;
  culturalSignificance: CulturalSignificance;
  curationMetadata: CurationMetadata;
  blockchainCertificate: ContentCertificate;
  multimedia: MultimediaContent[];
  translations: ContentTranslation[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CulturalContentType {
  ARTISAN_STORY = 'artisan_story',
  TRADITIONAL_TECHNIQUE = 'traditional_technique',
  CULTURAL_CONTEXT = 'cultural_context',
  HISTORICAL_NARRATIVE = 'historical_narrative',
  EXPERT_COMMENTARY = 'expert_commentary',
  TOURIST_EXPERIENCE = 'tourist_experience',
  MUSEUM_EXHIBITION = 'museum_exhibition',
  EDUCATIONAL_MODULE = 'educational_module'
}

export interface CulturalSignificance {
  authenticityScore: number; // 0-100, AI-calculated
  culturalImportance: CulturalImportanceLevel;
  historicalPeriod: string;
  region: MoroccanRegion;
  craftTradition: CraftTradition;
  culturalThemes: string[];
  relatedPractices: string[];
  preservationPriority: PreservationPriority;
}

export enum CulturalImportanceLevel {
  FOUNDATIONAL = 'foundational', // Core cultural practices
  SIGNIFICANT = 'significant',   // Important regional practices
  NOTABLE = 'notable',          // Interesting cultural elements
  EMERGING = 'emerging'         // New or evolving practices
}

export enum PreservationPriority {
  CRITICAL = 'critical',       // At risk of being lost
  HIGH = 'high',              // Important to preserve
  MEDIUM = 'medium',          // Should be documented
  LOW = 'low'                 // Nice to have
}

export interface CurationMetadata {
  aiCuration: AICurationData;
  humanCuration: HumanCurationData;
  qualityAssurance: QualityAssuranceData;
  contentValidation: ContentValidation;
  curationWorkflow: CurationWorkflow;
}

export interface AICurationData {
  aiModel: string; // GPT-4, Claude, etc.
  confidenceScore: number; // 0-100
  processingDate: Date;
  culturalContextAnalysis: {
    keyThemes: string[];
    culturalConnections: string[];
    historicalReferences: string[];
    authenticityIndicators: string[];
  };
  contentSuggestions: {
    relatedContent: string[];
    enhancementOpportunities: string[];
    missingElements: string[];
  };
  languageProcessing: {
    originalLanguage: string;
    translationQuality: number;
    culturalAdaptations: string[];
  };
}

export interface HumanCurationData {
  curator: CuratorProfile;
  curationDate: Date;
  expertiseLevel: ExpertiseLevel;
  curationNotes: string;
  culturalValidation: {
    authenticityConfirmed: boolean;
    culturalAccuracy: number; // 0-100
    expertCommentary: string;
    recommendedEnhancements: string[];
  };
  editorialDecisions: {
    contentApproved: boolean;
    modificationsRequired: string[];
    publicationReady: boolean;
  };
}

export interface CuratorProfile {
  id: string;
  name: string;
  credentials: string[];
  specializations: CraftTradition[];
  experience: number; // years
  certifications: string[];
  culturalBackground: string;
  languages: string[];
}

export enum ExpertiseLevel {
  MASTER_CRAFTSPERSON = 'master_craftsperson',
  CULTURAL_HISTORIAN = 'cultural_historian',
  MUSEUM_CURATOR = 'museum_curator',
  ACADEMIC_RESEARCHER = 'academic_researcher',
  COMMUNITY_ELDER = 'community_elder',
  CERTIFIED_GUIDE = 'certified_guide'
}

export interface QualityAssuranceData {
  factualAccuracy: number; // 0-100
  culturalSensitivity: number; // 0-100
  educationalValue: number; // 0-100
  engagementPotential: number; // 0-100
  accessibilityScore: number; // 0-100
  multilingualQuality: number; // 0-100
  reviewedBy: string[];
  approvalStatus: ApprovalStatus;
  qualityNotes: string;
}

export enum ApprovalStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REJECTED = 'rejected'
}

export interface ContentValidation {
  sourceVerification: SourceVerification;
  culturalAuthenticity: AuthenticityValidation;
  factualAccuracy: FactualValidation;
  ethicalCompliance: EthicalValidation;
}

export interface SourceVerification {
  primarySources: string[];
  secondarySources: string[];
  expertWitnesses: string[];
  documentationEvidence: string[];
  verificationStatus: VerificationStatus;
}

export enum VerificationStatus {
  VERIFIED = 'verified',
  PARTIALLY_VERIFIED = 'partially_verified',
  UNVERIFIED = 'unverified',
  DISPUTED = 'disputed'
}

export interface AuthenticityValidation {
  traditionalAccuracy: boolean;
  culturalContext: boolean;
  historicalAccuracy: boolean;
  practiceAuthenticity: boolean;
  validatedBy: string[];
  validationNotes: string;
}

export interface FactualValidation {
  factsChecked: boolean;
  sourcesVerified: boolean;
  datesConfirmed: boolean;
  locationsVerified: boolean;
  validationDate: Date;
  validator: string;
}

export interface EthicalValidation {
  culturalSensitivity: boolean;
  communityConsent: boolean;
  intellectualPropertyRespected: boolean;
  fairRepresentation: boolean;
  ethicsReviewer: string;
  ethicsNotes: string;
}

export interface CurationWorkflow {
  currentStage: WorkflowStage;
  workflowHistory: WorkflowStep[];
  assignedCurators: string[];
  deadlines: WorkflowDeadline[];
  priority: WorkflowPriority;
}

export enum WorkflowStage {
  CONTENT_CREATION = 'content_creation',
  AI_ANALYSIS = 'ai_analysis',
  HUMAN_REVIEW = 'human_review',
  EXPERT_VALIDATION = 'expert_validation',
  QUALITY_ASSURANCE = 'quality_assurance',
  FINAL_APPROVAL = 'final_approval',
  PUBLICATION = 'publication',
  MAINTENANCE = 'maintenance'
}

export interface WorkflowStep {
  stage: WorkflowStage;
  completedBy: string;
  completedAt: Date;
  notes: string;
  outcome: StepOutcome;
}

export enum StepOutcome {
  APPROVED = 'approved',
  APPROVED_WITH_CHANGES = 'approved_with_changes',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision'
}

export interface WorkflowDeadline {
  stage: WorkflowStage;
  deadline: Date;
  priority: WorkflowPriority;
}

export enum WorkflowPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface ContentCertificate {
  certificateId: string;
  blockchainHash: string;
  issuedAt: Date;
  issuedBy: string;
  certificateType: CertificateType;
  contentHash: string;
  curationCertification: CurationCertification;
  authenticityCertification: AuthenticityCertification;
  qualityCertification: QualityCertification;
  blockchainNetwork: string;
  transactionId: string;
  ipfsHash?: string;
}

export enum CertificateType {
  CULTURAL_CONTENT = 'cultural_content',
  ARTISAN_STORY = 'artisan_story',
  MUSEUM_PIECE = 'museum_piece',
  EDUCATIONAL_CONTENT = 'educational_content',
  EXPERT_COMMENTARY = 'expert_commentary'
}

export interface CurationCertification {
  aiCurationVerified: boolean;
  humanCurationVerified: boolean;
  expertValidationCompleted: boolean;
  qualityAssurancePassed: boolean;
  curationScore: number; // 0-100
  certifiedCurators: string[];
}

export interface AuthenticityCertification {
  culturalAuthenticity: number; // 0-100
  historicalAccuracy: number; // 0-100
  traditionalCompliance: number; // 0-100
  sourceVerification: number; // 0-100
  overallAuthenticity: number; // 0-100
  authenticityGuarantee: boolean;
}

export interface QualityCertification {
  contentQuality: number; // 0-100
  educationalValue: number; // 0-100
  culturalSensitivity: number; // 0-100
  accessibility: number; // 0-100
  multilingualQuality: number; // 0-100
  overallQuality: number; // 0-100
  qualityGuarantee: boolean;
}

export interface MultimediaContent {
  id: string;
  type: MultimediaType;
  url: string;
  ipfsHash?: string;
  title: string;
  description: string;
  culturalContext: string;
  captureDate: Date;
  location: GeographicLocation;
  creator: string;
  rights: ContentRights;
  qualityMetrics: MediaQualityMetrics;
}

export enum MultimediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  THREE_D_MODEL = '3d_model',
  INTERACTIVE_CONTENT = 'interactive_content'
}

export interface ContentRights {
  license: string;
  attribution: string;
  commercialUse: boolean;
  modifications: boolean;
  redistribution: boolean;
  culturalPermissions: boolean;
}

export interface MediaQualityMetrics {
  resolution: string;
  fileSize: number;
  duration?: number; // for video/audio
  compressionQuality: number;
  accessibilityFeatures: string[];
}

export interface ContentTranslation {
  language: string;
  title: string;
  description: string;
  content: string;
  translator: TranslatorProfile;
  translationQuality: TranslationQuality;
  culturalAdaptation: CulturalAdaptation;
  reviewStatus: ReviewStatus;
}

export interface TranslatorProfile {
  id: string;
  name: string;
  nativeLanguages: string[];
  specializations: string[];
  culturalBackground: string;
  certifications: string[];
}

export interface TranslationQuality {
  accuracyScore: number; // 0-100
  fluencyScore: number; // 0-100
  culturalAppropriatenessScore: number; // 0-100
  overallQuality: number; // 0-100
  reviewedBy: string;
  reviewDate: Date;
}

export interface CulturalAdaptation {
  culturalContextAdjusted: boolean;
  localReferencesAdded: boolean;
  culturalSensitivityMaintained: boolean;
  adaptationNotes: string;
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_REVISION = 'needs_revision',
  REJECTED = 'rejected'
}

export interface GeographicLocation {
  country: string;
  region: MoroccanRegion;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  culturalSignificance: string;
}

export enum MoroccanRegion {
  MARRAKECH_SAFI = 'marrakech_safi',
  CASABLANCA_SETTAT = 'casablanca_settat',
  RABAT_SALE_KENITRA = 'rabat_sale_kenitra',
  FES_MEKNES = 'fes_meknes',
  TANGIER_TETOUAN_AL_HOCEIMA = 'tangier_tetouan_al_hoceima',
  ORIENTAL = 'oriental',
  BENI_MELLAL_KHENIFRA = 'beni_mellal_khenifra',
  DRAA_TAFILALET = 'draa_tafilalet',
  SOUSS_MASSA = 'souss_massa',
  GUELMIM_OUED_NOUN = 'guelmim_oued_noun',
  LAAYOUNE_SAKIA_EL_HAMRA = 'laayoune_sakia_el_hamra',
  DAKHLA_OUED_ED_DAHAB = 'dakhla_oued_ed_dahab'
}

export enum CraftTradition {
  POTTERY = 'pottery',
  TEXTILES = 'textiles',
  METALWORK = 'metalwork',
  WOODWORK = 'woodwork',
  LEATHERWORK = 'leatherwork',
  JEWELRY = 'jewelry',
  CALLIGRAPHY = 'calligraphy',
  MOSAIC = 'mosaic',
  CARPET_WEAVING = 'carpet_weaving',
  EMBROIDERY = 'embroidery',
  GLASSWORK = 'glasswork',
  STONEWORK = 'stonework'
}

// Content Discovery and Recommendation Interfaces
export interface ContentRecommendation {
  contentId: string;
  relevanceScore: number; // 0-100
  recommendationReason: string;
  culturalAlignment: number; // 0-100
  userInterestMatch: number; // 0-100
  educationalValue: number; // 0-100
  recommendationType: RecommendationType;
}

export enum RecommendationType {
  AI_PERSONALIZED = 'ai_personalized',
  CURATOR_SELECTED = 'curator_selected',
  TRENDING = 'trending',
  RELATED_CONTENT = 'related_content',
  EXPERT_PICK = 'expert_pick'
}

export interface CulturalJourney {
  id: string;
  userId: string;
  title: string;
  description: string;
  curatedContent: string[]; // Content IDs
  journeyType: JourneyType;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // minutes
  culturalThemes: string[];
  learningObjectives: string[];
  completionCertificate?: string;
  progress: JourneyProgress;
}

export enum JourneyType {
  TOURIST_DISCOVERY = 'tourist_discovery',
  ARTISAN_MASTERY = 'artisan_mastery',
  CULTURAL_EDUCATION = 'cultural_education',
  MUSEUM_EXPLORATION = 'museum_exploration',
  EXPERT_DEEP_DIVE = 'expert_deep_dive'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface JourneyProgress {
  completedContent: string[];
  currentContent: string;
  progressPercentage: number;
  timeSpent: number; // minutes
  engagementScore: number; // 0-100
  lastAccessed: Date;
} 