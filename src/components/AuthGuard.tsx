import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, session } = useAppStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Make loading state reactive to auth state changes
    // We need both session AND user profile to make a proper decision
    if (session && currentUser) {
      setIsLoading(false);
    } else if (session === null && currentUser === null) {
      // Definitely no auth state
      setIsLoading(false);
    } else {
      // Partial state (session exists but no user profile yet) - keep loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Timeout to handle slow profile fetches

      return () => clearTimeout(timer);
    }
  }, [session, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-[#00ff41] mx-auto mb-4"></div>
          <p className="text-green-700 dark:text-[#00ff41] dark:font-mono">
            <span className="dark:hidden">Loading...</span>
            <span className="hidden dark:inline">LOADING_AUTH...</span>
          </p>
        </div>
      </div>
    );
  }

  if (!session || !currentUser) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-black p-8 rounded-2xl shadow-2xl border-2 border-yellow-400 dark:border-yellow-500">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-4 dark:font-mono">
            <span className="dark:hidden">Account Pending Approval</span>
            <span className="hidden dark:inline">[ACCOUNT_PENDING]</span>
          </h2>
          <p className="text-yellow-600 dark:text-yellow-300 mb-6 dark:font-mono">
            <span className="dark:hidden">Your account is pending approval from defense administrators.</span>
            <span className="hidden dark:inline">AWAITING_ADMIN_APPROVAL :: STATUS_PENDING</span>
          </p>
          <button
            onClick={() => useAppStore.getState().logout()}
            className="px-6 py-2 bg-yellow-600 dark:bg-yellow-500 text-white dark:text-black rounded-lg font-semibold hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors dark:font-mono"
          >
            <span className="dark:hidden">Sign Out</span>
            <span className="hidden dark:inline">LOGOUT</span>
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-black p-8 rounded-2xl shadow-2xl border-2 border-red-400 dark:border-red-500">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4 dark:font-mono">
            <span className="dark:hidden">Account Rejected</span>
            <span className="hidden dark:inline">[ACCESS_DENIED]</span>
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6 dark:font-mono">
            <span className="dark:hidden">Your account has been rejected. Please contact support.</span>
            <span className="hidden dark:inline">ACCESS_REJECTED :: CONTACT_ADMIN</span>
          </p>
          <button
            onClick={() => useAppStore.getState().logout()}
            className="px-6 py-2 bg-red-600 dark:bg-red-500 text-white dark:text-black rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors dark:font-mono"
          >
            <span className="dark:hidden">Sign Out</span>
            <span className="hidden dark:inline">LOGOUT</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;