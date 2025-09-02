const express = require('express');
const router = express.Router();
const { getActiveUsers } = require('../controllers/dashboardController');

router.get('/active-users', getActiveUsers);

module.exports = router;
