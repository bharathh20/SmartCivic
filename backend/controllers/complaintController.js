const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { triageComplaint } = require('../services/triageService');

// @desc    Create a new civic complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const { title, category, priority, description, location, images, latitude, longitude } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Please provide title, description and location' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `SC-2026-${randomNum}`;

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Execute Automated AI Triage logic from PPT specification
    const triageResult = triageComplaint(category || 'Roads & Potholes', priority || 'Medium', ticketId, dateStr);

    let attachedImages = [];
    if (req.files) {
      if (Array.isArray(req.files) && req.files.length > 0) {
        attachedImages = req.files.map(f => `/uploads/${f.filename}`);
      } else if (typeof req.files === 'object') {
        if (req.files.image && req.files.image.length > 0) {
          attachedImages.push(`/uploads/${req.files.image[0].filename}`);
        }
        if (req.files.images && req.files.images.length > 0) {
          req.files.images.forEach(f => attachedImages.push(`/uploads/${f.filename}`));
        }
      }
    }
    if (attachedImages.length === 0 && images && Array.isArray(images) && images.length > 0) {
      attachedImages = images;
    }
    if (attachedImages.length === 0) {
      attachedImages = ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'];
    }

    const complaint = await Complaint.create({
      ticketId,
      title,
      category: category || 'Roads & Potholes',
      priority: priority || 'Medium',
      department: triageResult.department,
      status: 'Submitted',
      date: dateStr,
      time: timeStr,
      estResolution: triageResult.estResolution,
      assignedOfficer: triageResult.assignedOfficer,
      officerRole: triageResult.officerRole,
      location,
      address: location,
      latitude: latitude ? parseFloat(latitude) : 12.9716,
      longitude: longitude ? parseFloat(longitude) : 77.5946,
      description,
      images: attachedImages,
      timeline: triageResult.timeline,
      createdBy: req.user ? req.user._id : null,
      reportedBy: req.user ? req.user.name : 'Citizen'
    });

    // Create Notification
    await Notification.create({
      ticketId,
      title: `${ticketId} Created`,
      message: `Your complaint "${title}" has been submitted successfully to SmartCivic.`,
      time: 'Just now',
      unread: true,
      isNew: true,
      user: req.user ? req.user._id : null
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints (Public/Citizen)
// @route   GET /api/complaints
// @access  Public
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's reported complaints
// @route   GET /api/complaints/user
// @access  Private
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint by Ticket ID or MongoDB _id
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = async (req, res) => {
  try {
    const param = req.params.id;
    let complaint;

    if (param.startsWith('SC-')) {
      complaint = await Complaint.findOne({ ticketId: param });
    } else {
      complaint = await Complaint.findById(param);
    }

    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track complaint by ticketId (Search)
// @route   GET /api/complaints/track/:searchId
// @access  Public
const trackComplaint = async (req, res) => {
  try {
    const searchId = req.params.searchId.trim();
    const complaint = await Complaint.findOne({
      $or: [
        { ticketId: new RegExp(`^${searchId}$`, 'i') },
        { _id: mongoose.isValidObjectId(searchId) ? searchId : null }
      ]
    });

    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: `Complaint ticket "${searchId}" not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote a complaint
// @route   PUT /api/complaints/:id/upvote
// @access  Private
const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [{ ticketId: req.params.id }, { _id: req.params.id }]
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const userIdStr = req.user._id.toString();
    const hasUpvoted = complaint.upvotedBy.includes(userIdStr);

    if (hasUpvoted) {
      complaint.upvotedBy = complaint.upvotedBy.filter(id => id !== userIdStr);
      complaint.upvotes = Math.max(0, complaint.upvotes - 1);
    } else {
      complaint.upvotedBy.push(userIdStr);
      complaint.upvotes += 1;
    }

    await complaint.save();

    res.json({
      message: hasUpvoted ? 'Upvote removed' : 'Upvote recorded',
      upvotes: complaint.upvotes,
      hasUpvoted: !hasUpvoted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [{ ticketId: req.params.id }, { _id: req.params.id }]
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.createdBy && complaint.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getUserComplaints,
  getComplaintById,
  trackComplaint,
  upvoteComplaint,
  deleteComplaint
};
