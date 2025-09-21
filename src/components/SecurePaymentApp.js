import React, { useEffect, useState } from 'react';
import StudentForm from './StudentForm';

const SecurePaymentApp = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Initializing secure authentication...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check for existing authentication on page load
    checkExistingAuth();
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Identity script loaded');
      initializeGoogleSignIn();
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Check for existing authentication on page load
  const checkExistingAuth = () => {
    try {
      const savedUser = localStorage.getItem('funrun_auth_user');
      const savedTimestamp = localStorage.getItem('funrun_auth_timestamp');
      
      if (savedUser && savedTimestamp) {
        const userData = JSON.parse(savedUser);
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        // Validate user data structure
        if (!userData.email || !userData.name || !userData.googleId) {
          console.warn('Invalid user data structure, clearing storage');
          localStorage.removeItem('funrun_auth_user');
          localStorage.removeItem('funrun_auth_timestamp');
          setIsInitializing(false);
          return false;
        }
        
        // Check if session is still valid (within 24 hours)
        if (now - timestamp < maxAge) {
          console.log('Restoring existing authentication for:', userData.email);
          setUser(userData);
          setIsAuthenticated(true);
          setStatus(`✅ Welcome back, ${userData.name}!`);
          setIsInitializing(false);
          return true;
        } else {
          // Session expired, clear storage
          console.log('Session expired, clearing storage');
          localStorage.removeItem('funrun_auth_user');
          localStorage.removeItem('funrun_auth_timestamp');
        }
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
      // Clear corrupted data
      localStorage.removeItem('funrun_auth_user');
      localStorage.removeItem('funrun_auth_timestamp');
    }
    
    setIsInitializing(false);
    return false;
  };

  const initializeGoogleSignIn = () => {
    if (window.google && window.google.accounts) {
      setStatus('Setting up secure authentication...');
      
      try {
        window.google.accounts.id.initialize({
          client_id: '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com',
          callback: handleSignIn,
          auto_select: false,
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: false
        });

        // Only try One Tap if user is not already authenticated
        if (!isAuthenticated && !user) {
          setTimeout(() => {
            window.google.accounts.id.prompt((notification) => {
              console.log('One Tap notification:', notification);
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // One Tap not shown, render manual sign-in button
                renderSignInButton();
              }
            });
          }, 1000); // Small delay to ensure DOM is ready
        } else {
          // User already authenticated, just render button as fallback
          renderSignInButton();
        }
        
        setStatus('Ready! Please sign in with your school account.');
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
        setStatus('Error: Failed to initialize Google authentication');
      }
    } else {
      setStatus('Error: Unable to load Google authentication');
    }
  };

  const renderSignInButton = () => {
    try {
      const buttonContainer = document.getElementById('g_id_signin');
      if (buttonContainer && !buttonContainer.hasChildNodes() && window.google && window.google.accounts) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left'
        });
        console.log('Sign-in button rendered successfully');
      }
    } catch (error) {
      console.error('Error rendering sign-in button:', error);
    }
  };

  const handleSignIn = (credentialResponse) => {
    console.log('Authentication successful!', credentialResponse);
    
    try {
      // Validate credential response
      if (!credentialResponse || !credentialResponse.credential) {
        throw new Error('Invalid credential response');
      }
      
      // Decode the credential with enhanced validation
      const credentialParts = credentialResponse.credential.split('.');
      if (credentialParts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }
      
      // Validate JWT structure
      const [header, payload, signature] = credentialParts;
      if (!header || !payload || !signature) {
        throw new Error('Malformed JWT token');
      }
      
      // Decode and validate payload
      let decoded;
      try {
        decoded = JSON.parse(atob(payload));
      } catch (error) {
        throw new Error('Invalid JWT payload encoding');
      }
      
      // Validate token expiration
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('JWT token has expired');
      }
      
      // Validate token issuer (Google)
      if (decoded.iss && !decoded.iss.includes('accounts.google.com')) {
        throw new Error('Invalid token issuer');
      }
      console.log('User info:', decoded);
      console.log('Email received:', decoded.email);
      
      // Validate decoded data
      if (!decoded.email || !decoded.name || !decoded.sub) {
        throw new Error('Invalid user data in token');
      }
      
      // Verify domain
      if (!decoded.email.endsWith('@g.cjc.edu.ph')) {
        console.log('Domain check failed:', decoded.email);
        setStatus(`❌ Access denied. Only @g.cjc.edu.ph accounts are allowed. Your email: ${decoded.email}`);
        return;
      }
      
      console.log('Domain check passed for:', decoded.email);
      
      // Check authorization (you can expand this list)
      const authorizedUsers = [
        'klentparaiso@g.cjc.edu.ph',
        'paraisoklent8@g.cjc.edu.ph',
        'finance@g.cjc.edu.ph',
        'admin@g.cjc.edu.ph',
        'studentcouncil@g.cjc.edu.ph',
        'constantinoarianna@g.cjc.edu.ph',
        'francisgillo@g.cjc.edu.ph',
        'cometalucky@g.cjc.edu.ph',
        'olaguerrhenzen@g.cjc.edu.ph',
        'aicellausa@g.cjc.edu.ph',
        'lafuentekeisha@g.cjc.edu.ph',
        'clarkkimberlyvargas@g.cjc.edu.ph',
        'lovelyplania@g.cjc.edu.ph',
        'katelafuente@g.cjc.edu.ph',
        'francisamad@g.cjc.edu.ph',
        'pamogasashley@g.cjc.edu.ph',
        'sedimomika@g.cjc.edu.ph',
        'michaelajabon@g.cjc.edu.ph'
        // Add more authorized staff emails here
      ];
      
      console.log('Checking authorization for:', decoded.email);
      console.log('Authorized users list:', authorizedUsers);
      
      const isAuthorized = authorizedUsers.some(email => email.toLowerCase() === decoded.email.toLowerCase());
      console.log('Authorization result:', isAuthorized);
      
      if (!isAuthorized) {
        console.log('Authorization failed for:', decoded.email);
        setStatus(`❌ Access denied. You are not authorized to receive payments. Your email: ${decoded.email}. Contact the administrator to be added to the authorized users list.`);
        return;
      }
      
      console.log('Authorization passed for:', decoded.email);
      
      // Success!
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setStatus(`✅ Authenticated as ${decoded.name}`);
      
      // Save authentication to localStorage for persistence (with security measures)
      try {
        // Create a minimal user object (don't store sensitive data)
        const safeUserData = {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          googleId: userData.googleId,
          // Add session ID for additional security
          sessionId: Math.random().toString(36).substring(2, 15)
        };
        
        localStorage.setItem('funrun_auth_user', JSON.stringify(safeUserData));
        localStorage.setItem('funrun_auth_timestamp', Date.now().toString());
        localStorage.setItem('funrun_auth_session', safeUserData.sessionId);
        console.log('Authentication saved to localStorage (secured)');
      } catch (error) {
        console.error('Error saving authentication:', error);
        // Don't fail the authentication if localStorage fails
      }
      
    } catch (error) {
      console.error('Error processing authentication:', error);
      setStatus(`❌ Error processing authentication: ${error.message}`);
    }
  };

  const handleSignOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // Clear all localStorage data (including session data)
    localStorage.removeItem('funrun_auth_user');
    localStorage.removeItem('funrun_auth_timestamp');
    localStorage.removeItem('funrun_auth_session');
    
    // Clear any other potential auth-related data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('funrun_')) {
        localStorage.removeItem(key);
      }
    });
    
    setUser(null);
    setIsAuthenticated(false);
    setStatus('Signed out. Please sign in again to access the payment system.');
    
    console.log('User signed out and all localStorage data cleared');
  };

  // If authenticated, show the payment system
  if (isAuthenticated && user) {
    return (
      <div>
        {/* Authenticated User Header */}
        <div className="bg-success text-white py-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center">
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="rounded-circle me-2"
                    width="32" 
                    height="32"
                  />
                  <div>
                    <small>
                      <i className="bi bi-shield-check me-1"></i>
                      <strong>Authenticated:</strong> {user.name} ({user.email})
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={handleSignOut}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Payment System */}
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow">
                <div className="card-header bg-success text-white text-center">
                  <h2 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Fun Run Payment Tracker
                  </h2>
                  <p className="mb-0 mt-2">Secure payment recording system</p>
                </div>
                <div className="card-body">
                  <StudentForm authenticatedUser={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <h3><i className="bi bi-shield-lock me-2"></i>Secure Access Required</h3>
          </div>
          <div className="card-body text-center">
            <div className="mb-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h5 className="mb-3">Initializing Authentication...</h5>
            <p className="text-muted">
              Setting up secure access to the Fun Run payment system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login screen
  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h3><i className="bi bi-shield-lock me-2"></i>Secure Access Required</h3>
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
          
          <div className="alert alert-info">
            <strong>Status:</strong> {status}
          </div>
          
          {/* Google Sign-In Button */}
          <div className="d-flex justify-content-center mb-4">
            <div id="g_id_signin"></div>
          </div>
          
          <div className="mt-4">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Only accounts ending with @g.cjc.edu.ph are authorized
            </small>
          </div>

          <div className="mt-3">
            <small className="text-muted">
              <strong>Security Features:</strong><br/>
              🔐 Domain verification • 👤 Identity confirmation • 📧 Auto email notifications • 🔄 Session persistence
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePaymentApp;




