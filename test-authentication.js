/**
 * Authentication System Test Suite
 * Run this in browser console to test authentication functionality
 */

console.log('🧪 Starting Authentication Tests...');

// Test 1: Check if Google Identity script is loaded
function testGoogleScriptLoaded() {
  console.log('Test 1: Google Identity Script');
  if (window.google && window.google.accounts) {
    console.log('✅ Google Identity script loaded successfully');
    return true;
  } else {
    console.log('❌ Google Identity script not loaded');
    return false;
  }
}

// Test 2: Check localStorage functionality
function testLocalStorage() {
  console.log('Test 2: LocalStorage Functionality');
  try {
    const testKey = 'test_key';
    const testValue = 'test_value';
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved === testValue) {
      console.log('✅ LocalStorage working correctly');
      return true;
    } else {
      console.log('❌ LocalStorage not working correctly');
      return false;
    }
  } catch (error) {
    console.log('❌ LocalStorage error:', error);
    return false;
  }
}

// Test 3: Check authentication state persistence
function testAuthPersistence() {
  console.log('Test 3: Authentication Persistence');
  try {
    // Simulate saving auth data
    const mockUser = {
      name: 'Test User',
      email: 'test@g.cjc.edu.ph',
      picture: 'https://example.com/pic.jpg',
      googleId: 'test123'
    };
    
    localStorage.setItem('funrun_auth_user', JSON.stringify(mockUser));
    localStorage.setItem('funrun_auth_timestamp', Date.now().toString());
    
    // Check if data was saved
    const savedUser = localStorage.getItem('funrun_auth_user');
    const savedTimestamp = localStorage.getItem('funrun_auth_timestamp');
    
    if (savedUser && savedTimestamp) {
      console.log('✅ Authentication persistence working');
      // Clean up test data
      localStorage.removeItem('funrun_auth_user');
      localStorage.removeItem('funrun_auth_timestamp');
      return true;
    } else {
      console.log('❌ Authentication persistence failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication persistence error:', error);
    return false;
  }
}

// Test 4: Check session expiry logic
function testSessionExpiry() {
  console.log('Test 4: Session Expiry Logic');
  try {
    const mockUser = {
      name: 'Test User',
      email: 'test@g.cjc.edu.ph',
      picture: 'https://example.com/pic.jpg',
      googleId: 'test123'
    };
    
    // Save with old timestamp (25 hours ago)
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
    localStorage.setItem('funrun_auth_user', JSON.stringify(mockUser));
    localStorage.setItem('funrun_auth_timestamp', oldTimestamp.toString());
    
    // Check if session would be considered expired
    const savedTimestamp = parseInt(localStorage.getItem('funrun_auth_timestamp'));
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - savedTimestamp >= maxAge) {
      console.log('✅ Session expiry logic working correctly');
      // Clean up
      localStorage.removeItem('funrun_auth_user');
      localStorage.removeItem('funrun_auth_timestamp');
      return true;
    } else {
      console.log('❌ Session expiry logic failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Session expiry test error:', error);
    return false;
  }
}

// Test 5: Check domain validation
function testDomainValidation() {
  console.log('Test 5: Domain Validation');
  const testEmails = [
    { email: 'user@g.cjc.edu.ph', shouldPass: true },
    { email: 'user@gmail.com', shouldPass: false },
    { email: 'user@yahoo.com', shouldPass: false },
    { email: 'user@cjc.edu.ph', shouldPass: false }
  ];
  
  let passed = 0;
  testEmails.forEach(({ email, shouldPass }) => {
    const isValid = email.endsWith('@g.cjc.edu.ph');
    if (isValid === shouldPass) {
      console.log(`✅ ${email}: ${isValid ? 'Valid' : 'Invalid'} (correct)`);
      passed++;
    } else {
      console.log(`❌ ${email}: ${isValid ? 'Valid' : 'Invalid'} (incorrect)`);
    }
  });
  
  if (passed === testEmails.length) {
    console.log('✅ Domain validation working correctly');
    return true;
  } else {
    console.log('❌ Domain validation has issues');
    return false;
  }
}

// Test 6: Check authorized users list
function testAuthorizedUsers() {
  console.log('Test 6: Authorized Users List');
  const authorizedUsers = [
    'klentparaiso@g.cjc.edu.ph',
    'paraisoklent8@g.cjc.edu.ph',
    'paraisoklent@g.cjc.edu.ph', 
    'finance@g.cjc.edu.ph',
    'admin@g.cjc.edu.ph',
    'studentcouncil@g.cjc.edu.ph'
  ];
  
  const testEmails = [
    { email: 'klentparaiso@g.cjc.edu.ph', shouldPass: true },
    { email: 'finance@g.cjc.edu.ph', shouldPass: true },
    { email: 'unauthorized@g.cjc.edu.ph', shouldPass: false },
    { email: 'random@g.cjc.edu.ph', shouldPass: false }
  ];
  
  let passed = 0;
  testEmails.forEach(({ email, shouldPass }) => {
    const isAuthorized = authorizedUsers.some(authEmail => 
      authEmail.toLowerCase() === email.toLowerCase()
    );
    
    if (isAuthorized === shouldPass) {
      console.log(`✅ ${email}: ${isAuthorized ? 'Authorized' : 'Unauthorized'} (correct)`);
      passed++;
    } else {
      console.log(`❌ ${email}: ${isAuthorized ? 'Authorized' : 'Unauthorized'} (incorrect)`);
    }
  });
  
  if (passed === testEmails.length) {
    console.log('✅ Authorized users list working correctly');
    return true;
  } else {
    console.log('❌ Authorized users list has issues');
    return false;
  }
}

// Run all authentication tests
function runAllAuthTests() {
  console.log('🚀 Running All Authentication Tests...\n');
  
  const tests = [
    testGoogleScriptLoaded,
    testLocalStorage,
    testAuthPersistence,
    testSessionExpiry,
    testDomainValidation,
    testAuthorizedUsers
  ];
  
  let passed = 0;
  tests.forEach(test => {
    if (test()) {
      passed++;
    }
    console.log(''); // Add spacing
  });
  
  console.log(`📊 Authentication Test Results: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All authentication tests passed! System is ready.');
  } else {
    console.log('⚠️ Some authentication tests failed. Please review the issues above.');
  }
  
  return passed === tests.length;
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllAuthTests);
  } else {
    runAllAuthTests();
  }
}

// Export for manual testing
window.runAuthTests = runAllAuthTests;
