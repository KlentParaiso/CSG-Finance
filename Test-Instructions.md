# Google Apps Script Testing Guide

## Method 1: Run Test Function

1. **Open your Google Apps Script project**
2. **Select function dropdown** → Choose `testPaymentSystem`
3. **Click Run button** (▶️)
4. **Check the logs** for success messages
5. **Refresh your spreadsheet** to see new tabs created

## Method 2: Manual Test via Script

Add this function to your Google Apps Script and run it:

```javascript
function quickTest() {
  // This creates a simple test entry
  const testData = {
    studentName: "John Doe",
    studentId: "2024001", 
    email: "john@example.com",
    college: "CCIS",
    course: "Computer Science",
    paymentAmount: 250,
    paymentMethod: "GCash",
    timestamp: new Date().toISOString(),
    submittedAt: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
  };
  
  console.log('Testing with:', testData);
  
  try {
    saveToCollegeSheet(testData);
    saveToMasterSheet(testData);
    return "SUCCESS: Check your spreadsheet!";
  } catch (error) {
    return "ERROR: " + error.toString();
  }
}
```

## Method 3: Initialize All Sheets

Run this function to create all department sheets at once:

```javascript
function createAllSheets() {
  const departments = ['CABE', 'CCIS', 'CHS', 'CEDAS', 'COE'];
  
  departments.forEach(dept => {
    console.log(`Creating sheet for ${dept}`);
    getOrCreateCollegeSheet(dept);
  });
  
  console.log('All department sheets created!');
  return 'All sheets created successfully!';
}
```

## What You Should See

After running tests, your spreadsheet should have these tabs:
- ✅ CABE
- ✅ CCIS  
- ✅ CHS
- ✅ CEDAS
- ✅ COE
- ✅ Master Summary

## Troubleshooting

### If you see errors:
1. **Check permissions** - Make sure you authorized the script
2. **Check email** - Update ADMIN_EMAIL in the script
3. **Check deployment** - Ensure web app is deployed with "Anyone" access

### If no sheets are created:
1. Run `initializeSpreadsheet()` function first
2. Check the execution log for error messages
3. Make sure you're looking at the right spreadsheet

### If web form still fails:
1. Copy the correct Web App URL from Deploy > Manage deployments
2. Paste it in `src/services/googleSheetsService.js` replacing the placeholder
3. Make sure the URL ends with `/exec`

## Success Indicators

✅ **Script Test Passes**: No errors in execution log  
✅ **Sheets Created**: All department tabs appear  
✅ **Data Saved**: Test data appears in sheets  
✅ **Web Form Works**: No "Failed to record payment" error  
✅ **Email Sent**: Test email received (if configured)










