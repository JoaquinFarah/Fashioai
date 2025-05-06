
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserInfoSection = ({ user }) => {
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    email: 'Loading...',
    joinedDate: 'Loading...',
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.user_metadata?.full_name || 'User',
        email: user.email || '',
        joinedDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
      });
    } else {
       // Handle case where user is null (e.g., still loading or logged out)
        setUserInfo({ name: '', email: '', joinedDate: '' });
    }
  }, [user]);

  // Add state and handlers for editing name if needed later
  // const [editingName, setEditingName] = useState(false);
  // const [newName, setNewName] = useState('');

  // const handleUpdateName = async () => { ... }

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-glow-secondary">Profile Information</CardTitle>
        <CardDescription className="text-cyber-muted">
          Your account details. (Editing coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-neon-cyan">Display Name</Label>
          <Input id="name" value={userInfo.name} readOnly disabled className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className="text-neon-cyan">Email Address</Label>
          <Input id="email" type="email" value={userInfo.email} readOnly disabled className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text" />
        </div>
         <div className="space-y-1">
          <Label htmlFor="joined" className="text-neon-cyan">Member Since</Label>
          <Input id="joined" value={userInfo.joinedDate} readOnly disabled className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text" />
        </div>
         <div className="pt-4">
            <Button disabled className="opacity-50 cursor-not-allowed">Update Profile (Coming Soon)</Button>
         </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoSection;
  