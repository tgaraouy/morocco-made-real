'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileImage, 
  FileVideo, 
  FileText, 
  FileAudio,
  X, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Eye,
  Download,
  Trash2,
  Shield,
  Star,
  Clock
} from 'lucide-react';
import { PracticeCategory, DocumentationType } from '@/lib/traditional-practice-interface';
import FileUploadService, { UploadedFile, FileUploadOptions } from '@/lib/file-upload-service';

interface FileUploadManagerProps {
  submissionId?: string;
  practiceCategory: PracticeCategory;
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'validating' | 'completed' | 'error';
  error?: string;
}

export default function FileUploadManager({
  submissionId,
  practiceCategory,
  onFilesUploaded,
  maxFiles = 10,
  allowedTypes = ['image/*', 'video/*', 'application/pdf', 'audio/*']
}: FileUploadManagerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocumentationType, setSelectedDocumentationType] = useState<DocumentationType>(
    DocumentationType.VIDEO_DEMONSTRATION
  );
  const [validateOnUpload, setValidateOnUpload] = useState(true);
  const [generateThumbnails, setGenerateThumbnails] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load existing files on mount
  React.useEffect(() => {
    if (submissionId) {
      loadExistingFiles();
    }
  }, [submissionId]);

  const loadExistingFiles = async () => {
    if (!submissionId) return;
    
    try {
      const files = await FileUploadService.getSubmissionFiles(submissionId);
      setUploadedFiles(files);
    } catch (error) {
      console.error('Failed to load existing files:', error);
    }
  };

  // File selection handler
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    uploadFiles(fileArray);
  }, [uploadedFiles.length, maxFiles]);

  // Upload files with validation
  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    const uploadOptions: FileUploadOptions = {
      practiceCategory,
      documentationType: selectedDocumentationType,
      validateOnUpload,
      generateThumbnail: generateThumbnails,
      extractMetadata: true,
      maxSizeBytes: 500 * 1024 * 1024, // 500MB
      blockchainRecord: true
    };

    // Initialize progress tracking
    const progressItems: UploadProgress[] = files.map(file => ({
      fileId: `temp_${Date.now()}_${Math.random()}`,
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }));
    setUploadProgress(progressItems);

    try {
      const uploadResults: UploadedFile[] = [];
      
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressItem = progressItems[i];

        try {
          // Update progress: uploading
          setUploadProgress(prev => 
            prev.map(p => p.fileId === progressItem.fileId 
              ? { ...p, progress: 30, status: 'uploading' }
              : p
            )
          );

          // Upload file
          const uploadedFile = await FileUploadService.uploadFile(
            file, 
            uploadOptions, 
            submissionId
          );

          // Update progress: validating
          setUploadProgress(prev => 
            prev.map(p => p.fileId === progressItem.fileId 
              ? { ...p, progress: 70, status: 'validating' }
              : p
            )
          );

          // Add small delay for validation display
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Update progress: completed
          setUploadProgress(prev => 
            prev.map(p => p.fileId === progressItem.fileId 
              ? { ...p, progress: 100, status: 'completed' }
              : p
            )
          );

          uploadResults.push(uploadedFile);

        } catch (error) {
          // Update progress: error
          setUploadProgress(prev => 
            prev.map(p => p.fileId === progressItem.fileId 
              ? { ...p, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
              : p
            )
          );
        }
      }

      // Update uploaded files list
      setUploadedFiles(prev => [...prev, ...uploadResults]);
      
      // Notify parent component
      if (onFilesUploaded) {
        onFilesUploaded(uploadResults);
      }

      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);

    } catch (error) {
      console.error('Batch upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const success = await FileUploadService.deleteFile(fileId);
      if (success) {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Get file icon
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <FileImage className="w-6 h-6" />;
      case 'video': return <FileVideo className="w-6 h-6" />;
      case 'audio': return <FileAudio className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  // Get validation badge
  const getValidationBadge = (file: UploadedFile) => {
    if (!file.validationResult) return null;

    const { score, isValid, level } = file.validationResult;
    
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800"><Star className="w-3 h-3 mr-1" />Excellent</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Good</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Info className="w-3 h-3 mr-1" />Fair</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Needs Review</Badge>;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentationType">Documentation Type</Label>
              <select
                id="documentationType"
                value={selectedDocumentationType}
                onChange={(e) => setSelectedDocumentationType(e.target.value as DocumentationType)}
                className="w-full p-2 border rounded-md"
              >
                {Object.values(DocumentationType).map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Upload Options</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={validateOnUpload}
                    onChange={(e) => setValidateOnUpload(e.target.checked)}
                  />
                  <span className="text-sm">Validate against traditional practices</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generateThumbnails}
                    onChange={(e) => setGenerateThumbnails(e.target.checked)}
                  />
                  <span className="text-sm">Generate thumbnails</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports images, videos, documents, and audio files up to 500MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Upload Progress</h3>
              {uploadProgress.map((progress) => (
                <div key={progress.fileId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{progress.fileName}</span>
                    <div className="flex items-center gap-2">
                      {progress.status === 'uploading' && <Clock className="w-4 h-4 text-blue-500" />}
                      {progress.status === 'validating' && <Shield className="w-4 h-4 text-orange-500" />}
                      {progress.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {progress.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-sm">
                        {progress.status === 'uploading' && 'Uploading...'}
                        {progress.status === 'validating' && 'Validating...'}
                        {progress.status === 'completed' && 'Complete'}
                        {progress.status === 'error' && 'Error'}
                      </span>
                    </div>
                  </div>
                  {progress.status !== 'error' && (
                    <Progress value={progress.progress} className="h-2" />
                  )}
                  {progress.error && (
                    <p className="text-sm text-red-600">{progress.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.fileType)}
                    <div>
                      <h4 className="font-medium">{file.fileName}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.fileType}</span>
                        <Badge variant="outline">{file.documentationType?.replace(/_/g, ' ')}</Badge>
                        {getValidationBadge(file)}
                      </div>
                      {file.validationResult && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Validation Score: {file.validationResult.score}/100
                          </p>
                          {file.validationResult.flags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.validationResult.flags.slice(0, 2).map((flag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {flag.type}: {flag.message}
                                </Badge>
                              ))}
                              {file.validationResult.flags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.validationResult.flags.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = file.url;
                        a.download = file.fileName;
                        a.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadedFiles.length}
                </div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploadedFiles.filter(f => f.validationResult?.isValid).length}
                </div>
                <div className="text-sm text-gray-600">Validated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {uploadedFiles.filter(f => f.validationResult?.score && f.validationResult.score >= 85).length}
                </div>
                <div className="text-sm text-gray-600">High Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 