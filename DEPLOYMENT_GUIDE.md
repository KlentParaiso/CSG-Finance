# 🚀 CSG Finance - Deployment Guide

## 📋 **Production Deployment Checklist**

This guide will walk you through deploying your CSG Finance Fun Run Payment Tracker to production.

---

## 🎯 **Pre-Deployment Requirements**

### **1. Google Cloud Console Setup**
- [ ] Google Cloud Project created
- [ ] OAuth 2.0 credentials configured
- [ ] Authorized domains added
- [ ] Redirect URIs configured for production

### **2. Google Apps Script Setup**
- [ ] Apps Script project created
- [ ] Web app deployed with execute permissions
- [ ] Apps Script URL obtained and configured
- [ ] Gmail API enabled for email notifications

### **3. Domain Configuration**
- [ ] Production domain secured (HTTPS required)
- [ ] Google OAuth redirect URIs updated
- [ ] Authorized users list updated

---

## 🔧 **Step-by-Step Deployment**

### **Step 1: Build the Application**

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### **Step 2: Configure Production Settings**

#### **Update Google OAuth Client ID**
Edit `src/components/SecurePaymentApp.js`:
```javascript
const CLIENT_ID = 'your-production-client-id.apps.googleusercontent.com';
```

#### **Update Google Apps Script URL**
Edit `src/services/googleSheetsService.js`:
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_PRODUCTION_SCRIPT_ID/exec';
```

#### **Update Authorized Users**
Edit `src/components/SecurePaymentApp.js`:
```javascript
const authorizedUsers = [
  'klentparaiso@g.cjc.edu.ph',
  'finance@g.cjc.edu.ph',
  'admin@g.cjc.edu.ph',
  'studentcouncil@g.cjc.edu.ph',
  // Add all authorized staff emails
];
```

### **Step 3: Deploy to Hosting Platform**

#### **Option A: Netlify**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

#### **Option B: Vercel**
1. Import your GitHub repository to Vercel
2. Set framework preset to "Create React App"
3. Deploy

#### **Option C: GitHub Pages**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://klentparaiso.github.io/CSG-Finance",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

### **Step 4: Configure Google OAuth for Production**

1. **Go to Google Cloud Console**
2. **Navigate to APIs & Services > Credentials**
3. **Edit your OAuth 2.0 Client ID**
4. **Add Authorized JavaScript origins:**
   - `https://your-domain.com`
   - `https://www.your-domain.com`
5. **Add Authorized redirect URIs:**
   - `https://your-domain.com`
   - `https://your-domain.com/`

### **Step 5: Test Production Deployment**

1. **Open your production URL**
2. **Test authentication** with authorized users
3. **Test form submission** with real data
4. **Verify Google Sheets integration**
5. **Check email notifications**

---

## 🧪 **Production Testing**

### **Run Production Tests**

1. **Open `run-all-tests.html`** in your production environment
2. **Run all test suites** to verify functionality
3. **Check `test-runner.html`** for concurrent load testing
4. **Review test results** and fix any issues

### **Performance Validation**

- ✅ **Response times** < 500ms
- ✅ **Concurrent users** 10+ supported
- ✅ **Memory usage** stable
- ✅ **No crashes** under load
- ✅ **Security features** active

---

## 🛡️ **Security Checklist**

### **Authentication Security**
- [ ] HTTPS enabled
- [ ] Google OAuth properly configured
- [ ] Domain validation working
- [ ] JWT token validation active
- [ ] Session timeout configured (24 hours)

### **Input Security**
- [ ] XSS prevention active
- [ ] Input sanitization working
- [ ] Rate limiting enabled (10 req/min)
- [ ] Data validation functioning
- [ ] Error handling comprehensive

### **Data Security**
- [ ] Google Sheets API secured
- [ ] Email notifications working
- [ ] Data backup configured
- [ ] Access logs enabled

---

## 📊 **Monitoring & Maintenance**

### **Performance Monitoring**
- Monitor response times
- Track concurrent user capacity
- Check memory usage
- Review error logs

### **Security Monitoring**
- Monitor authentication attempts
- Check for suspicious activity
- Review rate limiting logs
- Validate data integrity

### **Regular Maintenance**
- Update dependencies monthly
- Review security reports
- Test system functionality
- Backup Google Sheets data

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Authentication Not Working**
- Check Google OAuth configuration
- Verify domain settings
- Ensure HTTPS is enabled
- Check authorized users list

#### **Form Submission Failing**
- Verify Google Apps Script URL
- Check network connectivity
- Review error logs
- Test with different browsers

#### **Performance Issues**
- Run load tests
- Check server resources
- Review network latency
- Optimize if needed

### **Support Resources**

- Check test reports for detailed analysis
- Review error logs in browser console
- Test with provided test tools
- Contact development team

---

## ✅ **Deployment Verification**

### **Final Checklist**

- [ ] Application loads correctly
- [ ] Authentication works for all authorized users
- [ ] Form submission processes payments
- [ ] Google Sheets integration working
- [ ] Email notifications sent
- [ ] All tests passing
- [ ] Performance metrics acceptable
- [ ] Security features active
- [ ] HTTPS enabled
- [ ] Error handling working

### **Go-Live Approval**

Once all items are checked:
- [ ] **System is production-ready**
- [ ] **All tests passing**
- [ ] **Security validated**
- [ ] **Performance acceptable**
- [ ] **Team trained**

---

## 🎉 **Deployment Complete!**

Your CSG Finance Fun Run Payment Tracker is now live and ready to handle your school's Fun Run event!

### **Next Steps**
1. **Train staff** on system usage
2. **Monitor performance** during initial use
3. **Gather feedback** from users
4. **Plan for future events**

---

**Deployment Status:** ✅ **READY FOR PRODUCTION**  
**System Status:** 🚀 **LIVE AND OPERATIONAL**  
**Support:** 📞 **Available for assistance**
