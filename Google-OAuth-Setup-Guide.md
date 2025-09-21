# Google OAuth Setup Guide for School GSuite Authentication

## Overview
This guide will help you set up Google OAuth authentication so only authorized school staff can access the Fun Run payment system.

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your school administrator account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: "Fun Run Payment Tracker"
   - Organization: Select your school organization
   - Click "Create"

## Step 2: Enable APIs

1. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

2. **Enable Gmail API** (for sending emails)
   - Search for "Gmail API"
   - Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth consent screen**
   - Navigate to "APIs & Services" → "OAuth consent screen"
   - Choose "Internal" (for school domain only)
   - Click "Create"

2. **Fill in App Information**
   - App name: "Fun Run Payment Tracker"
   - User support email: Your admin email
   - Developer contact: Your admin email
   - Authorized domains: Add "g.cjc.edu.ph" (or your school domain)
   - Click "Save and Continue"

3. **Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `../auth/gmail.send` (for sending confirmation emails)
   - Click "Save and Continue"

## Step 4: Create OAuth Credentials

1. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Fun Run Payment System"

2. **Set Authorized URLs**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://localhost:3000` (for HTTPS development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `https://localhost:3000`
     - `https://your-domain.com`

3. **Download Credentials**
   - Click "Create"
   - Copy the "Client ID" (you'll need this)
   - Download the JSON file for backup

## Step 5: Configure Your Application

1. **Update AuthService Configuration**
   
   Edit `src/services/authService.js`:
   ```javascript
   constructor() {
     this.clientId = 'YOUR_ACTUAL_CLIENT_ID_HERE'; // Paste your Client ID
     this.schoolDomain = 'g.cjc.edu.ph'; // Your school domain
     this.authorizedUsers = new Set([
       'staff1@g.cjc.edu.ph',
       'staff2@g.cjc.edu.ph',
       'finance@g.cjc.edu.ph',
       'admin@g.cjc.edu.ph'
       // Add all authorized staff emails here
     ]);
   }
   ```

2. **Update Domain in AuthWrapper**
   
   Edit `src/components/AuthWrapper.js` line that says:
   ```javascript
   Only accounts ending with @g.cjc.edu.ph are authorized
   ```
   Change to your actual domain.

## Step 6: Test the System

1. **Start your application**
   ```bash
   npm start
   ```

2. **Test Authentication**
   - Open http://localhost:3000
   - You should see the authentication screen
   - Click "Sign in with School Account"
   - Use a school email account
   - Verify only authorized users can access

## Step 7: Add Authorized Users

Update the `authorizedUsers` set in `authService.js` with actual staff emails:

```javascript
this.authorizedUsers = new Set([
  'john.doe@g.cjc.edu.ph',
  'jane.smith@g.cjc.edu.ph',
  'finance.office@g.cjc.edu.ph',
  'student.council@g.cjc.edu.ph',
  'admin@g.cjc.edu.ph'
]);
```

## Security Features

### ✅ What This Prevents:
- **Fake Staff Names**: Only real Google accounts can sign in
- **Unauthorized Access**: Only pre-approved emails can access
- **Domain Restrictions**: Only @g.cjc.edu.ph accounts work
- **Session Hijacking**: Google handles secure authentication
- **Manual Manipulation**: No dropdown menus to fake

### ✅ What This Provides:
- **Real Identity Verification**: Uses Google's identity system
- **Audit Trail**: Every action tied to a real Google account
- **Auto-populated Info**: Staff name/email filled automatically
- **Secure Sessions**: Google handles token management
- **Easy Management**: Add/remove users by updating the list

## Production Deployment

For production, make sure to:

1. **Update Authorized Origins**
   - Add your production domain to Google Cloud Console
   - Update the origins in OAuth settings

2. **Environment Variables**
   - Store Client ID in environment variables
   - Don't commit secrets to code

3. **HTTPS Required**
   - Google OAuth requires HTTPS in production
   - Ensure your hosting supports SSL

## Troubleshooting

### Common Issues:

1. **"Access blocked" error**
   - Check if user email is in `authorizedUsers` set
   - Verify domain matches `schoolDomain`

2. **"Origin not allowed" error**
   - Add your domain to Authorized JavaScript origins
   - Make sure URLs match exactly (no trailing slashes)

3. **"Gmail API not enabled" error**
   - Enable Gmail API in Google Cloud Console
   - Add Gmail send scope to OAuth consent

## Benefits of This System

🔐 **Maximum Security**: Uses Google's enterprise-grade authentication
👤 **Real Identity**: No way to fake who received payment
📧 **Integrated Email**: Uses staff's actual email to send confirmations
📊 **Complete Audit**: Every transaction tied to verified staff account
🏫 **School Integration**: Works with existing GSuite infrastructure
🚫 **Zero Manipulation**: Impossible to fake receiver information









