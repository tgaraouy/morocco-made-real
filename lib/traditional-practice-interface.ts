/**
 * Traditional Practice Interface for Cultural Content Validation
 * Used to validate uploaded videos, images, and documents against authentic Moroccan practices
 */

export interface TraditionalPractice {
  // Core Practice Information
  id: string;
  name: string;
  arabicName?: string;
  berberName?: string;
  category: PracticeCategory;
  region: MoroccanRegion;
  
  // Historical Context
  originPeriod: HistoricalPeriod;
  culturalSignificance: CulturalSignificance;
  religiousAspects?: ReligiousAspect[];
  
  // Practice Details
  tools: TraditionalTool[];
  materials: NaturalMaterial[];
  techniques: CraftTechnique[];
  rituals?: CulturalRitual[];
  
  // Validation Criteria
  authenticityMarkers: AuthenticityMarker[];
  commonMistakes: string[];
  redFlags: ValidationFlag[];
  
  // Media Requirements
  requiredDocumentation: DocumentationType[];
  videoRequirements?: VideoRequirement;
  imageRequirements?: ImageRequirement;
  
  // Verification Levels
  verificationLevel: VerificationLevel;
  expertValidators: ExpertValidator[];
  communityEndorsements?: CommunityEndorsement[];
}

export enum PracticeCategory {
  POTTERY = 'pottery',
  WEAVING = 'weaving',
  METALWORK = 'metalwork',
  LEATHERWORK = 'leatherwork',
  WOODWORK = 'woodwork',
  JEWELRY = 'jewelry',
  COOKING = 'cooking',
  MUSIC = 'music',
  DANCE = 'dance',
  CALLIGRAPHY = 'calligraphy',
  ARCHITECTURE = 'architecture',
  TEXTILE_DYEING = 'textile_dyeing',
  CARPET_WEAVING = 'carpet_weaving',
  ZELLIGE = 'zellige'
}

export enum MoroccanRegion {
  FEZ = 'fez',
  MARRAKECH = 'marrakech',
  CASABLANCA = 'casablanca',
  RABAT = 'rabat',
  MEKNES = 'meknes',
  TANGIER = 'tangier',
  AGADIR = 'agadir',
  OUARZAZATE = 'ouarzazate',
  ATLAS_MOUNTAINS = 'atlas_mountains',
  SAHARA = 'sahara',
  RIF_MOUNTAINS = 'rif_mountains',
  SAFI = 'safi',
  SALE = 'sale',
  TETOUAN = 'tetouan',
  CHEFCHAOUEN = 'chefchaouen'
}

export enum HistoricalPeriod {
  PRE_ISLAMIC = 'pre_islamic',
  IDRISID = 'idrisid',
  ALMORAVID = 'almoravid',
  ALMOHAD = 'almohad',
  MARINID = 'marinid',
  SAADIAN = 'saadian',
  ALAOUITE = 'alaouite',
  FRENCH_PROTECTORATE = 'french_protectorate',
  INDEPENDENCE = 'independence',
  CONTEMPORARY = 'contemporary'
}

export interface CulturalSignificance {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'SACRED';
  description: string;
  socialRole: string;
  economicImpact: string;
  spiritualMeaning?: string;
  genderRoles?: GenderRole[];
  seasonalAspects?: SeasonalAspect[];
}

export interface GenderRole {
  gender: 'MALE' | 'FEMALE' | 'BOTH' | 'ELDERS';
  responsibilities: string[];
  traditionalAge: string;
  modernAdaptations?: string[];
}

export interface SeasonalAspect {
  season: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'RAMADAN' | 'EID';
  activities: string[];
  significance: string;
}

export interface ReligiousAspect {
  type: 'ISLAMIC' | 'BERBER' | 'SUFI' | 'FOLK';
  practices: string[];
  prohibitions?: string[];
  blessings?: string[];
  timing?: string[];
}

export interface TraditionalTool {
  name: string;
  arabicName?: string;
  berberName?: string;
  material: string;
  purpose: string;
  craftsmanship: 'HANDMADE' | 'ARTISAN_CRAFTED' | 'INHERITED';
  age?: string;
  region?: MoroccanRegion;
}

export interface NaturalMaterial {
  name: string;
  source: 'LOCAL' | 'REGIONAL' | 'TRADITIONAL_TRADE';
  sustainabilityLevel: 'SUSTAINABLE' | 'MANAGED' | 'CONSERVATION_CONCERN';
  harvestingSeason?: string;
  preparationMethod: string;
  qualityMarkers: string[];
}

export interface CraftTechnique {
  name: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER';
  learningPeriod: string;
  prerequisites: string[];
  commonErrors: string[];
  masterySigns: string[];
  regionalVariations?: RegionalVariation[];
}

