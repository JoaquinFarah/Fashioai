
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Target } from 'lucide-react';

const AboutUsPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Fashion AI Nexus
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="cyber-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-glow-primary">
                  <Target className="w-6 h-6 mr-2 text-primary" /> Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyber-text leading-relaxed">
                  At Fashion AI Nexus, we're revolutionizing personal style. We believe technology can empower everyone to make confident fashion choices. Our mission is to blend cutting-edge AI with intuitive design, creating a platform where users can explore, analyze, and perfect their unique aesthetic. We're building the future of digital wardrobes, one pixel at a time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="cyber-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-glow-secondary">
                  <Users className="w-6 h-6 mr-2 text-secondary" /> The Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyber-text leading-relaxed">
                  We are a passionate collective of AI researchers, fashion enthusiasts, and software engineers united by a common goal. Our diverse team brings expertise from various fields, allowing us to tackle the complexities of style analysis with innovative solutions. We thrive on collaboration and are dedicated to pushing the boundaries of fashion technology.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center text-glow-primary">
                <Globe className="w-6 h-6 mr-2 text-primary" /> Global Vision (Map Placeholder)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="map-placeholder">
                <span>OpenStreetMap Integration Placeholder</span>
              </div>
              <p className="text-cyber-muted text-sm mt-2 text-center">
                Visualizing our reach and the diverse styles across the globe.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-glow-secondary">Style Inspirations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cyber-card overflow-hidden group">
              <img  class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" alt="Cyberpunk city street" src="https://images.unsplash.com/photo-1562461212-4906e9bb70ad" />
              <CardContent className="p-4">
                <p className="text-sm text-cyber-muted">Urban nights & digital dreams.</p>
              </CardContent>
            </Card>
             <Card className="cyber-card overflow-hidden group">
              <img  class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" alt="Abstract geometric patterns" src="https://images.unsplash.com/photo-1655704705321-3ac52dc67f70" />
              <CardContent className="p-4">
                <p className="text-sm text-cyber-muted">Bold patterns & future forms.</p>
              </CardContent>
            </Card>
             <Card className="cyber-card overflow-hidden group">
              <img  class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" alt="Minimalist architecture" src="https://images.unsplash.com/photo-1689628806279-3b8030b7f376" />
              <CardContent className="p-4">
                <p className="text-sm text-cyber-muted">Minimalism meets technology.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;
  