import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import ThemeSwitcher from '../components/ThemeSwitcher';
import TerminalBackground from '../components/TerminalBackground';
import AdminPanel from '../components/AdminPanel';
import { HiMenu, HiX, HiHome, HiChat } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, onlineUsers } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] transition-colors duration-300">
      {/* Hide theme switcher on mobile - it's in the mobile menu */}
      <div className="hidden sm:block">
        <ThemeSwitcher showLabel={false} />
      </div>
      
      {/* Matrix/Terminal Background Effect for Dark Mode */}
      <div className="hidden dark:block">
        <TerminalBackground />
      </div>

      {/* Main Dashboard Container */}
      <div className="relative z-10 min-h-screen">
        {/* Compact Header - Mobile First */}
        <header className="bg-white dark:bg-black border-b border-green-300 dark:border-[#00ff41] shadow-sm dark:shadow-[0_0_15px_rgba(0,255,65,0.2)] sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-lg font-bold text-green-700 dark:text-[#00ff41] dark:font-mono">
                  <span className="dark:hidden">VAJRA</span>
                  <span className="hidden dark:inline">[VAJRA]</span>
                </h1>
              </div>

              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2.5 rounded-lg text-green-700 dark:text-[#00ff41] hover:bg-green-100 dark:hover:bg-green-900/20 focus:outline-none transition-colors border border-green-300 dark:border-[#00ff41]/50"
              >
                <span className="sr-only">Menu</span>
                {!mobileMenuOpen ? (
                  <HiMenu className="w-6 h-6" />
                ) : (
                  <HiX className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

        </header>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-xs">
              <div className="flex h-full flex-col bg-white dark:bg-[#0a0e0a] shadow-xl border-l-2 border-green-500 dark:border-[#00ff41] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-4 bg-gradient-to-r from-green-500 to-teal-500 dark:from-[#00ff41] dark:to-[#00dd37] flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white dark:text-black dark:font-mono">
                      <span className="dark:hidden">Menu</span>
                      <span className="hidden dark:inline">[MENU]</span>
                    </h2>
                    <button
                      onClick={toggleMobileMenu}
                      className="p-1.5 rounded-lg text-white/80 dark:text-black/80 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* User Profile */}
                <div className="px-4 py-3 bg-green-50 dark:bg-black border-b border-green-200 dark:border-[#00ff41]/30 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 dark:from-[#00ff41] dark:to-[#00dd37] flex items-center justify-center text-white dark:text-black font-bold text-sm">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-700 dark:text-[#00ff41] dark:font-mono truncate">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="text-xs text-green-600 dark:text-[#33ff66] dark:font-mono truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
                  <button
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-green-700 dark:text-[#00ff41] rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors dark:font-mono"
                  >
                    <HiHome className="mr-3 h-4 w-4" />
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => { navigate('/chat'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-green-700 dark:text-[#00ff41] rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors dark:font-mono"
                  >
                    <HiChat className="mr-3 h-4 w-4" />
                    Messages
                  </button>
                </nav>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-green-200 dark:border-[#00ff41]/30 space-y-3 flex-shrink-0">
                  <div className="p-3 bg-green-50 dark:bg-black rounded-lg border border-green-200 dark:border-[#00ff41]/30">
                    <ThemeSwitcher inMobileMenu={true} />
                  </div>
                  
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors dark:font-mono"
                  >
                    <MdLogout className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content - Compact Mobile Design */}
        <main className="px-4 py-4">
          {/* Compact Welcome */}
          <div className="mb-4 bg-gradient-to-r from-white to-green-50 dark:from-black dark:to-[#0a0e0a] rounded-lg border border-green-300 dark:border-[#00ff41] p-4">
            <h2 className="text-lg font-bold text-green-700 dark:text-[#00ff41] dark:font-mono mb-1">
              <span className="dark:hidden">Welcome, {currentUser?.name}! 👋</span>
              <span className="hidden dark:inline">[WELCOME_USER: {currentUser?.name}]</span>
            </h2>
            <p className="text-sm text-green-600 dark:text-[#33ff66] dark:font-mono">
              <span className="dark:hidden">Secure dashboard active</span>
              <span className="hidden dark:inline">SECURE_DASHBOARD_ACTIVE :: STATUS_OK</span>
            </p>
          </div>

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Online Users */}
            <div className="bg-white dark:bg-black rounded-lg border border-green-300 dark:border-[#00ff41] p-2 text-center">
              <div className="flex justify-center mb-1">
                <div className="relative w-6 h-6 bg-green-500 dark:bg-[#00ff41] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 dark:bg-[#33ff66] rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-[#00ff41] dark:font-mono">{onlineUsers.length}</p>
              <p className="text-[9px] text-green-500 dark:text-[#33ff66] dark:font-mono">Online</p>
            </div>

            {/* Messages */}
            <div className="bg-white dark:bg-black rounded-lg border border-green-300 dark:border-[#00ff41] p-2 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-6 h-6 bg-green-500 dark:bg-[#00ff41] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-[#00ff41] dark:font-mono">0</p>
              <p className="text-[9px] text-green-500 dark:text-[#33ff66] dark:font-mono">Chats</p>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-black rounded-lg border border-green-300 dark:border-[#00ff41] p-2 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-6 h-6 bg-green-500 dark:bg-[#00ff41] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-[#00ff41] dark:font-mono">✓</p>
              <p className="text-[9px] text-green-500 dark:text-[#33ff66] dark:font-mono">Secure</p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 dark:from-[#00ff41] dark:to-[#00dd37] text-white dark:text-black rounded-lg p-4 mb-4 shadow-lg dark:shadow-[0_0_20px_rgba(0,255,65,0.3)] flex items-center justify-between"
          >
            <div>
              <h3 className="text-base font-bold mb-1 dark:font-mono">
                <span className="dark:hidden">Start Secure Chat</span>
                <span className="hidden dark:inline">INIT_CHAT_SESSION</span>
              </h3>
              <p className="text-sm opacity-90 dark:font-mono">
                <span className="dark:hidden">Open messaging</span>
                <span className="hidden dark:inline">OPEN_SECURE_CHANNEL</span>
              </p>
            </div>
            <HiChat className="w-6 h-6" />
          </button>

          {/* Admin Panel - Only visible to admins */}
          {currentUser?.role === 'hq_admin' && (
            <div className="mb-4">
              <AdminPanel />
            </div>
          )}

          {/* Recent Activity - Compact */}
          <div className="bg-white dark:bg-black rounded-lg border border-green-300 dark:border-[#00ff41] p-4">
            <h2 className="text-base font-bold text-green-700 dark:text-[#00ff41] mb-3 dark:font-mono flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="dark:hidden">Activity</span>
              <span className="hidden dark:inline">[ACTIVITY_LOG]</span>
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-[#0a0e0a] rounded border-l-2 border-green-500 dark:border-[#00ff41]">
                <div className="w-6 h-6 bg-green-500 dark:bg-[#00ff41] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-700 dark:text-[#00ff41] dark:font-mono">Login Success</p>
                  <p className="text-[10px] text-green-600 dark:text-[#33ff66] dark:font-mono">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-[#0a0e0a] rounded border-l-2 border-green-400 dark:border-[#00ff41]/70">
                <div className="w-6 h-6 bg-green-500 dark:bg-[#00ff41] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-700 dark:text-[#00ff41] dark:font-mono">Secure Connection</p>
                  <p className="text-[10px] text-green-600 dark:text-[#33ff66] dark:font-mono">2 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
