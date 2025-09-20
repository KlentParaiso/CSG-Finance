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

const StudentForm = ({ authenticatedUser }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    email: '',
    college: '',
    course: '',
    paymentAmount: '200',
    paymentMethod: 'Cash',
    receivedBy: authenticatedUser ? authenticatedUser.name : '',
    customReceiver: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Memoize options to prevent unnecessary re-renders
  const colleges = useMemo(() => [
    { value: 'CABE', label: 'College of Accountancy, Business and Entrepreneurship (CABE)' },
    { value: 'CEDAS', label: 'College of Education, Arts and Sciences (CEDAS)' },
    { value: 'CHS', label: 'College of Health Sciences (CHS)' },
    { value: 'COE', label: 'College of Engineering (COE)' },
    { value: 'CCIS', label: 'College of Computing and Information Sciences (CCIS)' }
  ], []);

  const paymentMethods = useMemo(() => ['Cash', 'Bank Transfer', 'GCash', 'PayMaya', 'Check'], []);

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
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  }, []);

  const validateForm = () => {
    const { studentName, studentId, email, college, course, paymentAmount } = formData;
    
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
      setMessage('Please enter the course/program');
      setMessageType('danger');
      return false;
    }
    
    if (course.length > 100) {
      setMessage('Course name is too long. Please keep it under 100 characters.');
      setMessageType('danger');
      return false;
    }
    
    // Payment amount is fixed at 200 pesos, no validation needed

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
      
      // Reset form
      setFormData({
        studentName: '',
        studentId: '',
        email: '',
        college: '',
        course: '',
        paymentAmount: '200',
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
            <strong>Student ID</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="Enter student ID number"
            disabled={isLoading}
            required
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <strong>Student Email</strong>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter student's email address"
          disabled={isLoading}
          required
        />
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
          <input
            type="text"
            className="form-control"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            placeholder="Enter course or program"
            disabled={isLoading}
            required
          />
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
            value="200"
            disabled={true}
            style={{ backgroundColor: '#e9ecef' }}
          />
          <div className="form-text">
            <i className="bi bi-info-circle me-1"></i>
            Fun Run registration fee is fixed at ₱200.00
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
  );
};

export default React.memo(StudentForm);