const axios = require('axios');

async function runHealthCheck() {
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    console.log(`🚀 Starting OMEGA BLACK Health Check: ${baseUrl}`);

    const endpoints = [
        { name: 'Root API', path: '/', expected: 200 },
        { name: 'Health Endpoint', path: '/health', expected: 200 },
        { name: 'Target List', path: '/api/targets', expected: 401 }, // Expect 401 if unauthenticated
    ];

    let successCount = 0;

    for (const endpoint of endpoints) {
        try {
            const response = await axios.get(`${baseUrl}${endpoint.path}`, { timeout: 5000 });
            if (response.status === endpoint.expected) {
                console.log(`✅ ${endpoint.name} [PASSED]`);
                successCount++;
            } else {
                console.log(`❌ ${endpoint.name} [FAILED] - Status: ${response.status}`);
            }
        } catch (error) {
            if (error.response && error.response.status === endpoint.expected) {
                console.log(`✅ ${endpoint.name} [PASSED] (Expected Result: ${error.response.status})`);
                successCount++;
            } else {
                console.log(`❌ ${endpoint.name} [FAILED] - ${error.message}`);
            }
        }
    }

    console.log('\n--- Verification Summary ---');
    console.log(`Passed: ${successCount}/${endpoints.length}`);

    if (successCount === endpoints.length) {
        console.log('💚 OMEGA BLACK Scaffold is Healthy and Ready for Push.');
    } else {
        console.log('⚠️ Some components are unreachable. Check your local environment.');
    }
}

runHealthCheck();
