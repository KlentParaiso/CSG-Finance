/**
 * Fun Run Payment Tracker - Google Apps Script
 * 
 * This script automatically creates separate sheets for each department:
 * - CABE (College of Agriculture, Business and Entrepreneurship)
 * - CCIS (College of Computing and Information Sciences) 
 * - CHS (College of Health Sciences)
 * - CEDAS (College of Education, Arts and Sciences)
 * - COE (College of Engineering)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire script
 * 4. Update ADMIN_EMAIL below with your email address
 * 5. Save the project
 * 6. Deploy as Web App with "Anyone" access
 * 7. Copy the web app URL to your React app
 */

// ========== CONFIGURATION ==========
const ADMIN_EMAIL = "klentparaiso@g.cjc.edu.ph";

// Department configuration
const DEPARTMENTS = {
  'CABE': 'College of Accountancy, Business and Entrepreneurship (CABE)',
  'CEDAS': 'College of Education, Arts and Sciences (CEDAS)',
  'CHS': 'College of Health Sciences (CHS)',
  'COE': 'College of Engineering (COE)',
  'CCIS': 'College of Computing and Information Sciences (CCIS)'
};

/**
 * Main function that handles incoming payment data
 */
function doPost(e) {
  try {
    console.log('Received POST request');
    
    // Check if postData exists (this happens when called from web)
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No POST data received. This function should be called via web request, not manually.');
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log('Payment data received:', data);
    
    // Validate required fields
    if (!data.studentName || !data.college || !data.paymentAmount) {
      throw new Error('Missing required fields: studentName, college, or paymentAmount');
    }
    
    // Save to department-specific sheet
    saveToCollegeSheet(data);
    
    // Save to master summary
    saveToMasterSheet(data);
    
    // Send email confirmation
    sendEmailConfirmation(data);
    
    // Send admin notification (if email is configured)
    if (ADMIN_EMAIL && ADMIN_EMAIL !== "your-admin@email.com") {
      sendAdminNotification(data);
    }
    
    console.log('Payment processed successfully');
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Payment recorded successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing payment:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Creates or gets a sheet for the specific college department
 */
function getOrCreateCollegeSheet(collegeName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(collegeName);
  
  if (!sheet) {
    console.log(`Creating new sheet for ${collegeName}`);
    sheet = spreadsheet.insertSheet(collegeName);
    
    // Add headers
    const headers = [
      'Timestamp',
      'Student Name', 
      'Student ID',
      'Email',
      'College',
      'Course/Program',
      'Payment Amount (₱)',
      'Payment Method',
      'Received By',
      'Receiver Email',
      'Date Submitted'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

/**
 * Saves payment data to the college-specific sheet
 */
function saveToCollegeSheet(data) {
  const sheet = getOrCreateCollegeSheet(data.college);
  
  const row = [
    data.timestamp || new Date().toISOString(),
    data.studentName,
    data.studentId,
    data.email,
    data.college,
    data.course,
    data.paymentAmount,
    data.paymentMethod,
    data.receivedBy || 'Not specified',
    data.receiverEmail || 'Not specified',
    data.submittedAt || new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
  ];
  
  sheet.appendRow(row);
  console.log(`Data saved to ${data.college} sheet`);
}

/**
 * Saves payment data to master summary sheet
 */
function saveToMasterSheet(data) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let masterSheet = spreadsheet.getSheetByName('Master Summary');
  
  if (!masterSheet) {
    console.log('Creating Master Summary sheet');
    masterSheet = spreadsheet.insertSheet('Master Summary');
    
    // Add headers
    const headers = [
      'Timestamp',
      'Student Name',
      'Student ID', 
      'Email',
      'College',
      'Course/Program',
      'Payment Amount (₱)',
      'Payment Method',
      'Received By',
      'Receiver Email',
      'Date Submitted'
    ];
    
    masterSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = masterSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2196F3');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    
    // Auto-resize columns
    masterSheet.autoResizeColumns(1, headers.length);
  }
  
  const row = [
    data.timestamp || new Date().toISOString(),
    data.studentName,
    data.studentId,
    data.email,
    data.college,
    data.course,
    data.paymentAmount,
    data.paymentMethod,
    data.receivedBy || 'Not specified',
    data.receiverEmail || 'Not specified',
    data.submittedAt || new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
  ];
  
  masterSheet.appendRow(row);
  console.log('Data saved to Master Summary sheet');
}

/**
 * Sends email confirmation to student
 * Note: Gmail API can't send from different users in Apps Script
 * But we make it clear who the actual sender/receiver is
 */
function sendEmailConfirmation(data) {
  try {
    const subject = "Fun Run Payment Confirmation";
    
    // Extract staff name from receivedBy field (remove email part if present)
    const staffName = data.receivedBy ? data.receivedBy.split('(')[0].trim() : 'Staff Member';
    const staffEmail = data.receiverEmail || 'Not specified';
    
    const body = `
Dear ${data.studentName},

Thank you for your payment towards the Fun Run event! 🏃‍♂️

PAYMENT CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Student Name: ${data.studentName}
🆔 Student ID: ${data.studentId}
🏛️ College: ${DEPARTMENTS[data.college] || data.college}
📚 Course/Program: ${data.course}
💰 Payment Amount: ₱${parseFloat(data.paymentAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
💳 Payment Method: ${data.paymentMethod}
📅 Date & Time: ${data.submittedAt || new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
✅ Received by: ${staffName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 You have successfully paid ₱${parseFloat(data.paymentAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })} for the Fun Run event!

Your payment has been personally received and verified by ${staffName}. You are now officially registered for the event. Please keep this email as your confirmation receipt. 📧

If you have any questions about your payment, please contact ${staffName} at ${staffEmail}.

Thank you for your participation in the Fun Run event! 🏃‍♀️💨

Best regards,
${staffName}
Payment Receiver & Verifier
    `.trim();
    
    // Send email with clear identification of who received the payment
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: body,
      replyTo: staffEmail,
      name: `Fun Run Payment System (via ${staffName})`
    });
    
    console.log(`Email confirmation sent to ${data.email} on behalf of ${staffName} (${staffEmail})`);
    
  } catch (error) {
    console.error('Error sending email confirmation:', error);
    // Don't throw error here to avoid failing the main transaction
  }
}

/**
 * Sends notification to admin
 */
function sendAdminNotification(data) {
  try {
    const subject = `New Fun Run Payment: ${data.studentName} (${data.college})`;
    
    const body = `
New payment received for Fun Run event:

Student: ${data.studentName} (${data.studentId})
College: ${DEPARTMENTS[data.college] || data.college}
Course: ${data.course}
Amount: ₱${parseFloat(data.paymentAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
Method: ${data.paymentMethod}
Received By: ${data.receivedBy || 'Not specified'}
Email: ${data.email}
Time: ${data.submittedAt || new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}

View spreadsheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
    `.trim();
    
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      body: body
    });
    
    console.log(`Admin notification sent to ${ADMIN_EMAIL}`);
    
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Creates payment statistics by department
 */
function createPaymentStatistics() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let statsSheet = spreadsheet.getSheetByName('Payment Statistics');
  
  if (!statsSheet) {
    statsSheet = spreadsheet.insertSheet('Payment Statistics');
  } else {
    statsSheet.clear();
  }
  
  // Headers
  const headers = ['Department', 'Total Students', 'Total Amount (₱)', 'Average Payment (₱)'];
  statsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = statsSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#FF9800');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  let grandTotal = 0;
  let grandStudentCount = 0;
  let row = 2;
  
  // Process each department
  Object.keys(DEPARTMENTS).forEach(dept => {
    const sheet = spreadsheet.getSheetByName(dept);
    
    if (sheet && sheet.getLastRow() > 1) {
      // Get payment amounts (column 7)
      const dataRange = sheet.getRange(2, 7, sheet.getLastRow() - 1, 1);
      const amounts = dataRange.getValues().flat().filter(amount => amount !== '' && !isNaN(amount));
      
      const studentCount = amounts.length;
      const totalAmount = amounts.reduce((sum, amount) => sum + parseFloat(amount), 0);
      const averageAmount = studentCount > 0 ? totalAmount / studentCount : 0;
      
      statsSheet.getRange(row, 1, 1, 4).setValues([[
        DEPARTMENTS[dept],
        studentCount,
        totalAmount.toFixed(2),
        averageAmount.toFixed(2)
      ]]);
      
      grandTotal += totalAmount;
      grandStudentCount += studentCount;
    } else {
      statsSheet.getRange(row, 1, 1, 4).setValues([[
        DEPARTMENTS[dept],
        0,
        '0.00',
        '0.00'
      ]]);
    }
    row++;
  });
  
  // Add grand totals
  const grandAverage = grandStudentCount > 0 ? grandTotal / grandStudentCount : 0;
  statsSheet.getRange(row + 1, 1, 1, 4).setValues([['GRAND TOTAL', grandStudentCount, grandTotal.toFixed(2), grandAverage.toFixed(2)]]);
  
  // Format totals row
  const totalRange = statsSheet.getRange(row + 1, 1, 1, 4);
  totalRange.setBackground('#FFC107');
  totalRange.setFontWeight('bold');
  
  // Auto-resize columns
  statsSheet.autoResizeColumns(1, 4);
  
  console.log('Payment statistics updated');
  return 'Payment statistics created successfully!';
}

/**
 * Test function - run this to verify everything works
 */
function testPaymentSystem() {
  const testData = {
    studentName: "Test Student",
    studentId: "TEST123",
    email: "test@example.com",
    college: "CCIS",
    course: "Computer Science",
    paymentAmount: 500.00,
    paymentMethod: "Cash",
    receivedBy: "Mr. Mark Santos - CCIS Representative",
    timestamp: new Date().toISOString(),
    submittedAt: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
  };
  
  console.log('Running test with data:', testData);
  
  try {
    saveToCollegeSheet(testData);
    saveToMasterSheet(testData);
    console.log('✅ Test payment saved successfully');
    
    // Test email (comment out to avoid sending test emails)
    // sendEmailConfirmation(testData);
    
    return "✅ Test completed successfully! Check your spreadsheet for the test data.";
  } catch (error) {
    console.error('❌ Test failed:', error);
    return "❌ Test failed: " + error.toString();
  }
}

/**
 * Initialize the spreadsheet with basic setup
 */
function initializeSpreadsheet() {
  console.log('Initializing spreadsheet...');
  
  // Create test data for each department
  const departments = Object.keys(DEPARTMENTS);
  departments.forEach(dept => {
    getOrCreateCollegeSheet(dept);
  });
  
  // Create master summary sheet
  saveToMasterSheet({
    studentName: "Setup Complete",
    studentId: "SETUP",
    email: "admin@example.com",
    college: "CCIS",
    course: "Initial Setup",
    paymentAmount: 0,
    paymentMethod: "System",
    timestamp: new Date().toISOString(),
    submittedAt: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
  });
  
  console.log('Spreadsheet initialization complete');
  return 'Spreadsheet initialized with all department sheets!';
}
