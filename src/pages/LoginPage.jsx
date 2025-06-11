
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, LogIn, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('login');
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError) throw signInError;
      toast({ title: "Login Successful", description: "Welcome back!" });
      // Navigation happens automatically via AuthProvider listener
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred during login.");
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name, // Add name to user_metadata
          },
        },
      });
      if (signUpError) throw signUpError;
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
       // Optionally switch to login tab after signup request
       setCurrentTab('login');
       setEmail(''); // Clear fields after signup attempt
       setPassword('');
       setName('');
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An unexpected error occurred during signup.");
      toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
     setCurrentTab(value);
     setError(null); // Clear error on tab switch
     // Optionally clear form fields too
     // setEmail('');
     // setPassword('');
     // setName('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-4 font-sans
                    relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/50 via-transparent to-neon-cyan/50"></div>
         <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--border)/0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, hsl(var(--border)/0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
       </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="z-10 w-full max-w-md"
      >
        <Card className="cyber-card bg-card/90 backdrop-blur-lg border-primary/30 shadow-neon-pink">
          <CardHeader className="text-center">
            <Bot className="mx-auto h-16 w-16 text-primary cyber-glow-primary mb-4" />
            <CardTitle className="text-3xl font-bold text-glow-primary">
              Fashion AI Nexus
            </CardTitle>
            <CardDescription className="text-cyber-muted pt-1">
              Access your personalized style hub
              <p>
                mock: joaquinefarah@gmail.com - asdasd
                mock: kaneda1204@gmail.com - asdasd
              </p>
            </CardDescription>
          </CardHeader>

          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-cyber-surface border border-cyber-border mb-4">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-neon-pink">
                  <LogIn className="w-4 h-4 mr-2"/> Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary data-[state=active]:shadow-neon-cyan">
                  <UserPlus className="w-4 h-4 mr-2"/> Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="login-email" className="text-neon-pink">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="neo@matrix.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password" className="text-neon-pink">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                       className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text focus:border-primary focus:ring-primary"
                    />
                  </div>
                  {error && currentTab === 'login' && (
                    <p className="text-xs text-destructive flex items-center">
                       <AlertCircle className="w-3 h-3 mr-1"/> {error}
                    </p>
                   )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full cyber-button" disabled={loading}>
                    {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                    {loading ? 'Verifying...' : 'Enter the Nexus'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
               <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                   <div className="space-y-1">
                     <Label htmlFor="signup-name" className="text-neon-cyan">Full Name</Label>
                     <Input
                       id="signup-name"
                       type="text"
                       placeholder="Neo"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       required
                       className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text focus:border-secondary focus:ring-secondary"
                     />
                   </div>
                  <div className="space-y-1">
                    <Label htmlFor="signup-email" className="text-neon-cyan">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="trinity@matrix.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text focus:border-secondary focus:ring-secondary"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="signup-password" className="text-neon-cyan">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-cyber-surface/50 border-cyber-border/50 text-cyber-text focus:border-secondary focus:ring-secondary"
                    />
                  </div>
                   {error && currentTab === 'signup' && (
                     <p className="text-xs text-destructive flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1"/> {error}
                     </p>
                    )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full cyber-button-secondary" disabled={loading}>
                    {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
  