export interface RegionalVariation {
  region: MoroccanRegion;
  differences: string[];
  localNames?: string[];
  uniqueAspects: string[];
}

export interface CulturalRitual {
  name: string;
  timing: string;
  participants: string[];
  significance: string;
  steps: RitualStep[];
  modernAdaptations?: string[];
}

export interface RitualStep {
  order: number;
  action: string;
  meaning: string;
  requirements?: string[];
  duration?: string;
}

export interface AuthenticityMarker {
  type: 'VISUAL' | 'AUDITORY' | 'TECHNICAL' | 'CULTURAL' | 'HISTORICAL';
  indicator: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  examples: string[];
}

export interface ValidationFlag {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  trigger: string;
  message: string;
  severity: 'REJECT' | 'REVIEW' | 'ANNOTATE';
  autoDetectable: boolean;
}

export enum DocumentationType {
  VIDEO_DEMONSTRATION = 'video_demonstration',
  STEP_BY_STEP_PHOTOS = 'step_by_step_photos',
  FINAL_PRODUCT_IMAGES = 'final_product_images',
  TOOL_DOCUMENTATION = 'tool_documentation',
  MATERIAL_CERTIFICATES = 'material_certificates',
  ARTISAN_CREDENTIALS = 'artisan_credentials',
  COMMUNITY_ENDORSEMENT = 'community_endorsement',
  HISTORICAL_REFERENCES = 'historical_references',
  TECHNIQUE_MANUAL = 'technique_manual',
  AUDIO_NARRATIVES = 'audio_narratives'
}

export interface VideoRequirement {
  minDuration: number; // seconds
  maxDuration: number; // seconds
  requiredAngles: CameraAngle[];
  audioQuality: AudioQuality;
  lightingRequirements: string[];
  mustShowSteps: string[];
  forbiddenElements: string[];
  qualityStandards: VideoQuality;
}

export enum CameraAngle {
  OVERVIEW = 'overview',
  CLOSE_UP_HANDS = 'close_up_hands',
  TOOL_DETAIL = 'tool_detail',
  PROCESS_SEQUENCE = 'process_sequence',
  FINAL_PRODUCT = 'final_product',
  ARTISAN_FACE = 'artisan_face',
  WORKSPACE = 'workspace'
}

export interface AudioQuality {
  clearNarration: boolean;
  backgroundNoiseLimits: string;
  languageRequirements: string[];
  traditionalSounds?: string[];
}

export interface VideoQuality {
  minResolution: '720p' | '1080p' | '4K';
  fps: number;
  stabilization: boolean;
  colorAccuracy: string;
  compressionLimits: string;
}

export interface ImageRequirement {
  minResolution: { width: number; height: number };
  formats: ImageFormat[];
  lightingStandards: LightingStandard[];
  compositionRules: CompositionRule[];
  colorAccuracy: string;
  requiredShots: RequiredShot[];
}

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  TIFF = 'tiff',
  RAW = 'raw'
}

export interface LightingStandard {
  type: 'NATURAL' | 'STUDIO' | 'TRADITIONAL';
  requirements: string[];
  timeOfDay?: string;
  restrictions?: string[];
}

export interface CompositionRule {
  rule: string;
  importance: 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
  description: string;
  examples?: string[];
}

export interface RequiredShot {
  type: ShotType;
  quantity: number;
  description: string;
  specificRequirements?: string[];
}

export enum ShotType {
  WIDE_OVERVIEW = 'wide_overview',
  MEDIUM_WORK = 'medium_work',
  CLOSE_UP_DETAIL = 'close_up_detail',
  MACRO_TECHNIQUE = 'macro_technique',
  BEFORE_AFTER = 'before_after',
  PROCESS_SEQUENCE = 'process_sequence',
  ARTISAN_PORTRAIT = 'artisan_portrait',
  TOOLS_MATERIALS = 'tools_materials'
}

export enum VerificationLevel {
  COMMUNITY = 'community',
  ARTISAN = 'artisan',
  EXPERT = 'expert',
  MASTER = 'master',
  UNESCO = 'unesco'
}

export interface ExpertValidator {
  id: string;
  name: string;
  credentials: string[];
  specializations: PracticeCategory[];
  region: MoroccanRegion;
  verificationLevel: VerificationLevel;
  contactInfo?: string;
  languagesSpoken: string[];
}

export interface CommunityEndorsement {
  community: string;
  region: MoroccanRegion;
  endorsementType: 'TRADITIONAL' | 'CONTEMPORARY' | 'ADAPTED';
  endorsers: string[];
  date: string;
  significance: string;
}

// Validation Result Interface
export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  level: VerificationLevel;
  flags: ValidationFlag[];
  authenticityMarkers: AuthenticityMarker[];
  recommendations: string[];
  requiredCorrections: string[];
  expertReviewRequired: boolean;
  blockchainCertifiable: boolean;
} 