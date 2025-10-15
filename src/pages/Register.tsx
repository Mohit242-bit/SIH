import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAppStore } from '../store/appStore';
import { authHelpers } from '../lib/supabase';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'soldier' as 'soldier' | 'veteran' | 'family' | 'hq_admin',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // Auth state is managed by the store's initializeAuth
  // const { setCurrentUser, setSession } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authHelpers.signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          role: formData.role
        }
      );
      
      if (error) {
        console.error('Signup error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        setError(`${error.message} (Code: ${error.code || 'unknown'})`);
        return;
      }
      
      if (data.user) {
        // Registration successful
        setError('');
        alert('Registration successful! Please check your email to confirm your account.');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Registration exception:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] transition-colors duration-300 px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-2 text-green-600 dark:text-[#00ff41] hover:text-green-700 dark:hover:text-[#00dd37] transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-black p-8 rounded-2xl shadow-2xl border-2 border-green-300 dark:border-[#00ff41] dark:shadow-[0_0_30px_rgba(0,255,65,0.3)]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-green-700 dark:text-[#00ff41] dark:font-mono">
            <span className="dark:hidden">⚡ VAJRA</span>
            <span className="hidden dark:inline">[VAJRA]</span>
          </h2>
          <p className="mt-2 text-center text-sm text-green-600 dark:text-[#33ff66] dark:font-mono">
            <span className="dark:hidden">Create your secure account</span>
            <span className="hidden dark:inline">CREATE_ACCOUNT :: INIT</span>
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
              <label htmlFor="name" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Full Name</span>
                <span className="hidden dark:inline">NAME</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] placeholder-green-500 dark:placeholder-[#00ff41]/50 text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Email Address</span>
                <span className="hidden dark:inline">EMAIL</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] placeholder-green-500 dark:placeholder-[#00ff41]/50 text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
                placeholder="soldier@defense.in"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Role</span>
                <span className="hidden dark:inline">ROLE</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
              >
                <option value="soldier">Soldier</option>
                <option value="veteran">Veteran</option>
                <option value="family">Family Member</option>
                <option value="hq_admin">HQ Admin</option>
              </select>
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
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-green-300 dark:border-[#00ff41] placeholder-green-500 dark:placeholder-[#00ff41]/50 text-green-800 dark:text-[#00ff41] bg-green-50 dark:bg-[#0a0e0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#00ff41] focus:border-transparent sm:text-sm dark:font-mono"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-700 dark:text-[#00ff41] mb-1 dark:font-mono">
                <span className="dark:hidden">Confirm Password</span>
                <span className="hidden dark:inline">CONFIRM_PASSWORD</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  <span className="dark:hidden">Registering...</span>
                  <span className="hidden dark:inline">PROCESSING...</span>
                </>
              ) : (
                <>
                  <span className="dark:hidden">Create Account</span>
                  <span className="hidden dark:inline">CREATE_ACCOUNT</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-green-600 dark:text-[#00ff41] hover:text-green-700 dark:hover:text-[#00dd37] font-semibold dark:font-mono transition-colors"
            >
              <span className="dark:hidden">Already have an account? Sign in</span>
              <span className="hidden dark:inline">GOTO_LOGIN</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
