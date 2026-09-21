import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';
const SESSION_DURATION_MS = 5 * 60 * 1000;
const WARNING_THRESHOLD_MS = 60 * 1000;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('devspace-token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [sessionNotice, setSessionNotice] = useState('');

  const [sessionExpiryTime, setSessionExpiryTime] = useState(() => {
    const saved = localStorage.getItem('devspace-session-expiry');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(300);

  const openAuthModal = (mode = 'login', notice = '') => {
    setAuthModalMode(mode);
    setSessionNotice(notice);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setSessionNotice('');
  };

  const triggerAutoSave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('devspace-auto-save-ide'));
  }, []);

  const logout = useCallback((reason = '') => {
    localStorage.removeItem('devspace-token');
    localStorage.removeItem('devspace-session-expiry');
    setToken(null);
    setUser(null);
    setSessionExpiryTime(null);
    setIsExpiryModalOpen(false);
    if (reason) {
      setSessionNotice(reason);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, []);

  const startNewSession = useCallback(() => {
    const expiry = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem('devspace-session-expiry', expiry.toString());
    setSessionExpiryTime(expiry);
    setIsExpiryModalOpen(false);
  }, []);

  const extendSession = useCallback(() => {
    const newExpiry = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem('devspace-session-expiry', newExpiry.toString());
    setSessionExpiryTime(newExpiry);
    setIsExpiryModalOpen(false);
  }, []);

  useEffect(() => {
    if (!token || !user) {
      setIsExpiryModalOpen(false);
      return;
    }

    if (!sessionExpiryTime) {
      startNewSession();
      return;
    }

    const checkInterval = setInterval(() => {
      const remainingMs = sessionExpiryTime - Date.now();
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setSessionTimeRemaining(remainingSec);

      if (remainingMs <= WARNING_THRESHOLD_MS && remainingMs > 0) {
        setIsExpiryModalOpen(prev => {
          if (!prev) {
            triggerAutoSave();
          }
          return true;
        });
      }

      if (remainingMs <= 0) {
        clearInterval(checkInterval);
        triggerAutoSave();
        logout('Session expired after 5 minutes. Your IDE workspace changes have been automatically saved.');
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [token, user, sessionExpiryTime, logout, startNewSession, triggerAutoSave]);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (!localStorage.getItem('devspace-session-expiry')) {
            startNewSession();
          }
        } else {
          localStorage.removeItem('devspace-token');
          localStorage.removeItem('devspace-session-expiry');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('devspace-token');
        localStorage.removeItem('devspace-session-expiry');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [token, startNewSession]);

  const login = async (email, password) => {
    setSessionNotice('');
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    localStorage.setItem('devspace-token', data.token);
    setToken(data.token);
    setUser(data.user);
    startNewSession();
    closeAuthModal();
    return data;
  };

  const signup = async (name, email, password) => {
    setSessionNotice('');
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed.');
    }

    localStorage.setItem('devspace-token', data.token);
    setToken(data.token);
    setUser(data.user);
    startNewSession();
    closeAuthModal();
    return data;
  };

  const sendOTP = async (email) => {
    const res = await fetch(`${API_BASE_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Sending OTP failed.');
    }
    return data;
  };

  const verifyOTP = async (email, otp) => {
    const res = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'OTP verification failed.');
    }
    return data;
  };

  const resetPasswordWithOTP = async (email, otp, newPassword) => {
    setSessionNotice('');
    const res = await fetch(`${API_BASE_URL}/reset-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Password reset failed.');
    }

    localStorage.setItem('devspace-token', data.token);
    setToken(data.token);
    setUser(data.user);
    startNewSession();
    closeAuthModal();
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading,
      isAuthModalOpen,
      authModalMode,
      sessionNotice,
      isExpiryModalOpen,
      sessionTimeRemaining,
      extendSession,
      triggerAutoSave,
      setSessionNotice,
      openAuthModal,
      closeAuthModal,
      setAuthModalMode,
      login,
      signup,
      sendOTP,
      verifyOTP,
      resetPasswordWithOTP,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

