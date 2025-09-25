# Google OAuth Testing Checklist

## ✅ **Current Status**
- [x] Google API scripts loaded
- [x] Authentication components created
- [x] OAuth service implemented
- [x] App updated to use authentication
- [ ] Google Cloud Console configured
- [ ] Client ID obtained and added
- [ ] Authorized users list updated
- [ ] System tested with school accounts

## 🔧 **Next Steps**

### **URGENT: Replace Client ID**

1. **Get your Client ID from Google Cloud Console**
2. **Open:** `src/services/authService.js`
3. **Replace line 6:**
   ```javascript
   this.clientId = 'PASTE_YOUR_CLIENT_ID_HERE';
   ```
   With your actual Client ID:
   ```javascript
   this.clientId = '123456789-abcdefgh.apps.googleusercontent.com';
   ```

### **Add Authorized Staff Emails**

Edit `src/services/authService.js` lines 8-14 with real staff emails:
```javascript
this.authorizedUsers = new Set([
  'your.actual.email@cjc.edu.ph',
  'finance.officer@cjc.edu.ph',
  'admin@cjc.edu.ph',
  'staff.member@cjc.edu.ph'
  // Add all staff who can receive payments
]);
```

## 🧪 **Testing Steps**

### **Test 1: Authentication Required**
1. Start your app: `npm start`
2. Open http://localhost:3000
3. **Expected:** Should show login screen, NOT the payment form
4. **If payment form shows:** Authentication not working

### **Test 2: School Domain Restriction**
1. Try signing in with personal Gmail account
2. **Expected:** Should be rejected with domain error
3. **If allowed:** Domain restriction not working

### **Test 3: Authorization Check**
1. Sign in with school account NOT in authorized list
2. **Expected:** Should be rejected with "not authorized" error
3. **If allowed:** Authorization check not working

### **Test 4: Successful Authentication**
1. Sign in with school account that IS in authorized list
2. **Expected:** Should show payment form with your name auto-filled
3. **Check:** "Payment Received By" field shows your authenticated name

### **Test 5: Payment Recording**
1. Fill out a test payment
2. Submit the form
3. **Check:** Google Sheets shows your real name as receiver
4. **Check:** Email confirmation includes your authenticated info

## 🚨 **Troubleshooting**

### **Error: "Google API not loaded"**
- Check if `https://apis.google.com/js/api.js` loads in browser console
- Ensure internet connection is working

### **Error: "Client ID not found"**
- Verify you replaced `PASTE_YOUR_CLIENT_ID_HERE` with real Client ID
- Check Client ID format (should end with `.apps.googleusercontent.com`)

### **Error: "Origin not allowed"**
- Add `http://localhost:3000` to Authorized JavaScript origins in Google Cloud Console
- Make sure URL exactly matches (no trailing slash)

### **Error: "Access denied"**
- Check if your email is in the `authorizedUsers` set
- Verify email domain matches `schoolDomain` setting

## 📋 **Google Cloud Console URLs**

Quick links for your setup:

1. **Project Dashboard:** https://console.cloud.google.com/home/dashboard
2. **OAuth Consent:** https://console.cloud.google.com/apis/credentials/consent
3. **Credentials:** https://console.cloud.google.com/apis/credentials
4. **APIs & Services:** https://console.cloud.google.com/apis/dashboard

## ✅ **Success Indicators**

When everything works correctly:
- ✅ Only school staff can access the system
- ✅ Staff name appears automatically as receiver
- ✅ No way to fake or change receiver identity
- ✅ Complete audit trail in Google Sheets
- ✅ Secure, enterprise-grade authentication

## 🎯 **Final Test**

Try to break the system:
1. Can you access without signing in? ❌ Should be impossible
2. Can you sign in with personal email? ❌ Should be rejected
3. Can you change the receiver name? ❌ Should be locked
4. Can unauthorized staff access? ❌ Should be blocked

If all these are ❌ (impossible), your system is secure! 🔐
















