const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllAdminComplaints,
  updateComplaintStatus
} = require('../controllers/adminController');
const { protect, admin, department } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/complaints', protect, department, getAllAdminComplaints);
router.put('/complaints/:id/status', protect, department, updateComplaintStatus);

module.exports = router;
