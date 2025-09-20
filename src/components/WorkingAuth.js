import React, { useEffect, useState } from 'react';

const WorkingAuth = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Loading Google Identity Services...');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const CLIENT_ID = '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com';

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts) {
        console.log('Google Identity Services loaded successfully');
        setStatus('Ready to sign in');
        
        // Initialize WITHOUT domain restrictions first
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false
        });
        
        // Render the sign-in button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
        
      } else {
        console.log('Google Identity Services not loaded yet, retrying...');
        setTimeout(initializeGoogleAuth, 500);
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Credential response received:', response);
    
    try {
      // Decode the JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('User payload:', payload);
      
      // Manual domain check (since automatic one is failing)
      if (!payload.email.endsWith('@g.cjc.edu.ph')) {
        setStatus(`Access denied. Only @g.cjc.edu.ph accounts are allowed. Your email: ${payload.email}`);
        return;
      }
      
      // Check if user is authorized
      const authorizedUsers = [
        'klentparaiso@g.cjc.edu.ph',
        'paraisoklent8@g.cjc.edu.ph',
        'finance@g.cjc.edu.ph',
        'admin@g.cjc.edu.ph',
        // Add more authorized emails here
      ];
      
      if (!authorizedUsers.some(email => email.toLowerCase() === payload.email.toLowerCase())) {
        setStatus(`Access denied. You are not authorized. Your email: ${payload.email}`);
        return;
      }
      
      setUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        googleId: payload.sub
      });
      setIsSignedIn(true);
      setStatus(`✅ Successfully signed in as: ${payload.name}`);
      
    } catch (error) {
      console.error('Error processing credential:', error);
      setStatus('Error processing sign-in response');
    }
  };

  const handleSignOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    setIsSignedIn(false);
    setStatus('Signed out successfully');
  };

  if (isSignedIn && user) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h3>🎉 Authentication Successful!</h3>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="rounded-circle me-3"
                  width="50" 
                  height="50"
                />
              )}
              <div>
                <h5>{user.name}</h5>
                <p className="text-muted mb-0">{user.email}</p>
                <small className="text-success">✅ Authorized staff member</small>
              </div>
            </div>
            
            <div className="alert alert-success">
              <strong>🔐 Security Check Passed!</strong><br/>
              ✅ School domain verified<br/>
              ✅ Authorized user confirmed<br/>
              ✅ Ready to record payments
            </div>
            
            <div className="row">
              <div className="col-auto">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    // This would switch back to the actual payment form
                    alert('Authentication working! Ready to integrate with payment form.');
                  }}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Continue to Payment Form
                </button>
              </div>
              <div className="col-auto">
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleSignOut}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3><i className="bi bi-shield-lock me-2"></i>Secure Access Required</h3>
        </div>
        <div className="card-body text-center">
          <div className="mb-4">
            <i className="bi bi-building text-primary" style={{fontSize: '4rem'}}></i>
          </div>
          
          <h5 className="mb-3">Staff Authentication Required</h5>
          <p className="text-muted mb-4">
            Only authorized school staff can access the Fun Run payment system.
          </p>
          
          <div className="mb-3">
            <strong>Status:</strong> <span className="text-info">{status}</span>
          </div>
          
          {/* Google Sign-In Button Container */}
          <div className="d-flex justify-content-center mb-4">
            <div id="google-signin-button"></div>
          </div>
          
          <div className="mt-4">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Only accounts ending with @g.cjc.edu.ph are authorized
            </small>
          </div>
          
          <div className="mt-3">
            <small className="text-muted">
              <strong>Troubleshooting:</strong> If the button doesn't appear, try refreshing the page.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingAuth;
