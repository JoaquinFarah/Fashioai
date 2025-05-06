
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const SignUpForm = ({ onSignUp, loading, error, successMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
     if (password.length < 6) {
       setPasswordError("Password must be at least 6 characters long.");
       return;
     }
    if (!loading) {
      onSignUp(email, password, name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {error && !successMessage && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Sign Up Failed</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}
       {successMessage && (
         <Alert variant="default" className="border-green-500/50 text-green-400 dark:border-green-500 [&>svg]:text-green-500">
           <CheckCircle className="h-4 w-4" />
           <AlertTitle>Success</AlertTitle>
           <AlertDescription>{successMessage}</AlertDescription>
         </Alert>
       )}
       {passwordError && !successMessage && (
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Password Error</AlertTitle>
           <AlertDescription>{passwordError}</AlertDescription>
         </Alert>
       )}

      {!successMessage && (
        <>
          <div className="space-y-1">
            <Label htmlFor="name-signup" className="text-glow-primary">Full Name</Label>
            <Input
              id="name-signup"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-input/80 border-primary/50 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email-signup" className="text-glow-primary">Email Address</Label>
            <Input
              id="email-signup"
              type="email"
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input/80 border-primary/50 focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password-signup" className="text-glow-primary">Password</Label>
            <Input
              id="password-signup"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input/80 border-primary/50 focus:border-primary focus:ring-primary"
            />
          </div>
           <div className="space-y-1">
             <Label htmlFor="confirm-password-signup" className="text-glow-primary">Confirm Password</Label>
             <Input
               id="confirm-password-signup"
               type="password"
               placeholder="Re-enter password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
               className="bg-input/80 border-primary/50 focus:border-primary focus:ring-primary"
             />
           </div>
          <Button type="submit" className="w-full cyber-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </>
      )}
    </form>
  );
};

export default SignUpForm;
  