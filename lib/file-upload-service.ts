import { supabase } from './supabase';
import { 
  TraditionalPractice, 
  ValidationResult, 
  PracticeCategory,
  DocumentationType,
  VerificationLevel,
  ValidationFlag
} from './traditional-practice-interface';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileType: 'image' | 'video' | 'document' | 'audio';
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  validationResult?: ValidationResult;
  practiceCategory?: PracticeCategory;
  documentationType?: DocumentationType;
  metadata: FileMetadata;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for videos/audio in seconds
  format: string;
  quality?: string;
  compression?: string;
  colorProfile?: string;
  audioChannels?: number;
  bitrate?: number;
  frameRate?: number;
  aspectRatio?: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    location?: string;
  };
  captureDate?: string;
  cameraModel?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  customMetadata?: Record<string, any>;
}

export interface FileUploadOptions {
  practiceCategory: PracticeCategory;
  documentationType: DocumentationType;
  validateOnUpload: boolean;
  generateThumbnail: boolean;
  extractMetadata: boolean;
  allowedFormats?: string[];
  maxSizeBytes?: number;
  compressionLevel?: 'none' | 'low' | 'medium' | 'high';
  addWatermark?: boolean;
  blockchainRecord?: boolean;
}

export interface ValidationOptions {
  strictMode: boolean;
  requireExpertReview: boolean;
  autoReject: boolean;
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'cultural' | 'quality' | 'authenticity';
  severity: 'error' | 'warning' | 'info';
  validator: (file: UploadedFile, practice: TraditionalPractice) => Promise<boolean>;
  message: string;
}

