
import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, UploadCloud, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { ProfileContext } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';

const PROFILE_PIC_BUCKET = 'profile-pictures';

const AvatarUploadSection = () => {
  const { profileImageUrl, setProfileImageUrl } = useContext(ProfileContext);
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        setUploadError("File size exceeds 2MB limit.");
        setPreviewUrl(null);
        setSelectedFile(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setUploadError("Invalid file type. Please select an image.");
        setPreviewUrl(null);
        setSelectedFile(null);
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({ title: "No file selected or not logged in", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `profile-${user.id}.${fileExt}`; // Use user ID
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(PROFILE_PIC_BUCKET)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: selectedFile.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from(PROFILE_PIC_BUCKET)
        .getPublicUrl(`${filePath}?t=${new Date().getTime()}`); // Cache buster

      if (!publicURLData?.publicUrl) {
        throw new Error("Could not retrieve public URL after upload.");
      }

      const newImageUrl = publicURLData.publicUrl;

      // Update Supabase Auth user metadata
       const { error: metaError } = await supabase.auth.updateUser({
         data: { profile_image_url: newImageUrl }
       });
       if (metaError) {
         console.warn("Failed to update user metadata:", metaError.message);
         // Proceed, but log it
       }

      // Update context immediately for UI responsiveness
      setProfileImageUrl(newImageUrl);
      setPreviewUrl(null);
      setSelectedFile(null);

      toast({
        title: "Profile Picture Updated",
        description: "Your new avatar is now active.",
      });

    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploadError(error.message || "Failed to upload image. Ensure the 'profile-pictures' bucket is public and policies are set.");
      toast({
        title: "Upload Failed",
        description: error.message || "Could not update profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';


  return (
    <Card className="cyber-card text-center p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-glow-primary">Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-32 h-32 mb-4 border-4 border-primary cyber-glow-primary shadow-lg">
          <AvatarImage src={previewUrl || profileImageUrl} alt="User profile" />
           <AvatarFallback className="bg-primary/20 text-primary text-4xl">
              {displayName ? displayName.charAt(0).toUpperCase() : <UserCircle size={64} />}
          </AvatarFallback>
        </Avatar>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif, image/webp"
          className="hidden"
        />

        <Button
          onClick={triggerFileInput}
          variant="outline"
          className="w-full mb-3 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary cyber-glow-secondary"
          disabled={isUploading}
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Choose Image
        </Button>

        {selectedFile && !isUploading && (
          <Button
            onClick={handleUpload}
            className="w-full cyber-button"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload New Avatar
          </Button>
        )}

        {isUploading && (
          <Button className="w-full cyber-button" disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </Button>
        )}

        {uploadError && (
          <motion.p
            className="mt-3 text-xs text-destructive flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-3 h-3 mr-1"/> {uploadError}
          </motion.p>
        )}
         <p className="text-xs text-cyber-muted mt-3">Max 2MB. JPG, PNG, GIF, WEBP.</p>
      </CardContent>
    </Card>
  );
};

export default AvatarUploadSection;
  