const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get dashboard statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const assigned = await Complaint.countDocuments({ status: 'Assigned' });

    const categories = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const resolutionPct = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      assigned,
      resolutionPct,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints with full admin details
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllAdminComplaints = async (req, res) => {
  try {
    const { status, category, department, priority, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (department) query.department = department;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { ticketId: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { reportedBy: new RegExp(search, 'i') }
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status & timeline (Admin / Officer action)
// @route   PUT /api/admin/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedOfficer, officerRole, remark, department } = req.body;

    const complaint = await Complaint.findOne({
      $or: [{ ticketId: req.params.id }, { _id: req.params.id }]
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
    if (officerRole) complaint.officerRole = officerRole;
    if (department) complaint.department = department;

    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    // Update timeline stages
    complaint.timeline = complaint.timeline.map(item => {
      if (item.status === status) {
        return {
          ...item,
          time: nowStr,
          note: remark || `Status updated to ${status} by ${req.user ? req.user.name : 'Municipal Officer'}.`,
          done: true
        };
      }
      return item;
    });

    await complaint.save();

    // Send notification to user
    await Notification.create({
      ticketId: complaint.ticketId,
      title: `${complaint.ticketId} ${status}`,
      message: remark || `Your complaint status has been updated to ${status}.`,
      time: 'Just now',
      unread: true,
      isNew: true,
      user: complaint.createdBy
    });

    res.json({
      message: `Complaint status updated to ${status} successfully`,
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllAdminComplaints,
  updateComplaintStatus
};
