# 📖 CSG Finance - User Manual

## 🎯 **Getting Started**

Welcome to the CSG Finance Fun Run Payment Tracker! This system allows authorized staff to process Fun Run registration payments securely and efficiently.

---

## 🔐 **Authentication**

### **Signing In**

1. **Open the application** in your web browser
2. **Click "Sign in with Google"**
3. **Select your school account** (@g.cjc.edu.ph)
4. **Grant permissions** when prompted
5. **You're now logged in!**

### **Authorized Users**

Only staff with authorized email addresses can access the system:
- `klentparaiso@g.cjc.edu.ph`
- `finance@g.cjc.edu.ph`
- `admin@g.cjc.edu.ph`
- `studentcouncil@g.cjc.edu.ph`

*Contact the administrator to add more authorized users.*

### **Session Management**

- **Automatic login:** You'll stay logged in for 24 hours
- **Browser refresh:** Your session persists across page refreshes
- **Sign out:** Click the sign-out button when finished

---

## 💳 **Processing Payments**

### **Payment Form**

The payment form includes the following fields:

#### **Student Information**
- **Student Name** - Full name of the student
- **Student ID** - Student identification number
- **Email** - Student's email address
- **College** - Select from dropdown:
  - College of Accountancy, Business and Entrepreneurship (CABE)
  - College of Education, Arts and Sciences (CEDAS)
  - College of Health Sciences (CHS)
  - College of Engineering (COE)
  - College of Computing and Information Sciences (CCIS)
- **Course** - Student's course/program

#### **Payment Details**
- **Payment Amount** - Fixed at ₱200.00 (Fun Run registration fee)
- **Payment Method** - Fixed as "Cash" (only payment method accepted)
- **Received By** - Your name (automatically filled)

### **Processing a Payment**

1. **Fill in student information**
   - Enter student's full name
   - Enter student ID (alphanumeric, 3-20 characters)
   - Enter student's email address
   - Select college from dropdown
   - Enter course/program

2. **Verify payment details**
   - Amount is automatically set to ₱200.00
   - Payment method is automatically set to "Cash"

3. **Submit the payment**
   - Click "Record Payment" button
   - Wait for confirmation message
   - Payment is automatically recorded in Google Sheets
   - Email confirmation is sent to the student

### **Form Validation**

The system validates all inputs:
- **Student Name:** Letters, spaces, hyphens, and apostrophes only
- **Student ID:** Alphanumeric characters, hyphens, underscores (3-20 characters)
- **Email:** Valid email format required
- **Course:** Maximum 100 characters

---

## 📊 **System Features**

### **Real-time Processing**
- Payments are recorded immediately in Google Sheets
- Email confirmations are sent automatically
- No manual data entry required

### **Security Features**
- All inputs are sanitized and validated
- Rate limiting prevents abuse (10 submissions per minute)
- Secure authentication with school domain validation
- Session management with automatic cleanup

### **Error Handling**
- Clear error messages for invalid inputs
- Automatic retry for network issues
- Graceful handling of system errors

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Access Denied" Message**
- Ensure you're using a school account (@g.cjc.edu.ph)
- Contact administrator to be added to authorized users list
- Check if your account is properly configured

#### **Form Submission Fails**
- Check your internet connection
- Verify all required fields are filled
- Try refreshing the page and submitting again
- Contact support if issue persists

#### **Email Notifications Not Sent**
- Check student's email address is correct
- Verify Google Apps Script is working
- Check spam folder for confirmation emails

#### **Session Expired**
- Sign out and sign in again
- Clear browser cache if needed
- Ensure cookies are enabled

### **Error Messages**

| Error Message | Solution |
|---------------|----------|
| "Invalid email format" | Enter a valid email address |
| "Student ID format invalid" | Use alphanumeric characters only |
| "Name contains invalid characters" | Use letters, spaces, hyphens, apostrophes only |
| "Too many submissions" | Wait a moment before trying again |
| "Request timed out" | Check internet connection and retry |
| "Authentication error" | Sign out and sign in again |

---

## 📱 **Browser Compatibility**

### **Supported Browsers**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

### **Requirements**
- JavaScript enabled
- Cookies enabled
- Stable internet connection
- Modern browser (last 2 versions)

---

## 🔒 **Security Best Practices**

### **For Staff Users**
- Always sign out when finished
- Don't share your login credentials
- Use only authorized school accounts
- Report any suspicious activity

### **Data Protection**
- All data is encrypted in transit
- Student information is securely stored
- Access is logged and monitored
- Regular security updates applied

---

## 📞 **Support**

### **Getting Help**
1. **Check this manual** for common solutions
2. **Review error messages** for specific guidance
3. **Contact the administrator** for account issues
4. **Report bugs** with detailed error information

### **Contact Information**
- **Administrator:** klentparaiso@g.cjc.edu.ph
- **Finance Team:** finance@g.cjc.edu.ph
- **Technical Support:** Available during business hours

---

## 📋 **Quick Reference**

### **Payment Processing Steps**
1. Sign in with school account
2. Fill student information
3. Verify payment details (₱200 Cash)
4. Click "Record Payment"
5. Wait for confirmation
6. Sign out when finished

### **Important Notes**
- Payment amount is fixed at ₱200.00
- Only cash payments are accepted
- All fields are required
- Email confirmations are sent automatically
- System works best with Chrome browser

---

## 🎉 **You're Ready!**

You now have everything you need to process Fun Run payments efficiently and securely. The system is designed to be user-friendly and reliable for your school's events.

**Happy processing!** 🏃‍♂️💳

---

**Manual Version:** 1.0  
**Last Updated:** December 2024  
**System Status:** ✅ **Production Ready**
