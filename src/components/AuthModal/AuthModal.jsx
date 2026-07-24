import { useEffect, useRef, useState } from 'react';
import { signIn, signUp } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './AuthModal.css';

const INITIAL_SIGNIN = { email: '', password: '' };
const INITIAL_SIGNUP = { username: '', email: '', password: '', confirmPassword: '' };
const getPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: '',
      className: '',
      requirements: {
        length: false,
        letter: false,
        number: false,
      },
    };
  }

  const requirements = {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  };

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (requirements.letter && requirements.number) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score: 1,
      label: 'Weak',
      className: 'weak',
      requirements,
    };
  }

  if (score <= 3) {
    return {
      score: 2,
      label: 'Medium',
      className: 'medium',
      requirements,
    };
  }

  return {
    score: 3,
    label: 'Strong',
    className: 'strong',
    requirements,
  };
};

function AuthModal() {
  const { isOpen, mode, closeModal, switchMode, runSuccessCallback } = useAuthModal();
  const { login } = useAuth();
  const dialogRef = useRef(null);

  const [signInForm, setSignInForm] = useState(INITIAL_SIGNIN);
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGNUP);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = getPasswordStrength(signUpForm.password);

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

    if (
      !passwordStrength.requirements.length ||
      !passwordStrength.requirements.letter ||
      !passwordStrength.requirements.number
    ) {
      setError(
        'Password must be at least 8 characters and include a letter and a number.'
      );
      return;
    }

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
                maxLength={64}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-describedby="password-strength password-requirements"
              />

              {signUpForm.password && (
                <div
                  id="password-strength"
                  className="auth-modal__strength"
                  aria-live="polite"
                >
                  <div className="auth-modal__strength-header">
                    <span>Password strength</span>

                    <span
                      className={`auth-modal__strength-label auth-modal__strength-label--${passwordStrength.className}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="auth-modal__strength-bars" aria-hidden="true">
                    {[1, 2, 3].map((level) => (
                      <span
                        key={level}
                        className={`auth-modal__strength-bar ${
                          passwordStrength.score >= level
                            ? `auth-modal__strength-bar--${passwordStrength.className}`
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <ul
                id="password-requirements"
                className="auth-modal__requirements"
              >
                <li
                  className={
                    passwordStrength.requirements.length
                      ? 'auth-modal__requirement--met'
                      : ''
                  }
                >
                  At least 8 characters
                </li>

                <li
                  className={
                    passwordStrength.requirements.letter
                      ? 'auth-modal__requirement--met'
                      : ''
                  }
                >
                  At least one letter
                </li>

                <li
                  className={
                    passwordStrength.requirements.number
                      ? 'auth-modal__requirement--met'
                      : ''
                  }
                >
                  At least one number
                </li>
              </ul>
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
                maxLength={64}
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