// Automated Integration Test Suite for SmartCivic Backend APIs
const http = require('http');
const app = require('../server');

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('\n==================================================');
  console.log('[TEST SUITE] RUNNING AUTOMATED BACKEND TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(` [PASS] ${title}`);
      passed++;
    } else {
      console.error(` [FAIL] ${title}`);
      failed++;
    }
  };

  try {
    // Wait 1 sec for server readiness
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Health Check
    const resHealth = await request('/api/health');
    assert(resHealth.status === 200 && resHealth.body.status === 'OK', 'GET /api/health should return 200 OK');

    // Test 2: User Registration
    const testEmail = `test_user_${Date.now()}@example.com`;
    const resReg = await request('/api/users/register', 'POST', {
      fullName: 'Test Citizen',
      email: testEmail,
      password: 'password123',
      mobile: '+91 99887 76655'
    });
    assert(resReg.status === 201 && resReg.body.token, 'POST /api/users/register should create user & return JWT token');
    const userToken = resReg.body.token;

    // Test 3: User Login (PPT Specification)
    const resLogin = await request('/api/users/login', 'POST', {
      email: testEmail,
      password: 'password123'
    });
    assert(resLogin.status === 200 && resLogin.body.token, 'POST /api/users/login should verify password and return JWT token');

    // Test 4: Get Profile (Protected API)
    const resMe = await request('/api/users/me', 'GET', null, userToken);
    assert(resMe.status === 200 && resMe.body.user.email === testEmail, 'GET /api/users/me should return user details with Bearer token');

    // Test 5: Create Complaint
    const resComplaint = await request('/api/complaints', 'POST', {
      title: 'Broken Pothole on 10th Cross',
      category: 'Roads & Potholes',
      priority: 'High',
      description: 'Deep road hazard reported during automated API testing.',
      location: '12.9716°N, 77.5946°E — Indiranagar'
    }, userToken);
    assert(resComplaint.status === 201 && resComplaint.body.complaint.ticketId, 'POST /api/complaints should submit ticket & execute AI triage');
    const ticketId = resComplaint.body.complaint.ticketId;

    // Test 6: Track Complaint
    const resTrack = await request(`/api/complaints/track/${ticketId}`);
    assert(resTrack.status === 200 && resTrack.body.ticketId === ticketId, 'GET /api/complaints/track/:id should return live status');

    // Test 7: Get All Complaints
    const resAll = await request('/api/complaints');
    assert(resAll.status === 200 && Array.isArray(resAll.body), 'GET /api/complaints should return array of complaints');

    // Test 8: Admin Login & Protected Stats
    const adminReg = await request('/api/users/register', 'POST', {
      fullName: 'System Admin',
      email: `admin_${Date.now()}@smartcivic.gov.in`,
      password: 'adminpassword123'
    });
    const adminToken = adminReg.body.token;

    // Upgrade user role to admin in memory for test
    const User = require('../models/User');
    await User.findByIdAndUpdate(adminReg.body.user._id, { role: 'admin' });

    const resStats = await request('/api/admin/stats', 'GET', null, adminToken);
    assert(resStats.status === 200 && typeof resStats.body.total === 'number', 'GET /api/admin/stats should return dashboard statistics for Admin');

    console.log('\n==================================================');
    console.log(`[TEST RESULTS] ${passed} PASSED | ${failed} FAILED`);
    console.log('==================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution exception:', error);
    process.exit(1);
  }
};

runTests();
