import React, { useEffect, useState } from 'react';

const SimpleAuthTest = () => {
  const [status, setStatus] = useState('Loading...');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const testGoogleAPI = () => {
      console.log('Testing Google API...');
      
      // Check if Google API is loaded
      if (!window.gapi) {
        setErrors(prev => [...prev, 'Google API (gapi) not loaded']);
        setStatus('Error: Google API not found');
        return;
      }
      
      console.log('Google API found, loading auth2...');
      
      window.gapi.load('auth2', () => {
        console.log('Auth2 loaded, initializing...');
        
        window.gapi.auth2.init({
          client_id: '146947485392-99trhoboqljsifvoba8a8u21ofq3offh.apps.googleusercontent.com',
          hosted_domain: 'gcj.edu.ph'
        }).then(() => {
          console.log('Auth2 initialized successfully');
          setStatus('Google Auth initialized - Ready to test');
        }).catch((error) => {
          console.error('Auth2 init failed:', error);
          setErrors(prev => [...prev, `Auth2 init failed: ${error.error || error.message}`]);
          setStatus('Auth2 initialization failed');
        });
      });
    };

    // Wait a bit for Google API to load
    setTimeout(testGoogleAPI, 1000);
  }, []);

  const testSignIn = () => {
    console.log('Testing sign in...');
    
    if (!window.gapi || !window.gapi.auth2) {
      setErrors(prev => [...prev, 'Google Auth2 not available']);
      return;
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance) {
      setErrors(prev => [...prev, 'Auth instance not found']);
      return;
    }

    console.log('Attempting sign in...');
    authInstance.signIn({
      hosted_domain: 'gcj.edu.ph'
    }).then((googleUser) => {
      console.log('Sign in successful!', googleUser);
      const profile = googleUser.getBasicProfile();
      setStatus(`Signed in as: ${profile.getName()} (${profile.getEmail()})`);
    }).catch((error) => {
      console.error('Sign in failed:', error);
      setErrors(prev => [...prev, `Sign in failed: ${error.error || error.message}`]);
    });
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Google Auth Debug Test</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Status:</strong> {status}
          </div>
          
          {errors.length > 0 && (
            <div className="mb-3">
              <strong>Errors:</strong>
              <ul className="text-danger">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={testSignIn}
          >
            Test Google Sign In
          </button>
          
          <div className="mt-3">
            <small className="text-muted">
              Check the browser console (F12) for detailed logs
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthTest;








