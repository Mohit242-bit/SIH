import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAppStore } from '../store/appStore';
import { authHelpers } from '../lib/supabase';

// Diagnostic function to check user data - disabled in production
const checkUserData = async (_userId: string) => {
  // Diagnostic code removed for production
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // Auth state is managed by the store's initializeAuth
  // const { setCurrentUser, setSession } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        
        // Check for specific error codes
        if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in. Check your inbox for the confirmation link.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.code === 'email_not_confirmed') {
          setError('Email not confirmed. Please check your email for the confirmation link.');
        } else {
          setError(`${error.message} (Code: ${error.code || 'unknown'})`);
        }
        return;
      }
      
      if (data.session && data.user) {
        // Run diagnostic check
        await checkUserData(data.user.id);
        
        // Login successful - the auth state change will be handled by the store
        setError('');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] transition-colors duration-300 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-2 text-green-600 dark:text-[#00ff41] hover:text-green-700 dark:hover:text-[#00dd37] transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div className="max-w-md w-full space-y-8 bg-transparent p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-green-700 dark:text-[#00ff41] dark:font-mono">
            <span className="dark:hidden">⚡ VAJRA</span>
            <span className="hidden dark:inline">[VAJRA]</span>
          </h2>
          <p className="mt-2 text-center text-sm text-green-600 dark:text-[#33ff66] dark:font-mono">
            <span className="dark:hidden">Sign in to your account</span>
            <span className="hidden dark:inline">AUTH_LOGIN :: INIT</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg dark:font-mono text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Email</span>
                <span className="hidden dark:inline">EMAIL</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] placeholder-green-500 dark:placeholder-[#00ff41]/50 text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
                placeholder="soldier@defense.in"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Password</span>
                <span className="hidden dark:inline">PASSWORD</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] placeholder-green-500 dark:placeholder-[#00ff41]/50 text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-sm font-bold rounded-xl text-white dark:text-black bg-green-600 dark:bg-[#00ff41] hover:bg-green-700 dark:hover:bg-[#00dd37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-[#00ff41] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg dark:shadow-[0_0_20px_rgba(0,255,65,0.4)] dark:font-mono uppercase"
            >
              {loading ? (
                <>
                  <span className="dark:hidden">Signing in...</span>
                  <span className="hidden dark:inline">AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span className="dark:hidden">Sign In</span>
                  <span className="hidden dark:inline">LOGIN</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link 
              to="/register" 
              className="text-sm text-green-600 dark:text-[#00ff41] hover:text-green-700 dark:hover:text-[#00dd37] font-semibold dark:font-mono transition-colors"
            >
              <span className="dark:hidden">Don't have an account? Register here</span>
              <span className="hidden dark:inline">GOTO_REGISTER</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;