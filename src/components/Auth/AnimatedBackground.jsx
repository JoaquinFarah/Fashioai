
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedBackground = () => {
  const controls = useAnimation();
  const gridRef = useRef(null);
  const numLines = 20; // Adjust density

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start(i => ({
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1],
          transition: {
            delay: i * 0.05 + Math.random() * 0.5, // Stagger and randomize
            duration: 2 + Math.random() * 2, // Random duration
            ease: "easeInOut",
            repeat: 1, // Pulse once
            repeatType: "reverse"
          }
        }));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before next pulse cycle
      }
    };
    sequence();
  }, [controls]);

  // Generate grid lines
  const renderGridLines = () => {
    const lines = [];
    for (let i = 0; i < numLines; i++) {
      // Horizontal
      lines.push(
        <motion.div
          key={`h-${i}`}
          custom={i}
          animate={controls}
          className="grid-line horizontal"
          style={{ top: `${(i / numLines) * 100}%` }}
        />
      );
      // Vertical
      lines.push(
        <motion.div
          key={`v-${i}`}
          custom={i + numLines} // Different custom value
          animate={controls}
          className="grid-line vertical"
          style={{ left: `${(i / numLines) * 100}%` }}
        />
      );
    }
    return lines;
  };

  return (
    <div ref={gridRef} className="auth-background">
      {renderGridLines()}
       {/* Optional: Add moving particles or other effects here */}
       <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-50 animate-pulse"></div>
    </div>
  );
};

export default AnimatedBackground;
  