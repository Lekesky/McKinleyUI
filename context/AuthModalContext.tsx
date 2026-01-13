import React, { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
  showLoginModal: boolean;
  showSignupModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <AuthModalContext.Provider
      value={{
        showLoginModal,
        showSignupModal,
        setShowLoginModal,
        setShowSignupModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
};
