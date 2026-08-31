const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: 'Just now'
    },
    unread: {
      type: Boolean,
      default: true
    },
    isNew: {
      type: Boolean,
      default: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
