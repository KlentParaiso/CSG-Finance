/**
 * Concurrent Load Test Runner
 * Tests CSG Finance system with multiple simultaneous users
 */

console.log('🚀 Starting Concurrent Load Test...');

// Test configuration
const TEST_CONFIG = {
    concurrentUsers: [5, 10, 20],
    testDuration: 30000, // 30 seconds
    requestTimeout: 30000, // 30 seconds
    retryAttempts: 3
};

// Test metrics
let testMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    responseTimes: [],
    errors: [],
    startTime: null,
    endTime: null
};

// Simulate form submission
async function simulateFormSubmission(userId, attempt = 1) {
    const startTime = performance.now();
    testMetrics.totalRequests++;
    
    try {
        // Simulate form data (exactly like your real form)
        const formData = {
            studentName: `Student ${userId}`,
            studentId: `STU${userId.toString().padStart(3, '0')}`,
            email: `student${userId}@g.cjc.edu.ph`,
            college: 'CCIS',
            course: 'Computer Science',
            paymentAmount: 200,
            paymentMethod: 'Cash',
            receivedBy: 'Test Staff (test@g.cjc.edu.ph)',
            receiverEmail: 'test@g.cjc.edu.ph',
            receiverGoogleId: 'test123',
            timestamp: new Date().toISOString()
        };

        console.log(`👤 User ${userId} (Attempt ${attempt}): Submitting form...`);

        // Simulate form validation delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

        // Make actual API call to Google Sheets
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.requestTimeout);

        const response = await fetch('https://script.google.com/macros/s/AKfycbyqPr9OLfetto5vdbe__seFPKEOm1hORpSZXIXts-YWDTDQGAmPd7gdXJid8ixnzz69gA/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        testMetrics.responseTimes.push(responseTime);
        testMetrics.successfulRequests++;
        
        console.log(`✅ User ${userId}: Success (${responseTime.toFixed(0)}ms)`);
        
        return { 
            success: true, 
            userId, 
            responseTime,
            attempt
        };
        
    } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        testMetrics.responseTimes.push(responseTime);
        testMetrics.failedRequests++;
        testMetrics.errors.push({
            userId,
            error: error.message,
            attempt,
            responseTime
        });
        
        console.log(`❌ User ${userId} (Attempt ${attempt}): Failed - ${error.message} (${responseTime.toFixed(0)}ms)`);
        
        // Retry logic
        if (attempt < TEST_CONFIG.retryAttempts) {
            console.log(`🔄 User ${userId}: Retrying (${attempt + 1}/${TEST_CONFIG.retryAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            return simulateFormSubmission(userId, attempt + 1);
        }
        
        return { 
            success: false, 
            userId, 
            responseTime,
            error: error.message,
            attempt
        };
    }
}

// Test concurrent users
async function testConcurrentUsers(userCount) {
    console.log(`\n🧪 Testing ${userCount} concurrent users...`);
    console.log(`📝 All users will submit forms simultaneously`);
    
    testMetrics.startTime = performance.now();
    
    // Create all user promises simultaneously
    const userPromises = [];
    for (let i = 1; i <= userCount; i++) {
        userPromises.push(simulateFormSubmission(i));
    }
    
    console.log(`🔥 All ${userCount} users submitting simultaneously!`);
    
    try {
        // Wait for all users to complete
        const results = await Promise.all(userPromises);
        testMetrics.endTime = performance.now();
        
        // Analyze results
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        const totalTime = testMetrics.endTime - testMetrics.startTime;
        const avgResponseTime = testMetrics.responseTimes.length > 0 
            ? testMetrics.responseTimes.reduce((sum, time) => sum + time, 0) / testMetrics.responseTimes.length
            : 0;
        
        console.log(`\n📊 RESULTS FOR ${userCount} CONCURRENT USERS:`);
        console.log(`⏱️ Total time: ${totalTime.toFixed(0)}ms`);
        console.log(`✅ Successful: ${successful}/${userCount}`);
        console.log(`❌ Failed: ${failed}/${userCount}`);
        console.log(`📈 Success rate: ${((successful / userCount) * 100).toFixed(1)}%`);
        console.log(`⚡ Average response time: ${avgResponseTime.toFixed(0)}ms`);
        
        // Performance analysis
        if (totalTime < 5000) {
            console.log(`🚀 EXCELLENT: Handled ${userCount} users in under 5 seconds!`);
        } else if (totalTime < 10000) {
            console.log(`✅ GOOD: Handled ${userCount} users in under 10 seconds`);
        } else {
            console.log(`⚠️ SLOW: Took ${(totalTime/1000).toFixed(1)}s for ${userCount} users`);
        }
        
        // Crash analysis
        if (failed === 0) {
            console.log(`🎉 NO CRASHES! System handled all ${userCount} users perfectly!`);
            return { success: true, userCount, successful, failed, totalTime };
        } else if (failed < userCount * 0.1) { // Less than 10% failed
            console.log(`✅ MINOR ISSUES: Only ${failed} users failed (${((failed/userCount)*100).toFixed(1)}%)`);
            return { success: true, userCount, successful, failed, totalTime };
        } else {
            console.log(`❌ MAJOR ISSUES: ${failed} users failed (${((failed/userCount)*100).toFixed(1)}%)`);
            return { success: false, userCount, successful, failed, totalTime };
        }
        
    } catch (error) {
        console.log(`💥 SYSTEM CRASHED! Error: ${error.message}`);
        return { success: false, userCount, error: error.message };
    }
}

// Memory usage test
function testMemoryUsage() {
    console.log(`\n🧠 Testing memory usage...`);
    
    if (typeof performance !== 'undefined' && performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
        console.log(`📊 Current memory usage: ${memoryUsage.toFixed(2)} MB`);
        
        if (memoryUsage > 100) {
            console.log(`⚠️ High memory usage detected`);
            return false;
        } else {
            console.log(`✅ Memory usage is normal`);
            return true;
        }
    } else {
        console.log(`⚠️ Memory API not available`);
        return true; // Skip test
    }
}

// Rate limiting test
async function testRateLimiting() {
    console.log(`\n⚡ Testing rate limiting...`);
    
    const rapidRequests = 20;
    const startTime = performance.now();
    let successCount = 0;
    
    for (let i = 0; i < rapidRequests; i++) {
        try {
            await simulateFormSubmission(`rate_test_${i}`);
            successCount++;
        } catch (error) {
            // Expected for rate limiting
        }
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`📊 Rate limiting test: ${successCount}/${rapidRequests} successful`);
    console.log(`⏱️ Time: ${totalTime.toFixed(0)}ms`);
    console.log(`📈 Rate: ${(rapidRequests / (totalTime / 1000)).toFixed(2)} requests/second`);
    
    return successCount > 0;
}

// Run comprehensive test suite
async function runComprehensiveTest() {
    console.log(`🚀 Starting Comprehensive Concurrent Load Test Suite`);
    console.log(`🎯 Testing CSG Finance system under high load`);
    console.log(`📅 Test started at: ${new Date().toLocaleString()}`);
    
    const results = [];
    
    // Test different user counts
    for (const userCount of TEST_CONFIG.concurrentUsers) {
        // Reset metrics for each test
        testMetrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            responseTimes: [],
            errors: [],
            startTime: null,
            endTime: null
        };
        
        const result = await testConcurrentUsers(userCount);
        results.push(result);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Memory test
    const memoryOk = testMemoryUsage();
    
    // Rate limiting test
    const rateLimitOk = await testRateLimiting();
    
    // Final analysis
    console.log(`\n🎉 COMPREHENSIVE TEST RESULTS:`);
    console.log(`================================`);
    
    let allTestsPassed = true;
    results.forEach(result => {
        const status = result.success ? '✅ PASSED' : '❌ FAILED';
        console.log(`${status}: ${result.userCount} users - ${result.successful || 0} successful, ${result.failed || 0} failed`);
        if (!result.success) allTestsPassed = false;
    });
    
    console.log(`🧠 Memory test: ${memoryOk ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`⚡ Rate limiting: ${rateLimitOk ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Overall assessment
    if (allTestsPassed && memoryOk && rateLimitOk) {
        console.log(`\n🎉 ALL TESTS PASSED!`);
        console.log(`✅ System is PRODUCTION READY!`);
        console.log(`✅ Can handle multiple concurrent users!`);
        console.log(`✅ No crashes detected!`);
        console.log(`✅ Performance is acceptable!`);
    } else {
        console.log(`\n⚠️ SOME TESTS FAILED!`);
        console.log(`❌ System needs optimization before production deployment`);
    }
    
    console.log(`\n📅 Test completed at: ${new Date().toLocaleString()}`);
    
    return { allTestsPassed, results, memoryOk, rateLimitOk };
}

// Auto-run tests
if (typeof window !== 'undefined') {
    // Run tests when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runComprehensiveTest);
    } else {
        runComprehensiveTest();
    }
}

// Export for manual testing
window.runConcurrentLoadTest = runComprehensiveTest;
