const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new citizen user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, mobile, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email and password' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const memberSinceStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const user = await User.create({
      name: fullName,
      email,
      password,
      mobile: mobile || '+91 98765 43210',
      address: address || '123, 5th Cross, Indiranagar, Bengaluru 560038',
      avatar: req.body.avatar || '',
      memberSince: memberSinceStr,
      role: 'citizen'
    });

    if (user) {
      const token = generateToken(user._id);
      const formattedMemberSince = user.memberSince || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : memberSinceStr);
      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          address: user.address,
          avatar: user.avatar || '',
          badge: user.badge,
          zone: user.zone,
          memberSince: formattedMemberSince,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get JWT token (Follows PPT spec)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const formattedMemberSince = user.memberSince || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          address: user.address,
          avatar: user.avatar || '',
          badge: user.badge,
          zone: user.zone,
          memberSince: formattedMemberSince,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const formattedMemberSince = user.memberSince || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          address: user.address,
          avatar: user.avatar || '',
          badge: user.badge,
          zone: user.zone,
          memberSince: formattedMemberSince,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.mobile = req.body.mobile || user.mobile;
      user.address = req.body.address || user.address;
      if (req.body.avatar !== undefined) {
        user.avatar = req.body.avatar;
      }

      const updatedUser = await user.save();
      const formattedMemberSince = updatedUser.memberSince || (updatedUser.createdAt ? new Date(updatedUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

      res.json({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          mobile: updatedUser.mobile,
          address: updatedUser.address,
          avatar: updatedUser.avatar || '',
          badge: updatedUser.badge,
          zone: updatedUser.zone,
          memberSince: formattedMemberSince,
          createdAt: updatedUser.createdAt
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword
};
