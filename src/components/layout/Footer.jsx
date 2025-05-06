
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-cyber-border/30 text-center text-xs text-cyber-muted bg-cyber-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>Fashion AI Nexus &copy; {new Date().getFullYear()}. All rights reserved.</p>
        <p className="mt-1">Data stored securely with Supabase.</p>
        <div className="mt-3 h-1 w-20 bg-gradient-to-r from-neon-pink to-neon-cyan mx-auto rounded-full opacity-50"></div>
      </div>
    </footer>
  );
};

export default Footer;
  