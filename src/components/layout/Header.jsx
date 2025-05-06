
import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="text-center mb-10 md:mb-16 pt-8">
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3
                   bg-gradient-to-r from-neon-pink via-purple-500 to-neon-cyan
                   bg-clip-text text-transparent animate-neon-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        Fashion AI Nexus
      </motion.h1>
      <motion.p
        className="text-cyber-muted text-sm md:text-base max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Upload, analyze, and curate your ultimate style library. Powered by AI, styled by you.
      </motion.p>
    </header>
  );
};

export default Header;
  