class FileUploadService {
  private readonly STORAGE_BUCKET = 'cultural-content';
  private readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  private readonly ALLOWED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  private readonly ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'tiff', 'webp', 'raw'];
  private readonly ALLOWED_DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'txt', 'md'];
  private readonly ALLOWED_AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'flac'];

  // Upload file with validation
  async uploadFile(
    file: File,
    options: FileUploadOptions,
    submissionId?: string
  ): Promise<UploadedFile> {
    try {
      // Pre-upload validation
      this.validateFileBasics(file, options);

      // Generate unique file path
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const sanitizedName = this.sanitizeFileName(file.name);
      const filePath = `${options.practiceCategory}/${options.documentationType}/${timestamp}-${sanitizedName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Extract metadata
      const metadata = await this.extractFileMetadata(file);

      // Create file record
      const uploadedFile: UploadedFile = {
        id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileType: this.getFileType(file.type),
        mimeType: file.type,
        size: file.size,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user', // Replace with actual user ID
        practiceCategory: options.practiceCategory,
        documentationType: options.documentationType,
        metadata
      };

      // Generate thumbnail if requested
      if (options.generateThumbnail && uploadedFile.fileType === 'image') {
        uploadedFile.thumbnailUrl = await this.generateThumbnail(uploadedFile);
      }

      // Validate against traditional practice if requested
      if (options.validateOnUpload) {
        const practice = await this.getTraditionalPractice(options.practiceCategory);
        if (practice) {
          uploadedFile.validationResult = await this.validateAgainstPractice(uploadedFile, practice);
        }
      }

      // Store file record in database
      await this.storeFileRecord(uploadedFile, submissionId);

      // Record on blockchain if requested
      if (options.blockchainRecord && uploadedFile.validationResult?.blockchainCertifiable) {
        await this.recordOnBlockchain(uploadedFile);
      }

      return uploadedFile;

    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  // Validate file against traditional practice
  async validateAgainstPractice(
    file: UploadedFile,
    practice: TraditionalPractice,
    options: ValidationOptions = { strictMode: false, requireExpertReview: false, autoReject: false }
  ): Promise<ValidationResult> {
    const flags: ValidationFlag[] = [];
    const authenticityMarkers = practice.authenticityMarkers;
    let score = 100;
    let isValid = true;

    try {
      // Technical validation
      const technicalFlags = await this.validateTechnicalRequirements(file, practice);
      flags.push(...technicalFlags);

      // Content validation
      const contentFlags = await this.validateContent(file, practice);
      flags.push(...contentFlags);

      // Cultural authenticity validation
      const culturalFlags = await this.validateCulturalAuthenticity(file, practice);
      flags.push(...culturalFlags);

      // Calculate score based on flags
      const criticalFlags = flags.filter(f => f.type === 'CRITICAL');
      const warningFlags = flags.filter(f => f.type === 'WARNING');
      
      score -= criticalFlags.length * 25;
      score -= warningFlags.length * 10;
      score = Math.max(0, score);

      // Determine if valid
      isValid = criticalFlags.length === 0 && score >= 60;

      // Expert review required?
      const expertReviewRequired = 
        options.requireExpertReview ||
        score < 80 ||
        criticalFlags.length > 0 ||
        practice.verificationLevel === VerificationLevel.EXPERT ||
        practice.verificationLevel === VerificationLevel.MASTER;

      return {
        isValid,
        score,
        level: this.determineVerificationLevel(score, flags, practice),
        flags,
        authenticityMarkers: authenticityMarkers.filter(marker => 
          this.checkAuthenticityMarker(file, marker)
        ),
        recommendations: this.generateRecommendations(flags, practice),
        requiredCorrections: this.generateRequiredCorrections(flags),
        expertReviewRequired,
        blockchainCertifiable: isValid && score >= 85 && criticalFlags.length === 0
      };

    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        score: 0,
        level: VerificationLevel.COMMUNITY,
        flags: [{
          type: 'CRITICAL',
          trigger: 'validation_error',
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'REJECT',
          autoDetectable: true
        }],
        authenticityMarkers: [],
        recommendations: ['Please re-upload the file and try again'],
        requiredCorrections: ['Fix validation errors'],
        expertReviewRequired: true,
        blockchainCertifiable: false
      };
    }
  }

  // Batch upload multiple files
  async uploadBatch(
    files: File[],
    options: FileUploadOptions,
    submissionId?: string
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];
    const maxConcurrent = 3; // Limit concurrent uploads

    for (let i = 0; i < files.length; i += maxConcurrent) {
      const batch = files.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(file => this.uploadFile(file, options, submissionId));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        console.error(`Batch upload error for files ${i}-${i + batch.length}:`, error);
        throw error;
      }
    }

    return results;
  }

  // Delete file
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      // Get file record
      const { data: fileRecord, error: fetchError } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError || !fileRecord) {
        throw new Error('File not found');
      }

      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(fileRecord.url);

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .remove([filePath]);

      if (deleteError) {
        throw new Error(`Storage deletion failed: ${deleteError.message}`);
      }

      // Delete record from database
      const { error: dbDeleteError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', fileId);

      if (dbDeleteError) {
        throw new Error(`Database deletion failed: ${dbDeleteError.message}`);
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  // Get files for submission
  async getSubmissionFiles(submissionId: string): Promise<UploadedFile[]> {
    try {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('submission_id', submissionId)
        .order('uploaded_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching submission files:', error);
      return [];
    }
  }

  // Private helper methods

  private validateFileBasics(file: File, options: FileUploadOptions): void {
    // Size check
    const maxSize = options.maxSizeBytes || this.MAX_FILE_SIZE;
    if (file.size > maxSize) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Format check
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedFormats = options.allowedFormats || this.getAllowedFormats(this.getFileType(file.type));
    
    if (!allowedFormats.includes(fileExtension)) {
      throw new Error(`File format .${fileExtension} not allowed. Allowed formats: ${allowedFormats.join(', ')}`);
    }
  }

  private getFileType(mimeType: string): 'image' | 'video' | 'document' | 'audio' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  private getAllowedFormats(fileType: string): string[] {
    switch (fileType) {
      case 'video': return this.ALLOWED_VIDEO_FORMATS;
      case 'image': return this.ALLOWED_IMAGE_FORMATS;
      case 'audio': return this.ALLOWED_AUDIO_FORMATS;
      case 'document': return this.ALLOWED_DOCUMENT_FORMATS;
      default: return [];
    }
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  private async extractFileMetadata(file: File): Promise<FileMetadata> {
    const metadata: FileMetadata = {
      format: file.type,
    };

    try {
      if (file.type.startsWith('image/')) {
        // Extract image metadata using FileReader
        metadata.width = await this.getImageDimensions(file).then(dims => dims.width);
        metadata.height = await this.getImageDimensions(file).then(dims => dims.height);
      }

      // Add more metadata extraction for videos, audio, etc.
      // This would typically use specialized libraries like exifr, ffprobe, etc.

    } catch (error) {
      console.warn('Failed to extract metadata:', error);
    }

    return metadata;
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  private async generateThumbnail(file: UploadedFile): Promise<string> {
    // Implementation would generate thumbnail and upload to storage
    // For now, return placeholder
    return `${file.url}?thumbnail=true`;
  }

  private async getTraditionalPractice(category: PracticeCategory): Promise<TraditionalPractice | null> {
    // This would fetch from a database or predefined practices
    // For now, return a mock practice
    return this.getMockTraditionalPractice(category);
  }

  private getMockTraditionalPractice(category: PracticeCategory): TraditionalPractice {
    // Return a comprehensive mock based on the blockchain verification roadmap
    return {
      id: `practice_${category}`,
      name: `Traditional ${category}`,
      category,
      region: 'fez' as any,
      originPeriod: 'MARINID' as any,
      culturalSignificance: {
        level: 'HIGH',
        description: `Traditional ${category} of Morocco`,
        socialRole: 'Cultural preservation',
        economicImpact: 'Artisan livelihood'
      },
      tools: [],
      materials: [],
      techniques: [],
      authenticityMarkers: [
        {
          type: 'VISUAL',
          indicator: 'Traditional tools visible',
          importance: 'HIGH',
          description: 'Traditional tools must be visible in documentation',
          examples: ['Hand-thrown pottery wheel', 'Traditional weaving loom']
        }
      ],
      commonMistakes: ['Using modern tools', 'Incorrect technique'],
      redFlags: [
        {
          type: 'CRITICAL',
          trigger: 'modern_tools_detected',
          message: 'Modern tools detected in traditional practice',
          severity: 'REVIEW',
          autoDetectable: false
        }
      ],
      requiredDocumentation: ['VIDEO_DEMONSTRATION' as any, 'STEP_BY_STEP_PHOTOS' as any],
      verificationLevel: 'EXPERT' as any,
      expertValidators: []
    };
  }

  private async validateTechnicalRequirements(file: UploadedFile, practice: TraditionalPractice): Promise<ValidationFlag[]> {
    const flags: ValidationFlag[] = [];
    
    // Check video requirements
    if (file.fileType === 'video' && practice.videoRequirements) {
      const duration = file.metadata.duration || 0;
      if (duration < practice.videoRequirements.minDuration) {
        flags.push({
          type: 'CRITICAL',
          trigger: 'video_too_short',
          message: `Video duration ${duration}s is below minimum ${practice.videoRequirements.minDuration}s`,
          severity: 'REJECT',
          autoDetectable: true
        });
      }
    }

    // Check image requirements
    if (file.fileType === 'image' && practice.imageRequirements) {
      const width = file.metadata.width || 0;
      const height = file.metadata.height || 0;
      const minRes = practice.imageRequirements.minResolution;
      
      if (width < minRes.width || height < minRes.height) {
        flags.push({
          type: 'WARNING',
          trigger: 'low_resolution',
          message: `Image resolution ${width}x${height} is below recommended ${minRes.width}x${minRes.height}`,
          severity: 'REVIEW',
          autoDetectable: true
        });
      }
    }

    return flags;
  }

  private async validateContent(file: UploadedFile, practice: TraditionalPractice): Promise<ValidationFlag[]> {
    // Content validation would use AI/ML models to analyze the actual content
    // For now, return empty array
    return [];
  }

  private async validateCulturalAuthenticity(file: UploadedFile, practice: TraditionalPractice): Promise<ValidationFlag[]> {
    // Cultural authenticity validation would use specialized models
    // For now, return empty array
    return [];
  }

  private checkAuthenticityMarker(file: UploadedFile, marker: any): boolean {
    // Check if file exhibits this authenticity marker
    return true; // Placeholder
  }

  private determineVerificationLevel(score: number, flags: ValidationFlag[], practice: TraditionalPractice): VerificationLevel {
    if (score >= 95 && flags.filter(f => f.type === 'CRITICAL').length === 0) {
      return VerificationLevel.MASTER;
    } else if (score >= 85) {
      return VerificationLevel.EXPERT;
    } else if (score >= 70) {
      return VerificationLevel.ARTISAN;
    } else {
      return VerificationLevel.COMMUNITY;
    }
  }

  private generateRecommendations(flags: ValidationFlag[], practice: TraditionalPractice): string[] {
    const recommendations: string[] = [];
    
    flags.forEach(flag => {
      switch (flag.trigger) {
        case 'video_too_short':
          recommendations.push('Record a longer video showing the complete process');
          break;
        case 'low_resolution':
          recommendations.push('Use a higher resolution camera or improve lighting');
          break;
        default:
          recommendations.push('Review content against traditional practice guidelines');
      }
    });

    return recommendations;
  }

  private generateRequiredCorrections(flags: ValidationFlag[]): string[] {
    return flags
      .filter(flag => flag.severity === 'REJECT')
      .map(flag => flag.message);
  }

  private async storeFileRecord(file: UploadedFile, submissionId?: string): Promise<void> {
    const record = {
      id: file.id,
      file_name: file.fileName,
      file_type: file.fileType,
      mime_type: file.mimeType,
      size: file.size,
      url: file.url,
      thumbnail_url: file.thumbnailUrl,
      uploaded_at: file.uploadedAt,
      uploaded_by: file.uploadedBy,
      practice_category: file.practiceCategory,
      documentation_type: file.documentationType,
      metadata: file.metadata,
      validation_result: file.validationResult,
      submission_id: submissionId
    };

    const { error } = await supabase
      .from('uploaded_files')
      .insert([record]);

    if (error) {
      console.error('Failed to store file record:', error);
      throw error;
    }
  }

  private async recordOnBlockchain(file: UploadedFile): Promise<void> {
    // Integration with existing blockchain service
    console.log('Recording file on blockchain:', file.id);
    // Implementation would call the contract service
  }

  private extractFilePathFromUrl(url: string): string {
    // Extract file path from Supabase storage URL
    const urlParts = url.split('/');
    return urlParts.slice(-3).join('/'); // Assumes bucket/folder/file structure
  }
}

export default new FileUploadService(); 