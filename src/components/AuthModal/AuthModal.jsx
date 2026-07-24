import { useEffect, useRef, useState } from 'react';
import { signIn, signUp } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './AuthModal.css';

const INITIAL_SIGNIN = { email: '', password: '' };
const INITIAL_SIGNUP = { username: '', email: '', password: '', confirmPassword: '' };

function AuthModal() {
  const { isOpen, mode, closeModal, switchMode, runSuccessCallback } = useAuthModal();
  const { login } = useAuth();
  const dialogRef = useRef(null);

  const [signInForm, setSignInForm] = useState(INITIAL_SIGNIN);
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGNUP);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsSubmitting(false);
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const handleSignInChange = (event) => {
    const { name, value } = event.target;
    setSignInForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (event) => {
    const { name, value } = event.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = (nextMode) => {
    setError('');
    switchMode(nextMode);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await signIn(signInForm);
      login(data.token, data.user);
      setSignInForm(INITIAL_SIGNIN);
      runSuccessCallback();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signUp({
        username: signUpForm.username,
        email: signUpForm.email,
        password: signUpForm.password,
      });
      login(data.token, data.user);
      setSignUpForm(INITIAL_SIGNUP);
      runSuccessCallback();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal__overlay" onClick={closeModal}>
      <div
        className="auth-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="auth-modal__close" onClick={closeModal} aria-label="Close">
          &times;
        </button>

        <div className="auth-modal__brand">
          <span className="auth-modal__brand-life">Life</span>
          <span className="auth-modal__brand-path">PATH</span>
        </div>

        <p className="auth-modal__intro">
          {mode === 'signin' ? 'Welcome back — sign in to continue.' : 'Create an account to get started.'}
        </p>

        <div className="auth-modal__tabs" data-mode={mode}>
          <span className="auth-modal__tab-indicator" aria-hidden="true" />
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            className={`auth-modal__tab ${mode === 'signin' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => handleModeSwitch('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-modal__tab ${mode === 'signup' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => handleModeSwitch('signup')}
          >
            Sign Up
          </button>
        </div>

        {mode === 'signin' ? (
          <form className="auth-modal__form" onSubmit={handleSignInSubmit}>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Email</span>
              <input
                type="email"
                name="email"
                value={signInForm.email}
                onChange={handleSignInChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Password</span>
              <input
                type="password"
                name="password"
                value={signInForm.password}
                onChange={handleSignInChange}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="auth-modal__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="auth-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form className="auth-modal__form" onSubmit={handleSignUpSubmit}>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Username</span>
              <input
                type="text"
                name="username"
                value={signUpForm.username}
                onChange={handleSignUpChange}
                required
                autoComplete="username"
                placeholder="yourname"
              />
            </label>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Email</span>
              <input
                type="email"
                name="email"
                value={signUpForm.email}
                onChange={handleSignUpChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Password</span>
              <input
                type="password"
                name="password"
                value={signUpForm.password}
                onChange={handleSignUpChange}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </label>

            <label className="auth-modal__field">
              <span className="auth-modal__label">Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={signUpForm.confirmPassword}
                onChange={handleSignUpChange}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="auth-modal__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="auth-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;