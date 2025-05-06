
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const ImageUploader = ({ onImagesSelected, maxSize = 5 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0); // Reset progress

    let currentProgress = 0;
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;

    const processSingleFile = (file) => {
       return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Simulate chunked progress update
          const updateInterval = setInterval(() => {
             uploadedSize += file.size / 5; // Simulate 5 chunks
             currentProgress = Math.min(100, Math.round((uploadedSize / totalSize) * 100));
             setUploadProgress(currentProgress);
             if (uploadedSize >= file.size * validFiles.length * 0.99) { // Check if near completion
                clearInterval(updateInterval);
                resolve({
                  id: Date.now() + Math.random().toString(36).substring(2, 9),
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  dataUrl: e.target.result,
                  file: file
                });
             }
          }, 50); // Adjust interval for smoother progress
        };
         reader.readAsDataURL(file);
       });
    };

     Promise.all(validFiles.map(processSingleFile)).then(images => {
       onImagesSelected(images);
       setUploadProgress(100); // Ensure it hits 100
       setTimeout(() => { // Small delay before hiding progress
          setIsUploading(false);
          setUploadProgress(0);
          toast({
            title: "Images ready",
            description: `Added ${images.length} image${images.length > 1 ? 's' : ''} to selection.`
          });
       }, 300);
     }).catch(error => {
        console.error("Error processing files:", error);
        setIsUploading(false);
        setUploadProgress(0);
        toast({
          title: "Error processing images",
          description: "Could not prepare images for upload.",
          variant: "destructive"
        });
     });
  };


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      {isUploading ? (
        <div className="p-4 border border-dashed border-secondary rounded-md cyber-glow-secondary">
          <p className="text-sm font-medium mb-2 text-secondary text-glow-secondary">Processing images...</p>
          <Progress value={uploadProgress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-neon-lime" />
        </div>
      ) : (
        <motion.div
          className={`dropzone ${isDragging ? 'active' : ''} cyber-border hover:border-primary hover:shadow-neon-pink transition-all duration-300`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary cyber-glow-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-glow-primary">Drag & Drop Images</h3>
              <p className="text-sm text-cyber-muted mt-1">
                or click to browse your files
              </p>
              <p className="text-xs text-cyber-muted mt-2">
                Supports: JPG, PNG, GIF, WEBP (Max: {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
            <Button
              onClick={handleButtonClick}
              className="mt-2 cyber-button"
              size="lg"
            >
              Select Images
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
  