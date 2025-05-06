
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuthFormContainer = ({ title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="cyber-card border-primary/30 shadow-neon-pink backdrop-blur-md bg-black/60">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-glow-primary tracking-widest uppercase">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-cyber-muted pt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthFormContainer;
  