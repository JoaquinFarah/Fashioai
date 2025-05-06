
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const ImageCarousel = ({ images, onRemoveImage }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-cyber-muted italic">
        No images in this collection yet.
      </div>
    );
  }

  const imageIndex = ((page % images.length) + images.length) % images.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentImage = images[imageIndex];

  return (
    <div className="carousel-container aspect-video md:aspect-[16/9] flex items-center justify-center bg-black/20 rounded-lg cyber-border p-1 relative">
       <AnimatePresence initial={false} custom={direction}>
         <motion.div
            key={page}
            className="carousel-slide absolute w-full h-full flex items-center justify-center"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <img
              src={currentImage?.dataUrl || currentImage?.url}
              alt={currentImage?.name || "Image"}
              className="max-h-full max-w-full object-contain rounded-md"
            />
             {onRemoveImage && currentImage?.id && (
                 <motion.button
                   className="remove-button"
                   onClick={() => onRemoveImage(currentImage.id)}
                   whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                   whileTap={{ scale: 0.9 }}
                 >
                   <X size={16} />
                 </motion.button>
             )}
          </motion.div>
       </AnimatePresence>

      {images.length > 1 && (
         <>
           <button
             className="carousel-button prev cyber-glow-secondary"
             onClick={() => paginate(-1)}
           >
             <ChevronLeft size={24} />
           </button>
           <button
             className="carousel-button next cyber-glow-secondary"
             onClick={() => paginate(1)}
           >
             <ChevronRight size={24} />
           </button>
         </>
       )}
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
         {images.map((_, i) => (
           <div
             key={i}
             className={`w-2 h-2 rounded-full transition-colors duration-300 ${
               i === imageIndex ? 'bg-primary scale-125 shadow-neon-pink' : 'bg-cyber-border hover:bg-cyber-muted'
             }`}
             onClick={() => setPage([i, i > imageIndex ? 1 : -1])} // Allow clicking dots
           />
         ))}
       </div>
    </div>
  );
};

export default ImageCarousel;

  