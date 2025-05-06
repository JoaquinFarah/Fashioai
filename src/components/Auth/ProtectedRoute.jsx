
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Layout from '@/components/layout/Layout';

const ProtectedRoute = () => {
  const { session, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-bg">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!session) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the main layout and the child route component
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
  