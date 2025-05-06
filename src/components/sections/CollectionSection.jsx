
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ImageCarousel from "@/components/ImageCarousel";
import { RefreshCw } from 'lucide-react';

const CollectionSection = ({ savedImages, isFetching, handleRemoveSavedImage }) => {
  return (
    <Card className="cyber-card">
      <CardHeader className="border-b border-cyber-border/50">
        <CardTitle className="text-glow-secondary">Your Style Collection</CardTitle>
        <CardDescription className="text-cyber-muted">
          {isFetching
            ? "Syncing with the Nexus..."
            : savedImages.length > 0
              ? `Browse your ${savedImages.length} saved style${savedImages.length > 1 ? 's' : ''}`
              : "Your collection awaits..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isFetching ? (
          <div className="flex justify-center items-center h-60">
            <RefreshCw className="h-8 w-8 text-secondary animate-spin" />
          </div>
        ) : (
          <ImageCarousel
            images={savedImages}
            onRemoveImage={handleRemoveSavedImage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionSection;
  