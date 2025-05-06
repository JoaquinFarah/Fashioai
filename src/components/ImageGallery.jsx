
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ImageGallery = ({ images, onRemoveImage }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-cyber-muted italic">
        No images selected yet.
      </div>
    );
  }

  return (
    <div className="image-grid">
      <AnimatePresence>
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="image-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <img
              src={image.dataUrl || image.url}
              alt={image.name || "Uploaded image"}
              className="rounded-md object-cover"
            />
            {onRemoveImage && (
              <motion.button
                className="remove-button"
                onClick={() => onRemoveImage(image.id)}
                whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
  