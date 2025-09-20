/**
 * Security utilities for CSG Finance Fun Run Payment Tracker
 * Provides rate limiting, input validation, and security measures
 */

// Rate limiting storage
const rateLimitStore = new Map();

/**
 * Rate limiting function to prevent abuse
 * @param {string} key - Unique identifier for rate limiting
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - Whether the request is allowed
 */
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get or create rate limit entry
  let attempts = rateLimitStore.get(key) || [];
  
  // Remove old attempts outside the window
  attempts = attempts.filter(timestamp => timestamp > windowStart);
  
  // Check if limit exceeded
  if (attempts.length >= maxAttempts) {
    return false;
  }
  
  // Add current attempt
  attempts.push(now);
  rateLimitStore.set(key, attempts);
  
  return true;
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space, but don't trim
};

/**
 * Validate email format for school domain
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid and from school domain
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@g\.cjc\.edu\.ph$/;
  return emailRegex.test(email);
};

/**
 * Validate student ID format
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} - Whether student ID is valid
 */
export const isValidStudentId = (studentId) => {
  // Allow alphanumeric characters, hyphens, and underscores
  const studentIdRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return studentIdRegex.test(studentId);
};

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {boolean} - Whether name is valid
 */
export const isValidName = (name) => {
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Generate secure session ID
 * @returns {string} - Secure session ID
 */
export const generateSessionId = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate JWT token structure
 * @param {string} token - JWT token to validate
 * @returns {boolean} - Whether token structure is valid
 */
export const isValidJWTStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check if all parts are base64 encoded
  try {
    parts.forEach(part => atob(part));
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - Whether token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) return false; // No expiration set
    
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true; // If we can't parse, consider it expired
  }
};

/**
 * Validate domain for school emails
 * @param {string} email - Email to validate
 * @param {string} allowedDomain - Allowed domain (e.g., '@g.cjc.edu.ph')
 * @returns {boolean} - Whether email domain is allowed
 */
export const isValidDomain = (email, allowedDomain) => {
  return email.toLowerCase().endsWith(allowedDomain.toLowerCase());
};

/**
 * Log security events
 * @param {string} event - Security event type
 * @param {object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.warn('Security Event:', logEntry);
  
  // In production, you might want to send this to a logging service
  // For now, we'll just log to console
};

/**
 * Clear rate limit data (for testing or cleanup)
 */
export const clearRateLimitData = () => {
  rateLimitStore.clear();
};

/**
 * Get rate limit status for a key
 * @param {string} key - Rate limit key
 * @returns {object} - Rate limit status
 */
export const getRateLimitStatus = (key) => {
  const attempts = rateLimitStore.get(key) || [];
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const windowStart = now - windowMs;
  
  const recentAttempts = attempts.filter(timestamp => timestamp > windowStart);
  
  return {
    attempts: recentAttempts.length,
    maxAttempts: 5,
    resetTime: recentAttempts.length > 0 ? Math.max(...recentAttempts) + windowMs : now
  };
};
