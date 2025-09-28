import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Store the current path in sessionStorage to prevent auto-signout during navigation
  // This helps with breadcrumb navigation issues
  useEffect(() => {
    if (location.pathname) {
      sessionStorage.setItem('lastPath', location.pathname);
    }
  }, [location.pathname]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Save the current location for redirect after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access login/register pages
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    // Check if there's a redirect path saved
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/explore';
    sessionStorage.removeItem('redirectAfterLogin'); // Clear after use
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;