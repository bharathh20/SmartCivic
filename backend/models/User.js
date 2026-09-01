const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    mobile: {
      type: String,
      default: '+91 98765 43210'
    },
    address: {
      type: String,
      default: 'Indiranagar, Bengaluru'
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['citizen', 'admin', 'dept_officer'],
      default: 'citizen'
    },
    badge: {
      type: String,
      default: 'VERIFIED CITIZEN'
    },
    zone: {
      type: String,
      default: 'Bengaluru Municipal Zone C'
    },
    memberSince: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
