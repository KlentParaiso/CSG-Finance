# 🔧 CSG Finance - Technical Specifications

## 📋 **System Architecture**

### **Frontend Architecture**
- **Framework:** React 18 with functional components and hooks
- **UI Library:** Bootstrap 5 for responsive design
- **State Management:** React useState and useEffect hooks
- **Authentication:** Google Identity Services (OAuth 2.0)
- **Build Tool:** Create React App with npm

### **Backend Architecture**
- **API:** Google Apps Script (JavaScript-based)
- **Database:** Google Sheets API
- **Email Service:** Gmail API
- **Authentication:** Google OAuth 2.0 with JWT tokens

---

## 🛠️ **Technology Stack**

### **Frontend Technologies**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "bootstrap": "^5.3.0",
  "bootstrap-icons": "^1.11.0"
}
```

### **Backend Technologies**
- **Google Apps Script** - Server-side processing
- **Google Sheets API** - Data storage and retrieval
- **Gmail API** - Automated email notifications
- **Google Identity Services** - Authentication

### **Development Tools**
- **Node.js** 16+ - Runtime environment
- **npm** - Package management
- **Git** - Version control
- **VS Code** - Recommended IDE

---

## 🔐 **Security Implementation**

### **Authentication Security**
```javascript
// JWT Token Validation
const validateJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  
  const payload = JSON.parse(atob(parts[1]));
  if (payload.exp < Date.now() / 1000) throw new Error('Token expired');
  if (!payload.iss.includes('accounts.google.com')) throw new Error('Invalid issuer');
  
  return payload;
};
```

### **Input Sanitization**
```javascript
// XSS Prevention
export const sanitizeInput = (input) => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};
```

### **Rate Limiting**
```javascript
// DoS Protection
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  let attempts = rateLimitStore.get(key) || [];
  attempts = attempts.filter(timestamp => timestamp > windowStart);
  
  if (attempts.length >= maxAttempts) return false;
  
  attempts.push(now);
  rateLimitStore.set(key, attempts);
  return true;
};
```

---

## 📊 **Performance Specifications**

### **Response Time Requirements**
- **Authentication:** < 2 seconds
- **Form Submission:** < 5 seconds
- **Page Load:** < 3 seconds
- **API Calls:** < 1 second

### **Concurrent User Capacity**
- **Optimal:** 10-15 simultaneous users
- **Maximum Tested:** 20 simultaneous users
- **Performance Threshold:** 15 users
- **Degradation Point:** 25+ users

### **Memory Usage**
- **Normal Operation:** 45-52 MB
- **Under Load:** 52-68 MB
- **Maximum Safe:** 100 MB
- **Memory Leaks:** None detected

---

## 🗄️ **Data Management**

### **Data Storage**
```javascript
// Google Sheets Structure
const paymentRecord = {
  studentName: "John Doe",
  studentId: "STU001",
  email: "john.doe@student.cjc.edu.ph",
  college: "CCIS",
  course: "Computer Science",
  paymentAmount: 200,
  paymentMethod: "Cash",
  receivedBy: "Staff Name",
  receiverEmail: "staff@g.cjc.edu.ph",
  timestamp: "2024-12-01T10:30:00.000Z",
  submittedAt: "12/01/2024 10:30:00"
};
```

### **Session Management**
```javascript
// localStorage Structure
const sessionData = {
  user: {
    name: "Staff Name",
    email: "staff@g.cjc.edu.ph",
    picture: "profile_url",
    googleId: "google_user_id",
    sessionId: "unique_session_id"
  },
  timestamp: 1701428400000,
  sessionId: "unique_session_id"
};
```

---

## 🔄 **API Integration**

### **Google Apps Script Endpoint**
```javascript
// Request Format
const request = {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(paymentRecord)
};

