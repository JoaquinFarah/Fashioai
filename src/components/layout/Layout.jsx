
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

const Layout = () => {
  const location = useLocation(); // Get location using the hook

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg">
      {/* Optional background effects */}
      <div className="fixed inset-0 z-[-1] opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/30 via-transparent to-neon-cyan/30"></div>
         {/* Add grid lines or other subtle effects */}
         <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--border)/0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, hsl(var(--border)/0.1) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
      </div>

      <Navbar />
      <motion.main
        key={location.pathname} // Use location object from the hook
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="flex-grow"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
  