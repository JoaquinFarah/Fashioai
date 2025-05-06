
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const UploadSection = ({ selectedImages, isLoading, onImagesSelected, onRemoveSelectedImage, onSaveImages, onClearSelected }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  const processFiles = useCallback((files) => {
    setProcessingError(null); // Reset error on new attempt
    const imageFiles = Array.from(files);
    const newImages = [];
    let hasError = false;

    if (imageFiles.length === 0) return; // No files processed

    for (const file of imageFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `Skipping "${file.name}". Only JPEG, PNG, GIF, WEBP are allowed.`,
          variant: "destructive",
        });
        hasError = true;
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: `Skipping "${file.name}". Maximum size is 5MB.`,
          variant: "destructive",
        });
        hasError = true;
        continue;
      }

      // Basic check, more robust checks in useFashionImages hook before upload
      if (selectedImages.some(existing => existing.name === file.name && existing.size === file.size)) {
         console.log(`Skipping already selected file: ${file.name}`);
         continue; // Skip if visually identical file is already selected
      }


      // Use try-catch for FileReader potentially erroring? (unlikely but safe)
      try {
          const previewUrl = URL.createObjectURL(file);
          newImages.push({
            id: `${file.name}-${file.lastModified}`, // More unique ID
            name: file.name,
            type: file.type,
            size: file.size,
            file: file,
            previewUrl: previewUrl,
          });
      } catch (error) {
           console.error("Error creating object URL:", error);
           toast({
              title: "Preview Error",
              description: `Could not create preview for "${file.name}".`,
              variant: "destructive",
           });
           hasError = true;
           // Optionally skip this file or handle differently
      }
    }

    if (newImages.length > 0) {
      onImagesSelected(newImages);
    } else if (!hasError && imageFiles.length > 0) {
        // All files were skipped (e.g., duplicates) but no actual processing errors
        toast({
          title: "No New Images Added",
          description: "Selected files might already be in the queue.",
        });
    } else if (hasError && newImages.length === 0) {
         // All files had errors, none were added
         setProcessingError("Could not prepare any selected images for upload.");
    }

  }, [onImagesSelected, toast, selectedImages]); // Added selectedImages dependency for duplicate check


  const handleFileSelect = (event) => {
    if (event.target.files) {
      processFiles(event.target.files);
      event.target.value = null; // Reset file input
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    setProcessingError(null);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }, [processFiles]); // processFiles is memoized

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <motion.section
      className="mb-10 md:mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <Card className={`cyber-card transition-all duration-300 ${isDragging ? 'border-primary shadow-neon-cyan' : 'border-cyber-border'}`}>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center text-glow-primary">Upload Your Styles</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-6 md:p-10 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-cyber-border hover:border-secondary'
            } cursor-pointer`}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <UploadCloud className={`w-10 h-10 md:w-12 md:h-12 mb-4 ${isDragging ? 'text-primary' : 'text-secondary'}`} />
            <p className="text-center text-cyber-muted">
              {isDragging ? "Drop images here" : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-xs text-cyber-muted mt-1">Max 5MB per image (JPG, PNG, GIF, WEBP)</p>
            <input
              id="fileInput"
              type="file"
              multiple
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {processingError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-destructive/20 border border-destructive rounded-md text-destructive text-sm flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {processingError}
            </motion.div>
          )}

          {selectedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-neon-cyan">Ready to Upload:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {selectedImages.map((image) => (
                  <motion.div
                    key={image.id}
                    className="relative group aspect-square cyber-border p-1 rounded-md overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <img
                      src={image.previewUrl}
                      alt={image.name}
                      className="object-cover w-full h-full rounded"
                      onLoad={() => {
                         // Optional: Revoke URL after image load if memory is a concern,
                         // but might cause issues if component re-renders before upload.
                         // URL.revokeObjectURL(image.previewUrl);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/20 rounded-full"
                        onClick={() => onRemoveSelectedImage(image.id)}
                        disabled={isLoading}
                        title="Remove"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                     <p className="absolute bottom-0 left-0 right-0 text-xs bg-black/70 text-white p-1 truncate">
                       {image.name}
                     </p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                 <Button
                    variant="outline"
                    onClick={onClearSelected}
                    disabled={isLoading}
                    className="cyber-border text-cyber-muted hover:text-destructive hover:border-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                <Button
                  onClick={onSaveImages}
                  disabled={isLoading}
                  className="cyber-button"
                >
                  {isLoading ? (
                     <>
                       <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                       Saving...
                     </>
                  ) : (
                     <>
                       <UploadCloud className="w-4 h-4 mr-2" />
                       Save to Collection ({selectedImages.length})
                     </>
                  )}
                </Button>

              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default UploadSection;
  