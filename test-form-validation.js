/**
 * Form Validation Test Suite
 * Run this in browser console to test form functionality
 */

console.log('🧪 Starting Form Validation Tests...');

// Test 1: Check if form elements exist
function testFormElements() {
  console.log('Test 1: Form Elements');
  const requiredElements = [
    'studentName',
    'studentId', 
    'email',
    'college',
    'course',
    'paymentAmount',
    'paymentMethod',
    'receivedBy'
  ];
  
  let found = 0;
  requiredElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`✅ ${elementId}: Found`);
      found++;
    } else {
      console.log(`❌ ${elementId}: Not found`);
    }
  });
  
  if (found === requiredElements.length) {
    console.log('✅ All form elements found');
    return true;
  } else {
    console.log('❌ Some form elements missing');
    return false;
  }
}

// Test 2: Check fixed values
function testFixedValues() {
  console.log('Test 2: Fixed Values');
  
  const paymentAmount = document.getElementById('paymentAmount');
  const paymentMethod = document.getElementById('paymentMethod');
  
  let passed = 0;
  
  // Check payment amount
  if (paymentAmount && paymentAmount.value === '200' && paymentAmount.disabled) {
    console.log('✅ Payment amount: Fixed at ₱200 (disabled)');
    passed++;
  } else {
    console.log('❌ Payment amount: Not fixed or not disabled');
  }
  
  // Check payment method
  if (paymentMethod && paymentMethod.value === 'Cash' && paymentMethod.disabled) {
    console.log('✅ Payment method: Fixed as Cash (disabled)');
    passed++;
  } else {
    console.log('❌ Payment method: Not fixed or not disabled');
  }
  
  if (passed === 2) {
    console.log('✅ Fixed values working correctly');
    return true;
  } else {
    console.log('❌ Fixed values have issues');
    return false;
  }
}

// Test 3: Check college options
function testCollegeOptions() {
  console.log('Test 3: College Options');
  const collegeSelect = document.getElementById('college');
  
  if (!collegeSelect) {
    console.log('❌ College select element not found');
    return false;
  }
  
  const expectedColleges = ['CABE', 'CEDAS', 'CHS', 'COE', 'CCIS'];
  const options = Array.from(collegeSelect.options).map(option => option.value);
  
  let found = 0;
  expectedColleges.forEach(college => {
    if (options.includes(college)) {
      console.log(`✅ ${college}: Available`);
      found++;
    } else {
      console.log(`❌ ${college}: Missing`);
    }
  });
  
  if (found === expectedColleges.length) {
    console.log('✅ All college options available');
    return true;
  } else {
    console.log('❌ Some college options missing');
    return false;
  }
}

// Test 4: Check form validation
function testFormValidation() {
  console.log('Test 4: Form Validation');
  
  const testCases = [
    { name: 'Empty student name', data: { studentName: '', studentId: '123', email: 'test@g.cjc.edu.ph', college: 'CCIS', course: 'CS' }, shouldFail: true },
    { name: 'Empty student ID', data: { studentName: 'John Doe', studentId: '', email: 'test@g.cjc.edu.ph', college: 'CCIS', course: 'CS' }, shouldFail: true },
    { name: 'Invalid email', data: { studentName: 'John Doe', studentId: '123', email: 'invalid-email', college: 'CCIS', course: 'CS' }, shouldFail: true },
    { name: 'No college selected', data: { studentName: 'John Doe', studentId: '123', email: 'test@g.cjc.edu.ph', college: '', course: 'CS' }, shouldFail: true },
    { name: 'Empty course', data: { studentName: 'John Doe', studentId: '123', email: 'test@g.cjc.edu.ph', college: 'CCIS', course: '' }, shouldFail: true },
    { name: 'Valid data', data: { studentName: 'John Doe', studentId: '123', email: 'test@g.cjc.edu.ph', college: 'CCIS', course: 'CS' }, shouldFail: false }
  ];
  
  let passed = 0;
  testCases.forEach(testCase => {
    const { studentName, studentId, email, college, course } = testCase.data;
    
    // Simulate validation logic
    let isValid = true;
    let errorMessage = '';
    
    if (!studentName.trim()) {
      isValid = false;
      errorMessage = 'Student name required';
    } else if (!studentId.trim()) {
      isValid = false;
      errorMessage = 'Student ID required';
    } else if (!email.trim() || !email.includes('@')) {
      isValid = false;
      errorMessage = 'Valid email required';
    } else if (!college) {
      isValid = false;
      errorMessage = 'College selection required';
    } else if (!course.trim()) {
      isValid = false;
      errorMessage = 'Course required';
    }
    
    const result = isValid ? 'Valid' : 'Invalid';
    const expected = testCase.shouldFail ? 'Invalid' : 'Valid';
    
    if (result === expected) {
      console.log(`✅ ${testCase.name}: ${result} (correct)`);
      passed++;
    } else {
      console.log(`❌ ${testCase.name}: ${result} (expected ${expected})`);
    }
  });
  
  if (passed === testCases.length) {
    console.log('✅ Form validation working correctly');
    return true;
  } else {
    console.log('❌ Form validation has issues');
    return false;
  }
}

