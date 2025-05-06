
import React from 'react';
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturedSection from "@/components/sections/FeaturedSection";
import UploadSection from "@/components/sections/UploadSection";
import CollectionSection from "@/components/sections/CollectionSection";
import { useFashionImages } from "@/hooks/useFashionImages";

// This component represents the main application view when the user is authenticated
const GalleryApp = ({ session, handleLogout }) => {
   const {
     savedImages,
     selectedImages,
     isLoading: imagesLoading, // Rename to avoid conflict with auth loading
     isFetching: imagesFetching, // Rename
     handleImagesSelected,
     handleRemoveSelectedImage,
     handleRemoveSavedImage,
     handleSaveImages,
     handleClearSelected,
   } = useFashionImages();

  return (
     <div className="min-h-screen bg-cyber-bg text-cyber-text p-4 md:p-8 font-sans">
       {/* Optional background effects */}
       <div className="fixed inset-0 z-[-1] opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/30 via-transparent to-neon-cyan/30"></div>
       </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
         {/* Pass user info and logout handler to Header */}
        <Header user={session?.user} onLogout={handleLogout} />

        <FeaturedSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <UploadSection
            selectedImages={selectedImages}
            handleImagesSelected={handleImagesSelected}
            handleRemoveSelectedImage={handleRemoveSelectedImage}
            handleClearSelected={handleClearSelected}
            handleSaveImages={handleSaveImages}
            isLoading={imagesLoading && selectedImages.length > 0}
          />

          <CollectionSection
            savedImages={savedImages}
            isFetching={imagesFetching}
            handleRemoveSavedImage={handleRemoveSavedImage}
          />
        </div>

        <Footer />
      </motion.div>

      {/* Image operation loading */}
       {imagesLoading && (
         <div className="loading-overlay">
           <div className="spinner"></div>
           <p className="text-white text-sm ml-4">Processing images...</p>
         </div>
       )}
    </div>
  );
};

export default GalleryApp;
  