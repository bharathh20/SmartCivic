const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Roads & Potholes'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    department: {
      type: String,
      default: 'PWD'
    },
    status: {
      type: String,
      enum: ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted'
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    estResolution: {
      type: String,
      default: 'Pending Dispatch Triage'
    },
    assignedOfficer: {
      type: String,
      default: 'Pending Assignment'
    },
    officerRole: {
      type: String,
      default: 'Triage Inspector'
    },
    location: {
      type: String,
      required: [true, 'Location coordinates or landmark required']
    },
    address: {
      type: String,
      default: 'Indiranagar, Bengaluru'
    },
    latitude: {
      type: Number,
      default: 12.9716
    },
    longitude: {
      type: Number,
      default: 77.5946
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required']
    },
    upvotes: {
      type: Number,
      default: 1
    },
    upvotedBy: [
      {
        type: String
      }
    ],
    images: [
      {
        type: String
      }
    ],
    timeline: [timelineItemSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedBy: {
      type: String,
      default: 'Citizen'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
