import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Video, 
  MapPin, 
  Heart, 
  Smile, 
  Mountain, 
  Palette, 
  Sparkles,
  Upload,
  X,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const StoryUploadPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { id: 'adventure', label: 'Adventure', icon: Mountain, color: 'from-red-500 to-orange-500' },
    { id: 'peaceful', label: 'Peaceful', icon: Heart, color: 'from-green-500 to-teal-500' },
    { id: 'cultural', label: 'Cultural', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'exciting', label: 'Exciting', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
    { id: 'spiritual', label: 'Spiritual', icon: Smile, color: 'from-blue-500 to-indigo-500' }
  ];

  const suggestedTags = [
    'Solo Travel', 'Food & Cuisine', 'Photography', 'Architecture', 
    'Nature', 'Nightlife', 'Museums', 'Local Culture', 'Budget Travel',
    'Luxury', 'Backpacking', 'City Break', 'Beach', 'Mountains',
    'Desert', 'Forest', 'Islands', 'Historical', 'Modern', 'Hidden Gems'
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const preview = URL.createObjectURL(file);
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          file,
          preview,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setTitle('');
      setContent('');
      setLocation('');
      setSelectedMood('');
      setSelectedTags([]);
      setUploadedFiles([]);
    }, 3000);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const floatingButtonVariants = {
    hidden: { opacity: 0, scale: 0, y: 100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        delay: 0.5
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">Share Your Journey</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Create Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Story
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transform your travel experiences into captivating stories that inspire others to explore the world.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Media Upload Section */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Add Photos & Videos
            </h3>
            
            {/* Drop Zone */}
            <motion.div
              className={`relative border-2 border-dashed ${
                dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/30'
              } rounded-2xl p-8 text-center transition-all duration-300`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: dragOver ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <p className="text-white font-medium mb-2">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-white/60 text-sm">
                    Support for JPG, PNG, GIF, MP4, MOV (Max 10MB each)
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                  
                  <Button
                    onClick={() => videoInputRef.current?.click()}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    variant="outline"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Add Videos
                  </Button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <input
                ref={videoInputRef}
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </motion.div>

            {/* Uploaded Files Preview */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-white/10">
                        {file.type === 'image' ? (
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={file.preview}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                      </div>
                      
                      <motion.button
                        onClick={() => removeFile(file.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Story Details */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-medium mb-2">
                  Story Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your story a captivating title..."
                  className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-xl h-12"
                />
              </motion.div>

              {/* Location */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where did this story take place?"
                  className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-xl h-12"
                />
              </motion.div>

              {/* Mood Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-medium mb-4">
                  What was the mood of your journey?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMood === mood.id
                          ? 'border-blue-400 bg-blue-500/20'
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center`}>
                          <mood.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{mood.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Content */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-medium mb-2">
                  Tell Your Story
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share the details of your journey, the people you met, the sights you saw, and the emotions you felt..."
                  className="bg-white/10 border-white/30 text-white placeholder-white/50 rounded-xl min-h-[200px] resize-none"
                />
              </motion.div>

              {/* Tags */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-medium mb-4">
                  Add Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      className="flex items-center space-x-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-3 py-1"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTag(tag)}
                          className="ml-2 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter(tag => !selectedTags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full text-sm border border-white/20 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        {tag}
                      </motion.button>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating Submit Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          variants={floatingButtonVariants}
          initial="hidden"
          animate={title && content ? "visible" : "hidden"}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="group relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white disabled:opacity-50"
            variants={floatingButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Check className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-blue-300"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              {isSubmitting ? 'Publishing...' : showSuccess ? 'Published!' : 'Publish Story'}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center max-w-md mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Story Published!</h3>
                <p className="text-white/80">
                  Your travel story has been shared with the community. Others can now discover and be inspired by your journey.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryUploadPage;