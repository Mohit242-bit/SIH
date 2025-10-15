import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Chat from './pages/Chat.tsx'
import AuthGuard from './components/AuthGuard.tsx'
import { useAppStore } from './store/appStore.ts'

// Auth Initializer Component
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { initializeAuth } = useAppStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/chat" element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  </StrictMode>,
)
