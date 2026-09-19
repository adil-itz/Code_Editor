import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';
const INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 5 minutes in milliseconds

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('devspace-token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [sessionNotice, setSessionNotice] = useState('');

  const inactivityTimerRef = useRef(null);

  const openAuthModal = (mode = 'login', notice = '') => {
    setAuthModalMode(mode);
    setSessionNotice(notice);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setSessionNotice('');
  };

  const logout = useCallback((reason = '') => {
    localStorage.removeItem('devspace-token');
    setToken(null);
    setUser(null);
    if (reason) {
      setSessionNotice(reason);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, []);

  // 5-Minute Inactivity Timer Management
  useEffect(() => {
    if (!token || !user) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        logout('Session expired after 5 minutes of inactivity. Please log in again.');
      }, INACTIVITY_TIMEOUT);
    };

    // Initial timer start
    resetInactivityTimer();

    // Event listeners to detect user activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'mousedown'];
    let lastCall = 0;
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastCall >= 1000) { // throttle to at most once per second
        lastCall = now;
        resetInactivityTimer();
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, throttledReset, { passive: true });
    });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, throttledReset);
      });
    };
  }, [token, user, logout]);

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
        } else {
          localStorage.removeItem('devspace-token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('devspace-token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [token]);

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

