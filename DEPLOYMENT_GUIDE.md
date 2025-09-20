# 🚀 CSG Finance - Deployment Guide

## 📋 **Production Deployment Checklist**

This guide will help you deploy your CSG Finance Fun Run Payment Tracker to production.

## 🎯 **Pre-Deployment Requirements**

### **1. Google Cloud Console Setup**
- [ ] Google Cloud Project created
- [ ] OAuth 2.0 credentials configured
- [ ] Authorized redirect URIs added
- [ ] Client ID obtained

### **2. Google Apps Script Setup**
- [ ] Apps Script project created
- [ ] Web app deployed with execute permissions
- [ ] Apps Script URL obtained
- [ ] Gmail API enabled

### **3. Domain Configuration**
- [ ] Production domain ready
- [ ] HTTPS enabled
- [ ] SSL certificate valid

## 🔧 **Step-by-Step Deployment**

### **Step 1: Build the Application**

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

### **Step 2: Configure Environment Variables**

Update the following in your production environment:

1. **Google OAuth Client ID** in `src/components/SecurePaymentApp.js`
2. **Google Apps Script URL** in `src/services/googleSheetsService.js`
3. **Authorized Users List** in `src/components/SecurePaymentApp.js`

### **Step 3: Deploy to Hosting Platform**

#### **Option A: Netlify (Recommended)**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

#### **Option B: Vercel**
1. Import project from GitHub
2. Set framework: React
3. Deploy automatically

#### **Option C: GitHub Pages**
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for deployment
3. Set source to GitHub Actions

### **Step 4: Update Google OAuth Settings**

1. Go to Google Cloud Console
2. Navigate to OAuth 2.0 credentials
3. Add your production domain to authorized origins
4. Add redirect URIs for your domain

### **Step 5: Test Production Deployment**

1. **Authentication Test**
   - [ ] Google OAuth works
   - [ ] School domain validation works
   - [ ] Authorized users can access

2. **Form Submission Test**
   - [ ] Payment form loads correctly
   - [ ] Form validation works
   - [ ] Data saves to Google Sheets
   - [ ] Email confirmations sent

3. **Performance Test**
   - [ ] Page loads quickly
   - [ ] Multiple users can access simultaneously
   - [ ] No crashes under load

## 🛡️ **Security Configuration**

### **Production Security Checklist**
- [ ] HTTPS enabled
- [ ] Google OAuth properly configured
- [ ] Authorized users list updated
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Error handling functional

### **Environment Variables**
```bash
# Production environment variables
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_APPS_SCRIPT_URL=your_apps_script_url
```

## 📊 **Monitoring and Maintenance**

### **Post-Deployment Monitoring**
1. **Check Error Logs**
   - Monitor browser console for errors
   - Check server logs if applicable

2. **Performance Monitoring**
   - Monitor page load times
   - Check response times
   - Monitor memory usage

3. **User Feedback**
   - Collect staff feedback
   - Monitor usage patterns
   - Address any issues quickly

### **Regular Maintenance**
- [ ] Update dependencies monthly
- [ ] Review security settings quarterly
- [ ] Test functionality before major events
- [ ] Backup Google Sheets data regularly

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Authentication Not Working**
- Check Google OAuth configuration
- Verify authorized domains
- Check client ID is correct

#### **Form Submissions Failing**
- Verify Apps Script URL
- Check Google Sheets permissions
- Test network connectivity

#### **Performance Issues**
- Check hosting platform limits
- Monitor concurrent users
- Review error logs

### **Emergency Procedures**
1. **System Down**
   - Check hosting platform status
   - Verify domain configuration
   - Contact support if needed

2. **Data Issues**
   - Check Google Sheets access
   - Verify Apps Script deployment
   - Review error logs

## 📞 **Support Resources**

- **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com)
- **Google Apps Script:** [script.google.com](https://script.google.com)
- **Netlify Support:** [docs.netlify.com](https://docs.netlify.com)
- **Vercel Support:** [vercel.com/docs](https://vercel.com/docs)

## ✅ **Deployment Complete**

Once all steps are completed:

1. **Test thoroughly** with multiple users
2. **Train staff** on the new system
3. **Monitor performance** during initial use
4. **Collect feedback** and make improvements

---

**Your CSG Finance system is now live and ready for your Fun Run event!** 🎉
