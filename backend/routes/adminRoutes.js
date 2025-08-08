const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    addAdminReply,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import protect and admin middleware

// User management routes (Admin only)
router.route('/users').get(protect, admin, getAllUsers);
router
    .route('/users/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

// Complaint management routes (Admin only)
router.route('/complaints').get(protect, admin, getAllComplaints);
router.route('/complaints/:id').get(protect, admin, getComplaintById);
router.route('/complaints/:id/status').put(protect, admin, updateComplaintStatus);
router.route('/complaints/:id/assign').put(protect, admin, assignComplaint);
router.route('/complaints/:id/reply').post(protect, admin, addAdminReply);


module.exports = router;