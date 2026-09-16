import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Key, Eye, EyeOff, Terminal, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    setAuthModalMode,
    login,
    signup,
    sendOTP,
    verifyOTP,
    resetPasswordWithOTP
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const [otpStep, setOtpStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');

  useEffect(() => {
    if (authModalMode === 'forgot') {
      setOtpStep(1);
      setError('');
      setSuccessMsg('');
      setDevOtpCode('');
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await sendOTP(formData.email);
      setSuccessMsg('A 6-digit OTP has been sent to your email.');
      if (res.devOtp) {
        setDevOtpCode(res.devOtp);
      }
      setOtpStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await verifyOTP(formData.email, formData.otp);
      setSuccessMsg('OTP verified successfully! Please enter your new password.');
      setOtpStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await resetPasswordWithOTP(formData.email, formData.otp, formData.password);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authModalMode === 'login') {
        await login(formData.email, formData.password);
      } else if (authModalMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await signup(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-surface border border-border-main rounded-2xl shadow-2xl shadow-black/80 overflow-hidden font-sans"
        >
          <div className="px-6 py-4 bg-bg-deep border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono font-bold text-sm tracking-tight text-text-primary">
                {authModalMode === 'login' && 'Sign In to DEVSPACE'}
                {authModalMode === 'signup' && 'Create Developer Account'}
                {authModalMode === 'forgot' && otpStep === 1 && 'Forgot Password (Step 1 of 3)'}
                {authModalMode === 'forgot' && otpStep === 2 && 'Verify OTP Code (Step 2 of 3)'}
                {authModalMode === 'forgot' && otpStep === 3 && 'Set New Password (Step 3 of 3)'}
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-status-error/10 border border-status-error/30 flex items-center gap-2 text-xs text-status-error font-mono"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-status-success/10 border border-status-success/30 space-y-1 text-xs text-status-success font-mono"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
                {devOtpCode && (
                  <div className="pt-1 text-[11px] text-brand-primary font-bold">
                    Dev Test OTP Code: <span className="underline tracking-widest text-sm bg-surface p-1 rounded border border-brand-primary/30">{devOtpCode}</span>
                  </div>
                )}
              </motion.div>
            )}

            {authModalMode === 'forgot' ? (
              <div>
                {otpStep === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Enter your account email address and we will send a 6-digit OTP code to reset your password.
                    </p>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="developer@workspace.dev"
                          className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/60 font-mono transition-colors"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full text-xs font-semibold py-2.5">
                      {loading ? 'Sending OTP...' : 'Send 6-Digit OTP Code'}
                    </Button>
                  </form>
                )}

                {otpStep === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Enter the 6-digit OTP code sent to <span className="font-mono text-text-primary font-semibold">{formData.email}</span>.
                    </p>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">6-Digit OTP Code</label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-brand-primary" />
                        <input
                          type="text"
                          name="otp"
                          required
                          maxLength={6}
                          value={formData.otp}
                          onChange={handleChange}
                          placeholder="123456"
                          className="w-full pl-9 pr-4 py-2.5 bg-surface-elevated border border-brand-primary/50 rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-mono tracking-widest text-center transition-colors"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full text-xs font-semibold py-2.5">
                      {loading ? 'Verifying OTP...' : 'Verify OTP Code'}
                    </Button>
                  </form>
                )}

                {otpStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-xs font-mono text-brand-primary font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>OTP Verified! Set your new password below.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-text-secondary">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full text-xs font-semibold py-2.5">
                      {loading ? 'Updating Password...' : 'Set New Password & Log In'}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleStandardSubmit} className="space-y-4">
                {authModalMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-text-secondary">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Alex Developer"
                        className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-secondary">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="developer@workspace.dev"
                      className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-text-secondary">Password</label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('forgot')}
                        className="text-[11px] font-mono text-brand-primary hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authModalMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-text-secondary">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary font-mono"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full text-xs font-semibold py-2.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>{authModalMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-center text-xs font-mono text-text-muted">
              {authModalMode === 'login' && (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('signup')}
                    className="text-brand-primary font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              )}

              {authModalMode === 'signup' && (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-brand-primary font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              )}

              {authModalMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setOtpStep(1);
                  }}
                  className="text-brand-primary font-semibold hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
