'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  Image,
  Video,
  Music,
  File,
  Camera,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from './Button';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'audio' | 'other';
  uploadProgress?: number;
  uploaded?: boolean;
  error?: string;
}

interface MediaUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ACCEPTED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];

export default function MediaUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_AUDIO_TYPES],
  className = "",
  disabled = false
}: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const getFileType = (file: File): 'image' | 'video' | 'audio' | 'other' => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'image';
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return 'video';
    if (ACCEPTED_AUDIO_TYPES.includes(file.type)) return 'audio';
    return 'other';
  };

  const createMediaFile = (file: File): MediaFile => {
    const type = getFileType(file);
    let preview = '';
    
    if (type === 'image' || type === 'video') {
      preview = URL.createObjectURL(file);
    }

    return {
      id: `${file.name}-${Date.now()}`,
      file,
      preview,
      type,
      uploadProgress: 0,
      uploaded: false,
    };
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: { file: File; errors: { code: string; message: string }[] }[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      console.error('Rejected files:', rejectedFiles);
      // You could show toast notifications here
    }

    // Process accepted files
    const newMediaFiles = acceptedFiles.map(createMediaFile);
    const updatedFiles = [...mediaFiles, ...newMediaFiles].slice(0, maxFiles);
    
    setMediaFiles(updatedFiles);
    onFilesChange(updatedFiles.map(mf => mf.file));
  }, [mediaFiles, maxFiles, onFilesChange, createMediaFile]);

  const removeFile = (id: string) => {
    const fileToRemove = mediaFiles.find(f => f.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = mediaFiles.filter(f => f.id !== id);
    setMediaFiles(updatedFiles);
    onFilesChange(updatedFiles.map(mf => mf.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    maxFiles,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const FileIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive || dragActive
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input {...getInputProps()} />
        
        <motion.div
          className="space-y-4"
          animate={{
            scale: isDragActive ? 1.05 : 1,
            rotateY: isDragActive ? 5 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center">
            {isDragActive ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-12 h-12 text-primary-500" />
              </motion.div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop files here!' : 'Upload Media'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Drag and drop files here, or click to browse
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>Max {maxFiles} files</span>
            <span>•</span>
            <span>Up to {maxSize}MB each</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {ACCEPTED_IMAGE_TYPES.some(type => acceptedTypes.includes(type)) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-700 dark:text-blue-300 text-xs">
                <Image className="w-3 h-3" />
                Images
              </div>
            )}
            {ACCEPTED_VIDEO_TYPES.some(type => acceptedTypes.includes(type)) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-700 dark:text-purple-300 text-xs">
                <Video className="w-3 h-3" />
                Videos
              </div>
            )}
            {ACCEPTED_AUDIO_TYPES.some(type => acceptedTypes.includes(type)) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-green-700 dark:text-green-300 text-xs">
                <Music className="w-3 h-3" />
                Audio
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {mediaFiles.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Files ({mediaFiles.length}/{maxFiles})
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mediaFiles.map((mediaFile, index) => (
                <motion.div
                  key={mediaFile.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {mediaFile.type === 'image' ? (
                      <img
                        src={mediaFile.preview}
                        alt={mediaFile.file.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : mediaFile.type === 'video' ? (
                      <video
                        src={mediaFile.preview}
                        className="w-12 h-12 object-cover rounded-lg"
                        muted
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <FileIcon type={mediaFile.type} />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {mediaFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(mediaFile.file.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {mediaFile.uploadProgress !== undefined && mediaFile.uploadProgress < 100 && (
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <motion.div
                              className="bg-primary-500 h-1 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${mediaFile.uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {mediaFile.uploadProgress}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2">
                    {mediaFile.uploaded ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : mediaFile.error ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : mediaFile.uploadProgress !== undefined && mediaFile.uploadProgress < 100 ? (
                      <Loader className="w-5 h-5 text-primary-500 animate-spin" />
                    ) : null}

                    <motion.button
                      onClick={() => removeFile(mediaFile.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional Actions */}
      {mediaFiles.length > 0 && (
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              mediaFiles.forEach(mf => {
                if (mf.preview) URL.revokeObjectURL(mf.preview);
              });
              setMediaFiles([]);
              onFilesChange([]);
            }}
          >
            Clear All
          </Button>
          
          <p className="text-xs text-gray-500">
            {mediaFiles.reduce((total, file) => total + file.file.size, 0) > 0 && (
              <>Total: {formatFileSize(mediaFiles.reduce((total, file) => total + file.file.size, 0))}</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}