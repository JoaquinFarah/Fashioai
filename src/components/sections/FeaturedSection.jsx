
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import FeaturedImageCard from '@/components/featured/FeaturedImageCard'; // Import the new card component

const FeaturedSection = () => {
  const [featuredImages, setFeaturedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false); // Keep voting state here for disabling buttons globally if needed
  const [userVotes, setUserVotes] = useState({}); // Stores { featured_image_id: vote_id }
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFeaturedImages = useCallback(async () => {
    // No need to set isLoading(true) here if we do it before the call
    try {
      const { data: imagesData, error: imagesError } = await supabase
        .from('featured_images')
        .select(`
          id,
          user_id,
          user_display_name,
          image_public_url,
          description,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(9);

      if (imagesError) throw imagesError;

      if (!imagesData || imagesData.length === 0) {
        setFeaturedImages([]);
        setUserVotes({}); // Reset votes if no images
        return; // Exit early if no images
      }

      const imageIds = imagesData.map(img => img.id);
      const { data: votesData, error: votesError } = await supabase
        .from('featured_image_votes')
        .select('featured_image_id, id, voter_user_id')
        .in('featured_image_id', imageIds);

      if (votesError) throw votesError;

      const scores = {};
      const currentUserVotes = {};
      votesData.forEach(vote => {
        scores[vote.featured_image_id] = (scores[vote.featured_image_id] || 0) + 1;
        if (user && vote.voter_user_id === user.id) {
          currentUserVotes[vote.featured_image_id] = vote.id;
        }
      });

      setUserVotes(currentUserVotes);

      const enrichedImages = imagesData.map(image => ({
        ...image,
        score: scores[image.id] || 0,
      }));
      setFeaturedImages(enrichedImages);

    } catch (error) {
      console.error("Error fetching featured images:", error);
      toast({
        title: "Error Loading Featured Styles",
        description: error.message,
        variant: "destructive",
      });
      setFeaturedImages([]);
      setUserVotes({}); // Reset votes on error
    } finally {
      setIsLoading(false); // Set loading false after fetch attempt
    }
  }, [toast, user]); // user dependency is important for fetching correct vote status

  useEffect(() => {
    setIsLoading(true); // Set loading true when starting fetch
    fetchFeaturedImages();

    const changesChannel = supabase
      .channel('featured-styles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'featured_images' },
        (payload) => {
          console.log('Featured image change received!', payload);
          fetchFeaturedImages(); // Refetch on image changes
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'featured_image_votes' },
        (payload) => {
          console.log('Vote change received!', payload);
          // More efficient update possible, but refetch is simpler for now
          fetchFeaturedImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changesChannel);
    };
  }, [fetchFeaturedImages]); // Run effect when fetchFeaturedImages changes (which depends on user)

  const handleVote = async (featuredImageId) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to vote.", variant: "destructive" });
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    const existingVoteId = userVotes[featuredImageId];
    let optimisticScoreChange = 0;

    try {
      if (existingVoteId) {
        // --- Remove Vote ---
        optimisticScoreChange = -1;
        // Optimistic UI update
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[featuredImageId];
          return newVotes;
        });
        setFeaturedImages(prev => prev.map(img =>
          img.id === featuredImageId ? { ...img, score: Math.max(0, img.score + optimisticScoreChange) } : img
        ));

        const { error: deleteError } = await supabase
          .from('featured_image_votes')
          .delete()
          .eq('id', existingVoteId);

        if (deleteError) throw deleteError; // Error handled in catch block
        toast({ title: "Vote Removed" });

      } else {
        // --- Add Vote ---
        optimisticScoreChange = 1;
         // Optimistic UI update (before insert)
         // We don't know the new vote ID yet, so add a placeholder or handle differently
         // For simplicity, we'll update score first, then votes state after success
         setFeaturedImages(prev => prev.map(img =>
           img.id === featuredImageId ? { ...img, score: img.score + optimisticScoreChange } : img
         ));

        const { data: newVote, error: insertError } = await supabase
          .from('featured_image_votes')
          .insert({ featured_image_id: featuredImageId, voter_user_id: user.id, score: 1 })
          .select('id')
          .single();

        if (insertError) throw insertError; // Error handled in catch block

        // Update userVotes state with the actual new vote ID
        if (newVote) {
            setUserVotes(prev => ({ ...prev, [featuredImageId]: newVote.id }));
        }
        toast({ title: "Voted!" });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({ title: "Vote Error", description: error.message, variant: "destructive" });
      // Revert optimistic update on error
      if (optimisticScoreChange !== 0) {
          setFeaturedImages(prev => prev.map(img =>
            img.id === featuredImageId ? { ...img, score: img.score - optimisticScoreChange } : img
          ));
          // Revert userVotes state change if needed (more complex if adding vote failed)
          if (optimisticScoreChange === -1) { // Re-add vote to state if delete failed
              // Need the old vote ID - might need to store it temporarily before optimistic delete
              // For now, a full refetch might be safer on error
              fetchFeaturedImages();
          } else { // Remove vote from state if insert failed
               setUserVotes(prev => {
                 const newVotes = { ...prev };
                 delete newVotes[featuredImageId];
                 return newVotes;
               });
          }
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.section
      className="mb-10 md:mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-glow-secondary">
        Featured Styles
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <RefreshCw className="h-10 w-10 text-secondary animate-spin" />
          <p className="ml-3 text-cyber-muted">Loading latest styles...</p>
        </div>
      ) : featuredImages.length === 0 ? (
        <div className="text-center py-16 text-cyber-muted italic">
          No styles featured yet. Be the first!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {featuredImages.map((image, index) => (
              <FeaturedImageCard
                key={image.id}
                image={image}
                index={index}
                user={user}
                userVoteId={userVotes[image.id]} // Pass the specific vote ID for this image
                isVoting={isVoting} // Pass global voting state to disable button
                onVote={handleVote} // Pass the handler function
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
};

export default FeaturedSection;
  