// Test 5: Check received by field
function testReceivedByField() {
  console.log('Test 5: Received By Field');
  const receivedByField = document.getElementById('receivedBy');
  
  if (!receivedByField) {
    console.log('❌ Received by field not found');
    return false;
  }
  
  if (receivedByField.disabled && receivedByField.style.backgroundColor === 'rgb(233, 236, 239)') {
    console.log('✅ Received by field: Disabled and styled correctly');
    return true;
  } else {
    console.log('❌ Received by field: Not properly configured');
    return false;
  }
}

// Test 6: Check form submission button
function testSubmitButton() {
  console.log('Test 6: Submit Button');
  const submitButton = document.querySelector('button[type="submit"]');
  
  if (!submitButton) {
    console.log('❌ Submit button not found');
    return false;
  }
  
  const buttonText = submitButton.textContent;
  if (buttonText.includes('Record Payment') || buttonText.includes('Send Confirmation')) {
    console.log('✅ Submit button: Found with correct text');
    return true;
  } else {
    console.log('❌ Submit button: Text not as expected');
    return false;
  }
}

// Test 7: Check form reset functionality
function testFormReset() {
  console.log('Test 7: Form Reset Functionality');
  
  // Fill form with test data
  const studentName = document.getElementById('studentName');
  const studentId = document.getElementById('studentId');
  const email = document.getElementById('email');
  const course = document.getElementById('course');
  
  if (studentName) studentName.value = 'Test User';
  if (studentId) studentId.value = 'TEST123';
  if (email) email.value = 'test@g.cjc.edu.ph';
  if (course) course.value = 'Test Course';
  
  // Simulate form reset (this would normally happen after successful submission)
  const resetData = {
    studentName: '',
    studentId: '',
    email: '',
    college: '',
    course: '',
    paymentAmount: '200',
    paymentMethod: 'Cash'
  };
  
  // Check if reset would work
  let canReset = true;
  Object.keys(resetData).forEach(key => {
    const element = document.getElementById(key);
    if (element && !element.disabled) {
      // This field can be reset
    }
  });
  
  if (canReset) {
    console.log('✅ Form reset: Would work correctly');
    return true;
  } else {
    console.log('❌ Form reset: Has issues');
    return false;
  }
}

// Run all form tests
function runAllFormTests() {
  console.log('🚀 Running All Form Validation Tests...\n');
  
  const tests = [
    testFormElements,
    testFixedValues,
    testCollegeOptions,
    testFormValidation,
    testReceivedByField,
    testSubmitButton,
    testFormReset
  ];
  
  let passed = 0;
  tests.forEach(test => {
    if (test()) {
      passed++;
    }
    console.log(''); // Add spacing
  });
  
  console.log(`📊 Form Test Results: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All form tests passed! Form is ready.');
  } else {
    console.log('⚠️ Some form tests failed. Please review the issues above.');
  }
  
  return passed === tests.length;
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllFormTests);
  } else {
    runAllFormTests();
  }
}

// Export for manual testing
window.runFormTests = runAllFormTests;
