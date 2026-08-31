const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getUserComplaints,
  getComplaintById,
  trackComplaint,
  upvoteComplaint,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllComplaints);
router.get('/user', protect, getUserComplaints);
router.get('/track/:searchId', trackComplaint);
router.get('/:id', getComplaintById);

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), createComplaint);
router.put('/:id/upvote', protect, upvoteComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
