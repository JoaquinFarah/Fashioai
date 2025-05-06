
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

const BUCKET_NAME = "fashion-images";

export const useFashionImages = () => {
  const { user } = useAuth(); // Get logged-in user
  const [savedImages, setSavedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    if (!user) {
      setSavedImages([]);
      setIsFetching(false);
      return; // Don't fetch if user is not logged in
    }

    setIsFetching(true);
    try {
      // List files within the user's folder
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(user.id, { // List files specifically in the user's directory
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
         if (error.message.includes("Bucket not found") || error.message.includes("security policy") || error.message.includes("Invalid token")) {
            console.warn("Fetch warning:", error.message);
            setSavedImages([]);
         } else {
             throw error;
         }
      } else if (data) {
        const imageUrls = data
          .filter(file => file.name !== ".emptyFolderPlaceholder")
          .map(file => {
            const fullPath = `${user.id}/${file.name}`; // Construct full path for public URL
            const { data: publicURLData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullPath);
            const url = publicURLData?.publicUrl || null;
            if (!url) {
                console.warn(`Could not get public URL for ${fullPath}`);
            }
            return {
              id: file.id || file.name,
              name: file.name,
              url: url,
              path: fullPath, // Store the full path including user ID prefix
            };
          }).filter(image => image.url !== null);
        setSavedImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error Syncing Collection",
        description: error.message || "Could not load your image collection.",
        variant: "destructive",
      });
      setSavedImages([]);
    } finally {
      setIsFetching(false);
    }
  }, [toast, user]); // Add user as a dependency

  useEffect(() => {
    fetchImages();
  }, [fetchImages]); // fetchImages already depends on user

  const handleImagesSelected = (newImages) => {
    setSelectedImages(prev => [...prev, ...newImages.map(img => ({ ...img, isSelected: true }))]);
  };

  const handleRemoveSelectedImage = (id) => {
    setSelectedImages(prev => prev.filter(image => image.id !== id));
  };

  const handleRemoveSavedImage = async (imageId) => {
     if (!user) return; // Guard clause

    const imageToRemove = savedImages.find(img => img.id === imageId);
    if (!imageToRemove || !imageToRemove.path) {
      toast({ title: "Error", description: "Cannot identify image to remove.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Use the full path stored in imageToRemove.path
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([imageToRemove.path]);
      if (error) {
        throw error;
      }
      setSavedImages(prev => prev.filter(image => image.id !== imageId));
      toast({
        title: "Image Purged",
        description: "The image has been removed from your collection.",
      });
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        title: "Error Removing Image",
        description: error.message || "Could not remove the image from storage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImages = async () => {
     if (!user) { // Guard clause
        toast({ title: "Not Logged In", description: "Please log in to save images.", variant: "destructive" });
        return;
     }
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Select images to add to your collection.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const uploadPromises = selectedImages.map(async (image) => {
       // Simple name check within user's folder might be sufficient
       const potentialPath = `${user.id}/${image.name}`;
       if (savedImages.some(savedImg => savedImg.path === potentialPath)) {
           console.log(`Skipping duplicate upload for: ${image.name}`);
           return null;
       }

      const uniqueName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]+/g, '_')}`; // Sanitize more thoroughly
      const filePath = `${user.id}/${uniqueName}`; // Upload into user's folder

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, image.file, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.type,
        });

      if (error) {
        console.error("Upload error for", image.name, ":", error);
        return { error: `Failed to upload ${image.name}: ${error.message}` };
      }

      const { data: publicURLData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
       const url = publicURLData?.publicUrl || null;
       if (!url) {
           console.warn(`Could not get public URL for uploaded file ${filePath}`);
       }

      return {
         id: data?.id || uniqueName, // Use generated name as fallback ID
         name: image.name, // Original name for display
         url: url,
         path: filePath
      };
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfullyUploaded = results.filter(r => r && !r.error && r.url);
      const erroredUploads = results.filter(r => r && r.error);
      const skippedUploads = results.filter(r => r === null);

      if (successfullyUploaded.length > 0) {
         setSavedImages(prev => [...successfullyUploaded, ...prev].sort((a, b) => b.id.localeCompare(a.id))); // Add and sort maybe? Or rely on fetch sort.
         setSelectedImages([]);
         toast({
           title: "Collection Updated",
           description: `Saved ${successfullyUploaded.length} new image(s). ${skippedUploads.length > 0 ? `Skipped ${skippedUploads.length} duplicate(s).` : ''}`,
         });
      } else if (erroredUploads.length === selectedImages.length) {
          toast({
            title: "Upload Failed",
            description: "Could not save any images. Check console or Supabase logs.",
            variant: "destructive"
          });
      } else if (skippedUploads.length === selectedImages.length) {
           toast({
            title: "No New Images",
            description: "Selected images are already in your collection.",
          });
          setSelectedImages([]);
      } else if (erroredUploads.length > 0) {
          toast({
            title: "Partial Upload",
            description: `Saved ${successfullyUploaded.length} image(s). ${erroredUploads.length} failed. ${skippedUploads.length > 0 ? `Skipped ${skippedUploads.length}.` : ''}`,
             variant: "destructive"
          });
          setSelectedImages([]);
      }

    } catch (error) {
       console.error("Critical error during saving process:", error);
       toast({
         title: "Critical Save Error",
         description: "An unexpected error occurred during the save process.",
         variant: "destructive",
       });
    } finally {
      setIsLoading(false);
    }
  };


  const handleClearSelected = () => {
    if (selectedImages.length === 0) return;
    setSelectedImages([]);
    toast({
      title: "Selection Cleared",
      description: "Removed images from the upload queue."
    });
  };

  return {
    savedImages,
    selectedImages,
    isLoading,
    isFetching,
    handleImagesSelected,
    handleRemoveSelectedImage,
    handleRemoveSavedImage,
    handleSaveImages,
    handleClearSelected,
    fetchImages,
  };
};
  