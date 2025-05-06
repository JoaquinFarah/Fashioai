
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';

const LoginForm = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onLogin(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email-login" className="text-glow-secondary">Email Address</Label>
        <Input
          id="email-login"
          type="email"
          placeholder="user@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-input/80 border-secondary/50 focus:border-secondary focus:ring-secondary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-login" className="text-glow-secondary">Password</Label>
        <Input
          id="password-login"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
           className="bg-input/80 border-secondary/50 focus:border-secondary focus:ring-secondary"
        />
      </div>
      <Button type="submit" className="w-full cyber-button-secondary" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Accessing Nexus...
          </>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
  