import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from './components/ThemeSwitcher';
import TerminalBackground from './components/TerminalBackground';
import './index.css';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-teal-50 dark:bg-[#0a0e0a] transition-colors duration-300">
      <ThemeSwitcher />
      
      {/* Matrix/Terminal Background Effect for Dark Mode - Animated */}
      <div className="hidden dark:block">
        <TerminalBackground />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-12 space-y-4 animate-fade-in">
            <div className="inline-block">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-700 dark:text-[#00ff41] tracking-tight dark:font-mono dark:drop-shadow-[0_0_15px_rgba(0,255,65,0.6)] transition-all duration-300">
              VAJRA
              </h1>
              <div className="h-1 w-32 sm:w-40 bg-green-600 dark:bg-[#00ff41] mx-auto rounded dark:shadow-[0_0_15px_rgba(0,255,65,0.9)] mt-4 animate-pulse-slow"></div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16 px-4">
          <p className="text-lg sm:text-xl md:text-2xl text-green-800 dark:text-[#00ff41] text-center leading-relaxed dark:font-mono font-medium">
            Secure, encrypted communication for India's defense personnel.
          </p>
          <p className="mt-6 text-base sm:text-lg text-green-700 dark:text-[#33ff66] text-center">
            <span className="inline-block px-5 py-2.5 rounded-full bg-white dark:bg-black border-2 border-green-400 dark:border-[#00ff41] shadow-md dark:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-300 hover:scale-105">
              <span className="hidden dark:inline dark:font-mono text-sm sm:text-base">🔒 TERMINAL_MODE_ACTIVE</span>
              <span className="inline dark:hidden text-sm sm:text-base">💬 WhatsApp-style Light Theme Active</span>
            </span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Card 1 */}
            <div className="group p-6 sm:p-8 rounded-2xl shadow-lg bg-white dark:bg-black border-2 border-green-300 dark:border-[#00ff41] hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">🔐</div>
              <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-[#00ff41] mb-3 text-center dark:font-mono uppercase tracking-wide">
                AES-256 ENCRYPTION
              </h3>
              <p className="text-xs sm:text-sm text-green-600 dark:text-[#33ff66] text-center dark:font-mono leading-relaxed">
                Military-grade encryption for all messages
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 sm:p-8 rounded-2xl shadow-lg bg-white dark:bg-black border-2 border-green-300 dark:border-[#00ff41] hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-[#00ff41] mb-3 text-center dark:font-mono uppercase tracking-wide">
                REAL-TIME CHAT
              </h3>
              <p className="text-xs sm:text-sm text-green-600 dark:text-[#33ff66] text-center dark:font-mono leading-relaxed">
                Instant secure communication via WebSocket
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 sm:p-8 rounded-2xl shadow-lg bg-white dark:bg-black border-2 border-green-300 dark:border-[#00ff41] hover:shadow-2xl hover:shadow-green-200 dark:hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-[#00ff41] mb-3 text-center dark:font-mono uppercase tracking-wide">
                DEFENSE READY
              </h3>
              <p className="text-xs sm:text-sm text-green-600 dark:text-[#33ff66] text-center dark:font-mono leading-relaxed">
                Built for Indian defense personnel
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="p-6 sm:p-10 rounded-3xl shadow-2xl bg-white dark:from-black dark:to-[#0a0e0a] dark:bg-gradient-to-br border-2 border-green-300 dark:border-[#00ff41] dark:shadow-[0_0_40px_rgba(0,255,65,0.4)] backdrop-blur-sm">
            <p className="text-center text-sm sm:text-base md:text-lg text-green-700 dark:text-[#33ff66] mb-8 leading-relaxed dark:font-mono">
              Switch between <span className="font-bold text-green-700 dark:text-gray-100">WhatsApp Light</span> and <span className="font-bold text-green-700 dark:text-[#00ff41]">HACKER TERMINAL</span> themes using the button in the top-right corner!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-green-600 dark:bg-[#00ff41] text-white dark:text-black rounded-xl font-bold dark:font-mono hover:bg-green-700 dark:hover:bg-[#00dd37] transition-all duration-200 shadow-lg dark:shadow-[0_0_20px_rgba(0,255,65,0.6)] uppercase text-sm sm:text-base hover:scale-105 active:scale-95">
                Get Started
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white dark:bg-black text-green-700 dark:text-[#00ff41] border-2 border-green-600 dark:border-[#00ff41] rounded-xl font-bold dark:font-mono hover:bg-green-50 dark:hover:bg-[#0a0e0a] transition-all duration-200 shadow-lg dark:shadow-[0_0_20px_rgba(0,255,65,0.3)] uppercase text-sm sm:text-base hover:scale-105 active:scale-95">
                View Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 sm:mt-20 text-center pb-8">
          <p className="text-xs sm:text-sm text-green-600 dark:text-[#00ff41] dark:font-mono">
            🇮🇳 <span className="dark:hidden font-medium">Made for India's Defense Forces</span><span className="hidden dark:inline tracking-wider">INDIA_DEFENSE_FORCES</span>
          </p>
          <p className="mt-2 text-xs text-green-500 dark:text-[#33ff66] dark:font-mono">
            <span className="dark:hidden">Secure • Private • Encrypted</span><span className="hidden dark:inline">SECURE :: PRIVATE :: ENCRYPTED</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;