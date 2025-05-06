
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const PublicRoute = () => {
  const { session, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (session) {
    // If user is logged in, redirect them away from public-only routes (like login)
    // to the home page.
    return <Navigate to="/" replace />;
  }

  // If not logged in, render the child route component (e.g., LoginPage)
  return <Outlet />;
};

export default PublicRoute;
  