import React, { useEffect, useState } from 'react';

const SimpleGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
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
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && window.google.accounts) {
      setStatus('Google loaded, setting up sign-in...');
      
      window.google.accounts.id.initialize({
        client_id: '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com',
        callback: handleSignIn,
        auto_select: false
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left'
        }
      );
      
      setStatus('Ready! Click the sign-in button below.');
    } else {
      setStatus('Error: Google Identity Services not available');
    }
  };

  const handleSignIn = (credentialResponse) => {
    console.log('Sign in successful!', credentialResponse);
    
    try {
      // Decode the credential
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      console.log('Decoded user info:', decoded);
      
      // Check domain
      if (!decoded.email.endsWith('@g.cjc.edu.ph')) {
        setStatus(`❌ Domain not allowed. Your email: ${decoded.email}. Only @g.cjc.edu.ph accounts are permitted.`);
        return;
      }
      
      // Success!
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      
      setStatus(`✅ Success! Signed in as ${decoded.name}`);
      
    } catch (error) {
      console.error('Error processing sign-in:', error);
      setStatus('❌ Error processing sign-in response');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setStatus('Signed out. Ready to sign in again.');
  };

  if (user) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h3>🎉 Authentication Successful!</h3>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <img 
                src={user.picture} 
                alt="Profile" 
                className="rounded-circle me-3"
                width="60" 
                height="60"
              />
              <div>
                <h4>{user.name}</h4>
                <p className="text-muted mb-0">{user.email}</p>
                <span className="badge bg-success">✅ Authorized</span>
              </div>
            </div>
            
            <div className="alert alert-success">
              <h5>🔐 Security Verified!</h5>
              <ul className="mb-0">
                <li>✅ School domain confirmed (@g.cjc.edu.ph)</li>
                <li>✅ Google authentication successful</li>
                <li>✅ Ready for payment processing</li>
              </ul>
            </div>
            
            <div className="d-grid gap-2 d-md-flex">
              <button 
                className="btn btn-primary btn-lg me-md-2"
                onClick={() => alert('Authentication working! Ready to integrate with full payment system.')}
              >
                <i className="bi bi-credit-card me-2"></i>
                Continue to Payment System
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </button>
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
          <h3><i className="bi bi-shield-lock me-2"></i>Fun Run Payment System</h3>
          <p className="mb-0">Secure Staff Authentication</p>
        </div>
        <div className="card-body text-center">
          <div className="mb-4">
            <i className="bi bi-building text-primary" style={{fontSize: '4rem'}}></i>
          </div>
          
          <h5>Staff Authentication Required</h5>
          <p className="text-muted mb-4">
            Only authorized CJC staff can access the payment system.
          </p>
          
          <div className="alert alert-info">
            <strong>Status:</strong> {status}
          </div>
          
          {/* Google Sign-In Button */}
          <div className="d-flex justify-content-center mb-4">
            <div id="g_id_signin"></div>
          </div>
          
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Only @g.cjc.edu.ph accounts are authorized
          </small>
        </div>
      </div>
    </div>
  );
};

export default SimpleGoogleAuth;
