import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { signIn, signUp, checkUsername, forgotPassword, verifyResetCode, resetPassword, } from '../../services/api';
import './AuthModal.css';

const INITIAL_SIGNIN = { username: '', password: '' };
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

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const [resetCode, setResetCode] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [newPasswordForm, setNewPasswordForm] = useState({
  password: '',
  confirmPassword: '',
});
  const resetPasswordStrength = getPasswordStrength(newPasswordForm.password);

  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const [usernameStatus, setUsernameStatus] = useState('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  const passwordStrength = getPasswordStrength(signUpForm.password);


  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsSubmitting(false);
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';

      setSignInForm(INITIAL_SIGNIN);
      setSignUpForm(INITIAL_SIGNUP);

      setForgotPasswordEmail('');
      setForgotPasswordMessage('');
      setResetCode('');
      setResetToken('');

      setNewPasswordForm({
        password: '',
        confirmPassword: '',
      });

      setResetSuccessMessage('');

      setUsernameStatus('idle');
      setUsernameMessage('');
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

  useEffect(() => {
  if (!isOpen || mode !== 'signup') {
    setUsernameStatus('idle');
    setUsernameMessage('');
    return undefined;
  }

  const username = signUpForm.username.trim();

  if (username.length < 3) {
    setUsernameStatus('idle');
    setUsernameMessage('');
    return undefined;
  }

  setUsernameStatus('checking');
  setUsernameMessage('Checking username...');

  const timeoutId = window.setTimeout(async () => {
    try {
      const result = await checkUsername(username);

      if (result.available) {
        setUsernameStatus('available');
        setUsernameMessage('Username available');
      } else {
        setUsernameStatus('taken');
        setUsernameMessage('Username already taken');
      }
    } catch (err) {
      console.error('Username check failed:', err);

      setUsernameStatus('error');
      setUsernameMessage('Unable to check username');
    }
  }, 500);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [
  signUpForm.username,
  mode,
  isOpen,
]);

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

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setForgotPasswordMessage('');
    setIsSubmitting(true);

    try {
      const email = forgotPasswordEmail.trim();
      const data = await forgotPassword(email);

      setForgotPasswordEmail(email);
      setForgotPasswordMessage(data.message);
      switchMode('verify-reset-code');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyResetCodeSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const data = await verifyResetCode(
        forgotPasswordEmail,
        resetCode
      );

      setResetToken(data.reset_token);
      switchMode('reset-password');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setResetSuccessMessage('');

    const { password, confirmPassword } = newPasswordForm;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (
      !resetPasswordStrength.requirements.length ||
      !resetPasswordStrength.requirements.letter ||
      !resetPasswordStrength.requirements.number
    ) {
      setError(
        'Password must be at least 8 characters and include a letter and a number.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await resetPassword(
        resetToken,
        password
      );

      setResetSuccessMessage(data.message);
      setNewPasswordForm({
        password: '',
        confirmPassword: '',
      });

      setResetCode('');
      setResetToken('');

      window.setTimeout(() => {
        setResetSuccessMessage('');
        switchMode('signin');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleSignUpSubmit = async (event) => {
  event.preventDefault();
  setError('');

  const username = signUpForm.username.trim();

  if (username.length < 3) {
    setError('Username must be at least 3 characters long.');
    return;
  }

  if (usernameStatus === 'checking') {
    setError('Please wait while the username is being checked.');
    return;
  }

  if (usernameStatus === 'taken') {
    setError('Please choose another username.');
    return;
  }

  if (usernameStatus === 'error') {
    setError('Unable to verify the username. Please try again.');
    return;
  }

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

  if (
    signUpForm.password !==
    signUpForm.confirmPassword
  ) {
    setError('Passwords do not match.');
    return;
  }

  setIsSubmitting(true);

  try {
    const data = await signUp({
      username,
      email: signUpForm.email,
      password: signUpForm.password,
    });

    login(data.token, data.user);
    setSignUpForm(INITIAL_SIGNUP);
    setUsernameStatus('idle');
    setUsernameMessage('');
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
        aria-label={
          mode === 'signin'
            ? 'Sign in'
            : mode === 'signup'
              ? 'Create account'
              : mode === 'forgot-password'
                ? 'Forgot password'
                : mode === 'verify-reset-code'
                  ? 'Verify reset code'
                  : 'Reset password'
        }
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
          {mode === 'signin'
            ? 'Welcome back — sign in to continue.'
            : mode === 'signup'
              ? 'Create an account to get started.'
              : mode === 'forgot-password'
                ? 'Enter the email connected to your account.'
                : mode === 'verify-reset-code'
                  ? 'Check your reset code.'
                  : 'Choose a new password.'}
        </p>

        {mode === 'signin' || mode === 'signup' ? (
          <div className="auth-modal__tabs" data-mode={mode}>
            <span className="auth-modal__tab-indicator" aria-hidden="true" />

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={`auth-modal__tab ${
                mode === 'signin' ? 'auth-modal__tab--active' : ''
              }`}
              onClick={() => handleModeSwitch('signin')}
            >
              Sign In
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-modal__tab ${
                mode === 'signup' ? 'auth-modal__tab--active' : ''
              }`}
              onClick={() => handleModeSwitch('signup')}
            >
              Sign Up
            </button>
          </div>
          ) : null}

        {mode === 'signin' && (
          <form className="auth-modal__form" onSubmit={handleSignInSubmit}>
            <label className="auth-modal__field">
              <span className="auth-modal__label">Username</span>
              <input
                type="text"
                name="username"
                value={signInForm.username}
                onChange={handleSignInChange}
                required
                minLength={3}
                autoComplete="username"
                placeholder="yourname"
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

            <button
              type="submit"
              className="auth-modal__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
            <button
            type="button"
            className="auth-modal__forgot-password"
            onClick={() => {
              setError('');
              setForgotPasswordEmail('');
              setForgotPasswordMessage('');
              setResetCode('');
              setResetToken('');
              setNewPasswordForm({
                password: '',
                confirmPassword: '',
              });
              switchMode('forgot-password');
            }}
          >
            Forgot password?
          </button>
          </form>
          )}
          {mode === 'signup' && (
          <form className="auth-modal__form" onSubmit={handleSignUpSubmit}>
            <label className="auth-modal__field">
              <span className="auth-modal__label">
                Username
              </span>

              <input
                type="text"
                name="username"
                value={signUpForm.username}
                onChange={handleSignUpChange}
                required
                minLength={3}
                maxLength={30}
                autoComplete="username"
                placeholder="yourname"
                aria-describedby={
                  usernameStatus !== 'idle'
                    ? 'username-status'
                    : undefined
                }
              />

              {usernameStatus !== 'idle' && (
                <span
                  id="username-status"
                  className={
                    `auth-modal__username-status ` +
                    `auth-modal__username-status--${usernameStatus}`
                  }
                  role={
                    usernameStatus === 'taken' ||
                    usernameStatus === 'error'
                      ? 'alert'
                      : 'status'
                  }
                  aria-live="polite"
                >
                  {usernameStatus === 'available' && '✓ '}
                  {usernameStatus === 'taken' && '✕ '}
                  {usernameMessage}
                </span>
              )}
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
          <button
            type="submit"
            className="auth-modal__submit"
            disabled={
              isSubmitting ||
              usernameStatus === 'checking' ||
              usernameStatus === 'taken' ||
              usernameStatus === 'error'
            }
          >
            {isSubmitting
              ? 'Creating Account…'
              : usernameStatus === 'checking'
                ? 'Checking Username…'
                : 'Create Account'}
          </button>
          </form>
        )}
        {mode === 'forgot-password' && (
        <form
          className="auth-modal__form"
          onSubmit={handleForgotPasswordSubmit}
        >
          <label className="auth-modal__field">
            <span className="auth-modal__label">Email</span>

            <input
              type="email"
              value={forgotPasswordEmail}
              onChange={(event) =>
                setForgotPasswordEmail(event.target.value)
              }
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          {forgotPasswordMessage && (
            <p className="auth-modal__success" role="status">
              {forgotPasswordMessage}
            </p>
          )}

          {error && (
            <p className="auth-modal__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Code…' : 'Send Reset Code'}
          </button>

          <button
            type="button"
            className="auth-modal__forgot-password"
            onClick={() => {
              setError('');
              setForgotPasswordMessage('');
              switchMode('signin');
            }}
          >
            Back to sign in
          </button>
        </form>
      )}
      {mode === 'verify-reset-code' && (
      <form
        className="auth-modal__form"
        onSubmit={handleVerifyResetCodeSubmit}
      >
        <p className="auth-modal__intro">
          Enter the six-digit code sent for:
          <br />
          <strong>{forgotPasswordEmail}</strong>
        </p>

        <label className="auth-modal__field">
          <span className="auth-modal__label">
            Reset Code
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={resetCode}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, '')
                .slice(0, 6);

              setResetCode(value);
            }}
            required
            minLength={6}
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
          />
        </label>

        {forgotPasswordMessage && (
          <p className="auth-modal__success" role="status">
            {forgotPasswordMessage}
          </p>
        )}

        {error && (
          <p className="auth-modal__error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="auth-modal__submit"
          disabled={
            isSubmitting ||
            resetCode.length !== 6
          }
        >
          {isSubmitting ? 'Verifying…' : 'Verify Code'}
        </button>

        <button
          type="button"
          className="auth-modal__forgot-password"
          onClick={() => {
            setError('');
            setResetCode('');
            setForgotPasswordMessage('');
            switchMode('forgot-password');
          }}
        >
          Back
        </button>
      </form>
    )}
      {mode === 'reset-password' && (
        <form
          className="auth-modal__form"
          onSubmit={handleResetPasswordSubmit}
        >
        <label className="auth-modal__field">
          <span className="auth-modal__label">
            New Password
          </span>

          <input
            type="password"
            value={newPasswordForm.password}
            onChange={(event) =>
              setNewPasswordForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            required
            minLength={8}
            maxLength={64}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-describedby={
              'reset-password-strength reset-password-requirements'
            }
          />

          {newPasswordForm.password && (
            <div
              id="reset-password-strength"
              className="auth-modal__strength"
              aria-live="polite"
            >
              <div className="auth-modal__strength-header">
                <span>Password strength</span>

                <span
                  className={
                    `auth-modal__strength-label ` +
                    `auth-modal__strength-label--${resetPasswordStrength.className}`
                  }
                >
                  {resetPasswordStrength.label}
                </span>
              </div>

              <div
                className="auth-modal__strength-bars"
                aria-hidden="true"
              >
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    className={
                      `auth-modal__strength-bar ${
                        resetPasswordStrength.score >= level
                          ? `auth-modal__strength-bar--${resetPasswordStrength.className}`
                          : ''
                      }`
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <ul
            id="reset-password-requirements"
            className="auth-modal__requirements"
          >
            <li
              className={
                resetPasswordStrength.requirements.length
                  ? 'auth-modal__requirement--met'
                  : ''
              }
            >
              At least 8 characters
            </li>

            <li
              className={
                resetPasswordStrength.requirements.letter
                  ? 'auth-modal__requirement--met'
                  : ''
              }
            >
              At least one letter
            </li>

            <li
              className={
                resetPasswordStrength.requirements.number
                  ? 'auth-modal__requirement--met'
                  : ''
              }
            >
              At least one number
            </li>
          </ul>
        </label>

          <label className="auth-modal__field">
            <span className="auth-modal__label">
              Confirm New Password
            </span>

            <input
              type="password"
              value={newPasswordForm.confirmPassword}
              onChange={(event) =>
                setNewPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              required
              minLength={8}
              maxLength={64}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </label>

          {resetSuccessMessage && (
            <p className="auth-modal__success" role="status">
              {resetSuccessMessage}
            </p>
          )}

          {error && (
            <p className="auth-modal__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Resetting Password…'
              : 'Reset Password'}
          </button>
        </form>
      )}
      </div>
    </div>
  );
}

export default AuthModal;