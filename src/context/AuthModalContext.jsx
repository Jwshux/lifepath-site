import { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('signin');
  const [onSuccess, setOnSuccess] = useState(null);

  const openModal = useCallback((initialMode = 'signin', successCallback = null) => {
    setMode(initialMode);
    setOnSuccess(() => successCallback);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setOnSuccess(null);
  }, []);

  const switchMode = useCallback((nextMode) => setMode(nextMode), []);

  const runSuccessCallback = useCallback(() => {
    if (onSuccess) onSuccess();
  }, [onSuccess]);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, mode, openModal, closeModal, switchMode, runSuccessCallback }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}