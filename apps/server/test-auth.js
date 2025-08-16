#!/usr/bin/env bun

/**
 * Simple test script for the authentication system
 * Run with: bun test-auth.js
 */

const BASE_URL = 'http://localhost:3001';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

let authToken = '';

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const data = await response.json();
  return { status: response.status, data };
}

// Test 1: User Registration
async function testRegistration() {
  console.log('\n🧪 Testing User Registration...');

  const { status, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  if (status === 201 && data.success) {
    console.log('✅ Registration successful');
    authToken = data.data.token;
    return true;
  } else {
    console.log('❌ Registration failed:', data.message);
    return false;
  }
}

// Test 2: User Login
async function testLogin() {
  console.log('\n🧪 Testing User Login...');

  const { status, data } = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });

  if (status === 200 && data.success) {
    console.log('✅ Login successful');
    authToken = data.data.token;
    return true;
  } else {
    console.log('❌ Login failed:', data.message);
    return false;
  }
}

// Test 3: Get User Profile (Protected Route)
async function testGetProfile() {
  console.log('\n🧪 Testing Get User Profile (Protected Route)...');

  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }

  const { status, data } = await makeRequest(`${BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (status === 200 && data.success) {
    console.log('✅ Profile retrieved successfully');
    console.log('   User:', data.data.name);
    console.log('   Role:', data.data.role);
    return true;
  } else {
    console.log('❌ Profile retrieval failed:', data.message);
    return false;
  }
}

// Test 4: Health Check
async function testHealthCheck() {
  console.log('\n🧪 Testing Health Check...');

  const { status, data } = await makeRequest(`${BASE_URL}/health`);

  if (status === 200) {
    console.log('✅ Health check successful');
    return true;
  } else {
    console.log('❌ Health check failed');
    return false;
  }
}

// Test 5: Invalid Token Access
async function testInvalidToken() {
  console.log('\n🧪 Testing Invalid Token Access...');

  const { status, data } = await makeRequest(`${BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid_token_here'
    }
  });

  if (status === 401) {
    console.log('✅ Invalid token properly rejected');
    return true;
  } else {
    console.log('❌ Invalid token not properly rejected');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Authentication System Tests...');
  console.log(`📍 Testing against: ${BASE_URL}`);

  const tests = [
    testHealthCheck,
    testRegistration,
    testLogin,
    testGetProfile,
    testInvalidToken
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ Test failed with error:`, error.message);
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
}

// Run tests if this file is executed directly
if (import.meta.main) {
  runTests().catch(console.error);
}
