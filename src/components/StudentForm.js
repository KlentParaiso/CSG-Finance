import React, { useState, useCallback, useMemo } from 'react';
import { savePaymentToGoogleSheets } from '../services/googleSheetsService';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidStudentId, 
  isValidName, 
  checkRateLimit,
  logSecurityEvent 
} from '../utils/security';
import DailyStats from './DailyStats';

const StudentForm = ({ authenticatedUser }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    email: '',
    college: '',
    course: '',
    yearLevel: '',
    paymentAmount: '180',
    paymentMethod: 'Cash',
    receivedBy: authenticatedUser ? authenticatedUser.name : '',
    customReceiver: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize options to prevent unnecessary re-renders
  const colleges = useMemo(() => [
    { value: 'CABE', label: 'College of Accountancy, Business and Entrepreneurship (CABE)' },
    { value: 'CEDAS', label: 'College of Education, Arts and Sciences (CEDAS)' },
    { value: 'CHS', label: 'College of Health Sciences (CHS)' },
    { value: 'COE', label: 'College of Engineering (COE)' },
    { value: 'CCIS', label: 'College of Computing and Information Sciences (CCIS)' },
    { value: 'CSP', label: 'College of Special Programs (CSP)' }
  ], []);

  const paymentMethods = useMemo(() => ['Cash', 'Bank Transfer', 'GCash', 'PayMaya', 'Check'], []);

  // Year level options
  const yearLevels = useMemo(() => [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
    { value: '5th Year', label: '5th Year' }
  ], []);

  // Course options by college
  const courseOptions = useMemo(() => ({
    'CHS': [
      'BS in Nursing',
      'BS in Medical Laboratory Science',
      'BS in Radiologic Technology',
      'BS in Pharmacology'
    ],
    'COE': [
      'BSCE',
      'BSECE',
      'BSCPE'
    ],
    'CEDAS': [
      'BS Psychology',
      'BS Criminology',
      'BS Mathematics',
      'AB English',
      'BSED English',
      'BSED Filipino',
      'BSED Mathematics',
      'BSED Science',
      'BECED',
      'BEED',
      'BPED',
      'BTV-TED (Major in Automotive Technology)',
      'BTV-TED (Major in Food and Service Management)'
    ],
    'CCIS': [
      'IT',
      'CS',
      'BLIS'
    ],
    'CABE': [
      'BSA',
      'BSMA',
      'BSHM',
      'BSTM',
      'BSBA - FM',
      'BSBA - MM',
      'BSBA - HRDM',
      'BPA'
    ],
    'CSP': [
      'None'
    ]
  }), []);

  // Enhanced input validation with security measures

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    // Additional length validation to prevent DoS
    if (sanitizedValue.length > 255) {
      setMessage('Input too long. Please keep it under 255 characters.');
      setMessageType('danger');
      return;
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: sanitizedValue
      };
      
      // If college changes, reset course selection
      if (name === 'college') {
        if (sanitizedValue === 'CSP') {
          newData.course = 'None';
        } else {
          newData.course = '';
        }
      }
      
      return newData;
    });
  }, []);

  const handleEmailBlur = useCallback((e) => {
    const { value } = e.target;
    let sanitizedValue = sanitizeInput(value);
    
    // Auto-complete email domain for school emails only on blur
    if (sanitizedValue && !sanitizedValue.includes('@') && !sanitizedValue.endsWith('@g.cjc.edu.ph')) {
      sanitizedValue = sanitizedValue + '@g.cjc.edu.ph';
      
      setFormData(prev => ({
        ...prev,
        email: sanitizedValue
      }));
    }
  }, []);

  const validateForm = () => {
    const { studentName, studentId, email, college, course, yearLevel, paymentAmount } = formData;
    
    // Enhanced validation with security checks
    if (!studentName.trim()) {
      setMessage('Please enter the student name');
      setMessageType('danger');
      return false;
    }
    
    if (!isValidName(studentName)) {
      setMessage('Please enter a valid student name (letters, spaces, hyphens, and apostrophes only)');
      setMessageType('danger');
      logSecurityEvent('invalid_name_format', { studentName });
      return false;
    }
    
    if (!studentId.trim()) {
      setMessage('Please enter the student ID');
      setMessageType('danger');
      return false;
    }
    
    if (!isValidStudentId(studentId)) {
      setMessage('Please enter a valid student ID (3-20 characters, letters, numbers, hyphens, and underscores only)');
      setMessageType('danger');
      logSecurityEvent('invalid_student_id_format', { studentId });
      return false;
    }
    
    if (!email.trim()) {
      setMessage('Please enter the student email');
      setMessageType('danger');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('danger');
      logSecurityEvent('invalid_email_format', { email });
      return false;
    }
    
    if (!college) {
      setMessage('Please select a college');
      setMessageType('danger');
      return false;
    }
    
    if (!course.trim()) {
      setMessage('Please select the course/program');
      setMessageType('danger');
      return false;
    }
    
    if (!yearLevel) {
      setMessage('Please select the year level');
      setMessageType('danger');
      return false;
    }
    
    // Payment amount is fixed at 180 pesos, no validation needed

    if (!authenticatedUser) {
      setMessage('Authentication error. Please sign out and sign in again.');
      setMessageType('danger');
      logSecurityEvent('unauthenticated_form_submission', { formData });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = `form_submission_${authenticatedUser?.email || 'anonymous'}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) { // 10 submissions per minute
      setMessage('Too many submissions. Please wait a moment before trying again.');
      setMessageType('danger');
      logSecurityEvent('rate_limit_exceeded', { user: authenticatedUser?.email });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Validate authenticated user
      if (!authenticatedUser || !authenticatedUser.email || !authenticatedUser.name) {
        throw new Error('Authentication error. Please sign out and sign in again.');
      }

      const paymentData = {
        ...formData,
        paymentAmount: parseFloat(formData.paymentAmount),
        receivedBy: `${authenticatedUser.name} (${authenticatedUser.email})`,
        receiverEmail: authenticatedUser.email,
        receiverGoogleId: authenticatedUser.googleId || '',
        ipAddress: 'Client IP', // This would be captured server-side
        timestamp: new Date().toISOString()
      };

      console.log('Submitting payment data:', paymentData);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout. Please try again.')), 30000);
      });
      
      await Promise.race([
        savePaymentToGoogleSheets(paymentData),
        timeoutPromise
      ]);
      
      setMessage('Payment recorded successfully! Email confirmation sent to student.');
      setMessageType('success');
      
      // Refresh dashboard statistics
      setRefreshTrigger(prev => prev + 1);
      
      // Reset form
      setFormData({
        studentName: '',
        studentId: '',
        email: '',
        college: '',
        course: '',
        yearLevel: '',
        paymentAmount: '180',
        paymentMethod: 'Cash',
        receivedBy: authenticatedUser ? authenticatedUser.name : '',
        customReceiver: ''
      });

    } catch (error) {
      console.error('Error recording payment:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to record payment. Please try again.';
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message.includes('Authentication')) {
        errorMessage = 'Authentication error. Please sign out and sign in again.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setMessage(errorMessage);
      setMessageType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticatedUser) {
    return (
      <div className="alert alert-warning">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Authentication required. Please sign in to continue.
      </div>
    );
  }

  return (
    <div>
      <DailyStats authenticatedUser={authenticatedUser} refreshTrigger={refreshTrigger} />
      <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="studentName" className="form-label">
            <strong>Student Name</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="Enter student's full name"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="studentId" className="form-label">
            <strong>Race Bib Number</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="Enter race bib number"
            disabled={isLoading}
            required
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <strong>Student Email</strong>
        </label>
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            placeholder="Enter username"
            disabled={isLoading}
            required
            style={{ paddingRight: '120px' }}
          />
          <span 
            className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
            style={{ pointerEvents: 'none', fontSize: '14px' }}
          >
            @g.cjc.edu.ph
          </span>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="college" className="form-label">
            <strong>College</strong>
          </label>
          <select
            className="form-select"
            id="college"
            name="college"
            value={formData.college}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          >
            <option value="">Select College</option>
            {colleges.map(college => (
              <option key={college.value} value={college.value}>
                {college.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="course" className="form-label">
            <strong>Course/Program</strong>
          </label>
          <select
            className="form-select"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            disabled={isLoading || !formData.college || formData.college === 'CSP'}
            required
          >
            <option value="">
              {formData.college ? 'Select Course' : 'Select College First'}
            </option>
            {formData.college && courseOptions[formData.college]?.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="yearLevel" className="form-label">
            <strong>Year Level</strong>
          </label>
          <select
            className="form-select"
            id="yearLevel"
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          >
            <option value="">Select Year Level</option>
            {yearLevels.map(year => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="paymentAmount" className="form-label">
            <strong>Payment Amount (₱)</strong>
          </label>
          <input
            type="number"
            className="form-control"
            id="paymentAmount"
            name="paymentAmount"
            value="180"
            disabled={true}
            style={{ backgroundColor: '#e9ecef' }}
          />
          <div className="form-text">
            <i className="bi bi-info-circle me-1"></i>
            Fun Run registration fee is fixed at ₱180.00
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="paymentMethod" className="form-label">
            <strong>Payment Method</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="paymentMethod"
            name="paymentMethod"
            value="Cash"
            disabled={true}
            style={{ backgroundColor: '#e9ecef' }}
          />
          <div className="form-text">
            <i className="bi bi-info-circle me-1"></i>
            Fun Run payments are accepted in cash only
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="receivedBy" className="form-label">
          <strong>Received By</strong>
        </label>
        <input
          type="text"
          className="form-control"
          id="receivedBy"
          name="receivedBy"
          value={authenticatedUser ? `${authenticatedUser.name} (${authenticatedUser.email})` : ''}
          disabled={true}
          style={{ backgroundColor: '#e9ecef' }}
        />
        <div className="form-text">
          This field is automatically filled with your authenticated account information.
        </div>
      </div>
      
      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Recording Payment...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Record Payment & Send Confirmation
            </>
          )}
        </button>
      </div>
    </form>
    </div>
  );
};

export default React.memo(StudentForm);