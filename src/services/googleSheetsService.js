// Fun Run Payment Tracking Service
// Integrates with Google Sheets via Google Apps Script for automated email notifications

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqPr9OLfetto5vdbe__seFPKEOm1hORpSZXIXts-YWDTDQGAmPd7gdXJid8ixnzz69gA/exec';

export const savePaymentToGoogleSheets = async (paymentData) => {
  try {
    console.log('🔍 Payment data being sent:', paymentData);
    
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      throw new Error('Please configure your Google Apps Script URL in googleSheetsService.js');
    }

    // Validate payment data
    if (!paymentData.studentName || !paymentData.studentId || !paymentData.email || !paymentData.college) {
      throw new Error('Missing required payment data');
    }

    const timestamp = new Date().toISOString();
    const paymentRecord = {
      ...paymentData,
      timestamp,
      submittedAt: new Date().toLocaleString('en-PH', { 
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    
    console.log('📤 Sending to Google Apps Script:', paymentRecord);
    console.log('🔗 Apps Script URL:', APPS_SCRIPT_URL);
    
    // Add retry logic for network issues
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentRecord)
        });

        console.log(`✅ Request sent successfully (attempt ${attempt})`);
        return { success: true };
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
        
        if (attempt < 3) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // All attempts failed
    throw new Error(`Failed to send payment data after 3 attempts. Last error: ${lastError.message}`);
    
  } catch (error) {
    console.error('❌ Error saving payment to Google Sheets:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const saveToGoogleSheetsViaAppsScript = async (studentName) => {
  console.warn('saveToGoogleSheetsViaAppsScript is deprecated. Use savePaymentToGoogleSheets instead.');
  return savePaymentToGoogleSheets({
    studentName,
    studentId: '',
    email: '',
    college: '',
    course: '',
    paymentAmount: 0,
    paymentMethod: 'Cash'
  });
};
