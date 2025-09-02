const mongoose = require('mongoose');

const dashboardStatSchema = new mongoose.Schema({
  title: String,
  value: Number,
});

module.exports = mongoose.model('DashboardStat', dashboardStatSchema);