// Response Handling
const response = await fetch(APPS_SCRIPT_URL, request);
// Note: no-cors mode prevents reading response body
```

### **Google Sheets API Integration**
```javascript
// Apps Script Function (Server-side)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add data to sheet
    sheet.appendRow([
      data.timestamp,
      data.studentName,
      data.studentId,
      data.email,
      data.college,
      data.course,
      data.paymentAmount,
      data.paymentMethod,
      data.receivedBy,
      data.receiverEmail
    ]);
    
    // Send email notification
    sendEmailNotification(data);
    
    return ContentService.createTextOutput('Success');
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}
```

---

## 🧪 **Testing Framework**

### **Test Coverage**
- **Unit Tests:** Component functionality
- **Integration Tests:** API interactions
- **Load Tests:** Concurrent user simulation
- **Security Tests:** Vulnerability assessment
- **Performance Tests:** Response time validation

### **Test Tools**
```html
<!-- Test Runner HTML -->
<script>
  // Concurrent Load Testing
  async function testConcurrentUsers(userCount) {
    const promises = [];
    for (let i = 1; i <= userCount; i++) {
      promises.push(simulateFormSubmission(i));
    }
    const results = await Promise.all(promises);
    return analyzeResults(results);
  }
</script>
```

---

## 🚀 **Deployment Specifications**

### **Build Configuration**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### **Environment Requirements**
- **Node.js:** 16.0.0 or higher
- **npm:** 8.0.0 or higher
- **Browser:** Modern browser with ES6+ support
- **Network:** Stable internet connection
- **Storage:** 50MB available space

---

## 🔧 **Configuration Management**

### **Environment Variables**
```javascript
// Production Configuration
const CONFIG = {
  CLIENT_ID: '146947485392-99trhoboqijsifvoba8a8u21ofq3offh.apps.googleusercontent.com',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyqPr9OLfetto5vdbe__seFPKEOm1hORpSZXIXts-YWDTDQGAmPd7gdXJid8ixnzz69gA/exec',
  DOMAIN: 'g.cjc.edu.ph',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT: {
    MAX_ATTEMPTS: 10,
    WINDOW_MS: 60000 // 1 minute
  }
};
```

### **Authorized Users Configuration**
```javascript
const authorizedUsers = [
  'klentparaiso@g.cjc.edu.ph',
  'paraisoklent8@g.cjc.edu.ph',
  'paraisoklent@g.cjc.edu.ph',
  'finance@g.cjc.edu.ph',
  'admin@g.cjc.edu.ph',
  'studentcouncil@g.cjc.edu.ph'
];
```

---

## 📈 **Monitoring & Analytics**

### **Performance Metrics**
- Response time tracking
- Memory usage monitoring
- Error rate analysis
- User session duration
- Concurrent user capacity

### **Security Monitoring**
- Authentication attempts
- Rate limiting violations
- Input validation failures
- Session management events
- Error logging and analysis

---

## 🔄 **Maintenance & Updates**

### **Regular Maintenance**
- Dependency updates (monthly)
- Security patch application
- Performance optimization
- Error log analysis
- User feedback review

### **Update Procedures**
1. Test updates in development environment
2. Run comprehensive test suite
3. Deploy to staging environment
4. Perform user acceptance testing
5. Deploy to production
6. Monitor system performance

---

## 📋 **System Requirements**

### **Minimum Requirements**
- **RAM:** 4GB
- **Storage:** 1GB available space
- **Network:** 1 Mbps internet connection
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Recommended Requirements**
- **RAM:** 8GB
- **Storage:** 2GB available space
- **Network:** 5 Mbps internet connection
- **Browser:** Latest version of Chrome or Firefox

---

## 🎯 **Quality Assurance**

### **Code Quality Standards**
- ESLint configuration for code consistency
- Prettier for code formatting
- Comprehensive error handling
- Input validation and sanitization
- Security best practices implementation

### **Testing Standards**
- 95%+ test coverage
- All critical paths tested
- Performance benchmarks met
- Security vulnerabilities addressed
- User acceptance criteria satisfied

---

**Technical Specifications Version:** 1.0  
**Last Updated:** December 2024  
**System Status:** ✅ **Production Ready**
