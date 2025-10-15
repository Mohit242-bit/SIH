import React from 'react';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  inMobileMenu?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = "",
  showLabel = true,
  inMobileMenu = false
}) => {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      // Apply theme immediately on load
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      return savedTheme;
    }
    return 'light';
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Mobile menu version
  if (inMobileMenu) {
    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`w-full flex items-center gap-3 px-4 py-3 text-green-700 dark:text-[#00ff41] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors dark:font-mono ${className}`}
      >
        {theme === 'dark' ? (
          <>
            <span className="text-xl">☀️</span>
            <span>Switch to Light Mode</span>
          </>
        ) : (
          <>
            <span className="text-xl">⚡</span>
            <span>Switch to Terminal Mode</span>
          </>
        )}
      </button>
    );
  }

  // Desktop/floating version
  return (
    <button
      className={`fixed top-4 right-4 z-50 p-2 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg
                 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black 
                 text-gray-700 dark:text-[#00ff41] 
                 border-2 border-green-200 dark:border-[#00ff41]/50
                 dark:shadow-[0_0_15px_rgba(0,255,65,0.3)]
                 transition-all duration-300 ease-in-out
                 hover:scale-105 active:scale-95
                 dark:font-mono text-xs sm:text-sm backdrop-blur-sm ${className}`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <span className="flex items-center gap-1 sm:gap-2">
        {theme === 'dark' ? (
          <>
            <span className="text-sm sm:text-lg">☀️</span>
            {showLabel && <span className="hidden md:inline text-xs sm:text-sm">Light</span>}
          </>
        ) : (
          <>
            <span className="text-sm sm:text-lg">⚡</span>
            {showLabel && <span className="hidden md:inline text-xs sm:text-sm">Terminal</span>}
          </>
        )}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
