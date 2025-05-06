
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="page-container flex items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="page-content max-w-md"
      >
        <AlertTriangle className="mx-auto h-24 w-24 text-destructive animate-pulse mb-6" />
        <h1 className="text-6xl font-bold text-glow-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-cyber-text mb-4">Page Not Found</h2>
        <p className="text-cyber-muted mb-8">
          Oops! The page you're looking for seems to have glitched out of existence.
        </p>
        <Button asChild className="cyber-button-secondary">
          <Link to="/">Return to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
  