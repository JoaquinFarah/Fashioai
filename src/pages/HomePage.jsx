
import React from 'react';
import { motion } from 'framer-motion';
import FeaturedSection from '@/components/sections/FeaturedSection';
import UploadSection from '@/components/sections/UploadSection';
import CollectionSection from '@/components/sections/CollectionSection';
import { useFashionImages } from '@/hooks/useFashionImages';
import { RefreshCw } from 'lucide-react'; // Added missing import

const HomePage = () => {
  // Pass image management logic down to sections
  const imageManager = useFashionImages();

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Optional: Add a main hero/title section if desired */}
        <motion.h1
          className="page-title mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fashion AI Nexus
        </motion.h1>

         {/* Featured Styles Section */}
        <FeaturedSection />


        {/* Upload Section */}
        <UploadSection
          selectedImages={imageManager.selectedImages}
          isLoading={imageManager.isLoading}
          onImagesSelected={imageManager.handleImagesSelected}
          onRemoveSelectedImage={imageManager.handleRemoveSelectedImage}
          onSaveImages={imageManager.handleSaveImages}
          onClearSelected={imageManager.handleClearSelected}
        />

        {/* User's Collection Section */}
        <CollectionSection
          savedImages={imageManager.savedImages}
          isFetching={imageManager.isFetching}
          isLoading={imageManager.isLoading}
          onRemoveSavedImage={imageManager.handleRemoveSavedImage}
        />

      </div>
       {/* Loading overlay for general image operations */}
       {imageManager.isLoading && !imageManager.isFetching && (
         <div className="loading-overlay">
           <RefreshCw className="w-8 h-8 text-primary animate-spin mr-3"/>
           <p className="text-white text-lg">Processing...</p>
         </div>
       )}
    </div>
  );
};

export default HomePage;
  