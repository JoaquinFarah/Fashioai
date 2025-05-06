
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthFormContainer from '@/components/Auth/AuthFormContainer';
import LoginForm from '@/components/Auth/LoginForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import AnimatedBackground from '@/components/Auth/AnimatedBackground';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const { handleLogin, handleSignUp, loading, error, setError } = useAuth(); // Use hook directly
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState('');
  const [currentTab, setCurrentTab] = useState('login');

  const onLoginSubmit = async (email, password) => {
     setError(null); // Clear previous errors
    setSignUpSuccessMessage('');
    try {
       await handleLogin(email, password);
       // Success is handled by the main App component via session change
     } catch (err) {
       // Error is set within useAuth hook
       console.error("Login failed:", err);
     }
  };

  const onSignUpSubmit = async (email, password, name) => {
     setError(null); // Clear previous errors
     setSignUpSuccessMessage('');
     try {
       const result = await handleSignUp(email, password, name);
       if(result?.needsConfirmation) {
          setSignUpSuccessMessage("Account created! Please check your email to confirm your registration.");
       } else if (result?.user) {
          // User might be logged in depending on settings, but we still show a message before redirect
          setSignUpSuccessMessage("Account created successfully! You will be logged in shortly.");
          // Redirect/login handled by App component
       }
       // Don't automatically log in here, let the App component handle session change
     } catch (err) {
        // Error is set within useAuth hook
        console.error("Signup failed:", err);
     }
  };

   const handleTabChange = (value) => {
      setError(null); // Clear errors when switching tabs
      setSignUpSuccessMessage('');
      setCurrentTab(value);
   }


  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-4 relative overflow-hidden">
      <AnimatedBackground />
      <AuthFormContainer
        title={currentTab === 'login' ? "ACCESS NEXUS" : "JOIN THE NEXUS"}
        description={currentTab === 'login' ? "Authenticate to manage your styles." : "Create your account to begin."}
      >
        <Tabs defaultValue="login" value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/30 border border-primary/30">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
             <LoginForm onLogin={onLoginSubmit} loading={loading && currentTab === 'login'} error={error && currentTab === 'login' ? error : null} />
          </TabsContent>
          <TabsContent value="signup">
             <SignUpForm onSignUp={onSignUpSubmit} loading={loading && currentTab === 'signup'} error={error && currentTab === 'signup' ? error : null} successMessage={signUpSuccessMessage}/>
          </TabsContent>
        </Tabs>
      </AuthFormContainer>
       {/* Add a subtle overlay */}
       <div className="absolute inset-0 bg-black/20 z-0"></div>
    </div>
  );
};

export default AuthPage;
  