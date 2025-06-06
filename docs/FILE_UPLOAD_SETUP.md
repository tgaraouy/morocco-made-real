# 📁 Secure File Upload System with Traditional Practice Validation

## 🚀 Overview

The Morocco Made Real platform now includes a comprehensive file upload system that validates videos, images, documents, and audio files against authentic Moroccan traditional practices. This system ensures cultural authenticity while providing secure storage.

## 🏗️ Architecture

### **Core Components**

1. **TraditionalPractice Interface** - Defines validation criteria for cultural practices
2. **FileUploadService** - Handles secure uploads with validation 
3. **FileUploadManager** - React component for drag-and-drop uploads
4. **Database Storage** - Supabase Storage with PostgreSQL metadata
5. **Validation Engine** - Automated cultural authenticity scoring

### **Validation Flow**
```
File Upload → Metadata Extraction → Traditional Practice Validation → Scoring → Blockchain Recording
```

## 📋 Setup Instructions

### **1. Database Setup**

Run the file upload migration in Supabase:

```sql
-- Copy content from supabase/migrations/010_file_upload_system.sql
-- Paste into Supabase SQL Editor and execute
```

### **2. Supabase Storage Configuration**

In Supabase Dashboard:

1. **Create Storage Bucket**:
   - Go to Storage > New bucket
   - Name: `cultural-content`
   - Public: `true`

2. **Set Storage Policies**:
   ```sql
   -- Allow authenticated users to upload
   INSERT INTO storage.policies (bucket_id, name, definition)
   VALUES ('cultural-content', 'Authenticated uploads', 'auth.role() = ''authenticated''');
   
   -- Allow public read access
   INSERT INTO storage.policies (bucket_id, name, definition) 
   VALUES ('cultural-content', 'Public read', 'true');
   ```

### **3. Install Dependencies**

```bash
npm install @radix-ui/react-progress
```

## 🎯 Features

### **File Support**
- ✅ **Images**: JPEG, PNG, TIFF, WebP, RAW
- ✅ **Videos**: MP4, MOV, AVI, MKV, WebM  
- ✅ **Audio**: MP3, WAV, AAC, OGG, FLAC
- ✅ **Documents**: PDF, DOC, DOCX, TXT, MD

### **Validation Criteria**

#### **Technical Validation**
- File size limits (500MB max)
- Resolution requirements (1920x1080 min for video)
- Duration requirements (5+ minutes for demonstrations)
- Audio quality standards
- Format compliance

#### **Cultural Authenticity**
- Traditional tool visibility
- Authentic material usage
- Proper technique demonstration
- Regional accuracy
- Historical context adherence

#### **Scoring System**
- **95-100**: Master level (blockchain certifiable)
- **85-94**: Expert level (high quality)
- **70-84**: Artisan level (good)
- **60-69**: Community level (needs improvement)
- **<60**: Requires expert review

### **Documentation Types**

```typescript
enum DocumentationType {
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
```

## 🔧 Usage

### **Basic Upload**

```tsx
import FileUploadManager from '@/components/admin/FileUploadManager';
import { PracticeCategory } from '@/lib/traditional-practice-interface';

<FileUploadManager
  practiceCategory={PracticeCategory.POTTERY}
  submissionId="submission-uuid"
  onFilesUploaded={(files) => console.log('Uploaded:', files)}
  maxFiles={10}
  allowedTypes={['image/*', 'video/*']}
/>
```

### **Advanced Upload with Validation**

```typescript
import FileUploadService from '@/lib/file-upload-service';

const uploadOptions = {
  practiceCategory: PracticeCategory.POTTERY,
  documentationType: DocumentationType.VIDEO_DEMONSTRATION,
  validateOnUpload: true,
  generateThumbnail: true,
  extractMetadata: true,
  blockchainRecord: true
};

const uploadedFile = await FileUploadService.uploadFile(
  file, 
  uploadOptions, 
  submissionId
);
```

### **Batch Upload**

```typescript
const files = [file1, file2, file3];
const results = await FileUploadService.uploadBatch(
  files,
  uploadOptions,
  submissionId
);
```

## 🏺 Traditional Practices

### **Predefined Practices**

The system includes validation rules for:

1. **Safi Blue Pottery** (`pottery_safi`)
   - Cobalt blue glazing patterns
   - Hand-thrown wheel techniques
   - Traditional geometric motifs
   - Expert verification required

