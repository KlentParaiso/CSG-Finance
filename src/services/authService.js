// Google OAuth Authentication Service for School GSuite
// This ensures only authorized school staff can receive payments

class AuthService {
  constructor() {
    this.clientId = '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com';
    this.schoolDomain = 'g.cjc.edu.ph'; // Your school domain
    this.authorizedUsers = new Set([
      'klentparaiso@g.cjc.edu.ph', // Your actual email
      'paraisoklent8@g.cjc.edu.ph',
      'finance@g.cjc.edu.ph',
      'admin@g.cjc.edu.ph',
      'studentcouncil@g.cjc.edu.ph',
      'funrun@g.cjc.edu.ph'
      // Add more authorized staff emails here
    ]);
    this.currentUser = null;
  }

  // Initialize Google Sign-In
  async initializeGoogleAuth() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: this.clientId,
            hosted_domain: this.schoolDomain // Restrict to school domain only
          }).then(() => {
            this.authInstance = window.gapi.auth2.getAuthInstance();
            resolve();
          }).catch(reject);
        });
      } else {
        reject(new Error('Google API not loaded'));
      }
    });
  }

  // Sign in with Google
  async signIn() {
    try {
      if (!this.authInstance) {
        await this.initializeGoogleAuth();
      }

      const googleUser = await this.authInstance.signIn({
        hosted_domain: this.schoolDomain,
        prompt: 'select_account'
      });

      const profile = googleUser.getBasicProfile();
      const email = profile.getEmail();
      const name = profile.getName();

      // Verify user is from school domain
      if (!email.endsWith(`@${this.schoolDomain}`)) {
        throw new Error(`Access denied. Only ${this.schoolDomain} accounts are allowed.`);
      }

      // Verify user is authorized
      if (!this.authorizedUsers.has(email)) {
        throw new Error('Access denied. You are not authorized to receive payments.');
      }

      this.currentUser = {
        email,
        name,
        imageUrl: profile.getImageUrl(),
        isSignedIn: true,
        googleUser
      };

      return this.currentUser;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    if (this.authInstance) {
      await this.authInstance.signOut();
      this.currentUser = null;
    }
  }

  // Check if user is signed in
  isSignedIn() {
    return this.currentUser && this.currentUser.isSignedIn;
  }

  // Get current user info
  getCurrentUser() {
    return this.currentUser;
  }

  // Verify user session
  async verifySession() {
    if (!this.authInstance) {
      return false;
    }

    const isSignedIn = this.authInstance.isSignedIn.get();
    if (!isSignedIn) {
      this.currentUser = null;
      return false;
    }

    const googleUser = this.authInstance.currentUser.get();
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();

    // Re-verify domain and authorization
    if (!email.endsWith(`@${this.schoolDomain}`) || !this.authorizedUsers.has(email)) {
      await this.signOut();
      return false;
    }

    return true;
  }

  // Get user's access token for API calls
  getAccessToken() {
    if (this.currentUser && this.currentUser.googleUser) {
      return this.currentUser.googleUser.getAuthResponse().access_token;
    }
    return null;
  }
}

export default new AuthService();
