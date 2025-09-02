const User = require('../models/User');

const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true });
    res.status(200).json({ success: true, activeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching active users', error });
  }
};

module.exports = {
  getActiveUsers,
};
