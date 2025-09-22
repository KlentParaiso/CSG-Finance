import React, { useEffect, useState } from 'react';

const NewSimpleAuth = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const CLIENT_ID = '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com';

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        console.log('Google Identity Services loaded');
        setStatus('Google Identity Services ready');
        
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          hd: 'gcj.edu.ph' // Hosted domain restriction
        });
        
      } else {
        console.log('Google Identity Services not loaded yet');
        setTimeout(initializeGoogleAuth, 500);
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Credential response:', response);
    
    // Decode the JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('User payload:', payload);
    
    // Check if user is from the correct domain
    if (!payload.email.endsWith('@gcj.edu.ph')) {
      alert('Access denied. Only @gcj.edu.ph accounts are allowed.');
      return;
    }
    
    // Check if user is authorized (you can add your staff list here)
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
      'michaelajabon@g.cjc.edu.ph',
      'jasonremoroza@g.cjc.edu.ph',
      'diazjorex@g.cjc.edu.ph',
      'tejadarobie@g.cjc.edu.ph'
      // Add more authorized emails here
    ];
    
    if (!authorizedUsers.includes(payload.email)) {
      alert('Access denied. You are not authorized to access this system.');
      return;
    }
    
    setUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    });
    setIsSignedIn(true);
    setStatus(`Signed in as: ${payload.name}`);
  };

  const handleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        console.log('Prompt notification:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'email profile',
            callback: (tokenResponse) => {
              console.log('Token response:', tokenResponse);
              // Handle token response
            }
          }).requestAccessToken();
        }
      });
    }
  };

  const handleSignOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    setIsSignedIn(false);
    setStatus('Signed out');
  };

  if (isSignedIn && user) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h3>✅ Authentication Successful!</h3>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <img 
                src={user.picture} 
                alt="Profile" 
                className="rounded-circle me-3"
                width="50" 
                height="50"
              />
              <div>
                <h5>{user.name}</h5>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
            
            <div className="alert alert-success">
              🎉 Authentication is working! You can now access the Fun Run payment system.
            </div>
            
            <button 
              className="btn btn-danger"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>🔧 New Google Auth Test</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Status:</strong> {status}
          </div>
          
          <button 
            className="btn btn-primary mb-3"
            onClick={handleSignIn}
          >
            Sign in with Google (New Method)
          </button>
          
          <div className="mt-3">
            <small className="text-muted">
              This uses Google's newer Identity Services API which should work better.
            </small>
          </div>

          {/* Google Sign-In Button (automatic) */}
          <div className="mt-3">
            <div 
              id="g_id_onload"
              data-client_id={CLIENT_ID}
              data-callback="handleCredentialResponse"
              data-hd="gcj.edu.ph"
            ></div>
            <div 
              className="g_id_signin" 
              data-type="standard"
              data-size="large"
              data-theme="outline"
              data-text="sign_in_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSimpleAuth;