2. **High Atlas Berber Weaving** (`weaving_atlas`)
   - Sacred geometric patterns
   - Traditional materials only
   - Women's knowledge transmission
   - Master-level verification

### **Adding New Practices**

```sql
INSERT INTO traditional_practices (
  id, name, category, region,
  cultural_significance,
  authenticity_markers,
  video_requirements,
  verification_level
) VALUES (
  'metalwork_fez',
  'Fez Traditional Metalwork',
  'metalwork',
  'fez',
  '{"level": "HIGH", "description": "Sacred metalwork traditions"}',
  '[{"type": "VISUAL", "indicator": "Hand-forged techniques"}]',
  '{"minDuration": 600, "maxDuration": 1800}',
  'EXPERT'
);
```

## 🔐 Security Features

### **Row Level Security**
- Users can only access their own files
- Admins have full access
- Public read access to validated content
- Secure file path generation

### **Validation Security**
- Server-side file type validation
- Metadata sanitization
- Virus scanning ready (hooks available)
- Content policy enforcement

### **Access Control**
```sql
-- User file access
CREATE POLICY "Users can manage their files" ON uploaded_files
  FOR ALL USING (uploaded_by = auth.uid());

-- Admin access  
CREATE POLICY "Admins can view all files" ON uploaded_files
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

## 📊 Analytics & Monitoring

### **File Statistics**

```typescript
const stats = await FileUploadService.getFileStatistics();
// Returns: total files, size, validation scores, type breakdown
```

### **Validation Metrics**
- Upload success rates
- Validation pass/fail ratios  
- Expert review requirements
- Blockchain certification rates

### **Storage Monitoring**
- Storage space usage
- File type distribution
- Regional upload patterns
- Quality score trends

## 🎨 UI Components

### **FileUploadManager Features**
- ✅ Drag & drop interface
- ✅ Real-time upload progress
- ✅ Validation status indicators  
- ✅ File preview thumbnails
- ✅ Batch operations
- ✅ Error handling with retry
- ✅ Validation score display

### **Validation Badges**
- 🌟 **Excellent** (90-100): Green badge with star
- ✅ **Good** (80-89): Blue badge with checkmark  
- ℹ️ **Fair** (60-79): Yellow badge with info icon
- ⚠️ **Needs Review** (<60): Red badge with warning

## 🔗 Integration Points

### **Experience Submissions**
- Links to `experience_submissions` table
- Automatic file attachment
- Validation requirements per craft type

### **Blockchain Verification**
- High-scoring files eligible for blockchain recording
- Automatic authenticity certificates
- IPFS hash storage for immutable records

### **Admin Interface**
- Seamless integration with admin experience page
- Real-time validation feedback
- Batch approval workflows

## 🚀 Production Deployment

### **Environment Variables**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### **Storage Configuration**
- Configure CDN for fast global access
- Set up automatic backups
- Monitor storage quotas
- Enable compression for large files

### **Performance Optimization**
- Thumbnail generation for images
- Video compression pipelines
- Lazy loading for file lists
- Progressive upload for large files

## 🧪 Testing

### **Upload Testing**
```bash
# Test file upload functionality
npm run test:upload

# Validate traditional practices
npm run test:validation

# Check storage policies
npm run test:storage
```

### **Integration Testing**
- Upload various file types
- Test validation scoring
- Verify security policies
- Check metadata extraction

## 🔄 Maintenance

### **Regular Tasks**
```sql
-- Clean up orphaned files
SELECT cleanup_orphaned_files();

-- Get storage statistics  
SELECT * FROM get_file_statistics();

-- Update traditional practices
UPDATE traditional_practices SET ... WHERE id = 'practice_id';
```

### **Monitoring Queries**
```sql
-- Files needing expert review
SELECT * FROM uploaded_files 
WHERE validation_result->>'expertReviewRequired' = 'true';

-- Low scoring uploads
SELECT * FROM uploaded_files 
WHERE (validation_result->>'score')::NUMERIC < 70;
```

## 🎉 Ready to Use!

Your Morocco Made Real platform now has a complete, secure file upload system that:

- ✅ **Validates** uploads against traditional Moroccan practices
- ✅ **Stores** files securely in Supabase Storage  
- ✅ **Scores** cultural authenticity automatically
- ✅ **Integrates** with blockchain verification
- ✅ **Provides** beautiful drag-and-drop UI
- ✅ **Ensures** cultural preservation standards

Visit `/admin/experiences` to start uploading and validating cultural content! 🇲🇦📁✨ 