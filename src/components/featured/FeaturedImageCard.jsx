
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Star, User, ThumbsUp, RefreshCw } from 'lucide-react';

const FeaturedImageCard = ({ image, index, user, userVoteId, isVoting, onVote }) => {
  const hasVoted = !!userVoteId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="cyber-card overflow-hidden h-full flex flex-col group">
        <CardHeader className="p-0 relative">
          <div className="aspect-square overflow-hidden">
            {/* Use the correct image URL from the database */}
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              alt={image.description || 'Featured fashion style'}
              src={image.image_public_url} // Corrected: Use the dynamic URL
              loading="lazy" // Add lazy loading for performance
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-base mb-2 text-glow-primary group-hover:text-primary transition-colors truncate">
              {image.description || `Style by ${image.user_display_name}`}
            </CardTitle>
            <p className="text-xs text-cyber-muted mb-3 flex items-center">
              <User className="w-3 h-3 mr-1.5 text-secondary"/> {image.user_display_name || 'Anonymous'}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm mt-2 border-t border-cyber-border/50 pt-3">
            <span className="flex items-center font-bold text-secondary text-glow-secondary">
              <Star className="w-4 h-4 mr-1.5 text-secondary fill-secondary"/> {image.score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote(image.id)}
              disabled={isVoting || !user} // Disable if any vote is in progress or user not logged in
              className={`p-1 h-auto rounded-md transition-all duration-200 ${
                hasVoted
                  ? 'text-primary cyber-glow-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-cyber-muted hover:text-primary hover:bg-primary/10'
              }`}
            >
              {isVoting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <ThumbsUp className="w-4 h-4"/>}
              <span className="ml-1 text-xs">{hasVoted ? 'Voted' : 'Vote'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedImageCard;
  