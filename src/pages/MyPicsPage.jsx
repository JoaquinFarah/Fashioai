
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFashionImages } from '@/hooks/useFashionImages';
import { RefreshCw, X, ImageOff, Star, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const MyPicsPage = () => {
  const { savedImages, isFetching, isLoading: isImageLoading, handleRemoveSavedImage } = useFashionImages();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFeaturing, setIsFeaturing] = useState(false);
  const [imageToFeature, setImageToFeature] = useState(null); // State for confirmation dialog
  const [showFeatureConfirm, setShowFeatureConfirm] = useState(false);

  const triggerFeatureConfirmation = (image) => {
    setImageToFeature(image);
    setShowFeatureConfirm(true);
  };


  const handleFeatureImage = async () => {
    if (!imageToFeature || !user) return;

    setIsFeaturing(true);
    setShowFeatureConfirm(false); // Close dialog

    try {
      // 1. Check if user already has a featured image
      const { data: existingFeature, error: fetchError } = await supabase
        .from('featured_images')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle to handle 0 or 1 result

      if (fetchError) throw fetchError;

      const featureData = {
         user_id: user.id,
         user_display_name: user.user_metadata?.full_name || user.email, // Use name or email
         image_storage_path: imageToFeature.path,
         image_public_url: imageToFeature.url,
         description: `Style by ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'anonymous'}`, // Default description
         updated_at: new Date().toISOString(), // Manually set updated_at for upsert logic
      };


      let resultError;
      if (existingFeature) {
         // 2a. Update existing featured image
         const { error: updateError } = await supabase
           .from('featured_images')
           .update(featureData)
           .eq('user_id', user.id);
         resultError = updateError;
      } else {
         // 2b. Insert new featured image
          featureData.created_at = new Date().toISOString(); // Add created_at for insert
         const { error: insertError } = await supabase
           .from('featured_images')
           .insert(featureData);
         resultError = insertError;
      }


      if (resultError) {
         // Check for unique constraint violation (should not happen with update logic, but good practice)
          if (resultError.code === '23505') { // Postgres unique violation code
             toast({
               title: "Already Featured",
               description: "You already have an image featured.",
               variant: "destructive",
             });
          } else {
             throw resultError;
          }
      } else {
        toast({
          title: "Style Featured!",
          description: `${imageToFeature.name} is now showcased in Featured Styles.`,
        });
      }

    } catch (error) {
      console.error("Error featuring image:", error);
      toast({
        title: "Error Featuring Image",
        description: error.message || "Could not feature this image.",
        variant: "destructive",
      });
    } finally {
      setIsFeaturing(false);
      setImageToFeature(null); // Clear selection
    }
  };


  return (
    <div className="page-container">
      <div className="page-content">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Style Collection
        </motion.h1>

        {isFetching ? (
          <div className="flex justify-center items-center h-60">
            <RefreshCw className="h-12 w-12 text-secondary animate-spin" />
            <p className="ml-4 text-lg text-cyber-muted">Loading your styles...</p>
          </div>
        ) : savedImages.length === 0 ? (
           <div className="text-center py-16">
             <ImageOff className="h-16 w-16 mx-auto text-cyber-muted mb-4" />
             <p className="text-xl text-cyber-muted italic">Your collection is empty.</p>
             <p className="text-sm text-cyber-muted mt-2">Upload some images on the homepage to get started!</p>
           </div>
        ) : (
          <motion.div
            className="image-grid"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {savedImages.map((image) => (
                <motion.div
                  key={image.id || image.path} // Use path as fallback key
                  className="image-container cyber-card group relative" // Added relative positioning
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <img
                    src={image.url}
                    alt={image.name || "Saved fashion image"}
                    className="rounded-md object-cover w-full h-full group-hover:opacity-70 transition-opacity" // Ensure image fills container
                  />

                   {/* Overlay for Buttons */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 items-end">

                      {/* Top Right Buttons */}
                      <div className="flex space-x-1">
                        {/* Feature Button */}
                         <motion.button
                           title="Feature this Style"
                           className="bg-yellow-500/80 hover:bg-yellow-400 text-black rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                           onClick={() => triggerFeatureConfirmation(image)}
                           disabled={isImageLoading || isFeaturing}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                         >
                            {isFeaturing && imageToFeature?.id === image.id ? <RefreshCw size={14} className="animate-spin"/> : <Star size={14} />}
                         </motion.button>

                         {/* Remove Button */}
                          <motion.button
                            title="Remove Image"
                            className="bg-red-600/80 hover:bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleRemoveSavedImage(image.id)}
                            disabled={isImageLoading || isFeaturing}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {isImageLoading && !isFeaturing ? <RefreshCw size={14} className="animate-spin"/> : <X size={14} />}
                          </motion.button>
                      </div>

                       {/* Bottom Left Text */}
                       <p className="text-xs text-white truncate w-full text-left self-start">
                          {image.name}
                       </p>

                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
       {(isImageLoading || isFeaturing) && !isFetching && ( // Show overlay only when actively deleting/featuring
         <div className="loading-overlay">
           <RefreshCw className="w-8 h-8 text-primary animate-spin mr-3"/>
           <p className="text-white text-lg">{isFeaturing ? 'Featuring style...' : 'Removing image...'}</p>
         </div>
       )}

       {/* Confirmation Dialog */}
       <AlertDialog open={showFeatureConfirm} onOpenChange={setShowFeatureConfirm}>
        <AlertDialogContent className="cyber-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-glow-primary">Feature this Style?</AlertDialogTitle>
            <AlertDialogDescription className="text-cyber-muted">
              This will replace any style you currently have featured. Are you sure you want to showcase "{imageToFeature?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="cyber-border text-cyber-muted hover:text-white">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleFeatureImage} className="cyber-button">
                <Star className="mr-2 h-4 w-4"/> Yes, Feature It
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default MyPicsPage;
  