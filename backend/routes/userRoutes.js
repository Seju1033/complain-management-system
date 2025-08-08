const express = require('express');
const router = express.Router();
const { submitComplaint, getMyComplaints, getComplaintById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Employee-specific complaint actions
router.route('/complaints').post(protect, submitComplaint); // Submit new complaint
router.route('/mycomplaints').get(protect, getMyComplaints); // View own complaints
router.route('/complaints/:id').get(protect, getComplaintById); // View specific complaint details

module.exports = router;