import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google API script
    const loadGoogleAPI = () => {
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = initializeAuth;
        document.head.appendChild(script);
      } else {
        initializeAuth();
      }
    };

    const initializeAuth = async () => {
      try {
        await authService.initializeGoogleAuth();
        const isValid = await authService.verifySession();
        if (isValid) {
          setUser(authService.getCurrentUser());
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    loadGoogleAPI();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const userData = await authService.signIn();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Initializing Authentication...</h5>
                <p className="text-muted">Please wait while we set up secure access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white text-center">
                <h3 className="mb-0">
                  <i className="bi bi-shield-lock me-2"></i>
                  Secure Access Required
                </h3>
              </div>
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="bi bi-building text-primary" style={{fontSize: '4rem'}}></i>
                </div>
                <h5 className="mb-3">Staff Authentication Required</h5>
                <p className="text-muted mb-4">
                  Only authorized school staff can access the Fun Run payment system. 
                  Please sign in with your school Google account.
                </p>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSignIn}
                  disabled={isLoading}
                >
                  <i className="bi bi-google me-2"></i>
                  Sign in with School Account
                </button>
                
                <div className="mt-4">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Only accounts ending with @g.cjc.edu.ph are authorized
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* User Info Header */}
      <div className="bg-light border-bottom py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <small className="text-muted">
                <i className="bi bi-person-check me-1"></i>
                Authenticated as: <strong>{user.name}</strong> ({user.email})
              </small>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {React.cloneElement(children, { authenticatedUser: user })}
    </div>
  );
};

export default AuthWrapper;
