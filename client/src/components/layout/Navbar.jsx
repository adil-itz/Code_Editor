import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowUpRight, LogOut, User, ShieldAlert, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Editor', href: '/#editor' },
    { label: 'Documentation', href: '/#docs' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 bg-bg-primary/85 backdrop-blur-md border-b border-border-main shadow-lg shadow-black/20' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-8 h-8 rounded-lg bg-surface-elevated border border-border-main flex items-center justify-center group-hover:border-brand-primary/50 transition-colors duration-200 shadow-xs">
              <Terminal className="w-4 h-4 text-brand-primary transition-transform group-hover:scale-110 duration-200" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-primary shadow-xs shadow-brand-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-bold text-base tracking-tight text-text-primary">DEVSPACE</span>
              <span className="text-[10px] font-mono text-brand-primary font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">IDE</span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-surface/50 p-1 rounded-full border border-border-subtle backdrop-blur-sm">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-full transition-all duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Admin link on desktop */}
          {isAuthenticated && isAdmin && (
            <div className="hidden md:flex items-center">
              <Link
                to="/admin/dashboard"
                className="px-4 py-1.5 text-xs font-bold rounded-full bg-status-error/10 border border-status-error/30 text-status-error hover:bg-status-error/20 transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-1 px-2.5 rounded-lg border text-xs font-mono font-medium text-text-primary transition-colors cursor-pointer ${
                    isAdmin 
                      ? 'bg-status-error/10 border-status-error/40 hover:border-status-error' 
                      : 'bg-surface-elevated border-border-main hover:border-brand-primary/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    isAdmin ? 'bg-status-error text-bg-deep' : 'bg-brand-primary/20 text-brand-primary'
                  }`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{user?.name || 'Developer'}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-60 bg-surface-elevated border border-border-main rounded-xl shadow-xl p-2 text-xs font-mono z-50 space-y-1"
                    >
                      <div className="p-2.5 border-b border-border-subtle space-y-1">
                        <div className="font-bold text-text-primary truncate">{user?.name}</div>
                        <div className="text-[11px] text-text-muted truncate">{user?.email}</div>
                        <div className="pt-1 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin 
                              ? 'bg-status-error/20 text-status-error border border-status-error/30' 
                              : 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                          }`}>
                            Role: {user?.role || 'user'}
                          </span>
                        </div>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-status-error font-bold hover:bg-status-error/10 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-status-error" />
                          <span>Go to Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors duration-150 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Button
              size="sm"
              icon={ArrowUpRight}
              iconPosition="right"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('signup');
                } else if (isAdmin) {
                  navigate('/admin/dashboard');
                } else {
                  navigate('/editor');
                }
              }}
              className="hidden sm:inline-flex text-xs font-medium"
            >
              {isAuthenticated ? (isAdmin ? 'Admin Panel' : 'Open Editor') : 'Open Editor'}
            </Button>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-surface-elevated border border-border-main text-text-secondary hover:text-text-primary cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 pt-3 border-t border-border-main bg-surface-elevated/95 backdrop-blur-md rounded-2xl p-4 space-y-3 font-mono text-xs shadow-2xl overflow-hidden"
            >
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                    className="w-full text-left px-3 py-2 text-brand-primary font-bold hover:bg-surface rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}

              <Button
                size="sm"
                icon={ArrowUpRight}
                iconPosition="right"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (!isAuthenticated) {
                    openAuthModal('signup');
                  } else if (isAdmin) {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/editor');
                  }
                }}
                className="w-full text-xs font-medium py-2 justify-center"
              >
                {isAuthenticated ? (isAdmin ? 'Admin Panel' : 'Open Editor') : 'Open Editor'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
